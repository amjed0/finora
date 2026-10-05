import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import confetti from 'canvas-confetti';
import { Target, Plus, ShieldCheck, Plane, Zap, Check, Trash2 } from 'lucide-react';

export default function SavingsGoals() {
  const { goals, addGoal, depositToGoal, deleteGoal, formatCurrency } = useFinance();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');

  const [depositGoalId, setDepositGoalId] = useState(null);
  const [depositAmt, setDepositAmt] = useState('');

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !targetAmount) return;

    addGoal({
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount || 0),
      targetDate,
      color: '#10b981'
    });

    setIsAddOpen(false);
    setName('');
    setTargetAmount('');
    setCurrentAmount('');
    setTargetDate('');
  };

  const handleDepositSubmit = (e) => {
    e.preventDefault();
    if (!depositGoalId || !depositAmt || parseFloat(depositAmt) <= 0) return;

    depositToGoal(depositGoalId, parseFloat(depositAmt));

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 }
    });

    setDepositGoalId(null);
    setDepositAmt('');
  };

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Savings & Wealth Goals</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Track progress toward your financial milestones
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setIsAddOpen(true)}
          style={{ padding: '8px 14px', fontSize: '0.85rem' }}
        >
          <Plus size={16} />
          <span>New Goal</span>
        </button>
      </div>

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
          No savings goals set yet. Click "New Goal" to get started!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {goals.map((g) => {
            const percentage = g.targetAmount > 0 ? (g.currentAmount / g.targetAmount) * 100 : 0;
            const isCompleted = percentage >= 100;

            return (
              <div
                key={g.id}
                style={{
                  padding: '18px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>{g.name}</h3>
                      {g.targetDate && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Target Date: {g.targetDate}
                        </span>
                      )}
                    </div>
                    <button
                      className="btn btn-danger btn-icon"
                      style={{ width: '28px', height: '28px' }}
                      onClick={() => deleteGoal(g.id)}
                      title="Delete Goal"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div style={{ margin: '14px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                      <span>Saved Progress</span>
                      <span className="amount-font" style={{ color: g.color || 'var(--accent-income)' }}>
                        {formatCurrency(g.currentAmount)} / {formatCurrency(g.targetAmount)}
                      </span>
                    </div>

                    <div className="progress-bar-bg" style={{ height: '10px' }}>
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${Math.min(100, percentage)}%`,
                          background: isCompleted ? 'linear-gradient(90deg, #10b981 0%, #06b6d4 100%)' : (g.color || 'var(--accent-income)')
                        }}
                      ></div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '0.75rem', fontWeight: 700, marginTop: '4px', color: 'var(--text-secondary)' }}>
                      {percentage.toFixed(1)}% Achieved {isCompleted && '🎉'}
                    </div>
                  </div>
                </div>

                <button
                  className="btn btn-secondary"
                  style={{ width: '100%', marginTop: '10px', fontSize: '0.85rem' }}
                  onClick={() => {
                    setDepositGoalId(g.id);
                    setDepositAmt('');
                  }}
                >
                  <Plus size={14} />
                  <span>Deposit Funds</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Goal Modal */}
      {isAddOpen && (
        <div className="modal-overlay" onClick={() => setIsAddOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Create Savings Goal</h3>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label className="form-label">Goal Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Emergency Fund, House Downpayment"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Target Amount *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="10000"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Current Saved Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Target Completion Date</label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setIsAddOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      {depositGoalId && (
        <div className="modal-overlay" onClick={() => setDepositGoalId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Deposit to Savings Goal</h3>
            </div>
            <form onSubmit={handleDepositSubmit}>
              <div className="form-group">
                <label className="form-label">Deposit Amount *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  autoFocus
                  placeholder="500.00"
                  value={depositAmt}
                  onChange={(e) => setDepositAmt(e.target.value)}
                  className="form-input"
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setDepositGoalId(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, background: 'var(--accent-income)' }}>
                  Confirm Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
