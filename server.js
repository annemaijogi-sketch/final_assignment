const express = require('express');
const db = require('./db');

const app = express();
app.use(express.json());

// ✅ GET – kõik ülesanded
app.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM todo ORDER BY id');
    res.json({ todo: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ✅ POST – lisa uus ülesanne
app.post('/', async (req, res) => {
  try {
    const { task } = req.body;

    if (!task) {
      return res.status(400).json({ error: 'Task is required' });
    }

    await db.query(
      'INSERT INTO todo (task) VALUES ($1)',
      [task]
    );

    res.json({ message: '1 row inserted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ✅ DELETE – kustuta ID järgi
app.delete('/', async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    await db.query(
      'DELETE FROM todo WHERE id = $1',
      [id]
    );

    res.json({ message: '1 row was deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 🔥 RENDER PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
