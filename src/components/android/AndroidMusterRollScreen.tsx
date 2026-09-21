import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Calendar, 
  Check, 
  Clock, 
  Sparkles, 
  Sliders, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Plus,
  Lock,
  ShieldCheck,
  UserPlus
} from 'lucide-react';
import { Employee, AttendanceRecord, AttendanceStatus } from '../../types';
import { MoneyUtils } from '../../services/salaryEngine';
import { MaterialTheme } from './types';
import { THEMES } from './themeUtils';

interface AndroidMusterRollScreenProps {
  employees: Employee[];
  attendance: AttendanceRecord[];
  onUpdateAttendance: (records: AttendanceRecord[]) => void;
  theme: MaterialTheme;
  isAdmin?: boolean;
  onAddEmployee?: () => void;
}

export const AndroidMusterRollScreen: React.FC<AndroidMusterRollScreenProps> = ({
  employees,
  attendance,
  onUpdateAttendance,
  theme,
  isAdmin = true,
  onAddEmployee,
}) => {
  const currentTheme = THEMES[theme];
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTrade, setSelectedTrade] = useState<string>('ALL');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [adminNotice, setAdminNotice] = useState<string | null>(null);

  // Extract trades for segmented filter
  const trades = ['ALL', ...Array.from(new Set(employees.map((e) => e.skillTrade)))];

  // Filter employees
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.skillTrade.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTrade = selectedTrade === 'ALL' || emp.skillTrade === selectedTrade;
    return matchesSearch && matchesTrade;
  });

  // Get or initialize record for worker on selected date
  const getAttendanceRecord = (empId: string): { status: AttendanceStatus; overtimeHours: number } => {
    const rec = attendance.find((a) => a.employeeId === empId && a.date === selectedDate);
    if (rec) {
      return { status: rec.status, overtimeHours: rec.overtimeHours || 0 };
    }
    return { status: 'PRESENT', overtimeHours: 0 };
  };

  const handleSetStatus = (empId: string, newStatus: AttendanceStatus) => {
    const existingIndex = attendance.findIndex((a) => a.employeeId === empId && a.date === selectedDate);
    if (existingIndex >= 0) {
      const updated = [...attendance];
      updated[existingIndex] = { ...updated[existingIndex], status: newStatus };
      onUpdateAttendance(updated);
    } else {
      const newRec: AttendanceRecord = {
        id: `ATT-${Date.now()}-${empId}`,
        employeeId: empId,
        date: selectedDate,
        status: newStatus,
        hoursWorked: newStatus === 'PRESENT' ? 8 : newStatus === 'HALF_DAY' ? 4 : 0,
        recordedBy: 'SITE_SUPERVISOR',
        checkInTime: '08:00',
        checkOutTime: '17:00',
        overtimeHours: 0,
      };
      onUpdateAttendance([...attendance, newRec]);
    }
  };

  const handleSetOvertime = (empId: string, hours: number) => {
    const existingIndex = attendance.findIndex((a) => a.employeeId === empId && a.date === selectedDate);
    if (existingIndex >= 0) {
      const updated = [...attendance];
      updated[existingIndex] = { ...updated[existingIndex], overtimeHours: hours };
      onUpdateAttendance(updated);
    } else {
      const newRec: AttendanceRecord = {
        id: `ATT-${Date.now()}-${empId}`,
        employeeId: empId,
        date: selectedDate,
        status: 'PRESENT',
        hoursWorked: 8 + hours,
        recordedBy: 'SITE_SUPERVISOR',
        checkInTime: '08:00',
        checkOutTime: '19:00',
        overtimeHours: hours,
      };
      onUpdateAttendance([...attendance, newRec]);
    }
  };

  const handleMarkAllPresent = () => {
    const updated = [...attendance];
    employees.forEach((emp) => {
      const idx = updated.findIndex((a) => a.employeeId === emp.id && a.date === selectedDate);
      if (idx >= 0) {
        updated[idx] = { ...updated[idx], status: 'PRESENT' };
      } else {
        updated.push({
          id: `ATT-${Date.now()}-${emp.id}`,
          employeeId: emp.id,
          date: selectedDate,
          status: 'PRESENT',
          hoursWorked: 8,
          recordedBy: 'SITE_SUPERVISOR',
          checkInTime: '08:00',
          checkOutTime: '17:00',
          overtimeHours: 0,
        });
      }
    });
    onUpdateAttendance(updated);
  };

  // Stats calculation for muster
  const presentCount = employees.filter((e) => {
    const rec = getAttendanceRecord(e.id);
    return rec.status === 'PRESENT' || rec.status === 'HALF_DAY';
  }).length;

  return (
    <div className="flex-1 overflow-y-auto pb-20 px-4 pt-3 space-y-4 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              <span>Site Muster Roll</span>
            </h2>
            <span
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                isAdmin
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
              }`}
            >
              {isAdmin ? 'Admin' : 'Read-Only'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Daily labor attendance &amp; overtime audit</p>
        </div>

        <div className="flex items-center gap-1.5">
          {isAdmin ? (
            onAddEmployee && (
              <button
                onClick={onAddEmployee}
                className="px-2 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 active:scale-95 transition-all flex items-center gap-1 shadow-sm"
                title="Admin: Register new worker"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Worker</span>
              </button>
            )
          ) : (
            <button
              onClick={() => {
                setAdminNotice('Admin Access Required: Only administrators can register or add new employees.');
                setTimeout(() => setAdminNotice(null), 3500);
              }}
              className="px-2 py-1.5 rounded-xl bg-slate-800 text-slate-400 border border-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
              title="Admin Only: Add Worker"
            >
              <Lock className="w-3 h-3 text-amber-400" />
              <span className="text-[10px]">Add</span>
            </button>
          )}

          <button
            onClick={handleMarkAllPresent}
            className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/30 active:scale-95 transition-all flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Mark All P</span>
          </button>
        </div>
      </div>

      {/* Admin Notice Alert */}
      {adminNotice && (
        <div className="p-3 bg-amber-500/20 border border-amber-500/40 rounded-2xl flex items-center gap-2 text-xs text-amber-300 font-semibold animate-in fade-in">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{adminNotice}</span>
        </div>
      )}

      {/* Date Stepper Bar */}
      <div className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <button
          onClick={() => {
            const d = new Date(selectedDate);
            d.setDate(d.getDate() - 1);
            setSelectedDate(d.toISOString().split('T')[0]);
          }}
          className="p-1 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-white">
          <Calendar className="w-4 h-4 text-amber-400" />
          <span>{new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>

        <button
          onClick={() => {
            const d = new Date(selectedDate);
            d.setDate(d.getDate() + 1);
            setSelectedDate(d.toISOString().split('T')[0]);
          }}
          className="p-1 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search worker by name, ID or trade..."
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Segmented Trade Chips (Horizontal Scrollable) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {trades.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedTrade(t)}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedTrade === t
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Live Muster Count Card */}
      <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
        <span className="text-slate-400">
          Attendance on Site: <strong className="text-emerald-400 font-bold">{presentCount} / {employees.length}</strong>
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
          {Math.round((presentCount / (employees.length || 1)) * 100)}% Present
        </span>
      </div>

      {/* Worker Attendance Cards List */}
      <div className="space-y-3">
        {filteredEmployees.map((worker) => {
          const rec = getAttendanceRecord(worker.id);
          const dailyRate = worker.employmentType === 'DAILY_WAGE' ? worker.dailyWage : Math.round(worker.monthlySalary / 26);
          const hourlyRate = Math.round(dailyRate / 8);
          const otPay = rec.overtimeHours * hourlyRate * 1.5;

          return (
            <div
              key={worker.id}
              className="p-3.5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-md"
            >
              {/* Worker Top Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={worker.profilePhoto}
                    alt={worker.fullName}
                    className="w-10 h-10 rounded-2xl object-cover ring-1 ring-slate-700"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">{worker.fullName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {worker.id} &bull; {worker.skillTrade}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-white">
                    {MoneyUtils.formatINR(dailyRate)}/day
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {worker.employmentType === 'DAILY_WAGE' ? 'Daily Wage' : 'Monthly'}
                  </div>
                </div>
              </div>

              {/* Status Selector Pill Buttons */}
              <div className="grid grid-cols-4 gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
                {(['PRESENT', 'HALF_DAY', 'ABSENT', 'PAID_LEAVE'] as AttendanceStatus[]).map((st) => {
                  const isCurrent = rec.status === st;
                  const label = st === 'PRESENT' ? 'Present' : st === 'HALF_DAY' ? 'Half Day' : st === 'ABSENT' ? 'Absent' : 'Leave';
                  
                  return (
                    <button
                      key={st}
                      onClick={() => handleSetStatus(worker.id, st)}
                      className={`py-1.5 rounded-xl text-[11px] font-bold transition-all text-center ${
                        isCurrent
                          ? st === 'PRESENT'
                            ? 'bg-emerald-500 text-slate-950 shadow-sm'
                            : st === 'HALF_DAY'
                            ? 'bg-amber-500 text-slate-950 shadow-sm'
                            : st === 'ABSENT'
                            ? 'bg-rose-500 text-white shadow-sm'
                            : 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Overtime Selector Slider */}
              {rec.status === 'PRESENT' && (
                <div className="pt-1 flex items-center justify-between gap-3 text-xs bg-slate-950/60 p-2 rounded-2xl border border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Overtime:</span>
                    <strong className="text-amber-300 font-mono">{rec.overtimeHours}h</strong>
                  </div>

                  <div className="flex items-center gap-1">
                    {[0, 1, 2, 3, 4].map((h) => (
                      <button
                        key={h}
                        onClick={() => handleSetOvertime(worker.id, h)}
                        className={`w-6 h-6 rounded-lg text-[10px] font-bold transition-colors ${
                          rec.overtimeHours === h
                            ? 'bg-amber-500 text-slate-950 font-extrabold'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {h}h
                      </button>
                    ))}
                  </div>

                  {rec.overtimeHours > 0 && (
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      +{MoneyUtils.formatINR(otPay)}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
