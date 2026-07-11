const express = require('express');
const db = require('../database');
const router = express.Router();

// Get all messages for a client
router.get('/client/:client_id', async (req, res) => {
  try {
    const messages = await db.all(
      'SELECT * FROM messages WHERE client_id = ? ORDER BY created_at ASC',
      [req.params.client_id]
    );
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send message
router.post('/', async (req, res) => {
  try {
    const { client_id, sender, content } = req.body;

    if (!client_id || !sender || !content) {
      return res.status(400).json({ error: 'Client ID, sender, and content are required' });
    }

    const result = await db.run(
      'INSERT INTO messages (client_id, sender, content) VALUES (?, ?, ?)',
      [client_id, sender, content]
    );

    res.status(201).json({ id: result.id, message: 'Message sent successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
