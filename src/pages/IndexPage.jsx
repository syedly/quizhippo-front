import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/landing.css';

const IndexPage = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
      ),
      title: 'Create Custom Quizzes',
      description: 'Design engaging quizzes with multiple question types, difficulty levels, and categories'
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      title: 'Join Communities',
      description: 'Connect with learners worldwide, join servers, and participate in collaborative learning'
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      ),
      title: 'Track Your Progress',
      description: 'Monitor your learning journey with detailed statistics and performance analytics'
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <polygon points="10 8 16 12 10 16 10 8"/>
        </svg>
      ),
      title: 'Explore & Learn',
      description: 'Discover thousands of quizzes across various topics and challenge yourself daily'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Active Users' },
    { number: '50K+', label: 'Quizzes Created' },
    { number: '1M+', label: 'Questions Answered' },
    { number: '500+', label: 'Learning Communities' }
  ];

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <div className="logo-icon">
              <svg width="40" height="40" viewBox="0 0 60 60" fill="none">
                <path d="M30 0L35 20L40 10L42 25L50 15L48 30L60 25L52 35L60 40L50 42L55 50L45 48L47 58L37 52L35 60L30 50L25 60L23 52L13 58L15 48L5 50L10 42L0 40L8 35L0 30L12 28L10 20L18 22L15 12L25 18L23 8L30 15V0Z" fill="#6366F1"/>
              </svg>
            </div>
            <span className="logo-text">Quiz Hippo</span>
          </div>
          <div className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#community" className="nav-link">Community</a>
            <button className="btn-nav-login" onClick={() => navigate('/login')}>Login</button>
            <button className="btn-nav-signup" onClick={() => navigate('/signup')}>Get Started</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-gradient"></div>
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>
        
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-icon">🎓</span>
              <span>The Future of Interactive Learning</span>
            </div>
            <h1 className="hero-title">
              Learn Smarter with
              <span className="hero-title-highlight"> Quiz Hippo</span>
            </h1>
            <p className="hero-description">
              Create, share, and discover engaging quizzes. Join a global community of learners 
              and make education fun and interactive.
            </p>
            <div className="hero-actions">
              <button className="btn-hero-primary" onClick={() => navigate('/signup')}>
                Start Learning Free
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
              <button className="btn-hero-secondary" onClick={() => navigate('/explore')}>
                Explore Quizzes
              </button>
            </div>
            <div className="hero-stats">
              {stats.map((stat, index) => (
                <div key={index} className="hero-stat-item">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-card card-quiz">
              <div className="card-header">
                <div className="card-icon">❓</div>
                <div className="card-title">Python Basics</div>
              </div>
              <div className="card-content">
                <div className="quiz-question">What is a variable?</div>
                <div className="quiz-options">
                  <div className="quiz-option">A) Container for data</div>
                  <div className="quiz-option active">B) A function</div>
                  <div className="quiz-option">C) A class</div>
                </div>
              </div>
            </div>

            <div className="visual-card card-stats">
              <div className="card-header">
                <div className="card-icon">📊</div>
                <div className="card-title">Your Progress</div>
              </div>
              <div className="card-content">
                <div className="progress-bar">
                  <div className="progress-fill"></div>
                </div>
                <div className="progress-text">85% Complete</div>
              </div>
            </div>

            <div className="visual-card card-trophy">
              <div className="trophy-icon">🏆</div>
              <div className="trophy-text">Level Up!</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Powerful Features for Effective Learning</h2>
            <p className="section-subtitle">Everything you need to create, share, and master knowledge</p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">How Quiz Hippo Works</h2>
            <p className="section-subtitle">Get started in three simple steps</p>
          </div>

          <div className="steps-container">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3 className="step-title">Create Your Account</h3>
                <p className="step-description">Sign up for free and set up your personalized learning profile</p>
              </div>
            </div>

            <div className="step-connector"></div>

            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3 className="step-title">Create or Join Quizzes</h3>
                <p className="step-description">Build your own quizzes or explore thousands created by the community</p>
              </div>
            </div>

            <div className="step-connector"></div>

            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3 className="step-title">Learn & Grow</h3>
                <p className="step-description">Track your progress, compete with friends, and achieve your learning goals</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="community-section">
        <div className="section-container">
          <div className="community-content">
            <div className="community-text">
              <h2 className="section-title">Join Our Global Learning Community</h2>
              <p className="community-description">
                Connect with learners worldwide, share knowledge, and grow together. 
                Quiz Hippo brings people together through the power of interactive learning.
              </p>
              <ul className="community-features">
                <li>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>Create private or public learning servers</span>
                </li>
                <li>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>Collaborate with peers on quiz creation</span>
                </li>
                <li>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>Share achievements and compete on leaderboards</span>
                </li>
              </ul>
              <button className="btn-community" onClick={() => navigate('/server')}>
                Explore Communities
              </button>
            </div>

            <div className="community-visual">
              <div className="community-cards">
                <div className="community-card">
                  <div className="community-avatar">👨‍💻</div>
                  <div className="community-info">
                    <div className="community-name">Python Learners</div>
                    <div className="community-members">234 members</div>
                  </div>
                </div>
                <div className="community-card">
                  <div className="community-avatar">🎨</div>
                  <div className="community-info">
                    <div className="community-name">Design Masters</div>
                    <div className="community-members">189 members</div>
                  </div>
                </div>
                <div className="community-card">
                  <div className="community-avatar">🔬</div>
                  <div className="community-info">
                    <div className="community-name">Science Hub</div>
                    <div className="community-members">456 members</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Ready to Start Your Learning Journey?</h2>
          <p className="cta-description">Join thousands of learners already using Quiz Hippo</p>
          <div className="cta-actions">
            <button className="btn-cta-primary" onClick={() => navigate('/signup')}>
              Get Started for Free
            </button>
            <button className="btn-cta-secondary" onClick={() => navigate('/login')}>
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="logo-icon">
                  <svg width="32" height="32" viewBox="0 0 60 60" fill="none">
                    <path d="M30 0L35 20L40 10L42 25L50 15L48 30L60 25L52 35L60 40L50 42L55 50L45 48L47 58L37 52L35 60L30 50L25 60L23 52L13 58L15 48L5 50L10 42L0 40L8 35L0 30L12 28L10 20L18 22L15 12L25 18L23 8L30 15V0Z" fill="#6366F1"/>
                  </svg>
                </div>
                <span className="logo-text">Quiz Hippo</span>
              </div>
              <p className="footer-tagline">Making learning interactive and fun</p>
            </div>

            <div className="footer-links">
              <div className="footer-column">
                <h4 className="footer-heading">Product</h4>
                <a href="#features" className="footer-link">Features</a>
                <a href="#how-it-works" className="footer-link">How It Works</a>
                <a href="/explore" className="footer-link">Explore</a>
              </div>
              <div className="footer-column">
                <h4 className="footer-heading">Community</h4>
                <a href="/server" className="footer-link">Servers</a>
                <a href="#community" className="footer-link">Join Us</a>
                <a href="#" className="footer-link">Blog</a>
              </div>
              <div className="footer-column">
                <h4 className="footer-heading">Support</h4>
                <a href="#" className="footer-link">Help Center</a>
                <a href="#" className="footer-link">Contact</a>
                <a href="#" className="footer-link">Privacy</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copyright">© 2025 Quiz Hippo. All rights reserved.</p>
            <div className="footer-social">
              <a href="#" className="social-link">Twitter</a>
              <a href="#" className="social-link">Discord</a>
              <a href="#" className="social-link">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default IndexPage;