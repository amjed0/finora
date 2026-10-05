import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {
  INITIAL_TRANSACTIONS,
  INITIAL_CREDITS,
  INITIAL_BUDGETS,
  INITIAL_GOALS,
  CURRENCIES
} from '../constants/initialData';
import { api } from '../services/api';

const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const { currentUser } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [credits, setCredits] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);

  const [currency, setCurrency] = useState(() => {
    const saved = localStorage.getItem('finora_currency');
    return saved ? JSON.parse(saved) : CURRENCIES[0];
  });

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('finora_theme');
    return saved || 'dark';
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Modal states
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [editingCredit, setEditingCredit] = useState(null);
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedCreditForPay, setSelectedCreditForPay] = useState(null);

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [mongoConnected, setMongoConnected] = useState(false);

  // Fetch all data from MongoDB server
  const fetchFromServer = async (userId) => {
    if (!userId) return;
    try {
      const [dbTx, dbCredits, dbBudgets, dbGoals] = await Promise.all([
        api.getTransactions(userId).catch(() => null),
        api.getCredits(userId).catch(() => null),
        api.getBudgets(userId).catch(() => null),
        api.getGoals(userId).catch(() => null)
      ]);

      if (dbTx && Array.isArray(dbTx)) {
        setTransactions(dbTx.map(t => ({ ...t, id: t._id || t.id })));
      }
      if (dbCredits && Array.isArray(dbCredits)) {
        setCredits(dbCredits.map(c => ({ ...c, id: c._id || c.id })));
      }
      if (dbBudgets && Array.isArray(dbBudgets)) {
        setBudgets(dbBudgets.map(b => ({ ...b, id: b._id || b.id, monthlyLimit: b.limit || b.monthlyLimit })));
      }
      if (dbGoals && Array.isArray(dbGoals)) {
        setGoals(dbGoals.map(g => ({ ...g, id: g._id || g.id })));
      }
    } catch (e) {
      console.warn('Server sync failed, using local data:', e.message);
    }
  };

  // Load User Data whenever currentUser changes
  useEffect(() => {
    if (!currentUser) {
      setTransactions([]);
      setCredits([]);
      setBudgets([]);
      setGoals([]);
      return;
    }

    const userId = currentUser.id;
    const isDemo = userId === 'usr_demo_123' || currentUser.email === 'alex@finora.io';

    // Load from localStorage first (instant display)
    const savedTx = localStorage.getItem(`finora_tx_${userId}`);
    const savedCredits = localStorage.getItem(`finora_credits_${userId}`);
    const savedBudgets = localStorage.getItem(`finora_budgets_${userId}`);
    const savedGoals = localStorage.getItem(`finora_goals_${userId}`);

    if (savedTx !== null) {
      setTransactions(JSON.parse(savedTx));
    } else {
      setTransactions(isDemo ? INITIAL_TRANSACTIONS : []);
    }

    if (savedCredits !== null) {
      setCredits(JSON.parse(savedCredits));
    } else {
      setCredits(isDemo ? INITIAL_CREDITS : []);
    }

    if (savedBudgets !== null) {
      setBudgets(JSON.parse(savedBudgets));
    } else {
      setBudgets(isDemo ? INITIAL_BUDGETS : []);
    }

    if (savedGoals !== null) {
      setGoals(JSON.parse(savedGoals));
    } else {
      setGoals(isDemo ? INITIAL_GOALS : []);
    }

    // Then fetch latest from MongoDB (overrides localStorage with fresh server data)
    fetchFromServer(userId);
  }, [currentUser?.id]);

  // Auto-sync: Poll server every 30 seconds for live cross-device updates
  useEffect(() => {
    if (!currentUser?.id) return;

    const intervalId = setInterval(() => {
      fetchFromServer(currentUser.id);
    }, 30000); // 30 seconds

    return () => clearInterval(intervalId);
  }, [currentUser?.id]);

  // Instant sync when user switches back to tab (e.g., from desktop to mobile)
  useEffect(() => {
    if (!currentUser?.id) return;

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchFromServer(currentUser.id);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    // Also sync when window regains focus (covers mobile browser switching)
    window.addEventListener('focus', () => fetchFromServer(currentUser.id));

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', () => fetchFromServer(currentUser.id));
    };
  }, [currentUser?.id]);

  // Check MongoDB Backend Health on mount
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'ok') {
          setMongoConnected(true);
          console.log('✅ Connected to MongoDB Backend Express Server');
        }
      })
      .catch(() => {
        setMongoConnected(false);
        console.log('ℹ️ Running in Local Storage Mode (MongoDB server inactive or offline)');
      });
  }, []);

  // Sync to LocalStorage for current user
  useEffect(() => {
    if (currentUser?.id) {
      localStorage.setItem(`finora_tx_${currentUser.id}`, JSON.stringify(transactions));
    }
  }, [transactions, currentUser?.id]);

  useEffect(() => {
    if (currentUser?.id) {
      localStorage.setItem(`finora_credits_${currentUser.id}`, JSON.stringify(credits));
    }
  }, [credits, currentUser?.id]);

  useEffect(() => {
    if (currentUser?.id) {
      localStorage.setItem(`finora_budgets_${currentUser.id}`, JSON.stringify(budgets));
    }
  }, [budgets, currentUser?.id]);

  useEffect(() => {
    if (currentUser?.id) {
      localStorage.setItem(`finora_goals_${currentUser.id}`, JSON.stringify(goals));
    }
  }, [goals, currentUser?.id]);

  useEffect(() => {
    localStorage.setItem('finora_currency', JSON.stringify(currency));
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('finora_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
    } else {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');
    }
  }, [theme]);

  // Calculations
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netBalance = totalIncome - totalExpense;

  // Portfolio & Asset Calculations
  const borrowedAccounts = credits.filter((c) => c.category === 'borrowing' || (!c.category && c.category !== 'lending' && c.category !== 'asset'));
  const lendingAccounts = credits.filter((c) => c.category === 'lending');
  const assetAccounts = credits.filter((c) => c.category === 'asset');

  const totalBorrowedBalance = borrowedAccounts.reduce((sum, c) => sum + Number(c.balance), 0);
  const totalLentBalance = lendingAccounts.reduce((sum, c) => sum + Number(c.balance), 0);
  const totalAssetBalance = assetAccounts.reduce((sum, c) => sum + Number(c.balance), 0);
  const totalAssetsCombined = totalAssetBalance + totalLentBalance;
  // Net Worth includes Net Cash Balance (Incomes - Expenses) + Assets + Money Lent - Debts
  const netWorth = netBalance + totalAssetsCombined - totalBorrowedBalance;

  const totalCreditLimit = borrowedAccounts.reduce((sum, c) => sum + Number(c.limit || 0), 0);
  const totalCreditUtilization = totalCreditLimit > 0 ? (totalBorrowedBalance / totalCreditLimit) * 100 : 0;
  const netBorrowLendPosition = totalLentBalance - totalBorrowedBalance;

  // Actions
  const addTransaction = async (txData) => {
    const userId = currentUser?.id || 'default_user';
    const newTx = {
      ...txData,
      userId,
      id: txData.id || `tx-${Date.now()}`,
      amount: parseFloat(txData.amount)
    };

    setTransactions((prev) => [newTx, ...prev]);

    try {
      const saved = await api.addTransaction(newTx);
      if (saved && (saved._id || saved.id)) {
        const mongoId = saved._id || saved.id;
        setTransactions((prev) =>
          prev.map((t) => (t.id === newTx.id ? { ...t, id: mongoId, _id: mongoId } : t))
        );
      }
    } catch (e) {
      console.warn('Saved transaction to local storage (MongoDB sync optional):', e.message);
    }

    // If it's a debt payment, optional reduce credit balance
    if (txData.type === 'expense' && txData.category === 'debt_payment' && txData.creditAccountId) {
      logCreditPayment(txData.creditAccountId, txData.amount);
    }
  };

  const updateTransaction = async (id, txData) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...txData, amount: parseFloat(txData.amount) } : t))
    );

    try {
      await api.updateTransaction(id, txData);
    } catch (e) {
      console.warn('Updated transaction in local state (MongoDB sync optional):', e.message);
    }
  };

  const deleteTransaction = async (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));

    try {
      await api.deleteTransaction(id);
    } catch (e) {
      console.warn('Deleted transaction from local state (MongoDB sync optional):', e.message);
    }
  };

  const addCreditAccount = async (creditData) => {
    const userId = currentUser?.id || 'default_user';
    const newCredit = {
      ...creditData,
      userId,
      id: creditData.id || `crd-${Date.now()}`,
      category: creditData.category || 'borrowing',
      balance: parseFloat(creditData.balance),
      limit: parseFloat(creditData.limit || creditData.balance),
      apr: parseFloat(creditData.apr || 0),
      minPayment: parseFloat(creditData.minPayment || 0)
    };

    setCredits((prev) => [...prev, newCredit]);

    try {
      const saved = await api.addCredit(newCredit);
      if (saved && (saved._id || saved.id)) {
        const mongoId = saved._id || saved.id;
        setCredits((prev) =>
          prev.map((c) => (c.id === newCredit.id ? { ...c, id: mongoId, _id: mongoId } : c))
        );
      }
    } catch (e) {
      console.warn('Saved credit account locally:', e.message);
    }
  };

  const updateCreditAccount = async (id, creditData) => {
    const updatedObj = {
      ...creditData,
      category: creditData.category || 'borrowing',
      balance: parseFloat(creditData.balance),
      limit: parseFloat(creditData.limit || creditData.balance),
      apr: parseFloat(creditData.apr || 0),
      minPayment: parseFloat(creditData.minPayment || 0)
    };

    setCredits((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedObj } : c))
    );

    try {
      await api.updateCredit(id, updatedObj);
    } catch (e) {
      console.warn('Updated credit account locally:', e.message);
    }
  };

  const deleteCreditAccount = async (id) => {
    setCredits((prev) => prev.filter((c) => c.id !== id));

    try {
      await api.deleteCredit(id);
    } catch (e) {
      console.warn('Deleted credit account locally:', e.message);
    }
  };

  const logCreditPayment = (creditId, amount, customNotes = '') => {
    const payAmt = parseFloat(amount);
    const targetCredit = credits.find((c) => c.id === creditId);
    if (!targetCredit) return;

    const isLending = targetCredit.category === 'lending';
    const newBal = Math.max(0, targetCredit.balance - payAmt);

    updateCreditAccount(creditId, { ...targetCredit, balance: newBal });

    // Auto record transaction
    if (isLending) {
      addTransaction({
        description: `Collection from ${targetCredit.entity || targetCredit.name}`,
        amount: payAmt,
        type: 'income',
        category: 'other_inc',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'Bank Transfer'
      });
    } else {
      addTransaction({
        description: `Payment to ${targetCredit.name}`,
        amount: payAmt,
        type: 'expense',
        category: 'debt_payment',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'Bank Transfer'
      });
    }
  };

  const setBudgetLimit = async (category, limit) => {
    const userId = currentUser?.id || 'default_user';
    const numLimit = parseFloat(limit);

    setBudgets((prev) => {
      const exists = prev.find((b) => b.category === category);
      if (exists) {
        return prev.map((b) => (b.category === category ? { ...b, monthlyLimit: numLimit } : b));
      }
      return [...prev, { id: `bgt-${Date.now()}`, category, monthlyLimit: numLimit }];
    });

    try {
      await api.addBudget({ userId, category, limit: numLimit });
    } catch (e) {
      console.warn('Saved budget limit locally:', e.message);
    }
  };

  const addGoal = async (goalData) => {
    const userId = currentUser?.id || 'default_user';
    const newGoal = {
      ...goalData,
      userId,
      id: goalData.id || `gl-${Date.now()}`,
      targetAmount: parseFloat(goalData.targetAmount),
      currentAmount: parseFloat(goalData.currentAmount || 0)
    };

    setGoals((prev) => [...prev, newGoal]);

    try {
      const saved = await api.addGoal(newGoal);
      if (saved && (saved._id || saved.id)) {
        const mongoId = saved._id || saved.id;
        setGoals((prev) =>
          prev.map((g) => (g.id === newGoal.id ? { ...g, id: mongoId, _id: mongoId } : g))
        );
      }
    } catch (e) {
      console.warn('Saved goal locally:', e.message);
    }
  };

  const updateGoal = async (id, goalData) => {
    const updated = {
      ...goalData,
      targetAmount: parseFloat(goalData.targetAmount),
      currentAmount: parseFloat(goalData.currentAmount)
    };

    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updated } : g))
    );

    try {
      await api.updateGoal(id, updated);
    } catch (e) {
      console.warn('Updated goal locally:', e.message);
    }
  };

  const depositToGoal = async (id, amount) => {
    const numAmt = parseFloat(amount);
    const targetGoal = goals.find((g) => g.id === id);
    if (!targetGoal) return;

    const newAmt = targetGoal.currentAmount + numAmt;
    updateGoal(id, { ...targetGoal, currentAmount: newAmt });
  };

  const deleteGoal = async (id) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));

    try {
      await api.deleteGoal(id);
    } catch (e) {
      console.warn('Deleted goal locally:', e.message);
    }
  };

  const loadDemoData = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    setCredits(INITIAL_CREDITS);
    setBudgets(INITIAL_BUDGETS);
    setGoals(INITIAL_GOALS);
  };

  const clearAllData = () => {
    setTransactions([]);
    setCredits([]);
    setBudgets([]);
    setGoals([]);
  };

  const formatCurrency = (val) => {
    const num = Number(val) || 0;
    return `${currency.symbol}${num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        credits,
        budgets,
        goals,
        currency,
        setCurrency,
        theme,
        setTheme,
        activeTab,
        setActiveTab,
        mongoConnected,
        
        // Calculated Stats
        totalIncome,
        totalExpense,
        netBalance,
        totalDebtBalance: totalBorrowedBalance, // alias for backwards compatibility
        totalBorrowedBalance,
        totalLentBalance,
        totalAssetBalance,
        totalAssetsCombined,
        netWorth,
        netBorrowLendPosition,
        totalCreditLimit,
        totalCreditUtilization,
        formatCurrency,

        // Actions
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addCreditAccount,
        updateCreditAccount,
        deleteCreditAccount,
        logCreditPayment,
        setBudgetLimit,
        addGoal,
        updateGoal,
        depositToGoal,
        deleteGoal,
        loadDemoData,
        clearAllData,

        // Modals
        isTxModalOpen,
        setIsTxModalOpen,
        editingTx,
        setEditingTx,
        isCreditModalOpen,
        setIsCreditModalOpen,
        editingCredit,
        setEditingCredit,
        isPaymentModalOpen,
        setIsPaymentModalOpen,
        selectedCreditForPay,
        setSelectedCreditForPay,
        isGoalModalOpen,
        setIsGoalModalOpen,
        editingGoal,
        setEditingGoal,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => useContext(FinanceContext);
