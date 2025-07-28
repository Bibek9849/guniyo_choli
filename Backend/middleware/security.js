const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss');
const hpp = require('hpp');
const { body, validationResult, param, query } = require('express-validator');

// Security headers configuration
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false, // Disable for development
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  frameguard: { action: 'deny' },
  xssFilter: true,
  referrerPolicy: { policy: 'same-origin' }
});

// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
  // Sanitize all string inputs to prevent XSS
  const sanitizeObject = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = xss(obj[key], {
          whiteList: {}, // No HTML tags allowed
          stripIgnoreTag: true,
          stripIgnoreTagBody: ['script']
        });
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitizeObject(obj[key]);
      }
    }
  };

  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);

  next();
};

// Validation rules for user registration
const validateUserRegistration = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name must be 2-50 characters and contain only letters'),
  
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name must be 2-50 characters and contain only letters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Please provide a valid email address'),
  
  body('phone')
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
  
  body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters')
];

// Validation rules for user login
const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Validation rules for password change
const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 8, max: 128 })
    .withMessage('New password must be between 8 and 128 characters')
];

// Validation rules for MFA token
const validateMFAToken = [
  body('token')
    .optional()
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('MFA token must be 6 digits'),
  
  body('backupCode')
    .optional()
    .isLength({ min: 8, max: 8 })
    .isAlphanumeric()
    .withMessage('Backup code must be 8 alphanumeric characters')
];

// Validation rules for product operations
const validateProductId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid product ID format')
];

// Validation rules for user ID
const validateUserId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid user ID format')
];

// Generic validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.param,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// SQL injection prevention (for NoSQL injection)
const preventNoSQLInjection = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`Potential NoSQL injection attempt detected: ${key} in ${req.method} ${req.url}`);
  }
});

// Parameter pollution prevention
const preventParameterPollution = hpp({
  whitelist: ['sort', 'fields', 'page', 'limit'] // Allow these parameters to be arrays
});

// Request size limiting
const requestSizeLimit = (req, res, next) => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (req.headers['content-length'] && parseInt(req.headers['content-length']) > maxSize) {
    return res.status(413).json({
      success: false,
      message: 'Request entity too large'
    });
  }
  next();
};

// IP-based security checks
const ipSecurityCheck = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  
  // Log suspicious activities
  if (req.headers['user-agent'] && req.headers['user-agent'].includes('bot')) {
    console.warn(`Bot detected from IP: ${clientIP}, User-Agent: ${req.headers['user-agent']}`);
  }
  
  // Check for common attack patterns in URL
  const suspiciousPatterns = [
    /\.\./,           // Directory traversal
    /\/etc\/passwd/,  // System file access
    /script/i,        // Script injection
    /union.*select/i, // SQL injection
    /javascript:/i    // XSS
  ];
  
  const url = req.originalUrl || req.url;
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(url)) {
      console.warn(`Suspicious request pattern detected from IP: ${clientIP}, URL: ${url}`);
      return res.status(400).json({
        success: false,
        message: 'Invalid request'
      });
    }
  }
  
  next();
};

// File upload security
const validateFileUpload = (req, res, next) => {
  if (!req.files) return next();
  
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  for (const fileKey in req.files) {
    const file = req.files[fileKey];
    
    // Check file type
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'
      });
    }
    
    // Check file size
    if (file.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.'
      });
    }
    
    // Check for malicious file names
    if (/[<>:"/\\|?*]/.test(file.name) || file.name.includes('..')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file name.'
      });
    }
  }
  
  next();
};

// CSRF protection for state-changing operations
const csrfProtection = (req, res, next) => {
  // Skip CSRF for GET, HEAD, OPTIONS
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }
  
  // Check for custom header (SPA protection)
  const customHeader = req.headers['x-requested-with'];
  if (customHeader === 'XMLHttpRequest') {
    return next();
  }
  
  // Check for valid origin
  const origin = req.headers.origin;
  const allowedOrigins = ['http://localhost:3000', 'https://yourdomain.com'];
  
  if (origin && allowedOrigins.includes(origin)) {
    return next();
  }
  
  return res.status(403).json({
    success: false,
    message: 'CSRF protection: Invalid request origin'
  });
};

// Security audit logging
const securityAuditLog = (req, res, next) => {
  const securityEvents = {
    timestamp: new Date().toISOString(),
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    method: req.method,
    url: req.originalUrl,
    userId: req.user ? req.user.id : null,
    sessionId: req.sessionID
  };
  
  // Log sensitive operations
  const sensitiveEndpoints = [
    '/api/user/login',
    '/api/user/create',
    '/api/mfa/',
    '/api/privacy/',
    '/api/user/change-password'
  ];
  
  const isSensitive = sensitiveEndpoints.some(endpoint => 
    req.originalUrl.includes(endpoint)
  );
  
  if (isSensitive) {
    console.log('Security Audit:', JSON.stringify(securityEvents));
  }
  
  next();
};

module.exports = {
  securityHeaders,
  sanitizeInput,
  validateUserRegistration,
  validateUserLogin,
  validatePasswordChange,
  validateMFAToken,
  validateProductId,
  validateUserId,
  handleValidationErrors,
  preventNoSQLInjection,
  preventParameterPollution,
  requestSizeLimit,
  ipSecurityCheck,
  validateFileUpload,
  csrfProtection,
  securityAuditLog
};
