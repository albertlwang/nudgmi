//// START THE SERVER ////////////////////////////////////////////

// Load environment vars
require('dotenv').config();

// Import Express app from app.js
const app = require('./app');

// Start listening on a port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Import cron job for polling
require('./jobs/rssPoller');