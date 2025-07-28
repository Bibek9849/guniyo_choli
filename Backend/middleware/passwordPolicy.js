const bcrypt = require('bcryptjs');
const userModel = require('../models/userModels');

// Password policy configuration
const PASSWORD_POLICY = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  preventCommonPasswords: true,
  preventUserInfoInPassword: true,
  passwordHistoryCount: 5, // Remember last 5 passwords
  maxPasswordAge: 90 * 24 * 60 * 60 * 1000, // 90 days in milliseconds
};

// Common weak passwords list (subset for demonstration)
const COMMON_PASSWORDS = [
  'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
  'admin', 'letmein', 'welcome', 'monkey', '1234567890', 'password1',
  'qwerty123', 'welcome123', 'admin123', 'root', 'toor', 'pass',
  'test', 'guest', 'user', 'demo', 'sample', 'default'
];

// Validate password strength
const validatePasswordStrength = (password, userInfo = {}) => {
  const errors = [];
  
  // Length check
  if (password.length < PASSWORD_POLICY.minLength) {
    errors.push(`Password must be at least ${PASSWORD_POLICY.minLength} characters long`);
  }
  
  if (password.length > PASSWORD_POLICY.maxLength) {
    errors.push(`Password must not exceed ${PASSWORD_POLICY.maxLength} characters`);
  }
  
  // Character requirements
  if (PASSWORD_POLICY.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (PASSWORD_POLICY.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (PASSWORD_POLICY.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (PASSWORD_POLICY.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)');
  }
  
  // Common password check
  if (PASSWORD_POLICY.preventCommonPasswords && COMMON_PASSWORDS.includes(password.toLowerCase())) {
    errors.push('Password is too common. Please choose a more secure password');
  }
  
  // User info in password check
  if (PASSWORD_POLICY.preventUserInfoInPassword && userInfo) {
    const { firstName, lastName, email } = userInfo;
    const passwordLower = password.toLowerCase();
    
    if (firstName && passwordLower.includes(firstName.toLowerCase())) {
      errors.push('Password should not contain your first name');
    }
    
    if (lastName && passwordLower.includes(lastName.toLowerCase())) {
      errors.push('Password should not contain your last name');
    }
    
    if (email) {
      const emailPrefix = email.split('@')[0].toLowerCase();
      if (passwordLower.includes(emailPrefix)) {
        errors.push('Password should not contain your email address');
      }
    }
  }
  
  // Sequential characters check
  if (/(.)\1{2,}/.test(password)) {
    errors.push('Password should not contain repeated characters (e.g., aaa, 111)');
  }
  
  // Sequential patterns check
  const sequences = ['123', '234', '345', '456', '567', '678', '789', 'abc', 'bcd', 'cde', 'def'];
  for (const seq of sequences) {
    if (password.toLowerCase().includes(seq)) {
      errors.push('Password should not contain sequential characters');
      break;
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors,
    strength: calculatePasswordStrength(password)
  };
};

// Calculate password strength score
const calculatePasswordStrength = (password) => {
  let score = 0;
  
  // Length bonus
  score += Math.min(password.length * 4, 25);
  
  // Character variety bonus
  if (/[a-z]/.test(password)) score += 5;
  if (/[A-Z]/.test(password)) score += 5;
  if (/\d/.test(password)) score += 5;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 10;
  
  // Complexity bonus
  const charTypes = [
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  ].filter(Boolean).length;
  
  score += charTypes * 5;
  
  // Length variety bonus
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;
  
  // Penalty for common patterns
  if (/(.)\1{2,}/.test(password)) score -= 10;
  if (COMMON_PASSWORDS.includes(password.toLowerCase())) score -= 20;
  
  score = Math.max(0, Math.min(100, score));
  
  if (score < 30) return 'Weak';
  if (score < 60) return 'Fair';
  if (score < 80) return 'Good';
  return 'Strong';
};

// Middleware for password validation during registration/password change
const validatePassword = (req, res, next) => {
  const { password, firstName, lastName, email } = req.body;
  
  if (!password) {
    return res.status(400).json({
      success: false,
      message: 'Password is required'
    });
  }
  
  const userInfo = { firstName, lastName, email };
  const validation = validatePasswordStrength(password, userInfo);
  
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: 'Password does not meet security requirements',
      errors: validation.errors,
      strength: validation.strength
    });
  }
  
  // Attach validation result to request for use in controller
  req.passwordValidation = validation;
  next();
};

