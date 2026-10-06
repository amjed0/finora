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
            <div key="dashboard" className="dashboard-container">
              <OverviewCards />

              <div className="dashboard-top-grid">
                <div className="dashboard-grid-item">
                  <CashflowChart />
                </div>
                <div className="dashboard-grid-item">
                  <FinancialHealthScore />
                </div>
              </div>

              <div className="dashboard-bottom-grid">
                <div className="dashboard-grid-item">
                  <AssetAllocationChart />
                </div>
                <div className="dashboard-grid-item">
                  <ExpenseCategoryChart />
                </div>
                <div className="dashboard-grid-item">
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
