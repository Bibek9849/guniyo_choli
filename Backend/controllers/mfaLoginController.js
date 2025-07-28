const userModel = require('../models/userModels');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const { handleSuccessfulLogin } = require('../middleware/rateLimiter');

// Complete login with MFA verification
const completeMFALogin = async (req, res) => {
  try {
    const { email, mfaToken, backupCode } = req.body;

    if (!email || (!mfaToken && !backupCode)) {
      return res.status(400).json({
        success: false,
        message: 'Email and either MFA token or backup code are required'
      });
    }

    const user = await userModel.findOne({ email });
    if (!user || !user.mfaEnabled) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request or MFA not enabled'
      });
    }

    let verified = false;

    if (backupCode) {
      // Verify backup code
      const codeIndex = user.mfaBackupCodes.indexOf(backupCode.toUpperCase());
      if (codeIndex !== -1) {
        // Remove used backup code
        user.mfaBackupCodes.splice(codeIndex, 1);
        verified = true;
      }
    } else if (mfaToken) {
      // Verify TOTP token
      verified = speakeasy.totp.verify({
        secret: user.mfaSecret,
        encoding: 'base32',
        token: mfaToken,
        window: 2
      });
    }

    if (!verified) {
      return res.status(400).json({
        success: false,
        message: 'Invalid MFA token or backup code'
      });
    }

    // Update last verification time and save user
    user.lastMfaVerification = new Date();
    await user.save();

    // Track successful login (clears any lockout)
    handleSuccessfulLogin(email);

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET
    );

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      userData: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin,
        mfaEnabled: user.mfaEnabled
      },
      remainingBackupCodes: user.mfaBackupCodes.length
    });

  } catch (error) {
    console.error('MFA login completion error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  completeMFALogin
};
