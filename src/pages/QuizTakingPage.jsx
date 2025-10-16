import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import FloatingChatButton from "../components/FloatingChatButton";
import "../css/QuizTakingPage.css";

const QuizTakingPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ✅ Save answer for current question
  const handleAnswerChange = useCallback(
    (e) => {
      const currentQuestion = questions[currentIndex];
      setSelectedAnswers({
        ...selectedAnswers,
        [currentQuestion.id]: e.target.value,
      });
    },
    [selectedAnswers, currentIndex, questions]
  );

  // 🚀 Submit answers
  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("You must be logged in to submit.");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `http://localhost:8000/api/quiz/${quizId}/submit/`,
        { answers: selectedAnswers },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      navigate(`/quiz-result/${response.data.quiz_id}`);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please log in again.");
        navigate("/login");
      } else {
        alert("Failed to submit quiz. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }, [quizId, selectedAnswers, navigate]);

  // 👉 Next question logic
  const handleNextQuestion = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setTimer(60);
    } else {
      handleSubmit();
    }
  }, [currentIndex, questions.length, handleSubmit]);

  // 🧭 Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          alert("Please log in to take the quiz.");
          navigate("/login");
          return;
        }

        // Changed to GET request for fetching quiz details
        const response = await axios.get(`http://localhost:8000/api/quiz/${quizId}/submit/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        setQuiz(response.data.quiz);
        setQuestions(response.data.questions);
      } catch (error) {
        console.error("Error fetching quiz:", error);
        if (error.response?.status === 404) {
          alert("Quiz not found.");
        } else if (error.response?.status === 401) {
          alert("Session expired. Please log in again.");
          navigate("/login");
        } else {
          alert("Failed to load quiz. Please try again later.");
        }
        navigate("/quizzes");  // Fallback to all quizzes page
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId, navigate]);

  // 🕒 Timer countdown
  useEffect(() => {
    if (loading || submitting) return;

    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          handleNextQuestion(); // auto next when timer ends
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [currentIndex, loading, submitting, handleNextQuestion]);

  if (loading) {
    return <div className="quiz-loading">Loading quiz...</div>;
  }

  if (!quiz || questions.length === 0) {
    return <div className="quiz-empty">No questions available for this quiz.</div>;
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="quiz-page-container">
      <Sidebar />
      <div className="quiz-content">
        <div className="quiz-header">
          <h2>{quiz.topic || 'Untitled Quiz'}</h2> {/* Use 'topic' from serializer */}
          <div className="quiz-meta">
            <span>Question {currentIndex + 1} / {questions.length}</span>
            <span className="quiz-timer">⏱️ {timer}s</span>
          </div>
        </div>

        <div className="quiz-question-card">
          <h3>{currentQuestion.text}</h3>

          {/* Render options for MCQ */}
          {currentQuestion.question_type === "MCQ" && currentQuestion.options && currentQuestion.options.length > 0 && (
            <div className="quiz-options">
              {currentQuestion.options.map((opt, idx) => {
                return (
                  <label key={idx} className="quiz-option">
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={opt.text}
                      checked={selectedAnswers[currentQuestion.id] === opt.text}
                      onChange={handleAnswerChange}
                    />
                    {opt.text}
                  </label>
                );
              })}
            </div>
          )}

          {/* Render True/False checkboxes for TF */}
          {currentQuestion.question_type === "TF" && (
            <div className="quiz-options">
              {['True', 'False'].map((option, idx) => {
                return (
                  <label key={idx} className="quiz-option">
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={option}
                      checked={selectedAnswers[currentQuestion.id] === option}
                      onChange={handleAnswerChange}
                    />
                    {option}
                  </label>
                );
              })}
            </div>
          )}

          {/* Input for SHORT or FILL questions */}
          {(currentQuestion.question_type === "SHORT" || currentQuestion.question_type === "FILL") && (
            <textarea
              className="quiz-textarea"
              placeholder="Type your answer here..."
              value={selectedAnswers[currentQuestion.id] || ""}
              onChange={handleAnswerChange}
            />
          )}
        </div>

        <div className="quiz-navigation">
          {currentIndex < questions.length - 1 ? (
            <button className="quiz-next-btn" onClick={handleNextQuestion}>
              Next Question →
            </button>
          ) : (
            <button
              className="quiz-submit-btn"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Quiz"}
            </button>
          )}
        </div>
      </div>
      <FloatingChatButton />
    </div>
  );
};

export default QuizTakingPage;