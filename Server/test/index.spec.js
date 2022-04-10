import app from '../source/app.js';
import supertest from 'supertest';
import { expect } from 'chai';
let data = { _id: '123abc', text: 'test value' }

describe('API unit test for getFacts and addFacts', () => {
  it('should GET /api/getFacts', async () => {
    const response = await supertest(app).get('/api/getFacts')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(Array.isArray(response.body)).to.equal(true);
  })
  it('should POST /api/addFacts', async () => {
    const response = await supertest(app).post('/api/addFacts')
      .set('Accept', 'application/json')
      .send(data)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(Array.isArray(response.body)).to.equal(false);
    expect(typeof response.body).to.equal('object');
    expect(response.body._id).to.equal(data._id);
    expect(response.body.text).to.equal(data.text);
  })
})

describe('API unit test for updateFacts and deleteFacts', () => {
  it('should POST /api/updateFacts', async () => {
    const response = await supertest(app).post('/api/updateFacts')
      .set('Accept', 'application/json')
      .send({ _id: data._id, text: 'new value' })
      .expect('Content-Type', /json/)
      .expect(200);
    expect(Array.isArray(response.body)).to.equal(true);
    const newFact = response.body.find(fact => fact._id === data._id)
    expect(newFact.text).to.equal('new value');

  })
  it('should POST /api/deleteFacts', async () => {
    const response = await supertest(app).post('/api/deleteFacts')
      .send({ id: data._id })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(Array.isArray(response.body)).to.equal(true);
  })
})

describe('Error tests', () => {
  it('should return 404 for routes not found', async () => {
    await supertest(app).get('/hello')
      .expect(404);
  })
  it('should return 400 for empty desccription when updating', async () => {
    await supertest(app).post('/api/updateFacts')
      .set('Accept', 'application/json')
      .send({ text: '' })
      .expect('Content-Type', /json/)
      .expect(400);
  })
  it('should return 400 for empty description when adding', async () => {
    await supertest(app).post('/api/addFacts')
      .set('Accept', 'application/json')
      .send({ text: '' })
      .expect('Content-Type', /json/)
      .expect(400);
  })
})