import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './UserProfile.css';

const UserProfile = ({ onBack }) => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        studentId: '',
        email: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                studentId: user.studentId || '',
                email: user.email || ''
            });
        }
    }, [user]);

    const handleSave = () => {
        // Here we would typically call an API to update the user
        // For now, we'll just toggle edit mode off
        setIsEditing(false);
        // show success message logic could go here
    };

    return (
        <div className="user-profile">
            <div className="profile-header">
                <button onClick={onBack} className="back-button">← Back to Chat</button>
                <h2>My Profile</h2>
            </div>

            <div className="profile-content">
                <div className="profile-card">
                    <div className="avatar-large">
                        {formData.firstName ? formData.firstName[0].toUpperCase() : 'U'}
                    </div>

                    {!isEditing ? (
                        <div className="profile-details">
                            <h3>{formData.firstName} {formData.lastName}</h3>
                            <p className="profile-program">Student ID: {formData.studentId}</p>
                            <p className="profile-email">{formData.email}</p>
                            <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
                        </div>
                    ) : (
                        <div className="edit-form">
                            <div className="form-group">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                />
                            </div>
                            <div className="user-actions">
                                <button className="save-btn" onClick={handleSave}>Save Changes</button>
                                <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="info-section">
                    <h3>Account Info</h3>
                    <div className="info-block">
                        <label>Email Address</label>
                        <p>{formData.email}</p>
                    </div>
                    <div className="info-block">
                        <label>Student ID</label>
                        <p>{formData.studentId}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
