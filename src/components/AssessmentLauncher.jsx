import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import './AssessmentLauncher.css';

const AssessmentLauncher = ({ onStart, onBack }) => {
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiService.getAssessments()
            .then(data => {
                setAssessments(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="assessment-loading">Loading Assessments...</div>;

    return (
        <div className="assessment-launcher">
            <div className="launcher-header">
                <button onClick={onBack} className="back-button">← Back to Chat</button>
            </div>
            <h2>Self-Discovery & Assessments</h2>
            <p>Take these quizzes to understand your strengths and find your perfect career match.</p>

            <div className="assessment-grid">
                {assessments.map(assessment => (
                    <div key={assessment.id} className="assessment-card">
                        <div className="card-icon">🧠</div>
                        <h3>{assessment.title}</h3>
                        <p>{assessment.description}</p>
                        <button className="start-btn" onClick={() => onStart(assessment.id)}>
                            Start Assessment
                        </button>
                    </div>
                ))}

                {assessments.length === 0 && <p>No assessments available at the moment.</p>}
            </div>
        </div>
    );
};

export default AssessmentLauncher;
