import React from 'react';
import '../CSS/PasswordStrength.css';

const PasswordStrengthIndicator = ({ password, userInfo = {} }) => {
  const calculateStrength = (password) => {
    if (!password) return { score: 0, level: 'None', color: '#ccc' };

    let score = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      noRepeat: !/(.)\1{2,}/.test(password),
      noSequence: !/(123|234|345|456|567|678|789|abc|bcd|cde|def)/i.test(password)
    };

    // Calculate score
    Object.values(checks).forEach(check => {
      if (check) score += 1;
    });

    // Additional length bonus
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;

    // Penalty for user info in password
    if (userInfo.firstName && password.toLowerCase().includes(userInfo.firstName.toLowerCase())) {
      score -= 2;
    }
    if (userInfo.lastName && password.toLowerCase().includes(userInfo.lastName.toLowerCase())) {
      score -= 2;
    }
    if (userInfo.email && password.toLowerCase().includes(userInfo.email.split('@')[0].toLowerCase())) {
      score -= 2;
    }

    score = Math.max(0, Math.min(9, score));

    let level, color;
    if (score <= 2) {
      level = 'Very Weak';
      color = '#ff4444';
    } else if (score <= 4) {
      level = 'Weak';
      color = '#ff8800';
    } else if (score <= 6) {
      level = 'Medium';
      color = '#ffaa00';
    } else if (score <= 7) {
      level = 'Strong';
      color = '#88cc00';
    } else {
      level = 'Very Strong';
      color = '#00cc44';
    }

    return { score, level, color, checks };
  };

  const validatePassword = (password, userInfo) => {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    if (/(.)\1{2,}/.test(password)) {
      errors.push('Password should not contain repeated characters');
    }
    if (/(123|234|345|456|567|678|789|abc|bcd|cde|def)/i.test(password)) {
      errors.push('Password should not contain sequential characters');
    }

    // Common passwords check
    const commonPasswords = ['password', '123456', '123456789', 'qwerty', 'abc123', 'password123'];
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('Password is too common. Please choose a more secure password');
    }

    // User info check
    if (userInfo.firstName && password.toLowerCase().includes(userInfo.firstName.toLowerCase())) {
      errors.push('Password should not contain your first name');
    }
    if (userInfo.lastName && password.toLowerCase().includes(userInfo.lastName.toLowerCase())) {
      errors.push('Password should not contain your last name');
    }
    if (userInfo.email && password.toLowerCase().includes(userInfo.email.split('@')[0].toLowerCase())) {
      errors.push('Password should not contain your email address');
    }

    return errors;
  };

  const strength = calculateStrength(password);
  const errors = validatePassword(password, userInfo);

  return (
    <div className="password-strength-container">
      {password && (
        <>
          <div className="strength-meter">
            <div className="strength-label">Password Strength: {strength.level}</div>
            <div className="strength-bar">
              <div 
                className="strength-fill" 
                style={{ 
                  width: `${(strength.score / 9) * 100}%`, 
                  backgroundColor: strength.color 
                }}
              ></div>
            </div>
          </div>
          
          <div className="password-requirements">
            <div className="requirements-grid">
              <div className={`requirement ${strength.checks.length ? 'met' : 'unmet'}`}>
                <span className="icon">{strength.checks.length ? '✓' : '✗'}</span>
                At least 8 characters
              </div>
              <div className={`requirement ${strength.checks.uppercase ? 'met' : 'unmet'}`}>
                <span className="icon">{strength.checks.uppercase ? '✓' : '✗'}</span>
                One uppercase letter
              </div>
              <div className={`requirement ${strength.checks.lowercase ? 'met' : 'unmet'}`}>
                <span className="icon">{strength.checks.lowercase ? '✓' : '✗'}</span>
                One lowercase letter
              </div>
              <div className={`requirement ${strength.checks.numbers ? 'met' : 'unmet'}`}>
                <span className="icon">{strength.checks.numbers ? '✓' : '✗'}</span>
                One number
              </div>
              <div className={`requirement ${strength.checks.special ? 'met' : 'unmet'}`}>
                <span className="icon">{strength.checks.special ? '✓' : '✗'}</span>
                One special character
              </div>
              <div className={`requirement ${strength.checks.noRepeat ? 'met' : 'unmet'}`}>
                <span className="icon">{strength.checks.noRepeat ? '✓' : '✗'}</span>
                No repeated characters
              </div>
            </div>
          </div>

          {errors.length > 0 && (
            <div className="password-errors">
              {errors.map((error, index) => (
                <div key={index} className="error-message">
                  <span className="error-icon">⚠</span>
                  {error}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;
