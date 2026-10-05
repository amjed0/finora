import React from 'react';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import AuthPage from './components/Auth/AuthPage';
import Sidebar from './components/Sidebar';
import MobileBottomNav from './components/MobileBottomNav';
import Navbar from './components/Navbar';

// Dashboard
import OverviewCards from './components/Dashboard/OverviewCards';
import CashflowChart from './components/Dashboard/CashflowChart';
import ExpenseCategoryChart from './components/Dashboard/ExpenseCategoryChart';
import AssetAllocationChart from './components/Dashboard/AssetAllocationChart';
import FinancialHealthScore from './components/Dashboard/FinancialHealthScore';
import RecentTransactionsList from './components/Dashboard/RecentTransactionsList';

// Transactions
import TransactionList from './components/Transactions/TransactionList';
import TransactionModal from './components/Transactions/TransactionModal';

// Credits & Debts
import CreditCardList from './components/Credits/CreditCardList';
import CreditAccountModal from './components/Credits/CreditAccountModal';
import DebtPayoffCalculator from './components/Credits/DebtPayoffCalculator';
import PayoffModal from './components/Credits/PayoffModal';

// Budgets & Goals
import BudgetManager from './components/Budgets/BudgetManager';
import SavingsGoals from './components/Budgets/SavingsGoals';

// Settings
import DataManagement from './components/Settings/DataManagement';

function MainApp() {
  const { activeTab } = useFinance();

  return (
    <div className="app-container">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="main-content">
        <Navbar />

        <main className="page-body">
          {activeTab === 'dashboard' && (
            <div key="dashboard">
              <OverviewCards />

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '24px',
                  marginBottom: '24px'
                }}
              >
                <div style={{ flex: 2 }}>
                  <CashflowChart />
                </div>
                <div style={{ flex: 1 }}>
                  <FinancialHealthScore />
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '24px'
                }}
              >
                <div style={{ flex: 1 }}>
                  <AssetAllocationChart />
                </div>
                <div style={{ flex: 1 }}>
                  <ExpenseCategoryChart />
                </div>
                <div style={{ flex: 1 }}>
                  <RecentTransactionsList />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && <TransactionList />}

          {activeTab === 'credits' && (
            <div key="credits">
              <CreditCardList />
              <DebtPayoffCalculator />
            </div>
          )}

          {activeTab === 'budgets' && (
            <div key="budgets">
              <BudgetManager />
              <SavingsGoals />
            </div>
          )}

          {activeTab === 'settings' && <DataManagement />}
        </main>

        {/* Mobile Navigation Bar */}
        <MobileBottomNav />

        {/* Global Modals */}
        <TransactionModal />
        <CreditAccountModal />
        <PayoffModal />
      </div>
    </div>
  );
}

function AppContent() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <AuthPage />;
  }

  return <MainApp />;
}

export default function App() {
  return (
    <AuthProvider>
      <FinanceProvider>
        <AppContent />
      </FinanceProvider>
    </AuthProvider>
  );
}
