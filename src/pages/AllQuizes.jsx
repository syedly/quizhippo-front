import React, { useState } from 'react';
import Sidebar from "../components/Sidebar";
import FloatingChatButton from "../components/FloatingChatButton";
import '../css/all-quizes.css';

const AllQuizzes = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

  const quizzes = [
    {
      id: 1,
      title: 'Python',
      difficulty: 'Easy',
      difficultyLevel: 25,
      isPublic: true,
      hasStarted: true
    },
    {
      id: 2,
      title: 'Django',
      difficulty: 'Easy',
      difficultyLevel: 25,
      isPublic: true,
      hasStarted: true
    },
    {
      id: 3,
      title: 'C++',
      difficulty: 'Easy',
      difficultyLevel: 25,
      isPublic: true,
      hasStarted: true
    },
    {
      id: 4,
      title: 'Hinduism',
      difficulty: 'Custom',
      difficultyLevel: 50,
      isPublic: true,
      hasStarted: false
    },
    {
      id: 5,
      title: 'Islamic History',
      difficulty: 'Easy',
      difficultyLevel: 25,
      isPublic: false,
      hasStarted: false
    }
  ];

  const handleRefresh = (quizId) => {
    console.log('Refresh quiz:', quizId);
  };

  const handleView = (quizId) => {
    console.log('View quiz:', quizId);
  };

  const handleInfo = (quizId) => {
    console.log('Info quiz:', quizId);
  };

  const handleShare = (quizId) => {
    console.log('Share quiz:', quizId);
  };

  const handleDelete = (quizId) => {
    console.log('Delete quiz:', quizId);
  };

  const handlePlay = (quizId) => {
    console.log('Play quiz:', quizId);
  };

  const handlePublicToggle = (quizId) => {
    console.log('Toggle public for quiz:', quizId);
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
    if (difficultyLevel <= 50) return '#f59e0b'; // Custom/Medium - Orange
    return '#ef4444'; // Hard - Red
  };

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
                {quizzes.map((quiz) => (
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
                        {quiz.hasStarted ? (
                          <>
                            <button 
                              className="action-btn refresh-btn" 
                              onClick={() => handleRefresh(quiz.id)}
                              title="Refresh"
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
                              </svg>
                            </button>
                            <button 
                              className="action-btn view-btn" 
                              onClick={() => handleView(quiz.id)}
                              title="View"
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
                              onClick={() => handleDelete(quiz.id)}
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
                              onClick={() => handleDelete(quiz.id)}
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
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination-container">
            <span className="pagination-text">Page {currentPage} of {totalPages}</span>
            <button 
              className="btn-next" 
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllQuizzes;