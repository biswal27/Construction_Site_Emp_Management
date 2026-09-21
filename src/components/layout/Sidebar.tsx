import React from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarCheck2,
  BadgeDollarSign,
  Receipt,
  Home,
  HandCoins,
  FileSpreadsheet,
  History,
  Code2,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';
import { Role } from '../../types';

export type NavTab =
  | 'dashboard'
  | 'employees'
  | 'attendance'
  | 'salary'
  | 'expenses'
  | 'accommodation'
  | 'advances'
  | 'reports'
  | 'users'
  | 'audit'
  | 'codevault';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  userRole: Role;
  pendingExpenseCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  userRole,
  pendingExpenseCount = 0,
}) => {
  const navItems: {
    id: NavTab;
    label: string;
    icon: React.ReactNode;
    adminOnly?: boolean;
    badge?: number;
  }[] = [
    {
      id: 'dashboard',
      label: userRole === 'ADMIN' ? 'Site Dashboard' : 'My Dashboard',
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      id: 'employees',
      label: userRole === 'ADMIN' ? 'Workforce Directory' : 'My Profile & Details',
      icon: <Users className="h-4 w-4" />,
    },
    {
      id: 'attendance',
      label: userRole === 'ADMIN' ? 'Daily Attendance' : 'My Attendance & Wages',
      icon: <CalendarCheck2 className="h-4 w-4" />,
    },
    {
      id: 'salary',
      label: userRole === 'ADMIN' ? 'Salary & Payroll Engine' : 'My Salary Slips',
      icon: <BadgeDollarSign className="h-4 w-4" />,
    },
    {
      id: 'expenses',
      label: userRole === 'ADMIN' ? 'Expenses & Food Tracking' : 'My Expenses & Allowances',
      icon: <Receipt className="h-4 w-4" />,
      badge: userRole === 'ADMIN' ? pendingExpenseCount : undefined,
    },
    {
      id: 'accommodation',
      label: userRole === 'ADMIN' ? 'Accommodation & Rent' : 'Housing & Utilities',
      icon: <Home className="h-4 w-4" />,
    },
    {
      id: 'advances',
      label: userRole === 'ADMIN' ? 'Advances & Bonuses' : 'My Advances & Bonuses',
      icon: <HandCoins className="h-4 w-4" />,
    },
    {
      id: 'reports',
      label: 'Financial Reports & Exports',
      icon: <FileSpreadsheet className="h-4 w-4" />,
      adminOnly: true,
    },
    {
      id: 'users',
      label: 'User Accounts & Security',
      icon: <ShieldCheck className="h-4 w-4" />,
      adminOnly: true,
    },
    {
      id: 'audit',
      label: 'System Audit Logs',
      icon: <History className="h-4 w-4" />,
      adminOnly: true,
    },
    {
      id: 'codevault',
      label: 'Java 21 & Android Code Vault',
      icon: <Code2 className="h-4 w-4" />,
    },
  ];

  const visibleItems = navItems.filter((item) => !item.adminOnly || userRole === 'ADMIN');

  return (
    <aside className="w-64 shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col justify-between hidden md:flex">
      <div className="p-4 space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Main Navigation
        </div>
        {visibleItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-amber-400' : 'text-slate-400'}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-slate-950">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* System Status Card */}
      <div className="p-4 m-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-400 space-y-2">
        <div className="flex items-center justify-between font-semibold text-slate-200">
          <span>Backend Engine</span>
          <span className="text-emerald-400 text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
            HEALTHY
          </span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-400">
          Spring Boot 3.3.x REST API &bull; PostgreSQL with BigDecimal scale &bull; WorkManager sync
        </p>
      </div>
    </aside>
  );
};
