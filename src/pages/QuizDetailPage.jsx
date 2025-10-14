import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from "../components/Sidebar";
import FloatingChatButton from "../components/FloatingChatButton";
import '../css/quiz-detail.css';

const QuizDetailPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          alert("You must be logged in to view quiz details.");
          navigate('/login');
          return;
        }

        const response = await axios.get(
          `http://localhost:8000/api/quizzes/${quizId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setQuizData(response.data);
      } catch (error) {
        console.error("Error fetching quiz details:", error);
        if (error.response?.status === 401) {
          alert("Session expired. Please log in again.");
          navigate('/login');
        } else if (error.response?.status === 403) {
          alert("You are not authorized to view this quiz.");
          navigate('/quizzes');
        } else {
          setError("Failed to load quiz details.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuizDetails();
  }, [quizId, navigate]);

  const getDifficultyText = (diff) => {
    switch (diff) {
      case 1: return 'Easy';
      case 2: return 'Medium';
      case 3: return 'Hard';
      case 4: return 'Expert';
      default: return 'Unknown';
    }
  };

  const handleBackToQuizzes = () => {
    navigate('/quizzes');
  };

  if (loading) {
    return (
      <div className="quiz-detail-page">
        <Sidebar />
        <FloatingChatButton />
        <div className="quiz-detail-content">
          <p>Loading quiz details...</p>
        </div>
      </div>
    );
  }

  if (error || !quizData) {
    return (
      <div className="quiz-detail-page">
        <Sidebar />
        <FloatingChatButton />
        <div className="quiz-detail-content">
          <p>{error || "Quiz not found."}</p>
          <button onClick={handleBackToQuizzes}>Back to Quizzes</button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-detail-page">
      <Sidebar />
      <FloatingChatButton />
      
      <div className="quiz-detail-content">
        <div className="quiz-detail-section">
          {/* Header */}
          <div className="quiz-detail-header">
            <button className="btn-back" onClick={handleBackToQuizzes}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to Quizzes
            </button>
            
            <div className="quiz-info-header">
              <div className="quiz-icon-large">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"/>
                  <path d="M9 10h6M9 14h6"/>
                </svg>
              </div>
              <div className="quiz-header-text">
                <h1 className="quiz-detail-title">{quizData.topic}</h1>
                <div className="quiz-meta">
                  <span className="quiz-category-badge">{quizData.category}</span>
                  <span className="quiz-difficulty-badge">{getDifficultyText(quizData.difficulty)}</span>
                  <span className="quiz-public-badge">{quizData.is_public ? 'Public' : 'Private'}</span>
                  <span className="quiz-created-badge">Created by: {quizData.created_by}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Questions Section */}
          <div className="questions-section">
            <h2 className="section-title">Questions ({quizData.questions.length})</h2>
            
            {quizData.questions.length > 0 ? (
              <div className="questions-list">
                {quizData.questions.map((question, index) => (
                  <div key={question.id} className="question-card">
                    <div className="question-header">
                      <h3 className="question-number">Question {index + 1}</h3>
                      <span className="question-type">{question.question_type}</span>
                    </div>
                    
                    <div className="question-text">
                      <p>{question.text}</p>
                    </div>

                    {question.options && question.options.length > 0 ? (
                      <div className="options-list">
                        {question.options.map((option, optIndex) => {
                          const cleanAnswer = question.answer.replace(/^[a-d]\)\s*/i, '').trim();
                          const cleanOption = option.replace(/^[a-d]\)\s*/i, '').trim();
                          const isCorrect = cleanOption === cleanAnswer;
                          return (
                            <div key={optIndex} className={`option-item ${isCorrect ? 'correct' : ''}`}>
                              <span className={`option-label ${isCorrect ? 'correct-label' : ''}`}>
                                {String.fromCharCode(97 + optIndex)}).
                              </span>
                              <span className={`option-text ${isCorrect ? 'correct-text' : ''}`}>
                                {option}
                              </span>
                              {isCorrect && (
                                <span className="correct-indicator">✓ Correct Answer</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="answer-section">
                        <strong>Answer: {question.answer}</strong>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <p>No questions in this quiz yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizDetailPage;