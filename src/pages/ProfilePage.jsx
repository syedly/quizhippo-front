import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Sidebar from "../components/Sidebar";
import FloatingChatButton from "../components/FloatingChatButton";
import QuizHippoLoader from '../components/QuizHippoLoader';
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
          Swal.fire({
            icon: "warning",
            title: "Authentication Required",
            text: "Please log in to view your profile.",
            background: "#1e1e2e",
            color: "#ffffff",
            confirmButtonColor: "#6366F1",
          }).then(() => {
            navigate('/login');
          });
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
          Swal.fire({
            icon: "error",
            title: "Session Expired",
            text: "Please log in again.",
            background: "#1e1e2e",
            color: "#ffffff",
            confirmButtonColor: "#6366F1",
          }).then(() => {
            navigate('/login');
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error Loading Profile",
            text: "Failed to load profile data. Please try again.",
            background: "#1e1e2e",
            color: "#ffffff",
            confirmButtonColor: "#6366F1",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        Swal.fire({
          icon: "warning",
          title: "Authentication Required",
          text: "You must be logged in to save changes.",
          background: "#1e1e2e",
          color: "#ffffff",
          confirmButtonColor: "#6366F1",
        });
        return;
      }

      // Add your save logic here
      Swal.fire({
        icon: "success",
        title: "Profile Updated!",
        text: "Your changes have been saved successfully.",
        background: "#1e1e2e",
        color: "#ffffff",
        confirmButtonColor: "#6366F1",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error saving changes:", error);
      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: "Failed to save changes. Please try again.",
        background: "#1e1e2e",
        color: "#ffffff",
        confirmButtonColor: "#6366F1",
      });
    }
  };

  const handleChangePicture = () => {
    Swal.fire({
      icon: "info",
      title: "Change Profile Picture",
      text: "Profile picture upload coming soon! Use Settings to update your avatar.",
      background: "#1e1e2e",
      color: "#ffffff",
      confirmButtonColor: "#6366F1",
      showCancelButton: true,
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Go to Settings",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/settings');
      }
    });
  };

  const handleEditProfile = () => {
    navigate('/settings');
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Logout?",
      text: "Are you sure you want to logout?",
      background: "#1e1e2e",
      color: "#ffffff",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6366F1",
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      // Clear tokens
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      
      Swal.fire({
        icon: "success",
        title: "Logged Out",
        text: "You have been successfully logged out.",
        background: "#1e1e2e",
        color: "#ffffff",
        confirmButtonColor: "#6366F1",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigate('/login');
      });
    }
  };

  const handleDeleteServer = async (serverId, serverName) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete Server?",
      html: `Are you sure you want to delete <strong>"${serverName}"</strong>?<br><br>This action cannot be undone.`,
      background: "#1e1e2e",
      color: "#ffffff",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6366F1",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) {
      return;
    }

    // Show loading state
    Swal.fire({
      title: 'Deleting Server...',
      text: 'Please wait',
      background: "#1e1e2e",
      color: "#ffffff",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        Swal.fire({
          icon: "warning",
          title: "Authentication Required",
          text: "You must be logged in to delete servers.",
          background: "#1e1e2e",
          color: "#ffffff",
          confirmButtonColor: "#6366F1",
        });
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

      Swal.fire({
        icon: "success",
        title: "Server Deleted!",
        text: response.data.message,
        background: "#1e1e2e",
        color: "#ffffff",
        confirmButtonColor: "#6366F1",
        timer: 2000,
        showConfirmButton: false,
      });

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
        Swal.fire({
          icon: "error",
          title: "Session Expired",
          text: "Please log in again.",
          background: "#1e1e2e",
          color: "#ffffff",
          confirmButtonColor: "#6366F1",
        });
      } else if (error.response?.status === 403) {
        Swal.fire({
          icon: "error",
          title: "Permission Denied",
          text: "You are not allowed to delete this server.",
          background: "#1e1e2e",
          color: "#ffffff",
          confirmButtonColor: "#6366F1",
        });
      } else if (error.response?.status === 404) {
        Swal.fire({
          icon: "error",
          title: "Server Not Found",
          text: "This server no longer exists.",
          background: "#1e1e2e",
          color: "#ffffff",
          confirmButtonColor: "#6366F1",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: error.response?.data?.error || "Failed to delete server. Please try again.",
          background: "#1e1e2e",
          color: "#ffffff",
          confirmButtonColor: "#6366F1",
        });
      }
    }
  };

  const handleViewMembers = (serverName) => {
    Swal.fire({
      icon: "info",
      title: `${serverName} Members`,
      text: "Member management feature coming soon!",
      background: "#1e1e2e",
      color: "#ffffff",
      confirmButtonColor: "#6366F1",
    });
  };

  const handleViewResults = (serverName) => {
    Swal.fire({
      icon: "info",
      title: `${serverName} Results`,
      text: "Quiz results feature coming soon!",
      background: "#1e1e2e",
      color: "#ffffff",
      confirmButtonColor: "#6366F1",
    });
  };

  if (loading) {
    return (
      <div className="profile-page">
        <Sidebar />
        <FloatingChatButton />
        <div className="profile-content">
          <div className="profile-section">
            <QuizHippoLoader />
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
                <div className="stat-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                </div>
                <p className="stat-label">Quizzes Created</p>
                <p className="stat-value">{quizStats.quizzesCreated}</p>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 11 12 14 22 4"/>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                  </svg>
                </div>
                <p className="stat-label">Quizzes Completed</p>
                <p className="stat-value">{quizStats.quizzesCompleted}</p>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
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
                    <button 
                      className="btn-server-action btn-members"
                      onClick={() => handleViewMembers(server.name)}
                    >
                      Members
                    </button>
                    <button 
                      className="btn-server-action btn-results"
                      onClick={() => handleViewResults(server.name)}
                    >
                      Results
                    </button>
                    <button 
                      className="btn-server-action btn-delete" 
                      onClick={() => handleDeleteServer(server.id, server.name)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-servers-message">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <line x1="9" y1="9" x2="15" y2="9"/>
                  <line x1="9" y1="15" x2="15" y2="15"/>
                </svg>
                <p>No servers found. Create a server to get started!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import Sidebar from "../components/Sidebar";
// import FloatingChatButton from "../components/FloatingChatButton";
// import QuizHippoLoader from '../components/QuizHippoLoader';
// import '../css/Profile.css';

// const ProfilePage = () => {
//   const [profileData, setProfileData] = useState({
//     username: 'admin',
//     email: 'admin@admin.com',
//     profileImage: null
//   });
//   const [quizStats, setQuizStats] = useState({
//     quizzesCreated: 0,
//     quizzesCompleted: 0,
//     bestScore: 0
//   });
//   const [servers, setServers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProfileData = async () => {
//       setLoading(true);
//       try {
//         const token = localStorage.getItem("access_token");
//         if (!token) {
//           console.error("No access token found");
//           setLoading(false);
//           return;
//         }

//         const response = await axios.get(
//           "https://quizhippo.pythonanywhere.com/api/profile/",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         // Set profile data
//         setProfileData({
//           username: response.data.username,
//           email: response.data.email,
//           profileImage: response.data.avatar || null
//         });

//         // Set quiz statistics
//         setQuizStats({
//           quizzesCreated: response.data.quizzes_created,
//           quizzesCompleted: response.data.quizzes_completed,
//           bestScore: response.data.best_score
//         });

//         // Set servers
//         setServers(response.data.servers || []);
//       } catch (error) {
//         console.error("Error fetching profile data:", error);
//         if (error.response?.status === 401) {
//           console.error("Session expired. Please log in again.");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfileData();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setProfileData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSaveChanges = () => {
//     console.log('Profile data saved:', profileData);
//     // Add your save logic here
//   };

//   const handleChangePicture = () => {
//     console.log('Change picture clicked');
//     // Add your image upload logic here
//   };

//   const handleEditProfile = () => {
//     console.log('Edit profile clicked');
//     navigate('/settings');
//     // Add your edit profile logic here
//   };

//   const handleLogout = () => {
//     console.log('Logout clicked');
//     // Add your logout logic here
//   };

//   const handleDeleteServer = async (serverId) => {
//     if (!window.confirm('Are you sure you want to delete this server? This action cannot be undone.')) {
//       return;
//     }

//     try {
//       const token = localStorage.getItem("access_token");
//       if (!token) {
//         alert("You must be logged in to delete servers.");
//         return;
//       }

//       const response = await axios.delete(
//         `https://quizhippo.pythonanywhere.com/api/servers/${serverId}/delete/`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       alert(`✅ ${response.data.message}`);

//       // Refresh profile data to update servers list
//       const profileResponse = await axios.get(
//         "https://quizhippo.pythonanywhere.com/api/profile/",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       setServers(profileResponse.data.servers || []);
//     } catch (error) {
//       console.error("Error deleting server:", error);
//       if (error.response?.status === 401) {
//         alert("❌ Session expired. Please log in again.");
//       } else if (error.response?.status === 403) {
//         alert("❌ You are not allowed to delete this server.");
//       } else {
//         alert("❌ Failed to delete server. Please try again.");
//       }
//     }
//   };

//   if (loading) {
//     return (
//       <div className="profile-page">
//         <Sidebar />
//         <FloatingChatButton />
//         <div className="profile-content">
//           <div className="profile-section">
//             <QuizHippoLoader />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="profile-page">
//       <Sidebar />
//       <FloatingChatButton />
      
//       <div className="profile-content">
//         <div className="profile-section">
//           <div className="profile-header-container">
//             <div className="profile-header-left">
//               <h1 className="profile-main-title">Profile</h1>
//               <p className="profile-subtitle">Manage your account and view quiz statistics.</p>
//             </div>
//           </div>

//           {/* Profile Card */}
//           <div className="profile-card-section">
//             <div className="profile-card-container">
//               <div className="profile-card-left">
//                 <div className="profile-avatar-wrapper">
//                   <div className="profile-avatar">
//                     {profileData.profileImage ? (
//                       <img 
//                         src={profileData.profileImage} 
//                         alt="Profile" 
//                         style={{ 
//                           width: "100%", 
//                           height: "100%", 
//                           objectFit: "cover", 
//                           borderRadius: "50%" 
//                         }}
//                       />
//                     ) : (
//                       <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
//                         <path d="M30 0L35 20L40 10L42 25L50 15L48 30L60 25L52 35L60 40L50 42L55 50L45 48L47 58L37 52L35 60L30 50L25 60L23 52L13 58L15 48L5 50L10 42L0 40L8 35L0 30L12 28L10 20L18 22L15 12L25 18L23 8L30 15V0Z" fill="#6366F1"/>
//                       </svg>
//                     )}
//                   </div>
//                 </div>
//                 <div className="profile-info">
//                   <h2 className="profile-username">{profileData.username}</h2>
//                   <p className="profile-email">{profileData.email}</p>
//                 </div>
//               </div>
//               <button className="btn-edit-profile" onClick={handleEditProfile}>
//                 Edit Profile
//               </button>
//             </div>
//           </div>

//           {/* Quiz Statistics */}
//           <div className="stats-section">
//             <h2 className="section-heading">Quiz Statistics</h2>
//             <div className="stats-grid">
//               <div className="stat-card">
//                 <p className="stat-label">Quizzes Created</p>
//                 <p className="stat-value">{quizStats.quizzesCreated}</p>
//               </div>
//               <div className="stat-card">
//                 <p className="stat-label">Quizzes Completed</p>
//                 <p className="stat-value">{quizStats.quizzesCompleted}</p>
//               </div>
//               <div className="stat-card">
//                 <p className="stat-label">Best Score</p>
//                 <p className="stat-value">{quizStats.bestScore}%</p>
//               </div>
//             </div>
//           </div>

//           {/* Your Servers */}
//           <div className="servers-section">
//             <h2 className="section-heading">Your Servers</h2>
//             {servers.length > 0 ? (
//               servers.map((server) => (
//                 <div key={server.id} className="server-card">
//                   <div className="server-info">
//                     <h3 className="server-name">{server.name}</h3>
//                     <p className="server-description">{server.description || "no description provided"}</p>
//                     <p className="server-code">Created: {new Date(server.created_at).toLocaleDateString()}</p>
//                   </div>
//                   <div className="server-actions">
//                     <button className="btn-server-action btn-members">Members</button>
//                     <button className="btn-server-action btn-results">Results</button>
//                     <button className="btn-server-action btn-delete" onClick={() => handleDeleteServer(server.id)}>Delete</button>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p>No servers found.</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;