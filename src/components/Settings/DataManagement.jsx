import React, { useRef, useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';
import { CURRENCIES } from '../../constants/initialData';
import {
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Globe,
  Database,
  Moon,
  Sun,
  ShieldCheck,
  User,
  Mail,
  LogOut,
  CheckCircle2,
  Camera
} from 'lucide-react';

export default function DataManagement() {
  const {
    transactions,
    credits,
    budgets,
    goals,
    currency,
    setCurrency,
    theme,
    setTheme,
    loadDemoData,
    clearAllData,
    mongoConnected
  } = useFinance();

  const { currentUser, updateProfile, logout } = useAuth();

  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editEmail, setEditEmail] = useState(currentUser?.email || '');
  const [saveSuccess, setSaveSuccess] = useState('');

  const fileInputRef = useRef(null);

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateProfile({
      name: editName,
      email: editEmail
    });
    setSaveSuccess('Profile information updated successfully!');
    setTimeout(() => setSaveSuccess(''), 3000);
  };

  const exportJSONBackup = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      user: currentUser,
      transactions,
      credits,
      budgets,
      goals,
      currency
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `finora_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importJSONBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.transactions) localStorage.setItem('finora_transactions', JSON.stringify(parsed.transactions));
        if (parsed.credits) localStorage.setItem('finora_credits', JSON.stringify(parsed.credits));
        if (parsed.budgets) localStorage.setItem('finora_budgets', JSON.stringify(parsed.budgets));
        if (parsed.goals) localStorage.setItem('finora_goals', JSON.stringify(parsed.goals));
        if (parsed.currency) localStorage.setItem('finora_currency', JSON.stringify(parsed.currency));

        window.location.reload();
      } catch (err) {
        alert('Invalid backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* User Account Profile Card */}
      {currentUser && (
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Account Profile Settings</h2>
            <button className="btn btn-danger" onClick={logout} style={{ gap: '6px', padding: '6px 14px', fontSize: '0.82rem' }}>
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          </div>

          {saveSuccess && (
            <div className="auth-alert auth-alert-success" style={{ marginBottom: '16px' }}>
              <CheckCircle2 size={18} />
              <span>{saveSuccess}</span>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #8b5cf6'
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(currentUser.name)}`;
              }}
            />
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{currentUser.name}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{currentUser.email}</p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <span className="badge badge-credit">{currentUser.role || 'Member'}</span>
                <span className="badge badge-income">Account Active</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleProfileSave} className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                required
              />
            </div>

            <div style={{ gridColumn: '1 / -1', marginTop: '8px' }}>
              <button type="submit" className="btn btn-primary" style={{ padding: '8px 20px' }}>
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* App Preferences */}
      <div className="glass-card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>App Preferences & Regional Settings</h2>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={16} /> Base Currency Symbol
            </label>
            <select
              value={currency.code}
              onChange={(e) => {
                const sel = CURRENCIES.find((c) => c.code === e.target.value);
                if (sel) setCurrency(sel);
              }}
              className="form-select"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.symbol} - {c.code})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />} Visual Theme Mode
            </label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="form-select"
            >
              <option value="dark">🌙 Midnight Dark Mode (Default)</option>
              <option value="light">☀️ Clean Light Mode</option>
            </select>
          </div>
        </div>
      </div>


      {/* Backup & Restore */}
      <div className="glass-card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>Data Backup & Import</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          All your financial records are 100% private and stored locally in your browser.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <button className="btn btn-primary" onClick={exportJSONBackup}>
            <Download size={18} />
            <span>Export Full Data Backup (JSON)</span>
          </button>

          <button className="btn btn-secondary" onClick={() => fileInputRef.current?.click()}>
            <Upload size={18} />
            <span>Restore Backup File</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={importJSONBackup}
            accept=".json"
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {/* Demo Data & Factory Reset */}
      <div className="glass-card" style={{ borderColor: 'rgba(244, 63, 94, 0.3)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>Reset & Demo Controls</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Load pre-populated realistic demo data or erase all stored records.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <button
            className="btn btn-secondary"
            onClick={() => {
              if (window.confirm('Reset app data to sample demo data?')) {
                loadDemoData();
              }
            }}
          >
            <RefreshCw size={18} />
            <span>Load Sample Demo Data</span>
          </button>

          <button
            className="btn btn-danger"
            onClick={() => {
              if (window.confirm('Are you sure you want to erase ALL data? This action cannot be undone.')) {
                clearAllData();
              }
            }}
          >
            <Trash2 size={18} />
            <span>Wipe & Erase All Records</span>
          </button>
        </div>
      </div>
    </div>
  );
}
