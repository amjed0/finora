import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { CATEGORIES } from '../../constants/initialData';

export default function ExpenseCategoryChart() {
  const { transactions, totalExpense, formatCurrency } = useFinance();

  // Aggregate expenses by category
  const catTotals = {};

  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      catTotals[t.category] = (catTotals[t.category] || 0) + Number(t.amount);
    });

  const sortedCats = Object.entries(catTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5); // Top 5 categories

  return (
    <div className="glass-card" style={{ height: '100%' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Top Expense Breakdown</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Where your money went this month
        </p>
      </div>

      {sortedCats.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
          No expenses logged yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {sortedCats.map(([catId, amount]) => {
            const catObj = CATEGORIES.expense.find((c) => c.id === catId) || {
              name: catId,
              color: '#94a3b8'
            };

            const percentage = totalExpense > 0 ? (amount / totalExpense) * 100 : 0;

            return (
              <div key={catId}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '4px',
                        background: catObj.color
                      }}
                    ></span>
                    <span>{catObj.name}</span>
                  </div>
                  <span>
                    {formatCurrency(amount)}{' '}
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      ({percentage.toFixed(1)}%)
                    </span>
                  </span>
                </div>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${percentage}%`,
                      background: catObj.color
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
