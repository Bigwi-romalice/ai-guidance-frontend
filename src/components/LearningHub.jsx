import React, { useState } from 'react';
import './LearningHub.css';

const recommendations = [
    {
        id: 1,
        title: 'Python for Data Science',
        type: 'Course',
        provider: 'Coursera',
        level: 'Beginner',
        duration: '4 weeks',
        progress: 0,
        url: 'https://www.coursera.org/learn/python-for-applied-data-science-ai'
    },
    {
        id: 2,
        title: 'Machine Learning Basics',
        type: 'Video Series',
        provider: 'YouTube',
        level: 'Intermediate',
        duration: '2 hours',
        progress: 45,
        url: 'https://www.youtube.com/watch?v=GwIo3gDZCVQ'
    },
    {
        id: 3,
        title: 'Effective Communication',
        type: 'Article',
        provider: 'HBR',
        level: 'All Levels',
        duration: '10 min',
        progress: 100,
        url: 'https://hbr.org/topic/subject/communication'
    }
];



const LearningHub = ({ onBack }) => {
    const [activeFilter, setActiveFilter] = useState('All');

    const filteredRecommendations = activeFilter === 'All'
        ? recommendations
        : recommendations.filter(rec => {
            if (activeFilter === 'Videos') return rec.type === 'Video Series';
            if (activeFilter === 'Courses') return rec.type === 'Course';
            if (activeFilter === 'Articles') return rec.type === 'Article';
            if (activeFilter === 'Books') return rec.type === 'Book';
            return true;
        });

    return (
        <div className="learning-hub">
            <div className="hub-header">
                <button onClick={onBack} className="back-button">← Back to Chat</button>
                <h2>Learning Recommendations</h2>
            </div>

            <div className="hub-content">
                <section className="learning-section">
                    <h3>Your Progress</h3>
                    <div className="progress-overview">
                        <div className="progress-card">
                            <span className="p-label">Courses in Progress</span>
                            <span className="p-value">2</span>
                        </div>
                        <div className="progress-card">
                            <span className="p-label">Completed</span>
                            <span className="p-value">12</span>
                        </div>
                        <div className="progress-card">
                            <span className="p-label">Skills Gained</span>
                            <span className="p-value">5</span>
                        </div>
                    </div>
                </section>

                <section className="learning-section">
                    <h3>Browse Library</h3>
                    <div className="library-filters">
                        {['All', 'Videos', 'Courses', 'Articles', 'Books'].map(filter => (
                            <button
                                key={filter}
                                className={`filter-chip ${activeFilter === filter ? 'active' : ''}`}
                                onClick={() => setActiveFilter(filter)}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </section>

                <section className="learning-section">
                    <h3>{activeFilter === 'All' ? 'Recommended for You' : `${activeFilter} Library`}</h3>
                    <div className="recommendations-list">
                        {filteredRecommendations.map(rec => (
                            <div key={rec.id} className="rec-card">
                                <button className="start-btn" style={{ marginRight: '10px', backgroundColor: '#ef4444', color: 'white', minWidth: '80px' }} onClick={() => window.open(rec.url, '_blank')}>
                                    {rec.progress > 0 ? 'Continue' : 'Start'}
                                </button>
                                <div className="rec-icon">
                                    {rec.type === 'Course' ? '🎓' : rec.type === 'Video Series' ? '📺' : '📄'}
                                </div>
                                <div className="rec-info">
                                    <h4>{rec.title}</h4>
                                    <p className="rec-meta">{rec.type} • {rec.provider} • {rec.duration}</p>
                                    {rec.progress > 0 && (
                                        <div className="progress-bar-container">
                                            <div className="progress-bar" style={{ width: `${rec.progress}%` }}></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {filteredRecommendations.length === 0 && <p>No resources found for this category.</p>}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default LearningHub;
