//// Set up the Express app ////////////////////////////////////////////

// Import Express (from node dependencies)
const express = require('express');
const app = express();

// Add middleware (for parsing incoming JSON -- APIs) app.use(express.json());
const cors = require('cors');
app.use(cors());  
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Content Alert API!');
});

// Define a test route -> see if server is running ok
app.get('/health', (req, res) => {
    res.send('OK');
});

// Import and mount routes
const authRoutes = require('./routes/auth');
const feedRoutes = require('./routes/feed');
const subscriptionsRoutes = require('./routes/subscriptions');

app.use('/api', authRoutes); // /api/register
app.use('/api', feedRoutes); // /api/feed
app.use('/api', subscriptionsRoutes); // /api/subscriptions

module.exports = app;