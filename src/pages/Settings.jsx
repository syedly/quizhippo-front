import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Sidebar from "../components/Sidebar";
import FloatingChatButton from "../components/FloatingChatButton";
import QuizHippoLoader from "../components/QuizHippoLoader";
import "../css/Settings.css";

const Settings = () => {
  const [username, setUsername] = useState("admin");
  const [email, setEmail] = useState("admin@admin.com");
  const [lightMode, setLightMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [profileErrors, setProfileErrors] = useState({});

  // Password change states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState({});

  // ✅ Fetch current user preferences and profile data when the component loads
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          setPageLoading(false);
          return;
        }

        // Fetch preferences
        const preferencesResponse = await axios.get(
          "https://quizhippo.pythonanywhere.com/api/preferences/update/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Set saved preferences
        setLightMode(preferencesResponse.data.light_mode);

        // Fetch profile data (username, email, avatar)
        const profileResponse = await axios.get(
          "https://quizhippo.pythonanywhere.com/api/update-profile/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Set profile data
        setUsername(profileResponse.data.username);
        setEmail(profileResponse.data.email);
        if (profileResponse.data.avatar) {
          setProfileImagePreview(profileResponse.data.avatar);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load user data. Please try again.",
          background: "#1e1e2e",
          color: "#ffffff",
          confirmButtonColor: "#6366F1",
        });
      } finally {
        setPageLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // ✅ Update preferences (POST request)
  const handleSavePreferences = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        Swal.fire({
          icon: "warning",
          title: "Authentication Required",
          text: "You must be logged in to save preferences.",
          background: "#1e1e2e",
          color: "#ffffff",
          confirmButtonColor: "#6366F1",
        });
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "https://quizhippo.pythonanywhere.com/api/preferences/update/",
        { light_mode: lightMode },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: response.data.message,
        background: "#1e1e2e",
        color: "#ffffff",
        confirmButtonColor: "#6366F1",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error saving preferences:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Session Expired",
          text: "Please log in again.",
          background: "#1e1e2e",
          color: "#ffffff",
          confirmButtonColor: "#6366F1",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to save preferences. Please try again.",
          background: "#1e1e2e",
          color: "#ffffff",
          confirmButtonColor: "#6366F1",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    setProfileErrors({});
    
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        Swal.fire({
          icon: "warning",
          title: "Authentication Required",
          text: "You must be logged in to save profile changes.",
          background: "#1e1e2e",
          color: "#ffffff",
          confirmButtonColor: "#6366F1",
        });
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("new_username", username);
      formData.append("new_email", email);
      
      if (profileImage) {
        formData.append("profile_image", profileImage);
      }

      const response = await axios.put(
        "https://quizhippo.pythonanywhere.com/api/update-profile/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Profile Updated!",
        text: response.data.message,
        background: "#1e1e2e",
        color: "#ffffff",
        confirmButtonColor: "#6366F1",
        timer: 2000,
        showConfirmButton: false,
      });
      
      // Update state with new values from response
      setUsername(response.data.username);
      setEmail(response.data.email);
      
      if (response.data.avatar) {
        setProfileImagePreview(response.data.avatar);
      }
      
      // Clear the file input
      setProfileImage(null);
    } catch (error) {
      console.error("Error saving profile:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Session Expired",
          text: "Please log in again.",
          background: "#1e1e2e",
          color: "#ffffff",
          confirmButtonColor: "#6366F1",
        });
      } else if (error.response?.status === 400 && error.response.data.error) {
        setProfileErrors({ general: error.response.data.error });
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data.error,
          background: "#1e1e2e",
          color: "#ffffff",
          confirmButtonColor: "#6366F1",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to save profile changes. Please try again.",
          background: "#1e1e2e",
          color: "#ffffff",
          confirmButtonColor: "#6366F1",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangePicture = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          Swal.fire({
            icon: "error",
            title: "File Too Large",
            text: "Please select an image smaller than 5MB.",
            background: "#1e1e2e",
            color: "#ffffff",
            confirmButtonColor: "#6366F1",
          });
          return;
        }

        setProfileImage(file);
        
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfileImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  };

  const handleChangePassword = () => {
    setShowPasswordModal(true);
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setPasswordErrors({});
  };

  const validatePasswordForm = () => {
    const errors = {};
    if (!oldPassword) {
      errors.oldPassword = "Current password is required";
    }
    if (!newPassword) {
      errors.newPassword = "New password is required";
    } else if (newPassword.length < 6) {
      errors.newPassword = "New password must be at least 6 characters";
    }
    if (!confirmNewPassword) {
      errors.confirmNewPassword = "Please confirm your new password";
    } else if (newPassword !== confirmNewPassword) {
      errors.confirmNewPassword = "Passwords do not match";
    }
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = async () => {
    if (!validatePasswordForm()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        Swal.fire({
          icon: "warning",
          title: "Authentication Required",
          text: "You must be logged in to change your password.",
          background: "#1e1e2e",
          color: "#ffffff",
          confirmButtonColor: "#6366F1",
        });
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "https://quizhippo.pythonanywhere.com/api/change-pwd/",
        {
          password: oldPassword,
          new_password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Password Changed!",
        text: response.data.message,
        background: "#1e1e2e",
        color: "#ffffff",
        confirmButtonColor: "#6366F1",
        timer: 2000,
        showConfirmButton: false,
      });
      setShowPasswordModal(false);
    } catch (error) {
      console.error("Error changing password:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Session Expired",
          text: "Please log in again.",
          background: "#1e1e2e",
          color: "#ffffff",
          confirmButtonColor: "#6366F1",
        });
      } else if (error.response?.status === 400 && error.response.data.error) {
        setPasswordErrors(prev => ({ ...prev, oldPassword: error.response.data.error }));
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data.error,
          background: "#1e1e2e",
          color: "#ffffff",
          confirmButtonColor: "#6366F1",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to change password. Please try again.",
          background: "#1e1e2e",
          color: "#ffffff",
          confirmButtonColor: "#6366F1",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordErrors({});
  };

  const handleCloseAccount = async () => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete Account?",
      text: "Are you sure you want to delete your account? This action cannot be undone.",
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

    setLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");

      if (!accessToken || !refreshToken) {
        Swal.fire({
          icon: "warning",
          title: "Authentication Required",
          text: "You must be logged in to delete your account.",
          background: "#1e1e2e",
          color: "#ffffff",
          confirmButtonColor: "#6366F1",
        });
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "https://quizhippo.pythonanywhere.com/api/delete-account/",
        { refresh: refreshToken },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      await Swal.fire({
        icon: "success",
        title: "Account Deleted",
        text: response.data.message,
        background: "#1e1e2e",
        color: "#ffffff",
        confirmButtonColor: "#6366F1",
        timer: 2000,
        showConfirmButton: false,
      });

      // Clear localStorage and redirect to home
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/";
    } catch (error) {
      setLoading(false);
      console.error("Error deleting account:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Session Expired",
          text: "Please log in again.",
          background: "#1e1e2e",
          color: "#ffffff",
          confirmButtonColor: "#6366F1",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete account. Please try again.",
          background: "#1e1e2e",
          color: "#ffffff",
          confirmButtonColor: "#6366F1",
        });
      }
    }
  };

  // Show loader while fetching initial data
  if (pageLoading) {
    return <QuizHippoLoader />;
  }

  return (
    <div className={`settings-page ${lightMode ? "light-theme" : "dark-theme"}`}>
      <Sidebar />
      <div className="settings-content">
        <h1 className="settings-title">Settings</h1>

        {/* PROFILE SECTION */}
        <section className="settings-section">
          <div className="section-container">
            <h2 className="section-title">Profile</h2>
            <div className="profile-container">
              <div className="profile-image-section">
                <div className="profile-image">
                  {profileImagePreview ? (
                    <img 
                      src={profileImagePreview} 
                      alt="Profile" 
                      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                    />
                  ) : (
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"
                        fill="#6366F1"
                      />
                    </svg>
                  )}
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

                <button 
                  className="btn-save-changes" 
                  onClick={handleSaveChanges}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ACCOUNT SECTION */}
        <section className="settings-section">
          <div className="section-container">
            <h2 className="section-title">Account</h2>
            <div className="account-actions">
              <button className="account-btn" onClick={handleChangePassword} disabled={loading}>
                <span>Change Password</span>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>

              <button className="account-btn btn-danger" onClick={handleCloseAccount} disabled={loading}>
                <span>{loading ? "Deleting..." : "Close Account"}</span>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h12V5H6v14zm3-3h6v-2H9v2z" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* PREFERENCES SECTION */}
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

              <button
                className="btn-save-preferences"
                onClick={handleSavePreferences}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Preferences"}
              </button>
            </div>
          </div>
        </section>
      </div>
      <FloatingChatButton />

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Change Password</h3>
              <button className="modal-close" onClick={handleClosePasswordModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className={`form-input ${passwordErrors.oldPassword ? "error" : ""}`}
                  placeholder="Enter your current password"
                />
                {passwordErrors.oldPassword && <span className="error-message">{passwordErrors.oldPassword}</span>}
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`form-input ${passwordErrors.newPassword ? "error" : ""}`}
                  placeholder="Enter new password"
                />
                {passwordErrors.newPassword && <span className="error-message">{passwordErrors.newPassword}</span>}
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className={`form-input ${passwordErrors.confirmNewPassword ? "error" : ""}`}
                  placeholder="Confirm new password"
                />
                {passwordErrors.confirmNewPassword && <span className="error-message">{passwordErrors.confirmNewPassword}</span>}
              </div>
              <button
                className="btn-save-changes"
                onClick={handlePasswordSubmit}
                disabled={loading}
              >
                {loading ? "Changing..." : "Change Password"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Sidebar from "../components/Sidebar";
// import FloatingChatButton from "../components/FloatingChatButton";
// import "../css/Settings.css";

// const Settings = () => {
//   const [username, setUsername] = useState("admin");
//   const [email, setEmail] = useState("admin@admin.com");
//   const [lightMode, setLightMode] = useState(false);
//   const [emailNotifications, setEmailNotifications] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [profileImage, setProfileImage] = useState(null);
//   const [profileImagePreview, setProfileImagePreview] = useState(null);
//   const [profileErrors, setProfileErrors] = useState({});

//   // Password change states
//   const [showPasswordModal, setShowPasswordModal] = useState(false);
//   const [oldPassword, setOldPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmNewPassword, setConfirmNewPassword] = useState("");
//   const [passwordErrors, setPasswordErrors] = useState({});

//   // ✅ Fetch current user preferences and profile data when the component loads
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const token = localStorage.getItem("access_token");
//         if (!token) return;

//         // Fetch preferences
//         const preferencesResponse = await axios.get(
//           "https://quizhippo.pythonanywhere.com/api/preferences/update/",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         // Set saved preferences
//         setLightMode(preferencesResponse.data.light_mode);

//         // Fetch profile data (username, email, avatar)
//         const profileResponse = await axios.get(
//           "https://quizhippo.pythonanywhere.com/api/update-profile/",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         // Set profile data
//         setUsername(profileResponse.data.username);
//         setEmail(profileResponse.data.email);
//         if (profileResponse.data.avatar) {
//           setProfileImagePreview(profileResponse.data.avatar);
//         }
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       }
//     };

