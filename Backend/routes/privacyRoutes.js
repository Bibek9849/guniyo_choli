const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getPersonalData,
  exportUserData,
  updatePersonalData,
  deleteUserAccount,
  restrictDataProcessing,
  getPrivacySettings
} = require('../controllers/privacyController');

// Get personal data (GDPR Article 15 - Right of Access)
router.get('/data', protect, getPersonalData);

// Export user data (GDPR Article 20 - Right to Data Portability)
router.get('/export', protect, exportUserData);

// Update personal data (GDPR Article 16 - Right to Rectification)
router.put('/data', protect, updatePersonalData);

// Delete user account (GDPR Article 17 - Right to Erasure)
router.delete('/account', protect, deleteUserAccount);

// Restrict data processing (GDPR Article 18 - Right to Restriction)
router.post('/restrict', protect, restrictDataProcessing);

// Get privacy settings
router.get('/settings', protect, getPrivacySettings);

module.exports = router;
