import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from "../components/Sidebar";
import FloatingChatButton from "../components/FloatingChatButton";
import '../css/explore.css';

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
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [selectedFilter, selectedCategory, selectedDifficulty]);

  const filteredQuizzes = quizzes.filter(quiz =>
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToMyQuiz = async (quizId) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("You must be logged in to add quizzes.");
        return;
      }

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

      alert(`✅ ${response.data.message}`);
    } catch (error) {
      console.error("Error adding quiz:", error);
      if (error.response?.status === 401) {
        alert("❌ Session expired. Please log in again.");
      } else {
        alert("❌ Failed to add quiz. Please try again.");
      }
    }
  };

  const handleRate = async (quizId, rating) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("You must be logged in to rate quizzes.");
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

      alert(`✅ ${response.data.message}`);
      
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
        alert("❌ Session expired. Please log in again.");
      } else if (error.response?.status === 400) {
        alert(`❌ ${error.response.data.error || "Invalid rating value."}`);
      } else {
        alert("❌ Failed to rate quiz. Please try again.");
      }
    }
  };

  const handleFilterClick = (filter) => {
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

  const renderStars = (rating, totalStars = 5, filled = false, interactive = false, quizId = null) => {
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
          onClick={interactive ? () => handleRate(quizId, i) : undefined}
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
            <p>Loading quizzes...</p>
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
              {filteredQuizzes.map((quiz) => (
                <div key={quiz.id} className="quiz-card">
                  <div className="quiz-card-header">
                    <h3 className="quiz-card-title">{quiz.title}</h3>
                    <button 
                      className="btn-add-to-quiz"
                      onClick={() => handleAddToMyQuiz(quiz.id)}
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
                      {renderStars(userRatings[quiz.id] || 0, 5, true, true, quiz.id)}
                    </div>
                    <span className="rate-label">Rate this quiz</span>
                  </div>
                </div>
              ))}
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
                  Trending
                </button>
                <button
                  className={`filter-btn explore-btn ${selectedFilter === 'Explore' ? 'active' : ''}`}
                  onClick={() => handleFilterClick('Explore')}
                >
                  Explore
                </button>
                <button
                  className={`filter-btn ${selectedFilter === 'For You' ? 'active' : ''}`}
                  onClick={() => handleFilterClick('For You')}
                >
                  For You
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
                    {showAllCategories ? 'View Less' : 'View More'}
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