//     fetchUserData();
//   }, []);

//   // ✅ Update preferences (POST request)
//   const handleSavePreferences = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("access_token");
//       if (!token) {
//         alert("You must be logged in to save preferences.");
//         setLoading(false);
//         return;
//       }

//       const response = await axios.post(
//         "https://quizhippo.pythonanywhere.com/api/preferences/update/",
//         { light_mode: lightMode },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       alert(`✅ ${response.data.message}`);
//     } catch (error) {
//       console.error("Error saving preferences:", error.response?.data || error.message);
//       if (error.response?.status === 401) {
//         alert("❌ Session expired. Please log in again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSaveChanges = async () => {
//     setLoading(true);
//     setProfileErrors({});
    
//     try {
//       const token = localStorage.getItem("access_token");
//       if (!token) {
//         alert("You must be logged in to save profile changes.");
//         setLoading(false);
//         return;
//       }

//       const formData = new FormData();
//       formData.append("new_username", username);
//       formData.append("new_email", email);
      
//       if (profileImage) {
//         formData.append("profile_image", profileImage);
//       }

//       const response = await axios.put(
//         "https://quizhippo.pythonanywhere.com/api/update-profile/",
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       alert(`✅ ${response.data.message}`);
      
//       // Update state with new values from response
//       setUsername(response.data.username);
//       setEmail(response.data.email);
      
