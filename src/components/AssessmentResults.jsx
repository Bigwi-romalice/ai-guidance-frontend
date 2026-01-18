import React from 'react';
import './AssessmentResults.css';

const AssessmentResults = ({ result, onBack }) => {
    return (
        <div className="assessment-results">
            <div className="results-header">
                <h2>Your Assessment Results</h2>
                <button className="done-btn" onClick={onBack}>Done</button>
            </div>

            <div className="primary-result">
                <h3>Your Dominant Type</h3>
                <div className="type-badge">{result.topCategory}</div>
                <p>Based on your answers, you have a strong affinity for <strong>{result.topCategory}</strong> related activities.</p>
            </div>

            <div className="scores-breakdown">
                <h3>Personality Breakdown</h3>
                <div className="bars-container">
                    {Object.entries(result.scores).map(([category, score]) => (
                        <div key={category} className="score-row">
                            <span className="cat-name">{category}</span>
                            <div className="cat-bar-track">
                                <div className="cat-bar-fill" style={{ width: `${(score / 10) * 100}%` }}></div> {/* Assuming max is small */}
                            </div>
                            <span className="cat-val">{score}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="recommendations-section">
                <h3>Recommended Careers</h3>
                <div className="recs-grid">
                    {result.recommendations.map(career => (
                        <div key={career.id || Math.random()} className="rec-card">
                            <h4>{career.title}</h4>
                            <p>{career.description}</p>
                        </div>
                    ))}
                    {result.recommendations.length === 0 && <p>No specific matches found based on this profile yet.</p>}
                </div>
            </div>
        </div>
    );
};

export default AssessmentResults;
