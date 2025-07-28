import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { 
  registerUserApi, 
  loginUserApi, 
  setupMFAApi, 
  verifyAndEnableMFAApi,
  getMFAStatusApi,
  disableMFAApi 
} from '../apis/Api';
import '../CSS/AuthTest.css';

const AuthTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testEmail] = useState(`test${Date.now()}@example.com`);
  const [testPassword] = useState('TestPassword123!');

  const addResult = (test, status, message, details = null) => {
    setTestResults(prev => [...prev, {
      test,
      status,
      message,
      details,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    try {
      // Test 1: User Registration with Strong Password
      addResult('User Registration', 'running', 'Testing user registration with strong password...');
      try {
        const registerResponse = await registerUserApi({
          firstName: 'Test',
          lastName: 'User',
          email: testEmail,
          password: testPassword,
          phone: '1234567890'
        });
        
        if (registerResponse.data.success) {
          addResult('User Registration', 'success', 'User registered successfully', registerResponse.data);
        } else {
          addResult('User Registration', 'failed', registerResponse.data.message, registerResponse.data);
        }
      } catch (error) {
        addResult('User Registration', 'error', 'Registration failed', error.response?.data);
      }

      await sleep(1000);

      // Test 2: Login with Valid Credentials
      addResult('Basic Login', 'running', 'Testing login with valid credentials...');
      let loginToken = null;
      try {
        const loginResponse = await loginUserApi({
          email: testEmail,
          password: testPassword
        });
        
        if (loginResponse.data.success) {
          loginToken = loginResponse.data.token;
          localStorage.setItem('token', loginToken);
          localStorage.setItem('user', JSON.stringify(loginResponse.data.userData));
          addResult('Basic Login', 'success', 'Login successful', loginResponse.data);
        } else {
          addResult('Basic Login', 'failed', loginResponse.data.message, loginResponse.data);
        }
      } catch (error) {
        addResult('Basic Login', 'error', 'Login failed', error.response?.data);
      }

      await sleep(1000);

      // Test 3: Login with Invalid Password (Brute Force Protection Test)
      addResult('Brute Force Protection', 'running', 'Testing brute force protection...');
      try {
        const attempts = [];
        for (let i = 0; i < 6; i++) {
          try {
            const response = await loginUserApi({
              email: testEmail,
              password: 'WrongPassword123!'
            });
            attempts.push(`Attempt ${i + 1}: ${response.data.message}`);
          } catch (error) {
            attempts.push(`Attempt ${i + 1}: ${error.response?.data?.message || 'Error'}`);
            if (error.response?.status === 423) {
              addResult('Brute Force Protection', 'success', 'Account locked after failed attempts', {
                attempts,
                lockoutResponse: error.response.data
              });
              break;
            }
          }
          await sleep(500);
        }
        
        if (attempts.length === 6) {
          addResult('Brute Force Protection', 'warning', 'Account not locked after 6 attempts', { attempts });
        }
      } catch (error) {
        addResult('Brute Force Protection', 'error', 'Brute force test failed', error.response?.data);
      }

      await sleep(2000);

      // Test 4: MFA Setup (if login was successful)
      if (loginToken) {
        addResult('MFA Setup', 'running', 'Testing MFA setup...');
        try {
          const mfaSetupResponse = await setupMFAApi();
          
          if (mfaSetupResponse.data.success) {
            addResult('MFA Setup', 'success', 'MFA setup initiated', {
              hasQRCode: !!mfaSetupResponse.data.data.qrCode,
              hasSecret: !!mfaSetupResponse.data.data.secret,
              backupCodesCount: mfaSetupResponse.data.data.backupCodes?.length || 0
            });
          } else {
            addResult('MFA Setup', 'failed', mfaSetupResponse.data.message, mfaSetupResponse.data);
          }
        } catch (error) {
          addResult('MFA Setup', 'error', 'MFA setup failed', error.response?.data);
        }

        await sleep(1000);

        // Test 5: MFA Status Check
        addResult('MFA Status Check', 'running', 'Checking MFA status...');
        try {
          const statusResponse = await getMFAStatusApi();
          
          if (statusResponse.data.success) {
            addResult('MFA Status Check', 'success', 'MFA status retrieved', statusResponse.data.data);
          } else {
            addResult('MFA Status Check', 'failed', statusResponse.data.message, statusResponse.data);
          }
        } catch (error) {
          addResult('MFA Status Check', 'error', 'MFA status check failed', error.response?.data);
        }
      }

      await sleep(1000);

      // Test 6: Password Policy Validation
      addResult('Password Policy', 'running', 'Testing password policy validation...');
      const weakPasswords = [
        'weak',
        '12345678',
        'password',
        'Password',
        'Password123',
        testEmail.split('@')[0] // Using email prefix
      ];

      const passwordResults = [];
      for (const weakPassword of weakPasswords) {
        try {
          const response = await registerUserApi({
            firstName: 'Test',
            lastName: 'Weak',
            email: `weak${Date.now()}@example.com`,
            password: weakPassword,
            phone: '1234567890'
          });
          
          passwordResults.push({
            password: weakPassword,
            accepted: response.data.success,
            message: response.data.message
          });
        } catch (error) {
          passwordResults.push({
            password: weakPassword,
            accepted: false,
            message: error.response?.data?.message || 'Error'
          });
        }
      }

      const rejectedCount = passwordResults.filter(r => !r.accepted).length;
      if (rejectedCount === weakPasswords.length) {
        addResult('Password Policy', 'success', `All ${weakPasswords.length} weak passwords rejected`, passwordResults);
      } else {
        addResult('Password Policy', 'warning', `${rejectedCount}/${weakPasswords.length} weak passwords rejected`, passwordResults);
      }

      addResult('Test Suite', 'completed', 'All authentication tests completed');

    } catch (error) {
      addResult('Test Suite', 'error', 'Test suite failed', error);
    } finally {
      setIsRunning(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const exportResults = () => {
    const results = {
      timestamp: new Date().toISOString(),
      testEmail,
      results: testResults
    };
    
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auth-test-results-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Test results exported!');
  };

  return (
    <div className="auth-test-container">
      <div className="auth-test-card">
        <h1 className="test-title">Authentication & Security Test Suite</h1>
        <p className="test-subtitle">
          Comprehensive testing of registration, login, MFA, brute-force protection, and password policies
        </p>
        
        <div className="test-info">
          <div className="info-item">
            <span className="info-label">Test Email:</span>
            <span className="info-value">{testEmail}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Test Password:</span>
            <span className="info-value">{testPassword}</span>
          </div>
        </div>

        <div className="test-controls">
          <button 
            className="btn btn-primary"
            onClick={runAllTests}
            disabled={isRunning}
          >
            {isRunning ? 'Running Tests...' : 'Run All Tests'}
          </button>
          
          <button 
            className="btn btn-secondary"
            onClick={clearResults}
            disabled={isRunning}
          >
            Clear Results
          </button>
          
          {testResults.length > 0 && (
            <button 
              className="btn btn-outline"
              onClick={exportResults}
              disabled={isRunning}
            >
              Export Results
            </button>
          )}
        </div>

        <div className="test-results">
          {testResults.length === 0 ? (
            <div className="no-results">
              <p>No test results yet. Click "Run All Tests" to begin testing.</p>
            </div>
          ) : (
            <div className="results-list">
              {testResults.map((result, index) => (
                <div key={index} className={`result-item ${result.status}`}>
                  <div className="result-header">
                    <span className="result-test">{result.test}</span>
                    <span className="result-status">{result.status}</span>
                    <span className="result-time">{result.timestamp}</span>
                  </div>
                  
                  <div className="result-message">{result.message}</div>
                  
                  {result.details && (
                    <div className="result-details">
                      <details>
                        <summary>View Details</summary>
                        <pre>{JSON.stringify(result.details, null, 2)}</pre>
                      </details>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="test-documentation">
          <h2>Test Coverage</h2>
          <div className="test-list">
            <div className="test-item">
              <span className="test-icon">✅</span>
              <div className="test-description">
                <h4>User Registration</h4>
                <p>Tests user registration with strong password requirements and validation</p>
              </div>
            </div>
            
            <div className="test-item">
              <span className="test-icon">🔐</span>
              <div className="test-description">
                <h4>Basic Authentication</h4>
                <p>Tests login functionality with valid credentials and token generation</p>
              </div>
            </div>
            
            <div className="test-item">
              <span className="test-icon">🛡️</span>
              <div className="test-description">
                <h4>Brute Force Protection</h4>
                <p>Tests account lockout after multiple failed login attempts</p>
              </div>
            </div>
            
            <div className="test-item">
              <span className="test-icon">📱</span>
              <div className="test-description">
                <h4>Multi-Factor Authentication</h4>
                <p>Tests MFA setup, QR code generation, and backup codes</p>
              </div>
            </div>
            
            <div className="test-item">
              <span className="test-icon">🔑</span>
              <div className="test-description">
                <h4>Password Policy</h4>
                <p>Tests rejection of weak passwords and enforcement of security policies</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthTest;
