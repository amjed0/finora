import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { ShieldCheck, AlertCircle, CheckCircle2, Lightbulb } from 'lucide-react';

export default function FinancialHealthScore() {
  const { totalIncome, totalExpense, totalDebtBalance, totalCreditUtilization, totalAssetBalance, netWorth } = useFinance();

  // Score Calculation
  let score = 50; // default base

  // 1. Savings Rate (Income vs Expense)
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
  if (savingsRate >= 30) score += 20;
  else if (savingsRate >= 15) score += 10;
  else if (savingsRate >= 0) score += 5;
  else score -= 15;

  // 2. Credit Utilization Rate (< 30% is ideal)
  if (totalCreditUtilization < 15) score += 15;
  else if (totalCreditUtilization <= 30) score += 10;
  else if (totalCreditUtilization <= 50) score += 5;
  else score -= 10;

  // 3. Asset & Net Worth Health (Assets vs Liabilities)
  if (totalAssetBalance > 0 && totalDebtBalance === 0) score += 15;
  else if (totalAssetBalance > totalDebtBalance) score += 15;
  else if (totalAssetBalance > 0) score += 5;

  // Clamp 10 to 100
  const finalScore = Math.max(10, Math.min(100, Math.round(score)));

  const getScoreColor = () => {
    if (finalScore >= 80) return '#10b981'; // Excellent green
    if (finalScore >= 60) return '#06b6d4'; // Good cyan
    if (finalScore >= 40) return '#facc15'; // Warning yellow
    return '#f43f5e'; // Danger red
  };

  const getScoreText = () => {
    if (finalScore >= 80) return 'Excellent Health';
    if (finalScore >= 60) return 'Good Financial Standing';
    if (finalScore >= 40) return 'Moderate - Action Needed';
    return 'Attention Required';
  };

  const tips = [];
  if (totalAssetBalance < totalDebtBalance) {
    tips.push('Consider building asset reserves to comfortably cover outstanding debt.');
  } else if (savingsRate < 20) {
    tips.push('Aim to save at least 20% of net income every month.');
  } else if (totalCreditUtilization > 30) {
    tips.push('Pay down high-APR credit cards to bring utilization below 30%.');
  } else {
    tips.push('Your net worth and asset allocation are in strong standing!');
  }

  return (
    <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Financial Health Index</h3>
        <ShieldCheck size={20} color={getScoreColor()} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', margin: 'auto 0' }}>
        {/* Circle Score Display */}
        <div
          style={{
            position: 'relative',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: `conic-gradient(${getScoreColor()} ${finalScore * 3.6}deg, rgba(255,255,255,0.1) 0deg)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <div
            style={{
              width: '78px',
              height: '78px',
              borderRadius: '50%',
              background: 'var(--bg-secondary)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: getScoreColor() }}>
              {finalScore}
            </span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>out of 100</span>
          </div>
        </div>

        <div>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: getScoreColor() }}>
            {getScoreText()}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Savings Rate: <strong>{savingsRate.toFixed(1)}%</strong>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Credit Utilization: <strong>{totalCreditUtilization.toFixed(1)}%</strong>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: '16px',
          padding: '12px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-color)',
          fontSize: '0.78rem',
          color: 'var(--text-secondary)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#facc15', marginBottom: '4px' }}>
          <Lightbulb size={15} />
          <span>Smart Advisor Insight:</span>
        </div>
        <div>{tips[0]}</div>
      </div>
    </div>
  );
}
