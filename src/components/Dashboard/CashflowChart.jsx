import React from 'react';
import { useFinance } from '../../context/FinanceContext';

export default function CashflowChart() {
  const { transactions, formatCurrency } = useFinance();

  // Aggregate income vs expense by month
  const monthlyData = {};

  transactions.forEach((tx) => {
    if (!tx.date) return;
    const monthKey = tx.date.substring(0, 7); // 'YYYY-MM'
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { income: 0, expense: 0 };
    }
    if (tx.type === 'income') {
      monthlyData[monthKey].income += Number(tx.amount);
    } else {
      monthlyData[monthKey].expense += Number(tx.amount);
    }
  });

  const months = Object.keys(monthlyData).sort().slice(-6); // Last 6 months

  const maxVal = Math.max(
    1,
    ...months.map((m) => Math.max(monthlyData[m].income, monthlyData[m].expense))
  );

  return (
    <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Cashflow Analytics</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Monthly Income vs Expense comparison
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.8rem', fontWeight: 600 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-income)' }}></span>
              <span>Income</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-expense)' }}></span>
              <span>Expense</span>
            </div>
          </div>
        </div>

        {months.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            No monthly data recorded yet.
          </div>
        ) : (
          <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <div style={{ minWidth: '260px', height: '210px', display: 'flex', alignItems: 'flex-end', gap: '16px', padding: '16px 8px 24px' }}>
            {months.map((month) => {
              const inc = monthlyData[month].income;
              const exp = monthlyData[month].expense;
              const incPct = Math.min(100, (inc / maxVal) * 100);
              const expPct = Math.min(100, (exp / maxVal) * 100);

              // Format date label e.g., 'Sep 26'
              const dateObj = new Date(month + '-01');
              const label = dateObj.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });

              return (
                <div key={month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                  <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '8px' }}>
                    {/* Income Bar */}
                    <div
                      style={{
                        width: '40%',
                        maxWidth: '24px',
                        height: `${Math.max(6, incPct)}%`,
                        background: 'linear-gradient(180deg, #10b981 0%, rgba(16, 185, 129, 0.4) 100%)',
                        borderRadius: '6px 6px 0 0',
                        position: 'relative',
                        transition: 'height 0.4s ease'
                      }}
                      title={`Income: ${formatCurrency(inc)}`}
                    ></div>
                    {/* Expense Bar */}
                    <div
                      style={{
                        width: '40%',
                        maxWidth: '24px',
                        height: `${Math.max(6, expPct)}%`,
                        background: 'linear-gradient(180deg, #f43f5e 0%, rgba(244, 63, 94, 0.4) 100%)',
                        borderRadius: '6px 6px 0 0',
                        position: 'relative',
                        transition: 'height 0.4s ease'
                      }}
                      title={`Expense: ${formatCurrency(exp)}`}
                    ></div>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '10px' }}>
                    {label}
                  </span>
                </div>
              );
            })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
