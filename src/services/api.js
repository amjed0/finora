const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Helper for HTTP requests
async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Request failed with status ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[API] MongoDB backend unreachable for ${endpoint}, using client fallback. Reason:`, err.message);
    throw err;
  }
}

export const api = {
  // Auth
  registerUser: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  loginUser: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  // Finance
  getTransactions: (userId) => request(`/finance/transactions?userId=${userId || 'default_user'}`),
  addTransaction: (data) => request('/finance/transactions', { method: 'POST', body: JSON.stringify(data) }),
  updateTransaction: (id, data) => request(`/finance/transactions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTransaction: (id) => request(`/finance/transactions/${id}`, { method: 'DELETE' }),

  getCredits: (userId) => request(`/finance/credits?userId=${userId || 'default_user'}`),
  addCredit: (data) => request('/finance/credits', { method: 'POST', body: JSON.stringify(data) }),
  updateCredit: (id, data) => request(`/finance/credits/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCredit: (id) => request(`/finance/credits/${id}`, { method: 'DELETE' }),

  getBudgets: (userId) => request(`/finance/budgets?userId=${userId || 'default_user'}`),
  addBudget: (data) => request('/finance/budgets', { method: 'POST', body: JSON.stringify(data) }),
  updateBudget: (id, data) => request(`/finance/budgets/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  getGoals: (userId) => request(`/finance/goals?userId=${userId || 'default_user'}`),
  addGoal: (data) => request('/finance/goals', { method: 'POST', body: JSON.stringify(data) }),
  updateGoal: (id, data) => request(`/finance/goals/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteGoal: (id) => request(`/finance/goals/${id}`, { method: 'DELETE' })
};
