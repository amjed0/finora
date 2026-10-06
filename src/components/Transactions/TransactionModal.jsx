import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { CATEGORIES } from '../../constants/initialData';
import { X, Check } from 'lucide-react';

export default function TransactionModal() {
  const {
    isTxModalOpen,
    setIsTxModalOpen,
    editingTx,
    setEditingTx,
    addTransaction,
    updateTransaction,
    credits,
    currency
  } = useFinance();

  const [type, setType] = useState('expense');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES.expense[0].id);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [creditAccountId, setCreditAccountId] = useState('');

  useEffect(() => {
    if (editingTx) {
      setType(editingTx.type || 'expense');
      setDescription(editingTx.description || editingTx.title || '');
      setAmount(editingTx.amount || '');
      setCategory(editingTx.category || (editingTx.type === 'income' ? CATEGORIES.income[0].id : CATEGORIES.expense[0].id));
      setDate(editingTx.date || new Date().toISOString().split('T')[0]);
      setPaymentMethod(editingTx.paymentMethod || 'Credit Card');
      setCreditAccountId(editingTx.creditAccountId || '');
    } else {
      setType('expense');
      setDescription('');
      setAmount('');
      setCategory(CATEGORIES.expense[0].id);
      setDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('Credit Card');
      setCreditAccountId('');
    }
  }, [editingTx, isTxModalOpen]);

  // Update default category when type changes
  const handleTypeChange = (newType) => {
    setType(newType);
    if (newType === 'income') {
      setCategory(CATEGORIES.income[0].id);
    } else {
      setCategory(CATEGORIES.expense[0].id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    const payload = {
      description: description.trim(),
      amount: parseFloat(amount),
      type,
      category,
      date,
      paymentMethod,
      creditAccountId: category === 'debt_payment' ? creditAccountId : null
    };

    if (editingTx) {
      updateTransaction(editingTx.id, payload);
    } else {
      addTransaction(payload);
    }

    setIsTxModalOpen(false);
    setEditingTx(null);
  };

  if (!isTxModalOpen) return null;

  const currentCategories = type === 'income' ? CATEGORIES.income : CATEGORIES.expense;

  return (
    <div className="modal-overlay" onClick={() => setIsTxModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {editingTx ? 'Edit Entry' : 'Add Income / Expense'}
          </h3>
          <button
            className="btn btn-secondary btn-icon"
            onClick={() => setIsTxModalOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Type Toggle */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
            <button
              type="button"
              className={`btn ${type === 'expense' ? 'btn-danger' : 'btn-secondary'}`}
              style={{ fontWeight: 700 }}
              onClick={() => handleTypeChange('expense')}
            >
              🔴 Expense
            </button>
            <button
              type="button"
              className={`btn ${type === 'income' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontWeight: 700, background: type === 'income' ? 'var(--accent-income)' : undefined }}
              onClick={() => handleTypeChange('income')}
            >
              🟢 Income
            </button>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Amount ({currency.symbol}) *</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-select"
              >
                {currentCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="form-select"
              >
                 <option value="Cash">Cash</option>
                 <option value="PayPal">Upi</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* If Debt Payment Category selected, allow linking credit account */}
          {category === 'debt_payment' && (
            <div className="form-group" style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
              <label className="form-label" style={{ color: '#8b5cf6' }}>Link Credit Card / Loan to Pay Off</label>
              <select
                value={creditAccountId}
                onChange={(e) => setCreditAccountId(e.target.value)}
                className="form-select"
              >
                <option value="">-- Select Credit Account (Optional) --</option>
                {credits.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} (Balance: {currency.symbol}{c.balance})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Description / Title (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Grocery Shopping, Client Invoice"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-input"
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ flex: 1 }}
              onClick={() => setIsTxModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              <Check size={18} />
              <span>{editingTx ? 'Save Changes' : 'Create Record'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
