import React from 'react';
import './About.css';

const About = ({ onBack }) => {
    return (
        <div className="about-container">
            <div className="about-header">
                <button onClick={onBack} className="back-button">← Back to Chat</button>
                <h2>About Us</h2>
            </div>

            <div className="about-content">
                <section className="about-section primary">
                    <h3>KECS AI</h3>
                    <p>KECS AI is an advanced Academic & Career Guidance platform powered by artificial intelligence. We help students make informed decisions about their educational journey and career paths.</p>
                    <p className="mission">Our mission is to democratize access to quality academic counseling and career guidance, making it available 24/7 to students worldwide.</p>
                </section>

                <div className="features-grid">
                    <section className="feature-card">
                        <div className="feature-icon">🎓</div>
                        <h4>Academic Guidance</h4>
                        <p>Personalized course and program recommendations based on your interests and goals</p>
                    </section>
                    <section className="feature-card">
                        <div className="feature-icon">💼</div>
                        <h4>Career Advisory</h4>
                        <p>Expert career path suggestions and industry insights to help you succeed</p>
                    </section>
                    <section className="feature-card">
                        <div className="feature-icon">📚</div>
                        <h4>Learning Recommendations</h4>
                        <p>Curated learning resources tailored to your academic journey</p>
                    </section>
                    <section className="feature-card">
                        <div className="feature-icon">💬</div>
                        <h4>24/7 AI Support</h4>
                        <p>Get instant answers to your questions anytime, anywhere</p>
                    </section>
                </div>

                <section className="technology-section">
                    <h3>Technology</h3>
                    <p>Built with cutting-edge AI technology, KECS AI uses natural language processing and machine learning to understand your needs and provide personalized recommendations.</p>
                </section>

                <footer className="about-footer">
                    <div className="legal-links">
                        <h4>Legal</h4>
                        <a href="#tos">Terms of Service</a>
                        <a href="#privacy">Privacy Policy</a>
                        <a href="#license">License Agreement</a>
                    </div>
                    <div className="developer-info">
                        <p>Developed by <strong>BIGWI Romalice</strong></p>
                        <p>© 2025 KECS. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default About;
