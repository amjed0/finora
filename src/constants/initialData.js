export const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' }
];

export const CATEGORIES = {
  expense: [
    { id: 'housing', name: 'Housing & Rent', color: '#f43f5e', icon: 'Home' },
    { id: 'food', name: 'Food & Dining', color: '#fb923c', icon: 'Utensils' },
    { id: 'groceries', name: 'Groceries', color: '#facc15', icon: 'ShoppingCart' },
    { id: 'transport', name: 'Transportation', color: '#38bdf8', icon: 'Car' },
    { id: 'utilities', name: 'Bills & Utilities', color: '#818cf8', icon: 'Zap' },
    { id: 'entertainment', name: 'Entertainment & Fun', color: '#c084fc', icon: 'Film' },
    { id: 'shopping', name: 'Shopping & Gear', color: '#f472b6', icon: 'ShoppingBag' },
    { id: 'health', name: 'Healthcare & Fitness', color: '#2dd4bf', icon: 'HeartPulse' },
    { id: 'debt_payment', name: 'Credit & Debt Payoff', color: '#a855f7', icon: 'CreditCard' },
    { id: 'other_exp', name: 'Other Expenses', color: '#94a3b8', icon: 'MoreHorizontal' }
  ],
  income: [
    { id: 'salary', name: 'Monthly Salary', color: '#10b981', icon: 'Briefcase' },
    { id: 'freelance', name: 'Freelance & Side Business', color: '#34d399', icon: 'Laptop' },
    { id: 'investments', name: 'Investments & Dividends', color: '#06b6d4', icon: 'TrendingUp' },
    { id: 'cashback', name: 'Rewards & Cashback', color: '#a3e635', icon: 'Gift' },
    { id: 'rental', name: 'Rental Income', color: '#22c55e', icon: 'Building' },
    { id: 'other_inc', name: 'Other Income', color: '#64748b', icon: 'IndianRupee' }
  ]
};

export const INITIAL_TRANSACTIONS = [
  {
    id: 'tx-101',
    description: 'Tech Corp Monthly Salary',
    amount: 4850,
    type: 'income',
    category: 'salary',
    date: '2026-09-28',
    paymentMethod: 'Bank Transfer',
    notes: 'Direct deposit after tax'
  },
  {
    id: 'tx-102',
    description: 'Luxury Apartment Rent',
    amount: 1450,
    type: 'expense',
    category: 'housing',
    date: '2026-09-27',
    paymentMethod: 'Bank Transfer',
    notes: 'Monthly rent & maintenance fee'
  },
  {
    id: 'tx-103',
    description: 'UI/UX Design Contract',
    amount: 1200,
    type: 'income',
    category: 'freelance',
    date: '2026-09-25',
    paymentMethod: 'PayPal',
    notes: 'Client payment for mobile app design'
  },
  {
    id: 'tx-104',
    description: 'Whole Foods Market',
    amount: 184.50,
    type: 'expense',
    category: 'groceries',
    date: '2026-09-24',
    paymentMethod: 'Sapphire Preferred Card',
    notes: 'Weekly organic groceries'
  },
  {
    id: 'tx-105',
    description: 'Electricity & High-Speed Fiber Internet',
    amount: 165.00,
    type: 'expense',
    category: 'utilities',
    date: '2026-09-22',
    paymentMethod: 'Credit Card',
    notes: 'Auto-pay'
  },
  {
    id: 'tx-106',
    description: 'Chase Freedom Card Payment',
    amount: 350.00,
    type: 'expense',
    category: 'debt_payment',
    date: '2026-09-20',
    paymentMethod: 'Bank Transfer',
    notes: 'Monthly credit card payoff'
  },
  {
    id: 'tx-107',
    description: 'Fine Dining Restaurant & Drinks',
    amount: 128.80,
    type: 'expense',
    category: 'food',
    date: '2026-09-19',
    paymentMethod: 'Credit Card',
    notes: 'Weekend dinner with friends'
  },
  {
    id: 'tx-108',
    description: 'Dividend Payout - Index Fund',
    amount: 215.40,
    type: 'income',
    category: 'investments',
    date: '2026-09-15',
    paymentMethod: 'Investment Account',
    notes: 'Q3 Stock Dividends'
  },
  {
    id: 'tx-109',
    description: 'Gas Station Fuel Refill',
    amount: 58.20,
    type: 'expense',
    category: 'transport',
    date: '2026-09-14',
    paymentMethod: 'Credit Card',
    notes: 'Full tank'
  },
  {
    id: 'tx-110',
    description: 'Concert Tickets & Cinema',
    amount: 95.00,
    type: 'expense',
    category: 'entertainment',
    date: '2026-09-10',
    paymentMethod: 'Debit Card',
    notes: 'Live music event'
  }
];

