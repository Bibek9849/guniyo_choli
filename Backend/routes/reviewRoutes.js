const express = require("express");
const { submitReview } = require("../controllers/reviewController");
const router = express.Router();

// Submit review
router.post("/", submitReview);

module.exports = router;
