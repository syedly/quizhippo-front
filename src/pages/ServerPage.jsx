import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchServers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "http://localhost:8000/api/servers/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const serverData = response.data.servers || [];
        
        // Get current user info for ownership check
        const profileResponse = await axios.get(
          "http://localhost:8000/api/profile/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const currentUsername = profileResponse.data.username;

        const formattedServers = serverData.map(server => ({
          id: server.id,
          name: server.name,
          code: server.code,
          members: 0,
          quizzes: server.quizzes?.length || 0,
          description: server.description || 'No description provided.',
          isOwner: server.created_by === currentUsername,
          color: getRandomColor()
        }));

        setServers(formattedServers);
      } catch (error) {
        console.error("Error fetching servers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServers();
  }, []);

  const getRandomColor = () => {
    const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleCreateServer = async () => {
    if (!newServer.name.trim()) {
      alert("Please enter a server name.");
      return;
    }

    setCreateLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("You must be logged in to create a server.");
        setCreateLoading(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:8000/api/servers/create/",
        {
          name: newServer.name,
          description: newServer.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert(`✅ ${response.data.message}`);
      
      // Add new server to the list
      const newServerData = {
        id: response.data.server_id,
        name: newServer.name,
        code: response.data.code,
        members: 1,
        quizzes: 0,
        description: newServer.description || 'No description provided.',
        isOwner: true,
        color: getRandomColor()
      };

      setServers(prev => [...prev, newServerData]);
      setShowCreateModal(false);
      setNewServer({ name: '', description: '', isPrivate: false });
    } catch (error) {
      console.error("Error creating server:", error);
      if (error.response?.status === 401) {
        alert("❌ Session expired. Please log in again.");
      } else if (error.response?.status === 400) {
        alert(`❌ ${error.response.data.error || "Invalid request."}`);
      } else {
        alert("❌ Failed to create server. Please try again.");
      }
    } finally {
      setCreateLoading(false);
    }
  };

  const handleJoinServer = async () => {
    if (!serverCode.trim()) {
      alert("Please enter a server code.");
      return;
    }

    setJoinLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("You must be logged in to join a server.");
        setJoinLoading(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:8000/api/servers/join/",
        { code: serverCode.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert(`✅ ${response.data.message}`);

      // Fetch the server details and add to list
      try {
        const detailResponse = await axios.get(
          `http://localhost:8000/api/servers/${response.data.server_id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const joinedServer = {
          id: response.data.server_id,
          name: detailResponse.data.name,
          code: detailResponse.data.code,
          members: 0,
          quizzes: detailResponse.data.quizzes?.length || 0,
          description: detailResponse.data.description || 'No description provided.',
          isOwner: false,
          color: getRandomColor()
        };

        setServers(prev => [...prev, joinedServer]);
      } catch (err) {
        console.error("Error fetching joined server details:", err);
      }

      setShowJoinModal(false);
      setServerCode('');
    } catch (error) {
      console.error("Error joining server:", error);
      if (error.response?.status === 401) {
        alert("❌ Session expired. Please log in again.");
      } else if (error.response?.status === 404) {
        alert(`❌ ${error.response.data.error || "Invalid server code."}`);
      } else if (error.response?.status === 400) {
        alert(`❌ ${error.response.data.error || "Invalid request."}`);
      } else {
        alert("❌ Failed to join server. Please try again.");
      }
    } finally {
      setJoinLoading(false);
    }
  };

  const handleViewServer = (serverId) => {
    navigate(`/servers/${serverId}`);
  };

  const handleLeaveServer = (serverId) => {
    console.log('Leaving server:', serverId);
  };

  const handleManageServer = (serverId) => {
    console.log('Managing server:', serverId);
  };

  if (loading) {
    return (
      <div className="server-page">
        <Sidebar />
        <FloatingChatButton />
        <div className="server-content">
          <div className="server-section">
            <p>Loading servers...</p>
          </div>
        </div>
      </div>
    );
  }

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
            {servers.length > 0 ? (
              servers.map((server) => (
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
              ))
            ) : (
              <p>No servers found. Create or join a server to get started!</p>
            )}
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
                  disabled={createLoading}
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
                  disabled={createLoading}
                />
              </div>

              <div className="form-group-checkbox">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={newServer.isPrivate}
                    onChange={(e) => setNewServer({ ...newServer, isPrivate: e.target.checked })}
                    disabled={createLoading}
                  />
                  <span className="checkbox-custom"></span>
                  <span>Make this server private</span>
                </label>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-cancel" 
                onClick={() => setShowCreateModal(false)}
                disabled={createLoading}
              >
                Cancel
              </button>
              <button 
                className="btn-confirm" 
                onClick={handleCreateServer}
                disabled={createLoading}
              >
                {createLoading ? "Creating..." : "Create Server"}
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
                  disabled={joinLoading}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-cancel" 
                onClick={() => setShowJoinModal(false)}
                disabled={joinLoading}
              >
                Cancel
              </button>
              <button 
                className="btn-confirm" 
                onClick={handleJoinServer}
                disabled={!serverCode || joinLoading}
              >
                {joinLoading ? "Joining..." : "Join Server"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServerPage;