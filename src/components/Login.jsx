import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = ({ onLogin, onRegister, onForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStaffMode, setIsStaffMode] = useState(false);
  const { login } = useAuth();

  const toggleStaffMode = () => {
    setIsStaffMode(!isStaffMode);
    if (!isStaffMode) {
      setEmail('bigwiromalice7@gmail.com');
      setPassword('Romalice@#7');
    } else {
      setEmail('');
      setPassword('');
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    const result = await login(email, password);

    if (!result.success) {
      setError(result.error || 'Login failed. Please try again.');
    } else {
      if (onLogin) onLogin();
    }

    setIsLoading(false);
  };

  return (
    <div className="auth-container">
      <div className={`auth-card ${isStaffMode ? 'staff-mode' : ''}`}>
        <div className="auth-header">
          <div className="auth-logo">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {isStaffMode ? (
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              ) : (
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              )}
            </svg>
          </div>
          <h2>{isStaffMode ? 'Staff Access' : 'Welcome to AI-GUIDANCE'}</h2>
          <p>{isStaffMode ? 'Admin & Content Management' : 'Academic & Career Assistant'}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-message">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">{isStaffMode ? 'Staff Email' : 'Email Address'}</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isStaffMode ? 'admin@kecs.edu' : 'student@example.com'}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </div>

          <div className="form-options">
            <button type="button" onClick={() => onForgotPassword()} className="forgot-link">
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : (isStaffMode ? 'Staff Sign In' : 'Sign In')}
          </button>
        </form>

        <div className="auth-mode-toggle">
          <button
            type="button"
            className="mode-toggle-btn"
            onClick={toggleStaffMode}
            disabled={isLoading}
          >
            {isStaffMode ? 'Back to Student Login' : 'Staff Login Portal 🛡️'}
          </button>
        </div>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <button
              onClick={onRegister}
              className="link-button"
              disabled={isLoading}
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;