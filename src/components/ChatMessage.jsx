import React from 'react';
import './ChatMessage.css';

const ChatMessage = ({ message }) => {
  const isBot = message.type === 'bot';

  return (
    <div className={`message-wrapper ${isBot ? 'bot-message' : 'user-message'}`}>
      {isBot && (
        <div className="message-avatar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
      )}
      
      <div className="message-content-wrapper">
        <div className={`message-bubble ${isBot ? 'bot-bubble' : 'user-bubble'}`}>
          <p>{message.text}</p>
        </div>
        <span className="message-time">{message.time}</span>
      </div>

      {!isBot && (
        <div className="message-avatar user-avatar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;