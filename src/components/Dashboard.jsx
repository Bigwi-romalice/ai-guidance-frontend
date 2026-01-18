import React, { useState } from 'react';
import apiService from '../services/api';
import ChatHeader from './ChatHeader';
import ChatWindow from './ChatWindow';
import InputBox from './InputBox';
import QuickActions from './QuickActions';
import CareerExplorer from './CareerExplorer';
import AcademicPlanner from './AcademicPlanner';
import LearningHub from './LearningHub';
import UserProfile from './UserProfile';
import Settings from './Settings';
import AnalyticsDashboard from './AnalyticsDashboard';
import AssessmentLauncher from './AssessmentLauncher';
import AssessmentQuiz from './AssessmentQuiz';
import AssessmentResults from './AssessmentResults';
import AdminDashboard from './AdminDashboard';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = ({ onLogout }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Welcome back! How can I help you today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeView, setActiveView] = useState('chat'); // 'chat' | 'career' | 'academic' | 'learning' | 'profile' | 'analytics' | 'assessment'

  // Assessment State
  const [assessmentStep, setAssessmentStep] = useState('launcher'); // 'launcher' | 'quiz' | 'results'
  const [currentAssessmentId, setCurrentAssessmentId] = useState(null);
  const [assessmentResult, setAssessmentResult] = useState(null);

  const handleSendMessage = (message) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Call API for bot response
    apiService.sendMessage(message)
      .then(data => {
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          text: data.response,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      })
      .catch(err => {
        console.error("Chat Error:", err);
        const errorMessage = {
          id: Date.now() + 1,
          type: 'bot',
          text: "I'm having trouble connecting right now. Please try again later.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, errorMessage]);
        setIsTyping(false);
      });
  };

  const handleQuickAction = (action) => {
    const lowerAction = action.toLowerCase();
    if (lowerAction.includes('analytics')) {
      setActiveView('analytics');
    } else if (lowerAction.includes('assessment') || lowerAction.includes('quiz')) {
      setAssessmentStep('launcher');
      setActiveView('assessment');
    } else if (lowerAction.includes('career')) {
      setActiveView('career');
    } else if (lowerAction.includes('academic') || lowerAction.includes('program')) {
      setActiveView('academic');
    } else if (lowerAction.includes('learning') || lowerAction.includes('recommend')) {
      setActiveView('learning');
    } else if (lowerAction.includes('admin') || lowerAction.includes('panel')) {
      setActiveView('admin');
    } else {
      handleSendMessage(action);
    }
  };

  const startAssessment = (id) => {
    setCurrentAssessmentId(id);
    setAssessmentStep('quiz');
  };

  const finishAssessment = (result) => {
    setAssessmentResult(result);
    setAssessmentStep('results');
  };

  const renderAssessmentView = () => {
    if (assessmentStep === 'launcher') {
      return <AssessmentLauncher onStart={startAssessment} onBack={() => setActiveView('chat')} />;
    } else if (assessmentStep === 'quiz') {
      return (
        <AssessmentQuiz
          assessmentId={currentAssessmentId}
          onComplete={finishAssessment}
          onCancel={() => setActiveView('chat')}
        />
      );
    } else if (assessmentStep === 'results') {
      return (
        <AssessmentResults
          result={assessmentResult}
          onBack={() => setActiveView('chat')}
        />
      );
    }
  };

  return (
    <div className="dashboard">
      <ChatHeader
        onLogout={onLogout}
        onProfileClick={() => setActiveView('profile')}
        onPreferencesClick={() => setActiveView('settings')}
      />

      <div className="dashboard-container">
        <div className="welcome-section">
          <h1>Welcome back!</h1>
          <p>How can I help you today?</p>
        </div>

        <div className="main-content">
          <QuickActions onActionClick={handleQuickAction} />

          {activeView === 'chat' ? (
            <div className="chat-section">
              <ChatWindow
                messages={messages}
                isTyping={isTyping}
              />
              <InputBox
                value={inputValue}
                onChange={setInputValue}
                onSend={handleSendMessage}
              />
            </div>
          ) : activeView === 'career' ? (
            <CareerExplorer onBack={() => setActiveView('chat')} />
          ) : activeView === 'academic' ? (
            <AcademicPlanner onBack={() => setActiveView('chat')} />
          ) : activeView === 'learning' ? (
            <LearningHub onBack={() => setActiveView('chat')} />
          ) : activeView === 'profile' ? (
            <UserProfile onBack={() => setActiveView('chat')} />
          ) : activeView === 'settings' ? (
            <Settings onBack={() => setActiveView('chat')} />
          ) : activeView === 'analytics' ? (
            <AnalyticsDashboard onBack={() => setActiveView('chat')} />
          ) : activeView === 'admin' ? (
            <AdminDashboard onBack={() => setActiveView('chat')} />
          ) : activeView === 'assessment' ? (
            renderAssessmentView()
          ) : (
            <div className="placeholder-view">Feature coming soon</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;