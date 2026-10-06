import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Landmark,
  ShieldCheck,
  Coins
} from 'lucide-react';

export default function OverviewCards() {
  const {
    totalIncome,
    totalExpense,
    netBalance,
    totalBorrowedBalance,
    totalAssetBalance,
    totalLentBalance,
    netWorth,
    totalCreditLimit,
    totalCreditUtilization,
    formatCurrency
  } = useFinance();

  return (
    <div className="stats-grid">
      {/* Net Worth */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            Net Worth
          </span>
          <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
            <Coins size={20} />
          </div>
        </div>
        <div
          className="amount-font"
          style={{
            fontSize: '1.65rem',
            fontWeight: 800,
            color: netWorth >= 0 ? 'var(--accent-income)' : 'var(--accent-expense)'
          }}
        >
          {formatCurrency(netWorth)}
        </div>
        <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: '6px' }}>
          Net Balance ({formatCurrency(netBalance)}) + Assets ({formatCurrency(totalAssetBalance)}) − Debts
        </div>
      </div>

      {/* Total Asset Holdings */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            Total Asset Holdings
          </span>
          <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <Landmark size={20} />
          </div>
        </div>
        <div className="amount-font text-income" style={{ fontSize: '1.65rem', fontWeight: 800 }}>
          {formatCurrency(totalAssetBalance)}
        </div>
        <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: '6px' }}>
          Investments, Savings & Real Estate
        </div>
      </div>

      {/* Net Cashflow / Monthly Surplus */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            Monthly Cashflow
          </span>
          <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
            <Wallet size={20} />
          </div>
        </div>
        <div
          className="amount-font"
          style={{
            fontSize: '1.65rem',
            fontWeight: 800,
            color: netBalance >= 0 ? 'var(--accent-income)' : 'var(--accent-expense)'
          }}
        >
          {formatCurrency(netBalance)}
        </div>
        <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: '6px' }}>
          {netBalance >= 0 ? '▲ Positive monthly balance' : '▼ Monthly deficit'}
        </div>
      </div>

      {/* Total Income */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            Total Incomes
          </span>
          <div style={{ padding: '8px', borderRadius: '10px', background: 'var(--accent-income-bg)', color: 'var(--accent-income)' }}>
            <TrendingUp size={20} />
          </div>
        </div>
        <div className="amount-font text-income" style={{ fontSize: '1.65rem', fontWeight: 800 }}>
          {formatCurrency(totalIncome)}
        </div>
        <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: '6px' }}>
          Recorded earnings
        </div>
      </div>

      {/* Total Expenses */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            Total Expenses
          </span>
          <div style={{ padding: '8px', borderRadius: '10px', background: 'var(--accent-expense-bg)', color: 'var(--accent-expense)' }}>
            <TrendingDown size={20} />
          </div>
        </div>
        <div className="amount-font text-expense" style={{ fontSize: '1.65rem', fontWeight: 800 }}>
          {formatCurrency(totalExpense)}
        </div>
        <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: '6px' }}>
          Recorded spending
        </div>
      </div>

      {/* Debts & Borrowings */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            Debts & Borrowings
          </span>
          <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
            <CreditCard size={20} />
          </div>
        </div>
        <div className="amount-font text-expense" style={{ fontSize: '1.65rem', fontWeight: 800 }}>
          {formatCurrency(totalBorrowedBalance)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
          <span style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>
            Limit: {formatCurrency(totalCreditLimit)}
          </span>
          <span className="badge badge-credit" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
            {totalCreditUtilization.toFixed(0)}% Used
          </span>
        </div>
      </div>
    </div>
  );
}
