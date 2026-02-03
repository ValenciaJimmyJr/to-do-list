// server/index.js
import express from 'express';
import cors from 'cors';
import { pool } from './db.js'; // make sure your db.js exports a Pool

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// --- ROUTES ---

// Get all items
app.get('/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Add a new item
app.post('/items', async (req, res) => {
  const { description, status } = req.body;

  if (!description) {
    return res.status(400).json({ error: 'Description is required' });
  }

  try {
    const id = uuidv4(); // generate UUID
    await pool.query(
      'INSERT INTO items (id, description, status) VALUES ($1, $2, $3)',
      [id, description, status || 'pending']
    );
    res.json({ message: 'Item added', id });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update an item
app.put('/items/:id', async (req, res) => {
  const { id } = req.params;
  const { description, status } = req.body;

  try {
    await pool.query(
      'UPDATE items SET description = $1, status = $2 WHERE id = $3',
      [description, status, id]
    );
    res.json({ message: 'Item updated' });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete an item
app.delete('/items/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM items WHERE id = $1', [id]);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
