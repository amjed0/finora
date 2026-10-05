import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import confetti from 'canvas-confetti';
import { X, CheckCircle, Sparkles, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function PayoffModal() {
  const {
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    selectedCreditForPay,
    setSelectedCreditForPay,
    logCreditPayment,
    currency,
    formatCurrency
  } = useFinance();

  const [paymentAmount, setPaymentAmount] = useState('');
  const [customNotes, setCustomNotes] = useState('');

  if (!isPaymentModalOpen || !selectedCreditForPay) return null;

  const isLending = selectedCreditForPay.category === 'lending';

  const handlePaySubmit = (e) => {
    e.preventDefault();
    const amt = parseFloat(paymentAmount);
    if (!amt || amt <= 0) return;

    // Trigger confetti celebration effect
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {}

    logCreditPayment(selectedCreditForPay.id, amt, customNotes);

    setIsPaymentModalOpen(false);
    setSelectedCreditForPay(null);
    setPaymentAmount('');
    setCustomNotes('');
  };

  return (
    <div className="modal-overlay" onClick={() => setIsPaymentModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isLending ? (
              <ArrowUpRight size={20} color="#06b6d4" />
            ) : (
              <ArrowDownLeft size={20} color="#f43f5e" />
            )}
            <span>
              {isLending
                ? `Log Collection from ${selectedCreditForPay.entity || selectedCreditForPay.name}`
                : `Log Paydown for ${selectedCreditForPay.name}`}
            </span>
          </h3>
          <button
            className="btn btn-secondary btn-icon"
            onClick={() => setIsPaymentModalOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handlePaySubmit}>
          <div
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: isLending ? 'rgba(6, 182, 212, 0.12)' : 'rgba(244, 63, 94, 0.12)',
              border: `1px solid ${isLending ? 'rgba(6, 182, 212, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
              marginBottom: '20px'
            }}
          >
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {isLending ? 'Outstanding Money Owed to You:' : 'Current Debt Balance You Owe:'}
            </div>
            <div
              className="amount-font"
              style={{
                fontSize: '1.6rem',
                fontWeight: 800,
                color: isLending ? 'var(--accent-cyan)' : 'var(--accent-expense)'
              }}
            >
              {formatCurrency(selectedCreditForPay.balance)}
            </div>
            {selectedCreditForPay.minPayment > 0 && (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {isLending ? 'Agreed Installment:' : 'Minimum Monthly Payment:'} {formatCurrency(selectedCreditForPay.minPayment)}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              {isLending ? `Collection Amount (${currency.symbol}) *` : `Payment Amount (${currency.symbol}) *`}
            </label>
            <input
              type="number"
              step="0.01"
              required
              max={selectedCreditForPay.balance}
              placeholder={`e.g. ${selectedCreditForPay.minPayment || selectedCreditForPay.balance}`}
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Quick Amount Buttons */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            {selectedCreditForPay.minPayment > 0 && (
              <button
                type="button"
                className="btn btn-secondary"
                style={{ flex: 1, padding: '6px', fontSize: '0.75rem' }}
                onClick={() => setPaymentAmount(selectedCreditForPay.minPayment.toString())}
              >
                Installment ({formatCurrency(selectedCreditForPay.minPayment)})
              </button>
            )}
            <button
              type="button"
              className="btn btn-secondary"
              style={{ flex: 1, padding: '6px', fontSize: '0.75rem' }}
              onClick={() => setPaymentAmount(selectedCreditForPay.balance.toString())}
            >
              Full Settlement ({formatCurrency(selectedCreditForPay.balance)})
            </button>
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label">Transaction Notes / Method</label>
            <input
              type="text"
              className="form-input"
              placeholder={isLending ? 'e.g. Bank transfer from Mark' : 'e.g. Credit card payoff via Checking'}
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ flex: 1 }}
              onClick={() => setIsPaymentModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                flex: 1,
                background: isLending
                  ? 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)'
                  : 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)'
              }}
            >
              <CheckCircle size={18} />
              <span>{isLending ? 'Record Collection' : 'Record Paydown'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
