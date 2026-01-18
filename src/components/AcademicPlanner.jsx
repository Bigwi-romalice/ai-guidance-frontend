import React, { useState } from 'react';
import './AcademicPlanner.css';

const programs = [
    {
        id: 'cs',
        name: 'Computer Science',
        degree: 'B.Sc.',
        duration: '4 Years',
        credits: 120,
        description: 'Focuses on software theory, design, and development.'
    },
    {
        id: 'it',
        name: 'Information Technology',
        degree: 'B.Sc.',
        duration: '4 Years',
        credits: 120,
        description: 'Focuses on the application of technology in business environments.'
    },
    {
        id: 'swe',
        name: 'Software Engineering',
        degree: 'B.Sc.',
        duration: '4 Years',
        credits: 124,
        description: 'Applies engineering principles to software development.'
    }
];

const roadmap = [
    { semester: 1, year: 1, courses: ['Intro to Programming', 'Calculus I', 'English Comp', 'Physics I'] },
    { semester: 2, year: 1, courses: ['OOP (Java)', 'Calculus II', 'Linear Algebra', 'Physics II'] },
    { semester: 3, year: 2, courses: ['Data Structures', 'Discrete Math', 'Web Development', 'Database I'] },
    { semester: 4, year: 2, courses: ['Algorithms', 'Computer Arch', 'OS', 'Statistics'] },
];

