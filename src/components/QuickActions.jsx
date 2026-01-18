import React from 'react';
import { useAuth } from '../context/AuthContext';
import './QuickActions.css';

const QuickActions = ({ onActionClick }) => {
  const { user } = useAuth();

  const categories = [
    {
      icon: '🎓',
      title: 'Academic Guidance',
      subtitle: 'Programs & courses',
      action: 'Tell me about available academic programs'
    },
    {
      icon: '🎯',
      title: 'Career Advisory',
      subtitle: 'Explore careers',
      action: 'What career paths are available in Computer Science?'
    },
    {
      icon: '💡',
      title: 'Learning Recs',
      subtitle: 'Personalized courses',
      action: 'Recommend courses for data science beginners'
    },
    {
      icon: '🧠',
      title: 'Assessments',
      subtitle: 'Find your path',
      action: 'Take an assessment quiz'
    }
  ];

  // Add Admin tools if user is admin
  if (user?.role === 'admin') {
    categories.push({
      icon: '📊',
      title: 'Analytics',
      subtitle: 'System Usage',
      action: 'Open Analytics'
    });
    categories.push({
      icon: '🛡️',
      title: 'Admin Panel',
      subtitle: 'Knowledge & Feedback',
      action: 'Open Admin Panel'
    });
  }

  const recentQuestions = [
    {
      question: 'What career paths are available in Computer Science?',
      time: '2 hours ago'
    },
    {
      question: 'How do I choose between Engineering and Business?',
      time: '1 day ago'
    },
    {
      question: 'Recommend courses for data science beginners',
      time: '2 days ago'
    }
  ];

  return (
    <div className="quick-actions">
      <div className="actions-card">
        <h3 className="actions-title">Guidance Services</h3>
        <div className="actions-grid">
          {categories.map((category, index) => (
            <button
              key={index}
              className="action-button"
              onClick={() => onActionClick(category.action)}
            >
              <div className="action-icon">{category.icon}</div>
              <div className="action-content">
                <div className="action-title">{category.title}</div>
                <div className="action-subtitle">{category.subtitle}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="recent-card">
        <h3 className="recent-title">Recent Questions</h3>
        <div className="recent-list">
          {recentQuestions.map((item, index) => (
            <button
              key={index}
              className="recent-item"
              onClick={() => onActionClick(item.question)}
            >
              <div className="recent-question">{item.question}</div>
              <div className="recent-time">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                {item.time}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;