import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Landmark, TrendingUp, ShieldCheck, PieChart, ArrowUpRight } from 'lucide-react';

const ASSET_TYPE_LABELS = {
  investment: { label: 'Stocks & Investments', color: '#10b981', icon: '📈' },
  savings: { label: 'Savings & High Yield', color: '#3b82f6', icon: '🏦' },
  property: { label: 'Real Estate & Property', color: '#8b5cf6', icon: '🏠' },
  crypto: { label: 'Crypto & Digital Assets', color: '#f59e0b', icon: '⚡' },
  vehicle: { label: 'Vehicles & Tangible', color: '#ec4899', icon: '🚗' },
  other_asset: { label: 'Other Holdings', color: '#06b6d4', icon: '💎' }
};

export default function AssetAllocationChart() {
  const { credits, totalAssetBalance, totalLentBalance, totalBorrowedBalance, netWorth, formatCurrency } = useFinance();

  const assetAccounts = credits.filter((c) => c.category === 'asset');

  // Group assets by type
  const typeTotals = {};
  assetAccounts.forEach((acc) => {
    const typeKey = acc.type || 'other_asset';
    typeTotals[typeKey] = (typeTotals[typeKey] || 0) + Number(acc.balance || 0);
  });

  const sortedTypes = Object.entries(typeTotals).sort((a, b) => b[1] - a[1]);

  return (
    <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Landmark size={18} color="#10b981" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Asset Allocation & Net Worth</h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Holdings breakdown and overall financial portfolio stance
            </p>
          </div>
          <div className="badge badge-income" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={13} />
            <span>Net Worth: {formatCurrency(netWorth)}</span>
          </div>
        </div>

        {/* Net Worth Equation Bar */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            marginBottom: '20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            textAlign: 'center'
          }}
        >
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Total Assets</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-income)' }}>
              {formatCurrency(totalAssetBalance)}
            </div>
          </div>
          <div style={{ borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Receivables (Lent)</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
              +{formatCurrency(totalLentBalance)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Liabilities (Debts)</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-expense)' }}>
              -{formatCurrency(totalBorrowedBalance)}
            </div>
          </div>
        </div>

        {/* Breakdown progress list */}
        {sortedTypes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
            No assets registered yet. Add assets in Borrowing & Lending tab.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {sortedTypes.map(([typeKey, amount]) => {
              const info = ASSET_TYPE_LABELS[typeKey] || { label: typeKey, color: '#10b981', icon: '💰' };
              const pct = totalAssetBalance > 0 ? (amount / totalAssetBalance) * 100 : 0;

              return (
                <div key={typeKey}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{info.icon}</span>
                      <span>{info.label}</span>
                    </div>
                    <div>
                      <span>{formatCurrency(amount)}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
                        ({pct.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <div className="progress-bar-bg" style={{ height: '7px' }}>
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${pct}%`,
                        background: info.color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Asset highlight footer */}
      {assetAccounts.length > 0 && (
        <div
          style={{
            marginTop: '20px',
            paddingTop: '12px',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.78rem',
            color: 'var(--text-secondary)'
          }}
        >
          <span>Top Asset: <strong style={{ color: 'var(--text-primary)' }}>{assetAccounts[0]?.name}</strong> ({formatCurrency(assetAccounts[0]?.balance)})</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontWeight: 600 }}>
            {assetAccounts.length} asset(s) tracked <ArrowUpRight size={14} />
          </span>
        </div>
      )}
    </div>
  );
}
