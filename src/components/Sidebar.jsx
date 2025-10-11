import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Sidebar() {
  const styles = {
    sidebar: {
      width: '256px',
      backgroundColor: '#0f172a',
      borderRight: '1px solid #1e293b',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0
    },
    header: { padding: '24px' },
    logo: { fontSize: '20px', fontWeight: 'bold', color: '#ffffff' },
    nav: { flex: 1, padding: '0 12px' },
    navButton: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      borderRadius: '8px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
      marginBottom: '8px',
      transition: 'background-color 0.2s'
    },
    navButtonActive: { backgroundColor: '#4f46e5', color: '#ffffff' },
    navButtonInactive: { color: '#94a3b8' },
    footer: { padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' },
    newQuizButton: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '12px 16px',
      borderRadius: '8px',
      backgroundColor: '#4f46e5',
      color: '#ffffff',
      fontWeight: '500',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    logoutButton: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '12px 16px',
      borderRadius: '8px',
      backgroundColor: '#dc2626',
      color: '#ffffff',
      fontWeight: '500',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    }
  };

  const [activeNav, setActiveNav] = useState('home');
  const navigate = useNavigate();

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    const accessToken = localStorage.getItem('access_token');

    try {
      if (refreshToken && accessToken) {
        await axios.post(
          'http://localhost:8000/api/logout-view/',
          { refresh: refreshToken },
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
      }
    } catch (error) {
      console.error(
        'Logout error:',
        error.response?.data || error.message || error
      );
    } finally {
      // ✅ Always clear tokens and redirect, even if API failed
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      navigate('/login');
    }
  };


  return (
    <div style={styles.sidebar}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.logo}>Quiz Hippo</h1>
      </div>

      {/* Navigation */}
      <nav style={styles.nav}>
        <button
          onClick={() => { setActiveNav('main'); navigate('/main'); }}
          style={{
            ...styles.navButton,
            ...(activeNav === 'main' ? styles.navButtonActive : styles.navButtonInactive)
          }}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Home</span>
        </button>

        <button
          onClick={() => { setActiveNav('profile'); navigate('/profile'); }}
          style={{
            ...styles.navButton,
            ...(activeNav === 'profile' ? styles.navButtonActive : styles.navButtonInactive)
          }}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>Profile</span>
        </button>

        <button
          onClick={() => { setActiveNav('quizzes'); navigate('/quizzes'); }}
          style={{
            ...styles.navButton,
            ...(activeNav === 'quizzes' ? styles.navButtonActive : styles.navButtonInactive)
          }}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>My Quizzes</span>
        </button>

        <button
          onClick={() => { setActiveNav('explore'); navigate('/explore'); }}
          style={{
            ...styles.navButton,
            ...(activeNav === 'explore' ? styles.navButtonActive : styles.navButtonInactive)
          }}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
          <span>Explore</span>
        </button>

        <button
          onClick={() => { setActiveNav('server'); navigate('/server'); }}
          style={{
            ...styles.navButton,
            ...(activeNav === 'server' ? styles.navButtonActive : styles.navButtonInactive)
          }}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
          </svg>
          <span>Server</span>
        </button>

        <button
          onClick={() => { setActiveNav('settings'); navigate('/settings'); }}
          style={{
            ...styles.navButton,
            ...(activeNav === 'settings' ? styles.navButtonActive : styles.navButtonInactive)
          }}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 
              3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 
              1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 
              2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 
              00-2.572 1.065c-.426 1.756-2.924 
              1.756-3.35 0a1.724 1.724 0 
              00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 
              1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 
              0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 
              2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Settings</span>
        </button>
      </nav>

      {/* Footer */}
      <div style={styles.footer}>
        <button
          style={styles.newQuizButton}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#4338ca'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#4f46e5'}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 
              0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>New Quiz</span>
        </button>

        {/* ✅ Logout Button */}
        <button
          style={styles.logoutButton}
          onClick={handleLogout}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 
              4v1a3 3 0 01-3 3H6a3 3 0 
              01-3-3V7a3 3 0 013-3h4a3 
              3 0 013 3v1" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
