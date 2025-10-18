import React from 'react';

const QuizHippoLoader = () => {
  return (
    <div className="loader-page">
      {/* Background Effects */}
      <div className="loader-background">
        <div className="bg-gradient-loader gradient-1-loader"></div>
        <div className="bg-gradient-loader gradient-2-loader"></div>
        <div className="bg-gradient-loader gradient-3-loader"></div>
        
        <div className="floating-shapes-loader">
          <div className="shape-loader shape-1-loader"></div>
          <div className="shape-loader shape-2-loader"></div>
          <div className="shape-loader shape-3-loader"></div>
        </div>
      </div>

      {/* Loader Content */}
      <div className="loader-content">
        {/* Animated Hippo Icon */}
        <div className="hippo-container">
          <div className="hippo-circle">
            <svg
              className="hippo-icon"
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          
          {/* Orbiting Dots */}
          <div className="orbit-ring">
            <div className="orbit-dot orbit-dot-1"></div>
            <div className="orbit-dot orbit-dot-2"></div>
            <div className="orbit-dot orbit-dot-3"></div>
            <div className="orbit-dot orbit-dot-4"></div>
          </div>
        </div>

        {/* Logo Text */}
        <div className="loader-logo">
          <span className="logo-text-gradient">Quiz</span>
          <span className="logo-text-white">Hippo</span>
        </div>

        {/* Loading Bar */}
        <div className="loading-bar-container">
          <div className="loading-bar">
            <div className="loading-bar-fill"></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="loading-text">
          <span className="loading-text-main">Loading your experience</span>
          <div className="loading-dots">
            <span className="dot">.</span>
            <span className="dot">.</span>
            <span className="dot">.</span>
          </div>
        </div>

        {/* Stats Animation */}
        <div className="loader-stats">
          <div className="stat-item-loader">
            <div className="stat-icon-loader">✨</div>
            <div className="stat-text-loader">Preparing Quizzes</div>
          </div>
          <div className="stat-item-loader">
            <div className="stat-icon-loader">🎯</div>
            <div className="stat-text-loader">Loading Content</div>
          </div>
          <div className="stat-item-loader">
            <div className="stat-icon-loader">🚀</div>
            <div className="stat-text-loader">Almost Ready</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .loader-page {
          width: 100%;
          min-height: 100vh;
          background: #020617;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        /* Background Effects */
        .loader-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
          overflow: hidden;
        }

        .bg-gradient-loader {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.4;
          animation: pulse 8s ease-in-out infinite;
        }

        .gradient-1-loader {
          width: 600px;
          height: 600px;
          background: linear-gradient(135deg, #6366F1 0%, #8b5cf6 100%);
          top: -200px;
          right: -200px;
        }

        .gradient-2-loader {
          width: 500px;
          height: 500px;
          background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
          bottom: -150px;
          left: -150px;
          animation-delay: 1s;
        }

        .gradient-3-loader {
          width: 400px;
          height: 400px;
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: 2s;
        }

        .floating-shapes-loader {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .shape-loader {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.3;
        }

        .shape-1-loader {
          width: 300px;
          height: 300px;
          background: linear-gradient(135deg, #6366F1 0%, #8b5cf6 100%);
          top: 20%;
          left: 10%;
          animation: float 15s ease-in-out infinite;
        }

        .shape-2-loader {
          width: 250px;
          height: 250px;
          background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
          top: 60%;
          right: 15%;
          animation: float 18s ease-in-out infinite reverse;
        }

        .shape-3-loader {
          width: 200px;
          height: 200px;
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          bottom: 20%;
          left: 30%;
          animation: float 20s ease-in-out infinite;
        }

        /* Loader Content */
        .loader-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 32px;
          animation: fadeIn 1s ease;
        }

        /* Hippo Container */
        .hippo-container {
          position: relative;
          width: 160px;
          height: 160px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hippo-circle {
          width: 120px;
          height: 120px;
          background: rgba(42, 42, 64, 0.6);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(99, 102, 241, 0.4);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 20px 60px rgba(99, 102, 241, 0.3),
                      0 0 80px rgba(99, 102, 241, 0.2);
          animation: scaleBreath 3s ease-in-out infinite;
        }

        .hippo-icon {
          color: #6366F1;
          animation: rotate 4s linear infinite;
        }

        .orbit-ring {
          position: absolute;
          width: 160px;
          height: 160px;
          border-radius: 50%;
          animation: rotate 8s linear infinite;
        }

        .orbit-dot {
          position: absolute;
          width: 12px;
          height: 12px;
          background: linear-gradient(135deg, #6366F1 0%, #8b5cf6 100%);
          border-radius: 50%;
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.6);
        }

        .orbit-dot-1 {
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          animation: pulse 1.5s ease-in-out infinite;
        }

        .orbit-dot-2 {
          top: 50%;
          right: 0;
          transform: translateY(-50%);
          animation: pulse 1.5s ease-in-out infinite 0.375s;
        }

        .orbit-dot-3 {
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          animation: pulse 1.5s ease-in-out infinite 0.75s;
        }

        .orbit-dot-4 {
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          animation: pulse 1.5s ease-in-out infinite 1.125s;
        }

        /* Logo Text */
        .loader-logo {
          font-size: 48px;
          font-weight: 800;
          display: flex;
          gap: 12px;
          animation: slideUp 1s ease;
        }

        .logo-text-gradient {
          background: linear-gradient(135deg, #6366F1 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .logo-text-white {
          color: #ffffff;
        }

        /* Loading Bar */
        .loading-bar-container {
          width: 300px;
          animation: slideUp 1s ease 0.2s both;
        }

        .loading-bar {
          width: 100%;
          height: 6px;
          background: rgba(99, 102, 241, 0.2);
          border-radius: 10px;
          overflow: hidden;
          position: relative;
        }

        .loading-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #6366F1 0%, #8b5cf6 50%, #6366F1 100%);
          background-size: 200% 100%;
          border-radius: 10px;
          animation: loadingBar 2s ease-in-out infinite;
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.5);
        }

        /* Loading Text */
        .loading-text {
          display: flex;
          align-items: center;
          gap: 4px;
          animation: slideUp 1s ease 0.4s both;
        }

        .loading-text-main {
          font-size: 16px;
          color: #9ca3af;
          font-weight: 500;
        }

        .loading-dots {
          display: flex;
          gap: 2px;
        }

        .dot {
          font-size: 20px;
          color: #6366F1;
          animation: bounce 1.4s ease-in-out infinite;
        }

        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        /* Loader Stats */
        .loader-stats {
          display: flex;
          gap: 40px;
          margin-top: 20px;
          animation: slideUp 1s ease 0.6s both;
        }

        .stat-item-loader {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          opacity: 0.7;
          animation: fadeInScale 1s ease infinite;
        }

        .stat-item-loader:nth-child(1) {
          animation-delay: 0s;
        }

        .stat-item-loader:nth-child(2) {
          animation-delay: 0.6s;
        }

        .stat-item-loader:nth-child(3) {
          animation-delay: 1.2s;
        }

        .stat-icon-loader {
          font-size: 24px;
        }

        .stat-text-loader {
          font-size: 12px;
          color: #6b7280;
          font-weight: 500;
        }

        /* Animations */
        @keyframes pulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.05);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes scaleBreath {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 20px 60px rgba(99, 102, 241, 0.3),
                        0 0 80px rgba(99, 102, 241, 0.2);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 25px 70px rgba(99, 102, 241, 0.4),
                        0 0 100px rgba(99, 102, 241, 0.3);
          }
        }

        @keyframes loadingBar {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-8px);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          0%, 100% {
            opacity: 0.4;
            transform: scale(0.95);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .loader-logo {
            font-size: 36px;
          }

          .loading-bar-container {
            width: 250px;
          }

          .loader-stats {
            gap: 24px;
          }

          .stat-icon-loader {
            font-size: 20px;
          }

          .stat-text-loader {
            font-size: 11px;
          }
        }

        @media (max-width: 480px) {
          .hippo-container {
            width: 140px;
            height: 140px;
          }

          .hippo-circle {
            width: 100px;
            height: 100px;
          }

          .hippo-icon {
            width: 60px;
            height: 60px;
          }

          .orbit-ring {
            width: 140px;
            height: 140px;
          }

          .orbit-dot {
            width: 10px;
            height: 10px;
          }

          .loader-logo {
            font-size: 32px;
            gap: 8px;
          }

          .loading-bar-container {
            width: 220px;
          }

          .loading-text-main {
            font-size: 14px;
          }

          .loader-stats {
            flex-direction: column;
            gap: 16px;
          }

          .gradient-1-loader,
          .gradient-2-loader,
          .gradient-3-loader {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default QuizHippoLoader;