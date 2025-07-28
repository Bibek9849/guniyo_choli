import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  getMFAStatusApi, 
  disableMFAApi, 
  generateNewBackupCodesApi,
  changePasswordApi 
} from '../apis/Api';
import MFASetup from '../components/MFASetup';
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';
import '../CSS/SecuritySettings.css';

const SecuritySettings = () => {
  const [mfaStatus, setMfaStatus] = useState(null);
  const [showMFASetup, setShowMFASetup] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showDisableMFA, setShowDisableMFA] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Password change form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState({});
  
  // MFA disable form
  const [disablePassword, setDisablePassword] = useState('');
  const [disableMFAToken, setDisableMFAToken] = useState('');
  const [disableErrors, setDisableErrors] = useState({});

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    loadMFAStatus();
  }, []);

  const loadMFAStatus = async () => {
    try {
      const response = await getMFAStatusApi();
      if (response.data.success) {
        setMfaStatus(response.data.data);
      }
    } catch (error) {
      console.error('Error loading MFA status:', error);
    }
  };

  const handleMFAEnabled = () => {
    setShowMFASetup(false);
    loadMFAStatus();
    toast.success('MFA has been successfully enabled for your account!');
  };

  const validatePasswordChange = () => {
    const errors = {};
    
    if (!currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!newPassword) {
      errors.newPassword = 'New password is required';
    } else if (newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters long';
    }
    
    if (!confirmNewPassword) {
      errors.confirmNewPassword = 'Please confirm your new password';
    } else if (newPassword !== confirmNewPassword) {
      errors.confirmNewPassword = 'Passwords do not match';
    }
    
    if (currentPassword === newPassword) {
      errors.newPassword = 'New password must be different from current password';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordChange()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await changePasswordApi({
        currentPassword,
        newPassword
      });
      
      if (response.data.success) {
        toast.success('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setShowPasswordChange(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Password change error:', error);
      toast.error('Failed to change password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateMFADisable = () => {
    const errors = {};
    
    if (!disablePassword) {
      errors.password = 'Password is required';
    }
    
    if (!disableMFAToken || disableMFAToken.length !== 6) {
      errors.mfaToken = 'Valid 6-digit MFA code is required';
    }
    
    setDisableErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleDisableMFA = async (e) => {
    e.preventDefault();
    
    if (!validateMFADisable()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await disableMFAApi({
        password: disablePassword,
        token: disableMFAToken
      });
      
      if (response.data.success) {
        toast.success('MFA has been disabled successfully');
        setShowDisableMFA(false);
        setDisablePassword('');
        setDisableMFAToken('');
        loadMFAStatus();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('MFA disable error:', error);
      toast.error('Failed to disable MFA. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateBackupCodes = async () => {
    const password = prompt('Enter your password to generate new backup codes:');
    const mfaToken = prompt('Enter your current MFA code:');
    
    if (!password || !mfaToken) {
      toast.error('Password and MFA code are required');
      return;
    }
    
    try {
      const response = await generateNewBackupCodesApi({
        password,
        token: mfaToken
      });
      
      if (response.data.success) {
        const codes = response.data.data.backupCodes;
        
        // Create downloadable file
        const content = `Guniyo Choli - New MFA Backup Codes\n\nGenerated: ${new Date().toLocaleString()}\n\nBackup Codes (use each code only once):\n${codes.map((code, index) => `${index + 1}. ${code}`).join('\n')}\n\nKeep these codes safe and secure!`;
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'guniyo-choli-new-backup-codes.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast.success('New backup codes generated and downloaded!');
        loadMFAStatus();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Backup codes generation error:', error);
      toast.error('Failed to generate backup codes. Please try again.');
    }
  };

  return (
    <div className="security-settings-container">
      <div className="security-settings-card">
        <h1 className="settings-title">Security Settings</h1>
        <p className="settings-subtitle">Manage your account security and authentication methods</p>
        
        {/* Account Overview */}
        <div className="security-section">
          <h2>Account Overview</h2>
          <div className="account-info">
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{user.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Name:</span>
              <span className="info-value">{user.firstName} {user.lastName}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Account Type:</span>
              <span className="info-value">{user.isAdmin ? 'Administrator' : 'User'}</span>
            </div>
          </div>
        </div>

        {/* Password Security */}
        <div className="security-section">
          <h2>Password Security</h2>
          <div className="security-item">
            <div className="security-item-info">
              <h3>Password</h3>
              <p>Change your password regularly to keep your account secure</p>
            </div>
            <button 
              className="btn btn-outline"
              onClick={() => setShowPasswordChange(!showPasswordChange)}
            >
              Change Password
            </button>
          </div>
          
          {showPasswordChange && (
            <div className="security-form">
              <form onSubmit={handlePasswordChange}>
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    className={`form-control ${passwordErrors.currentPassword ? 'is-invalid' : ''}`}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                    disabled={isLoading}
                  />
                  {passwordErrors.currentPassword && (
                    <div className="invalid-feedback">{passwordErrors.currentPassword}</div>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    className={`form-control ${passwordErrors.newPassword ? 'is-invalid' : ''}`}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password"
                    disabled={isLoading}
                  />
                  {passwordErrors.newPassword && (
                    <div className="invalid-feedback">{passwordErrors.newPassword}</div>
                  )}
                  
                  {newPassword && (
                    <PasswordStrengthIndicator 
                      password={newPassword} 
                      userInfo={{ firstName: user.firstName, lastName: user.lastName, email: user.email }} 
                    />
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmNewPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmNewPassword"
                    className={`form-control ${passwordErrors.confirmNewPassword ? 'is-invalid' : ''}`}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    disabled={isLoading}
                  />
                  {passwordErrors.confirmNewPassword && (
                    <div className="invalid-feedback">{passwordErrors.confirmNewPassword}</div>
                  )}
                </div>
                
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowPasswordChange(false);
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmNewPassword('');
                      setPasswordErrors({});
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Changing...' : 'Change Password'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Multi-Factor Authentication */}
        <div className="security-section">
          <h2>Multi-Factor Authentication (MFA)</h2>
          
          {mfaStatus === null ? (
            <div className="loading-state">Loading MFA status...</div>
          ) : mfaStatus.mfaEnabled ? (
            <div className="mfa-enabled">
              <div className="security-item">
                <div className="security-item-info">
                  <h3>
                    <span className="status-icon enabled">✓</span>
                    MFA Enabled
                  </h3>
                  <p>Your account is protected with two-factor authentication</p>
                  <p className="backup-codes-info">
                    Backup codes remaining: {mfaStatus.backupCodesRemaining}
                  </p>
                </div>
                <div className="mfa-actions">
                  <button 
                    className="btn btn-outline"
                    onClick={handleGenerateBackupCodes}
                  >
                    Generate New Backup Codes
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => setShowDisableMFA(!showDisableMFA)}
                  >
                    Disable MFA
                  </button>
                </div>
              </div>
              
              {showDisableMFA && (
                <div className="security-form danger-form">
                  <div className="warning-message">
                    <span className="warning-icon">⚠</span>
                    <strong>Warning:</strong> Disabling MFA will make your account less secure.
                  </div>
                  
                  <form onSubmit={handleDisableMFA}>
                    <div className="form-group">
                      <label htmlFor="disablePassword">Password</label>
                      <input
                        type="password"
                        id="disablePassword"
                        className={`form-control ${disableErrors.password ? 'is-invalid' : ''}`}
                        value={disablePassword}
                        onChange={(e) => setDisablePassword(e.target.value)}
                        placeholder="Enter your password"
                        disabled={isLoading}
                      />
                      {disableErrors.password && (
                        <div className="invalid-feedback">{disableErrors.password}</div>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="disableMFAToken">MFA Code</label>
                      <input
                        type="text"
                        id="disableMFAToken"
                        className={`form-control mfa-input ${disableErrors.mfaToken ? 'is-invalid' : ''}`}
                        value={disableMFAToken}
                        onChange={(e) => setDisableMFAToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="000000"
                        maxLength={6}
                        disabled={isLoading}
                      />
                      {disableErrors.mfaToken && (
                        <div className="invalid-feedback">{disableErrors.mfaToken}</div>
                      )}
                    </div>
                    
                    <div className="form-actions">
                      <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={() => {
                          setShowDisableMFA(false);
                          setDisablePassword('');
                          setDisableMFAToken('');
                          setDisableErrors({});
                        }}
                        disabled={isLoading}
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="btn btn-danger"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Disabling...' : 'Disable MFA'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <div className="mfa-disabled">
              <div className="security-item">
                <div className="security-item-info">
                  <h3>
                    <span className="status-icon disabled">✗</span>
                    MFA Disabled
                  </h3>
                  <p>Add an extra layer of security to your account with two-factor authentication</p>
                </div>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowMFASetup(true)}
                >
                  Enable MFA
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Security Recommendations */}
        <div className="security-section">
          <h2>Security Recommendations</h2>
          <div className="recommendations">
            <div className="recommendation-item">
              <span className="recommendation-icon">🔒</span>
              <div className="recommendation-text">
                <h4>Use a strong, unique password</h4>
                <p>Your password should be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters.</p>
              </div>
            </div>
            
            <div className="recommendation-item">
              <span className="recommendation-icon">📱</span>
              <div className="recommendation-text">
                <h4>Enable Multi-Factor Authentication</h4>
                <p>MFA adds an extra layer of security by requiring a second form of verification when logging in.</p>
              </div>
            </div>
            
            <div className="recommendation-item">
              <span className="recommendation-icon">🔄</span>
              <div className="recommendation-text">
                <h4>Change your password regularly</h4>
                <p>Update your password every 90 days or immediately if you suspect it may have been compromised.</p>
              </div>
            </div>
            
            <div className="recommendation-item">
              <span className="recommendation-icon">💾</span>
              <div className="recommendation-text">
                <h4>Keep backup codes safe</h4>
                <p>Store your MFA backup codes in a secure location. You'll need them if you lose access to your authenticator app.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showMFASetup && (
        <MFASetup 
          onClose={() => setShowMFASetup(false)}
          onMFAEnabled={handleMFAEnabled}
        />
      )}
    </div>
  );
};

export default SecuritySettings;
