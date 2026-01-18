import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import './AdminDashboard.jsx.css';

const AdminDashboard = ({ onBack }) => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalInteractions: 0,
        unresolvedQuestions: 0,
        sentimentScore: 0
    });
    const [activeSubView, setActiveSubView] = useState('overview'); // 'overview' | 'kb' | 'feedback'

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await apiService.getAdminStats();
            setStats(data);
        } catch (err) {
            console.error("Failed to load stats:", err);
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <button onClick={onBack} className="back-button">← Back to Dashboard</button>
                <h2>KECS Staff Admin Panel</h2>
            </div>

            <nav className="admin-nav">
                <button
                    className={activeSubView === 'overview' ? 'active' : ''}
                    onClick={() => setActiveSubView('overview')}
                >
                    System Overview
                </button>
                <button
                    className={activeSubView === 'kb' ? 'active' : ''}
                    onClick={() => setActiveSubView('kb')}
                >
                    Knowledge Base Editor
                </button>
                <button
                    className={activeSubView === 'feedback' ? 'active' : ''}
                    onClick={() => setActiveSubView('feedback')}
                >
                    Feedback & Resolved
                </button>
            </nav>

            <div className="admin-content">
                {activeSubView === 'overview' && (
                    <div className="admin-overview">
                        <div className="stats-grid">
                            <div className="stat-card">
                                <h3>Total Users</h3>
                                <p className="stat-value">{stats.totalUsers}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Chat Interactions</h3>
                                <p className="stat-value">{stats.totalInteractions}</p>
                            </div>
                            <div className="stat-card urgent">
                                <h3>Unresolved Queries</h3>
                                <p className="stat-value">{stats.unresolvedQuestions}</p>
                            </div>
                            <div className="stat-card">
                                <h3>AI Sentiment Score</h3>
                                <p className="stat-value">{stats.sentimentScore}%</p>
                            </div>
                        </div>

                        <div className="system-health">
                            <h3>System Health</h3>
                            <div className="health-item">
                                <span>API Server Status</span>
                                <span className="status-badge online">Running</span>
                            </div>
                            <div className="health-item">
                                <span>Database Sync</span>
                                <span className="status-badge online">OK</span>
                            </div>
                            <div className="health-item">
                                <span>AI Response Engine</span>
                                <span className="status-badge online">Ready</span>
                            </div>
                        </div>
                    </div>
                )}

                {activeSubView === 'kb' && <KBEditor />}
                {activeSubView === 'feedback' && <FeedbackReview />}
            </div>
        </div>
    );
};

// --- Sub-components (Simplified for now, can move to separate files if large) ---

const KBEditor = () => {
    const [kb, setKB] = useState([]);
    const [editingEntry, setEditingEntry] = useState(null);
    const [formData, setFormData] = useState({ intent: '', keywords: '', response: '', category: 'General' });

    useEffect(() => {
        fetchKB();
    }, []);

    const fetchKB = async () => {
        const data = await apiService.getKB();
        setKB(data);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const entry = {
            ...formData,
            keywords: formData.keywords.split(',').map(k => k.trim())
        };

        if (editingEntry) {
            await apiService.updateKBEntry(editingEntry.id, entry);
        } else {
            await apiService.addKBEntry(entry);
        }

        setEditingEntry(null);
        setFormData({ intent: '', keywords: '', response: '', category: 'General' });
        fetchKB();
    };

    const handleEdit = (entry) => {
        setEditingEntry(entry);
        setFormData({
            intent: entry.intent,
            keywords: entry.keywords.join(', '),
            response: entry.response,
            category: entry.category
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this entry?")) {
            await apiService.deleteKBEntry(id);
            fetchKB();
        }
    };

    return (
        <div className="kb-editor">
            <form className="kb-form" onSubmit={handleSave}>
                <h3>{editingEntry ? 'Edit Entry' : 'Add New Knowledge Entry'}</h3>
                <div className="form-group">
                    <label>Intent Name</label>
                    <input
                        type="text"
                        value={formData.intent}
                        onChange={e => setFormData({ ...formData, intent: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Keywords (comma separated)</label>
                    <input
                        type="text"
                        value={formData.keywords}
                        onChange={e => setFormData({ ...formData, keywords: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>AI Response</label>
                    <textarea
                        value={formData.response}
                        onChange={e => setFormData({ ...formData, response: e.target.value })}
                        required
                    />
                </div>
                <div className="form-actions">
                    <button type="submit" className="save-btn">{editingEntry ? 'Update' : 'Add Entry'}</button>
                    {editingEntry && <button type="button" onClick={() => { setEditingEntry(null); setFormData({ intent: '', keywords: '', response: '', category: 'General' }) }}>Cancel</button>}
                </div>
            </form>

            <div className="kb-list">
                <h3>Current Knowledge Base</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Intent</th>
                            <th>Keywords</th>
                            <th>Response Snippet</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {kb.map(entry => (
                            <tr key={entry.id}>
                                <td>{entry.intent}</td>
                                <td><div className="keyword-tags">{entry.keywords.map(k => <span key={k} className="tag">{k}</span>)}</div></td>
                                <td className="response-cell">{entry.response.substring(0, 50)}...</td>
                                <td>
                                    <button onClick={() => handleEdit(entry)}>Edit</button>
                                    <button onClick={() => handleDelete(entry.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const FeedbackReview = () => {
    const [feedback, setFeedback] = useState([]);

    useEffect(() => {
        fetchFeedback();
    }, []);

    const fetchFeedback = async () => {
        const data = await apiService.getUnresolvedFeedback();
        setFeedback(data);
    };

    const handleResolve = async (id) => {
        await apiService.resolveFeedback(id);
        fetchFeedback();
    };

    return (
        <div className="feedback-review">
            <h3>Unresolved User Queries</h3>
            <p className="subtitle">These are queries where the AI wasn't sure. Review them to improve the Knowledge Base.</p>
            <div className="feedback-list">
                {feedback.length === 0 ? <p>Nicely done! No unresolved queries.</p> : feedback.map(item => (
                    <div key={item.id} className="feedback-card">
                        <div className="feedback-meta">
                            <span className="user-id">User ID: {item.userId}</span>
                            <span className="timestamp">{new Date(item.timestamp).toLocaleString()}</span>
                        </div>
                        <div className="feedback-text">
                            <strong>User said:</strong> "{item.userMessage}"
                        </div>
                        <button className="resolve-btn" onClick={() => handleResolve(item.id)}>Mark as Resolved</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
