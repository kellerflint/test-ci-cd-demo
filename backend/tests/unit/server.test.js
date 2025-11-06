const { app } = require('../../server');

describe('Server Unit Tests', () => {
  test('Health check endpoint returns ok', async () => {
    const request = require('supertest');
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  test('POST /api/items returns 400 without name', async () => {
    const request = require('supertest');
    const response = await request(app)
      .post('/api/items')
      .send({});
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Name is required');
  });
});
