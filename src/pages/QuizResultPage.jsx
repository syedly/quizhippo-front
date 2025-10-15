import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from "../components/Sidebar";
import FloatingChatButton from "../components/FloatingChatButton";
import '../css/quiz-result.css';  // Assume this CSS file for styling

const QuizResultPage = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    const { attemptId: quizId } = useParams(); // rename to quizId for clarity

    useEffect(() => {
    const fetchQuizResult = async () => {
        setLoading(true);
        try {
        const token = localStorage.getItem("access_token");
        if (!token) {
            alert("You must be logged in to view quiz results.");
            navigate('/login');
            return;
        }

        const response = await axios.get(
            `http://localhost:8000/api/quiz/${quizId}/result/`,
            {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            }
        );

        setResultData(response.data);
        } catch (error) {
        console.error("Error fetching quiz result:", error);
        if (error.response?.status === 401) {
            alert("Session expired. Please log in again.");
            navigate('/login');
        } else if (error.response?.status === 403) {
            alert("You are not authorized to view this result.");
            navigate('/quizzes');
        } else if (error.response?.status === 404) {
            setError("Quiz attempt not found.");
        } else {
            setError("Failed to load quiz result.");
        }
        } finally {
        setLoading(false);
        }
    };

    fetchQuizResult();
    }, [quizId, navigate]);


  const handleNewQuiz = () => {
    navigate('/quizzes');
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate('/login');
  };

  const getDifficultyText = (diff) => {
    switch (diff) {
      case 1: return 'Easy';
      case 2: return 'Medium';
      case 3: return 'Hard';
      case 4: return 'Expert';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="quiz-result-page">
        <Sidebar />
        <FloatingChatButton />
        <div className="quiz-result-content">
          <p>Loading quiz result...</p>
        </div>
      </div>
    );
  }

  if (error || !resultData) {
    return (
      <div className="quiz-result-page">
        <Sidebar />
        <FloatingChatButton />
        <div className="quiz-result-content">
          <p>{error || "Result not found."}</p>
          <button onClick={() => navigate('/quizzes')}>Back to Quizzes</button>
        </div>
      </div>
    );
  }

  const { quiz, attempt, incorrect_questions } = resultData;
  const totalQuestions = attempt.total_questions;
  const correctAnswers = attempt.correct_answers;
  const incorrectCount = attempt.incorrect_count;
  const score = attempt.score;

  return (
    <div className="quiz-result-page">
      <Sidebar />
      <FloatingChatButton />
      
      <div className="quiz-result-content">
        <div className="quiz-result-header">
          <h1 className="quiz-result-title">Quiz Result</h1>
          <div className="quiz-info">
            <h2>{quiz.topic}</h2>
            <p>Category: {quiz.category} | Difficulty: {getDifficultyText(quiz.difficulty)}</p>
          </div>
        </div>

        {/* Score Summary */}
        <div className="score-summary">
          <div className="score-card">
            <h3>Score</h3>
            <p className="score-value">{score}%</p>
            <p className="score-detail">{correctAnswers}/{totalQuestions}</p>
          </div>
          <div className="score-card">
            <h3>Correct Answers</h3>
            <p className="score-value green">{correctAnswers}/{totalQuestions}</p>
          </div>
          <div className="score-card">
            <h3>Incorrect Answers</h3>
            <p className="score-value red">{incorrectCount}/{totalQuestions}</p>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="detailed-breakdown">
          <h3>Detailed Breakdown</h3>
          {incorrect_questions.length > 0 ? (
            <div className="breakdown-table">
              <table>
                <thead>
                  <tr>
                    <th>Question</th>
                    <th>Your Answer</th>
                    <th>Correct Answer</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {incorrect_questions.map((q, index) => (
                    <tr key={q.id}>
                      <td>{q.text}</td>
                      <td className="user-answer">{q.user_answer || 'No answer'}</td>
                      <td className="correct-answer">{q.correct_answer}</td>
                      <td className="result incorrect">Incorrect</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-incorrect">Great job! All answers were correct.</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="btn-new-quiz" onClick={handleNewQuiz}>
            New Quiz
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResultPage;