import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { X, Check, ArrowUpRight, ArrowDownLeft, Landmark, User, DollarSign, Calendar, TrendingUp } from 'lucide-react';

export default function CreditAccountModal() {
  const {
    isCreditModalOpen,
    setIsCreditModalOpen,
    editingCredit,
    setEditingCredit,
    addCreditAccount,
    updateCreditAccount,
    currency
  } = useFinance();

  const [category, setCategory] = useState('borrowing'); // 'borrowing' | 'lending'
  const [name, setName] = useState('');
  const [entity, setEntity] = useState('');
  const [type, setType] = useState('credit_card');
  const [balance, setBalance] = useState('');
  const [limit, setLimit] = useState('');
  const [apr, setApr] = useState('');
  const [minPayment, setMinPayment] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [color, setColor] = useState('#8b5cf6');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingCredit) {
      setCategory(editingCredit.category || 'borrowing');
      setName(editingCredit.name || '');
      setEntity(editingCredit.entity || '');
      setType(editingCredit.type || (editingCredit.category === 'lending' ? 'personal_lending' : 'credit_card'));
      setBalance(editingCredit.balance || '');
      setLimit(editingCredit.limit || editingCredit.balance || '');
      setApr(editingCredit.apr !== undefined ? editingCredit.apr : '0');
      setMinPayment(editingCredit.minPayment || '');
      setDueDate(editingCredit.dueDate || '');
      setAccountNumber(editingCredit.accountNumber || '');
      setColor(editingCredit.color || (editingCredit.category === 'lending' ? '#06b6d4' : '#8b5cf6'));
      setNotes(editingCredit.notes || '');
    } else {
      setCategory('borrowing');
      setName('');
      setEntity('');
      setType('credit_card');
      setBalance('');
      setLimit('');
      setApr('0');
      setMinPayment('');
      setDueDate('');
      setAccountNumber('');
      setColor('#8b5cf6');
      setNotes('');
    }
  }, [editingCredit, isCreditModalOpen]);

  const handleCategorySwitch = (cat) => {
    setCategory(cat);
    if (cat === 'lending') {
      setType('personal_lending');
      setColor('#06b6d4');
    } else if (cat === 'asset') {
      setType('investment');
      setColor('#10b981');
    } else {
      setType('credit_card');
      setColor('#8b5cf6');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || balance === '') return;

    const numBal = parseFloat(balance);
    const numLim = limit !== '' ? parseFloat(limit) : numBal;

    const payload = {
      category,
      name: name.trim(),
      entity: entity.trim() || name.trim(),
      type,
      balance: numBal,
      limit: numLim,
      apr: parseFloat(apr || 0),
      minPayment: parseFloat(minPayment || 0),
      dueDate,
      accountNumber: accountNumber.trim(),
      color,
      notes: notes.trim()
    };

    if (editingCredit) {
      updateCreditAccount(editingCredit.id, payload);
    } else {
      addCreditAccount(payload);
    }

    setIsCreditModalOpen(false);
    setEditingCredit(null);
  };

  if (!isCreditModalOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => setIsCreditModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: category === 'asset' ? 'rgba(16, 185, 129, 0.15)' : category === 'lending' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                color: category === 'asset' ? '#10b981' : category === 'lending' ? '#06b6d4' : '#f43f5e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {category === 'asset' ? <Landmark size={20} /> : category === 'lending' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
            </div>
            <h3 className="modal-title">
              {editingCredit
                ? category === 'asset' ? 'Edit Asset Record' : category === 'lending' ? 'Edit Lending (Credit) Record' : 'Edit Borrowing (Debit) Record'
                : 'Add Borrowing, Lending, or Asset Record'}
            </h3>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={() => setIsCreditModalOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Category Switcher Tabs */}
        {!editingCredit && (
          <div className="auth-tabs-switcher" style={{ marginBottom: '20px' }}>
            <button
              type="button"
              className={`auth-tab-btn ${category === 'borrowing' ? 'active' : ''}`}
              style={{
                background: category === 'borrowing' ? 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)' : ''
              }}
              onClick={() => handleCategorySwitch('borrowing')}
            >
              🔴 Borrowing
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${category === 'lending' ? 'active' : ''}`}
              style={{
                background: category === 'lending' ? 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)' : ''
              }}
              onClick={() => handleCategorySwitch('lending')}
            >
              🟢 Lending
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${category === 'asset' ? 'active' : ''}`}
              style={{
                background: category === 'asset' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : ''
              }}
              onClick={() => handleCategorySwitch('asset')}
            >
              🏦 Asset
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              {category === 'asset' ? 'Asset Name / Account Title *' : category === 'lending' ? 'Lending Title / Purpose *' : 'Borrowing Title / Account Name *'}
            </label>
            <input
              type="text"
              required
              placeholder={category === 'asset' ? 'e.g. S&P 500 Index Fund, Emergency Savings' : category === 'lending' ? 'e.g. Lent to Mark for Security Deposit' : 'e.g. Chase Sapphire Card, Tesla Auto Loan'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                {category === 'asset' ? 'Custodian / Broker / Institution' : category === 'lending' ? 'Borrower Name / Contact' : 'Lender / Institution Name'}
              </label>
              <input
                type="text"
                placeholder={category === 'asset' ? 'e.g. Vanguard, Charles Schwab, Bank' : category === 'lending' ? 'e.g. Mark Stevens' : 'e.g. Chase Bank, Uncle Robert'}
                value={entity}
                onChange={(e) => setEntity(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Classification Category</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="form-select"
              >
                {category === 'borrowing' ? (
                  <>
                    <option value="credit_card">Credit Card Line</option>
                    <option value="loan">Auto / Mortgage Loan</option>
                    <option value="personal_borrowing">Personal Borrowing (Friend/Family)</option>
                    <option value="personal_loan">Bank Personal Loan</option>
                  </>
                ) : category === 'lending' ? (
                  <>
                    <option value="personal_lending">Lent to Friend / Family</option>
                    <option value="business_lending">Business / Client Loan</option>
                    <option value="salary_advance">Salary Advance</option>
                    <option value="peer_lending">Peer-to-Peer Investment</option>
                  </>
                ) : (
                  <>
                    <option value="investment">Stocks / Mutual Funds / ETFs</option>
                    <option value="savings">Savings / Fixed Deposit</option>
                    <option value="property">Real Estate / Property</option>
                    <option value="crypto">Cryptocurrency / Digital Asset</option>
                    <option value="vehicle">Vehicle / Equipment</option>
                    <option value="other_asset">Other Asset</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                {category === 'asset' ? `Current Market Value (${currency.symbol}) *` : category === 'lending' ? `Current Balance Owed to You (${currency.symbol}) *` : `Current Balance You Owe (${currency.symbol}) *`}
              </label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                {category === 'asset' ? `Original Cost Basis (${currency.symbol})` : category === 'lending' ? `Original Principal Lent (${currency.symbol})` : `Total Credit Limit / Loan Original (${currency.symbol})`}
              </label>
              <input
                type="number"
                step="0.01"
                placeholder={balance || '1000.00'}
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">{category === 'asset' ? 'Expected Return / APY (%)' : 'Interest Rate (APR %)'}</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={apr}
                onChange={(e) => setApr(e.target.value)}
                className="form-input"
              />
            </div>

            {category !== 'asset' && (
              <div className="form-group">
                <label className="form-label">
                  {category === 'lending' ? `Agreed Installment (${currency.symbol})` : `Min Monthly Payment (${currency.symbol})`}
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={minPayment}
                  onChange={(e) => setMinPayment(e.target.value)}
                  className="form-input"
                />
              </div>
            )}
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Expected Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Account / Contract Ref #</label>
              <input
                type="text"
                placeholder={category === 'lending' ? 'e.g. Mobile # or Agreement ID' : 'e.g. •••• 4892'}
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notes & Agreement Details</label>
            <textarea
              rows="2"
              placeholder="Add details regarding payment schedule, agreement, or terms..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="form-textarea"
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ flex: 1 }}
              onClick={() => setIsCreditModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                flex: 1,
                background: category === 'asset' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : category === 'lending' ? 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)' : ''
              }}
            >
              <Check size={18} />
              <span>{editingCredit ? 'Save Changes' : category === 'asset' ? 'Add Asset Record' : category === 'lending' ? 'Add Lending Record' : 'Add Borrowing Record'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
