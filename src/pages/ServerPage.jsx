import React, { useState } from 'react';
import Sidebar from "../components/Sidebar";
import FloatingChatButton from "../components/FloatingChatButton";
import '../css/server.css';

const ServerPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [serverCode, setServerCode] = useState('');
  const [newServer, setNewServer] = useState({
    name: '',
    description: '',
    isPrivate: false
  });

  const servers = [
    {
      id: 1,
      name: 'Python Learners Hub',
      code: 'PY2024XZ',
      members: 234,
      quizzes: 45,
      description: 'A community for Python enthusiasts to share quizzes and learn together',
      isOwner: true,
      color: '#3b82f6'
    },
    {
      id: 2,
      name: 'Web Dev Mastery',
      code: 'WEBDEV99',
      members: 189,
      quizzes: 67,
      description: 'Master web development with interactive quizzes and challenges',
      isOwner: false,
      color: '#8b5cf6'
    },
    {
      id: 3,
      name: 'Data Science Academy',
      code: 'DS2024AI',
      members: 456,
      quizzes: 89,
      description: 'Explore data science concepts through hands-on quizzes',
      isOwner: false,
      color: '#06b6d4'
    },
    {
      id: 4,
      name: 'Algorithm Warriors',
      code: 'ALGO2024',
      members: 178,
      quizzes: 52,
      description: 'Challenge yourself with algorithmic problem-solving quizzes',
      isOwner: true,
      color: '#10b981'
    }
  ];

  const handleCreateServer = () => {
    console.log('Creating server:', newServer);
    setShowCreateModal(false);
    setNewServer({ name: '', description: '', isPrivate: false });
  };

  const handleJoinServer = () => {
    console.log('Joining server with code:', serverCode);
    setShowJoinModal(false);
    setServerCode('');
  };

  const handleViewServer = (serverId) => {
    console.log('Viewing server:', serverId);
  };

  const handleLeaveServer = (serverId) => {
    console.log('Leaving server:', serverId);
  };

  const handleManageServer = (serverId) => {
    console.log('Managing server:', serverId);
  };

  return (
    <div className="server-page">
      <Sidebar />
      <FloatingChatButton />
      
      <div className="server-content">
        <div className="server-section">
          {/* Header */}
          <div className="server-header">
            <div className="server-header-text">
              <h1 className="server-title">Your Servers</h1>
              <p className="server-subtitle">Join communities, create servers, and collaborate with others</p>
            </div>
            <div className="server-header-actions">
              <button className="btn-join-server" onClick={() => setShowJoinModal(true)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="8.5" cy="7" r="4"/>
                  <line x1="20" y1="8" x2="20" y2="14"/>
                  <line x1="23" y1="11" x2="17" y2="11"/>
                </svg>
                Join Server
              </button>
              <button className="btn-create-server" onClick={() => setShowCreateModal(true)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="16"/>
                  <line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
                Create Server
              </button>
            </div>
          </div>

          {/* Server Cards Grid */}
          <div className="server-grid">
            {servers.map((server) => (
              <div key={server.id} className="server-card" style={{ '--card-color': server.color }}>
                <div className="server-card-glow"></div>
                <div className="server-card-content">
                  <div className="server-card-header">
                    <div className="server-icon" style={{ background: server.color }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <line x1="9" y1="9" x2="15" y2="9"/>
                        <line x1="9" y1="15" x2="15" y2="15"/>
                      </svg>
                    </div>
                    <div className="server-badge" style={{ background: `${server.color}33`, color: server.color }}>
                      {server.isOwner ? 'Owner' : 'Member'}
                    </div>
                  </div>

                  <h3 className="server-name">{server.name}</h3>
                  <p className="server-description">{server.description}</p>

                  <div className="server-stats">
                    <div className="stat-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                      <span>{server.members} members</span>
                    </div>
                    <div className="stat-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                        <polyline points="10 9 9 9 8 9"/>
                      </svg>
                      <span>{server.quizzes} quizzes</span>
                    </div>
                  </div>

                  <div className="server-code-display">
                    <span className="code-label">Server Code:</span>
                    <span className="code-value">{server.code}</span>
                  </div>

                  <div className="server-card-actions">
                    <button 
                      className="btn-view" 
                      onClick={() => handleViewServer(server.id)}
                      style={{ background: `${server.color}22`, color: server.color }}
                    >
                      View Server
                    </button>
                    {server.isOwner ? (
                      <button 
                        className="btn-manage" 
                        onClick={() => handleManageServer(server.id)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="3"/>
                          <path d="M12 1v6m0 6v6m-6-6h6m6 0h6"/>
                        </svg>
                      </button>
                    ) : (
                      <button 
                        className="btn-leave" 
                        onClick={() => handleLeaveServer(server.id)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                          <polyline points="16 17 21 12 16 7"/>
                          <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Server Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Create New Server</h2>
              <button className="btn-close" onClick={() => setShowCreateModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Server Name</label>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="Enter server name..."
                  value={newServer.name}
                  onChange={(e) => setNewServer({ ...newServer, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="modal-textarea"
                  placeholder="Describe your server..."
                  rows="4"
                  value={newServer.description}
                  onChange={(e) => setNewServer({ ...newServer, description: e.target.value })}
                />
              </div>

              <div className="form-group-checkbox">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={newServer.isPrivate}
                    onChange={(e) => setNewServer({ ...newServer, isPrivate: e.target.checked })}
                  />
                  <span className="checkbox-custom"></span>
                  <span>Make this server private</span>
                </label>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowCreateModal(false)}>
                Cancel
              </button>
              <button className="btn-confirm" onClick={handleCreateServer}>
                Create Server
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Join Server Modal */}
      {showJoinModal && (
        <div className="modal-overlay" onClick={() => setShowJoinModal(false)}>
          <div className="modal-content modal-join" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Join Server</h2>
              <button className="btn-close" onClick={() => setShowJoinModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <div className="join-illustration">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>

              <p className="join-description">Enter the server code to join a community</p>

              <div className="form-group">
                <label>Server Code</label>
                <input
                  type="text"
                  className="modal-input code-input"
                  placeholder="e.g., PY2024XZ"
                  value={serverCode}
                  onChange={(e) => setServerCode(e.target.value.toUpperCase())}
                  maxLength="10"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowJoinModal(false)}>
                Cancel
              </button>
              <button 
                className="btn-confirm" 
                onClick={handleJoinServer}
                disabled={!serverCode}
              >
                Join Server
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServerPage;