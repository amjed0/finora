import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  CreditCard,
  Plus,
  Edit2,
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Sparkles,
  TrendingUp,
  UserCheck,
  ShieldCheck,
  HandCoins,
  AlertCircle,
  FileText,
  Landmark,
  Wallet,
  Ticket,
  Trophy,
  CheckCircle2,
  Coins,
  X
} from 'lucide-react';

export default function CreditCardList() {
  const {
    credits,
    deleteCreditAccount,
    setEditingCredit,
    setIsCreditModalOpen,
    setSelectedCreditForPay,
    setIsPaymentModalOpen,
    formatCurrency,
    totalBorrowedBalance,
    totalLentBalance,
    totalAssetBalance,
    totalChittyBalance,
    totalChittyPool,
    chittyAccounts,
    logChittyInstallment,
    claimChittyPrize,
    netWorth,
    netBorrowLendPosition,
    totalCreditLimit,
    totalCreditUtilization
  } = useFinance();

  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'borrowing' | 'lending' | 'asset' | 'chitty'
  const [claimModalAccount, setClaimModalAccount] = useState(null);
  const [claimPrizeAmount, setClaimPrizeAmount] = useState('');
  const [claimDrawNumber, setClaimDrawNumber] = useState('');

  const borrowedAccounts = credits.filter(
    (c) => c.category === 'borrowing' || (!c.category && c.category !== 'lending' && c.category !== 'asset' && c.category !== 'chitty')
  );
  const lendingAccounts = credits.filter((c) => c.category === 'lending');
  const assetAccounts = credits.filter((c) => c.category === 'asset');
  const chitAccounts = credits.filter((c) => c.category === 'chitty');

  const filteredAccounts = credits.filter((c) => {
    if (activeFilter === 'borrowing') return c.category === 'borrowing' || (!c.category && c.category !== 'lending' && c.category !== 'asset' && c.category !== 'chitty');
    if (activeFilter === 'lending') return c.category === 'lending';
    if (activeFilter === 'asset') return c.category === 'asset';
    if (activeFilter === 'chitty') return c.category === 'chitty';
    return true;
  });

  const getTypeBadgeLabel = (account) => {
    if (account.category === 'asset') {
      const typeMap = {
        investment: 'Investment',
        savings: 'Savings Account',
        property: 'Real Estate / Property',
        crypto: 'Crypto / Digital',
        vehicle: 'Vehicle',
        other_asset: 'Other Asset'
      };
      return typeMap[account.type] || 'Asset';
    }
    if (account.category === 'chitty') {
      return 'Chit Fund';
    }
    return '';
  };

  const handleOpenClaimModal = (account) => {
    setClaimModalAccount(account);
    setClaimPrizeAmount(account.chittyAmount || account.limit || '');
    setClaimDrawNumber((account.paidDraws || 1).toString());
  };

  const handleClaimSubmit = (e) => {
    e.preventDefault();
    if (!claimModalAccount) return;
    claimChittyPrize(claimModalAccount.id, claimPrizeAmount, claimDrawNumber);
    setClaimModalAccount(null);
    setClaimPrizeAmount('');
    setClaimDrawNumber('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header & High-Level Summary Stats */}
      <div className="glass-card">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '20px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <HandCoins size={20} />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                Borrowing, Lending, Assets & Chitty
              </h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Manage debts, receivables, investments, savings, property holdings, and chit funds in one place
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingCredit(null);
              setIsCreditModalOpen(true);
            }}
          >
            <Plus size={16} />
            <span>Add Record</span>
          </button>
        </div>

        {/* 5 Summary Metric Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            marginBottom: '20px'
          }}
        >
          {/* Total Borrowed (Debit) */}
          <div
            style={{
              background: 'rgba(244, 63, 94, 0.08)',
              border: '1px solid rgba(244, 63, 94, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '14px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                🔴 BORROWING (DEBIT)
              </span>
              <ArrowDownLeft size={16} color="#f43f5e" />
            </div>
            <div className="amount-font text-expense" style={{ fontSize: '1.3rem', fontWeight: 800 }}>
              {formatCurrency(totalBorrowedBalance)}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {borrowedAccounts.length} active debt(s)
            </div>
          </div>

          {/* Total Lent (Credit) */}
          <div
            style={{
              background: 'rgba(6, 182, 212, 0.08)',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '14px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                🟢 LENDING (CREDIT)
              </span>
              <ArrowUpRight size={16} color="#06b6d4" />
            </div>
            <div className="amount-font text-cyan" style={{ fontSize: '1.3rem', fontWeight: 800 }}>
              {formatCurrency(totalLentBalance)}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {lendingAccounts.length} receivable(s)
            </div>
          </div>

          {/* Total Assets */}
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '14px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                🏦 ASSETS (HOLDINGS)
              </span>
              <Landmark size={16} color="#10b981" />
            </div>
            <div className="amount-font text-income" style={{ fontSize: '1.3rem', fontWeight: 800 }}>
              {formatCurrency(totalAssetBalance)}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {assetAccounts.length} asset account(s)
            </div>
          </div>

          {/* Total Chitty Invested */}
          <div
            style={{
              background: 'rgba(234, 179, 8, 0.08)',
              border: '1px solid rgba(234, 179, 8, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '14px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#eab308' }}>
                🎟️ CHITTY (SAVED)
              </span>
              <Ticket size={16} color="#eab308" />
            </div>
            <div className="amount-font" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#eab308' }}>
              {formatCurrency(totalChittyBalance)}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {chitAccounts.length} active chitty fund(s)
            </div>
          </div>

          {/* Net Worth */}
          <div
            style={{
              background: 'rgba(139, 92, 246, 0.08)',
              border: '1px solid rgba(139, 92, 246, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '14px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                ⚖️ NET WORTH
              </span>
              <span
                className={`badge ${netWorth >= 0 ? 'badge-income' : 'badge-expense'}`}
                style={{ fontSize: '0.65rem', padding: '2px 8px' }}
              >
                {netWorth >= 0 ? 'Positive' : 'Negative'}
              </span>
            </div>
            <div
              className="amount-font"
              style={{
                fontSize: '1.3rem',
                fontWeight: 800,
                color: netWorth >= 0 ? 'var(--accent-income)' : 'var(--accent-expense)'
              }}
            >
              {formatCurrency(Math.abs(netWorth))}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Assets + Chitty + Lent − Debts
            </div>
          </div>
        </div>

        {/* Aggregate Credit Line Utilization Gauge */}
        {totalCreditLimit > 0 && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
              <span>Bank Credit Lines Utilization</span>
              <span>
                {formatCurrency(totalBorrowedBalance)} / {formatCurrency(totalCreditLimit)}{' '}
                <strong style={{ color: totalCreditUtilization > 30 ? 'var(--accent-expense)' : 'var(--accent-income)' }}>
                  ({totalCreditUtilization.toFixed(1)}%)
                </strong>
              </span>
            </div>
            <div className="progress-bar-bg" style={{ height: '8px' }}>
              <div
                className="progress-bar-fill"
                style={{
                  width: `${Math.min(100, totalCreditUtilization)}%`,
                  background:
                    totalCreditUtilization > 50
                      ? 'linear-gradient(90deg, #f43f5e 0%, #e11d48 100%)'
                      : 'linear-gradient(90deg, #8b5cf6 0%, #10b981 100%)'
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div className="auth-tabs-switcher" style={{ margin: 0, minWidth: '320px', gridTemplateColumns: 'repeat(5, 1fr)' }}>
          <button
            className={`auth-tab-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All ({credits.length})
          </button>
          <button
            className={`auth-tab-btn ${activeFilter === 'borrowing' ? 'active' : ''}`}
            onClick={() => setActiveFilter('borrowing')}
          >
            🔴 Debit ({borrowedAccounts.length})
          </button>
          <button
            className={`auth-tab-btn ${activeFilter === 'lending' ? 'active' : ''}`}
            onClick={() => setActiveFilter('lending')}
          >
            🟢 Credit ({lendingAccounts.length})
          </button>
          <button
            className={`auth-tab-btn ${activeFilter === 'asset' ? 'active' : ''}`}
            onClick={() => setActiveFilter('asset')}
          >
            🏦 Assets ({assetAccounts.length})
          </button>
          <button
            className={`auth-tab-btn ${activeFilter === 'chitty' ? 'active' : ''}`}
            onClick={() => setActiveFilter('chitty')}
          >
            🎟️ Chitty ({chitAccounts.length})
          </button>
        </div>
      </div>

      {/* Accounts Cards Grid */}
      {filteredAccounts.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
          <HandCoins size={44} style={{ marginBottom: '12px', opacity: 0.5 }} />
          <p style={{ fontWeight: 600, fontSize: '1rem' }}>No records found under this filter.</p>
          <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>
            Click "Add Record" above to start tracking debts, receivables, assets, or chitty funds.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {filteredAccounts.map((account) => {
            const isLending = account.category === 'lending';
            const isAsset = account.category === 'asset';
            const isChitty = account.category === 'chitty';
            const isBorrowing = !isLending && !isAsset && !isChitty;

            const originalAmount = isChitty
              ? (account.chittyAmount || account.limit || account.balance)
              : (account.limit || account.balance);

            // Progress logic
            let progress = 0;
            if (isChitty) {
              const totalD = account.totalDraws || 1;
              const paidD = account.paidDraws || 0;
              progress = (paidD / totalD) * 100;
            } else if (isAsset) {
              progress = originalAmount > 0 ? ((account.balance - originalAmount) / originalAmount) * 100 : 0;
            } else {
              progress = originalAmount > 0 ? ((originalAmount - account.balance) / originalAmount) * 100 : 0;
            }

            // Badge & color logic
            let badgeClass = 'badge-expense';
            let badgeText = '🔴 BORROWING (DEBIT)';
            let balanceLabel = 'Current Debt Balance Owed';
            let balanceColor = 'var(--accent-expense)';
            let barColor = '#10b981';
            let actionLabel = 'Log Debt Paydown';
            let btnGradient = 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)';
            let topBorderColor = account.color || '#f43f5e';

            if (isLending) {
              badgeClass = 'badge-income';
              badgeText = '🟢 LENDING (CREDIT)';
              balanceLabel = 'Remaining Outstanding Owed to You';
              balanceColor = 'var(--accent-cyan)';
              barColor = '#06b6d4';
              actionLabel = 'Log Repayment Collection';
              btnGradient = 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)';
              topBorderColor = account.color || '#06b6d4';
            } else if (isAsset) {
              badgeClass = 'badge-income';
              badgeText = '🏦 ASSET (HOLDING)';
              balanceLabel = 'Current Market Value';
              balanceColor = 'var(--accent-income)';
              barColor = '#10b981';
              actionLabel = 'Update Asset Value';
              btnGradient = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
              topBorderColor = account.color || '#10b981';
            } else if (isChitty) {
              badgeClass = 'badge-credit';
              badgeText = '🎟️ CHITTY (CHIT FUND)';
              balanceLabel = 'Total Invested / Paid in Chitty';
              balanceColor = '#eab308';
              barColor = '#eab308';
              actionLabel = 'Pay Next Installment';
              btnGradient = 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)';
              topBorderColor = account.color || '#eab308';
            }

            return (
              <div
                key={account.id}
                className="glass-card"
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderTop: `4px solid ${topBorderColor}`
                }}
              >
                {/* Top Badge & Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
                      <span className={`badge ${badgeClass}`} style={isChitty ? { background: 'rgba(234, 179, 8, 0.15)', color: '#eab308', borderColor: 'rgba(234, 179, 8, 0.3)' } : {}}>
                        {badgeText}
                      </span>
                      {isAsset && account.type && (
                        <span className="badge badge-credit" style={{ fontSize: '0.65rem' }}>
                          {getTypeBadgeLabel(account)}
                        </span>
                      )}
                      {isChitty && account.prizeWon && (
                        <span className="badge badge-income" style={{ fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Trophy size={10} />
                          Prize Won ({formatCurrency(account.prizeAmount)})
                        </span>
                      )}
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{account.name}</h3>
                    {account.entity && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                        {isChitty
                          ? `Organizer: ${account.entity}`
                          : isAsset
                          ? `Custodian: ${account.entity}`
                          : isLending
                          ? `Borrower: ${account.entity}`
                          : `Creditor: ${account.entity}`}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      className="btn btn-secondary btn-icon"
                      style={{ width: '32px', height: '32px' }}
                      onClick={() => {
                        setEditingCredit(account);
                        setIsCreditModalOpen(true);
                      }}
                      title="Edit Record"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      className="btn btn-danger btn-icon"
                      style={{ width: '32px', height: '32px' }}
                      onClick={() => deleteCreditAccount(account.id)}
                      title="Delete Record"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Main Balance Display */}
                <div style={{ margin: '16px 0' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {balanceLabel}
                  </div>
                  <div
                    className="amount-font"
                    style={{
                      fontSize: '1.6rem',
                      fontWeight: 800,
                      color: balanceColor
                    }}
                  >
                    {formatCurrency(account.balance)}
                  </div>
                </div>

                {/* Progress / Growth Bar */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    <span>
                      {isChitty
                        ? `Pool Target: ${formatCurrency(originalAmount)}`
                        : isAsset
                        ? `Cost Basis: ${formatCurrency(originalAmount)}`
                        : `Original: ${formatCurrency(originalAmount)}`}
                    </span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {isChitty
                        ? `${account.paidDraws || 0}/${account.totalDraws || '—'} Draws (${Math.min(100, Math.round(progress))}%)`
                        : isAsset
                        ? (progress >= 0 ? `+${progress.toFixed(1)}% gain` : `${progress.toFixed(1)}% loss`)
                        : `${Math.max(0, progress).toFixed(0)}% cleared`}
                    </span>
                  </div>
                  <div className="progress-bar-bg" style={{ height: '6px' }}>
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${Math.min(100, Math.max(0, progress))}%`,
                        background: barColor
                      }}
                    />
                  </div>
                </div>

                {/* Info Footer Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px',
                    padding: '10px 12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.78rem',
                    marginBottom: '16px'
                  }}
                >
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {isChitty ? 'Installment / Draw:' : isAsset ? 'Return / APY:' : 'Interest APR:'}
                    </span>
                    <div style={{ fontWeight: 700 }}>
                      {isChitty
                        ? formatCurrency(account.monthlyInstallment || account.minPayment || 0)
                        : isAsset
                        ? `${account.apr || 0}% APY`
                        : `${account.apr || 0}% APR`}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {isChitty ? 'Chit Passbook #:' : isAsset ? 'Account #:' : isLending ? 'Installment:' : 'Min Monthly:'}
                    </span>
                    <div style={{ fontWeight: 700 }}>
                      {isChitty
                        ? (account.accountNumber || '—')
                        : isAsset
                        ? (account.accountNumber || '—')
                        : (account.minPayment ? formatCurrency(account.minPayment) : 'Flexible')}
                    </div>
                  </div>
                  {account.dueDate && (
                    <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', paddingTop: '4px' }}>
                      <Calendar size={13} color={isChitty ? '#eab308' : '#8b5cf6'} />
                      <span>{isChitty ? 'Next Draw Date:' : 'Due Date:'} {account.dueDate}</span>
                    </div>
                  )}
                </div>

                {/* Chitty Prize Won / Bidding Status Box */}
                {isChitty && (
                  <div
                    style={{
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: account.prizeWon ? 'rgba(16, 185, 129, 0.1)' : 'rgba(234, 179, 8, 0.08)',
                      border: `1px solid ${account.prizeWon ? 'rgba(16, 185, 129, 0.25)' : 'rgba(234, 179, 8, 0.2)'}`,
                      fontSize: '0.75rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '16px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Trophy size={14} color={account.prizeWon ? '#10b981' : '#eab308'} />
                      <span>
                        {account.prizeWon
                          ? `Won on Draw #${account.prizeDrawNumber || '—'}: ${formatCurrency(account.prizeAmount)}`
                          : 'Prize/Auction not yet claimed'}
                      </span>
                    </div>
                    {!account.prizeWon && (
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '3px 8px', fontSize: '0.7rem', color: '#eab308', borderColor: 'rgba(234, 179, 8, 0.4)' }}
                        onClick={() => handleOpenClaimModal(account)}
                      >
                        Claim Prize
                      </button>
                    )}
                  </div>
                )}

                {account.notes && (
                  <div
                    style={{
                      fontSize: '0.78rem',
                      color: 'var(--text-muted)',
                      marginBottom: '16px',
                      fontStyle: 'italic',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <FileText size={12} />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {account.notes}
                    </span>
                  </div>
                )}

                {/* Primary Action Button */}
                {isChitty ? (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn btn-primary"
                      style={{
                        flex: 1,
                        gap: '8px',
                        background: btnGradient,
                        color: '#000',
                        fontWeight: 700
                      }}
                      disabled={(account.paidDraws || 0) >= (account.totalDraws || 999)}
                      onClick={() => logChittyInstallment(account.id)}
                    >
                      <Coins size={16} />
                      <span>
                        {(account.paidDraws || 0) >= (account.totalDraws || 999)
                          ? 'All Draws Paid ✅'
                          : `Pay Draw #${(account.paidDraws || 0) + 1} (${formatCurrency(account.monthlyInstallment || account.minPayment || 0)})`}
                      </span>
                    </button>
                  </div>
                ) : isAsset ? (
                  <button
                    className="btn btn-primary"
                    style={{
                      width: '100%',
                      gap: '8px',
                      background: btnGradient
                    }}
                    onClick={() => {
                      setEditingCredit(account);
                      setIsCreditModalOpen(true);
                    }}
                  >
                    <TrendingUp size={16} />
                    <span>{actionLabel}</span>
                  </button>
                ) : (
                  <button
                    className="btn btn-primary"
                    style={{
                      width: '100%',
                      gap: '8px',
                      background: btnGradient
                    }}
                    onClick={() => {
                      setSelectedCreditForPay(account);
                      setIsPaymentModalOpen(true);
                    }}
                  >
                    <Sparkles size={16} />
                    <span>{actionLabel}</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Claim Chitty Prize Modal */}
      {claimModalAccount && (
        <div className="modal-overlay" onClick={() => setClaimModalAccount(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Trophy size={20} />
                </div>
                <h3 className="modal-title">Record Prize / Auction Won</h3>
              </div>
              <button className="btn btn-secondary btn-icon" onClick={() => setClaimModalAccount(null)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleClaimSubmit}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Record prize/auction money won for <strong>{claimModalAccount.name}</strong>. This will mark the prize as won and automatically add an investment income transaction.
              </p>

              <div className="form-group">
                <label className="form-label">Prize / Auction Amount Received *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="e.g. 42000"
                  value={claimPrizeAmount}
                  onChange={(e) => setClaimPrizeAmount(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Won on Draw Number (#) *</label>
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="e.g. 8"
                  value={claimDrawNumber}
                  onChange={(e) => setClaimDrawNumber(e.target.value)}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setClaimModalAccount(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  }}
                >
                  <CheckCircle2 size={18} />
                  <span>Claim Prize</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
