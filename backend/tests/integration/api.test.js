const request = require('supertest');
const mysql = require('mysql2/promise');
const { app, initDb } = require('../../server');

let db;

beforeAll(async () => {
  // Connect to test database
  db = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'rootpassword',
    database: process.env.DB_NAME || 'testdb'
  });

  // Initialize the app database connection
  await initDb();

  // Clear test data
  await db.query('DELETE FROM items WHERE name LIKE "Test%"');
});

afterAll(async () => {
  // Clean up
  await db.query('DELETE FROM items WHERE name LIKE "Test%"');
  await db.end();
});

describe('Backend Integration Tests', () => {
  test('GET /api/items returns items', async () => {
    const response = await request(app).get('/api/items');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('POST /api/items creates a new item', async () => {
    const newItem = { name: 'Test Item' };
    const response = await request(app)
      .post('/api/items')
      .send(newItem);
    
    expect(response.status).toBe(201);
    expect(response.body.name).toBe(newItem.name);
    expect(response.body.id).toBeDefined();

    // Verify it was created
    const [rows] = await db.query('SELECT * FROM items WHERE id = ?', [response.body.id]);
    expect(rows.length).toBe(1);
    expect(rows[0].name).toBe(newItem.name);
  });

  test('Full workflow: create and read item', async () => {
    // Create item
    const createResponse = await request(app)
      .post('/api/items')
      .send({ name: 'Test Workflow Item' });
    
    expect(createResponse.status).toBe(201);
    const itemId = createResponse.body.id;

    // Read items
    const getResponse = await request(app).get('/api/items');
    expect(getResponse.status).toBe(200);
    
    const foundItem = getResponse.body.find(item => item.id === itemId);
    expect(foundItem).toBeDefined();
    expect(foundItem.name).toBe('Test Workflow Item');
  });
});
