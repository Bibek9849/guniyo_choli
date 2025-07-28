const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const {
  setupMFA,
  verifyAndEnableMFA,
  verifyMFAToken,
  disableMFA,
  getMFAStatus,
  generateNewBackupCodes
} = require('../controllers/mfaController');
const { completeMFALogin } = require('../controllers/mfaLoginController');

// Setup MFA (generate QR code and secret)
router.post('/setup', protect, setupMFA);

// Verify MFA token and enable MFA
router.post('/verify-enable', protect, verifyAndEnableMFA);

// Verify MFA token during login
router.post('/verify-login', verifyMFAToken);

// Complete login with MFA verification
router.post('/complete-login', completeMFALogin);

// Disable MFA
router.post('/disable', protect, disableMFA);

// Get MFA status
router.get('/status', protect, getMFAStatus);

// Generate new backup codes
router.post('/backup-codes', protect, generateNewBackupCodes);

module.exports = router;
