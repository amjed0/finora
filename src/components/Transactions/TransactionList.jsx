import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { CATEGORIES } from '../../constants/initialData';
import {
  Search,
  Filter,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Edit2,
  Trash2,
  Download,
  Calendar
} from 'lucide-react';

export default function TransactionList() {
  const {
    transactions,
    deleteTransaction,
    setEditingTx,
    setIsTxModalOpen,
    formatCurrency
  } = useFinance();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // all | income | expense
  const [catFilter, setCatFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, amount-desc

  // Filter logic
  const filtered = transactions.filter((tx) => {
    // Type Filter
    if (typeFilter !== 'all' && tx.type !== typeFilter) return false;

    // Category Filter
    if (catFilter !== 'all' && tx.category !== catFilter) return false;

    // Search Filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchDesc = tx.description?.toLowerCase().includes(q);
      const matchNotes = tx.notes?.toLowerCase().includes(q);
      const matchMethod = tx.paymentMethod?.toLowerCase().includes(q);
      if (!matchDesc && !matchNotes && !matchMethod) return false;
    }

    return true;
  });

  // Sort logic
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
    if (sortBy === 'amount-desc') return b.amount - a.amount;
    return 0;
  });

  const getCategoryInfo = (type, catId) => {
    const catList = type === 'income' ? CATEGORIES.income : CATEGORIES.expense;
    return catList.find((c) => c.id === catId) || { name: catId, color: '#94a3b8' };
  };

  const exportCSV = () => {
    const headers = ['ID,Date,Type,Description,Amount,Category,PaymentMethod,Notes'];
    const rows = filtered.map(
      (t) =>
        `"${t.id}","${t.date}","${t.type}","${t.description.replace(/"/g, '""')}",${t.amount},"${t.category}","${t.paymentMethod || ''}","${(t.notes || '').replace(/"/g, '""')}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `finora_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
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
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Incomes & Expenses Ledger</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Showing {sorted.length} recorded entries
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            className="btn btn-secondary"
            onClick={exportCSV}
            title="Export filtered transactions to CSV"
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingTx(null);
              setIsTxModalOpen(true);
            }}
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
          >
            <Plus size={16} />
            <span>Add Entry</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '12px',
          marginBottom: '24px',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)'
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '36px' }}
          />
        </div>

        {/* Type Selector */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="form-select"
        >
          <option value="all">All Types</option>
          <option value="income">🟢 Income Only</option>
          <option value="expense">🔴 Expense Only</option>
        </select>

        {/* Category Selector */}
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="form-select"
        >
          <option value="all">All Categories</option>
          <optgroup label="Expenses">
            {CATEGORIES.expense.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </optgroup>
          <optgroup label="Incomes">
            {CATEGORIES.income.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </optgroup>
        </select>

        {/* Sort By */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="form-select"
        >
          <option value="date-desc">Date (Newest First)</option>
          <option value="date-asc">Date (Oldest First)</option>
          <option value="amount-desc">Amount (Highest First)</option>
        </select>
      </div>

      {/* Transactions Table / List */}
      {sorted.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
          <Filter size={36} style={{ marginBottom: '12px', opacity: 0.5 }} />
          <p style={{ fontWeight: 600 }}>No transactions match your filters.</p>
          <p style={{ fontSize: '0.85rem' }}>Try clearing filters or adding a new record.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {sorted.map((tx) => {
            const catInfo = getCategoryInfo(tx.type, tx.category);
            const isIncome = tx.type === 'income';

            return (
              <div
                key={tx.id}
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '220px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: isIncome ? 'var(--accent-income-bg)' : 'var(--accent-expense-bg)',
                      color: isIncome ? 'var(--accent-income)' : 'var(--accent-expense)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {isIncome ? <ArrowDownLeft size={22} /> : <ArrowUpRight size={22} />}
                  </div>

                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{tx.description}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: `${catInfo.color}22`,
                          color: catInfo.color,
                          fontWeight: 600
                        }}
                      >
                        {catInfo.name}
                      </span>
                      {tx.paymentMethod && <span>• {tx.paymentMethod}</span>}
                      <span>• <Calendar size={12} style={{ verticalAlign: 'middle' }} /> {tx.date}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div
                    className={`amount-font ${isIncome ? 'text-income' : 'text-expense'}`}
                    style={{ fontSize: '1.1rem', fontWeight: 700 }}
                  >
                    {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      className="btn btn-secondary btn-icon"
                      style={{ width: '36px', height: '36px' }}
                      onClick={() => {
                        setEditingTx(tx);
                        setIsTxModalOpen(true);
                      }}
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="btn btn-danger btn-icon"
                      style={{ width: '36px', height: '36px' }}
                      onClick={() => deleteTransaction(tx.id)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
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
