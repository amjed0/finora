import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  ArrowUpDown,
  HandCoins,
  PieChart,
  Settings,
  PlusCircle,
  Wallet,
  LogOut
} from 'lucide-react';

export default function Sidebar() {
  const { activeTab, setActiveTab, setIsTxModalOpen, setEditingTx, netBalance, formatCurrency } = useFinance();
  const { currentUser, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Income & Expense', icon: ArrowUpDown },
    { id: 'credits', label: 'Borrowing (Dr) & Lending (Cr)', icon: HandCoins },
    { id: 'budgets', label: 'Budgets & Goals', icon: PieChart },
    { id: 'settings', label: 'Settings & Profile', icon: Settings }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Wallet size={22} />
        </div>
        <div>
          <span className="sidebar-logo-text">Finora</span>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            FINANCE & BORROWING
          </div>
        </div>
      </div>

      <div
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '12px',
          marginBottom: '20px'
        }}
      >
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
          NET BALANCE
        </span>
        <div
          className="amount-font"
          style={{
            fontSize: '1.25rem',
            color: netBalance >= 0 ? 'var(--accent-income)' : 'var(--accent-expense)'
          }}
        >
          {formatCurrency(netBalance)}
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Info & Logout Button at Bottom */}
      {currentUser && (
        <div
          style={{
            marginTop: 'auto',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid rgba(139, 92, 246, 0.4)'
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(currentUser.name)}`;
                }}
              />
              <div style={{ overflow: 'hidden' }}>
                <div
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    color: 'var(--text-primary)'
                  }}
                >
                  {currentUser.name}
                </div>
                <div
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {currentUser.email}
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              title="Log Out"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#f43f5e',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <LogOut size={16} />
            </button>
          </div>

          <button
            className="btn btn-primary"
            style={{ width: '100%', gap: '8px' }}
            onClick={() => {
              setEditingTx(null);
              setIsTxModalOpen(true);
            }}
          >
            <PlusCircle size={18} />
            <span>Add Record</span>
          </button>
        </div>
      )}
    </aside>
  );
}
