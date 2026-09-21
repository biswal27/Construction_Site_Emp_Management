import React from 'react';
import { User, Role } from '../../types';
import { 
  HardHat, 
  ShieldCheck, 
  UserCheck, 
  Wifi, 
  RefreshCw, 
  Smartphone, 
  Monitor, 
  BookOpen,
  UserPlus,
  Lock
} from 'lucide-react';
import { PWAInstallButton } from '../pwa/PWAInstallButton';

interface HeaderProps {
  currentUser: User;
  onSwitchUser: (user: User) => void;
  availableUsers: User[];
  isOnline: boolean;
  onToggleOnline: () => void;
  onTriggerSync?: () => void;
  appMode: 'android' | 'desktop';
  onToggleAppMode: (mode: 'android' | 'desktop') => void;
  onOpenGuide?: () => void;
  onOpenRegisterUser?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSwitchUser,
  availableUsers,
  isOnline,
  onToggleOnline,
  onTriggerSync,
  appMode,
  onToggleAppMode,
  onOpenGuide,
  onOpenRegisterUser,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-3 sm:px-6 lg:px-8 py-2.5 transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Project Context */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20 shrink-0">
            <HardHat className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-2">
                BuildForce <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">Android v15</span>
              </h1>
              <span className="hidden md:inline-block text-xs text-slate-400">|</span>
              <span className="hidden md:inline-block text-xs font-medium text-slate-300">
                Workforce, Salary &amp; Expense Management
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 truncate max-w-[280px] sm:max-w-none">
              Site Active: Noida Sector 62 Structural Project &bull; Sept 2026 Payroll Cycle
            </p>
          </div>
        </div>

        {/* Action Controls & User Role Switcher */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
          {/* PWA Mobile Install Button */}
          <PWAInstallButton />

          {/* Quick Guide Walkthrough */}
          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition cursor-pointer"
              title="View User Guide & App Instructions"
            >
              <BookOpen className="h-3.5 w-3.5 text-amber-400" />
              <span className="hidden sm:inline">Guide</span>
            </button>
          )}

          {/* App View Mode Switcher: Android Mobile vs Desktop Portal */}
          <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => onToggleAppMode('android')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                appMode === 'android'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
              title="Switch to Android 15 Mobile App View (Material 3)"
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>Mobile</span>
            </button>
            <button
              onClick={() => onToggleAppMode('desktop')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                appMode === 'desktop'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
              title="Switch to Desktop ERP Portal View"
            >
              <Monitor className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
          </div>

          {/* Offline / Online Network Indicator */}
          <button
            onClick={onToggleOnline}
            title={isOnline ? 'Network Connected - Click to simulate offline mode' : 'Offline Mode (Room Cache active) - Click to restore'}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              isOnline
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
            }`}
          >
            <Wifi className={`h-3.5 w-3.5 ${!isOnline ? 'animate-pulse' : ''}`} />
            <span className="hidden lg:inline">{isOnline ? 'Online (5G)' : 'Offline (Room DB)'}</span>
          </button>

          {onTriggerSync && (
            <button
              onClick={onTriggerSync}
              className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Trigger Background WorkManager Sync"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          )}

          {/* Role / Persona Switcher */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            <div className="flex gap-1">
              {availableUsers.map((user) => {
                const isActive = user.id === currentUser.id;
                return (
                  <button
                    key={user.id}
                    onClick={() => onSwitchUser(user)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? user.role === 'ADMIN'
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    {user.role === 'ADMIN' ? (
                      <ShieldCheck className="h-3.5 w-3.5" />
                    ) : (
                      <UserCheck className="h-3.5 w-3.5" />
                    )}
                    <span>{user.role === 'ADMIN' ? 'Admin' : user.username.split('.')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Admin-Only User Registration Action */}
          {currentUser.role === 'ADMIN' && onOpenRegisterUser && (
            <button
              onClick={onOpenRegisterUser}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-bold transition-all cursor-pointer"
              title="Admin Only: Register new user account"
            >
              <UserPlus className="h-3.5 w-3.5 text-amber-400" />
              <span className="hidden sm:inline">Register User</span>
            </button>
          )}

          {currentUser.role !== 'ADMIN' && (
            <div 
              className="flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-400 font-medium"
              title="Logged in as Worker (Read-Only Registration). Only Admin can register users or add employees."
            >
              <Lock className="w-3 h-3 text-amber-400/80" />
              <span className="hidden xl:inline">Employee Access</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

