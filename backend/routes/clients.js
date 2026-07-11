const express = require('express');
const db = require('../database');
const router = express.Router();

// Get all clients
router.get('/', async (req, res) => {
  try {
    const clients = await db.all('SELECT * FROM clients ORDER BY created_at DESC');
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single client
router.get('/:id', async (req, res) => {
  try {
    const client = await db.get('SELECT * FROM clients WHERE id = ?', [req.params.id]);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json(client);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new client (from onboarding form)
router.post('/', async (req, res) => {
  try {
    const { name, business_name, email, phone, preferred_contact, service_needed } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const result = await db.run(
      'INSERT INTO clients (name, business_name, email, phone, preferred_contact, service_needed, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, business_name, email, phone, preferred_contact, service_needed, 'onboarding']
    );

    res.status(201).json({ id: result.id, message: 'Client created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update client status
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    
    await db.run(
      'UPDATE clients SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, req.params.id]
    );

    res.json({ message: 'Client updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
