import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginUser } = useApp();
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(name || 'Alex Morgan', email || 'alex.morgan@example.com');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden p-6 sm:p-8 relative">
        
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#0A4D8C] text-white mx-auto flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-2xl">person</span>
          </div>
          <h3 className="text-2xl font-black font-header">
            {tab === 'login' ? 'Welcome Back' : 'Create Account'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Access your saved tours, bookings & exclusive deals
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setTab('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              tab === 'login' ? 'bg-white dark:bg-slate-700 shadow-sm text-[#0A4D8C] dark:text-[#3FA9F5]' : 'text-slate-500'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setTab('register')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              tab === 'register' ? 'bg-white dark:bg-slate-700 shadow-sm text-[#0A4D8C] dark:text-[#3FA9F5]' : 'text-slate-500'
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'register' && (
            <div>
              <label className="text-xs font-bold block mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                required
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold block mb-1">Email Address</label>
            <input
              type="email"
              placeholder="jane@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold block mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              defaultValue="password123"
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#0A4D8C] text-white py-3.5 rounded-xl text-xs font-extrabold hover:bg-[#073c6e] shadow-lg shadow-[#0A4D8C]/20 transition-all cursor-pointer"
          >
            {tab === 'login' ? 'Sign In to Account' : 'Create Free Account'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-[10px] text-slate-400">
            Or continue with Google / Apple demo sign in
          </p>
        </div>
      </div>
    </div>
  );
};
