import React from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  LayoutDashboard,
  ArrowUpDown,
  HandCoins,
  PieChart,
  Settings,
  Plus
} from 'lucide-react';

export default function MobileBottomNav() {
  const { activeTab, setActiveTab, setIsTxModalOpen, setEditingTx } = useFinance();

  return (
    <nav className="mobile-bottom-nav">
      <button
        className={`mobile-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
        onClick={() => setActiveTab('dashboard')}
      >
        <LayoutDashboard size={20} />
        <span>Home</span>
      </button>

      <button
        className={`mobile-nav-item ${activeTab === 'transactions' ? 'active' : ''}`}
        onClick={() => setActiveTab('transactions')}
      >
        <ArrowUpDown size={20} />
        <span>Income/Exp</span>
      </button>

      <div className="mobile-fab-container">
        <button
          className="mobile-fab"
          aria-label="Add Record"
          onClick={() => {
            setEditingTx(null);
            setIsTxModalOpen(true);
          }}
        >
          <Plus size={26} />
        </button>
      </div>

      <button
        className={`mobile-nav-item ${activeTab === 'credits' ? 'active' : ''}`}
        onClick={() => setActiveTab('credits')}
      >
        <HandCoins size={20} />
        <span>Borrow/Lend</span>
      </button>

      <button
        className={`mobile-nav-item ${activeTab === 'budgets' ? 'active' : ''}`}
        onClick={() => setActiveTab('budgets')}
      >
        <PieChart size={20} />
        <span>Budgets</span>
      </button>
    </nav>
  );
}
