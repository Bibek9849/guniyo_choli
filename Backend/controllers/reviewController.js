const Review = require("../models/reviewModel");

const submitReview = async (req, res) => {
  const { rating } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, message: "Invalid rating" });
  }

  try {
    const review = new Review({ rating });
    await review.save();

    res.status(201).json({
      success: true,
      message: "Thank you for your review!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  submitReview,
};
