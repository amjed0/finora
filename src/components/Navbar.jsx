import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import { CURRENCIES } from '../constants/initialData';
import { Sun, Moon, Plus, Wallet, LogOut, User, ChevronDown, Settings } from 'lucide-react';

export default function Navbar() {
  const {
    activeTab,
    setActiveTab,
    currency,
    setCurrency,
    theme,
    setTheme,
    setIsTxModalOpen,
    setEditingTx
  } = useFinance();

  const { currentUser, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Overview';
      case 'transactions':
        return 'Incomes & Expenses';
      case 'credits':
        return 'Borrow & Lend';
      case 'budgets':
        return 'Budgets & Goals';
      case 'settings':
        return 'Settings & Profile';
      default:
        return 'Finora';
    }
  };

  return (
    <header className="top-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
        <div
          className="mobile-only"
          style={{
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}
          >
            <Wallet size={16} />
          </div>
        </div>
        <h1 className="top-header-title">{getTitle()}</h1>
      </div>

      <div className="top-header-actions">
        {/* Currency Switcher Dropdown */}
        <select
          value={currency.code}
          onChange={(e) => {
            const selected = CURRENCIES.find((c) => c.code === e.target.value);
            if (selected) setCurrency(selected);
          }}
          className="form-select"
          style={{
            padding: '6px 8px',
            fontSize: '0.85rem',
            width: 'auto',
            minHeight: '36px',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.symbol} {c.code}
            </option>
          ))}
        </select>

        {/* Theme Toggle Button */}
        <button
          className="btn btn-secondary btn-icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title="Toggle Dark/Light Mode"
        >
          {theme === 'dark' ? <Sun size={17} color="#facc15" /> : <Moon size={17} color="#6366f1" />}
        </button>

        {/* Header Action Button for Quick Add */}
        <button
          className="btn btn-primary"
          style={{
            padding: '8px 12px',
            fontSize: '0.85rem',
            minHeight: '36px'
          }}
          onClick={() => {
            setEditingTx(null);
            setIsTxModalOpen(true);
          }}
          title="Add Income / Expense"
        >
          <Plus size={16} />
          <span className="desktop-only">New Entry</span>
        </button>

        {/* User Profile Pill & Dropdown */}
        {currentUser && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-color)',
                padding: '4px 8px 4px 5px',
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                transition: 'all 0.2s ease'
              }}
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(currentUser.name)}`;
                }}
              />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }} className="desktop-only">
                {currentUser.name.split(' ')[0]}
              </span>
              <ChevronDown size={13} color="var(--text-muted)" />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '220px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '12px',
                  zIndex: 100,
                  animation: 'fadeIn 0.15s ease-out'
                }}
              >
                <div style={{ paddingBottom: '8px', marginBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    {currentUser.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', wordBreak: 'break-all' }}>
                    {currentUser.email}
                  </div>
                  <div
                    style={{
                      display: 'inline-block',
                      marginTop: '4px',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(139, 92, 246, 0.15)',
                      color: '#8b5cf6',
                      fontSize: '0.7rem',
                      fontWeight: 700
                    }}
                  >
                    {currentUser.role || 'Member'}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    setActiveTab('settings');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '8px 10px',
                    border: 'none',
                    background: activeTab === 'settings' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.08)',
                    color: '#8b5cf6',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginBottom: '8px'
                  }}
                >
                  <Settings size={16} />
                  <span>Settings & Profile</span>
                </button>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '8px 10px',
                    border: 'none',
                    background: 'rgba(244, 63, 94, 0.1)',
                    color: '#f43f5e',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <LogOut size={16} />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
