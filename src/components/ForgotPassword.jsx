import React, { useState } from 'react';
import apiService from '../services/api';
import './Login.css'; // Reusing auth styles

const ForgotPassword = ({ onBack }) => {
    const [step, setStep] = useState(1); // 1: Email, 2: Code, 3: New Password
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [previewUrl, setPreviewUrl] = useState('');

    const handleRequestCode = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const response = await apiService.requestPasswordReset(email);
            setMessage(response.message || 'A reset code has been sent to your email.');
            if (response.previewUrl) {
                setPreviewUrl(response.previewUrl);
            }
            setStep(2);
        } catch (err) {
            setError(err.message || 'Failed to send reset code.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await apiService.verifyResetCode(email, code);
            setStep(3);
            setMessage('');
        } catch (err) {
            setError(err.message || 'Invalid or expired code.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setIsLoading(true);
        try {
            await apiService.resetPassword(email, code, newPassword);
            setStep(4); // Success step
        } catch (err) {
            setError(err.message || 'Failed to reset password.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        </svg>
                    </div>
                    <h2>Reset Password</h2>
                    <p>Follow the steps to recover your access</p>
                </div>

                {error && <div className="error-message">{error}</div>}
                {message && (
                    <div className="success-message" style={{ color: '#10b981', background: '#ecfdf5', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                        {message}
                        {previewUrl && (
                            <div style={{ marginTop: '0.5rem' }}>
                                <a href={previewUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#059669', fontWeight: 'bold' }}>
                                    View Test Email ↗
                                </a>
                            </div>
                        )}
                    </div>
                )}

                {step === 1 && (
                    <form onSubmit={handleRequestCode} className="auth-form">
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <button type="submit" className="auth-button" disabled={isLoading}>
                            {isLoading ? 'Sending...' : 'Send Reset Code'}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyCode} className="auth-form">
                        <div className="form-group">
                            <label>Verification Code</label>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="6-digit code"
                                required
                            />
                        </div>
                        <button type="submit" className="auth-button" disabled={isLoading}>
                            {isLoading ? 'Verifying...' : 'Verify Code'}
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleResetPassword} className="auth-form">
                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="At least 6 characters"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Repeat new password"
                                required
                            />
                        </div>
                        <button type="submit" className="auth-button" disabled={isLoading}>
                            {isLoading ? 'Resetting...' : 'Change Password'}
                        </button>
                    </form>
                )}

                {step === 4 && (
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>🎉 Your password has been reset successfully!</p>
                        <button onClick={onBack} className="auth-button">Back to Login</button>
                    </div>
                )}

                {step !== 4 && (
                    <div className="auth-footer">
                        <button onClick={onBack} className="link-button">Back to Login</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
