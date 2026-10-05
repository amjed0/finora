import React from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  LayoutDashboard,
  ArrowUpDown,
  HandCoins,
  PieChart,
  Settings
} from 'lucide-react';

export default function MobileBottomNav() {
  const { activeTab, setActiveTab } = useFinance();

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'transactions', label: 'Income/Exp', icon: ArrowUpDown },
    { id: 'credits', label: 'Borrow/Lend', icon: HandCoins },
    { id: 'budgets', label: 'Budgets', icon: PieChart },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <nav className="mobile-bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            className={`mobile-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
            title={item.label}
          >
            <Icon size={19} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
