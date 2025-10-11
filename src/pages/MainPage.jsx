import { useState } from "react";
import Sidebar from "../components/Sidebar";
import FloatingChatButton from "../components/FloatingChatButton";

export default function CreateQuiz() {
  const [quizType, setQuizType] = useState("mix");
  const [numQuestions, setNumQuestions] = useState("5");
  const [difficulty, setDifficulty] = useState("level1");
  const [language, setLanguage] = useState("english");
  const [text, setText] = useState("");
  const [activeTab, setActiveTab] = useState("text");

  const styles = {
    container: {
      backgroundColor: '#020617',
      padding: '40px 32px',
      minHeight: '100vh',
      width: '100vw',
      boxSizing: 'border-box',
      display: 'flex'
    },
    sidebar: {
      width: '250px',
      flexShrink: 0
    },
    mainWrapper: {
      flex: 1,
      paddingLeft: '32px'
    },
    content: {
      maxWidth: '100%',
      width: '100%',
      margin: '0 auto'
    },
    title: {
      fontSize: '36px',
      fontWeight: 'bold',
      color: '#ffffff',
      marginBottom: '40px'
    },
    tabsContainer: {
      marginBottom: '32px'
    },
    tabsWrapper: {
      display: 'flex',
      gap: '24px',
      marginBottom: '24px',
      borderBottom: '1px solid #1e293b',
      paddingBottom: '0'
    },
    tab: {
      padding: '4px',
      paddingBottom: '12px',
      fontWeight: '500',
      transition: 'color 0.2s',
      borderBottom: '2px solid transparent',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px'
    },
    tabActive: {
      color: '#ffffff',
      borderBottomColor: '#ffffff'
    },
    tabInactive: {
      color: '#64748b',
      borderBottomColor: 'transparent'
    },
    tabContent: {
      marginTop: '24px'
    },
    label: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#ffffff',
      marginBottom: '12px',
      display: 'block'
    },
    textarea: {
      width: '100%',
      minHeight: '200px',
      backgroundColor: 'rgba(15, 23, 42, 0.5)',
      border: '1px solid #1e293b',
      color: '#94a3b8',
      resize: 'none',
      borderRadius: '8px',
      outline: 'none',
      padding: '12px 16px',
      fontSize: '14px',
      fontFamily: 'inherit'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      backgroundColor: 'rgba(15, 23, 42, 0.5)',
      border: '1px solid #1e293b',
      borderRadius: '8px',
      color: '#94a3b8',
      outline: 'none',
      fontSize: '14px'
    },
    uploadBox: {
      border: '2px dashed #1e293b',
      borderRadius: '8px',
      padding: '64px',
      textAlign: 'center',
      backgroundColor: 'rgba(15, 23, 42, 0.3)',
      transition: 'background-color 0.2s',
      cursor: 'pointer'
    },
    uploadText: {
      color: '#64748b',
      fontSize: '14px'
    },
    settingsSection: {
      marginTop: '48px'
    },
    settingsTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#ffffff',
      marginBottom: '32px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '32px',
      width: '100%'
    },
    selectWrapper: {
      position: 'relative'
    },
    select: {
      width: '100%',
      appearance: 'none',
      backgroundColor: 'rgba(15, 23, 42, 0.5)',
      border: '1px solid #1e293b',
      color: '#ffffff',
      borderRadius: '8px',
      height: '48px',
      padding: '0 16px',
      outline: 'none',
      cursor: 'pointer',
      fontSize: '14px'
    },
    selectIcon: {
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none'
    },
    buttonWrapper: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: '40px'
    },
    button: {
      backgroundColor: '#4f46e5',
      color: '#ffffff',
      fontWeight: '500',
      padding: '12px 32px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '16px',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <Sidebar />
      </div>
      <div style={styles.mainWrapper}>
        <div style={styles.content}>
          <h1 style={styles.title}>
            Create a Quiz
          </h1>

          {/* Tabs Section */}
          <div style={styles.tabsContainer}>
            <div style={styles.tabsWrapper}>
              <button
                onClick={() => setActiveTab("text")}
                style={{
                  ...styles.tab,
                  ...(activeTab === "text" ? styles.tabActive : styles.tabInactive)
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== "text") e.target.style.color = '#94a3b8';
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== "text") e.target.style.color = '#64748b';
                }}
              >
                Enter Text
              </button>
              <button
                onClick={() => setActiveTab("prompt")}
                style={{
                  ...styles.tab,
                  ...(activeTab === "prompt" ? styles.tabActive : styles.tabInactive)
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== "prompt") e.target.style.color = '#94a3b8';
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== "prompt") e.target.style.color = '#64748b';
                }}
              >
                Enter Prompt
              </button>
              <button
                onClick={() => setActiveTab("url")}
                style={{
                  ...styles.tab,
                  ...(activeTab === "url" ? styles.tabActive : styles.tabInactive)
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== "url") e.target.style.color = '#94a3b8';
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== "url") e.target.style.color = '#64748b';
                }}
              >
                Provide URL
              </button>
              <button
                onClick={() => setActiveTab("pdf")}
                style={{
                  ...styles.tab,
                  ...(activeTab === "pdf" ? styles.tabActive : styles.tabInactive)
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== "pdf") e.target.style.color = '#94a3b8';
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== "pdf") e.target.style.color = '#64748b';
                }}
              >
                Upload PDF
              </button>
            </div>

            <div style={styles.tabContent}>
              {activeTab === "text" && (
                <div>
                  <label style={styles.label}>
                    Text
                  </label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    style={styles.textarea}
                    placeholder="Enter your text here..."
                    onFocus={(e) => e.target.style.borderColor = '#334155'}
                    onBlur={(e) => e.target.style.borderColor = '#1e293b'}
                  />
                </div>
              )}

              {activeTab === "prompt" && (
                <div>
                  <label style={styles.label}>
                    Prompt
                  </label>
                  <textarea
                    style={styles.textarea}
                    placeholder="Enter your text here..."
                    onFocus={(e) => e.target.style.borderColor = '#334155'}
                    onBlur={(e) => e.target.style.borderColor = '#1e293b'}
                  />
                </div>
              )}

              {activeTab === "url" && (
                <div>
                  <label style={styles.label}>
                    URL
                  </label>
                  <input
                    type="url"
                    style={styles.input}
                    placeholder="https://example.com"
                    onFocus={(e) => e.target.style.borderColor = '#334155'}
                    onBlur={(e) => e.target.style.borderColor = '#1e293b'}
                  />
                </div>
              )}

              {activeTab === "pdf" && (
                <div>
                  <label style={styles.label}>
                    PDF
                  </label>
                  <div 
                    style={styles.uploadBox}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.5)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.3)'}
                  >
                    <p style={styles.uploadText}>
                      Click to upload or drag and drop PDF
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quiz Settings */}
          <div style={styles.settingsSection}>
            <h2 style={styles.settingsTitle}>
              Quiz Settings
            </h2>

            <div style={styles.grid}>
              {/* Quiz Type */}
              <div>
                <label style={styles.label}>
                  Quiz Type
                </label>
                <div style={styles.selectWrapper}>
                  <select
                    value={quizType}
                    onChange={(e) => setQuizType(e.target.value)}
                    style={styles.select}
                    onFocus={(e) => e.target.style.borderColor = '#334155'}
                    onBlur={(e) => e.target.style.borderColor = '#1e293b'}
                  >
                    <option value="mix">Mix</option>
                    <option value="multiple">Multiple Choice</option>
                    <option value="true-false">True/False</option>
                  </select>
                  <div style={styles.selectIcon}>
                    <svg width="20" height="20" fill="none" stroke="#94a3b8" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Number of Questions */}
              <div>
                <label style={styles.label}>
                  Number of Questions
                </label>
                <div style={styles.selectWrapper}>
                  <select
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(e.target.value)}
                    style={styles.select}
                    onFocus={(e) => e.target.style.borderColor = '#334155'}
                    onBlur={(e) => e.target.style.borderColor = '#1e293b'}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                  </select>
                  <div style={styles.selectIcon}>
                    <svg width="20" height="20" fill="none" stroke="#94a3b8" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label style={styles.label}>
                  Difficulty
                </label>
                <div style={styles.selectWrapper}>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    style={styles.select}
                    onFocus={(e) => e.target.style.borderColor = '#334155'}
                    onBlur={(e) => e.target.style.borderColor = '#1e293b'}
                  >
                    <option value="level1">Level 1</option>
                    <option value="level2">Level 2</option>
                    <option value="level3">Level 3</option>
                  </select>
                  <div style={styles.selectIcon}>
                    <svg width="20" height="20" fill="none" stroke="#94a3b8" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Language */}
              <div>
                <label style={styles.label}>
                  Language
                </label>
                <div style={styles.selectWrapper}>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    style={styles.select}
                    onFocus={(e) => e.target.style.borderColor = '#334155'}
                    onBlur={(e) => e.target.style.borderColor = '#1e293b'}
                  >
                    <option value="english">English</option>
                    <option value="spanish">Spanish</option>
                    <option value="french">French</option>
                  </select>
                  <div style={styles.selectIcon}>
                    <svg width="20" height="20" fill="none" stroke="#94a3b8" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Create Quiz Button */}
            <div style={styles.buttonWrapper}>
              <button 
                style={styles.button}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#4338ca'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#4f46e5'}
              >
                Create Quiz
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <FloatingChatButton />
    </div>
  );
}