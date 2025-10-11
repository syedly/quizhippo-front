import React, { useState } from 'react';
import Sidebar from "../components/Sidebar";
import FloatingChatButton from "../components/FloatingChatButton";
import '../css/Profile.css';

const ProfilePage = () => {
  const [profileData, setProfileData] = useState({
    username: 'admin',
    email: 'admin@admin.com',
    profileImage: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = () => {
    console.log('Profile data saved:', profileData);
    // Add your save logic here
  };

  const handleChangePicture = () => {
    console.log('Change picture clicked');
    // Add your image upload logic here
  };

  const handleEditProfile = () => {
    console.log('Edit profile clicked');
    // Add your edit profile logic here
  };

  const handleLogout = () => {
    console.log('Logout clicked');
    // Add your logout logic here
  };

  return (
    <div className="profile-page">
      <Sidebar />
      <FloatingChatButton />
      
      <div className="profile-content">
        <div className="profile-section">
          <div className="profile-header-container">
            <div className="profile-header-left">
              <h1 className="profile-main-title">Profile</h1>
              <p className="profile-subtitle">Manage your account and view quiz statistics.</p>
            </div>
          </div>

          {/* Profile Card */}
          <div className="profile-card-section">
            <div className="profile-card-container">
              <div className="profile-card-left">
                <div className="profile-avatar-wrapper">
                  <div className="profile-avatar">
                    <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                      <path d="M30 0L35 20L40 10L42 25L50 15L48 30L60 25L52 35L60 40L50 42L55 50L45 48L47 58L37 52L35 60L30 50L25 60L23 52L13 58L15 48L5 50L10 42L0 40L8 35L0 30L12 28L10 20L18 22L15 12L25 18L23 8L30 15V0Z" fill="#6366F1"/>
                    </svg>
                  </div>
                </div>
                <div className="profile-info">
                  <h2 className="profile-username">{profileData.username}</h2>
                  <p className="profile-email">{profileData.email}</p>
                </div>
              </div>
              <button className="btn-edit-profile" onClick={handleEditProfile}>
                Edit Profile
              </button>
            </div>
          </div>

          {/* Quiz Statistics */}
          <div className="stats-section">
            <h2 className="section-heading">Quiz Statistics</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <p className="stat-label">Quizzes Created</p>
                <p className="stat-value">11</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Quizzes Completed</p>
                <p className="stat-value">7</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Best Score</p>
                <p className="stat-value">5%</p>
              </div>
            </div>
          </div>

          {/* Your Servers */}
          <div className="servers-section">
            <h2 className="section-heading">Your Servers</h2>
            <div className="server-card">
              <div className="server-info">
                <h3 className="server-name">test</h3>
                <p className="server-description">No description provided.</p>
                <p className="server-code">Code: F6983831</p>
              </div>
              <div className="server-actions">
                <button className="btn-server-action btn-members">Members</button>
                <button className="btn-server-action btn-results">Results</button>
                <button className="btn-server-action btn-delete">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;