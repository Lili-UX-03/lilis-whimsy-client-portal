const express = require('express');
const db = require('../database');
const router = express.Router();

// Get all tasks for a client
router.get('/client/:client_id', async (req, res) => {
  try {
    const tasks = await db.all(
      'SELECT * FROM tasks WHERE client_id = ? ORDER BY created_at DESC',
      [req.params.client_id]
    );
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new task
router.post('/', async (req, res) => {
  try {
    const { client_id, title, description, due_date } = req.body;

    if (!client_id || !title) {
      return res.status(400).json({ error: 'Client ID and title are required' });
    }

    const result = await db.run(
      'INSERT INTO tasks (client_id, title, description, due_date, status) VALUES (?, ?, ?, ?, ?)',
      [client_id, title, description, due_date, 'pending']
    );

    res.status(201).json({ id: result.id, message: 'Task created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update task status
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;

    if (status === 'completed') {
      await db.run(
        'UPDATE tasks SET status = ?, completed_at = CURRENT_TIMESTAMP WHERE id = ?',
        [status, req.params.id]
      );
    } else {
      await db.run(
        'UPDATE tasks SET status = ? WHERE id = ?',
        [status, req.params.id]
      );
    }

    res.json({ message: 'Task updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    await db.run('DELETE FROM tasks WHERE id = ?', [req.params.id]);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
