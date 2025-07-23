const express = require('express');
const { saveMessage } = require('../controllers/contactController');

const router = express.Router();

// POST route to handle contact form submission
router.post('/send-message', saveMessage);

module.exports = router;
