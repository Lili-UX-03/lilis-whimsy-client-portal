require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const clientRoutes = require('./routes/clients');
const taskRoutes = require('./routes/tasks');
const messageRoutes = require('./routes/messages');

app.use('/api/clients', clientRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/messages', messageRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

// Initialize database and start server
const PORT = process.env.PORT || 5000;

db.init().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
