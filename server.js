const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database('data.db');

app.use(express.json());
app.use(express.static('public')); // serve frontend files

// API route to handle POST requests
app.post('/api/messages', (req, res) => {
  const { name, message } = req.body;

  if (!name || !message) {
    return res.status(400).json({ error: 'Name and message are required' });
  }

  const stmt = db.prepare('INSERT INTO messages (name, message) VALUES (?, ?)');
  stmt.run(name, message, function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ id: this.lastID, name, message });
  });
  stmt.finalize();
});

app.listen(3000, () => console.log('Server running at http://localhost:3000'));
