import React, { useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

// ─────────────────────────────────────────────
// Small reusable input
// ─────────────────────────────────────────────
const Field = ({ label, type, value, onChange, placeholder, icon, error }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-[#1A1A1A]">{label}</label>
    <div className="relative">
      <span
        className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]"
        style={{ fontSize: 18 }}
      >
        {icon}
      </span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-[#1A1A1A] bg-[#F5F9FC] placeholder:text-[#94A3B8] focus:outline-none focus:bg-white transition-all ${
          error
            ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100'
            : 'border-[#E2E8F0] focus:border-[#1A1A1A] focus:ring-2 focus:ring-black/5'
        }`}
      />
    </div>
    {error && <p className="text-red-500 text-[11px] font-medium">{error}</p>}
  </div>
);

// ─────────────────────────────────────────────
// AuthPage Component
// ─────────────────────────────────────────────
export const AuthPage = ({ onBack, onSuccess }) => {
  const [tab, setTab] = useState('login'); // 'login' | 'register' | 'reset'
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');

  // Field errors
  const [errors, setErrors] = useState({});

  const clearMessages = () => {
    setGlobalError('');
    setSuccessMsg('');
    setErrors({});
  };

  // ── Google Sign-In ─────────────────────────
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    clearMessages();
    try {
      await signInWithPopup(auth, googleProvider);
      onSuccess?.();
    } catch (err) {
      setGlobalError(getFirebaseError(err.code));
    } finally {
      setGoogleLoading(false);
    }
  };

  // ── Email Login ────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    clearMessages();
    const errs = {};
    if (!email) errs.email = 'Email is required';
    if (!password) errs.password = 'Password is required';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onSuccess?.();
    } catch (err) {
      setGlobalError(getFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  // ── Register ───────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault();
    clearMessages();
    const errs = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!email) errs.email = 'Email is required';
    if (!password || password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, {
        displayName: name.trim(),
        photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=1A1A1A&color=fff&size=200`
      });
      onSuccess?.();
    } catch (err) {
      setGlobalError(getFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  // ── Password Reset ─────────────────────────
  const handleReset = async (e) => {
    e.preventDefault();
    clearMessages();
    if (!resetEmail) { setErrors({ resetEmail: 'Email is required' }); return; }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setSuccessMsg('Password reset email sent! Check your inbox.');
    } catch (err) {
      setGlobalError(getFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  // ── Firebase error codes → user-friendly ──
  const getFirebaseError = (code) => {
    const map = {
      'auth/email-already-in-use': 'This email is already registered. Try logging in.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/weak-password': 'Password must be at least 6 characters.',
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password. Try again or reset it.',
      'auth/invalid-credential': 'Email or password is incorrect.',
      'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
      'auth/network-request-failed': 'Network error. Check your connection.',
      'auth/too-many-requests': 'Too many attempts. Please try again later.',
    };
    return map[code] || 'Something went wrong. Please try again.';
  };

  return (
    <div className="min-h-screen bg-[#F5F9FC] flex flex-col font-sans">

      {/* ── Minimal Header ── */}
      <header className="bg-white border-b border-[#E2E8F0] px-6 py-4 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 group">
          <div className="size-9 rounded-xl bg-[#1A1A1A] flex items-center justify-center">
            <span className="material-symbols-outlined text-white" style={{ fontSize: 18 }}>travel_explore</span>
          </div>
          <span className="font-black text-[#1A1A1A] text-lg">
            Perfect <span className="text-[#64748B]">Travel</span>
          </span>
        </button>
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#1A1A1A] border border-[#E2E8F0] rounded-xl px-3 py-2 transition-all hover:bg-white"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_back</span>
          Back to Home
        </button>
      </header>

      {/* ── Main Card ── */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-[#E2E8F0] overflow-hidden">

            {/* Top accent bar */}
            <div className="h-1 bg-gradient-to-r from-[#1A1A1A] via-[#64748B] to-[#FF7A00]" />

            <div className="p-8">
              {/* Tabs (Login / Register) */}
              {tab !== 'reset' && (
                <div className="flex bg-[#F5F9FC] rounded-2xl p-1 mb-8 border border-[#E2E8F0]">
                  {[
                    { key: 'login', label: 'Sign In' },
                    { key: 'register', label: 'Create Account' },
                  ].map(t => (
                    <button
                      key={t.key}
                      onClick={() => { setTab(t.key); clearMessages(); }}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        tab === t.key
                          ? 'bg-white text-[#1A1A1A] shadow-sm border border-[#E2E8F0]'
                          : 'text-[#64748B] hover:text-[#1A1A1A]'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Page title */}
              <div className="mb-6">
                <h1 className="text-2xl font-black text-[#1A1A1A]">
                  {tab === 'login' && 'Welcome back'}
                  {tab === 'register' && 'Join Perfect Travel'}
                  {tab === 'reset' && 'Reset Password'}
                </h1>
                <p className="text-[#64748B] text-sm mt-1">
                  {tab === 'login' && 'Sign in to access your bookings and wishlist.'}
                  {tab === 'register' && 'Create a free account to start planning your dream trip.'}
                  {tab === 'reset' && 'Enter your email and we\'ll send a reset link.'}
                </p>
              </div>

              {/* Global Error / Success */}
              {globalError && (
                <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-red-500 flex-shrink-0" style={{ fontSize: 17 }}>error</span>
                  <p className="text-red-600 text-xs font-medium leading-relaxed">{globalError}</p>
                </div>
              )}
              {successMsg && (
                <div className="mb-5 p-3.5 bg-green-50 border border-green-200 rounded-xl flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-green-500 flex-shrink-0" style={{ fontSize: 17 }}>check_circle</span>
                  <p className="text-green-700 text-xs font-medium leading-relaxed">{successMsg}</p>
                </div>
              )}

              {/* ── Google Button ── */}
              {tab !== 'reset' && (
                <>
                  <button
                    onClick={handleGoogleLogin}
                    disabled={googleLoading}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border-2 border-[#E2E8F0] bg-white hover:bg-[#F5F9FC] hover:border-[#64748B]/40 transition-all font-bold text-[#1A1A1A] text-sm disabled:opacity-60 disabled:cursor-not-allowed mb-5"
                  >
                    {googleLoading ? (
                      <div className="size-5 border-2 border-[#E2E8F0] border-t-[#1A1A1A] rounded-full animate-spin" />
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M47.532 24.552c0-1.636-.138-3.2-.395-4.704H24v9.022h13.222c-.57 3.07-2.296 5.676-4.891 7.42v6.17h7.918c4.632-4.267 7.283-10.56 7.283-17.908z" fill="#4285F4"/>
                        <path d="M24 48c6.636 0 12.204-2.2 16.27-5.96l-7.918-6.17C30.13 37.498 27.254 38.4 24 38.4c-6.408 0-11.837-4.33-13.782-10.15H2.06v6.37C6.11 43.38 14.438 48 24 48z" fill="#34A853"/>
                        <path d="M10.218 28.25A14.476 14.476 0 0 1 9.6 24c0-1.48.254-2.918.618-4.25v-6.37H2.06A23.955 23.955 0 0 0 0 24c0 3.87.924 7.522 2.06 10.62l8.158-6.37z" fill="#FBBC05"/>
                        <path d="M24 9.6c3.614 0 6.856 1.24 9.406 3.678l7.054-7.054C36.196 2.196 30.636 0 24 0 14.438 0 6.11 4.62 2.06 13.38l8.158 6.37C12.163 13.93 17.592 9.6 24 9.6z" fill="#EA4335"/>
                      </svg>
                    )}
                    {tab === 'login' ? 'Continue with Google' : 'Sign up with Google'}
                  </button>

                  {/* Divider */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex-1 h-px bg-[#E2E8F0]" />
                    <span className="text-[#64748B] text-xs font-semibold">or with email</span>
                    <div className="flex-1 h-px bg-[#E2E8F0]" />
                  </div>
                </>
              )}

              {/* ── Login Form ── */}
              {tab === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <Field
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    icon="mail"
                    error={errors.email}
                  />
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1A1A1A]">Password</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" style={{ fontSize: 18 }}>lock</span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Your password"
                        className={`w-full pl-10 pr-10 py-3 rounded-xl border text-sm text-[#1A1A1A] bg-[#F5F9FC] placeholder:text-[#94A3B8] focus:outline-none focus:bg-white transition-all ${errors.password ? 'border-red-400' : 'border-[#E2E8F0] focus:border-[#1A1A1A]'}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#1A1A1A]"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{showPassword ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-[11px] font-medium">{errors.password}</p>}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => { setTab('reset'); clearMessages(); }}
                      className="text-xs font-semibold text-[#64748B] hover:text-[#1A1A1A] transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1A1A1A] text-white py-3.5 rounded-xl font-extrabold text-sm hover:bg-[#333] transition-all shadow-lg shadow-black/10 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                  >
                    {loading ? (
                      <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>login</span>
                        Sign In
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* ── Register Form ── */}
              {tab === 'register' && (
                <form onSubmit={handleRegister} className="space-y-4">
                  <Field
                    label="Full Name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Alex Morgan"
                    icon="person"
                    error={errors.name}
                  />
                  <Field
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    icon="mail"
                    error={errors.email}
                  />
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1A1A1A]">Password</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" style={{ fontSize: 18 }}>lock</span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        className={`w-full pl-10 pr-10 py-3 rounded-xl border text-sm text-[#1A1A1A] bg-[#F5F9FC] placeholder:text-[#94A3B8] focus:outline-none focus:bg-white transition-all ${errors.password ? 'border-red-400' : 'border-[#E2E8F0] focus:border-[#1A1A1A]'}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#1A1A1A]"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{showPassword ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-[11px] font-medium">{errors.password}</p>}
                  </div>
                  <Field
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    icon="lock_clock"
                    error={errors.confirmPassword}
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#FF7A00] text-white py-3.5 rounded-xl font-extrabold text-sm hover:bg-[#e56e00] transition-all shadow-lg shadow-[#FF7A00]/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                  >
                    {loading ? (
                      <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>person_add</span>
                        Create Account
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-[#64748B] mt-2">
                    By creating an account you agree to our{' '}
                    <span className="text-[#1A1A1A] font-semibold cursor-pointer hover:underline">Terms of Service</span>
                    {' '}and{' '}
                    <span className="text-[#1A1A1A] font-semibold cursor-pointer hover:underline">Privacy Policy</span>
                  </p>
                </form>
              )}

              {/* ── Password Reset Form ── */}
              {tab === 'reset' && (
                <form onSubmit={handleReset} className="space-y-4">
                  <Field
                    label="Your Email Address"
                    type="email"
                    value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)}
                    placeholder="you@example.com"
                    icon="mail"
                    error={errors.resetEmail}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1A1A1A] text-white py-3.5 rounded-xl font-extrabold text-sm hover:bg-[#333] transition-all shadow-lg shadow-black/10 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>send</span>
                        Send Reset Link
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setTab('login'); clearMessages(); }}
                    className="w-full text-center text-xs font-semibold text-[#64748B] hover:text-[#1A1A1A] transition-colors py-2"
                  >
                    ← Back to Sign In
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Switch tab link at bottom */}
          {tab !== 'reset' && (
            <p className="text-center text-sm text-[#64748B] mt-5">
              {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => { setTab(tab === 'login' ? 'register' : 'login'); clearMessages(); }}
                className="text-[#1A1A1A] font-extrabold hover:underline"
              >
                {tab === 'login' ? 'Create one free' : 'Sign in'}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