export const INITIAL_CREDITS = [
  {
    id: 'crd-1',
    name: 'Chase Sapphire Preferred',
    category: 'borrowing', // 'borrowing' | 'lending'
    type: 'credit_card',
    entity: 'Chase Bank',
    balance: 1420.00,
    limit: 8500.00,
    apr: 19.99,
    minPayment: 75.00,
    dueDate: '2026-10-15',
    accountNumber: '•••• 4892',
    color: '#3b82f6',
    notes: 'Primary credit card for travel & dining'
  },
  {
    id: 'crd-2',
    name: 'Auto Loan - Tesla Model 3',
    category: 'borrowing',
    type: 'loan',
    entity: 'Tesla Financial Services',
    balance: 12400.00,
    limit: 28000.00,
    apr: 4.50,
    minPayment: 385.00,
    dueDate: '2026-10-05',
    accountNumber: '•••• 7721',
    color: '#10b981',
    notes: 'Low APR car financing'
  },
  {
    id: 'crd-3',
    name: 'Borrowed from Uncle Robert',
    category: 'borrowing',
    type: 'personal_borrowing',
    entity: 'Robert Morgan',
    balance: 800.00,
    limit: 1000.00,
    apr: 0.00,
    minPayment: 100.00,
    dueDate: '2026-11-01',
    accountNumber: 'Personal Contact',
    color: '#f59e0b',
    notes: 'Borrowed for home appliance emergency'
  },
  {
    id: 'crd-4',
    name: 'Lent to Mark Stevens (Rent Help)',
    category: 'lending',
    type: 'personal_lending',
    entity: 'Mark Stevens',
    balance: 1200.00,
    limit: 1500.00,
    apr: 0.00,
    minPayment: 300.00,
    dueDate: '2026-10-25',
    accountNumber: 'Friend Contact',
    color: '#06b6d4',
    notes: 'Lent to Mark for security deposit. Agreed monthly repayment.'
  },
  {
    id: 'crd-5',
    name: 'Lent to Sarah Jenkins (Laptop)',
    category: 'lending',
    type: 'personal_lending',
    entity: 'Sarah Jenkins',
    balance: 450.00,
    limit: 600.00,
    apr: 0.00,
    minPayment: 150.00,
    dueDate: '2026-10-18',
    accountNumber: 'Colleague Contact',
    color: '#ec4899',
    notes: 'Design laptop purchase advance'
  },
  {
    id: 'crd-6',
    name: 'Business Loan to Co-Founder',
    category: 'lending',
    type: 'business_lending',
    entity: 'TechVentures LLC',
    balance: 3500.00,
    limit: 5000.00,
    apr: 5.00,
    minPayment: 500.00,
    dueDate: '2026-12-15',
    accountNumber: 'Contract #BV-99',
    color: '#8b5cf6',
    notes: 'Short term bridge loan for startup servers'
  },
  {
    id: 'crd-7',
    name: 'S&P 500 Stock Index Fund',
    category: 'asset',
    type: 'investment',
    entity: 'Vanguard Investments',
    balance: 18500.00,
    limit: 15000.00,
    apr: 8.50,
    minPayment: 0.00,
    dueDate: '',
    accountNumber: '•••• 1928',
    color: '#10b981',
    notes: 'Long term index fund portfolio'
  },
  {
    id: 'crd-8',
    name: 'High-Yield Emergency Savings',
    category: 'asset',
    type: 'savings',
    entity: 'Marcus Goldman Sachs',
    balance: 7200.00,
    limit: 7000.00,
    apr: 4.50,
    minPayment: 0.00,
    dueDate: '',
    accountNumber: '•••• 8821',
    color: '#3b82f6',
    notes: 'High yield savings account @ 4.5% APY'
  },
  {
    id: 'crd-9',
    name: 'Primary Real Estate Equity',
    category: 'asset',
    type: 'property',
    entity: 'Property Equity',
    balance: 45000.00,
    limit: 40000.00,
    apr: 0.00,
    minPayment: 0.00,
    dueDate: '',
    accountNumber: 'Deed #RE-441',
    color: '#8b5cf6',
    notes: 'Home equity value estimate'
  }
];

export const INITIAL_BUDGETS = [
  { id: 'bgt-1', category: 'food', monthlyLimit: 500 },
  { id: 'bgt-2', category: 'groceries', monthlyLimit: 450 },
  { id: 'bgt-3', category: 'transport', monthlyLimit: 250 },
  { id: 'bgt-4', category: 'utilities', monthlyLimit: 220 },
  { id: 'bgt-5', category: 'entertainment', monthlyLimit: 200 },
  { id: 'bgt-6', category: 'shopping', monthlyLimit: 300 }
];

export const INITIAL_GOALS = [
  {
    id: 'gl-1',
    name: '6-Month Emergency Fund',
    targetAmount: 12000,
    currentAmount: 8450,
    targetDate: '2027-03-31',
    color: '#10b981',
    icon: 'ShieldCheck'
  },
  {
    id: 'gl-2',
    name: 'Japan Vacation Trip 🌸',
    targetAmount: 3500,
    currentAmount: 2100,
    targetDate: '2027-05-15',
    color: '#f43f5e',
    icon: 'Plane'
  },
  {
    id: 'gl-3',
    name: 'Debt-Free Credit Card Goal 🎯',
    targetAmount: 2070,
    currentAmount: 1200,
    targetDate: '2026-12-31',
    color: '#8b5cf6',
    icon: 'Zap'
  }
];
