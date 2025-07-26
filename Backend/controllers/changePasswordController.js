// controllers/userController.js
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

exports.changePassword = async (req, res) => {
  const userId = req.user._id; // from protect middleware
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Please provide current and new passwords' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Check if current password matches
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Current password is incorrect' });

    // Hash new password and save
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
