import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { CATEGORIES } from '../../constants/initialData';
import { ArrowDownLeft, ArrowUpRight, Trash2, Edit2, ChevronRight } from 'lucide-react';

export default function RecentTransactionsList() {
  const { transactions, formatCurrency, deleteTransaction, setEditingTx, setIsTxModalOpen, setActiveTab } = useFinance();

  const recent = transactions.slice(0, 5);

  const getCategoryInfo = (type, catId) => {
    const catList = type === 'income' ? CATEGORIES.income : CATEGORIES.expense;
    return catList.find((c) => c.id === catId) || { name: catId, color: '#94a3b8' };
  };

  return (
    <div className="glass-card" style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Activity</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Latest income and expense entries
          </p>
        </div>
        <button
          className="btn btn-secondary"
          style={{ padding: '6px 12px', fontSize: '0.8rem', minHeight: '32px' }}
          onClick={() => setActiveTab('transactions')}
        >
          View All <ChevronRight size={14} />
        </button>
      </div>

      {recent.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
          No recent transactions found. Click "Add Record" to start.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {recent.map((tx) => {
            const catInfo = getCategoryInfo(tx.type, tx.category);
            const isIncome = tx.type === 'income';

            return (
              <div
                key={tx.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  transition: 'background 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      background: isIncome ? 'var(--accent-income-bg)' : 'var(--accent-expense-bg)',
                      color: isIncome ? 'var(--accent-income)' : 'var(--accent-expense)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {isIncome ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                  </div>

                  <div style={{ overflow: 'hidden' }}>
                    <div
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {tx.description}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <span
                        style={{
                          padding: '1px 6px',
                          borderRadius: '4px',
                          background: `${catInfo.color}22`,
                          color: catInfo.color,
                          fontWeight: 600
                        }}
                      >
                        {catInfo.name}
                      </span>
                      <span>•</span>
                      <span>{tx.date}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    className={`amount-font ${isIncome ? 'text-income' : 'text-expense'}`}
                    style={{ fontSize: '1rem', fontWeight: 700 }}
                  >
                    {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                  </div>

                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      className="btn btn-secondary btn-icon"
                      style={{ width: '32px', height: '32px' }}
                      onClick={() => {
                        setEditingTx(tx);
                        setIsTxModalOpen(true);
                      }}
                      title="Edit Transaction"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      className="btn btn-danger btn-icon"
                      style={{ width: '32px', height: '32px' }}
                      onClick={() => deleteTransaction(tx.id)}
                      title="Delete Transaction"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
