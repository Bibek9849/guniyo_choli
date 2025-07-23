import React, { useEffect, useState } from 'react';
import '../../CSS/Settings.css';
import Footer from '../../components/Footer';

function Settings() {
  const [selectedOption, setSelectedOption] = useState('account');
  const [darkMode, setDarkMode] = useState(false);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') {
      setDarkMode(true);
      document.body.classList.add('dark-mode');
    }
    // Fetch user data from local storage or API
    const fetchUserData = () => {
      const user = JSON.parse(localStorage.getItem('user')) || {};
      setUserData(user);
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const handleToggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  const renderContent = () => {
    switch (selectedOption) {
      case 'account':
        return (
          <div className="settings-content">
            <h2>Account Settings</h2>
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input id="firstName" type="text" value={userData.firstName} readOnly />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input id="lastName" type="text" value={userData.lastName} readOnly />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" value={userData.email} readOnly />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input id="phone" type="text" value={userData.phone} readOnly />
            </div>
          </div>
        );
      case 'privacy':
        return (
          <div className="settings-content">
            <h2>Privacy Settings</h2>
            <div className="form-group">
              <label htmlFor="profileVisibility">Profile Visibility</label>
              <select id="profileVisibility">
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="searchHistory">Search History</label>
              <input id="searchHistory" type="checkbox" checked />
              <span> Allow search engines to index my profile</span>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="settings-content">
            <h2>Notification Settings</h2>
            <div className="form-group">
              <label htmlFor="emailNotifications">Email Notifications</label>
              <input id="emailNotifications" type="checkbox" checked />
              <span> Receive email notifications</span>
            </div>
            <div className="form-group">
              <label htmlFor="pushNotifications">Push Notifications</label>
              <input id="pushNotifications" type="checkbox" />
              <span> Receive push notifications</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="settings-container">
        <div className="settings-sidebar">
          <ul>
            <li
              className={selectedOption === 'account' ? 'active' : ''}
              onClick={() => setSelectedOption('account')}
              role="button"
              aria-label="Account Settings"
            >
              Account
            </li>
            <li
              className={selectedOption === 'privacy' ? 'active' : ''}
              onClick={() => setSelectedOption('privacy')}
              role="button"
              aria-label="Privacy Settings"
            >
              Privacy
            </li>
            <li
              className={selectedOption === 'notifications' ? 'active' : ''}
              onClick={() => setSelectedOption('notifications')}
              role="button"
              aria-label="Notification Settings"
            >
              Notifications
            </li>
          </ul>
          <button className="dark-mode-toggle" onClick={handleToggleDarkMode}>
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
        <div className="settings-main">{renderContent()}</div>
      </div>
      <Footer />
    </>
  );
}

export default Settings;
