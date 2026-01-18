import React, { useState, useEffect } from 'react';
import './Settings.css';

const Settings = ({ onBack }) => {
    // Load initial settings from localStorage or defaults
    const [preferences, setPreferences] = useState(() => {
        const saved = localStorage.getItem('user_settings');
        return saved ? JSON.parse(saved) : {
            darkMode: false,
            emailNotifications: true,
            pushNotifications: false,
            language: 'English',
            privacyProfile: 'Public'
        };
    });

    const [saveMessage, setSaveMessage] = useState('');

    // Apply Dark Mode effect whenever it changes
    useEffect(() => {
        if (preferences.darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [preferences.darkMode]);

    const handleToggle = (key) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSelectChange = (key, value) => {
        setPreferences(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        localStorage.setItem('user_settings', JSON.stringify(preferences));
        setSaveMessage('Settings saved successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
    };

    return (
        <div className="settings-container">
            <div className="settings-header">
                <button onClick={onBack} className="back-button">← Back to Chat</button>
                <h2>Preferences & Settings</h2>
            </div>

            <div className="settings-grid">
                {saveMessage && <div className="save-toast">{saveMessage}</div>}

                <section className="settings-section">
                    <h3>Appearance</h3>
                    <div className="setting-item">
                        <div className="setting-info">
                            <label>Dark Mode</label>
                            <p>Switch between light and dark themes.</p>
                        </div>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={preferences.darkMode}
                                onChange={() => handleToggle('darkMode')}
                            />
                            <span className="slider round"></span>
                        </label>
                    </div>
                </section>

                <section className="settings-section">
                    <h3>Notifications</h3>
                    <div className="setting-item">
                        <div className="setting-info">
                            <label>Email Notifications</label>
                            <p>Receive weekly updates and recommendations.</p>
                        </div>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={preferences.emailNotifications}
                                onChange={() => handleToggle('emailNotifications')}
                            />
                            <span className="slider round"></span>
                        </label>
                    </div>
                    <div className="setting-item">
                        <div className="setting-info">
                            <label>Push Notifications</label>
                            <p>Get instant alerts on your mobile device.</p>
                        </div>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={preferences.pushNotifications}
                                onChange={() => handleToggle('pushNotifications')}
                            />
                            <span className="slider round"></span>
                        </label>
                    </div>
                </section>

                <section className="settings-section">
                    <h3>Language & Region</h3>
                    <div className="setting-item">
                        <div className="setting-info">
                            <label>System Language</label>
                            <p>Choose your preferred language.</p>
                        </div>
                        <select
                            value={preferences.language}
                            onChange={(e) => handleSelectChange('language', e.target.value)}
                            className="settings-select"
                        >
                            <option value="English">English</option>
                            <option value="French">French</option>
                            <option value="Spanish">Spanish</option>
                            <option value="German">German</option>
                        </select>
                    </div>
                </section>

                <section className="settings-section">
                    <h3>Privacy</h3>
                    <div className="setting-item">
                        <div className="setting-info">
                            <label>Profile Visibility</label>
                            <p>Control who can see your progress and achievements.</p>
                        </div>
                        <select
                            value={preferences.privacyProfile}
                            onChange={(e) => handleSelectChange('privacyProfile', e.target.value)}
                            className="settings-select"
                        >
                            <option value="Public">Public</option>
                            <option value="Private">Private</option>
                            <option value="University Only">University Only</option>
                        </select>
                    </div>
                </section>

                <div className="settings-actions">
                    <button className="save-settings-btn" onClick={handleSave}>Save Changes</button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
