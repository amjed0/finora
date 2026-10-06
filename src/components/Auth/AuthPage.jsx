import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CURRENCIES } from '../../constants/initialData';
import ForgotPasswordModal from './ForgotPasswordModal';
import './Auth.css';
import {
  Wallet,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Zap,
  Globe,
  PieChart,
  CreditCard,
  TrendingUp,
  Star
} from 'lucide-react';

export default function AuthPage() {
  const {
    login,
    signup,
    demoLogin,
    authError,
    authSuccess,
    setAuthError,
    setAuthSuccess
  } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Signup State
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // UI Toggles
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate Password Strength for Signup
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: 'None', colorClass: '' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9!@#$%^&*]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', colorClass: 'weak' };
    if (score === 2) return { score: 2, label: 'Fair', colorClass: 'medium' };
    if (score === 3) return { score: 3, label: 'Good', colorClass: 'good' };
    return { score: 4, label: 'Strong', colorClass: 'strong' };
  };

  const pwdStrength = getPasswordStrength(signupPassword);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await login(loginEmail, loginPassword, rememberMe);
    setIsSubmitting(false);
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (signupPassword !== confirmPassword) {
      setAuthError('Passwords do not match. Please verify your password entry.');
      return;
    }

    if (signupPassword.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      return;
    }

    if (!agreeTerms) {
      setAuthError('Please agree to the Terms of Service to create your account.');
      return;
    }

    setIsSubmitting(true);
    const success = await signup({
      name: signupName,
      email: signupEmail,
      password: signupPassword,
      currency: currency
    });
    setIsSubmitting(false);

    if (success) {
      setLoginEmail(signupEmail);
      setLoginPassword('');
      setSignupName('');
      setSignupPassword('');
      setConfirmPassword('');
      setMode('login');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card-wrapper">
        {/* Left Hero Panel */}
        <div className="auth-hero-panel">
          <div>
            <div className="auth-hero-badge">
              <Sparkles size={15} color="#8b5cf6" />
              <span>THE ULTIMATE PERSONAL FINANCE APP</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  boxShadow: '0 6px 18px rgba(16, 185, 129, 0.4)'
                }}
              >
                <Wallet size={24} />
              </div>
              <span
                style={{
                  fontSize: '1.8rem',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  color: '#ffffff'
                }}
              >
                Finora
              </span>
            </div>

            <h1 className="auth-hero-title">
              Take full control of your wealth & credit payoffs.
            </h1>

            <p className="auth-hero-subtitle">
              Track multi-currency income, calculate credit card payoff strategies, plan savings goals, and manage your budget with total peace of mind.
            </p>

            {/* Feature Bullet Cards */}
            <div className="auth-features-list">
              <div className="auth-feature-item">
                <div className="auth-feature-icon">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <div className="auth-feature-text">Smart Income & Expense Insights</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Categorized transactions and visual monthly cashflow charts
                  </div>
                </div>
              </div>

              <div className="auth-feature-item">
                <div className="auth-feature-icon">
                  <CreditCard size={20} />
                </div>
                <div>
                  <div className="auth-feature-text">Debt Avalanche & Snowball Payoffs</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Save interest & calculate your exact debt-free timeline
                  </div>
                </div>
              </div>

              <div className="auth-feature-item">
                <div className="auth-feature-icon">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <div className="auth-feature-text">100% Private Local Encryption</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Your financial data never leaves your browser storage
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof / Testimonial Footer */}
          <div className="auth-testimonial-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', marginBottom: '6px' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="#f59e0b" />
              ))}
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', marginLeft: '6px' }}>
                4.9/5 Rating
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
              "Finora helped me organize 4 credit cards and map out a clear debt payment schedule. It's fast, sleek, and super easy!"
            </p>
          </div>
        </div>

        {/* Right Auth Form Panel */}
        <div className="auth-form-panel">
          {/* Mode Switcher Tabs */}
          <div className="auth-tabs-switcher">
            <button
              className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
              onClick={() => {
                setMode('login');
                setAuthError('');
                setAuthSuccess('');
              }}
            >
              Sign In
            </button>
            <button
              className={`auth-tab-btn ${mode === 'signup' ? 'active' : ''}`}
              onClick={() => {
                setMode('signup');
                setAuthError('');
                setAuthSuccess('');
              }}
            >
              Create Account
            </button>
          </div>


          {/* Alert Messages */}
          {authError && (
            <div className="auth-alert auth-alert-error">
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{authError}</span>
            </div>
          )}

          {authSuccess && (
            <div className="auth-alert auth-alert-success">
              <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{authSuccess}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-icon-group">
                  <input
                    type="email"
                    required
                    className="form-input input-with-left-icon"
                    placeholder="alex@finora.io"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                  <Mail size={18} className="input-left-icon" />
                </div>
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label">Password</label>
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#8b5cf6',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="input-icon-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="form-input input-with-left-icon input-with-right-icon"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
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

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#8b5cf6', cursor: 'pointer' }}
                />
                <label htmlFor="rememberMe" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  Remember me on this device
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', gap: '10px' }}
                disabled={isSubmitting}
              >
                <span>{isSubmitting ? 'Signing in...' : 'Sign In to Finora'}</span>
                <ArrowRight size={18} />
              </button>
            </form>
          ) : (
            /* SIGNUP FORM */
            <form onSubmit={handleSignupSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="input-icon-group">
                  <input
                    type="text"
                    required
                    className="form-input input-with-left-icon"
                    placeholder="Alex Morgan"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                  />
                  <User size={18} className="input-left-icon" />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div className="input-icon-group">
                    <input
                      type="email"
                      required
                      className="form-input input-with-left-icon"
                      placeholder="alex@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                    />
                    <Mail size={18} className="input-left-icon" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Base Currency</label>
                  <div className="input-icon-group">
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="form-select input-with-left-icon"
                      style={{ cursor: 'pointer' }}
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.symbol} - {c.code} ({c.name})
                        </option>
                      ))}
                    </select>
                    <Globe size={18} className="input-left-icon" />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Create Password</label>
                <div className="input-icon-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="form-input input-with-left-icon input-with-right-icon"
                    placeholder="Min 6 characters"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
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

                {/* Password Strength Indicator */}
                {signupPassword && (
                  <div className="password-meter">
                    <div className="password-meter-bars">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`password-meter-segment ${
                            step <= pwdStrength.score ? pwdStrength.colorClass : ''
                          }`}
                        />
                      ))}
                    </div>
                    <div className="password-meter-label">
                      <span style={{ color: 'var(--text-muted)' }}>Strength:</span>
                      <span className={`text-${pwdStrength.colorClass}`} style={{ fontWeight: 700 }}>
                        {pwdStrength.label}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className="input-icon-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="form-input input-with-left-icon"
                    placeholder="Re-type password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <Lock size={18} className="input-left-icon" />
                </div>
                {confirmPassword && signupPassword !== confirmPassword && (
                  <span style={{ fontSize: '0.75rem', color: '#f43f5e', marginTop: '2px', fontWeight: 600 }}>
                    Passwords do not match
                  </span>
                )}
                {confirmPassword && signupPassword === confirmPassword && (
                  <span style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '2px', fontWeight: 600 }}>
                    ✓ Passwords match
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '24px' }}>
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  style={{ width: '16px', height: '16px', marginTop: '2px', accentColor: '#8b5cf6', cursor: 'pointer' }}
                />
                <label htmlFor="agreeTerms" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  I agree to Finora's Terms of Service and Privacy Policy. All data is encrypted locally.
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', gap: '10px' }}
                disabled={isSubmitting}
              >
                <Sparkles size={18} />
                <span>{isSubmitting ? 'Creating account...' : 'Create Your Free Account'}</span>
              </button>
            </form>
          )}

          {/* Footer note */}
          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {mode === 'login' ? (
              <span>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setAuthError('');
                    setAuthSuccess('');
                  }}
                  style={{ background: 'none', border: 'none', color: '#8b5cf6', fontWeight: 700, cursor: 'pointer' }}
                >
                  Sign Up Free
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setAuthError('');
                    setAuthSuccess('');
                  }}
                  style={{ background: 'none', border: 'none', color: '#8b5cf6', fontWeight: 700, cursor: 'pointer' }}
                >
                  Sign In
                </button>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Forgot Password Recovery Modal */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        defaultEmail={loginEmail}
      />
    </div>
  );
}
