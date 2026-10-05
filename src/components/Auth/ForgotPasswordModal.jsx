import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, X, ShieldCheck } from 'lucide-react';

export default function ForgotPasswordModal({ isOpen, onClose, defaultEmail = '' }) {
  const { resetPassword, authError, setAuthError } = useAuth();
  const [email, setEmail] = useState(defaultEmail);
  const [step, setStep] = useState(1); // 1: Email entry, 2: New Password entry, 3: Success
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localMsg, setLocalMsg] = useState('');

  if (!isOpen) return null;

  const handleSendReset = (e) => {
    e.preventDefault();
    setAuthError('');
    setLocalMsg('');

    if (!email || !email.includes('@')) {
      setLocalMsg('Please enter a valid email address.');
      return;
    }

    // Move to step 2 to set new password
    setStep(2);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setLocalMsg('');

    if (newPassword.length < 6) {
      setLocalMsg('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setLocalMsg('Passwords do not match.');
      return;
    }

    const success = resetPassword(email, newPassword);
    if (success) {
      setStep(3);
    }
  };

  const handleClose = () => {
    setStep(1);
    setEmail('');
    setNewPassword('');
    setConfirmPassword('');
    setLocalMsg('');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(99, 102, 241, 0.15)',
                color: '#8b5cf6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ShieldCheck size={20} />
            </div>
            <h2 className="modal-title">Reset Password</h2>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={handleClose}>
            <X size={18} />
          </button>
        </div>

        {localMsg && (
          <div className="auth-alert auth-alert-error" style={{ marginBottom: '16px' }}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{localMsg}</span>
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleSendReset}>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Enter the email address registered with your Finora account to proceed with resetting your password.
            </p>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-icon-group">
                <input
                  type="email"
                  required
                  className="form-input input-with-left-icon"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail size={18} className="input-left-icon" />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
              <span>Continue to New Password</span>
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword}>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Creating new password for <strong>{email}</strong>
            </p>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <div className="input-icon-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="form-input input-with-left-icon input-with-right-icon"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Lock size={18} className="input-left-icon" />
                <button
                  type="button"
                  className="input-right-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <div className="input-icon-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="form-input input-with-left-icon"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Lock size={18} className="input-left-icon" />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>
              <span>Save New Password</span>
            </button>
          </form>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}
            >
              <CheckCircle2 size={32} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>Password Updated!</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Your password has been successfully updated. You can now log into your Finora account.
            </p>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleClose}>
              <span>Back to Login</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
