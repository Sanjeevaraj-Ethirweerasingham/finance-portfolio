import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Minus, Wallet, TrendingUp, TrendingDown, PieChart, Activity, X, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const Card = ({ children, className = "", delay = "0s" }) => (
  <div 
    className={`backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-5 shadow-2xl ${className}`}
    style={{ animation: `float 6s ease-in-out infinite`, animationDelay: delay }}
  >
    {children}
  </div>
);

const Button = ({ children, onClick, variant = 'primary', className = "" }) => {
  const baseStyle = "px-6 py-3 rounded-2xl font-semibold transition-all duration-300 active:scale-95 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50",
    danger: "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/50",
    glass: "bg-white/10 hover:bg-white/20 text-white border border-white/10"
  };

  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const FloatingOrb = ({ color, size, top, left, delay }) => (
  <div 
    className={`absolute rounded-full blur-[80px] opacity-40 animate-pulse`}
    style={{ 
      backgroundColor: color, 
      width: size, 
      height: size, 
      top: top, 
      left: left,
      animationDuration: '8s',
      animationDelay: delay
    }} 
  />
);

export default function App() {
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('zerogravity_transactions');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load data", e);
    }
    return [
      { id: 1, title: 'Freelance Project', amount: 1200, type: 'income', category: 'Work', date: '2023-10-24' },
      { id: 2, title: 'Grocery Run', amount: 150, type: 'expense', category: 'Food', date: '2023-10-25' },
    ];
  });
  
  const [view, setView] = useState('dashboard');
  const [newTrans, setNewTrans] = useState({ title: '', amount: '', type: 'expense', category: 'Food' });

  useEffect(() => {
    localStorage.setItem('zerogravity_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const { totalIncome, totalExpense } = useMemo(() => {
    return transactions.reduce((acc, curr) => {
      if (curr.type === 'income') acc.totalIncome += Number(curr.amount);
      else acc.totalExpense += Number(curr.amount);
      return acc;
    }, { totalIncome: 0, totalExpense: 0 });
  }, [transactions]);
  
  const balance = totalIncome - totalExpense;

  const handleAdd = () => {
    if (!newTrans.title || !newTrans.amount) return;
    const transaction = {
      id: Date.now(),
      ...newTrans,
      amount: Number(newTrans.amount),
      date: new Date().toISOString().split('T')[0]
    };
    setTransactions([transaction, ...transactions]);
    setView('dashboard');
    setNewTrans({ title: '', amount: '', type: 'expense', category: 'Food' });
  };

  const renderDashboard = () => (
    <div className="space-y-6 pb-24">
      <div className="relative group perspective-1000">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
        <Card className="relative overflow-hidden !border-white/30 !bg-white/10" delay="0s">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-blue-200 font-medium text-sm tracking-wider uppercase mb-1">Total Balance</p>
              <h2 className="text-4xl font-bold text-white tracking-tight">${balance.toLocaleString()}</h2>
            </div>
            <div className="p-3 bg-white/10 rounded-full border border-white/20">
              <Wallet className="text-white w-6 h-6" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-1">
                <div className="bg-emerald-500 rounded-full p-1"><ArrowDownLeft className="w-3 h-3 text-white" /></div>
                <span className="text-emerald-200 text-xs">Income</span>
              </div>
              <p className="text-xl font-semibold text-emerald-100">${totalIncome.toLocaleString()}</p>
            </div>
            <div className="bg-rose-500/10 p-3 rounded-2xl border border-rose-500/20">
               <div className="flex items-center gap-2 mb-1">
                <div className="bg-rose-500 rounded-full p-1"><ArrowUpRight className="w-3 h-3 text-white" /></div>
                <span className="text-rose-200 text-xs">Expense</span>
              </div>
              <p className="text-xl font-semibold text-rose-100">${totalExpense.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card delay="1s" className="!p-4">
          <div className="flex items-center gap-2 mb-3">
             <Activity className="w-4 h-4 text-purple-300" />
             <h3 className="text-white font-medium text-sm">Savings Rate</h3>
          </div>
          <div className="relative w-full h-24 flex items-center justify-center">
             <svg viewBox="0 0 36 36" className="w-20 h-20 rotate-[-90deg]">
                <path className="text-white/10" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                <path className="text-purple-500" strokeDasharray={`${Math.max(0, Math.min(100, (balance / totalIncome) * 100))}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
             </svg>
             <span className="absolute text-white font-bold text-sm">
                {totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0}%
             </span>
          </div>
        </Card>
        <Card delay="1.5s" className="!p-4 flex flex-col justify-center">
           <div className="flex items-center gap-2 mb-2">
             <PieChart className="w-4 h-4 text-blue-300" />
             <h3 className="text-white font-medium text-sm">Top Category</h3>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white mb-1">Food</div>
            <div className="w-full bg-white/10 rounded-full h-1.5">
              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <h3 className="text-white/80 font-medium mb-4 ml-1 flex items-center gap-2">Recent Activity</h3>
        <div className="space-y-3">
          {transactions.map((t, i) => (
            <div key={t.id} className="group flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all active:scale-95 cursor-pointer backdrop-blur-md" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-inner ${t.type === 'income' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                  {t.type === 'income' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                </div>
                <div>
                  <h4 className="text-white font-medium">{t.title}</h4>
                  <p className="text-white/40 text-xs">{t.category} • {t.date}</p>
                </div>
              </div>
              <div className={`font-semibold ${t.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>{t.type === 'income' ? '+' : '-'}${t.amount}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAdd = () => (
    <div className="h-full flex flex-col animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">Add Transaction</h2>
        <button onClick={() => setView('dashboard')} className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20"><X size={20} /></button>
      </div>
      <div className="flex-1 space-y-6">
        <div className="grid grid-cols-2 gap-4 p-1 bg-white/5 rounded-2xl">
          <button onClick={() => setNewTrans({...newTrans, type: 'income'})} className={`py-3 rounded-xl font-medium transition-all ${newTrans.type === 'income' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-white/50 hover:text-white'}`}>Income</button>
          <button onClick={() => setNewTrans({...newTrans, type: 'expense'})} className={`py-3 rounded-xl font-medium transition-all ${newTrans.type === 'expense' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'text-white/50 hover:text-white'}`}>Expense</button>
        </div>
        <div className="relative">
          <label className="text-xs text-white/50 uppercase tracking-wider ml-1 mb-2 block">Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-xl">$</span>
            <input type="number" value={newTrans.amount} onChange={(e) => setNewTrans({...newTrans, amount: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-10 pr-4 text-3xl font-bold text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all placeholder:text-white/20" placeholder="0.00" autoFocus />
          </div>
        </div>
        <div>
           <label className="text-xs text-white/50 uppercase tracking-wider ml-1 mb-2 block">Description</label>
           <input type="text" value={newTrans.title} onChange={(e) => setNewTrans({...newTrans, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-lg text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all placeholder:text-white/20" placeholder="What is this for?" />
        </div>
        <div>
          <label className="text-xs text-white/50 uppercase tracking-wider ml-1 mb-2 block">Category</label>
          <div className="flex flex-wrap gap-2">
            {['Food', 'Housing', 'Transport', 'Entertainment', 'Work', 'Health', 'Shopping'].map(cat => (
              <button key={cat} onClick={() => setNewTrans({...newTrans, category: cat})} className={`px-4 py-2 rounded-xl text-sm border transition-all ${newTrans.category === cat ? 'bg-white text-black border-white' : 'bg-transparent text-white/60 border-white/10 hover:border-white/30'}`}>{cat}</button>
            ))}
          </div>
        </div>
      </div>
      <Button onClick={handleAdd} className="w-full mt-6 py-4 text-lg">Add Transaction</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans overflow-hidden selection:bg-blue-500/30">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <FloatingOrb color="#4f46e5" size="400px" top="-10%" left="-10%" delay="0s" />
        <FloatingOrb color="#db2777" size="300px" top="40%" left="60%" delay="-2s" />
        <FloatingOrb color="#059669" size="250px" top="80%" left="10%" delay="-4s" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>
      <div className="relative z-10 max-w-md mx-auto h-screen flex flex-col bg-white/1 backdrop-blur-sm border-x border-white/5 shadow-2xl">
        <header className="p-6 pt-12 flex justify-between items-center">
          <div><h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">ZeroGravity</h1><p className="text-white/40 text-xs">Portfolio Tracker</p></div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-[1px]"><div className="w-full h-full rounded-full bg-black flex items-center justify-center text-xs font-bold">JS</div></div>
        </header>
        <main className="flex-1 overflow-y-auto px-6 pb-20 no-scrollbar">{view === 'dashboard' ? renderDashboard() : renderAdd()}</main>
        {view === 'dashboard' && (<div className="absolute bottom-8 left-0 right-0 flex justify-center z-20 pointer-events-none"><button onClick={() => setView('add')} className="pointer-events-auto bg-white text-black rounded-full w-16 h-16 flex items-center justify-center shadow-2xl shadow-white/20 hover:scale-110 active:scale-95 transition-all duration-300"><Plus size={32} /></button></div>)}
      </div>
      <style>{`@keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } } .perspective-1000 { perspective: 1000px; } .no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; } @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } } .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }`}</style>
    </div>
  );
}
