import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from "../components/Sidebar";
import FloatingChatButton from "../components/FloatingChatButton";
import '../css/server-detail.css';

const ServerDetailPage = () => {
  const { serverId } = useParams();
  const navigate = useNavigate();
  const [serverData, setServerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [currentUsername, setCurrentUsername] = useState('');
  const [showAddQuizModal, setShowAddQuizModal] = useState(false);
  const [userQuizzes, setUserQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState('');
  const [addQuizLoading, setAddQuizLoading] = useState(false);

  useEffect(() => {
    const fetchServerDetails = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          alert("You must be logged in to view server details.");
          navigate('/servers');
          return;
        }

        // Fetch current user info
        const profileResponse = await axios.get(
          "http://localhost:8000/api/profile/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setCurrentUsername(profileResponse.data.username);

        // Fetch server details
        const response = await axios.get(
          `http://localhost:8000/api/servers/${serverId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setServerData(response.data);
        setIsOwner(response.data.created_by === profileResponse.data.username);

        // Fetch user's quizzes if owner
        if (response.data.created_by === profileResponse.data.username) {
          const quizzesResponse = await axios.get(
            "http://localhost:8000/api/all-quizzes/?page=1&page_size=100",
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          setUserQuizzes(quizzesResponse.data.results || []);
        }
      } catch (error) {
        console.error("Error fetching server details:", error);
        if (error.response?.status === 403) {
          alert("You are not a member of this server.");
          navigate('/servers');
        } else if (error.response?.status === 401) {
          alert("Session expired. Please log in again.");
          navigate('/login');
        } else {
          alert("Failed to load server details.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchServerDetails();
  }, [serverId, navigate]);

  const handleAddQuiz = async () => {
    if (!selectedQuizId) {
      alert("Please select a quiz to add.");
      return;
    }

    setAddQuizLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("You must be logged in to add quizzes.");
        setAddQuizLoading(false);
        return;
      }

      const response = await axios.post(
        `http://localhost:8000/api/servers/${serverId}/add-quiz/`,
        { quiz_id: selectedQuizId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert(`✅ ${response.data.message}`);

      // Refresh server details
      const serverResponse = await axios.get(
        `http://localhost:8000/api/servers/${serverId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setServerData(serverResponse.data);

      setShowAddQuizModal(false);
      setSelectedQuizId('');
    } catch (error) {
      console.error("Error adding quiz:", error);
      if (error.response?.status === 401) {
        alert("❌ Session expired. Please log in again.");
      } else if (error.response?.status === 403) {
        alert("❌ You are not allowed to add quizzes to this server.");
      } else if (error.response?.status === 400) {
        alert(`❌ ${error.response.data.error || "Invalid request."}`);
      } else {
        alert("❌ Failed to add quiz. Please try again.");
      }
    } finally {
      setAddQuizLoading(false);
    }
  };

  const handleStartQuiz = (quizId) => {
    console.log('Starting quiz:', quizId);
    // Navigate to quiz page or start quiz logic
    // navigate(`/quiz/${quizId}`);
  };

  const handleBackToServers = () => {
    navigate('/servers');
  };

  if (loading) {
    return (
      <div className="server-detail-page">
        <Sidebar />
        <FloatingChatButton />
        <div className="server-detail-content">
          <p>Loading server details...</p>
        </div>
      </div>
    );
  }

  if (!serverData) {
    return (
      <div className="server-detail-page">
        <Sidebar />
        <FloatingChatButton />
        <div className="server-detail-content">
          <p>Server not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="server-detail-page">
      <Sidebar />
      <FloatingChatButton />
      
      <div className="server-detail-content">
        <div className="server-detail-section">
          {/* Header */}
          <div className="server-detail-header">
            <button className="btn-back" onClick={handleBackToServers}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to Servers
            </button>
            
            <div className="server-info-header">
              <div className="server-icon-large">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <line x1="9" y1="9" x2="15" y2="9"/>
                  <line x1="9" y1="15" x2="15" y2="15"/>
                </svg>
              </div>
              <div className="server-header-text">
                <h1 className="server-detail-title">{serverData.name}</h1>
                <p className="server-detail-description">{serverData.description || 'No description provided.'}</p>
                <div className="server-meta">
                  <span className="server-code-badge">Code: {serverData.code}</span>
                  <span className="server-owner-badge">Created by: {serverData.created_by}</span>
                  {isOwner && <span className="owner-indicator">You are the owner</span>}
                </div>
              </div>
            </div>

            {isOwner && (
              <button className="btn-add-quiz" onClick={() => setShowAddQuizModal(true)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="16"/>
                  <line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
                Add Quiz
              </button>
            )}
          </div>

          {/* Quizzes Section */}
          <div className="quizzes-section">
            <h2 className="section-title">Server Quizzes ({serverData.quizzes?.length || 0})</h2>
            
            {serverData.quizzes && serverData.quizzes.length > 0 ? (
              <div className="quiz-grid">
                {serverData.quizzes.map((quiz) => (
                  <div key={quiz.id} className="quiz-card-detail">
                    <div className="quiz-card-header">
                      <h3 className="quiz-title">{quiz.title}</h3>
                      {quiz.attempted && (
                        <span className="attempted-badge">Completed</span>
                      )}
                    </div>
                    
                    <div className="quiz-info">
                      <div className="quiz-meta">
                        <span className="quiz-category">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                          </svg>
                          {quiz.category || 'General'}
                        </span>
                        {quiz.is_public && (
                          <span className="public-badge">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"/>
                              <line x1="2" y1="12" x2="22" y2="12"/>
                              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                            </svg>
                            Public
                          </span>
                        )}
                      </div>
                    </div>

                    <button 
                      className="btn-start-quiz"
                      onClick={() => handleStartQuiz(quiz.id)}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3"/>
                      </svg>
                      {quiz.attempted ? 'Retake Quiz' : 'Start Quiz'}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <p>No quizzes in this server yet.</p>
                {isOwner && <p>Add some quizzes to get started!</p>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Quiz Modal */}
      {showAddQuizModal && (
        <div className="modal-overlay" onClick={() => setShowAddQuizModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add Quiz to Server</h2>
              <button className="btn-close" onClick={() => setShowAddQuizModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Select Quiz</label>
                <select
                  className="modal-select"
                  value={selectedQuizId}
                  onChange={(e) => setSelectedQuizId(e.target.value)}
                  disabled={addQuizLoading}
                >
                  <option value="">Choose a quiz...</option>
                  {userQuizzes.map((quiz) => (
                    <option key={quiz.id} value={quiz.id}>
                      {quiz.topic || quiz.title || `Quiz ${quiz.id}`}
                    </option>
                  ))}
                </select>
                {userQuizzes.length === 0 && (
                  <p className="helper-text">You don't have any quizzes yet. Create one first!</p>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-cancel" 
                onClick={() => setShowAddQuizModal(false)}
                disabled={addQuizLoading}
              >
                Cancel
              </button>
              <button 
                className="btn-confirm" 
                onClick={handleAddQuiz}
                disabled={addQuizLoading || !selectedQuizId}
              >
                {addQuizLoading ? "Adding..." : "Add Quiz"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServerDetailPage;