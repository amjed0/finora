import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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

  // Undo / Redo history state
  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);
  const [undoRedoToast, setUndoRedoToast] = useState(null);

  const stateRef = useRef({
    transactions: [],
    credits: [],
    budgets: [],
    goals: []
  });

  const isBatchingRef = useRef(false);
  const isPerformingUndoRedoRef = useRef(false);
  const lastLocalMutationTime = useRef(0);

  // Keep stateRef continuously updated with present state
  useEffect(() => {
    stateRef.current = { transactions, credits, budgets, goals };
  }, [transactions, credits, budgets, goals]);

  // Auto-dismiss undo/redo toast notification after 2.5s
  useEffect(() => {
    if (!undoRedoToast) return;
    const timer = setTimeout(() => {
      setUndoRedoToast(null);
    }, 2500);
    return () => clearTimeout(timer);
  }, [undoRedoToast]);

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
    // Don't let background poll clobber immediate local mutations or undo/redo
    if (Date.now() - lastLocalMutationTime.current < 4000) return;
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
    setPast([]);
    setFuture([]);
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

  // Auto-sync: Poll server every 5 seconds for live cross-device updates
  useEffect(() => {
    if (!currentUser?.id) return;

    const intervalId = setInterval(() => {
      fetchFromServer(currentUser.id);
    }, 5000); // 5 seconds — near-instant live sync

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
  const borrowedAccounts = credits.filter((c) => c.category === 'borrowing' || (!c.category && c.category !== 'lending' && c.category !== 'asset' && c.category !== 'chitty'));
  const lendingAccounts = credits.filter((c) => c.category === 'lending');
  const assetAccounts = credits.filter((c) => c.category === 'asset');
  const chittyAccounts = credits.filter((c) => c.category === 'chitty');

  const totalBorrowedBalance = borrowedAccounts.reduce((sum, c) => sum + Number(c.balance || 0), 0);
  const totalLentBalance = lendingAccounts.reduce((sum, c) => sum + Number(c.balance || 0), 0);
  const totalAssetBalance = assetAccounts.reduce((sum, c) => sum + Number(c.balance || 0), 0);
  const totalChittyBalance = chittyAccounts.reduce((sum, c) => sum + (c.prizeWon ? 0 : Number(c.balance || 0)), 0);
  const totalChittyPool = chittyAccounts.reduce((sum, c) => sum + Number(c.chittyAmount || c.limit || 0), 0);

  // totalLentBalance is included as a receivable asset:
  // when you lend money, an expense tx reduces netBalance (cashflow decreases),
  // and the lent amount appears here as an asset — they cancel out in net worth.
  // When repaid: income tx restores netBalance, lent balance drops to 0 — net worth unchanged.
  const totalAssetsCombined = totalAssetBalance + totalLentBalance + totalChittyBalance;
  // Net Worth = Cash Balance (income − expense) + Assets + Lent (Receivable) + Chitty − Debts
  const netWorth = netBalance + totalAssetsCombined - totalBorrowedBalance;

  const totalCreditLimit = borrowedAccounts.reduce((sum, c) => sum + Number(c.limit || 0), 0);
  const totalCreditUtilization = totalCreditLimit > 0 ? (totalBorrowedBalance / totalCreditLimit) * 100 : 0;
  const netBorrowLendPosition = totalLentBalance - totalBorrowedBalance;

  // Diff and sync changes to server when undo/redo occurs
  const syncDiffToServer = async (current, target) => {
    if (!currentUser?.id) return;
    const userId = currentUser.id;

    try {
      // 1. Transactions Diff
      const txToRemove = current.transactions.filter(
        (c) => !target.transactions.some((t) => (t._id || t.id) === (c._id || c.id))
      );
      for (const t of txToRemove) {
        api.deleteTransaction(t._id || t.id).catch(() => {});
      }
      const txToAdd = target.transactions.filter(
        (t) => !current.transactions.some((c) => (c._id || c.id) === (t._id || t.id))
      );
      for (const t of txToAdd) {
        api.addTransaction(t).catch(() => {});
      }
      const txToUpdate = target.transactions.filter((t) => {
        const matching = current.transactions.find((c) => (c._id || c.id) === (t._id || t.id));
        return matching && JSON.stringify(matching) !== JSON.stringify(t);
      });
      for (const t of txToUpdate) {
        api.updateTransaction(t._id || t.id, t).catch(() => {});
      }

      // 2. Credits Diff
      const creditsToRemove = current.credits.filter(
        (c) => !target.credits.some((t) => (t._id || t.id) === (c._id || c.id))
      );
      for (const c of creditsToRemove) {
        api.deleteCredit(c._id || c.id).catch(() => {});
      }
      const creditsToAdd = target.credits.filter(
        (t) => !current.credits.some((c) => (c._id || c.id) === (t._id || t.id))
      );
      for (const c of creditsToAdd) {
        api.addCredit(c).catch(() => {});
      }
      const creditsToUpdate = target.credits.filter((t) => {
        const matching = current.credits.find((c) => (c._id || c.id) === (t._id || t.id));
        return matching && JSON.stringify(matching) !== JSON.stringify(t);
      });
      for (const c of creditsToUpdate) {
        api.updateCredit(c._id || c.id, c).catch(() => {});
      }

      // 3. Goals Diff
      const goalsToRemove = current.goals.filter(
        (c) => !target.goals.some((t) => (t._id || t.id) === (c._id || c.id))
      );
      for (const g of goalsToRemove) {
        api.deleteGoal(g._id || g.id).catch(() => {});
      }
      const goalsToAdd = target.goals.filter(
        (t) => !current.goals.some((c) => (c._id || c.id) === (t._id || t.id))
      );
      for (const g of goalsToAdd) {
        api.addGoal(g).catch(() => {});
      }
      const goalsToUpdate = target.goals.filter((t) => {
        const matching = current.goals.find((c) => (c._id || c.id) === (t._id || t.id));
        return matching && JSON.stringify(matching) !== JSON.stringify(t);
      });
      for (const g of goalsToUpdate) {
        api.updateGoal(g._id || g.id, g).catch(() => {});
      }

      // 4. Budgets
      for (const b of target.budgets) {
        api.addBudget({ userId, category: b.category, limit: b.monthlyLimit || b.limit }).catch(() => {});
      }
    } catch (e) {
      // Server sync error tolerated in local-fallback mode
    }
  };

  // Record history snapshot before user mutations
  const recordAction = (actionName) => {
    if (isPerformingUndoRedoRef.current || isBatchingRef.current) {
      return false;
    }

    lastLocalMutationTime.current = Date.now();

    const snapshot = {
      transactions: [...stateRef.current.transactions],
      credits: [...stateRef.current.credits],
      budgets: [...stateRef.current.budgets],
      goals: [...stateRef.current.goals],
      action: actionName || 'Action'
    };

    setPast((prev) => {
      const next = [...prev, snapshot];
      if (next.length > 30) next.shift(); // Keep maximum 30 history states
      return next;
    });
    setFuture([]); // New action invalidates redo stack

    isBatchingRef.current = true;
    setTimeout(() => {
      isBatchingRef.current = false;
    }, 50);

    return true;
  };

  // Undo last user action
  const undo = () => {
    if (past.length === 0) return;

    isPerformingUndoRedoRef.current = true;
    lastLocalMutationTime.current = Date.now();

    const previous = past[past.length - 1];
    const newPast = past.slice(0, -1);

    const currentSnapshot = {
      transactions: [...stateRef.current.transactions],
      credits: [...stateRef.current.credits],
      budgets: [...stateRef.current.budgets],
      goals: [...stateRef.current.goals],
      action: previous.action || 'Action'
    };

    setPast(newPast);
    setFuture((prevFuture) => [...prevFuture, currentSnapshot]);

    stateRef.current = {
      transactions: previous.transactions,
      credits: previous.credits,
      budgets: previous.budgets,
      goals: previous.goals
    };

    setTransactions(previous.transactions);
    setCredits(previous.credits);
    setBudgets(previous.budgets);
    setGoals(previous.goals);

    syncDiffToServer(currentSnapshot, previous);
    setUndoRedoToast(`Undone: ${previous.action || 'last action'}`);

    setTimeout(() => {
      isPerformingUndoRedoRef.current = false;
    }, 100);
  };

  // Redo last undone action
  const redo = () => {
    if (future.length === 0) return;

    isPerformingUndoRedoRef.current = true;
    lastLocalMutationTime.current = Date.now();

    const next = future[future.length - 1];
    const newFuture = future.slice(0, -1);

    const currentSnapshot = {
      transactions: [...stateRef.current.transactions],
      credits: [...stateRef.current.credits],
      budgets: [...stateRef.current.budgets],
      goals: [...stateRef.current.goals],
      action: next.action || 'Action'
    };

    setFuture(newFuture);
    setPast((prevPast) => [...prevPast, currentSnapshot]);

    stateRef.current = {
      transactions: next.transactions,
      credits: next.credits,
      budgets: next.budgets,
      goals: next.goals
    };

    setTransactions(next.transactions);
    setCredits(next.credits);
    setBudgets(next.budgets);
    setGoals(next.goals);

    syncDiffToServer(currentSnapshot, next);
    setUndoRedoToast(`Redone: ${next.action || 'action'}`);

    setTimeout(() => {
      isPerformingUndoRedoRef.current = false;
    }, 100);
  };

  // Actions
  const addTransaction = async (txData) => {
    recordAction(txData.description ? `Added: ${txData.description}` : 'Added transaction');
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
    recordAction(txData.description ? `Edited: ${txData.description}` : 'Edited transaction');
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
    const tx = stateRef.current.transactions.find((t) => t.id === id);
    recordAction(tx?.description ? `Deleted: ${tx.description}` : 'Deleted transaction');
    setTransactions((prev) => prev.filter((t) => t.id !== id));

    try {
      await api.deleteTransaction(id);
    } catch (e) {
      console.warn('Deleted transaction from local state (MongoDB sync optional):', e.message);
    }
  };

  const addCreditAccount = async (creditData) => {
    const userId = currentUser?.id || 'default_user';
    recordAction(creditData.name ? `Added account: ${creditData.name}` : 'Added account');
    const newCredit = {
      ...creditData,
      userId,
      id: creditData.id || `crd-${Date.now()}`,
      category: creditData.category || 'borrowing',
      balance: parseFloat(creditData.balance || 0),
      limit: parseFloat(creditData.limit || creditData.chittyAmount || creditData.balance || 0),
      apr: parseFloat(creditData.apr || 0),
      minPayment: parseFloat(creditData.minPayment || creditData.monthlyInstallment || 0),
      chittyAmount: parseFloat(creditData.chittyAmount || creditData.limit || 0),
      monthlyInstallment: parseFloat(creditData.monthlyInstallment || creditData.minPayment || 0),
      totalDraws: parseInt(creditData.totalDraws || 0, 10),
      paidDraws: parseInt(creditData.paidDraws || 0, 10),
      prizeWon: Boolean(creditData.prizeWon),
      prizeAmount: parseFloat(creditData.prizeAmount || 0),
      prizeDrawNumber: parseInt(creditData.prizeDrawNumber || 0, 10),
      startDate: creditData.startDate || ''
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

    // 💡 Auto-record income tx for borrowed money (cash inflow)
    if (newCredit.category === 'borrowing' && newCredit.balance > 0) {
      addTransaction({
        description: `💰 Borrowed from ${newCredit.entity || newCredit.name}`,
        amount: newCredit.balance,
        type: 'income',
        category: 'debt_received',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'Cash',
        linkedCreditId: newCredit.id,
        notes: `Auto-recorded: Debt received — ${newCredit.name}`
      });
    }

    // 💸 Auto-record expense tx for lent money (cash outflow — reduces cashflow)
    if (newCredit.category === 'lending' && newCredit.balance > 0) {
      addTransaction({
        description: `🤝 Lent to ${newCredit.entity || newCredit.name}`,
        amount: newCredit.balance,
        type: 'expense',
        category: 'money_lent',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'Cash',
        linkedCreditId: newCredit.id,
        notes: `Auto-recorded: Money lent — ${newCredit.name}`
      });
    }
  };

  const updateCreditAccount = async (id, creditData) => {
    recordAction(creditData.name ? `Edited account: ${creditData.name}` : 'Edited account');
    const updatedObj = {
      ...creditData,
      category: creditData.category || 'borrowing',
      balance: parseFloat(creditData.balance || 0),
      limit: parseFloat(creditData.limit || creditData.chittyAmount || creditData.balance || 0),
      apr: parseFloat(creditData.apr || 0),
      minPayment: parseFloat(creditData.minPayment || creditData.monthlyInstallment || 0),
      chittyAmount: parseFloat(creditData.chittyAmount || creditData.limit || 0),
      monthlyInstallment: parseFloat(creditData.monthlyInstallment || creditData.minPayment || 0),
      totalDraws: parseInt(creditData.totalDraws || 0, 10),
      paidDraws: parseInt(creditData.paidDraws || 0, 10),
      prizeWon: Boolean(creditData.prizeWon),
      prizeAmount: parseFloat(creditData.prizeAmount || 0),
      prizeDrawNumber: parseInt(creditData.prizeDrawNumber || 0, 10),
      startDate: creditData.startDate || ''
    };

    setCredits((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedObj } : c))
    );

    // Sync linked auto-transaction if balance changed
    if (updatedObj.category === 'borrowing') {
      const linkedTx = transactions.find(
        (t) => t.linkedCreditId === id && t.category === 'debt_received'
      );
      if (linkedTx && linkedTx.amount !== updatedObj.balance) {
        updateTransaction(linkedTx.id, {
          ...linkedTx,
          amount: updatedObj.balance,
          description: `💰 Borrowed from ${updatedObj.entity || updatedObj.name}`,
          notes: `Auto-recorded: Debt received — ${updatedObj.name}`
        });
      }
    }
    if (updatedObj.category === 'lending') {
      const linkedTx = transactions.find(
        (t) => t.linkedCreditId === id && t.category === 'money_lent'
      );
      if (linkedTx && linkedTx.amount !== updatedObj.balance) {
        updateTransaction(linkedTx.id, {
          ...linkedTx,
          amount: updatedObj.balance,
          description: `🤝 Lent to ${updatedObj.entity || updatedObj.name}`,
          notes: `Auto-recorded: Money lent — ${updatedObj.name}`
        });
      }
    }

    try {
      await api.updateCredit(id, updatedObj);
    } catch (e) {
      console.warn('Updated credit account locally:', e.message);
    }
  };

  const deleteCreditAccount = async (id) => {
    // Remove the auto-generated linked transaction when credit is deleted
    const creditToDelete = credits.find((c) => c.id === id);
    recordAction(creditToDelete?.name ? `Deleted account: ${creditToDelete.name}` : 'Deleted account');
    if (creditToDelete?.category === 'borrowing') {
      const linkedTx = transactions.find(
        (t) => t.linkedCreditId === id && t.category === 'debt_received'
      );
      if (linkedTx) deleteTransaction(linkedTx.id);
    }
    if (creditToDelete?.category === 'lending') {
      const linkedTx = transactions.find(
        (t) => t.linkedCreditId === id && t.category === 'money_lent'
      );
      if (linkedTx) deleteTransaction(linkedTx.id);
    }

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
    recordAction(`Payment to ${targetCredit.name}`);

    const isLending = targetCredit.category === 'lending';
    const isChitty = targetCredit.category === 'chitty';

    if (isChitty) {
      const newPaidDraws = (targetCredit.paidDraws || 0) + 1;
      const newBal = (targetCredit.balance || 0) + payAmt;
      updateCreditAccount(creditId, {
        ...targetCredit,
        paidDraws: newPaidDraws,
        balance: newBal
      });

      addTransaction({
        description: `Chitty Installment - ${targetCredit.name} (Draw #${newPaidDraws})`,
        amount: payAmt,
        type: 'expense',
        category: 'investments',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'Bank Transfer'
      });
      return;
    }

    const newBal = Math.max(0, targetCredit.balance - payAmt);
    updateCreditAccount(creditId, { ...targetCredit, balance: newBal });

    // Auto record transaction
    if (isLending) {
      // 💚 Money returned — add as income to restore cashflow
      addTransaction({
        description: `✅ Loan repaid by ${targetCredit.entity || targetCredit.name}`,
        amount: payAmt,
        type: 'income',
        category: 'loan_repaid',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'Bank Transfer',
        notes: `Repayment received for: ${targetCredit.name}`
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

  const logChittyInstallment = (creditId) => {
    const target = credits.find((c) => c.id === creditId);
    if (!target) return;
    const installmentAmt = target.monthlyInstallment || target.minPayment || (target.totalDraws > 0 ? (target.chittyAmount || target.limit) / target.totalDraws : 0);
    const newPaidDraws = (target.paidDraws || 0) + 1;
    const newBal = (target.balance || 0) + installmentAmt;

    updateCreditAccount(creditId, {
      ...target,
      paidDraws: newPaidDraws,
      balance: newBal
    });

    addTransaction({
      description: `Chitty Draw #${newPaidDraws} Paid - ${target.name}`,
      amount: installmentAmt,
      type: 'expense',
      category: 'investments',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Bank Transfer'
    });
  };

  const claimChittyPrize = (creditId, prizeAmount, drawNumber) => {
    const target = credits.find((c) => c.id === creditId);
    if (!target) return;
    const wonAmt = parseFloat(prizeAmount || target.chittyAmount || target.limit || 0);

    updateCreditAccount(creditId, {
      ...target,
      prizeWon: true,
      prizeAmount: wonAmt,
      prizeDrawNumber: parseInt(drawNumber || target.paidDraws || 1, 10)
    });

    addTransaction({
      description: `🏆 Chitty Prize Won - ${target.name}`,
      amount: wonAmt,
      type: 'income',
      category: 'investments',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Bank Transfer'
    });
  };

  const setBudgetLimit = async (category, limit) => {
    const userId = currentUser?.id || 'default_user';
    const numLimit = parseFloat(limit);
    recordAction(`Budget: ${category}`);

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
    recordAction(goalData.name ? `Added goal: ${goalData.name}` : 'Added goal');
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
    recordAction(goalData.name ? `Edited goal: ${goalData.name}` : 'Edited goal');
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
    const g = stateRef.current.goals.find((g) => g.id === id);
    recordAction(g?.name ? `Deleted goal: ${g.name}` : 'Deleted goal');
    setGoals((prev) => prev.filter((g) => g.id !== id));

    try {
      await api.deleteGoal(id);
    } catch (e) {
      console.warn('Deleted goal locally:', e.message);
    }
  };

  const loadDemoData = () => {
    recordAction('Loaded demo data');
    setTransactions(INITIAL_TRANSACTIONS);
    setCredits(INITIAL_CREDITS);
    setBudgets(INITIAL_BUDGETS);
    setGoals(INITIAL_GOALS);
  };

  const clearAllData = () => {
    recordAction('Cleared all data');
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
        totalChittyBalance,
        totalChittyPool,
        chittyAccounts,
        totalAssetsCombined,
        netWorth,
        netBorrowLendPosition,
        totalCreditLimit,
        totalCreditUtilization,
        formatCurrency,

        // Undo / Redo
        undo,
        redo,
        canUndo: past.length > 0,
        canRedo: future.length > 0,
        undoRedoToast,

        // Actions
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addCreditAccount,
        updateCreditAccount,
        deleteCreditAccount,
        logCreditPayment,
        logChittyInstallment,
        claimChittyPrize,
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
