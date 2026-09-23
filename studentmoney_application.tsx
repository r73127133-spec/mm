import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  TrendingUp,
  PlusCircle,
  MinusCircle,
  Calendar as CalendarIcon,
  BookOpen,
  Bot,
  Settings,
  Flame,
  PieChart as ChartIcon,
  Award,
  Search,
  Filter,
  Download,
  Trash2,
  Edit3,
  CheckCircle2,
  XCircle,
  Sun,
  Moon,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  GraduationCap,
  Target,
  RefreshCw,
  Gift,
  Check,
  AlertCircle,
  Menu,
  X,
  Send,
  User,
  ShoppingBag,
  Bus,
  Gamepad2,
  Smartphone,
  School,
  Utensils
} from 'lucide-react';

const INITIAL_TRANSACTIONS = [
  { id: '1', type: 'income', category: 'Pocket Money', amount: 2000, date: '2026-09-01', note: 'Monthly allowance from Mom' },
  { id: '2', type: 'expense', category: 'Food', amount: 300, date: '2026-09-02', note: 'School canteen lunch with friends' },
  { id: '3', type: 'expense', category: 'Travel', amount: 200, date: '2026-09-03', note: 'Bus pass top up' },
  { id: '4', type: 'expense', category: 'Books', amount: 250, date: '2026-09-05', note: 'Physics lab notebook & guide' },
  { id: '5', type: 'expense', category: 'Entertainment', amount: 150, date: '2026-09-08', note: 'Weekend movie ticket' },
  { id: '6', type: 'income', category: 'Gift Money', amount: 500, date: '2026-09-10', note: 'Grandma birthday gift' },
  { id: '7', type: 'expense', category: 'School Supplies', amount: 120, date: '2026-09-12', note: 'Pens, highlighters, and sticky notes' },
  { id: '8', type: 'expense', category: 'Food', amount: 180, date: '2026-09-15', note: 'After school smoothies' }
];

const INITIAL_GOALS = [
  { id: 'g1', name: 'Wireless Headphones', target: 3000, saved: 1800, targetDate: '2026-10-15', icon: '🎧', completed: false },
  { id: 'g2', name: 'Science Fair Project Kit', target: 1500, saved: 1500, targetDate: '2026-09-20', icon: '🔬', completed: true },
  { id: 'g3', name: 'End-of-Term Class Trip', target: 2500, saved: 800, targetDate: '2026-11-30', icon: '🚌', completed: false }
];

const INITIAL_STUDY_GOALS = [
  { id: 's1', title: 'Complete Math Chapter 4 Exercises', status: 'completed', date: '2026-09-18', reward: '1 Hour Gaming Pass' },
  { id: 's2', title: 'Finish Science Revision Notes', status: 'pending', date: '2026-09-25', reward: 'Watch Favorite Show' },
  { id: 's3', title: 'Read 2 Chapters of English Novel', status: 'pending', date: '2026-09-28', reward: 'Smoothie Treat' }
];

const INITIAL_BUDGET = {
  monthlyAllowance: 2500,
  totalLimit: 2000,
  categories: {
    'Food': 600,
    'Travel': 400,
    'Books': 400,
    'School Supplies': 300,
    'Entertainment': 300,
    'Shopping': 200,
    'Mobile/Internet': 150,
    'School': 200,
    'Other': 150
  }
};

const CATEGORY_ICONS = {
  'Food': <Utensils className="w-4 h-4 text-amber-500" />,
  'Travel': <Bus className="w-4 h-4 text-blue-500" />,
  'School Supplies': <School className="w-4 h-4 text-emerald-500" />,
  'Books': <BookOpen className="w-4 h-4 text-purple-500" />,
  'Entertainment': <Gamepad2 className="w-4 h-4 text-pink-500" />,
  'Shopping': <ShoppingBag className="w-4 h-4 text-indigo-500" />,
  'Mobile/Internet': <Smartphone className="w-4 h-4 text-cyan-500" />,
  'School': <GraduationCap className="w-4 h-4 text-teal-500" />,
  'Pocket Money': <Wallet className="w-4 h-4 text-green-500" />,
  'Gift Money': <Gift className="w-4 h-4 text-rose-500" />,
  'Scholarship': <Award className="w-4 h-4 text-yellow-500" />,
  'Allowance': <DollarSign className="w-4 h-4 text-lime-500" />,
  'Other': <Sparkles className="w-4 h-4 text-slate-500" />
};

