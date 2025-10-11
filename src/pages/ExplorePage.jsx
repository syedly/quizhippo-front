import React, { useState } from 'react';
import Sidebar from "../components/Sidebar";
import FloatingChatButton from "../components/FloatingChatButton";
import '../css/explore.css';

const ExplorePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Trending');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);

  const quizzes = [
    {
      id: 1,
      title: 'Python',
      category: 'General',
      difficulty: '',
      rating: 4.5,
      totalRatings: 5,
      userRating: 5
    },
    {
      id: 2,
      title: 'Django',
      category: 'Software Development',
      difficulty: '',
      rating: 2.0,
      totalRatings: 5,
      userRating: 5
    },
    {
      id: 3,
      title: 'C++',
      category: 'Programming',
      difficulty: '',
      rating: 3.0,
      totalRatings: 5,
      userRating: 5
    },
    {
      id: 4,
      title: 'Hinduism',
      category: 'Religion',
      difficulty: '',
      rating: 3.0,
      totalRatings: 5,
      userRating: 5
    }
  ];

  const categories = ['Programming', 'Science', 'Mathematics', 'History'];
  const difficulties = ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'];

  const handleAddToMyQuiz = (quizId) => {
    console.log('Add to My Quiz:', quizId);
  };

  const handleRate = (quizId) => {
    console.log('Rate quiz:', quizId);
  };

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const handleDifficultyClick = (difficulty) => {
    setSelectedDifficulty(difficulty === selectedDifficulty ? null : difficulty);
  };

  const renderStars = (rating, totalStars = 5, filled = false) => {
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
          className="star-icon"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    }
    return stars;
  };

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
              {quizzes.map((quiz) => (
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
                    <p className="quiz-difficulty">Difficulty:</p>
                  </div>

                  <div className="quiz-card-rating">
                    <div className="rating-stars-empty">
                      {renderStars(quiz.rating, 5, false)}
                    </div>
                    <span className="rating-text">{quiz.rating} / {quiz.totalRatings}</span>
                  </div>

                  <div className="quiz-card-actions">
                    <div className="user-rating-stars">
                      {renderStars(quiz.userRating, 5, true)}
                    </div>
                    <button 
                      className="btn-rate"
                      onClick={() => handleRate(quiz.id)}
                    >
                      Rate
                    </button>
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
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category}
                  </button>
                ))}
                <button className="view-more-btn">View More</button>
              </div>

              {/* Difficulty Section */}
              <div className="filter-section">
                <h3 className="filter-title">Difficulty</h3>
                {difficulties.map((difficulty) => (
                  <button
                    key={difficulty}
                    className={`filter-btn ${selectedDifficulty === difficulty ? 'active' : ''}`}
                    onClick={() => handleDifficultyClick(difficulty)}
                  >
                    {difficulty}
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