//       if (response.data.avatar) {
//         setProfileImagePreview(response.data.avatar);
//       }
      
//       // Clear the file input
//       setProfileImage(null);
//     } catch (error) {
//       console.error("Error saving profile:", error.response?.data || error.message);
//       if (error.response?.status === 401) {
//         alert("❌ Session expired. Please log in again.");
//       } else if (error.response?.status === 400 && error.response.data.error) {
//         setProfileErrors({ general: error.response.data.error });
//         alert(`❌ ${error.response.data.error}`);
//       } else {
//         alert("❌ Failed to save profile changes. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChangePicture = () => {
//     const fileInput = document.createElement("input");
//     fileInput.type = "file";
//     fileInput.accept = "image/*";
//     fileInput.onchange = (e) => {
//       const file = e.target.files[0];
//       if (file) {
//         setProfileImage(file);
        
//         // Create preview
//         const reader = new FileReader();
//         reader.onloadend = () => {
//           setProfileImagePreview(reader.result);
//         };
//         reader.readAsDataURL(file);
//       }
//     };
//     fileInput.click();
//   };

//   const handleChangePassword = () => {
//     setShowPasswordModal(true);
//     setOldPassword("");
//     setNewPassword("");
//     setConfirmNewPassword("");
//     setPasswordErrors({});
//   };

