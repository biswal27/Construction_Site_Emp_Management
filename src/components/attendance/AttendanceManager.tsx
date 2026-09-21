import React, { useState, useMemo } from 'react';
import { Employee, AttendanceRecord, AttendanceStatus } from '../../types';
import { MoneyUtils } from '../../services/salaryEngine';
import {
  CalendarCheck2,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Coffee,
  Sparkles,
  Save,
} from 'lucide-react';

interface AttendanceManagerProps {
  employees: Employee[];
  attendance: AttendanceRecord[];
  onUpdateAttendance: (newRecords: AttendanceRecord[]) => void;
  isAdmin: boolean;
}

export const AttendanceManager: React.FC<AttendanceManagerProps> = ({
  employees,
  attendance,
  onUpdateAttendance,
  isAdmin,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-20');
  const [selectedMonth, setSelectedMonth] = useState<number>(9);
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  // Status on selected date for each employee
  const dayRecordsMap = useMemo(() => {
    const map = new Map<string, AttendanceRecord>();
    attendance
      .filter((r) => r.date === selectedDate)
      .forEach((r) => map.set(r.employeeId, r));
    return map;
  }, [attendance, selectedDate]);

  // Aggregate stats across the month for daily wage calculations
  const monthlyStats = useMemo(() => {
    return employees.map((emp) => {
      const records = attendance.filter((r) => {
        if (r.employeeId !== emp.id) return false;
        const d = new Date(r.date);
        return d.getMonth() + 1 === selectedMonth && d.getFullYear() === selectedYear;
      });

      let present = 0;
      let halfDay = 0;
      let paidLeave = 0;
      let unpaidLeave = 0;
      let holidays = 0;
      let absent = 0;

      records.forEach((r) => {
        if (r.status === 'PRESENT') present += 1;
        else if (r.status === 'HALF_DAY') halfDay += 1;
        else if (r.status === 'PAID_LEAVE') paidLeave += 1;
        else if (r.status === 'UNPAID_LEAVE') unpaidLeave += 1;
        else if (r.status === 'HOLIDAY') holidays += 1;
        else if (r.status === 'ABSENT') absent += 1;
      });

      const effectiveDays = present + halfDay * 0.5 + paidLeave + holidays;
      const accruedBaseWage =
        emp.employmentType === 'DAILY_WAGE' || emp.employmentType === 'CONTRACT_WORKER'
          ? MoneyUtils.round(emp.dailyWage * effectiveDays)
          : emp.monthlySalary;

      return {
        employee: emp,
        present,
        halfDay,
        paidLeave,
        unpaidLeave,
        holidays,
        absent,
        effectiveDays,
        accruedBaseWage,
      };
    });
  }, [employees, attendance, selectedMonth, selectedYear]);

  // Handler to toggle an employee's status for the selected date
  const handleSetStatus = (employeeId: string, status: AttendanceStatus) => {
    if (!isAdmin) return;
    const existing = dayRecordsMap.get(employeeId);
    let updated: AttendanceRecord[];

    if (existing) {
      updated = attendance.map((rec) =>
        rec.id === existing.id
          ? {
              ...rec,
              status,
              hoursWorked: status === 'HALF_DAY' ? 4 : status === 'PRESENT' ? 8 : 0,
            }
          : rec
      );
    } else {
      const newRec: AttendanceRecord = {
        id: `ATT-${employeeId}-${selectedDate}`,
        employeeId,
        date: selectedDate,
        status,
        hoursWorked: status === 'HALF_DAY' ? 4 : status === 'PRESENT' ? 8 : 0,
        recordedBy: 'Site Admin Live',
      };
      updated = [...attendance, newRec];
    }

    onUpdateAttendance(updated);
  };

  // Batch Mark All as PRESENT for quick construction roll call
  const handleMarkAllPresent = () => {
    if (!isAdmin) return;
    const updated = [...attendance];
    employees.forEach((emp) => {
      const existingIndex = updated.findIndex(
        (r) => r.employeeId === emp.id && r.date === selectedDate
      );
      if (existingIndex >= 0) {
        updated[existingIndex] = {
          ...updated[existingIndex],
          status: 'PRESENT',
          hoursWorked: 8,
        };
      } else {
        updated.push({
          id: `ATT-${emp.id}-${selectedDate}`,
          employeeId: emp.id,
          date: selectedDate,
          status: 'PRESENT',
          hoursWorked: 8,
          recordedBy: 'Site Admin Batch Present',
        });
      }
    });
    onUpdateAttendance(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header & Date Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Attendance &amp; Daily Wage Computation
          </h2>
          <p className="text-xs text-slate-400">
            Daily site muster roll &bull; Formula: <strong>Daily Wage × Paid Working Days = Base Salary</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
            <Calendar className="h-4 w-4 text-amber-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white outline-none cursor-pointer"
            />
          </div>

          {isAdmin && (
            <button
              onClick={handleMarkAllPresent}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Mark All Present</span>
            </button>
          )}
        </div>
      </div>

      {/* Daily Muster Roster on Selected Date */}
      <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <CalendarCheck2 className="h-4 w-4 text-amber-400" />
            <span>Muster Roll for {selectedDate}</span>
          </h3>
          <span className="text-xs text-slate-400">Click any status to update worker attendance</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.map((emp) => {
            const currentRec = dayRecordsMap.get(emp.id);
            const status: AttendanceStatus = currentRec?.status || 'PRESENT';

            return (
              <div
                key={emp.id}
                className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={emp.profilePhoto}
                    alt={emp.fullName}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                  />
                  <div>
                    <div className="font-bold text-white text-xs flex items-center gap-1.5">
                      <span>{emp.fullName}</span>
                      <span className="text-[10px] font-mono text-amber-400">{emp.id}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {emp.skillTrade} &bull;{' '}
                      <span className="text-amber-300 font-semibold">
                        {emp.employmentType === 'DAILY_WAGE'
                          ? `₹${emp.dailyWage}/day`
                          : `₹${emp.monthlySalary}/mo`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Toggle Buttons */}
                <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold">
                  <button
                    disabled={!isAdmin}
                    onClick={() => handleSetStatus(emp.id, 'PRESENT')}
                    className={`py-1.5 px-2 rounded-lg transition-all ${
                      status === 'PRESENT'
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    PRESENT (8h)
                  </button>
                  <button
                    disabled={!isAdmin}
                    onClick={() => handleSetStatus(emp.id, 'HALF_DAY')}
                    className={`py-1.5 px-2 rounded-lg transition-all ${
                      status === 'HALF_DAY'
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    HALF (4h)
                  </button>
                  <button
                    disabled={!isAdmin}
                    onClick={() => handleSetStatus(emp.id, 'ABSENT')}
                    className={`py-1.5 px-2 rounded-lg transition-all ${
                      status === 'ABSENT'
                        ? 'bg-rose-500 text-white shadow-sm'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    ABSENT
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-[10px] font-semibold">
                  <button
                    disabled={!isAdmin}
                    onClick={() => handleSetStatus(emp.id, 'PAID_LEAVE')}
                    className={`py-1 px-2 rounded-lg transition-all ${
                      status === 'PAID_LEAVE'
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    PAID LEAVE
                  </button>
                  <button
                    disabled={!isAdmin}
                    onClick={() => handleSetStatus(emp.id, 'HOLIDAY')}
                    className={`py-1 px-2 rounded-lg transition-all ${
                      status === 'HOLIDAY'
                        ? 'bg-indigo-500 text-white'
                        : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    HOLIDAY / OFF
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* September 2026 Accrued Wage Matrix */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-lg space-y-3 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">
            September 2026 Accrued Wages by Attendance Breakdown
          </h3>
          <span className="text-xs text-amber-400 font-mono font-semibold">
            Effective Working Days = Present + (Half Days × 0.5) + Paid Leave + Sundays
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 border-b border-slate-800 text-slate-400 font-semibold uppercase">
              <tr>
                <th className="px-4 py-2.5">Worker</th>
                <th className="px-4 py-2.5">Type</th>
                <th className="px-4 py-2.5 text-center">Present</th>
                <th className="px-4 py-2.5 text-center">Half Days</th>
                <th className="px-4 py-2.5 text-center">Leaves</th>
                <th className="px-4 py-2.5 text-center">Sundays</th>
                <th className="px-4 py-2.5 text-center">Effective Days</th>
                <th className="px-4 py-2.5 text-right">Earned Base Wage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {monthlyStats.map((stat) => (
                <tr key={stat.employee.id} className="hover:bg-slate-800/40">
                  <td className="px-4 py-3 font-semibold text-white flex items-center gap-2">
                    <img
                      src={stat.employee.profilePhoto}
                      alt={stat.employee.fullName}
                      className="w-7 h-7 rounded-lg object-cover"
                    />
                    <span>{stat.employee.fullName}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {stat.employee.employmentType.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-emerald-400 font-bold">{stat.present}</td>
                  <td className="px-4 py-3 text-center text-amber-400 font-bold">{stat.halfDay}</td>
                  <td className="px-4 py-3 text-center text-blue-400 font-bold">{stat.paidLeave}</td>
                  <td className="px-4 py-3 text-center text-slate-400">{stat.holidays}</td>
                  <td className="px-4 py-3 text-center font-mono font-bold text-amber-400">
                    {stat.effectiveDays}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-white">
                    {MoneyUtils.formatINR(stat.accruedBaseWage)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
