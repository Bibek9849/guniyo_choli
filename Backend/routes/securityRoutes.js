const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { adminGuard } = require('../middleware/authGuard');
const {
  runSecurityTests,
  runVulnerabilityScan,
  generateAuditReport,
  getSecurityDashboard,
  logSecurityEvent
} = require('../controllers/securityController');

// Security dashboard (admin only)
router.get('/dashboard', protect, adminGuard, getSecurityDashboard);

// Run comprehensive security tests (admin only)
router.post('/tests', protect, adminGuard, runSecurityTests);

// Run vulnerability scan (admin only)
router.post('/scan', protect, adminGuard, runVulnerabilityScan);

// Generate security audit report (admin only)
router.get('/audit-report', protect, adminGuard, generateAuditReport);

// Log security event (authenticated users)
router.post('/log-event', protect, logSecurityEvent);

module.exports = router;
