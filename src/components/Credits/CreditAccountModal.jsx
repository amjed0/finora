import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  X,
  Check,
  ArrowUpRight,
  ArrowDownLeft,
  Landmark,
  Ticket,
  Trophy,
  Calendar,
  Layers,
  Coins
} from 'lucide-react';

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

  const [category, setCategory] = useState('borrowing'); // 'borrowing' | 'lending' | 'asset' | 'chitty'
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

  // Chitty specific fields
  const [chittyAmount, setChittyAmount] = useState('');
  const [monthlyInstallment, setMonthlyInstallment] = useState('');
  const [totalDraws, setTotalDraws] = useState('');
  const [paidDraws, setPaidDraws] = useState('');
  const [prizeWon, setPrizeWon] = useState(false);
  const [prizeAmount, setPrizeAmount] = useState('');
  const [prizeDrawNumber, setPrizeDrawNumber] = useState('');
  const [startDate, setStartDate] = useState('');

  useEffect(() => {
    if (editingCredit) {
      const cat = editingCredit.category || 'borrowing';
      setCategory(cat);
      setName(editingCredit.name || '');
      setEntity(editingCredit.entity || '');
      setType(editingCredit.type || (cat === 'chitty' ? 'chitty_fund' : cat === 'lending' ? 'personal_lending' : cat === 'asset' ? 'investment' : 'credit_card'));
      setBalance(editingCredit.balance !== undefined ? editingCredit.balance : '');
      setLimit(editingCredit.limit || editingCredit.chittyAmount || editingCredit.balance || '');
      setApr(editingCredit.apr !== undefined ? editingCredit.apr : '0');
      setMinPayment(editingCredit.minPayment || editingCredit.monthlyInstallment || '');
      setDueDate(editingCredit.dueDate || '');
      setAccountNumber(editingCredit.accountNumber || '');
      setColor(editingCredit.color || (cat === 'chitty' ? '#eab308' : cat === 'lending' ? '#06b6d4' : cat === 'asset' ? '#10b981' : '#8b5cf6'));
      setNotes(editingCredit.notes || '');

      // Chitty fields
      setChittyAmount(editingCredit.chittyAmount || editingCredit.limit || '');
      setMonthlyInstallment(editingCredit.monthlyInstallment || editingCredit.minPayment || '');
      setTotalDraws(editingCredit.totalDraws !== undefined ? editingCredit.totalDraws : '');
      setPaidDraws(editingCredit.paidDraws !== undefined ? editingCredit.paidDraws : '');
      setPrizeWon(Boolean(editingCredit.prizeWon));
      setPrizeAmount(editingCredit.prizeAmount || '');
      setPrizeDrawNumber(editingCredit.prizeDrawNumber || '');
      setStartDate(editingCredit.startDate || '');
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

      setChittyAmount('');
      setMonthlyInstallment('');
      setTotalDraws('');
      setPaidDraws('0');
      setPrizeWon(false);
      setPrizeAmount('');
      setPrizeDrawNumber('');
      setStartDate('');
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
    } else if (cat === 'chitty') {
      setType('chitty_fund');
      setColor('#eab308');
    } else {
      setType('credit_card');
      setColor('#8b5cf6');
    }
  };

  // When updating Chitty paidDraws or installment, calculate total paid balance
  const handlePaidDrawsChange = (val) => {
    setPaidDraws(val);
    const draws = parseInt(val || '0', 10);
    const inst = parseFloat(monthlyInstallment || '0');
    if (draws >= 0 && inst > 0) {
      setBalance((draws * inst).toString());
    }
  };

  const handleInstallmentChange = (val) => {
    setMonthlyInstallment(val);
    setMinPayment(val);
    const inst = parseFloat(val || '0');
    const draws = parseInt(paidDraws || '0', 10);
    if (draws >= 0 && inst > 0) {
      setBalance((draws * inst).toString());
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (category === 'chitty') {
      const numChittyAmt = parseFloat(chittyAmount || limit || 0);
      const numInstallment = parseFloat(monthlyInstallment || minPayment || 0);
      const numTotalDraws = parseInt(totalDraws || 0, 10);
      const numPaidDraws = parseInt(paidDraws || 0, 10);
      const numBal = balance !== '' ? parseFloat(balance) : numPaidDraws * numInstallment;

      const payload = {
        category: 'chitty',
        name: name.trim(),
        entity: entity.trim() || 'Chit Organizer',
        type: 'chitty_fund',
        balance: numBal, // Total money paid into chitty so far
        limit: numChittyAmt, // Total pool value
        chittyAmount: numChittyAmt,
        monthlyInstallment: numInstallment,
        minPayment: numInstallment,
        totalDraws: numTotalDraws,
        paidDraws: numPaidDraws,
        prizeWon,
        prizeAmount: prizeWon ? parseFloat(prizeAmount || 0) : 0,
        prizeDrawNumber: prizeWon ? parseInt(prizeDrawNumber || 0, 10) : 0,
        startDate,
        dueDate,
        accountNumber: accountNumber.trim(),
        color: color || '#eab308',
        notes: notes.trim()
      };

      if (editingCredit) {
        updateCreditAccount(editingCredit.id, payload);
      } else {
        addCreditAccount(payload);
      }
    } else {
      if (balance === '') return;
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
    }

    setIsCreditModalOpen(false);
    setEditingCredit(null);
  };

  if (!isCreditModalOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => setIsCreditModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background:
                  category === 'chitty'
                    ? 'rgba(234, 179, 8, 0.15)'
                    : category === 'asset'
                    ? 'rgba(16, 185, 129, 0.15)'
                    : category === 'lending'
                    ? 'rgba(6, 182, 212, 0.15)'
                    : 'rgba(244, 63, 94, 0.15)',
                color:
                  category === 'chitty'
                    ? '#eab308'
                    : category === 'asset'
                    ? '#10b981'
                    : category === 'lending'
                    ? '#06b6d4'
                    : '#f43f5e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {category === 'chitty' ? (
                <Ticket size={20} />
              ) : category === 'asset' ? (
                <Landmark size={20} />
              ) : category === 'lending' ? (
                <ArrowUpRight size={20} />
              ) : (
                <ArrowDownLeft size={20} />
              )}
            </div>
            <h3 className="modal-title">
              {editingCredit
                ? category === 'chitty'
                  ? 'Edit Chitty (Chit Fund) Record'
                  : category === 'asset'
                  ? 'Edit Asset Record'
                  : category === 'lending'
                  ? 'Edit Lending (Credit) Record'
                  : 'Edit Borrowing (Debit) Record'
                : 'Add Portfolio, Credit or Chitty Record'}
            </h3>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={() => setIsCreditModalOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Category Switcher Tabs */}
        {!editingCredit && (
          <div className="auth-tabs-switcher" style={{ marginBottom: '20px', gridTemplateColumns: 'repeat(4, 1fr)' }}>
            <button
              type="button"
              className={`auth-tab-btn ${category === 'borrowing' ? 'active' : ''}`}
              style={{
                background: category === 'borrowing' ? 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)' : ''
              }}
              onClick={() => handleCategorySwitch('borrowing')}
            >
              🔴 Debit
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${category === 'lending' ? 'active' : ''}`}
              style={{
                background: category === 'lending' ? 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)' : ''
              }}
              onClick={() => handleCategorySwitch('lending')}
            >
              🟢 Credit
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
            <button
              type="button"
              className={`auth-tab-btn ${category === 'chitty' ? 'active' : ''}`}
              style={{
                background: category === 'chitty' ? 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)' : '',
                color: category === 'chitty' ? '#000' : ''
              }}
              onClick={() => handleCategorySwitch('chitty')}
            >
              🎟️ Chitty
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {category === 'chitty' ? (
            /* ================= CHITTY FORM FIELDS ================= */
            <>
              <div className="form-group">
                <label className="form-label">Chitty Name / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KSFE 50k Monthly Chitty, Gold Auction Chitty"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Chit Organizer / Company</label>
                  <input
                    type="text"
                    placeholder="e.g. KSFE, Shriram Chits, Family Group"
                    value={entity}
                    onChange={(e) => setEntity(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Passbook / Chit Ref #</label>
                  <input
                    type="text"
                    placeholder="e.g. Chit #K-8820, Group A-12"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Total Chitty Pool Amount ({currency.symbol}) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="e.g. 50000 or 500000"
                    value={chittyAmount}
                    onChange={(e) => {
                      setChittyAmount(e.target.value);
                      setLimit(e.target.value);
                    }}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Installment Per Draw ({currency.symbol}) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="e.g. 4000"
                    value={monthlyInstallment}
                    onChange={(e) => handleInstallmentChange(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Total Draws / Months Count *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 25 draws or 50 months"
                    value={totalDraws}
                    onChange={(e) => setTotalDraws(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Draws / Installments Paid So Far</label>
                  <input
                    type="number"
                    min="0"
                    max={totalDraws || undefined}
                    placeholder="0"
                    value={paidDraws}
                    onChange={(e) => handlePaidDrawsChange(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Calculated Total Paid Indicator */}
              <div
                style={{
                  background: 'rgba(234, 179, 8, 0.08)',
                  border: '1px solid rgba(234, 179, 8, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 16px',
                  marginBottom: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Total Invested / Paid Into Chitty:
                  </div>
                  <div className="amount-font" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#eab308' }}>
                    {currency.symbol}
                    {(parseFloat(balance) || (parseInt(paidDraws || '0', 10) * parseFloat(monthlyInstallment || '0')) || 0).toLocaleString()}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Progress:</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                    {paidDraws || 0} / {totalDraws || '—'} Draws{' '}
                    {totalDraws > 0 ? `(${Math.round(((parseInt(paidDraws || '0', 10)) / parseInt(totalDraws, 10)) * 100)}%)` : ''}
                  </div>
                </div>
              </div>

              {/* Prize / Auction Won Section */}
              <div
                style={{
                  background: prizeWon ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${prizeWon ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  marginBottom: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: prizeWon ? '12px' : '0' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem' }}>
                    <input
                      type="checkbox"
                      checked={prizeWon}
                      onChange={(e) => setPrizeWon(e.target.checked)}
                      style={{ width: '18px', height: '18px', accentColor: '#10b981', cursor: 'pointer' }}
                    />
                    <span>🏆 Prize / Auction Amount Won & Received?</span>
                  </label>
                  {prizeWon && (
                    <span className="badge badge-income" style={{ fontSize: '0.7rem' }}>
                      Prize Claimed
                    </span>
                  )}
                </div>

                {prizeWon && (
                  <div className="form-grid" style={{ marginTop: '10px' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Prize / Auction Amount Received ({currency.symbol})</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="e.g. 42000"
                        value={prizeAmount}
                        onChange={(e) => setPrizeAmount(e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Won on Draw #</label>
                      <input
                        type="number"
                        min="1"
                        placeholder="e.g. 8"
                        value={prizeDrawNumber}
                        onChange={(e) => setPrizeDrawNumber(e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Chitty Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Next Draw / Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>
            </>
          ) : (
            /* ================= BORROWING, LENDING, ASSET FIELDS ================= */
            <>
              <div className="form-group">
                <label className="form-label">
                  {category === 'asset'
                    ? 'Asset Name / Account Title *'
                    : category === 'lending'
                    ? 'Lending Title / Purpose *'
                    : 'Borrowing Title / Account Name *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    category === 'asset'
                      ? 'e.g. S&P 500 Index Fund, Emergency Savings'
                      : category === 'lending'
                      ? 'e.g. Lent to Mark for Security Deposit'
                      : 'e.g. Chase Sapphire Card, Tesla Auto Loan'
                  }
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    {category === 'asset'
                      ? 'Custodian / Broker / Institution'
                      : category === 'lending'
                      ? 'Borrower Name / Contact'
                      : 'Lender / Institution Name'}
                  </label>
                  <input
                    type="text"
                    placeholder={
                      category === 'asset'
                        ? 'e.g. Vanguard, Charles Schwab, Bank'
                        : category === 'lending'
                        ? 'e.g. Mark Stevens'
                        : 'e.g. Chase Bank, Uncle Robert'
                    }
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
                    {category === 'asset'
                      ? `Current Market Value (${currency.symbol}) *`
                      : category === 'lending'
                      ? `Current Balance Owed to You (${currency.symbol}) *`
                      : `Current Balance You Owe (${currency.symbol}) *`}
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
                    {category === 'asset'
                      ? `Original Cost Basis (${currency.symbol})`
                      : category === 'lending'
                      ? `Original Principal Lent (${currency.symbol})`
                      : `Total Credit Limit / Loan Original (${currency.symbol})`}
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
                  <label className="form-label">
                    {category === 'asset' ? 'Expected Return / APY (%)' : 'Interest Rate (APR %)'}
                  </label>
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
                      {category === 'lending'
                        ? `Agreed Installment (${currency.symbol})`
                        : `Min Monthly Payment (${currency.symbol})`}
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
            </>
          )}

          <div className="form-group">
            <label className="form-label">Notes & Details</label>
            <textarea
              rows="2"
              placeholder={category === 'chitty' ? 'e.g. 12 months duration, 2 draws per month on 1st & 15th...' : 'Add details regarding payment schedule, agreement, or terms...'}
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
                background:
                  category === 'chitty'
                    ? 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)'
                    : category === 'asset'
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : category === 'lending'
                    ? 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)'
                    : '',
                color: category === 'chitty' ? '#000' : '#fff'
              }}
            >
              <Check size={18} />
              <span>
                {editingCredit
                  ? 'Save Changes'
                  : category === 'chitty'
                  ? 'Add Chitty Record'
                  : category === 'asset'
                  ? 'Add Asset Record'
                  : category === 'lending'
                  ? 'Add Lending Record'
                  : 'Add Borrowing Record'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