const formatCurrency = (amount, symbol = '₹') => {
  return `${symbol}${Number(amount || 0).toLocaleString('en-IN')}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default function App() {
  // Navigation & UI State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // App Data State with LocalStorage Persistence
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('sm_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [savingsGoals, setSavingsGoals] = useState(() => {
    const saved = localStorage.getItem('sm_goals');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [studyGoals, setStudyGoals] = useState(() => {
    const saved = localStorage.getItem('sm_study');
    return saved ? JSON.parse(saved) : INITIAL_STUDY_GOALS;
  });

  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem('sm_budget');
    return saved ? JSON.parse(saved) : INITIAL_BUDGET;
  });

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('sm_profile');
    return saved ? JSON.parse(saved) : {
      name: 'Alex Rivera',
      grade: 'Grade 10',
      currency: '₹',
      streakDays: 12,
      lastSavedDate: new Date().toISOString().split('T')[0]
    };
  });

  // Modal States
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [goalDepositModal, setGoalDepositModal] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [celebrationGoal, setCelebrationGoal] = useState(null);

  // AI Assistant Messages State
  const [aiChat, setAiChat] = useState([
    {
      id: '1',
      sender: 'assistant',
      text: "Hi Alex! 👋 I'm your StudentMoney AI Assistant. Ask me anything about your pocket money, recent spending, or how to reach your savings goals faster!"
    }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const chatBottomRef = useRef(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('sm_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('sm_goals', JSON.stringify(savingsGoals));
  }, [savingsGoals]);

  useEffect(() => {
    localStorage.setItem('sm_study', JSON.stringify(studyGoals));
  }, [studyGoals]);

  useEffect(() => {
    localStorage.setItem('sm_budget', JSON.stringify(budget));
  }, [budget]);

  useEffect(() => {
    localStorage.setItem('sm_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const summary = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalSavings = savingsGoals.reduce((sum, g) => sum + Number(g.saved), 0);

    const currentBalance = totalIncome - totalExpenses;

    // Current Month specific calculations
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthTransactions = transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const monthlyIncome = monthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const monthlyExpenses = monthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const remainingBudget = Math.max(0, budget.totalLimit - monthlyExpenses);

    // School related expenses total
    const schoolExpenses = monthTransactions
      .filter((t) => ['Books', 'School Supplies', 'School'].includes(t.category) && t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      totalIncome,
      totalExpenses,
      currentBalance,
      totalSavings,
      monthlyIncome,
      monthlyExpenses,
      remainingBudget,
      schoolExpenses
    };
  }, [transactions, savingsGoals, budget]);

  const handleSaveTransaction = (formData) => {
    if (editingTx) {
      setTransactions(transactions.map((t) => (t.id === editingTx.id ? { ...formData, id: editingTx.id } : t)));
      setEditingTx(null);
    } else {
      const newTx = {
        ...formData,
        id: Date.now().toString()
      };
      setTransactions([newTx, ...transactions]);
    }
    setIsTxModalOpen(false);
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const handleSaveGoal = (goalData) => {
    const newGoal = {
      ...goalData,
      id: Date.now().toString(),
      saved: Number(goalData.saved) || 0,
      target: Number(goalData.target),
      completed: (Number(goalData.saved) || 0) >= Number(goalData.target)
    };
    setSavingsGoals([...savingsGoals, newGoal]);
    setIsGoalModalOpen(false);
  };

  const handleGoalDeposit = (e) => {
    e.preventDefault();
    if (!goalDepositModal || !depositAmount || Number(depositAmount) <= 0) return;

    const added = Number(depositAmount);
    setSavingsGoals(
      savingsGoals.map((g) => {
        if (g.id === goalDepositModal.id) {
          const newSaved = g.saved + added;
          const isNowCompleted = newSaved >= g.target;
          if (isNowCompleted && !g.completed) {
            setCelebrationGoal({ ...g, saved: newSaved });
          }
          return {
            ...g,
            saved: newSaved,
            completed: isNowCompleted
          };
        }
        return g;
      })
    );

    setGoalDepositModal(null);
    setDepositAmount('');
  };

  const handleDeleteGoal = (id) => {
    setSavingsGoals(savingsGoals.filter((g) => g.id !== id));
  };

  const exportToCSV = () => {
    const headers = ['ID,Type,Category,Amount,Date,Note\n'];
    const rows = transactions.map(
      (t) => `"${t.id}","${t.type}","${t.category}","${t.amount}","${t.date}","${(t.note || '').replace(/"/g, '""')}"\n`
    );
    const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `StudentMoney_Transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleResetDemoData = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    setSavingsGoals(INITIAL_GOALS);
    setStudyGoals(INITIAL_STUDY_GOALS);
    setBudget(INITIAL_BUDGET);
    setProfile({
      name: 'Alex Rivera',
      grade: 'Grade 10',
      currency: '₹',
      streakDays: 12,
      lastSavedDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleSendAiMessage = async (e) => {
    e.preventDefault();
    if (!aiInput.trim() || aiLoading) return;

    const userQuery = aiInput.trim();
    const newUserMsg = { id: Date.now().toString(), sender: 'user', text: userQuery };
    setAiChat((prev) => [...prev, newUserMsg]);
    setAiInput('');
    setAiLoading(true);

    // Prepare live financial context for AI
    const financialContext = `
Student Profile: ${profile.name} (${profile.grade})
Currency: ${profile.currency}
Current Balance: ${summary.currentBalance}
Total Income Received: ${summary.totalIncome}
Total Money Spent: ${summary.totalExpenses}
Monthly Allowance: ${budget.monthlyAllowance}
Monthly Spending Limit: ${budget.totalLimit}
Monthly Spent so far: ${summary.monthlyExpenses}
Remaining Monthly Budget: ${summary.remainingBudget}
School Expenses This Month: ${summary.schoolExpenses}
Savings Goals: ${savingsGoals.map((g) => `${g.name} (${g.saved}/${g.target})`).join(', ')}
Recent 5 Transactions: ${transactions.slice(0, 5).map((t) => `${t.type.toUpperCase()}: ${profile.currency}${t.amount} on ${t.category} (${t.note})`).join('; ')}
`;

    const systemPrompt = `You are "StudentMoney AI", an encouraging, friendly, and smart financial mentor for students and teenagers. 
