import React, { useState } from 'react';
import './CareerExplorer.css';

const careersData = [
    {
        id: 1,
        title: 'Software Developer',
        description: 'Design, build, and maintain software applications.',
        salary: '$80,000 - $150,000',
        growth: '22% (Much faster than average)',
        skills: ['JavaScript', 'React', 'Python', 'Problem Solving'],
        match: 95
    },
    {
        id: 2,
        title: 'Data Scientist',
        description: 'Analyze complex data to help organizations make better decisions.',
        salary: '$100,000 - $180,000',
        growth: '35% (Much faster than average)',
        skills: ['Python', 'SQL', 'Machine Learning', 'Statistics'],
        match: 88
    },
    {
        id: 3,
        title: 'UX/UI Designer',
        description: 'Design user-friendly interfaces and experiences for digital products.',
        salary: '$70,000 - $130,000',
        growth: '13% (Faster than average)',
        skills: ['Figma', 'Prototyping', 'User Research', 'Visual Design'],
        match: 82
    },
    {
        id: 4,
        title: 'Cybersecurity Analyst',
        description: 'Protect computer networks and systems from cyber threats.',
        salary: '$90,000 - $160,000',
        growth: '32% (Much faster than average)',
        skills: ['Network Security', 'Ethical Hacking', 'Risk Analysis', 'Python'],
        match: 75
    }
];

const CareerExplorer = ({ onBack }) => {
    const [selectedCareer, setSelectedCareer] = useState(null);
    const [filter, setFilter] = useState('All');

    const filteredCareers = careersData.filter(career =>
        filter === 'All' || career.title.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="career-explorer">
            <div className="explorer-header">
                <button onClick={onBack} className="back-button">← Back to Chat</button>
                <h2>Career Explorer</h2>
                <div className="filter-controls">
                    <select value={filter} onChange={(e) => setFilter(e.target.value)} className="category-select">
                        <option value="All">All Categories</option>
                        <option value="Developer">Development</option>
                        <option value="Data">Data Science</option>
                        <option value="Design">Design</option>
                        <option value="Security">Security</option>
                    </select>
                </div>
            </div>

            <div className="careers-grid">
                {filteredCareers.map(career => (
                    <div key={career.id} className="career-card" onClick={() => setSelectedCareer(career)}>
                        <div className="match-badge">{career.match}% Match</div>
                        <h3>{career.title}</h3>
                        <p className="salary-range">{career.salary}</p>
                        <p className="growth-outlook">📈 {career.growth}</p>
                        <div className="skills-tags">
                            {career.skills.slice(0, 3).map((skill, idx) => (
                                <span key={idx} className="skill-tag">{skill}</span>
                            ))}
                        </div>
                        <button className="view-details-btn">View Details</button>
                    </div>
                ))}
            </div>

            {selectedCareer && (
                <div className="modal-overlay" onClick={() => setSelectedCareer(null)}>
                    <div className="career-modal" onClick={e => e.stopPropagation()}>
                        <button className="close-modal" onClick={() => setSelectedCareer(null)}>×</button>
                        <h2>{selectedCareer.title}</h2>
                        <p className="modal-description">{selectedCareer.description}</p>

                        <div className="modal-section">
                            <h4>Required Skills</h4>
                            <div className="skills-tags large">
                                {selectedCareer.skills.map((skill, idx) => (
                                    <span key={idx} className="skill-tag">{skill}</span>
                                ))}
                            </div>
                        </div>

                        <div className="modal-stats">
                            <div className="stat-box">
                                <span className="stat-label">Salary Range</span>
                                <span className="stat-value">{selectedCareer.salary}</span>
                            </div>
                            <div className="stat-box">
                                <span className="stat-label">Growth</span>
                                <span className="stat-value">{selectedCareer.growth}</span>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button
                                className="action-btn primary"
                                onClick={() => window.open(`https://www.coursera.org/search?query=${encodeURIComponent(selectedCareer.title)}`, '_blank')}
                            >
                                View Pathways
                            </button>
                            <button
                                className="action-btn secondary"
                                onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(selectedCareer.title + ' jobs')}&ibp=htl;jobs`, '_blank')}
                            >
                                Find Jobs
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CareerExplorer;
