const userModel = require('../models/userModels');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

// Get user's personal data (GDPR Article 15 - Right of Access)
const getPersonalData = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await userModel.findById(userId)
      .select('-password -mfaSecret -passwordHistory')
      .populate('cart.product', 'productName productPrice');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prepare comprehensive data export
    const personalData = {
      accountInformation: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        isVerified: user.isVerified,
        mfaEnabled: user.mfaEnabled,
        passwordStrength: user.passwordStrength,
        accountCreated: user.createdAt || 'Not available',
        lastLogin: user.lastMfaVerification || 'Not available'
      },
      shoppingData: {
        cart: user.cart || [],
        orderHistory: [], // Will be populated if order model exists
      },
      securityInformation: {
        mfaEnabled: user.mfaEnabled,
        passwordLastChanged: user.passwordCreatedAt,
        emailVerificationStatus: user.isVerified,
        backupCodesRemaining: user.mfaBackupCodes ? user.mfaBackupCodes.length : 0
      },
      dataProcessingInfo: {
        dataCollected: [
          'Name and contact information',
          'Account credentials (encrypted)',
          'Shopping cart and order history',
          'Security preferences (MFA settings)',
          'Login and activity logs'
        ],
        purposeOfProcessing: [
          'Account management and authentication',
          'Order processing and fulfillment',
          'Security and fraud prevention',
          'Customer support',
          'Legal compliance'
        ],
        dataRetentionPeriod: '7 years after account closure or as required by law',
        legalBasis: 'Contract performance, legitimate interests, legal compliance'
      },
      yourRights: {
        access: 'You can request access to your personal data',
        rectification: 'You can request correction of inaccurate data',
        erasure: 'You can request deletion of your data (right to be forgotten)',
        portability: 'You can request data in a portable format',
        restriction: 'You can request restriction of processing',
        objection: 'You can object to certain types of processing',
        withdraw: 'You can withdraw consent where applicable'
      }
    };

    res.json({
      success: true,
      message: 'Personal data retrieved successfully',
      data: personalData,
      exportedAt: new Date().toISOString(),
      format: 'JSON'
    });

  } catch (error) {
    console.error('Personal data retrieval error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Export user data in portable format (GDPR Article 20 - Right to Data Portability)
const exportUserData = async (req, res) => {
  try {
    const userId = req.user.id;
    const { format = 'json' } = req.query;

    const user = await userModel.findById(userId)
      .select('-password -mfaSecret -passwordHistory')
      .populate('cart.product', 'productName productPrice');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const exportData = {
      exportInfo: {
        userId: user._id,
        exportDate: new Date().toISOString(),
        format: format,
        version: '1.0'
      },
      userData: {
        profile: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          accountCreated: user.createdAt
        },
        preferences: {
          mfaEnabled: user.mfaEnabled,
          emailVerified: user.isVerified
        },
        shoppingData: {
          cart: user.cart
        }
      }
    };

    if (format.toLowerCase() === 'csv') {
      // Convert to CSV format
      const csvData = convertToCSV(exportData);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="user-data-${userId}-${Date.now()}.csv"`);
      return res.send(csvData);
    }

    // Default JSON format
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="user-data-${userId}-${Date.now()}.json"`);
    res.json(exportData);

  } catch (error) {
    console.error('Data export error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update personal data (GDPR Article 16 - Right to Rectification)
const updatePersonalData = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, phone } = req.body;

    // Only allow updating specific fields
    const allowedUpdates = {};
    if (firstName) allowedUpdates.firstName = firstName;
    if (lastName) allowedUpdates.lastName = lastName;
    if (phone) allowedUpdates.phone = phone;

    if (Object.keys(allowedUpdates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    const user = await userModel.findByIdAndUpdate(
      userId,
      allowedUpdates,
      { new: true, runValidators: true }
    ).select('-password -mfaSecret -passwordHistory');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Personal data updated successfully',
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone
      }
    });

  } catch (error) {
    console.error('Personal data update error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete user account and all associated data (GDPR Article 17 - Right to Erasure)
const deleteUserAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password, confirmDeletion } = req.body;

    if (!password || confirmDeletion !== 'DELETE_MY_ACCOUNT') {
      return res.status(400).json({
        success: false,
        message: 'Password and confirmation text "DELETE_MY_ACCOUNT" are required'
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

    // Create deletion log for compliance
    const deletionLog = {
      userId: user._id,
      email: user.email,
      deletionDate: new Date(),
      deletionReason: 'User requested account deletion (Right to Erasure)',
      dataRetained: 'Minimal data retained for legal compliance (7 years)',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    };

    // In a real application, you might want to:
    // 1. Anonymize data instead of complete deletion
    // 2. Keep transaction records for legal/tax purposes
    // 3. Log the deletion for audit purposes

    // For this implementation, we'll soft delete by anonymizing
    const anonymizedData = {
      firstName: 'DELETED',
      lastName: 'USER',
      email: `deleted_${crypto.randomBytes(8).toString('hex')}@deleted.com`,
      phone: 0,
      password: 'DELETED',
      isVerified: false,
      mfaEnabled: false,
      mfaSecret: null,
      mfaBackupCodes: [],
      passwordHistory: [],
      cart: [],
      emailToken: null,
      deletedAt: new Date(),
      deletionReason: 'User requested deletion'
    };

    await userModel.findByIdAndUpdate(userId, anonymizedData);

    // Log deletion (in production, store this in a separate audit log)
    console.log('Account deletion:', deletionLog);

    res.json({
      success: true,
      message: 'Account deleted successfully. Your data has been anonymized and removed from our systems.',
      deletionId: crypto.randomBytes(16).toString('hex'),
      deletionDate: new Date().toISOString()
    });

  } catch (error) {
    console.error('Account deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Restrict data processing (GDPR Article 18 - Right to Restriction)
const restrictDataProcessing = async (req, res) => {
  try {
    const userId = req.user.id;
    const { restrictionType, reason } = req.body;

    const validRestrictions = ['marketing', 'analytics', 'profiling', 'all'];
    if (!restrictionType || !validRestrictions.includes(restrictionType)) {
      return res.status(400).json({
        success: false,
        message: 'Valid restriction type is required',
        validTypes: validRestrictions
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Initialize privacy settings if not exists
    if (!user.privacySettings) {
      user.privacySettings = {};
    }

    // Set restriction
    user.privacySettings[`restrict_${restrictionType}`] = {
      restricted: true,
      reason: reason || 'User requested restriction',
      restrictedAt: new Date()
    };

    await user.save();

    res.json({
      success: true,
      message: `Data processing restriction applied for: ${restrictionType}`,
      restrictions: user.privacySettings
    });

  } catch (error) {
    console.error('Data restriction error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get privacy settings and consent status
const getPrivacySettings = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await userModel.findById(userId)
      .select('privacySettings consentSettings');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const privacyInfo = {
      privacySettings: user.privacySettings || {},
      consentSettings: user.consentSettings || {},
      dataProcessingRestrictions: {
        marketing: user.privacySettings?.restrict_marketing?.restricted || false,
        analytics: user.privacySettings?.restrict_analytics?.restricted || false,
        profiling: user.privacySettings?.restrict_profiling?.restricted || false
      },
      yourRights: {
        access: 'Request access to your personal data',
        rectification: 'Correct inaccurate personal data',
        erasure: 'Request deletion of your personal data',
        portability: 'Receive your data in a portable format',
        restriction: 'Restrict processing of your data',
        objection: 'Object to processing based on legitimate interests'
      }
    };

    res.json({
      success: true,
      data: privacyInfo
    });

  } catch (error) {
    console.error('Privacy settings retrieval error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Helper function to convert data to CSV
const convertToCSV = (data) => {
  const flattenObject = (obj, prefix = '') => {
    let flattened = {};
    for (let key in obj) {
      if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        Object.assign(flattened, flattenObject(obj[key], prefix + key + '_'));
      } else {
        flattened[prefix + key] = obj[key];
      }
    }
    return flattened;
  };

  const flattened = flattenObject(data);
  const headers = Object.keys(flattened).join(',');
  const values = Object.values(flattened).map(val => 
    typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
  ).join(',');
  
  return headers + '\n' + values;
};

module.exports = {
  getPersonalData,
  exportUserData,
  updatePersonalData,
  deleteUserAccount,
  restrictDataProcessing,
  getPrivacySettings
};
