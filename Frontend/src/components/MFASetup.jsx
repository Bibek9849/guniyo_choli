import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { setupMFAApi, verifyAndEnableMFAApi, getMFAStatusApi } from '../apis/Api';
import '../CSS/MFA.css';

const MFASetup = ({ onClose, onMFAEnabled }) => {
  const [step, setStep] = useState(1); // 1: Setup, 2: Verify, 3: Backup Codes
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [verificationToken, setVerificationToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mfaStatus, setMfaStatus] = useState(null);

  useEffect(() => {
    checkMFAStatus();
  }, []);

  const checkMFAStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await getMFAStatusApi();
      if (response.data.success) {
        setMfaStatus(response.data.data);
      }
    } catch (error) {
      console.error('Error checking MFA status:', error);
    }
  };

  const handleSetupMFA = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        return;
      }

      const response = await setupMFAApi();
      if (response.data.success) {
        setQrCode(response.data.data.qrCode);
        setSecret(response.data.data.secret);
        setBackupCodes(response.data.data.backupCodes);
        setStep(2);
        toast.success('MFA setup initiated. Please scan the QR code with your authenticator app.');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Failed to setup MFA. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyMFA = async () => {
    if (!verificationToken || verificationToken.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    setIsLoading(true);
    try {
      const response = await verifyAndEnableMFAApi({ token: verificationToken });
      if (response.data.success) {
        setStep(3);
        toast.success('MFA enabled successfully!');
        if (onMFAEnabled) onMFAEnabled();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Failed to verify MFA code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy to clipboard');
    });
  };

  const downloadBackupCodes = () => {
    const content = `Guniyo Choli - MFA Backup Codes\n\nGenerated: ${new Date().toLocaleString()}\n\nBackup Codes (use each code only once):\n${backupCodes.map((code, index) => `${index + 1}. ${code}`).join('\n')}\n\nKeep these codes safe and secure!`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'guniyo-choli-backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Backup codes downloaded!');
  };

  if (mfaStatus?.mfaEnabled) {
    return (
      <div className="mfa-container">
        <div className="mfa-card">
          <h2>Multi-Factor Authentication</h2>
          <div className="mfa-status enabled">
            <span className="status-icon">✓</span>
            <span>MFA is currently enabled</span>
          </div>
          <p>Your account is protected with two-factor authentication.</p>
          <p>Backup codes remaining: {mfaStatus.backupCodesRemaining}</p>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mfa-container">
      <div className="mfa-card">
        <div className="mfa-header">
          <h2>Setup Multi-Factor Authentication</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {step === 1 && (
          <div className="mfa-step">
            <h3>Step 1: Enable MFA</h3>
            <p>Multi-Factor Authentication adds an extra layer of security to your account.</p>
            <div className="mfa-benefits">
              <h4>Benefits:</h4>
              <ul>
                <li>Protects against unauthorized access</li>
                <li>Secures your account even if password is compromised</li>
                <li>Industry-standard security practice</li>
              </ul>
            </div>
            <div className="mfa-requirements">
              <h4>Requirements:</h4>
              <p>You'll need an authenticator app such as:</p>
              <ul>
                <li>Google Authenticator</li>
                <li>Microsoft Authenticator</li>
                <li>Authy</li>
                <li>1Password</li>
              </ul>
            </div>
            <button 
              className="btn btn-primary"
              onClick={handleSetupMFA}
              disabled={isLoading}
            >
              {isLoading ? 'Setting up...' : 'Setup MFA'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="mfa-step">
            <h3>Step 2: Scan QR Code</h3>
            <p>Scan this QR code with your authenticator app:</p>
            
            <div className="qr-code-container">
              <img src={qrCode} alt="MFA QR Code" className="qr-code" />
            </div>

            <div className="manual-entry">
              <p>Can't scan? Enter this code manually:</p>
              <div className="secret-code">
                <code>{secret}</code>
                <button 
                  className="btn btn-sm btn-outline"
                  onClick={() => copyToClipboard(secret)}
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="verification-input">
              <label htmlFor="mfaToken">Enter 6-digit code from your app:</label>
              <input
                type="text"
                id="mfaToken"
                className="form-control"
                placeholder="000000"
                value={verificationToken}
                onChange={(e) => setVerificationToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
              />
            </div>

            <div className="mfa-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleVerifyMFA}
                disabled={isLoading || verificationToken.length !== 6}
              >
                {isLoading ? 'Verifying...' : 'Verify & Enable'}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="mfa-step">
            <h3>Step 3: Save Backup Codes</h3>
            <div className="success-message">
              <span className="success-icon">✓</span>
              <span>MFA has been successfully enabled!</span>
            </div>
            
            <p>Save these backup codes in a safe place. You can use them to access your account if you lose your authenticator device.</p>
            
            <div className="backup-codes">
              <div className="codes-grid">
                {backupCodes.map((code, index) => (
                  <div key={index} className="backup-code">
                    <span className="code-number">{index + 1}.</span>
                    <code>{code}</code>
                  </div>
                ))}
              </div>
            </div>

            <div className="backup-actions">
              <button 
                className="btn btn-outline"
                onClick={() => copyToClipboard(backupCodes.join('\n'))}
              >
                Copy All Codes
              </button>
              <button 
                className="btn btn-outline"
                onClick={downloadBackupCodes}
              >
                Download Codes
              </button>
            </div>

            <div className="warning-message">
              <span className="warning-icon">⚠</span>
              <span>Each backup code can only be used once. Keep them secure!</span>
            </div>

            <button 
              className="btn btn-primary"
              onClick={onClose}
            >
              Complete Setup
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MFASetup;
