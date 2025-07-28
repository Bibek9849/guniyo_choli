const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');

// General API rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: {
    success: false,
    message: 'Too many login attempts from this IP, please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
});

// Progressive delay for repeated requests
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 2, // allow 2 requests per windowMs without delay
  delayMs: 500, // add 500ms delay per request after delayAfter
  maxDelayMs: 20000, // maximum delay of 20 seconds
});

// Account lockout tracking
const accountLockouts = new Map();

// Account lockout middleware
const accountLockoutMiddleware = (req, res, next) => {
  const { email } = req.body;
  
  if (!email) {
    return next();
  }

  const lockoutInfo = accountLockouts.get(email);
  
  if (lockoutInfo) {
    const { attempts, lockedUntil } = lockoutInfo;
    
    // Check if account is still locked
    if (lockedUntil && Date.now() < lockedUntil) {
      const remainingTime = Math.ceil((lockedUntil - Date.now()) / 1000 / 60);
      return res.status(423).json({
        success: false,
        message: `Account temporarily locked due to multiple failed login attempts. Try again in ${remainingTime} minutes.`,
        lockedUntil: new Date(lockedUntil).toISOString()
      });
    }
    
    // Reset if lockout period has expired
    if (lockedUntil && Date.now() >= lockedUntil) {
      accountLockouts.delete(email);
    }
  }
  
  next();
};

// Function to handle failed login attempts
const handleFailedLogin = (email) => {
  const lockoutInfo = accountLockouts.get(email) || { attempts: 0, lockedUntil: null };
  
  lockoutInfo.attempts += 1;
  
  // Lock account after 5 failed attempts
  if (lockoutInfo.attempts >= 5) {
    // Progressive lockout: 30 minutes for first lockout, 1 hour for second, etc.
    const lockoutDuration = Math.min(30 * Math.pow(2, Math.floor(lockoutInfo.attempts / 5) - 1), 480); // Max 8 hours
    lockoutInfo.lockedUntil = Date.now() + (lockoutDuration * 60 * 1000);
    lockoutInfo.attempts = 0; // Reset attempts after lockout
  }
  
  accountLockouts.set(email, lockoutInfo);
};

// Function to handle successful login
const handleSuccessfulLogin = (email) => {
  accountLockouts.delete(email);
};

// Password reset rate limiter
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 password reset attempts per hour
  message: {
    success: false,
    message: 'Too many password reset attempts from this IP, please try again after 1 hour.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Registration rate limiter
const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 registrations per hour
  message: {
    success: false,
    message: 'Too many registration attempts from this IP, please try again after 1 hour.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  generalLimiter,
  authLimiter,
  speedLimiter,
  accountLockoutMiddleware,
  handleFailedLogin,
  handleSuccessfulLogin,
  passwordResetLimiter,
  registrationLimiter
};
