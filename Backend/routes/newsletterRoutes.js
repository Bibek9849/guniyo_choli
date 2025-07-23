const express = require('express');
const { subscribe } = require('../controllers/newsletterController');
const router = express.Router();

// Newsletter subscription endpoint
router.post('/subscribe', subscribe);

module.exports = router;
