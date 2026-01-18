import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import './App.css';

function App() {
  // Simple state to handle view switching for now
  // In a real app, use a router or auth context
  const [currentView, setCurrentView] = useState('dashboard'); // Default to dashboard for development

  const renderView = () => {
    switch (currentView) {
      case 'login':
        return (
          <Login
            onLogin={() => setCurrentView('dashboard')}
            onRegister={() => setCurrentView('register')}
            onForgotPassword={() => setCurrentView('forgot-password')}
          />
        );
      case 'register':
        return <Register onLogin={() => setCurrentView('login')} />;
      case 'forgot-password':
        return <ForgotPassword onBack={() => setCurrentView('login')} />;
      case 'dashboard':
        return <Dashboard onLogout={() => setCurrentView('login')} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AuthProvider>
      <div className="app">
        {renderView()}
      </div>
    </AuthProvider>
  );
}

export default App;