// Check password history to prevent reuse
const checkPasswordHistory = async (userId, newPassword) => {
  try {
    const user = await userModel.findById(userId);
    if (!user || !user.passwordHistory) {
      return { canUse: true };
    }
    
    // Check against password history
    for (const historicalPassword of user.passwordHistory) {
      const isMatch = await bcrypt.compare(newPassword, historicalPassword);
      if (isMatch) {
        return {
          canUse: false,
          message: `Password has been used recently. Please choose a different password. Last ${PASSWORD_POLICY.passwordHistoryCount} passwords cannot be reused.`
        };
      }
    }
    
    return { canUse: true };
  } catch (error) {
    console.error('Password history check error:', error);
    return { canUse: true }; // Allow on error to not block user
  }
};

// Add password to history
const addToPasswordHistory = async (userId, hashedPassword) => {
  try {
    const user = await userModel.findById(userId);
    if (!user) return;
    
    if (!user.passwordHistory) {
      user.passwordHistory = [];
    }
    
    // Add current password to history
    user.passwordHistory.unshift(hashedPassword);
    
    // Keep only the specified number of passwords in history
    if (user.passwordHistory.length > PASSWORD_POLICY.passwordHistoryCount) {
      user.passwordHistory = user.passwordHistory.slice(0, PASSWORD_POLICY.passwordHistoryCount);
    }
    
    // Set password creation date for expiry tracking
    user.passwordCreatedAt = new Date();
    
    await user.save();
  } catch (error) {
    console.error('Password history update error:', error);
  }
};

// Check if password has expired
const checkPasswordExpiry = (user) => {
  if (!user.passwordCreatedAt || !PASSWORD_POLICY.maxPasswordAge) {
    return { expired: false };
  }
  
  const passwordAge = Date.now() - new Date(user.passwordCreatedAt).getTime();
  const expired = passwordAge > PASSWORD_POLICY.maxPasswordAge;
  
  if (expired) {
    return {
      expired: true,
      message: 'Your password has expired. Please change your password to continue.',
      daysExpired: Math.floor(passwordAge / (24 * 60 * 60 * 1000)) - 90
    };
  }
  
  // Warn if password will expire soon (within 7 days)
  const daysUntilExpiry = Math.floor((PASSWORD_POLICY.maxPasswordAge - passwordAge) / (24 * 60 * 60 * 1000));
  if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
    return {
      expired: false,
      warning: true,
      message: `Your password will expire in ${daysUntilExpiry} days. Please consider changing it soon.`,
      daysUntilExpiry
    };
  }
  
  return { expired: false };
};

// Middleware to check password expiry on login
const checkPasswordExpiryMiddleware = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return next();
    
    const user = await userModel.findOne({ email });
    if (!user) return next();
    
    const expiryCheck = checkPasswordExpiry(user);
    if (expiryCheck.expired) {
      return res.status(403).json({
        success: false,
        passwordExpired: true,
        message: expiryCheck.message,
        daysExpired: expiryCheck.daysExpired
      });
    }
    
    // Attach warning to request if password expires soon
    if (expiryCheck.warning) {
      req.passwordWarning = expiryCheck;
    }
    
    next();
  } catch (error) {
    console.error('Password expiry check error:', error);
    next(); // Continue on error
  }
};

module.exports = {
  validatePassword,
  validatePasswordStrength,
  checkPasswordHistory,
  addToPasswordHistory,
  checkPasswordExpiry,
  checkPasswordExpiryMiddleware,
  calculatePasswordStrength,
  PASSWORD_POLICY
};
