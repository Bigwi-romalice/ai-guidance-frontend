import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import './AnalyticsDashboard.css';

const AnalyticsDashboard = ({ onBack }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        apiService.getAnalyticsData()
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch analytics:", err);
                setError("Could not load analytics data.");
                setLoading(false);
            });
    }, []);

    const handleExport = () => {
        window.location.href = 'http://localhost:5000/api/analytics/export';
    };

    if (loading) return <div className="analytics-loading">Loading Analytics...</div>;
    if (error) return <div className="analytics-error">{error}</div>;

    return (
        <div className="analytics-dashboard">
            <div className="analytics-header">
                <div className="header-left">
                    <button className="back-button" onClick={onBack}>← Back</button>
                    <h2>Admin & Reporting Dashboard</h2>
                </div>
                <div className="export-options">
                    <button className="export-button csv" onClick={() => window.location.href = 'http://localhost:5000/api/analytics/export'}>
                        📊 Export CSV
                    </button>
                    <button className="export-button pdf" onClick={() => window.location.href = 'http://localhost:5000/api/analytics/export-pdf'}>
                        📄 Export PDF
                    </button>
                </div>
            </div>

            {/* Top Metrics Row */}
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Interactions</h3>
                    <div className="stat-value">{data.totalInteractions}</div>
                </div>
                <div className="stat-card">
                    <h3>Active Users (24h)</h3>
                    <div className="stat-value">{data.activeUsers}</div>
                </div>
                <div className="stat-card">
                    <h3>Peak Usage Time</h3>
                    <div className="stat-value text-sm">{data.peakTime}</div>
                </div>
                <div className="stat-card">
                    <h3>Unresolved Queries</h3>
                    <div className="stat-value negative">{data.unresolvedIntents}</div>
                </div>
            </div>

            <div className="charts-grid-2x2">
                {/* Topic Breakdown */}
                <div className="chart-card">
                    <h3>Common Topics</h3>
                    <div className="bar-chart">
                        {Object.entries(data.topicBreakdown).map(([topic, count]) => (
                            <div key={topic} className="bar-row">
                                <span className="bar-label">{topic}</span>
                                <div className="bar-track">
                                    <div className="bar-fill" style={{ width: `${(count / data.totalInteractions) * 100}%` }}></div>
                                </div>
                                <span className="bar-value">{count}</span>
                            </div>
                        ))}
                        {Object.keys(data.topicBreakdown).length === 0 && <p className="no-data">No data</p>}
                    </div>
                </div>

                {/* Sentiment Analysis */}
                <div className="chart-card">
                    <h3>Student Sentiment</h3>
                    <div className="pie-legend">
                        {Object.entries(data.sentimentAnalysis).map(([sentiment, count]) => (
                            <div key={sentiment} className={`legend-item ${sentiment.toLowerCase()}`}>
                                <span className="dot"></span>
                                <span className="label">{sentiment}</span>
                                <span className="value">{count}</span>
                            </div>
                        ))}
                        {Object.keys(data.sentimentAnalysis).length === 0 && <p className="no-data">No data</p>}
                    </div>
                </div>

                {/* Demographics */}
                <div className="chart-card">
                    <h3>Demographics (By Program)</h3>
                    <ul className="simple-list">
                        {Object.entries(data.demographics).map(([program, count]) => (
                            <li key={program}>
                                <span>{program}</span>
                                <strong>{count} users</strong>
                            </li>
                        ))}
                        {Object.keys(data.demographics).length === 0 && <p className="no-data">No data</p>}
                    </ul>
                </div>

                {/* Recent Activity */}
                <div className="chart-card">
                    <h3>Recent Activity</h3>
                    <ul className="activity-list">
                        {data.recentActivity.map((activity, index) => (
                            <li key={index} className="activity-item">
                                <div className="activity-meta">
                                    <span className="activity-time">{new Date(activity.timestamp).toLocaleTimeString()}</span>
                                    <span className={`activity-sentiment ${activity.sentiment?.toLowerCase()}`}>{activity.sentiment}</span>
                                </div>
                                <div className="activity-msg-wrap">
                                    <span className="activity-user">Student: {activity.userMessage}</span>
                                </div>
                            </li>
                        ))}
                        {data.recentActivity.length === 0 && <p className="no-data">No recent activity</p>}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
