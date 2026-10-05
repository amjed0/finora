import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Flame, Snowflake, Sparkles, TrendingDown, Calendar, HandCoins, ArrowUpRight } from 'lucide-react';

export default function DebtPayoffCalculator() {
  const { credits, formatCurrency, totalBorrowedBalance, totalLentBalance } = useFinance();

  const [strategy, setStrategy] = useState('avalanche'); // 'avalanche' | 'snowball'
  const [extraPayment, setExtraPayment] = useState(200);

  const borrowedAccounts = credits.filter((c) => c.category !== 'lending' && c.balance > 0);
  const lendingAccounts = credits.filter((c) => c.category === 'lending' && c.balance > 0);

  if (credits.length === 0) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '30px' }}>
        <Sparkles size={32} color="#10b981" style={{ marginBottom: '8px' }} />
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Zero Active Debts or Loans 🎉</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          You currently have zero active borrowing or lending records.
        </p>
      </div>
    );
  }

  // Calculate total minimum monthly payments for borrowed debts
  const totalMinPayment = borrowedAccounts.reduce((sum, c) => sum + (c.minPayment || 25), 0);

  // Payoff Simulator Logic for Borrowed Debts
  const simulatePayoff = (mode) => {
    if (borrowedAccounts.length === 0) {
      return { months: 0, years: '0.0', totalInterest: 0 };
    }

    let debts = borrowedAccounts.map((c) => ({
      ...c,
      currBalance: parseFloat(c.balance),
      apr: parseFloat(c.apr || 0),
      minPay: parseFloat(c.minPayment || 25)
    }));

    if (mode === 'snowball') {
      debts.sort((a, b) => a.currBalance - b.currBalance);
    } else {
      debts.sort((a, b) => b.apr - a.apr);
    }

    let monthCount = 0;
    let totalInterestPaid = 0;

    while (debts.some((d) => d.currBalance > 0) && monthCount < 360) {
      monthCount++;

      // Interest
      debts.forEach((d) => {
        if (d.currBalance > 0) {
          const monthlyInterest = (d.currBalance * (d.apr / 100)) / 12;
          d.currBalance += monthlyInterest;
          totalInterestPaid += monthlyInterest;
        }
      });

      // Min payments
      let availableExtra = parseFloat(extraPayment || 0);
      debts.forEach((d) => {
        if (d.currBalance > 0) {
          const pay = Math.min(d.currBalance, d.minPay);
          d.currBalance -= pay;
        }
      });

      // Extra payment
      const targetDebt = debts.find((d) => d.currBalance > 0);
      if (targetDebt && availableExtra > 0) {
        const extraPay = Math.min(targetDebt.currBalance, availableExtra);
        targetDebt.currBalance -= extraPay;
      }
    }

    return {
      months: monthCount,
      years: (monthCount / 12).toFixed(1),
      totalInterest: totalInterestPaid
    };
  };

  const currentResult = simulatePayoff(strategy);

  const targetDate = new Date();
  targetDate.setMonth(targetDate.getMonth() + currentResult.months);
  const formattedTargetDate = targetDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '24px' }}>
      {/* Borrowing Payoff Simulator */}
      {borrowedAccounts.length > 0 && (
        <div className="glass-card">
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>🔴 Borrowing (Debit) Payoff & Debt-Free Simulator</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Simulate payoff acceleration strategies (Avalanche vs Snowball) for your borrowed debts
            </p>
          </div>

          {/* Strategy Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '20px' }}>
            <button
              type="button"
              className={`btn ${strategy === 'avalanche' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setStrategy('avalanche')}
              style={{ justifyContent: 'flex-start', padding: '12px' }}
            >
              <Flame size={18} color="#f43f5e" />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700 }}>Avalanche Strategy</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.85 }}>Highest APR First (Saves Most Money)</div>
              </div>
            </button>

            <button
              type="button"
              className={`btn ${strategy === 'snowball' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setStrategy('snowball')}
              style={{ justifyContent: 'flex-start', padding: '12px' }}
            >
              <Snowflake size={18} color="#38bdf8" />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700 }}>Snowball Strategy</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.85 }}>Smallest Balance First (Quickest Wins)</div>
              </div>
            </button>
          </div>

          {/* Slider */}
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label className="form-label" style={{ margin: 0 }}>Extra Monthly Debt Allocation ({formatCurrency(extraPayment)})</label>
              <span className="badge badge-income">Minimum Required: {formatCurrency(totalMinPayment)}/mo</span>
            </div>
            <input
              type="range"
              min="0"
              max="2000"
              step="50"
              value={extraPayment}
              onChange={(e) => setExtraPayment(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#8b5cf6', cursor: 'pointer' }}
            />
          </div>

          {/* Results Grid */}
          <div className="stats-grid" style={{ marginBottom: 0 }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-income)' }}>ESTIMATED DEBT-FREE DATE</div>
              <div className="amount-font text-income" style={{ fontSize: '1.4rem', marginTop: '4px' }}>
                {formattedTargetDate}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                In ~{currentResult.months} months ({currentResult.years} years)
              </div>
            </div>

            <div style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-credit)' }}>ESTIMATED INTEREST TO PAY</div>
              <div className="amount-font text-credit" style={{ fontSize: '1.4rem', marginTop: '4px' }}>
                {formatCurrency(currentResult.totalInterest)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Simulated using {strategy} method
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lending Collections Summary */}
      {lendingAccounts.length > 0 && (
        <div className="glass-card" style={{ borderColor: 'rgba(6, 182, 212, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ArrowUpRight size={20} color="#06b6d4" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>🟢 Outstanding Receivables (Lending / Credit Summary)</h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                You have {lendingAccounts.length} active lending agreements with total outstanding receivables of{' '}
                <strong style={{ color: 'var(--accent-cyan)' }}>{formatCurrency(totalLentBalance)}</strong>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
