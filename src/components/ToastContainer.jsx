import React from 'react';
import { useApp } from '../context/AppContext';

export const ToastContainer = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const bgColors = {
    success: 'bg-emerald-600 text-white shadow-emerald-500/20',
    info: 'bg-[#0A4D8C] text-white shadow-[#0A4D8C]/20',
    error: 'bg-rose-600 text-white shadow-rose-500/20'
  };

  const icons = {
    success: 'check_circle',
    info: 'info',
    error: 'error'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce">
      <div className={`px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20 backdrop-blur-md ${bgColors[toast.type] || bgColors.info}`}>
        <span className="material-symbols-outlined text-2xl">{icons[toast.type] || 'info'}</span>
        <span className="font-semibold text-sm drop-shadow">{toast.message}</span>
      </div>
    </div>
  );
};
