'use strict'

import 'dotenv/config';
import Pg from 'pg';
import config from '../../config.js';

const pool = new Pg.Pool(config.db);
const dbfunctions = {}

const query = async (q, values = []) => {
    let result = false;
    try {
        const res = await pool.query(q, values);
        if (res.rowCount) {
            result = res.rows;
        }
    } catch (err) {
        throw err;
    }
    return result;
}

dbfunctions.getFacts = async () => {
    const res = await query("SELECT * from facts");
    return res;
}

dbfunctions.saveFacts = async (fact) => {
    const res = await query(
        `INSERT INTO facts("_id", "user", "used", "createdAt",
                "deleted", "source", "updatedAt", "text", "type", "verified",
                "feedback", "sentCount") 
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [fact._id, fact.user, fact.used, fact.createdAt, fact.deleted, fact.source,
        fact.updatedAt, fact.text, fact.type, fact.status.verified,
        fact.status.feedback || '', fact.status.sentCount || 0]);
    return res;
}
dbfunctions.upsertFacts = async (fact) => {
    let res = false;
    // check if record is found
    const record = await query("SELECT _id FROM facts WHERE _id = $1", [fact._id]);
    // if record not found, add it
    if (!record) {
        fact.createdAt = new Date();
        fact.updatedAt = new Date();
        res = await dbfunctions.saveFacts(fact);
    } else {
        // update record
        res = await query(
            `UPDATE facts SET 
            "updatedAt" = $1, "text" = $2
            WHERE "_id" = $3`,
            [new Date(), fact.text, fact._id]
        )
    }
    return res;
}

dbfunctions.deleteFacts = async (id) => {
    const res = await query("DELETE from facts WHERE _id = $1", [id]);
    return res;
}


export default dbfunctions;