//   const validatePasswordForm = () => {
//     const errors = {};
//     if (!oldPassword) {
//       errors.oldPassword = "Current password is required";
//     }
//     if (!newPassword) {
//       errors.newPassword = "New password is required";
//     } else if (newPassword.length < 6) {
//       errors.newPassword = "New password must be at least 6 characters";
//     }
//     if (!confirmNewPassword) {
//       errors.confirmNewPassword = "Please confirm your new password";
//     } else if (newPassword !== confirmNewPassword) {
//       errors.confirmNewPassword = "Passwords do not match";
//     }
//     setPasswordErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handlePasswordSubmit = async () => {
//     if (!validatePasswordForm()) return;

//     setLoading(true);
//     try {
//       const token = localStorage.getItem("access_token");
//       if (!token) {
//         alert("You must be logged in to change your password.");
//         setLoading(false);
//         return;
//       }

//       const response = await axios.post(
//         "https://quizhippo.pythonanywhere.com/api/change-pwd/",
//         {
//           password: oldPassword,
//           new_password: newPassword,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       alert(`✅ ${response.data.message}`);
//       setShowPasswordModal(false);
//     } catch (error) {
//       console.error("Error changing password:", error.response?.data || error.message);
//       if (error.response?.status === 401) {
//         alert("❌ Session expired. Please log in again.");
//       } else if (error.response?.status === 400 && error.response.data.error) {
//         setPasswordErrors(prev => ({ ...prev, oldPassword: error.response.data.error }));
//       } else {
//         alert("❌ Failed to change password. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClosePasswordModal = () => {
//     setShowPasswordModal(false);
//     setPasswordErrors({});
//   };

//   const handleCloseAccount = async () => {
//     if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
//       return;
//     }

//     setLoading(true);
//     try {
//       const accessToken = localStorage.getItem("access_token");
//       const refreshToken = localStorage.getItem("refresh_token");

//       if (!accessToken || !refreshToken) {
//         alert("❌ You must be logged in to delete your account.");
//         setLoading(false);
//         return;
//       }

//       const response = await axios.post(
//         "https://quizhippo.pythonanywhere.com/api/delete-account/",
//         { refresh: refreshToken },
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       alert(response.data.message);

//       // Clear localStorage and redirect to home
//       localStorage.removeItem("access_token");
//       localStorage.removeItem("refresh_token");
//       window.location.href = "/";
//     } catch (error) {
//       setLoading(false);
//       console.error("Error deleting account:", error.response?.data || error.message);
//       if (error.response?.status === 401) {
//         alert("❌ Session expired. Please log in again.");
//       } else {
//         alert("❌ Failed to delete account. Please try again.");
//       }
//     }
//   };

//   return (
//     <div className={`settings-page ${lightMode ? "light-theme" : "dark-theme"}`}>
//       <Sidebar />
//       <div className="settings-content">
//         <h1 className="settings-title">Settings</h1>

//         {/* PROFILE SECTION */}
//         <section className="settings-section">
//           <div className="section-container">
//             <h2 className="section-title">Profile</h2>
//             <div className="profile-container">
//               <div className="profile-image-section">
//                 <div className="profile-image">
//                   {profileImagePreview ? (
//                     <img 
//                       src={profileImagePreview} 
//                       alt="Profile" 
//                       style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
//                     />
//                   ) : (
//                     <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
//                       <path
//                         d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"
//                         fill="#6366F1"
//                       />
//                     </svg>
//                   )}
//                 </div>
//                 <button className="btn-change-picture" onClick={handleChangePicture}>
//                   Change Picture
//                 </button>
//               </div>

