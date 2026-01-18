import React, { useState, useEffect } from 'react';
import './AssessmentQuiz.css';
import apiService from '../services/api';

const AssessmentQuiz = ({ assessmentId, onComplete, onCancel }) => {
    const [assessment, setAssessment] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // { questionId: true/false }
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiService.getAssessment(assessmentId)
            .then(data => {
                setAssessment(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [assessmentId]);

    const handleAnswer = (value) => {
        const question = assessment.questions[currentQuestionIndex];
        setAnswers(prev => ({
            ...prev,
            [question.id]: value
        }));

        // Move to next
        if (currentQuestionIndex < assessment.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            // Complete
            handleSubmit({ ...answers, [question.id]: value });
        }
    };

    const handleSubmit = async (finalAnswers) => {
        setLoading(true);
        try {
            // api endpoint
            const result = await apiService.submitAssessment(assessmentId, finalAnswers);
            onComplete(result);
        } catch (error) {
            console.error("Submission failed", error);
            alert("Failed to submit assessment. Please try again.");
            setLoading(false);
        }
    };

    if (loading || !assessment) return <div className="quiz-loading">Loading Question...</div>;

    const currentQuestion = assessment.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex) / assessment.questions.length) * 100;

    return (
        <div className="assessment-quiz">
            <div className="quiz-header">
                <button className="cancel-btn" onClick={onCancel}>✕ Exit</button>
                <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="progress-text">{currentQuestionIndex + 1} / {assessment.questions.length}</div>
            </div>

            <div className="question-card">
                <h2>{currentQuestion.text}</h2>

                <div className="options-container">
                    <button className="option-btn yes" onClick={() => handleAnswer(true)}>
                        👍 Yes, that's me
                    </button>
                    <button className="option-btn no" onClick={() => handleAnswer(false)}>
                        👎 No, not really
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssessmentQuiz;