const AcademicPlanner = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState('catalog'); // catalog, roadmap, gpa

    return (
        <div className="academic-planner">
            <div className="planner-header">
                <button onClick={onBack} className="back-button">← Back to Chat</button>
                <h2>Academic Guidance</h2>
                <div className="planner-tabs">
                    <button className={`tab-btn ${activeTab === 'catalog' ? 'active' : ''}`} onClick={() => setActiveTab('catalog')}>Catalog</button>
                    <button className={`tab-btn ${activeTab === 'roadmap' ? 'active' : ''}`} onClick={() => setActiveTab('roadmap')}>Roadmap</button>
                    <button className={`tab-btn ${activeTab === 'gpa' ? 'active' : ''}`} onClick={() => setActiveTab('gpa')}>GPA</button>
                    <button className={`tab-btn ${activeTab === 'prereq' ? 'active' : ''}`} onClick={() => setActiveTab('prereq')}>Prerequisites</button>
                    <button className={`tab-btn ${activeTab === 'policies' ? 'active' : ''}`} onClick={() => setActiveTab('policies')}>Policies</button>
                    <button className={`tab-btn ${activeTab === 'advisor' ? 'active' : ''}`} onClick={() => setActiveTab('advisor')}>Advisor</button>
                </div>
            </div>

            <div className="planner-content">
                {activeTab === 'catalog' && (
                    <div className="catalog-view">
                        <h3>Available Programs</h3>
                        <div className="programs-grid">
                            {programs.map(prog => (
                                <div key={prog.id} className="program-card">
                                    <div className="program-icon">🎓</div>
                                    <h4>{prog.name}</h4>
                                    <p className="program-degree">{prog.degree} • {prog.duration}</p>
                                    <p className="program-desc">{prog.description}</p>
                                    <div className="program-credits">{prog.credits} Credits</div>
                                    <button
                                        className="view-program-btn"
                                        onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(prog.name + ' degree requirements')}`, '_blank')}
                                    >
                                        View Requirements
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'roadmap' && (
                    <div className="roadmap-view">
                        <h3>Computer Science Roadmap</h3>
                        <div className="timeline-container">
                            {roadmap.map((sem, idx) => (
                                <div key={idx} className="semester-block">
                                    <div className="semester-header">
                                        <span>Year {sem.year}</span>
                                        <span className="semester-title">Semester {sem.semester}</span>
                                    </div>
                                    <div className="courses-list">
                                        {sem.courses.map((course, cIdx) => (
                                            <div key={cIdx} className="course-item">
                                                {course}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'gpa' && (
                    <div className="gpa-view">
                        <div className="gpa-calculator-card">
                            <h3>GPA Calculator</h3>
                            <p>Estimate your semester GPA.</p>
                            <div className="gpa-inputs-container">
                                <div className="gpa-row-header">
                                    <span>Course</span>
                                    <span>Credits</span>
                                    <span>Grade</span>
                                </div>
                                {[
                                    { name: 'Data Structures', credits: 4 },
                                    { name: 'Discrete Math', credits: 3 },
                                    { name: 'Web Development', credits: 3 },
                                    { name: 'Database I', credits: 3 }
                                ].map((course, idx) => (
                                    <div key={idx} className="gpa-input-row">
                                        <span className="course-name">{course.name}</span>
                                        <span className="course-credits">{course.credits}</span>
                                        <select className="grade-select" id={`grade-${idx}`}>
                                            <option value="4.0">A (4.0)</option>
                                            <option value="3.7">A- (3.7)</option>
                                            <option value="3.3">B+ (3.3)</option>
                                            <option value="3.0">B (3.0)</option>
                                            <option value="2.7">B- (2.7)</option>
                                            <option value="2.3">C+ (2.3)</option>
                                            <option value="2.0">C (2.0)</option>
                                        </select>
                                    </div>
                                ))}
                            </div>
                            <button className="calculate-btn" onClick={() => {
                                const rows = document.querySelectorAll('.gpa-input-row');
                                let totalPoints = 0;
                                let totalCredits = 0;
                                rows.forEach((row, idx) => {
                                    const credits = [4, 3, 3, 3][idx];
                                    const grade = parseFloat(row.querySelector('select').value);
                                    totalPoints += credits * grade;
                                    totalCredits += credits;
                                });
                                const gpa = (totalPoints / totalCredits).toFixed(2);
                                document.getElementById('final-gpa').innerText = gpa;
                            }}>
                                Calculate GPA
                            </button>
                            <div className="gpa-result">
                                <span>Estimated GPA:</span>
                                <span className="gpa-score" id="final-gpa">--</span>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'prereq' && (
                    <div className="prereq-view">
                        <h3>Prerequisite & Conflict Checker</h3>
                        <p className="section-desc">Check if you are eligible for specific advanced courses.</p>
                        <div className="prereq-container">
                            <div className="course-check-card">
                                <h4>Advanced Machine Learning (CS402)</h4>
                                <div className="check-status error">
                                    <span className="status-icon">⚠️</span>
                                    <div className="status-text">
                                        <h5>Prerequisite Missing</h5>
                                        <p>You must complete <strong>Linear Algebra (MATH201)</strong> before taking this course.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="course-check-card">
                                <h4>Cloud Computing (CS450)</h4>
                                <div className="check-status success">
                                    <span className="status-icon">✅</span>
                                    <div className="status-text">
                                        <h5>Eligible</h5>
                                        <p>You meet all prerequisites for this course.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'policies' && (
                    <div className="policies-view">
                        <h3>University Policies & F.A.Q</h3>
                        <div className="policy-list">
                            <div className="policy-item">
                                <h4>Drop / Add Deadline</h4>
                                <p>The last day to add or drop a course without penalty is **September 15th**.</p>
                            </div>
                            <div className="policy-item">
                                <h4>Academic Probation</h4>
                                <p>Students must maintain a GPA of 2.0 or higher. Falling below this for two consecutive semesters results in probation.</p>
                            </div>
                            <div className="policy-item">
                                <h4>Graduation Requirements</h4>
                                <p>A total of 120 credits is required, with at least 45 credits in upper-level (300+) courses.</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'advisor' && (
                    <div className="advisor-view">
                        <h3>Your Academic Advisor</h3>
                        <div className="advisor-card">
                            <div className="advisor-avatar">👩‍🏫</div>
                            <div className="advisor-info">
                                <h4>Dr. Sarah Jenkins</h4>
                                <p className="advisor-role">Senior Academic Advisor</p>
                                <p className="advisor-email">s.jenkins@university.edu</p>
                                <div className="advisor-actions">
                                    <button className="contact-btn primary">Schedule Appointment</button>
                                    <button className="contact-btn secondary">Send Email</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AcademicPlanner;
