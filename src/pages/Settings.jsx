import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import FloatingChatButton from '../components/FloatingChatButton';
import '../css/Settings.css';

const Settings = () => {
  const [username, setUsername] = useState('admin');
  const [email, setEmail] = useState('admin@admin.com');
  const [lightMode, setLightMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);

  const handleSaveChanges = () => alert('Profile changes saved!');
  const handleSavePreferences = () => alert('Preferences saved!');
  const handleChangePicture = () => alert('Change picture clicked');
  const handleChangePassword = () => alert('Change password clicked');
  const handleCloseAccount = () => alert('Close account clicked');

  return (
    <div className="settings-page">
      <Sidebar />
      <div className="settings-content">
        <h1 className="settings-title">Settings</h1>

        {/* PROFILE */}
        <section className="settings-section">
          <div className="section-container">
            <h2 className="section-title">Profile</h2>
            <div className="profile-container">
              <div className="profile-image-section">
                <div className="profile-image">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"
                      fill="#6366F1"
                    />
                  </svg>
                </div>
                <button className="btn-change-picture" onClick={handleChangePicture}>
                  Change Picture
                </button>
              </div>

              <div className="profile-form">
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                  />
                </div>

                <button className="btn-save-changes" onClick={handleSaveChanges}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ACCOUNT */}
        <section className="settings-section">
          <div className="section-container">
            <h2 className="section-title">Account</h2>
            <div className="account-actions">
              <button className="account-btn" onClick={handleChangePassword}>
                <span>Change Password</span>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>

              <button className="account-btn btn-danger" onClick={handleCloseAccount}>
                <span>Close Account</span>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h12V5H6v14zm3-3h6v-2H9v2z" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* PREFERENCES */}
        <section className="settings-section">
          <div className="section-container">
            <h2 className="section-title">Preferences</h2>
            <div className="preferences-container">
              <div className="preference-item">
                <span>Light Mode</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={lightMode}
                    onChange={(e) => setLightMode(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="preference-item">
                <span>Email Notifications</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <button className="btn-save-preferences" onClick={handleSavePreferences}>
                Save Preferences
              </button>
            </div>
          </div>
        </section>
      </div>
      <FloatingChatButton />
    </div>
  );
};

export default Settings;
