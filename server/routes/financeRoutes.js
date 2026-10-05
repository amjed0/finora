import express from 'express';
import Transaction from '../models/Transaction.js';
import Credit from '../models/Credit.js';
import Budget from '../models/Budget.js';
import Goal from '../models/Goal.js';

const router = express.Router();

// --- TRANSACTIONS ---
router.get('/transactions', async (req, res) => {
  try {
    const { userId = 'default_user' } = req.query;
    const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/transactions', async (req, res) => {
  try {
    const { userId = 'default_user', ...txData } = req.body;
    const transaction = new Transaction({ userId, ...txData });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/transactions/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/transactions/:id', async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- CREDITS / DEBTS / ASSETS ---
router.get('/credits', async (req, res) => {
  try {
    const { userId = 'default_user' } = req.query;
    const credits = await Credit.find({ userId });
    res.json(credits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/credits', async (req, res) => {
  try {
    const { userId = 'default_user', ...creditData } = req.body;
    const credit = new Credit({ userId, ...creditData });
    await credit.save();
    res.status(201).json(credit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/credits/:id', async (req, res) => {
  try {
    const credit = await Credit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(credit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/credits/:id', async (req, res) => {
  try {
    await Credit.findByIdAndDelete(req.params.id);
    res.json({ message: 'Credit record deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- BUDGETS ---
router.get('/budgets', async (req, res) => {
  try {
    const { userId = 'default_user' } = req.query;
    const budgets = await Budget.find({ userId });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/budgets', async (req, res) => {
  try {
    const { userId = 'default_user', ...budgetData } = req.body;
    const budget = new Budget({ userId, ...budgetData });
    await budget.save();
    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/budgets/:id', async (req, res) => {
  try {
    const budget = await Budget.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(budget);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- GOALS ---
router.get('/goals', async (req, res) => {
  try {
    const { userId = 'default_user' } = req.query;
    const goals = await Goal.find({ userId });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/goals', async (req, res) => {
  try {
    const { userId = 'default_user', ...goalData } = req.body;
    const goal = new Goal({ userId, ...goalData });
    await goal.save();
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/goals/:id', async (req, res) => {
  try {
    const goal = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(goal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/goals/:id', async (req, res) => {
  try {
    await Goal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Goal deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