Your goal is to answer financial questions in a simple, practical, student-focused way. 
Always refer to the user's REAL financial context provided below. Be concise (2-4 sentences or short bullet points). 
Never suggest stock trading, crypto, loans, or gambling. Focus on pocket money, saving, smart spending on school/entertainment, and reaching savings goals.

CURRENT STUDENT FINANCIAL DATA:
${financialContext}`;

    try {
      const apiKey = ''; // Provided automatically at runtime in environment
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

      const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] }
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      const replyText = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (replyText) {
        setAiChat((prev) => [
          ...prev,
          { id: (Date.now() + 1).toString(), sender: 'assistant', text: replyText }
        ]);
      } else {
        throw new Error('No response from Gemini API');
      }
    } catch (err) {
      // Intelligent Local Fallback Response Generator
      let fallbackText = '';
      const q = userQuery.toLowerCase();

      if (q.includes('spend') || q.includes('spent') || q.includes('where')) {
        const topCat = Object.entries(
          transactions.reduce((acc, t) => {
            if (t.type === 'expense') acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
            return acc;
          }, {})
        ).sort((a, b) => b[1] - a[1])[0];

        fallbackText = `You've spent ${profile.currency}${summary.monthlyExpenses} this month out of your ${profile.currency}${budget.totalLimit} budget. ${topCat ? `Your biggest expense category is ${topCat[0]} (${profile.currency}${topCat[1]}).` : ''}`;
      } else if (q.includes('save') || q.includes('goal')) {
        fallbackText = `You currently have ${profile.currency}${summary.totalSavings} saved across ${savingsGoals.length} savings goals! You're closest to finishing your '${savingsGoals[0]?.name || 'goal'}'. Keep up the streak!`;
      } else if (q.includes('left') || q.includes('balance') || q.includes('budget')) {
        fallbackText = `Your current balance is ${profile.currency}${summary.currentBalance}. You still have ${profile.currency}${summary.remainingBudget} remaining in your monthly budget limit!`;
      } else {
        fallbackText = `Based on your student budget, you have ${profile.currency}${summary.remainingBudget} left to spend safely this month. Try putting at least 10% into your '${savingsGoals[0]?.name || 'savings goal'}'! 🎯`;
      }

      setAiChat((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), sender: 'assistant', text: fallbackText }
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiChat, aiLoading]);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'} transition-colors duration-200 flex flex-col md:flex-row font-sans`}>
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sticky top-0 h-screen z-20">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              StudentMoney
            </h1>
            <p className="text-xs text-slate-400 font-medium">Smart Pocket Finance</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Wallet },
            { id: 'transactions', label: 'Transactions', icon: ArrowUpRight },
            { id: 'budget', label: 'Budget', icon: DollarSign },
            { id: 'goals', label: 'Savings Goals', icon: Target },
            { id: 'analytics', label: 'Analytics', icon: ChartIcon },
            { id: 'streak', label: 'Saving Streak', icon: Flame },
            { id: 'calendar', label: 'Money Calendar', icon: CalendarIcon },
            { id: 'study', label: 'Study + Money', icon: GraduationCap },
            { id: 'ai', label: 'AI Assistant', icon: Bot },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User Card at bottom of sidebar */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold text-sm">
              {profile.name.charAt(0)}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold truncate dark:text-slate-200">{profile.name}</p>
              <p className="text-[10px] text-slate-400">{profile.grade}</p>
            </div>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      {/* Mobile Top Nav & Drawer */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <Wallet className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg text-slate-800 dark:text-slate-100">StudentMoney</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 text-slate-500 dark:text-slate-400"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 dark:text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 space-y-1 z-30 sticky top-16">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Wallet },
            { id: 'transactions', label: 'Transactions', icon: ArrowUpRight },
            { id: 'budget', label: 'Budget', icon: DollarSign },
            { id: 'goals', label: 'Savings Goals', icon: Target },
            { id: 'analytics', label: 'Analytics', icon: ChartIcon },
            { id: 'streak', label: 'Saving Streak', icon: Flame },
            { id: 'calendar', label: 'Money Calendar', icon: CalendarIcon },
            { id: 'study', label: 'Study + Money', icon: GraduationCap },
            { id: 'ai', label: 'AI Assistant', icon: Bot },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm ${
                activeTab === item.id
                  ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
        {/* 1. DASHBOARD TAB */}
        {}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Top Greeting */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  Welcome back, {profile.name}! 👋
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Here is your pocket money summary for this month.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingTx(null);
                    setIsTxModalOpen(true);
                  }}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm shadow-md shadow-indigo-500/20 transition-all"
                >
                  <PlusCircle className="w-4 h-4" /> Add Transaction
                </button>
              </div>
            </div>

            {/* Core Balance Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Current Balance */}
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-2xl p-5 shadow-lg shadow-indigo-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 transform translate-x-3 -translate-y-3 opacity-10">
                  <Wallet className="w-32 h-32 text-white" />
                </div>
                <p className="text-indigo-200 text-xs font-semibold uppercase tracking-wider">Current Balance</p>
                <h3 className="text-3xl font-extrabold mt-2">
                  {formatCurrency(summary.currentBalance, profile.currency)}
                </h3>
                <p className="text-xs text-indigo-200/80 mt-3 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Total Income - Expenses
                </p>
              </div>

              {/* Monthly Pocket Money Received */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/60 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Pocket Money Received</p>
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-2">
                  {formatCurrency(summary.monthlyIncome, profile.currency)}
                </h3>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
                  Allowance + Gifts this month
                </p>
              </div>

              {/* Money Spent */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/60 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Money Spent</p>
                  <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                    <ArrowDownRight className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-2">
                  {formatCurrency(summary.monthlyExpenses, profile.currency)}
                </h3>
                <p className="text-xs text-slate-400 mt-2">
                  Limit: {formatCurrency(budget.totalLimit, profile.currency)}
                </p>
              </div>

              {/* Total Savings Goal Progress */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/60 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Savings</p>
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <PiggyBank className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-2">
                  {formatCurrency(summary.totalSavings, profile.currency)}
                </h3>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 font-medium flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-amber-500" /> {profile.streakDays}-Day Savings Streak!
                </p>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="bg-gradient-to-r from-purple-900/10 via-indigo-900/10 to-slate-900/10 dark:from-purple-900/30 dark:to-indigo-900/30 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 flex flex-wrap gap-3 items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-500" /> Quick Actions:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setEditingTx(null);
                    setIsTxModalOpen(true);
                  }}
                  className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-emerald-500" /> Add Income
                </button>
                <button
                  onClick={() => {
                    setEditingTx(null);
                    setIsTxModalOpen(true);
                  }}
                  className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
                >
                  <MinusCircle className="w-3.5 h-3.5 text-rose-500" /> Add Expense
                </button>
                <button
                  onClick={() => setIsGoalModalOpen(true)}
                  className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
                >
                  <Target className="w-3.5 h-3.5 text-indigo-500" /> New Savings Goal
                </button>
                <button
                  onClick={() => setActiveTab('budget')}
                  className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
                >
                  <DollarSign className="w-3.5 h-3.5 text-amber-500" /> Adjust Budget
                </button>
              </div>
            </div>

            {/* Monthly Budget Meter & Savings Goals Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Monthly Pocket Money Budget Progress */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-indigo-500" /> Monthly Allowance Overview
                    </h3>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                      Limit: {formatCurrency(budget.totalLimit, profile.currency)}
                    </span>
                  </div>

                  {/* Budget Bar */}
                  <div className="space-y-2 my-4">
                    <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                      <span>Spent: {formatCurrency(summary.monthlyExpenses, profile.currency)}</span>
                      <span>Remaining: {formatCurrency(summary.remainingBudget, profile.currency)}</span>
                    </div>
                    <div className="w-full h-3.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden p-0.5">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          summary.monthlyExpenses > budget.totalLimit
                            ? 'bg-rose-500'
                            : summary.monthlyExpenses > budget.totalLimit * 0.8
                            ? 'bg-amber-500'
                            : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        }`}
                        style={{
                          width: `${Math.min(100, (summary.monthlyExpenses / budget.totalLimit) * 100)}%`
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Categories Quick Preview */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/60">
                  {['Food', 'Travel', 'Books', 'Entertainment'].map((cat) => {
                    const spent = transactions
                      .filter((t) => t.type === 'expense' && t.category === cat)
                      .reduce((s, t) => s + Number(t.amount), 0);
                    const limit = budget.categories[cat] || 500;
                    const percent = Math.min(100, Math.round((spent / limit) * 100));

                    return (
                      <div key={cat} className="p-2.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                        <div className="flex items-center gap-1.5 mb-1">
                          {CATEGORY_ICONS[cat]}
                          <span className="text-xs font-medium truncate dark:text-slate-300">{cat}</span>
                        </div>
                        <p className="text-xs font-bold dark:text-slate-200">
                          {formatCurrency(spent, profile.currency)} / <span className="text-slate-400 text-[10px]">{formatCurrency(limit, profile.currency)}</span>
                        </p>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-1 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className={`h-full ${percent >= 100 ? 'bg-rose-500' : 'bg-indigo-500'}`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Active Savings Goal Spotlight */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg flex items-center gap-2">
                      <Target className="w-5 h-5 text-indigo-500" /> Active Goal
                    </h3>
                    <button
                      onClick={() => setActiveTab('goals')}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  {savingsGoals.length > 0 ? (
                    (() => {
                      const activeGoal = savingsGoals.find((g) => !g.completed) || savingsGoals[0];
                      const pct = Math.min(100, Math.round((activeGoal.saved / activeGoal.target) * 100));
                      return (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-2xl">
                              {activeGoal.icon || '🎯'}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800 dark:text-slate-100">{activeGoal.name}</h4>
                              <p className="text-xs text-slate-400">Target Date: {formatDate(activeGoal.targetDate)}</p>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-xs font-semibold mb-1">
                              <span className="text-indigo-600 dark:text-indigo-400">{pct}% Saved</span>
                              <span className="text-slate-500 dark:text-slate-400">
                                {formatCurrency(activeGoal.saved, profile.currency)} / {formatCurrency(activeGoal.target, profile.currency)}
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-300"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>

                          <button
                            onClick={() => setGoalDepositModal(activeGoal)}
                            className="w-full py-2 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                          >
                            <PlusCircle className="w-4 h-4" /> Add Money to Goal
                          </button>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="text-center py-6 text-slate-400 text-sm">
                      No savings goals yet. Create one!
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Transactions List */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/60 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Recent Transactions</h3>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  View All ({transactions.length})
                </button>
              </div>

              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-400 text-sm">No transactions yet.</p>
                  <p className="text-xs text-slate-400 mt-1">Add your pocket money or spending to start tracking!</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  {transactions.slice(0, 5).map((t) => (
                    <div key={t.id} className="py-3 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-700/30 px-2 rounded-xl transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          t.type === 'income' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400'
                        }`}>
                          {CATEGORY_ICONS[t.category] || <Wallet className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{t.note || t.category}</p>
                          <p className="text-xs text-slate-400">{t.category} • {formatDate(t.date)}</p>
                        </div>
                      </div>
                      <span className={`font-bold text-sm ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'}`}>
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount, profile.currency)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. TRANSACTIONS TAB */}
        {}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Transaction History</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Filter, search, and manage all your income and expenses.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={exportToCSV}
                  className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all"
                >
                  <Download className="w-4 h-4" /> Export CSV
                </button>
                <button
                  onClick={() => {
                    setEditingTx(null);
                    setIsTxModalOpen(true);
                  }}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm shadow-md shadow-indigo-500/20 transition-all"
                >
                  <PlusCircle className="w-4 h-4" /> Add New
                </button>
              </div>
            </div>

            {/* Filters and Search Bar */}
            <TransactionFilterContainer
              transactions={transactions}
              profile={profile}
              onEdit={(tx) => {
                setEditingTx(tx);
                setIsTxModalOpen(true);
              }}
              onDelete={handleDeleteTransaction}
            />
          </div>
        )}

        {/* 3. BUDGET TAB */}
        {}
        {activeTab === 'budget' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Monthly Pocket-Money Budget</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Set spending caps to avoid running out of money before the month ends!</p>
              </div>
            </div>

            {/* Allowance & Total Limit Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly Allowance</p>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">
                  {formatCurrency(budget.monthlyAllowance, profile.currency)}
                </h3>
              </div>
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Spent This Month</p>
                <h3 className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
                  {formatCurrency(summary.monthlyExpenses, profile.currency)}
                </h3>
              </div>
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Safe Remaining</p>
                <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  {formatCurrency(summary.remainingBudget, profile.currency)}
                </h3>
              </div>
            </div>

            {/* Budget Category Allocations */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-6">Category Spending Limits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(budget.categories).map(([catName, cap]) => {
                  const spent = transactions
                    .filter((t) => t.type === 'expense' && t.category === catName)
                    .reduce((sum, t) => sum + Number(t.amount), 0);
                  const percent = Math.min(100, Math.round((spent / cap) * 100));
                  const isOver = spent > cap;

                  return (
                    <div key={catName} className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-white dark:bg-slate-800 rounded-lg shadow-xs">
                            {CATEGORY_ICONS[catName] || <Wallet className="w-4 h-4" />}
                          </div>
                          <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">{catName}</span>
                        </div>
                        <span className={`text-xs font-bold ${isOver ? 'text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-slate-400'}`}>
                          {formatCurrency(spent, profile.currency)} / {formatCurrency(cap, profile.currency)}
                        </span>
                      </div>

                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            isOver ? 'bg-rose-500' : percent > 80 ? 'bg-amber-500' : 'bg-indigo-600'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-2 flex justify-between">
                        <span>{percent}% used</span>
                        <span>{isOver ? 'Exceeded limit!' : `${formatCurrency(cap - spent, profile.currency)} remaining`}</span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 4. SAVINGS GOALS TAB */}
        {}
        {activeTab === 'goals' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Savings Goals 🎯</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Save for things you love—gadgets, books, trips, or school projects!</p>
              </div>
              <button
                onClick={() => setIsGoalModalOpen(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm shadow-md shadow-indigo-500/20 transition-all"
              >
                <PlusCircle className="w-4 h-4" /> Create New Goal
              </button>
            </div>

            {/* Goals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savingsGoals.map((goal) => {
                const percent = Math.min(100, Math.round((goal.saved / goal.target) * 100));
                const remaining = Math.max(0, goal.target - goal.saved);

                return (
                  <div key={goal.id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex flex-col justify-between relative overflow-hidden">
                    {goal.completed && (
                      <div className="absolute top-3 right-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Completed
                      </div>
                    )}

                    <div>
                      <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-3xl mb-4">
                        {goal.icon || '🎯'}
                      </div>
                      <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{goal.name}</h3>
                      <p className="text-xs text-slate-400 mb-4">Target Date: {formatDate(goal.targetDate)}</p>

                      <div className="space-y-1 mb-4">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-indigo-600 dark:text-indigo-400">{percent}%</span>
                          <span className="text-slate-500 dark:text-slate-400">
                            {formatCurrency(goal.saved, profile.currency)} / {formatCurrency(goal.target, profile.currency)}
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
                      <span className="text-xs text-slate-400">
                        {remaining === 0 ? 'Goal reached!' : `${formatCurrency(remaining, profile.currency)} left`}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="p-2 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setGoalDepositModal(goal)}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                        >
                          <PlusCircle className="w-3.5 h-3.5" /> Deposit
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. ANALYTICS TAB */}
        {}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Student Spending Analytics 📊</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Understand where your pocket money goes each month.</p>
            </div>

            <AnalyticsView transactions={transactions} profile={profile} />
          </div>
        )}

        {/* 6. SAVING STREAK TAB */}
        {}
        {activeTab === 'streak' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white p-8 rounded-3xl shadow-xl shadow-orange-500/20 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <Flame className="w-10 h-10 text-amber-200 fill-amber-200 animate-bounce" />
                  <span className="font-extrabold uppercase tracking-widest text-xs text-amber-100">Saving Streak System</span>
                </div>
                <h2 className="text-4xl font-extrabold">{profile.streakDays} Days Strong! 🔥</h2>
                <p className="mt-2 text-amber-100 text-sm max-w-lg">
                  You’ve consistently set aside pocket money or stayed under budget. Keep saving to level up your badges!
                </p>
              </div>
            </div>

            {/* Achievement Badges Grid */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-6">Student Achievements</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { title: '🌱 Beginner Saver', desc: 'Saved your first ₹100', unlocked: summary.totalSavings >= 100 },
                  { title: '⭐ Smart Saver', desc: 'Saved over ₹1,000 total', unlocked: summary.totalSavings >= 1000 },
                  { title: '🏆 Saving Champion', desc: 'Reached 10-day saving streak', unlocked: profile.streakDays >= 10 },
                  { title: '📚 Study Saver', desc: 'Logged 3 school-related expenses', unlocked: transactions.filter((t) => ['Books', 'School Supplies'].includes(t.category)).length >= 3 },
                  { title: '🎯 Goal Getter', desc: 'Completed at least 1 goal', unlocked: savingsGoals.some((g) => g.completed) },
                  { title: '🛡️ Budget Defender', desc: 'Stayed under budget this month', unlocked: summary.monthlyExpenses <= budget.totalLimit }
                ].map((badge, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${
                      badge.unlocked
                        ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60'
                        : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold ${
                      badge.unlocked ? 'bg-amber-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                    }`}>
                      {badge.unlocked ? '🏅' : '🔒'}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{badge.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{badge.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 7. MONEY CALENDAR TAB */}
        {}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Money Calendar 📅</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Visualize pocket money arrivals, planned school purchases, and expenses on dates.</p>
            </div>

            <MoneyCalendarView transactions={transactions} profile={profile} />
          </div>
        )}

        {/* 8. STUDY + MONEY CONNECTION TAB */}
        {}
        {activeTab === 'study' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Study + Money Connection 📚</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Track school spending and complete study goals for personal rewards!</p>
            </div>

            {/* School Expenses Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-500" /> School & Stationery Spending
                  </h3>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-full">
                    {formatCurrency(summary.schoolExpenses, profile.currency)}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-4">
                  Spending logged under Books, School Supplies, and School fees this month.
                </p>

                <div className="space-y-2">
                  {transactions
                    .filter((t) => ['Books', 'School Supplies', 'School'].includes(t.category))
                    .map((t) => (
                      <div key={t.id} className="p-2.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-purple-500" />
                          <span className="font-semibold text-slate-700 dark:text-slate-200">{t.note || t.category}</span>
                        </div>
                        <span className="font-bold text-slate-800 dark:text-slate-100">{formatCurrency(t.amount, profile.currency)}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Study Reward Goals Checklist */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-2 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-500" /> Study Milestone Rewards
                </h3>
                <p className="text-xs text-slate-400 mb-4">Unlock non-financial treats when you finish your homework!</p>

                <div className="space-y-3">
                  {studyGoals.map((sg) => (
                    <div
                      key={sg.id}
                      onClick={() => {
                        setStudyGoals(
                          studyGoals.map((item) =>
                            item.id === sg.id
                              ? { ...item, status: item.status === 'completed' ? 'pending' : 'completed' }
                              : item
                          )
                        );
                      }}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        sg.status === 'completed'
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                          : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center ${
                          sg.status === 'completed' ? 'bg-emerald-500 text-white' : 'border border-slate-300 dark:border-slate-600'
                        }`}>
                          {sg.status === 'completed' && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <p className={`text-xs font-semibold ${sg.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                            {sg.title}
                          </p>
                          <p className="text-[10px] text-indigo-600 dark:text-indigo-400">Reward: {sg.reward}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 9. AI ASSISTANT TAB */}
        {}
        {activeTab === 'ai' && (
          <div className="h-[calc(100vh-100px)] flex flex-col bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 overflow-hidden shadow-sm">
            {/* AI Assistant Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-700/60 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-base">StudentMoney AI Financial Mentor</h3>
                <p className="text-xs text-indigo-100">Powered by Gemini • Knows your active transactions & budget</p>
              </div>
            </div>

            {/* Chat History Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {aiChat.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-300'
                    }`}
                  >
                    {msg.sender === 'user' ? 'You' : <Bot className="w-4 h-4" />}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-slate-100 dark:bg-slate-700/60 text-slate-800 dark:text-slate-100 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {aiLoading && (
                <div className="flex items-center gap-2 text-slate-400 text-xs italic">
                  <Bot className="w-4 h-4 animate-spin text-indigo-500" />
                  Analyzing your pocket money data...
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="p-2 border-t border-slate-100 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-900/40 flex gap-2 overflow-x-auto text-xs">
              {[
                'How much did I spend on food?',
                'Where am I spending most?',
                'Can I afford my headphones goal?',
                'Help me plan my allowance'
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => {
                    setAiInput(chip);
                  }}
                  className="whitespace-nowrap px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-indigo-50 text-slate-600 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-700 text-xs transition-colors shrink-0"
                >
                  💡 {chip}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendAiMessage} className="p-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-2 bg-white dark:bg-slate-800">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Ask about your pocket money or savings..."
                className="flex-1 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={!aiInput.trim() || aiLoading}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white p-2.5 rounded-xl transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* 10. SETTINGS TAB */}
        {}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Student Profile & Settings ⚙️</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Customize your currency, allowance defaults, and preferences.</p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">Student Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">Grade / Class</label>
                  <input
                    type="text"
                    value={profile.grade}
                    onChange={(e) => setProfile({ ...profile, grade: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">Preferred Currency Symbol</label>
                  <select
                    value={profile.currency}
                    onChange={(e) => setProfile({ ...profile, currency: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-800 dark:text-slate-100"
                  >
                    <option value="₹">₹ (INR)</option>
                    <option value="$">$ (USD)</option>
                    <option value="€">€ (EUR)</option>
                    <option value="£">£ (GBP)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-100">Reset Sample Demo Data</h4>
                  <p className="text-xs text-slate-400">Restore the default student pocket money dataset.</p>
                </div>
                <button
                  onClick={handleResetDemoData}
                  className="px-3.5 py-2 bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-300 rounded-xl text-xs font-semibold hover:bg-rose-100 transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reset Data
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL 1: ADD / EDIT TRANSACTION */}
      {}
      {isTxModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                {editingTx ? 'Edit Transaction' : 'Add New Transaction'}
              </h3>
              <button onClick={() => setIsTxModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <TransactionForm
              initialData={editingTx}
              currency={profile.currency}
              onSubmit={handleSaveTransaction}
            />
          </div>
        </div>
      )}

      {/* MODAL 2: NEW SAVINGS GOAL */}
      {}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">Create New Savings Goal</h3>
              <button onClick={() => setIsGoalModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.target);
                handleSaveGoal({
                  name: fd.get('name'),
                  target: fd.get('target'),
                  saved: fd.get('saved') || 0,
                  targetDate: fd.get('targetDate'),
                  icon: fd.get('icon') || '🎧'
                });
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Goal Name</label>
                <input
                  name="name"
                  required
                  placeholder="e.g. Headphones or Trip"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Target ({profile.currency})</label>
                  <input
                    name="target"
                    type="number"
                    required
                    min="1"
                    placeholder="3000"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Already Saved</label>
                  <input
                    name="saved"
                    type="number"
                    min="0"
                    placeholder="0"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Target Date</label>
                  <input
                    name="targetDate"
                    type="date"
                    required
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Emoji Icon</label>
                  <input
                    name="icon"
                    placeholder="🎧"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md"
              >
                Save Goal
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: DEPOSIT TO GOAL */}
      {}
      {goalDepositModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
              Add Money to {goalDepositModal.name}
            </h3>
            <form onSubmit={handleGoalDeposit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Amount ({profile.currency})</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="500"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setGoalDepositModal(null)}
                  className="flex-1 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 text-white font-semibold rounded-xl text-xs"
                >
                  Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CELEBRATION MODAL FOR COMPLETED GOAL */}
      {celebrationGoal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl border border-amber-200 dark:border-amber-800 animate-bounce">
            <div className="w-20 h-20 bg-amber-100 dark:bg-amber-950 rounded-full flex items-center justify-center mx-auto text-4xl">
              🎉
            </div>
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">Goal Completed!</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Awesome job saving for <strong className="text-indigo-600 dark:text-indigo-400">{celebrationGoal.name}</strong>! You reached your {formatCurrency(celebrationGoal.target, profile.currency)} target!
            </p>
            <button
              onClick={() => setCelebrationGoal(null)}
              className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-indigo-500/30"
            >
              Woohoo! Keep Going!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TransactionForm({ initialData, currency, onSubmit }) {
  const [type, setType] = useState(initialData?.type || 'expense');
  const [amount, setAmount] = useState(initialData?.amount || '');
  const [category, setCategory] = useState(initialData?.category || 'Food');
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState(initialData?.note || '');

  const categories =
    type === 'income'
      ? ['Pocket Money', 'Gift Money', 'Scholarship', 'Allowance', 'Other']
      : ['Food', 'Travel', 'School Supplies', 'Books', 'Entertainment', 'Shopping', 'Mobile/Internet', 'School', 'Other'];

  useEffect(() => {
    if (!categories.includes(category)) {
      setCategory(categories[0]);
    }
  }, [type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      type,
      amount: Number(amount),
      category,
      date,
      note
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type Toggle */}
      <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
        <button
          type="button"
          onClick={() => setType('expense')}
          className={`py-1.5 rounded-lg text-xs font-bold transition-colors ${
            type === 'expense' ? 'bg-white dark:bg-slate-800 text-rose-600 shadow-xs' : 'text-slate-500'
          }`}
        >
          Expense 📤
        </button>
        <button
          type="button"
          onClick={() => setType('income')}
          className={`py-1.5 rounded-lg text-xs font-bold transition-colors ${
            type === 'income' ? 'bg-white dark:bg-slate-800 text-emerald-600 shadow-xs' : 'text-slate-500'
          }`}
        >
          Income 📥
        </button>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Amount ({currency})</label>
        <input
          type="number"
          required
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="150"
          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-800 dark:text-slate-100"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-100"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Date</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-100"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Note / Description</label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="School canteen lunch"
          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-800 dark:text-slate-100"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md"
      >
        Save Transaction
      </button>
    </form>
  );
}

function TransactionFilterContainer({ transactions, profile, onEdit, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const filtered = useMemo(() => {
    return transactions
      .filter((t) => {
        const matchesSearch = (t.note || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                              (t.category || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'all' || t.type === typeFilter;
        const matchesCat = categoryFilter === 'all' || t.category === categoryFilter;
        return matchesSearch && matchesType && matchesCat;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
        if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
        if (sortBy === 'highest') return b.amount - a.amount;
        return a.amount - b.amount;
      });
  }, [transactions, searchTerm, typeFilter, categoryFilter, sortBy]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/60 shadow-sm space-y-4">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search notes or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            <option value="all">All Types</option>
            <option value="income">Income Only</option>
            <option value="expense">Expense Only</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Amount</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400 text-sm">No matching transactions found.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
          {filtered.map((t) => (
            <div key={t.id} className="py-3.5 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-700/30 px-3 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  t.type === 'income' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400'
                }`}>
                  {CATEGORY_ICONS[t.category] || <Wallet className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{t.note || t.category}</p>
                  <p className="text-xs text-slate-400">{t.category} • {formatDate(t.date)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`font-bold text-sm ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'}`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount, profile.currency)}
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={() => onEdit(t)} className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(t.id)} className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AnalyticsView({ transactions, profile }) {
  const expenses = transactions.filter((t) => t.type === 'expense');
  const totalExpense = expenses.reduce((sum, t) => sum + Number(t.amount), 0);

  const catMap = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
    return acc;
  }, {});

  const catList = Object.entries(catMap)
    .map(([cat, amt]) => ({
      category: cat,
      amount: amt,
      percent: totalExpense > 0 ? Math.round((amt / totalExpense) * 100) : 0
    }))
    .sort((a, b) => b.amount - a.amount);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Category Breakdown list with progress visualizer */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-4">Expense Distribution by Category</h3>
        {catList.length === 0 ? (
          <p className="text-slate-400 text-sm py-8 text-center">No expenses recorded yet.</p>
        ) : (
          <div className="space-y-4">
            {catList.map((c) => (
              <div key={c.category} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    {CATEGORY_ICONS[c.category]} {c.category}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {formatCurrency(c.amount, profile.currency)} ({c.percent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full"
                    style={{ width: `${c.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Income vs Expenses Bar Graphic */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-2">Income vs Expense Ratio</h3>
          <p className="text-xs text-slate-400 mb-6">Compare how much money you receive vs how much you spend.</p>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-emerald-600">Total Income</span>
                <span>{formatCurrency(transactions.filter(t=>t.type==='income').reduce((s,t)=>s+Number(t.amount),0), profile.currency)}</span>
              </div>
              <div className="w-full bg-emerald-100 dark:bg-emerald-950 h-4 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-full rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-rose-600">Total Expenses</span>
                <span>{formatCurrency(totalExpense, profile.currency)}</span>
              </div>
              <div className="w-full bg-rose-100 dark:bg-rose-950 h-4 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      (totalExpense /
                        (transactions.filter(t=>t.type==='income').reduce((s,t)=>s+Number(t.amount),0) || 1)) *
                        100
                    )}%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 italic">
          Tip: Keeping your expenses under 80% of your income leaves 20% to save for big goals!
        </p>
      </div>
    </div>
  );
}

function MoneyCalendarView({ transactions, profile }) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 1)); // Sept 2026

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const dayCells = [];
  for (let i = 0; i < firstDayIndex; i++) {
    dayCells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    dayCells.push(d);
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
            className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
            className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 mb-2">
        <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
      </div>

      {/* Calendar Days Grid */}
      <div className="grid grid-cols-7 gap-2">
        {dayCells.map((day, idx) => {
          if (!day) return <div key={idx} className="h-16 bg-slate-50/50 dark:bg-slate-900/20 rounded-xl" />;

          const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dayTxs = transactions.filter((t) => t.date === dateStr);
          const hasIncome = dayTxs.some((t) => t.type === 'income');
          const hasExpense = dayTxs.some((t) => t.type === 'expense');

          return (
            <div
              key={idx}
              className="h-16 p-1.5 border border-slate-100 dark:border-slate-700/60 rounded-xl bg-slate-50/80 dark:bg-slate-900/40 flex flex-col justify-between"
            >
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{day}</span>
              <div className="flex gap-1 flex-wrap">
                {hasIncome && <span className="w-2 h-2 rounded-full bg-emerald-500" title="Income received" />}
                {hasExpense && <span className="w-2 h-2 rounded-full bg-rose-500" title="Expense made" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}