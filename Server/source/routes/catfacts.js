'use strict'

import { Router } from 'express';
import crypto from 'crypto';
import handler from './handlers/catfactsHandler.js';
import config from '../../config.js';
import db from '../database/index.js';

const router = Router();

// Helper function to get facts from API or DB
const getFacts = async () => {
  // Check db for records
  let result = await db.getFacts();
  // If empty, fetch from API
  if (!result) {
    result = await handler.getListFromAPI();
    //save result to db
    for (let fact of result) {
      await db.saveFacts(fact);
    }
  } else {
    //parse db result to proper json
    result = result.map((list) => {
      list.status = { verified: list.verified, feedback: list.feedback, sentCount: list.sentCount };
      delete list.verified;
      delete list.feedback;
      delete list.sentCount;
      return list;
    })
  }
  return result;
}
// API route /getFacts, responds with json result of facts
router.get(
  '/getFacts',
  async (req, res, next) => {
    try {
      const result = await getFacts();
      // Call handler to response with data
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
)

// API route /addFacts, adds new fact to the DB, returns the added fact as json
router.post(
  '/addFacts',
  async (req, res, next) => {
    if (!req.body || !req.body.text) {
      return res.status(400).json({ error: 'Empty descripton' });
    }
    try {
      let fact = { ...config.defaultFact };
      fact._id = req.body._id || crypto.randomBytes(12).toString('hex');
      fact.user = crypto.randomBytes(12).toString('hex');
      fact.text = req.body.text;
      await db.upsertFacts(fact);
      // Call handler to response with data
      res.status(200).json(fact);
    } catch (err) {
      next(err);
    }
  }
)

// API route /updateFacts, updates a fact
router.post(
  '/updateFacts',
  async (req, res, next) => {
    if (!req.body || !req.body.text) {
      return res.status(400).json({ error: 'Empty descripton' });
    }
    try {
      let result = await db.upsertFacts(req.body, true);
      result = await getFacts();
      // Call handler to response with data
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
)

// API route /deleteFacts, delete a fact using _id
router.post(
  '/deleteFacts',
  async (req, res, next) => {
    if (!req.body || !req.body.id) {
      return res.status(400).json({ error: 'invalid id' });
    }
    try {
      let result = await db.deleteFacts(req.body.id);
      result = await getFacts();
      // Call handler to response with data
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
)
export default router;