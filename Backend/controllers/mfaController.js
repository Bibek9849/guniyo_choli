const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const crypto = require('crypto');
const userModel = require('../models/userModels');

// Generate MFA secret and QR code for user
const setupMFA = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `Guniyo Choli (${user.email})`,
      issuer: 'Guniyo Choli',
      length: 32
    });

    // Generate backup codes
    const backupCodes = [];
    for (let i = 0; i < 10; i++) {
      backupCodes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
    }

    // Save secret to user (but don't enable MFA yet)
    user.mfaSecret = secret.base32;
    user.mfaBackupCodes = backupCodes;
    await user.save();

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    res.json({
      success: true,
      message: 'MFA setup initiated',
      data: {
        secret: secret.base32,
        qrCode: qrCodeUrl,
        backupCodes: backupCodes,
        manualEntryKey: secret.base32
      }
    });

  } catch (error) {
    console.error('MFA setup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Verify MFA token and enable MFA
const verifyAndEnableMFA = async (req, res) => {
  try {
    const userId = req.user.id;
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'MFA token is required'
      });
    }

    const user = await userModel.findById(userId);
    if (!user || !user.mfaSecret) {
      return res.status(400).json({
        success: false,
        message: 'MFA not set up for this user'
      });
    }

    // Verify the token
    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token: token,
      window: 2 // Allow 2 time steps of tolerance
    });

    if (!verified) {
      return res.status(400).json({
        success: false,
        message: 'Invalid MFA token'
      });
    }

    // Enable MFA
    user.mfaEnabled = true;
    user.lastMfaVerification = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'MFA enabled successfully'
    });

  } catch (error) {
    console.error('MFA verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Verify MFA token during login
const verifyMFAToken = async (req, res) => {
  try {
    const { email, token, backupCode } = req.body;

    if (!email || (!token && !backupCode)) {
      return res.status(400).json({
        success: false,
        message: 'Email and either MFA token or backup code are required'
      });
    }

    const user = await userModel.findOne({ email });
    if (!user || !user.mfaEnabled) {
      return res.status(400).json({
        success: false,
        message: 'MFA not enabled for this user'
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
    } else if (token) {
      // Verify TOTP token
      verified = speakeasy.totp.verify({
        secret: user.mfaSecret,
        encoding: 'base32',
        token: token,
        window: 2
      });
    }

    if (!verified) {
      return res.status(400).json({
        success: false,
        message: 'Invalid MFA token or backup code'
      });
    }

    // Update last verification time
    user.lastMfaVerification = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'MFA verification successful',
      remainingBackupCodes: user.mfaBackupCodes.length
    });

  } catch (error) {
    console.error('MFA token verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Disable MFA
const disableMFA = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password, token } = req.body;

    if (!password || !token) {
      return res.status(400).json({
        success: false,
        message: 'Password and MFA token are required'
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify password
    const bcrypt = require('bcryptjs');
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: 'Invalid password'
      });
    }

    // Verify MFA token
    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token: token,
      window: 2
    });

    if (!verified) {
      return res.status(400).json({
        success: false,
        message: 'Invalid MFA token'
      });
    }

    // Disable MFA
    user.mfaEnabled = false;
    user.mfaSecret = null;
    user.mfaBackupCodes = [];
    user.lastMfaVerification = null;
    await user.save();

    res.json({
      success: true,
      message: 'MFA disabled successfully'
    });

  } catch (error) {
    console.error('MFA disable error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get MFA status
const getMFAStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId).select('mfaEnabled mfaBackupCodes');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        mfaEnabled: user.mfaEnabled,
        backupCodesRemaining: user.mfaBackupCodes ? user.mfaBackupCodes.length : 0
      }
    });

  } catch (error) {
    console.error('MFA status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Generate new backup codes
const generateNewBackupCodes = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password, token } = req.body;

    if (!password || !token) {
      return res.status(400).json({
        success: false,
        message: 'Password and MFA token are required'
      });
    }

    const user = await userModel.findById(userId);
    if (!user || !user.mfaEnabled) {
      return res.status(400).json({
        success: false,
        message: 'MFA not enabled for this user'
      });
    }

    // Verify password
    const bcrypt = require('bcryptjs');
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: 'Invalid password'
      });
    }

    // Verify MFA token
    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token: token,
      window: 2
    });

    if (!verified) {
      return res.status(400).json({
        success: false,
        message: 'Invalid MFA token'
      });
    }

    // Generate new backup codes
    const backupCodes = [];
    for (let i = 0; i < 10; i++) {
      backupCodes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
    }

    user.mfaBackupCodes = backupCodes;
    await user.save();

    res.json({
      success: true,
      message: 'New backup codes generated',
      data: {
        backupCodes: backupCodes
      }
    });

  } catch (error) {
    console.error('Backup codes generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  setupMFA,
  verifyAndEnableMFA,
  verifyMFAToken,
  disableMFA,
  getMFAStatus,
  generateNewBackupCodes
};