//               <div className="profile-form">
//                 <div className="form-group">
//                   <label>Username</label>
//                   <input
//                     type="text"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     className="form-input"
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label>Email</label>
//                   <input
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="form-input"
//                   />
//                 </div>

//                 <button 
//                   className="btn-save-changes" 
//                   onClick={handleSaveChanges}
//                   disabled={loading}
//                 >
//                   {loading ? "Saving..." : "Save Changes"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* ACCOUNT SECTION */}
//         <section className="settings-section">
//           <div className="section-container">
//             <h2 className="section-title">Account</h2>
//             <div className="account-actions">
//               <button className="account-btn" onClick={handleChangePassword} disabled={loading}>
//                 <span>Change Password</span>
//                 <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M9 18l6-6-6-6" />
//                 </svg>
//               </button>

//               <button className="account-btn btn-danger" onClick={handleCloseAccount} disabled={loading}>
//                 <span>{loading ? "Deleting..." : "Close Account"}</span>
//                 <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M6 19h12V5H6v14zm3-3h6v-2H9v2z" />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </section>

//         {/* PREFERENCES SECTION */}
//         <section className="settings-section">
//           <div className="section-container">
//             <h2 className="section-title">Preferences</h2>
//             <div className="preferences-container">
//               <div className="preference-item">
//                 <span>Light Mode</span>
//                 <label className="toggle-switch">
//                   <input
//                     type="checkbox"
//                     checked={lightMode}
//                     onChange={(e) => setLightMode(e.target.checked)}
//                   />
//                   <span className="toggle-slider"></span>
//                 </label>
//               </div>

//               <div className="preference-item">
//                 <span>Email Notifications</span>
//                 <label className="toggle-switch">
//                   <input
//                     type="checkbox"
//                     checked={emailNotifications}
//                     onChange={(e) => setEmailNotifications(e.target.checked)}
//                   />
//                   <span className="toggle-slider"></span>
//                 </label>
//               </div>

//               <button
//                 className="btn-save-preferences"
//                 onClick={handleSavePreferences}
//                 disabled={loading}
//               >
//                 {loading ? "Saving..." : "Save Preferences"}
//               </button>
//             </div>
//           </div>
//         </section>
//       </div>
//       <FloatingChatButton />

//       {/* Password Change Modal */}
//       {showPasswordModal && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h3>Change Password</h3>
//               <button className="modal-close" onClick={handleClosePasswordModal}>
//                 ×
//               </button>
//             </div>
//             <div className="modal-body">
//               <div className="form-group">
//                 <label>Current Password</label>
//                 <input
//                   type="password"
//                   value={oldPassword}
//                   onChange={(e) => setOldPassword(e.target.value)}
//                   className={`form-input ${passwordErrors.oldPassword ? "error" : ""}`}
//                   placeholder="Enter your current password"
//                 />
//                 {passwordErrors.oldPassword && <span className="error-message">{passwordErrors.oldPassword}</span>}
//               </div>
//               <div className="form-group">
//                 <label>New Password</label>
//                 <input
//                   type="password"
//                   value={newPassword}
//                   onChange={(e) => setNewPassword(e.target.value)}
//                   className={`form-input ${passwordErrors.newPassword ? "error" : ""}`}
//                   placeholder="Enter new password"
//                 />
//                 {passwordErrors.newPassword && <span className="error-message">{passwordErrors.newPassword}</span>}
//               </div>
//               <div className="form-group">
//                 <label>Confirm New Password</label>
//                 <input
//                   type="password"
//                   value={confirmNewPassword}
//                   onChange={(e) => setConfirmNewPassword(e.target.value)}
//                   className={`form-input ${passwordErrors.confirmNewPassword ? "error" : ""}`}
//                   placeholder="Confirm new password"
//                 />
//                 {passwordErrors.confirmNewPassword && <span className="error-message">{passwordErrors.confirmNewPassword}</span>}
//               </div>
//               <button
//                 className="btn-save-changes"
//                 onClick={handlePasswordSubmit}
//                 disabled={loading}
//               >
//                 {loading ? "Changing..." : "Change Password"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Settings;