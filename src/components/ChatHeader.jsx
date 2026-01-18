import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './ChatHeader.css';

const ChatHeader = ({ onNewConversation, conversationId, onProfileClick, onPreferencesClick, onAboutClick, onLogout }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    if (onLogout) {
      onLogout();
    }
    setShowUserMenu(false);
  };

  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick();
    }
    setShowUserMenu(false);
  };

  const handlePreferencesClick = () => {
    if (onPreferencesClick) {
      onPreferencesClick();
    }
    setShowUserMenu(false);
  };

  const handleAboutClick = () => {
    if (onAboutClick) {
      onAboutClick();
    }
    setShowUserMenu(false);
  };

  return (
    <header className="chat-header">
      <div className="header-content">
        <div className="logo-section">
          <div className="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <div className="logo-text">
            <h1>AI-GUIDANCE</h1>
            <p>Academic & Career Assistant</p>
          </div>
        </div>

        <div className="header-actions">
          {conversationId && (
            <button
              className="new-chat-button"
              onClick={onNewConversation}
              title="Start new conversation"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14"></path>
              </svg>
              New Chat
            </button>
          )}

          <div className="user-section">
            <button
              className="user-avatar"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>

            {showUserMenu && (
              <div className="user-menu">
                <div className="user-menu-header">
                  <p className="user-name">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="user-email">{user?.email}</p>
                  {user?.studentId && (
                    <p className="user-id">ID: {user.studentId}</p>
                  )}
                </div>
                <div className="user-menu-divider"></div>
                <button className="user-menu-item" onClick={handleProfileClick}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Profile Settings
                </button>
                <button className="user-menu-item" onClick={handlePreferencesClick}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M12 1v6m0 6v6M1 12h6m6 0h6"></path>
                  </svg>
                  Preferences
                </button>
                <button className="user-menu-item" onClick={handleAboutClick}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  About US
                </button>
                <div className="user-menu-divider"></div>
                <button
                  className="user-menu-item logout"
                  onClick={handleLogout}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;