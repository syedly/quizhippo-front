import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Sidebar from "../components/Sidebar";
import FloatingChatButton from "../components/FloatingChatButton";
import '../css/explore.css';
import QuizHippoLoader from '../components/QuizHippoLoader';

const ExplorePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Explore');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [difficultyLevels, setDifficultyLevels] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [userRatings, setUserRatings] = useState({});

  const getDifficultyText = (diff) => {
    return difficultyLevels[diff] || 'Unknown';
  };

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = 'https://quizhippo.pythonanywhere.com/api/explore/';
        const params = new URLSearchParams();

        if (selectedCategory) {
          params.append('category', selectedCategory);
        }
        if (selectedDifficulty) {
          params.append('difficulty', selectedDifficulty);
        }

        if (selectedFilter === 'Trending') {
          url = 'https://quizhippo.pythonanywhere.com/api/explore/trending/';
        }

        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const response = await axios.get(url);

        const apiQuizzes = response.data.results || [];
        setQuizzes(apiQuizzes);
        setCategories(response.data.categories || []);
        setDifficultyLevels(response.data.difficulty_levels || {});
      } catch (err) {
        console.error("Error fetching quizzes:", err);
        setError("Failed to fetch quizzes. Please try again.");
        Swal.fire({
          icon: "error",
          title: "Loading Error",
          text: "Failed to fetch quizzes. Please refresh the page.",
          background: "#1e1e2e",
          color: "#ffffff",
          confirmButtonColor: "#6366F1",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [selectedFilter, selectedCategory, selectedDifficulty]);

  const filteredQuizzes = quizzes.filter(quiz =>
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToMyQuiz = async (quizId, quizTitle) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        Swal.fire({
          icon: "warning",
          title: "Authentication Required",
          text: "You must be logged in to add quizzes.",
          background: "#1e1e2e",
          color: "#ffffff",
          confirmButtonColor: "#6366F1",
        });
        return;
      }

      // Show loading
      Swal.fire({
        title: 'Adding Quiz...',
        text: 'Please wait',
        background: "#1e1e2e",
        color: "#ffffff",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const response = await axios.post(
        `https://quizhippo.pythonanywhere.com/api/quizzes/${quizId}/save/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Quiz Added!",
        html: `<strong>"${quizTitle}"</strong> has been added to your quizzes.`,
        background: "#1e1e2e",
        color: "#ffffff",
        confirmButtonColor: "#6366F1",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error adding quiz:", error);
      if (error.response?.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Session Expired",
          text: "Please log in again.",
          background: "#1e1e2e",
          color: "#ffffff",
          confirmButtonColor: "#6366F1",
        });
      } else if (error.response?.status === 400) {
        Swal.fire({
          icon: "info",
          title: "Already Added",
          text: error.response.data.error || "This quiz is already in your collection.",
          background: "#1e1e2e",
          color: "#ffffff",
          confirmButtonColor: "#6366F1",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed to Add Quiz",
          text: "Something went wrong. Please try again.",
          background: "#1e1e2e",
          color: "#ffffff",
          confirmButtonColor: "#6366F1",
        });
      }
    }
  };

  const handleRate = async (quizId, rating, quizTitle) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        Swal.fire({
          icon: "warning",
          title: "Authentication Required",
          text: "You must be logged in to rate quizzes.",
          background: "#1e1e2e",
          color: "#ffffff",
          confirmButtonColor: "#6366F1",
        });
        return;
      }

      const response = await axios.post(
        `https://quizhippo.pythonanywhere.com/api/quizzes/${quizId}/rate/`,
        { rating: rating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Show success toast
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        background: "#1e1e2e",
        color: "#ffffff",
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      });

      Toast.fire({
        icon: 'success',
        title: `Rated ${rating} star${rating !== 1 ? 's' : ''}!`
      });
      
      // Update user rating in state
      setUserRatings(prev => ({
        ...prev,
        [quizId]: rating
      }));

      // Refresh quizzes to get updated average rating
      const url = selectedFilter === 'Trending' 
        ? 'https://quizhippo.pythonanywhere.com/api/explore/trending/'
        : 'https://quizhippo.pythonanywhere.com/api/explore/';
      const refreshResponse = await axios.get(url);
      setQuizzes(refreshResponse.data.results || []);
    } catch (error) {
      console.error("Error rating quiz:", error);
      if (error.response?.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Session Expired",
          text: "Please log in again.",
          background: "#1e1e2e",
          color: "#ffffff",
          confirmButtonColor: "#6366F1",
        });
      } else if (error.response?.status === 400) {
        Swal.fire({
          icon: "error",
          title: "Invalid Rating",
          text: error.response.data.error || "Please select a valid rating.",
          background: "#1e1e2e",
          color: "#ffffff",
          confirmButtonColor: "#6366F1",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Rating Failed",
          text: "Failed to rate quiz. Please try again.",
          background: "#1e1e2e",
          color: "#ffffff",
          confirmButtonColor: "#6366F1",
        });
      }
    }
  };

  const handleFilterClick = (filter) => {
    if (filter === 'For You') {
      Swal.fire({
        icon: "info",
        title: "Coming Soon!",
        text: "Personalized recommendations feature is coming soon.",
        background: "#1e1e2e",
        color: "#ffffff",
        confirmButtonColor: "#6366F1",
      });
      return;
    }
    setSelectedFilter(filter);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const handleDifficultyClick = (difficultyKey) => {
    setSelectedDifficulty(difficultyKey === selectedDifficulty ? null : difficultyKey);
  };

  const handleViewMoreCategories = () => {
    setShowAllCategories(!showAllCategories);
  };

  const renderStars = (rating, totalStars = 5, filled = false, interactive = false, quizId = null, quizTitle = null) => {
    const stars = [];
    for (let i = 1; i <= totalStars; i++) {
      stars.push(
        <svg
          key={i}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill={filled || i <= rating ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          className={`star-icon ${interactive ? 'interactive-star' : ''}`}
          onClick={interactive ? () => handleRate(quizId, i, quizTitle) : undefined}
          style={interactive ? { cursor: 'pointer' } : {}}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="explore-page">
        <Sidebar />
        <FloatingChatButton />
        <div className="explore-content">
          <div className="explore-section">
            <QuizHippoLoader />
          </div>
        </div>
      </div>
    );
  }

  const displayedCategories = showAllCategories ? categories : categories.slice(0, 5);

  return (
    <div className="explore-page">
      <Sidebar />
      <FloatingChatButton />
      
      <div className="explore-content">
        <div className="explore-section">
          {/* Header with Search */}
          <div className="explore-header">
            <h1 className="explore-title">Explore Quizzes</h1>
            <div className="search-container">
              <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search by topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="explore-grid">
            {/* Quiz Cards Section */}
            <div className="quiz-cards-section">
              {filteredQuizzes.length > 0 ? (
                filteredQuizzes.map((quiz) => (
                  <div key={quiz.id} className="quiz-card">
                    <div className="quiz-card-header">
                      <h3 className="quiz-card-title">{quiz.title}</h3>
                      <button 
                        className="btn-add-to-quiz"
                        onClick={() => handleAddToMyQuiz(quiz.id, quiz.title)}
                      >
                        Add to My Quiz
                      </button>
                    </div>
                    
                    <div className="quiz-card-info">
                      <p className="quiz-category">Category: {quiz.category}</p>
                      <p className="quiz-difficulty">Difficulty: {getDifficultyText(quiz.difficulty)}</p>
                    </div>

                    <div className="quiz-card-rating">
                      <div className="rating-stars-empty">
                        {renderStars(quiz.avg_rating, 5, false)}
                      </div>
                      <span className="rating-text">{quiz.avg_rating} ({quiz.avg_rating > 0 ? 'based on ratings' : 'No ratings yet'})</span>
                    </div>

                    <div className="quiz-card-actions">
                      <div className="user-rating-stars">
                        {renderStars(userRatings[quiz.id] || 0, 5, true, true, quiz.id, quiz.title)}
                      </div>
                      <span className="rate-label">Rate this quiz</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-quizzes-message">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <p>No quizzes found. Try adjusting your filters or search query.</p>
                </div>
              )}
            </div>

            {/* Sidebar Filters */}
            <div className="filters-sidebar">
              {/* Filters Section */}
              <div className="filter-section">
                <h3 className="filter-title">Filters</h3>
                <button
                  className={`filter-btn ${selectedFilter === 'Trending' ? 'active' : ''}`}
                  onClick={() => handleFilterClick('Trending')}
                >
                  🔥 Trending
                </button>
                <button
                  className={`filter-btn explore-btn ${selectedFilter === 'Explore' ? 'active' : ''}`}
                  onClick={() => handleFilterClick('Explore')}
                >
                  🌍 Explore
                </button>
                <button
                  className={`filter-btn ${selectedFilter === 'For You' ? 'active' : ''}`}
                  onClick={() => handleFilterClick('For You')}
                >
                  ⭐ For You
                </button>
              </div>

              {/* Categories Section */}
              <div className="filter-section">
                <h3 className="filter-title">Categories</h3>
                {displayedCategories.map((category) => (
                  <button
                    key={category}
                    className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category}
                  </button>
                ))}
                {categories.length > 5 && (
                  <button 
                    className="view-more-btn"
                    onClick={handleViewMoreCategories}
                  >
                    {showAllCategories ? '▲ View Less' : '▼ View More'}
                  </button>
                )}
              </div>

              {/* Difficulty Section */}
              <div className="filter-section">
                <h3 className="filter-title">Difficulty</h3>
                {Object.entries(difficultyLevels).map(([key, label]) => (
                  <button
                    key={key}
                    className={`filter-btn ${selectedDifficulty === key ? 'active' : ''}`}
                    onClick={() => handleDifficultyClick(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;