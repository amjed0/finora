import React from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  LayoutDashboard,
  ArrowUpDown,
  HandCoins,
  PieChart,
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
        <LayoutDashboard size={19} />
        <span>Home</span>
      </button>

      <button
        className={`mobile-nav-item ${activeTab === 'transactions' ? 'active' : ''}`}
        onClick={() => setActiveTab('transactions')}
      >
        <ArrowUpDown size={19} />
        <span>Incomes</span>
      </button>

      {/* Center Elevated Hump Floating Action Button for New Entry */}
      <div className="mobile-fab-container">
        <button
          className="mobile-fab"
          aria-label="Add Income or Expense"
          title="Add New Entry"
          onClick={() => {
            setEditingTx(null);
            setIsTxModalOpen(true);
          }}
        >
          <Plus size={24} strokeWidth={2.5} />
        </button>
        <span className="mobile-fab-label">Add</span>
      </div>

      <button
        className={`mobile-nav-item ${activeTab === 'credits' ? 'active' : ''}`}
        onClick={() => setActiveTab('credits')}
      >
        <HandCoins size={19} />
        <span>Borrow/Lend</span>
      </button>

      <button
        className={`mobile-nav-item ${activeTab === 'budgets' ? 'active' : ''}`}
        onClick={() => setActiveTab('budgets')}
      >
        <PieChart size={19} />
        <span>Budgets</span>
      </button>
    </nav>
  );
}
