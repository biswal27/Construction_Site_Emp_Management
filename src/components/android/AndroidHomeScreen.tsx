import React, { useState } from 'react';
import { 
  MapPin, 
  Fingerprint, 
  CheckCircle2, 
  Clock, 
  Sun, 
  TrendingUp, 
  Calendar, 
  Camera, 
  Wallet, 
  ArrowRight, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles,
  Users,
  Building2,
  ChevronRight,
  BookOpen,
  Smartphone
} from 'lucide-react';
import { Employee, AttendanceRecord, ExpenseRecord, SalaryAdvance, User } from '../../types';
import { MoneyUtils } from '../../services/salaryEngine';
import { AndroidTab, MaterialTheme } from './types';
import { THEMES } from './themeUtils';
import { PWAInstallBanner } from '../pwa/PWAInstallBanner';

interface AndroidHomeScreenProps {
  currentUser: User;
  employee?: Employee;
  employees: Employee[];
  attendance: AttendanceRecord[];
  onPunchToday: (status: 'PRESENT' | 'HALF_DAY') => void;
  onNavigateTab: (tab: AndroidTab) => void;
  expenses: ExpenseRecord[];
  advances: SalaryAdvance[];
  theme: MaterialTheme;
  onOpenGuide?: () => void;
}

export const AndroidHomeScreen: React.FC<AndroidHomeScreenProps> = ({
  currentUser,
  employee,
  employees,
  attendance,
  onPunchToday,
  onNavigateTab,
  expenses,
  advances,
  theme,
  onOpenGuide,
}) => {
  const currentTheme = THEMES[theme];
  const [punchedIn, setPunchedIn] = useState<boolean>(true);
  const [punchTime, setPunchTime] = useState<string>('08:15 AM');
  const [showPunchSuccess, setShowPunchSuccess] = useState<boolean>(false);

  const emp = employee || employees[0];
  const isSupervisor = currentUser.role === 'ADMIN';

  // Calculate stats for current worker or site
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.find((a) => a.employeeId === emp.id && a.date === todayDateStr);
  
  const handlePunchToggle = () => {
    if (punchedIn) {
      setPunchedIn(false);
      onPunchToday('HALF_DAY');
    } else {
      setPunchedIn(true);
      const now = new Date();
      setPunchTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      onPunchToday('PRESENT');
    }
    setShowPunchSuccess(true);
    setTimeout(() => setShowPunchSuccess(false), 2500);
  };

  // Financial calculations for user
  const dailyRate = emp.employmentType === 'DAILY_WAGE' ? emp.dailyWage : Math.round(emp.monthlySalary / 26);
  const userAdvances = advances.filter((a) => a.employeeId === emp.id);
  const pendingAdvanceDebt = userAdvances.reduce((acc, a) => acc + (a.remainingAmount ?? a.remainingBalance ?? a.amount ?? 0), 0);

  return (
    <div className="flex-1 overflow-y-auto pb-20 px-3 sm:px-4 pt-3 space-y-4 select-none">
      {/* PWA Mobile Phone Install Banner */}
      <PWAInstallBanner />

      {/* Top App Header & Profile Card */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <img
              src={currentUser.avatarUrl || emp.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={currentUser.fullName}
              className="w-11 h-11 rounded-2xl object-cover ring-2 ring-amber-500/40"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-slate-950 flex items-center justify-center">
              <CheckCircle2 className="w-2.5 h-2.5 text-slate-950" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold text-white leading-none">{currentUser.fullName}</h2>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {currentUser.role}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="truncate max-w-[200px]">Noida Sector 62 &bull; Pier 14</span>
            </div>
          </div>
        </div>

        {/* Action button & Weather card */}
        <div className="flex items-center gap-2">
          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="p-2 rounded-2xl bg-slate-900 border border-slate-800 text-amber-400 hover:text-amber-300 hover:bg-slate-800 transition flex items-center gap-1 text-xs font-semibold cursor-pointer"
              title="Open User Guide"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline text-[11px]">Guide</span>
            </button>
          )}

          <div className="p-2 rounded-2xl bg-slate-900 border border-slate-800 text-right">
            <div className="flex items-center justify-end gap-1 text-amber-400 font-bold text-xs">
              <Sun className="w-3.5 h-3.5" />
              <span>32°C</span>
            </div>
            <span className="text-[9px] text-slate-400">Clear &bull; Safe Pour</span>
          </div>
        </div>
      </div>


      {/* GPS Geofence Smart Punch Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800/90 border border-slate-700/80 p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold text-emerald-400 tracking-wide uppercase">
              GPS Geofence: Active
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">14m to Project Gate</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs text-slate-400">Today's Shift Status:</div>
            <div className="text-base font-bold text-white mt-0.5 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${punchedIn ? 'bg-emerald-400' : 'bg-rose-400'}`} />
              <span>{punchedIn ? `Punched IN at ${punchTime}` : 'Punched OUT'}</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {emp.skillTrade} &bull; {emp.department}
            </div>
          </div>

          {/* Big Interactive Fingerprint Punch Button */}
          <button
            onClick={handlePunchToggle}
            className={`group relative p-3.5 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 active:scale-95 ${
              punchedIn
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25 hover:bg-emerald-400'
                : 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 hover:bg-amber-400'
            }`}
          >
            <Fingerprint className="w-8 h-8 stroke-[2.2] transition-transform group-hover:scale-110" />
            <span className="text-[10px] font-extrabold uppercase mt-1">
              {punchedIn ? 'Punch OUT' : 'Punch IN'}
            </span>
          </button>
        </div>

        {/* Success toast overlay */}
        {showPunchSuccess && (
          <div className="mt-3 p-2 bg-emerald-500/20 border border-emerald-500/40 rounded-xl flex items-center gap-2 text-xs text-emerald-300 font-semibold animate-in fade-in zoom-in-95">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Biometric attendance verified with site geofence!</span>
          </div>
        )}
      </div>

      {/* Financial Ticker Cards (Material 3 Expressive) */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Today's Accrual
          </span>
          <div className="text-lg font-mono font-bold text-white">
            {MoneyUtils.formatINR(dailyRate)}
          </div>
          <span className="text-[10px] text-emerald-400 font-medium block">
            +₹300 OT (2.0 hrs)
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Advance Balance
          </span>
          <div className="text-lg font-mono font-bold text-amber-400">
            {MoneyUtils.formatINR(pendingAdvanceDebt)}
          </div>
          <span className="text-[10px] text-slate-400 font-medium block">
            Auto-deduct on Payday
          </span>
        </div>
      </div>

      {/* Quick Actions Speed Dial */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Fast Site Actions
          </h3>
          <span className="text-[11px] text-amber-400 font-semibold">1-Tap Direct</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => onNavigateTab('attendance')}
            className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-800/80 flex flex-col items-center justify-center gap-1.5 transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-200">Muster</span>
          </button>

          <button
            onClick={() => onNavigateTab('scanner')}
            className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-sky-500/40 hover:bg-slate-800/80 flex flex-col items-center justify-center gap-1.5 transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Camera className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-200">AI Scan</span>
          </button>

          <button
            onClick={() => onNavigateTab('wallet')}
            className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-800/80 flex flex-col items-center justify-center gap-1.5 transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-200">Wallet</span>
          </button>

          <button
            onClick={() => onNavigateTab('site_hub')}
            className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-800/80 flex flex-col items-center justify-center gap-1.5 transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-200">Camps</span>
          </button>
        </div>
      </div>

      {/* Safety Alert Banner */}
      <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <div className="font-bold text-amber-300">Toolbox Talk & Safety Inspection</div>
          <p className="text-slate-300 mt-0.5 leading-relaxed">
            Fall protection harnesses required for Level 16 slab shuttering. Shuttering oil inspection scheduled at 2:00 PM.
          </p>
        </div>
      </div>

      {/* Supervisor Site Overview (if ADMIN) or Personal Logs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            {isSupervisor ? 'Site Workforce Roster' : 'My Recent Vouchers'}
          </h3>
          <button
            onClick={() => onNavigateTab(isSupervisor ? 'attendance' : 'wallet')}
            className="text-[11px] font-bold text-amber-400 flex items-center gap-1 hover:underline"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {isSupervisor ? (
          <div className="space-y-2">
            {employees.slice(0, 3).map((w) => (
              <div
                key={w.id}
                className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={w.profilePhoto}
                    alt={w.fullName}
                    className="w-9 h-9 rounded-xl object-cover"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">{w.fullName}</div>
                    <div className="text-[10px] text-slate-400">{w.skillTrade} &bull; {w.employmentType.replace('_', ' ')}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Punched IN
                  </span>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">08:20 AM</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {expenses.filter(e => e.employeeId === emp.id).slice(0, 3).map((ex) => (
              <div
                key={ex.id}
                className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-white">{ex.title}</div>
                  <div className="text-[10px] text-slate-400">{ex.category} &bull; {ex.expenseDate}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-white">
                    {MoneyUtils.formatINR(ex.amount)}
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400">
                    {ex.approvalStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
