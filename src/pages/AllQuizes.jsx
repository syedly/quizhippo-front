import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Sidebar from "../components/Sidebar";
import FloatingChatButton from "../components/FloatingChatButton";
import QuizHippoLoader from '../components/QuizHippoLoader';
import '../css/all-quizes.css';

const AllQuizzes = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [quizzes, setQuizzes] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attemptedIds, setAttemptedIds] = useState(new Set());
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUsername, setShareUsername] = useState('');
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [shareLoading, setShareLoading] = useState(false);
  const pageSize = 5;

  const getDifficultyText = (diff) => {
    switch (diff) {
      case 1: return 'Easy';
      case 2: return 'Medium';
      case 3: return 'Hard';
      case 4: return 'Expert';
      default: return 'Unknown';
    }
  };

  const getDifficultyLevel = (diff) => diff * 25;

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        const response = await axios.get(
          "https://quizhippo.pythonanywhere.com/api/quiz/attempts/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const ids = new Set(response.data.attempted.map(q => q.id));
        setAttemptedIds(ids);
      } catch (err) {
        console.error("Error fetching attempts:", err);
      }
    };

    fetchAttempts();
  }, []);

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          Swal.fire({
            icon: "warning",
            title: "Authentication Required",
            text: "You must be logged in to view quizzes.",
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
          `https://quizhippo.pythonanywhere.com/api/all-quizzes/?page=${currentPage}&page_size=${pageSize}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const apiQuizzes = response.data.results || [];
        const totalCount = response.data.count || 0;
        setTotalPages(Math.ceil(totalCount / pageSize));
        setQuizzes(apiQuizzes.map(quiz => ({
          id: quiz.id,
          title: quiz.topic || 'Untitled Quiz',
          difficulty: getDifficultyText(quiz.difficulty),
          difficultyLevel: getDifficultyLevel(quiz.difficulty),
          isPublic: quiz.is_public || false,
        })));
      } catch (err) {
        console.error("Error fetching quizzes:", err);
        if (err.response?.status === 401) {
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
            title: "Loading Failed",
            text: "Failed to fetch quizzes. Please try again.",
            background: "#1e1e2e",
            color: "#ffffff",
            confirmButtonColor: "#6366F1",
          });
        }
        setError("Failed to fetch quizzes. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [currentPage, navigate]);

  const handleRefresh = (quizId) => {
    Swal.fire({
      icon: "info",
      title: "Refresh Quiz",
      text: "Quiz refresh feature coming soon!",
      background: "#1e1e2e",
      color: "#ffffff",
      confirmButtonColor: "#6366F1",
    });
  };

  const handleView = (quizId) => {
    navigate(`/quizzes/${quizId}`);
  };

  const handleInfo = (quizId) => {
    navigate(`/quizzes/${quizId}`);
  };

  const handleShare = (quizId) => {
    setSelectedQuizId(quizId);
    setShareUsername('');
    setShowShareModal(true);
  };

  const handleCloseShareModal = () => {
    setShowShareModal(false);
    setShareUsername('');
    setSelectedQuizId(null);
  };

  const handleShareSubmit = async () => {
    if (!shareUsername.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Username Required",
        text: "Please enter a username to share with.",
        background: "#1e1e2e",
        color: "#ffffff",
        confirmButtonColor: "#6366F1",
      });
      return;
    }

    setShareLoading(true);

    // Show loading
    Swal.fire({
      title: 'Sharing Quiz...',
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
          text: "You must be logged in to share quizzes.",
          background: "#1e1e2e",
          color: "#ffffff",
          confirmButtonColor: "#6366F1",
        });
        setShareLoading(false);
        return;
      }

      const response = await axios.post(
        `https://quizhippo.pythonanywhere.com/api/share-quiz/${selectedQuizId}/`,
        { username: shareUsername.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Quiz Shared!",
        html: `Quiz has been shared with <strong>${shareUsername}</strong>.`,
        background: "#1e1e2e",
        color: "#ffffff",
        confirmButtonColor: "#6366F1",
        timer: 2000,
        showConfirmButton: false,
      });
      handleCloseShareModal();
    } catch (error) {
      console.error("Error sharing quiz:", error);
      if (error.response?.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Session Expired",
          text: "Please log in again.",
          background: "#1e1e2e",
          color: "#ffffff",
          confirmButtonColor: "#6366F1",
        });
      } else if (error.response?.status === 404) {
        Swal.fire({
          icon: "error",
          title: "User Not Found",
          text: error.response.data.error || `User "${shareUsername}" not found.`,
          background: "#1e1e2e",
          color: "#ffffff",
          confirmButtonColor: "#6366F1",
        });
      } else if (error.response?.status === 400) {
        Swal.fire({
          icon: "error",
          title: "Invalid Request",
          text: error.response.data.error || "Please check your input.",
          background: "#1e1e2e",
          color: "#ffffff",
          confirmButtonColor: "#6366F1",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Share Failed",
          text: "Failed to share quiz. Please try again.",
          background: "#1e1e2e",
          color: "#ffffff",
          confirmButtonColor: "#6366F1",
        });
      }
    } finally {
      setShareLoading(false);
    }
  };

  const handleDelete = async (quiz) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete Quiz?",
      html: `Are you sure you want to delete <strong>"${quiz.title}"</strong>?<br><br>This action cannot be undone.`,
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

    // Show loading
    Swal.fire({
      title: 'Deleting Quiz...',
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
          text: "You must be logged in to delete a quiz.",
          background: "#1e1e2e",
          color: "#ffffff",
          confirmButtonColor: "#6366F1",
        });
        return;
      }

      await axios.delete(
        `https://quizhippo.pythonanywhere.com/api/quiz/${quiz.id}/delete/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Quiz Deleted!",
        text: `"${quiz.title}" has been successfully deleted.`,
        background: "#1e1e2e",
        color: "#ffffff",
        confirmButtonColor: "#6366F1",
        timer: 2000,
        showConfirmButton: false,
      });

      setQuizzes(prev => prev.filter(q => q.id !== quiz.id));

      // If this was the last quiz on the page, go to previous page
      if (quizzes.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error("Error deleting quiz:", error);
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
          text: "You don't have permission to delete this quiz.",
          background: "#1e1e2e",
          color: "#ffffff",
          confirmButtonColor: "#6366F1",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: "Failed to delete quiz. Please try again.",
          background: "#1e1e2e",
          color: "#ffffff",
          confirmButtonColor: "#6366F1",
        });
      }
    }
  };

  const handlePlay = (quizId) => {
    navigate(`/quiz/${quizId}/submit`);
  };

  const handleRetake = (quizId) => {
    navigate(`/retake-quiz/${quizId}/submit`);
  };

  const handleViewResults = (quizId) => {
    navigate(`/quiz-result/${quizId}`);
  };

  const handlePublicToggle = async (quizId) => {
    const quizIndex = quizzes.findIndex(q => q.id === quizId);
    if (quizIndex === -1) return;

    const currentQuiz = quizzes[quizIndex];
    const newIsPublic = !currentQuiz.isPublic;

    // Optimistically update UI
    setQuizzes(prev => prev.map(q => 
      q.id === quizId ? { ...q, isPublic: newIsPublic } : q
    ));

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No token");
      }

      const response = await axios.post(
        `https://quizhippo.pythonanywhere.com/api/quiz/${quizId}/visibility/`,
        { is_public: newIsPublic },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Show toast notification
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        background: "#1e1e2e",
        color: "#ffffff",
      });

      Toast.fire({
        icon: 'success',
        title: newIsPublic ? 'Quiz is now public' : 'Quiz is now private'
      });
    } catch (error) {
      // Revert on error
      setQuizzes(prev => prev.map(q => 
        q.id === quizId ? { ...q, isPublic: currentQuiz.isPublic } : q
      ));

      console.error("Error toggling visibility:", error);
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
          title: "Update Failed",
          text: "Failed to update visibility. Please try again.",
          background: "#1e1e2e",
          color: "#ffffff",
          confirmButtonColor: "#6366F1",
        });
      }
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getDifficultyColor = (difficultyLevel) => {
    if (difficultyLevel <= 25) return '#10b981'; // Easy - Green
    if (difficultyLevel <= 50) return '#f59e0b'; // Medium - Orange
    return '#ef4444'; // Hard/Expert - Red
  };

  if (loading) {
    return (
      <div className="all-quizzes-page">
        <Sidebar />
        <FloatingChatButton />
        <div className="all-quizzes-content">
          <div className="all-quizzes-section">
            <QuizHippoLoader />
          </div>
        </div>
      </div>
    );
  }

  if (error && quizzes.length === 0) {
    return (
      <div className="all-quizzes-page">
        <Sidebar />
        <FloatingChatButton />
        <div className="all-quizzes-content">
          <div className="all-quizzes-section">
            <div className="error-container">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p className="error-message">{error}</p>
              <button 
                className="btn-retry"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="all-quizzes-page">
      <Sidebar />
      <FloatingChatButton />
      
      <div className="all-quizzes-content">
        <div className="all-quizzes-section">
          {/* Quiz Table */}
          <div className="quiz-table-container">
            <table className="quiz-table">
              <thead>
                <tr>
                  <th className="table-header">Quiz Title</th>
                  <th className="table-header">Difficulty</th>
                  <th className="table-header">Public</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.length > 0 ? (
                  quizzes.map((quiz) => {
                    const isAttempted = attemptedIds.has(quiz.id);
                    return (
                      <tr key={quiz.id} className="table-row">
                        <td className="table-cell quiz-title-cell">
                          {quiz.title}
                        </td>
                        <td className="table-cell">
                          <div className="difficulty-container">
                            <div className="difficulty-bar-wrapper">
                              <div 
                                className="difficulty-bar-fill" 
                                style={{ 
                                  width: `${quiz.difficultyLevel}%`,
                                  backgroundColor: getDifficultyColor(quiz.difficultyLevel)
                                }}
                              ></div>
                            </div>
                            <span className="difficulty-text">{quiz.difficulty}</span>
                          </div>
                        </td>
                        <td className="table-cell">
                          <label className="checkbox-container">
                            <input 
                              type="checkbox" 
                              checked={quiz.isPublic}
                              onChange={() => handlePublicToggle(quiz.id)}
                            />
                            <span className="checkbox-checkmark"></span>
                          </label>
                        </td>
                        <td className="table-cell">
                          <div className="actions-container">
                            {isAttempted ? (
                              <>
                                <button 
                                  className="action-btn play-btn" 
                                  onClick={() => handleRetake(quiz.id)}
                                  title="Retake"
                                >
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <polygon points="5 3 19 12 5 21 5 3"/>
                                  </svg>
                                </button>
                                <button 
                                  className="action-btn view-btn" 
                                  onClick={() => handleViewResults(quiz.id)}
                                  title="View Results"
                                >
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                    <circle cx="12" cy="12" r="3"/>
                                  </svg>
                                </button>
                                <button 
                                  className="action-btn info-btn" 
                                  onClick={() => handleInfo(quiz.id)}
                                  title="Info"
                                >
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"/>
                                    <line x1="12" y1="16" x2="12" y2="12"/>
                                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                                  </svg>
                                </button>
                                <button 
                                  className="action-btn share-btn" 
                                  onClick={() => handleShare(quiz.id)}
                                  title="Share"
                                >
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="18" cy="5" r="3"/>
                                    <circle cx="6" cy="12" r="3"/>
                                    <circle cx="18" cy="19" r="3"/>
                                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                                  </svg>
                                </button>
                                <button 
                                  className="action-btn delete-btn" 
                                  onClick={() => handleDelete(quiz)}
                                  title="Delete"
                                >
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="3 6 5 6 21 6"/>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                    <line x1="10" y1="11" x2="10" y2="17"/>
                                    <line x1="14" y1="11" x2="14" y2="17"/>
                                  </svg>
                                </button>
                              </>
                            ) : (
                              <>
                                <button 
                                  className="action-btn play-btn" 
                                  onClick={() => handlePlay(quiz.id)}
                                  title="Play"
                                >
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <polygon points="5 3 19 12 5 21 5 3"/>
                                  </svg>
                                </button>
                                <button 
                                  className="action-btn info-btn" 
                                  onClick={() => handleInfo(quiz.id)}
                                  title="Info"
                                >
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"/>
                                    <line x1="12" y1="16" x2="12" y2="12"/>
                                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                                  </svg>
                                </button>
                                <button 
                                  className="action-btn share-btn" 
                                  onClick={() => handleShare(quiz.id)}
                                  title="Share"
                                >
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="18" cy="5" r="3"/>
                                    <circle cx="6" cy="12" r="3"/>
                                    <circle cx="18" cy="19" r="3"/>
                                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                                  </svg>
                                </button>
                                <button 
                                  className="action-btn delete-btn" 
                                  onClick={() => handleDelete(quiz)}
                                  title="Delete"
                                >
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="3 6 5 6 21 6"/>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                    <line x1="10" y1="11" x2="10" y2="17"/>
                                    <line x1="14" y1="11" x2="14" y2="17"/>
                                  </svg>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="no-quizzes-cell">
                      <div className="no-quizzes-message">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                        </svg>
                        <p>No quizzes found. Create your first quiz to get started!</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {quizzes.length > 0 && (
            <div className="pagination-container">
              <button 
                className="btn-prev" 
                onClick={handlePrevious}
                disabled={currentPage === 1}
                style={{ display: currentPage === 1 ? 'none' : 'inline-block' }}
              >
                Previous
              </button>
              <span className="pagination-text">Page {currentPage} of {totalPages}</span>
              <button 
                className="btn-next" 
                onClick={handleNext}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Share Quiz Modal */}
      {showShareModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Share Quiz</h3>
              <button className="modal-close" onClick={handleCloseShareModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={shareUsername}
                  onChange={(e) => setShareUsername(e.target.value)}
                  className="form-input"
                  placeholder="Enter username to share with"
                  disabled={shareLoading}
                />
              </div>
              <button
                className="btn-save-changes"
                onClick={handleShareSubmit}
                disabled={shareLoading}
              >
                {shareLoading ? "Sharing..." : "Share Quiz"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllQuizzes;
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import Sidebar from "../components/Sidebar";
// import FloatingChatButton from "../components/FloatingChatButton";
// import '../css/all-quizes.css';

// const AllQuizzes = () => {
//   const navigate = useNavigate();
//   const [currentPage, setCurrentPage] = useState(1);
//   const [quizzes, setQuizzes] = useState([]);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [attemptedIds, setAttemptedIds] = useState(new Set());
//   const [showShareModal, setShowShareModal] = useState(false);
//   const [shareUsername, setShareUsername] = useState('');
//   const [selectedQuizId, setSelectedQuizId] = useState(null);
//   const [shareLoading, setShareLoading] = useState(false);
//   const pageSize = 5;

//   const getDifficultyText = (diff) => {
//     switch (diff) {
//       case 1: return 'Easy';
//       case 2: return 'Medium';
//       case 3: return 'Hard';
//       case 4: return 'Expert';
//       default: return 'Unknown';
//     }
//   };

//   const getDifficultyLevel = (diff) => diff * 25;

//   useEffect(() => {
//     const fetchAttempts = async () => {
//       try {
//         const token = localStorage.getItem("access_token");
//         if (!token) return;

//         const response = await axios.get(
//           "https://quizhippo.pythonanywhere.com/api/quiz/attempts/",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         const ids = new Set(response.data.attempted.map(q => q.id));
//         setAttemptedIds(ids);
//       } catch (err) {
//         console.error("Error fetching attempts:", err);
//       }
//     };

//     fetchAttempts();
//   }, []);

//   useEffect(() => {
//     const fetchQuizzes = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const token = localStorage.getItem("access_token");
//         if (!token) {
//           setError("You must be logged in to view quizzes.");
//           setLoading(false);
//           return;
//         }

//         const response = await axios.get(
//           `https://quizhippo.pythonanywhere.com/api/all-quizzes/?page=${currentPage}&page_size=${pageSize}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         const apiQuizzes = response.data.results || [];
//         const totalCount = response.data.count || 0;
//         setTotalPages(Math.ceil(totalCount / pageSize));
//         setQuizzes(apiQuizzes.map(quiz => ({
//           id: quiz.id,
//           title: quiz.topic || 'Untitled Quiz',
//           difficulty: getDifficultyText(quiz.difficulty),
//           difficultyLevel: getDifficultyLevel(quiz.difficulty),
//           isPublic: quiz.is_public || false,
//         })));
//       } catch (err) {
//         console.error("Error fetching quizzes:", err);
//         setError("Failed to fetch quizzes. Please try again.");
//         if (err.response?.status === 401) {
//           setError("Session expired. Please log in again.");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQuizzes();
//   }, [currentPage]);

//   const handleRefresh = (quizId) => {
//     console.log('Refresh quiz:', quizId);
//   };

//   const handleView = (quizId) => {
//     console.log('View quiz:', quizId);
//   };

//   const handleInfo = (quizId) => {
//     navigate(`/quizzes/${quizId}`)
//   };

//   const handleShare = (quizId) => {
//     setSelectedQuizId(quizId);
//     setShareUsername('');
//     setShowShareModal(true);
//   };

//   const handleCloseShareModal = () => {
//     setShowShareModal(false);
//     setShareUsername('');
//     setSelectedQuizId(null);
//   };

//   const handleShareSubmit = async () => {
//     if (!shareUsername.trim()) {
//       alert("Please enter a username.");
//       return;
//     }

//     setShareLoading(true);
//     try {
//       const token = localStorage.getItem("access_token");
//       if (!token) {
//         alert("You must be logged in to share quizzes.");
//         setShareLoading(false);
//         return;
//       }

//       const response = await axios.post(
//         `https://quizhippo.pythonanywhere.com/api/share-quiz/${selectedQuizId}/`,
//         { username: shareUsername.trim() },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       alert(`✅ ${response.data.message}`);
//       handleCloseShareModal();
//     } catch (error) {
//       console.error("Error sharing quiz:", error);
//       if (error.response?.status === 401) {
//         alert("❌ Session expired. Please log in again.");
//       } else if (error.response?.status === 404) {
//         alert(`❌ ${error.response.data.error || "User not found."}`);
//       } else if (error.response?.status === 400) {
//         alert(`❌ ${error.response.data.error || "Invalid request."}`);
//       } else {
//         alert("❌ Failed to share quiz. Please try again.");
//       }
//     } finally {
//       setShareLoading(false);
//     }
//   };

//   const handleDelete = async (quiz) => {
//     if (!window.confirm(`Are you sure you want to delete the quiz "${quiz.title}"? This action cannot be undone.`)) {
//       return;
//     }

//     try {
//       const token = localStorage.getItem("access_token");
//       if (!token) {
//         alert("You must be logged in to delete a quiz.");
//         return;
//       }

//       await axios.delete(
//         `https://quizhippo.pythonanywhere.com/api/quiz/${quiz.id}/delete/`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       alert("Quiz deleted successfully.");
//       setQuizzes(prev => prev.filter(q => q.id !== quiz.id));

//       // If this was the last quiz on the page, go to previous page
//       if (quizzes.length === 1 && currentPage > 1) {
//         setCurrentPage(currentPage - 1);
//       }
//     } catch (error) {
//       console.error("Error deleting quiz:", error);
//       if (error.response?.status === 401) {
//         alert("Session expired. Please log in again.");
//       } else {
//         alert("Failed to delete quiz. Please try again.");
//       }
//     }
//   };

//   const handlePlay = (quizId) => {
//     console.log('Play quiz:', quizId);
//     navigate(`/quiz/${quizId}/submit`);
//   };

//   const handleRetake = (quizId) => {
//     console.log('Retake quiz:', quizId);
//     navigate(`/retake-quiz/${quizId}/submit`);
//   };

//   const handleViewResults = (quizId) => {
//     navigate(`/quiz-result/${quizId}`);
//   };

//   const handlePublicToggle = async (quizId) => {
//     const quizIndex = quizzes.findIndex(q => q.id === quizId);
//     if (quizIndex === -1) return;

//     const currentQuiz = quizzes[quizIndex];
//     const newIsPublic = !currentQuiz.isPublic;

//     // Optimistically update UI
//     setQuizzes(prev => prev.map(q => 
//       q.id === quizId ? { ...q, isPublic: newIsPublic } : q
//     ));

//     try {
//       const token = localStorage.getItem("access_token");
//       if (!token) {
//         throw new Error("No token");
//       }

//       const response = await axios.post(
//         `https://quizhippo.pythonanywhere.com/api/quiz/${quizId}/visibility/`,
//         { is_public: newIsPublic },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       // If success, UI is already updated
//       console.log(response.data.message);
//     } catch (error) {
//       // Revert on error
//       setQuizzes(prev => prev.map(q => 
//         q.id === quizId ? { ...q, isPublic: currentQuiz.isPublic } : q
//       ));

//       console.error("Error toggling visibility:", error);
//       if (error.response?.status === 401) {
//         alert("Session expired. Please log in again.");
//       } else {
//         alert("Failed to update visibility. Please try again.");
//       }
//     }
//   };

//   const handleNext = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   const getDifficultyColor = (difficultyLevel) => {
//     if (difficultyLevel <= 25) return '#10b981'; // Easy - Green
//     if (difficultyLevel <= 50) return '#f59e0b'; // Medium - Orange
//     return '#ef4444'; // Hard/Expert - Red
//   };

//   if (loading) {
//     return (
//       <div className="all-quizzes-page">
//         <Sidebar />
//         <FloatingChatButton />
//         <div className="all-quizzes-content">
//           <div className="all-quizzes-section">
//             <p>Loading quizzes...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="all-quizzes-page">
//         <Sidebar />
//         <FloatingChatButton />
//         <div className="all-quizzes-content">
//           <div className="all-quizzes-section">
//             <p className="error-message">{error}</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="all-quizzes-page">
//       <Sidebar />
//       <FloatingChatButton />
      
//       <div className="all-quizzes-content">
//         <div className="all-quizzes-section">
//           {/* Quiz Table */}
//           <div className="quiz-table-container">
//             <table className="quiz-table">
//               <thead>
//                 <tr>
//                   <th className="table-header">Quiz Title</th>
//                   <th className="table-header">Difficulty</th>
//                   <th className="table-header">Public</th>
//                   <th className="table-header">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {quizzes.map((quiz) => {
//                   const isAttempted = attemptedIds.has(quiz.id);
//                   return (
//                     <tr key={quiz.id} className="table-row">
//                       <td className="table-cell quiz-title-cell">
//                         {quiz.title}
//                       </td>
//                       <td className="table-cell">
//                         <div className="difficulty-container">
//                           <div className="difficulty-bar-wrapper">
//                             <div 
//                               className="difficulty-bar-fill" 
//                               style={{ 
//                                 width: `${quiz.difficultyLevel}%`,
//                                 backgroundColor: getDifficultyColor(quiz.difficultyLevel)
//                               }}
//                             ></div>
//                           </div>
//                           <span className="difficulty-text">{quiz.difficulty}</span>
//                         </div>
//                       </td>
//                       <td className="table-cell">
//                         <label className="checkbox-container">
//                           <input 
//                             type="checkbox" 
//                             checked={quiz.isPublic}
//                             onChange={() => handlePublicToggle(quiz.id)}
//                           />
//                           <span className="checkbox-checkmark"></span>
//                         </label>
//                       </td>
//                       <td className="table-cell">
//                         <div className="actions-container">
//                           {isAttempted ? (
//                             <>
//                               <button 
//                                 className="action-btn play-btn" 
//                                 onClick={() => handleRetake(quiz.id)}
//                                 title="Retake"
//                               >
//                                 <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//                                   <polygon points="5 3 19 12 5 21 5 3"/>
//                                 </svg>
//                               </button>
//                               <button 
//                                 className="action-btn view-btn" 
//                                 onClick={() => handleViewResults(quiz.id)}
//                                 title="View Results"
//                               >
//                                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                                   <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
//                                   <circle cx="12" cy="12" r="3"/>
//                                 </svg>
//                               </button>
//                               <button 
//                                 className="action-btn info-btn" 
//                                 onClick={() => handleInfo(quiz.id)}
//                                 title="Info"
//                               >
//                                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                                   <circle cx="12" cy="12" r="10"/>
//                                   <line x1="12" y1="16" x2="12" y2="12"/>
//                                   <line x1="12" y1="8" x2="12.01" y2="8"/>
//                                 </svg>
//                               </button>
//                               <button 
//                                 className="action-btn share-btn" 
//                                 onClick={() => handleShare(quiz.id)}
//                                 title="Share"
//                               >
//                                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                                   <circle cx="18" cy="5" r="3"/>
//                                   <circle cx="6" cy="12" r="3"/>
//                                   <circle cx="18" cy="19" r="3"/>
//                                   <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
//                                   <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
//                                 </svg>
//                               </button>
//                               <button 
//                                 className="action-btn delete-btn" 
//                                 onClick={() => handleDelete(quiz)}
//                                 title="Delete"
//                               >
//                                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                                   <polyline points="3 6 5 6 21 6"/>
//                                   <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
//                                   <line x1="10" y1="11" x2="10" y2="17"/>
//                                   <line x1="14" y1="11" x2="14" y2="17"/>
//                                 </svg>
//                               </button>
//                             </>
//                           ) : (
//                             <>
//                               <button 
//                                 className="action-btn play-btn" 
//                                 onClick={() => handlePlay(quiz.id)}
//                                 title="Play"
//                               >
//                                 <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//                                   <polygon points="5 3 19 12 5 21 5 3"/>
//                                 </svg>
//                               </button>
//                               <button 
//                                 className="action-btn info-btn" 
//                                 onClick={() => handleInfo(quiz.id)}
//                                 title="Info"
//                               >
//                                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                                   <circle cx="12" cy="12" r="10"/>
//                                   <line x1="12" y1="16" x2="12" y2="12"/>
//                                   <line x1="12" y1="8" x2="12.01" y2="8"/>
//                                 </svg>
//                               </button>
//                               <button 
//                                 className="action-btn share-btn" 
//                                 onClick={() => handleShare(quiz.id)}
//                                 title="Share"
//                               >
//                                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                                   <circle cx="18" cy="5" r="3"/>
//                                   <circle cx="6" cy="12" r="3"/>
//                                   <circle cx="18" cy="19" r="3"/>
//                                   <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
//                                   <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
//                                 </svg>
//                               </button>
//                               <button 
//                                 className="action-btn delete-btn" 
//                                 onClick={() => handleDelete(quiz)}
//                                 title="Delete"
//                               >
//                                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                                   <polyline points="3 6 5 6 21 6"/>
//                                   <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
//                                   <line x1="10" y1="11" x2="10" y2="17"/>
//                                   <line x1="14" y1="11" x2="14" y2="17"/>
//                                 </svg>
//                               </button>
//                             </>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           <div className="pagination-container">
//             <button 
//               className="btn-prev" 
//               onClick={handlePrevious}
//               disabled={currentPage === 1}
//               style={{ display: currentPage === 1 ? 'none' : 'inline-block' }}
//             >
//               Previous
//             </button>
//             <span className="pagination-text">Page {currentPage} of {totalPages}</span>
//             <button 
//               className="btn-next" 
//               onClick={handleNext}
//               disabled={currentPage === totalPages}
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Share Quiz Modal */}
//       {showShareModal && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h3>Share Quiz</h3>
//               <button className="modal-close" onClick={handleCloseShareModal}>
//                 ×
//               </button>
//             </div>
//             <div className="modal-body">
//               <div className="form-group">
//                 <label>Username</label>
//                 <input
//                   type="text"
//                   value={shareUsername}
//                   onChange={(e) => setShareUsername(e.target.value)}
//                   className="form-input"
//                   placeholder="Enter username to share with"
//                   disabled={shareLoading}
//                 />
//               </div>
//               <button
//                 className="btn-save-changes"
//                 onClick={handleShareSubmit}
//                 disabled={shareLoading}
//               >
//                 {shareLoading ? "Sharing..." : "Share Quiz"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllQuizzes;