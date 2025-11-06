const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let db;

// Database connection
async function initDb() {
  db = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'rootpassword',
    database: process.env.DB_NAME || 'testdb'
  });
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get all items
app.get('/api/items', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM items ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create item
app.post('/api/items', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const [result] = await db.query('INSERT INTO items (name) VALUES (?)', [name]);
    res.status(201).json({ id: result.insertId, name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;

// Start server only if not in test mode
if (process.env.NODE_ENV !== 'test') {
  initDb().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }).catch(err => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  });
}

module.exports = { app, initDb };
