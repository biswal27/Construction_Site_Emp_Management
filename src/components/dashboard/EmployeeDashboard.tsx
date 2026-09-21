import React, { useMemo } from 'react';
import {
  Employee,
  AttendanceRecord,
  ExpenseRecord,
  SalaryAdvance,
  BonusRecord,
  AccommodationLease,
} from '../../types';
import { SalaryCalculationService, MoneyUtils } from '../../services/salaryEngine';
import {
  CalendarCheck,
  Wallet,
  Receipt,
  HandCoins,
  Gift,
  Download,
  PlusCircle,
  Clock,
  Home,
  CheckCircle2,
} from 'lucide-react';

interface EmployeeDashboardProps {
  employee: Employee;
  attendance: AttendanceRecord[];
  expenses: ExpenseRecord[];
  advances: SalaryAdvance[];
  bonuses: BonusRecord[];
  leases: AccommodationLease[];
  onOpenSubmitExpense: () => void;
  onOpenPayslip: (employee: Employee) => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({
  employee,
  attendance,
  expenses,
  advances,
  bonuses,
  leases,
  onOpenSubmitExpense,
  onOpenPayslip,
}) => {
  const currentMonth = 9; // September
  const currentYear = 2026;

  // Run deterministic salary calculation for this employee
  const payrollSummary = useMemo(() => {
    return SalaryCalculationService.calculateMonthlySalary(
      employee,
      currentMonth,
      currentYear,
      attendance,
      expenses,
      advances,
      bonuses,
      leases
    );
  }, [employee, attendance, expenses, advances, bonuses, leases]);

  // Food Allowance tracking (allocated vs used vs remaining)
  const foodAllocated = employee.foodAllowance || 3000;
  const foodUsed = payrollSummary.companyPaidFood;
  const foodRemaining = Math.max(0, foodAllocated - foodUsed);

  // Filter recent expenses for this employee
  const recentExpenses = useMemo(() => {
    return expenses
      .filter((e) => e.employeeId === employee.id)
      .slice(0, 4);
  }, [expenses, employee.id]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Profile & Current Payroll Cycle Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={employee.profilePhoto}
            alt={employee.fullName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500/40 shadow-md shadow-amber-500/10"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">{employee.fullName}</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-semibold border border-amber-500/30">
                {employee.id}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              {employee.designation} &bull; <span className="text-slate-400">{employee.department}</span>
            </p>
            <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400">
              <span>Trade: <strong className="text-slate-300">{employee.skillTrade}</strong></span>
              <span>&bull;</span>
              <span>Type: <strong className="text-amber-400">{employee.employmentType.replace('_', ' ')}</strong></span>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={onOpenSubmitExpense}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Submit Expense</span>
          </button>
          <button
            onClick={() => onOpenPayslip(employee)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-all cursor-pointer"
          >
            <Download className="h-4 w-4 text-amber-400" />
            <span>Payslip</span>
          </button>
        </div>
      </div>

      {/* Primary Financial Summary Cards (Requirement 17) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Base Earned Salary */}
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-medium">
            <span>{employee.employmentType === 'DAILY_WAGE' ? 'Earned Wages' : 'Base Salary'}</span>
            <Wallet className="h-3.5 w-3.5 text-blue-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {MoneyUtils.formatINR(payrollSummary.baseEarnedSalary)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {employee.employmentType === 'DAILY_WAGE'
              ? `${payrollSummary.effectiveWorkingDays} days @ ₹${employee.dailyWage}`
              : 'Configured monthly'}
          </div>
        </div>

        {/* Bonuses */}
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-medium">
            <span>Festival Bonus</span>
            <Gift className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            +{MoneyUtils.formatINR(payrollSummary.bonusAmount)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Project milestone</div>
        </div>

        {/* Advances Deducted */}
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-medium">
            <span>Advance Deducted</span>
            <HandCoins className="h-3.5 w-3.5 text-rose-400" />
          </div>
          <div className="text-xl font-bold font-mono text-rose-400">
            -{MoneyUtils.formatINR(payrollSummary.advanceDeduction)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">From active balance</div>
        </div>

        {/* Company-Paid Expenses */}
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-medium">
            <span>Expenses Paid</span>
            <Receipt className="h-3.5 w-3.5 text-purple-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {MoneyUtils.formatINR(payrollSummary.totalCompanyExpenses)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Paid on your behalf</div>
        </div>

        {/* Net Payable Salary */}
        <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 p-4 rounded-2xl border border-amber-500/40 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-xs text-amber-300 mb-1.5 font-bold">
            <span>Net Payable</span>
            <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-400">
            {MoneyUtils.formatINR(payrollSummary.netPayableSalary)}
          </div>
          <div className="text-[11px] text-amber-300/80 mt-1 font-medium">Sept 2026 Take-Home</div>
        </div>
      </div>

      {/* Attendance & Food Allowance Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Attendance Summary */}
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CalendarCheck className="h-4 w-4 text-amber-400" />
              <span>September 2026 Attendance</span>
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              Total: {payrollSummary.totalDaysInMonth} Days
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="text-xl font-bold text-emerald-400">{payrollSummary.presentDays}</div>
              <div className="text-[11px] font-medium text-slate-400">Present</div>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <div className="text-xl font-bold text-amber-400">{payrollSummary.halfDays}</div>
              <div className="text-[11px] font-medium text-slate-400">Half Days</div>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <div className="text-xl font-bold text-blue-400">{payrollSummary.paidLeaveDays}</div>
              <div className="text-[11px] font-medium text-slate-400">Paid Leave</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
              <div className="text-xl font-bold text-slate-200">{payrollSummary.holidays}</div>
              <div className="text-[11px] font-medium text-slate-400">Sundays/Off</div>
            </div>
          </div>

          <div className="text-xs text-slate-300 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 flex justify-between items-center">
            <span>Effective Wage Credited Days:</span>
            <span className="font-bold text-amber-400 font-mono">
              {payrollSummary.effectiveWorkingDays} Days
            </span>
          </div>
        </div>

        {/* Food Allowance Usage Gauge (Requirement 11) */}
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Receipt className="h-4 w-4 text-amber-400" />
              <span>Food &amp; Mess Allowance Tracker</span>
            </h3>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              {MoneyUtils.formatINR(foodRemaining)} Remaining
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Allocated: {MoneyUtils.formatINR(foodAllocated)}</span>
              <span>Used: {MoneyUtils.formatINR(foodUsed)}</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (foodUsed / foodAllocated) * 100)}%` }}
              />
            </div>
          </div>

          {/* Company-Paid Expenses Detail */}
          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
            <div className="flex justify-between py-1 text-slate-300">
              <span className="flex items-center gap-1.5">
                <Home className="h-3.5 w-3.5 text-indigo-400" /> Company Accommodation &amp; Rent:
              </span>
              <span className="font-mono font-semibold">{MoneyUtils.formatINR(payrollSummary.companyPaidRent)}</span>
            </div>
            <div className="flex justify-between py-1 text-slate-300">
              <span>Travel &amp; Transport Reimbursements:</span>
              <span className="font-mono font-semibold">{MoneyUtils.formatINR(payrollSummary.companyPaidTravel)}</span>
            </div>
            <div className="flex justify-between py-1 text-slate-300">
              <span>Daily Minor Site Expenses:</span>
              <span className="font-mono font-semibold">{MoneyUtils.formatINR(payrollSummary.companyPaidDailyExpenses)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions & Expense Submissions */}
      <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400" />
            <span>Recent Expense Requests &amp; Approvals</span>
          </h3>
          <span className="text-xs text-slate-400">Total {recentExpenses.length} recorded</span>
        </div>

        <div className="divide-y divide-slate-800">
          {recentExpenses.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400">
              No recent expenses found for this month.
            </div>
          ) : (
            recentExpenses.map((exp) => (
              <div key={exp.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{exp.category}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        exp.approvalStatus === 'APPROVED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : exp.approvalStatus === 'PENDING'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {exp.approvalStatus}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{exp.description}</p>
                  <span className="text-[10px] text-slate-400 font-mono">{exp.expenseDate} &bull; {exp.paymentMethod}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold font-mono text-white">
                    {MoneyUtils.formatINR(exp.amount)}
                  </div>
                  {exp.receiptName && (
                    <span className="text-[10px] text-amber-400 underline cursor-pointer">
                      Receipt Attached
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
