import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReCAPTCHA from 'react-google-recaptcha';
import { loginUserApi, verifyMFATokenApi } from '../../apis/Api';
import '../../CSS/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaToken, setMfaToken] = useState('');
  const [backupCode, setBackupCode] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [mfaError, setMfaError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [requiresMFA, setRequiresMFA] = useState(false);
  const [showBackupCode, setShowBackupCode] = useState(false);
  const [accountLocked, setAccountLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [passwordWarning, setPasswordWarning] = useState('');
  const [captchaValue, setCaptchaValue] = useState(null);
  const [captchaError, setCaptchaError] = useState('');

  const navigate = useNavigate();
  const recaptchaRef = useRef();

  useEffect(() => {
    if (localStorage.getItem('user')) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    let interval;
    if (accountLocked && lockoutTime) {
      interval = setInterval(() => {
        const now = new Date().getTime();
        const lockout = new Date(lockoutTime).getTime();
        const remaining = Math.max(0, Math.ceil((lockout - now) / 1000 / 60));
        
        setRemainingTime(remaining);
        
        if (remaining <= 0) {
          setAccountLocked(false);
          setLockoutTime(null);
          clearInterval(interval);
        }
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [accountLocked, lockoutTime]);

  const validation = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');
    setMfaError('');
    setCaptchaError('');

    if (!email || !email.includes('@')) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }
    
    if (!password.trim()) {
      setPasswordError('Password is required');
      isValid = false;
    }

    if (!captchaValue) {
      setCaptchaError('Please complete the reCAPTCHA verification');
      isValid = false;
    }

    if (requiresMFA && !showBackupCode && (!mfaToken || mfaToken.length !== 6)) {
      setMfaError('Please enter a valid 6-digit MFA code');
      isValid = false;
    }

    if (requiresMFA && showBackupCode && !backupCode.trim()) {
      setMfaError('Please enter a backup code');
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (accountLocked) {
      toast.error(`Account is locked. Please try again in ${remainingTime} minutes.`);
      return;
    }

    if (!validation()) {
      return;
    }

    setIsLoading(true);

    try {
      const loginData = {
        email,
        password,
        captchaValue,
        ...(requiresMFA && mfaToken && { mfaToken }),
        ...(requiresMFA && backupCode && { backupCode })
      };

      const response = await loginUserApi(loginData);

      if (response.data.success) {
        // Check for password warning
        if (response.data.passwordWarning) {
          setPasswordWarning(response.data.passwordWarning.message);
        }

        toast.success(response.data.message);
        const userData = response.data.userData;
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', response.data.token);
        navigate('/');
      } else {
        // Handle different error types
        if (response.status === 423) {
          // Account locked
          setAccountLocked(true);
          setLockoutTime(response.data.lockedUntil);
          toast.error(response.data.message);
        } else if (response.data.requiresMFA) {
          // MFA required
          setRequiresMFA(true);
          toast.info('Please enter your MFA code to complete login');
        } else {
          toast.error(response.data.message || 'Login failed');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.status === 423) {
        setAccountLocked(true);
        setLockoutTime(error.response.data.lockedUntil);
        toast.error(error.response.data.message);
      } else {
        toast.error('An error occurred during login. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setRequiresMFA(false);
    setMfaToken('');
    setBackupCode('');
    setShowBackupCode(false);
    setMfaError('');
    setCaptchaValue(null);
    setCaptchaError('');
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
    setCaptchaError('');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Sign in to your secure account</p>
        
        {passwordWarning && (
          <div className="alert alert-warning">
            <div>
              <strong>Password Security Notice</strong>
              <div>{passwordWarning}</div>
            </div>
          </div>
        )}

        {accountLocked && (
          <div className="alert alert-danger">
            <div>
              <strong>Account Temporarily Locked</strong>
              <div>Multiple failed login attempts detected. Your account has been locked for security.</div>
              {remainingTime > 0 && (
                <div className="lockout-timer">
                  ⏱️ Try again in {remainingTime} minute{remainingTime !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className={`form-control ${emailError ? 'is-invalid' : ''}`}
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading || accountLocked}
              required
            />
            {emailError && <div className="invalid-feedback">{emailError}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className={`form-control ${passwordError ? 'is-invalid' : ''}`}
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading || accountLocked}
              required
            />
            {passwordError && <div className="invalid-feedback">{passwordError}</div>}
          </div>

          {requiresMFA && (
            <div className="mfa-section">
              <div className="mfa-header">
                <h3>Two-Factor Authentication</h3>
                <button
                  type="button"
                  className="btn btn-link btn-sm"
                  onClick={() => setShowBackupCode(!showBackupCode)}
                >
                  {showBackupCode ? '📱 Use authenticator app' : '🔑 Use backup code'}
                </button>
              </div>

              {!showBackupCode ? (
                <div className="form-group">
                  <label htmlFor="mfaToken">Authenticator Code</label>
                  <input
                    type="text"
                    className={`form-control mfa-input ${mfaError ? 'is-invalid' : ''}`}
                    id="mfaToken"
                    placeholder="000000"
                    value={mfaToken}
                    onChange={(e) => setMfaToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    disabled={isLoading}
                  />
                  <small className="form-text text-muted">
                    📱 Enter the 6-digit code from your authenticator app
                  </small>
                </div>
              ) : (
                <div className="form-group">
                  <label htmlFor="backupCode">Backup Code</label>
                  <input
                    type="text"
                    className={`form-control ${mfaError ? 'is-invalid' : ''}`}
                    id="backupCode"
                    placeholder="Enter backup code"
                    value={backupCode}
                    onChange={(e) => setBackupCode(e.target.value.toUpperCase())}
                    disabled={isLoading}
                  />
                  <small className="form-text text-muted">
                    🔑 Enter one of your backup recovery codes
                  </small>
                </div>
              )}
              
              {mfaError && <div className="invalid-feedback d-block">{mfaError}</div>}
              
              <button
                type="button"
                className="btn btn-secondary btn-sm mt-2"
                onClick={resetForm}
                disabled={isLoading}
              >
                ← Cancel MFA
              </button>
            </div>
          )}

          {/* reCAPTCHA */}
          <div className="form-group captcha-container">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // Test site key - replace with your actual site key
              onChange={handleCaptchaChange}
              theme="light"
            />
            {captchaError && <div className="invalid-feedback d-block">{captchaError}</div>}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={isLoading || accountLocked || !captchaValue}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                {requiresMFA ? 'Verifying...' : 'Logging in...'}
              </>
            ) : (
              requiresMFA ? 'Verify & Login' : 'Login'
            )}
          </button>

          <div className="login-links">
            <p className="text-center">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary">Create Account</Link>
            </p>
            <p className="text-center">
              <Link to="/forgot-password" className="text-secondary">🔒 Forgot Password?</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
