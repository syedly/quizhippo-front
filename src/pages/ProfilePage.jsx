import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../components/Sidebar";
import FloatingChatButton from "../components/FloatingChatButton";
import '../css/Profile.css';

const ProfilePage = () => {
  const [profileData, setProfileData] = useState({
    username: 'admin',
    email: 'admin@admin.com',
    profileImage: null
  });
  const [quizStats, setQuizStats] = useState({
    quizzesCreated: 0,
    quizzesCompleted: 0,
    bestScore: 0
  });
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          console.error("No access token found");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "https://quizhippo.pythonanywhere.com/api/profile/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Set profile data
        setProfileData({
          username: response.data.username,
          email: response.data.email,
          profileImage: response.data.avatar || null
        });

        // Set quiz statistics
        setQuizStats({
          quizzesCreated: response.data.quizzes_created,
          quizzesCompleted: response.data.quizzes_completed,
          bestScore: response.data.best_score
        });

        // Set servers
        setServers(response.data.servers || []);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        if (error.response?.status === 401) {
          console.error("Session expired. Please log in again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

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
    navigate('/settings');
    // Add your edit profile logic here
  };

  const handleLogout = () => {
    console.log('Logout clicked');
    // Add your logout logic here
  };

  const handleDeleteServer = async (serverId) => {
    if (!window.confirm('Are you sure you want to delete this server? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("You must be logged in to delete servers.");
        return;
      }

      const response = await axios.delete(
        `https://quizhippo.pythonanywhere.com/api/servers/${serverId}/delete/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert(`✅ ${response.data.message}`);

      // Refresh profile data to update servers list
      const profileResponse = await axios.get(
        "https://quizhippo.pythonanywhere.com/api/profile/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setServers(profileResponse.data.servers || []);
    } catch (error) {
      console.error("Error deleting server:", error);
      if (error.response?.status === 401) {
        alert("❌ Session expired. Please log in again.");
      } else if (error.response?.status === 403) {
        alert("❌ You are not allowed to delete this server.");
      } else {
        alert("❌ Failed to delete server. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <Sidebar />
        <FloatingChatButton />
        <div className="profile-content">
          <div className="profile-section">
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

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
                    {profileData.profileImage ? (
                      <img 
                        src={profileData.profileImage} 
                        alt="Profile" 
                        style={{ 
                          width: "100%", 
                          height: "100%", 
                          objectFit: "cover", 
                          borderRadius: "50%" 
                        }}
                      />
                    ) : (
                      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                        <path d="M30 0L35 20L40 10L42 25L50 15L48 30L60 25L52 35L60 40L50 42L55 50L45 48L47 58L37 52L35 60L30 50L25 60L23 52L13 58L15 48L5 50L10 42L0 40L8 35L0 30L12 28L10 20L18 22L15 12L25 18L23 8L30 15V0Z" fill="#6366F1"/>
                      </svg>
                    )}
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
                <p className="stat-value">{quizStats.quizzesCreated}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Quizzes Completed</p>
                <p className="stat-value">{quizStats.quizzesCompleted}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Best Score</p>
                <p className="stat-value">{quizStats.bestScore}%</p>
              </div>
            </div>
          </div>

          {/* Your Servers */}
          <div className="servers-section">
            <h2 className="section-heading">Your Servers</h2>
            {servers.length > 0 ? (
              servers.map((server) => (
                <div key={server.id} className="server-card">
                  <div className="server-info">
                    <h3 className="server-name">{server.name}</h3>
                    <p className="server-description">{server.description || "no description provided"}</p>
                    <p className="server-code">Created: {new Date(server.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="server-actions">
                    <button className="btn-server-action btn-members">Members</button>
                    <button className="btn-server-action btn-results">Results</button>
                    <button className="btn-server-action btn-delete" onClick={() => handleDeleteServer(server.id)}>Delete</button>
                  </div>
                </div>
              ))
            ) : (
              <p>No servers found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;