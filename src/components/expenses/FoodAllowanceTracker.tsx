import React from 'react';
import { Employee, ExpenseRecord } from '../../types';
import { MoneyUtils } from '../../services/salaryEngine';
import { Utensils, CheckCircle, AlertCircle } from 'lucide-react';

interface FoodAllowanceTrackerProps {
  employees: Employee[];
  expenses: ExpenseRecord[];
  month?: number;
  year?: number;
}

export const FoodAllowanceTracker: React.FC<FoodAllowanceTrackerProps> = ({
  employees,
  expenses,
  month = 9,
  year = 2026,
}) => {
  // Aggregate food expenses for each employee in selected month
  const trackerData = employees.map((emp) => {
    const allocated = emp.foodAllowance || 3000;
    const foodExpenses = expenses.filter((e) => {
      if (e.employeeId !== emp.id || e.category !== 'FOOD') return false;
      const d = new Date(e.expenseDate);
      return (
        d.getMonth() + 1 === month &&
        d.getFullYear() === year &&
        (e.approvalStatus === 'APPROVED' || e.approvalStatus === 'PAID')
      );
    });

    const used = foodExpenses.reduce((acc, e) => acc + e.amount, 0);
    const remaining = Math.max(0, allocated - used);
    const percentUsed = Math.min(100, Math.round((used / allocated) * 100));

    return {
      employee: emp,
      allocated,
      used,
      remaining,
      percentUsed,
    };
  });

  return (
    <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Utensils className="h-4 w-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white">
            Food Allowance &amp; Canteen Subsidies Tracker (Sept 2026)
          </h3>
        </div>
        <span className="text-xs text-slate-400">
          Enforces per-worker monthly allowance ceilings
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trackerData.map(({ employee, allocated, used, remaining, percentUsed }) => (
          <div
            key={employee.id}
            className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={employee.profilePhoto}
                  alt={employee.fullName}
                  className="w-8 h-8 rounded-lg object-cover"
                />
                <div>
                  <h4 className="font-bold text-white text-xs">{employee.fullName}</h4>
                  <span className="text-[10px] font-mono text-slate-400">{employee.id}</span>
                </div>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  remaining > 0
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}
              >
                {remaining > 0 ? 'Within Cap' : 'Exhausted'}
              </span>
            </div>

            {/* Metrics Breakdown (Requirement 11) */}
            <div className="grid grid-cols-3 gap-1 text-center py-1 bg-slate-900/60 rounded-lg text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Allocated</span>
                <span className="font-mono font-semibold text-slate-200">
                  {MoneyUtils.formatINR(allocated)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Used</span>
                <span className="font-mono font-bold text-amber-400">
                  {MoneyUtils.formatINR(used)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Remaining</span>
                <span className="font-mono font-bold text-emerald-400">
                  {MoneyUtils.formatINR(remaining)}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Utilization</span>
                <span>{percentUsed}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    percentUsed > 90 ? 'bg-rose-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${percentUsed}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
