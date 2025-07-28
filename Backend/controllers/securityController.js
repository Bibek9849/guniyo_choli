const { SecurityAuditor, SecurityTester, VulnerabilityScanner } = require('../security/securityAudit');

// Initialize security auditor
const auditor = new SecurityAuditor();

// Run comprehensive security tests
const runSecurityTests = async (req, res) => {
  try {
    // Only allow admin users to run security tests
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    console.log('Starting comprehensive security tests...');
    
    const testResults = await SecurityTester.runSecurityTests();
    
    // Log the security test execution
    await auditor.logSecurityEvent({
      category: 'SECURITY_TESTING',
      type: 'SECURITY_TESTS_EXECUTED',
      severity: 'MEDIUM',
      userId: req.user.id,
      testId: testResults.testId,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json({
      success: true,
      message: 'Security tests completed successfully',
      data: testResults
    });

  } catch (error) {
    console.error('Security test execution error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during security testing'
    });
  }
};

// Run vulnerability scan
const runVulnerabilityScan = async (req, res) => {
  try {
    // Only allow admin users to run vulnerability scans
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    console.log('Starting vulnerability scan...');
    
    const scanResults = await VulnerabilityScanner.scanForVulnerabilities();
    
    // Log the vulnerability scan execution
    await auditor.logSecurityEvent({
      category: 'SECURITY_TESTING',
      type: 'VULNERABILITY_SCAN_EXECUTED',
      severity: 'MEDIUM',
      userId: req.user.id,
      scanId: scanResults.scanId,
      vulnerabilitiesFound: scanResults.vulnerabilities.length,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json({
      success: true,
      message: 'Vulnerability scan completed successfully',
      data: scanResults
    });

  } catch (error) {
    console.error('Vulnerability scan error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during vulnerability scanning'
    });
  }
};

// Generate security audit report
const generateAuditReport = async (req, res) => {
  try {
    // Only allow admin users to generate audit reports
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format'
      });
    }

    console.log(`Generating audit report for period: ${start.toISOString()} to ${end.toISOString()}`);
    
    const auditReport = await auditor.generateAuditReport(start, end);
    
    // Log the audit report generation
    await auditor.logSecurityEvent({
      category: 'SECURITY_AUDIT',
      type: 'AUDIT_REPORT_GENERATED',
      severity: 'MEDIUM',
      userId: req.user.id,
      reportId: auditReport.reportId,
      period: auditReport.period,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json({
      success: true,
      message: 'Audit report generated successfully',
      data: auditReport
    });

  } catch (error) {
    console.error('Audit report generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during audit report generation'
    });
  }
};

// Get security dashboard data
const getSecurityDashboard = async (req, res) => {
  try {
    // Only allow admin users to view security dashboard
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    // Get recent security events (last 24 hours)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const today = new Date();
    
    const recentAuditReport = await auditor.generateAuditReport(yesterday, today);
    
    // Run quick security assessment
    const quickTests = await SecurityTester.runSecurityTests();
    const vulnerabilityScan = await VulnerabilityScanner.scanForVulnerabilities();

    const dashboardData = {
      overview: {
        securityScore: this.calculateSecurityScore(quickTests, vulnerabilityScan),
        lastScanDate: new Date().toISOString(),
        criticalIssues: vulnerabilityScan.summary.critical,
        highIssues: vulnerabilityScan.summary.high,
        mediumIssues: vulnerabilityScan.summary.medium
      },
      recentActivity: {
        totalEvents: recentAuditReport.summary.totalEvents,
        securityViolations: recentAuditReport.summary.bySeverity.HIGH || 0,
        failedLogins: recentAuditReport.summary.topEvents.LOGIN_FAILED || 0,
        successfulLogins: recentAuditReport.summary.topEvents.LOGIN_SUCCESS || 0
      },
      securityFeatures: {
        mfaEnabled: true,
        bruteForceProtection: true,
        passwordPolicy: true,
        privacyControls: true,
        securityHeaders: true,
        inputValidation: true,
        auditLogging: true
      },
      recommendations: recentAuditReport.recommendations
    };

    res.json({
      success: true,
      message: 'Security dashboard data retrieved successfully',
      data: dashboardData
    });

  } catch (error) {
    console.error('Security dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error retrieving security dashboard'
    });
  }
};

// Calculate overall security score
const calculateSecurityScore = (testResults, vulnerabilityResults) => {
  let totalScore = 0;
  let testCount = 0;

  // Calculate average score from security tests
  testResults.tests.forEach(test => {
    totalScore += test.score;
    testCount++;
  });

  const averageTestScore = testCount > 0 ? totalScore / testCount : 0;

  // Deduct points for vulnerabilities
  const vulnerabilityPenalty = 
    (vulnerabilityResults.summary.critical * 20) +
    (vulnerabilityResults.summary.high * 10) +
    (vulnerabilityResults.summary.medium * 5) +
    (vulnerabilityResults.summary.low * 2);

  const finalScore = Math.max(0, averageTestScore - vulnerabilityPenalty);
  
  return Math.round(finalScore);
};

// Log security event (for external use)
const logSecurityEvent = async (req, res) => {
  try {
    const { category, type, severity, details } = req.body;

    if (!category || !type || !severity) {
      return res.status(400).json({
        success: false,
        message: 'Category, type, and severity are required'
      });
    }

    await auditor.logSecurityEvent({
      category,
      type,
      severity,
      userId: req.user ? req.user.id : null,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      ...details
    });

    res.json({
      success: true,
      message: 'Security event logged successfully'
    });

  } catch (error) {
    console.error('Security event logging error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error logging security event'
    });
  }
};

module.exports = {
  runSecurityTests,
  runVulnerabilityScan,
  generateAuditReport,
  getSecurityDashboard,
  logSecurityEvent,
  auditor // Export auditor for use in other controllers
};
