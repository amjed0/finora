import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import confetti from 'canvas-confetti';
import {
  X,
  ArrowDownLeft,
  Landmark,
  TrendingUp,
  AlertCircle,
  Coins,
  CheckCircle2
} from 'lucide-react';

export default function WithdrawAssetModal() {
  const {
    isWithdrawModalOpen,
    setIsWithdrawModalOpen,
    selectedAssetForWithdraw,
    setSelectedAssetForWithdraw,
    withdrawAsset,
    currency,
    formatCurrency
  } = useFinance();

  const [withdrawAmount, setWithdrawAmount] = useState('');

  useEffect(() => {
    if (selectedAssetForWithdraw) {
      setWithdrawAmount((selectedAssetForWithdraw.balance || 0).toString());
    } else {
      setWithdrawAmount('');
    }
  }, [selectedAssetForWithdraw, isWithdrawModalOpen]);

  if (!isWithdrawModalOpen || !selectedAssetForWithdraw) return null;

  const currentBalance = parseFloat(selectedAssetForWithdraw.balance || 0);
  const numAmount = parseFloat(withdrawAmount) || 0;
  const remainingBalance = Math.max(0, currentBalance - numAmount);
  const isFullWithdraw = numAmount >= currentBalance;

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    if (!numAmount || numAmount <= 0) return;

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {}

    withdrawAsset(selectedAssetForWithdraw.id, numAmount);

    setIsWithdrawModalOpen(false);
    setSelectedAssetForWithdraw(null);
    setWithdrawAmount('');
  };

  const setPercentage = (pct) => {
    const calculated = (currentBalance * pct).toFixed(2);
    setWithdrawAmount(calculated);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsWithdrawModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ArrowDownLeft size={22} />
            </div>
            <div>
              <h3 className="modal-title">Withdraw / Sell Asset</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Convert asset value into liquid Income
              </p>
            </div>
          </div>
          <button
            className="btn btn-secondary btn-icon"
            onClick={() => setIsWithdrawModalOpen(false)}
            title="Cancel and close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleWithdrawSubmit}>
          {/* Target Asset Details Card */}
          <div
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              marginBottom: '18px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="badge badge-income" style={{ fontSize: '0.7rem', marginBottom: '6px' }}>
                  {selectedAssetForWithdraw.type ? selectedAssetForWithdraw.type.toUpperCase() : 'ASSET'}
                </span>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{selectedAssetForWithdraw.name}</h4>
                {selectedAssetForWithdraw.entity && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Custodian: {selectedAssetForWithdraw.entity}
                  </p>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Current Value</span>
                <div className="amount-font text-income" style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                  {formatCurrency(currentBalance)}
                </div>
              </div>
            </div>
          </div>

          {/* Amount input field */}
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label className="form-label" style={{ margin: 0 }}>
                Withdrawal Amount ({currency.symbol})
              </label>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '2px 8px', fontSize: '0.7rem', height: 'auto' }}
                  onClick={() => setPercentage(0.25)}
                >
                  25%
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '2px 8px', fontSize: '0.7rem', height: 'auto' }}
                  onClick={() => setPercentage(0.5)}
                >
                  50%
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '2px 8px', fontSize: '0.7rem', height: 'auto' }}
                  onClick={() => setPercentage(1.0)}
                >
                  100% (Full)
                </button>
              </div>
            </div>
            <div className="input-with-icon">
              <span className="input-currency">{currency.symbol}</span>
              <input
                type="number"
                step="any"
                min="0.01"
                max={currentBalance}
                placeholder="0.00"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="form-input"
                style={{ fontSize: '1.2rem', fontWeight: 700 }}
                autoFocus
                required
              />
            </div>
          </div>

          {/* Explanation Banner */}
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-color)',
              marginBottom: '20px',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: 'var(--text-primary)', fontWeight: 700 }}>
              <TrendingUp size={16} color="#10b981" />
              <span>Conversion Impact</span>
            </div>
            <p style={{ margin: 0, lineHeight: 1.4 }}>
              {isFullWithdraw ? (
                <>
                  ⚡ Withdrawing <strong style={{ color: 'var(--accent-income)' }}>{formatCurrency(numAmount)}</strong> will be credited directly as an <strong style={{ color: 'var(--accent-income)' }}>Income Transaction</strong> (Cashflow), and <strong style={{ color: 'var(--text-primary)' }}>{selectedAssetForWithdraw.name}</strong> will be <strong>removed automatically</strong> from your active assets.
                </>
              ) : (
                <>
                  ⚡ Withdrawing <strong style={{ color: 'var(--accent-income)' }}>{formatCurrency(numAmount)}</strong> will be added to your <strong style={{ color: 'var(--accent-income)' }}>Income</strong>, and the remaining asset value will be <strong style={{ color: 'var(--accent-income)' }}>{formatCurrency(remainingBalance)}</strong>.
                </>
              )}
            </p>
          </div>

          {/* Action Buttons: Cancel and Confirm */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ flex: 1 }}
              onClick={() => setIsWithdrawModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                flex: 1.5,
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#fff',
                fontWeight: 700,
                gap: '8px'
              }}
              disabled={numAmount <= 0 || numAmount > currentBalance}
            >
              <Coins size={18} />
              <span>
                {isFullWithdraw ? 'Confirm Sell & Remove' : `Withdraw ${formatCurrency(numAmount)}`}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
