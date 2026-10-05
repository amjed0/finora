import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { CATEGORIES } from '../../constants/initialData';
import { PieChart, AlertTriangle, CheckCircle, Edit, Plus } from 'lucide-react';

export default function BudgetManager() {
  const { budgets, setBudgetLimit, transactions, formatCurrency } = useFinance();
  const [editingCat, setEditingCat] = useState(null);
  const [inputLimit, setInputLimit] = useState('');

  // Calculate actual spending per category for this month
  const now = new Date();
  const currentMonthStr = now.toISOString().substring(0, 7); // 'YYYY-MM'

  const spendingMap = {};
  transactions
    .filter((t) => t.type === 'expense' && t.date && t.date.startsWith(currentMonthStr))
    .forEach((t) => {
      spendingMap[t.category] = (spendingMap[t.category] || 0) + Number(t.amount);
    });

  const handleSaveBudget = (catId) => {
    if (inputLimit !== '' && parseFloat(inputLimit) >= 0) {
      setBudgetLimit(catId, inputLimit);
    }
    setEditingCat(null);
    setInputLimit('');
  };

  return (
    <div className="glass-card" style={{ marginBottom: '24px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Monthly Category Budgets</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Set monthly spending limits for categories and track your spending live
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {CATEGORIES.expense.map((cat) => {
          const budgetObj = budgets.find((b) => b.category === cat.id);
          const limit = budgetObj ? budgetObj.monthlyLimit : 0;
          const spent = spendingMap[cat.id] || 0;
          const percentage = limit > 0 ? (spent / limit) * 100 : 0;

          const isExceeded = limit > 0 && spent > limit;
          const isWarning = limit > 0 && percentage >= 80 && !isExceeded;

          return (
            <div
              key={cat.id}
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-color)',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '4px',
                      background: cat.color
                    }}
                  ></span>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{cat.name}</span>
                </div>

                {/* Status Pill */}
                {limit === 0 ? (
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>No limit set</span>
                ) : isExceeded ? (
                  <span className="badge badge-expense">Exceeded</span>
                ) : isWarning ? (
                  <span className="badge" style={{ background: 'rgba(250, 204, 21, 0.2)', color: '#facc15', border: '1px solid rgba(250, 204, 21, 0.3)' }}>
                    Near Limit
                  </span>
                ) : (
                  <span className="badge badge-income">On Track</span>
                )}
              </div>

              {/* Amount Display or Edit Mode */}
              {editingCat === cat.id ? (
                <div style={{ display: 'flex', gap: '8px', margin: '10px 0' }}>
                  <input
                    type="number"
                    step="10"
                    placeholder="Monthly limit..."
                    value={inputLimit}
                    onChange={(e) => setInputLimit(e.target.value)}
                    className="form-input"
                    style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                    autoFocus
                  />
                  <button
                    className="btn btn-primary"
                    style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                    onClick={() => handleSaveBudget(cat.id)}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', margin: '10px 0' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Spent / Limit</span>
                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>
                      {formatCurrency(spent)}{' '}
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        / {limit > 0 ? formatCurrency(limit) : 'Unset'}
                      </span>
                    </div>
                  </div>

                  <button
                    className="btn btn-secondary btn-icon"
                    style={{ width: '30px', height: '30px' }}
                    onClick={() => {
                      setEditingCat(cat.id);
                      setInputLimit(limit ? limit.toString() : '');
                    }}
                    title="Edit Limit"
                  >
                    <Edit size={14} />
                  </button>
                </div>
              )}

              {/* Progress Bar */}
              {limit > 0 && (
                <div className="progress-bar-bg" style={{ marginTop: '8px' }}>
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${Math.min(100, percentage)}%`,
                      background: isExceeded
                        ? 'var(--accent-expense)'
                        : isWarning
                        ? '#facc15'
                        : cat.color
                    }}
                  ></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
