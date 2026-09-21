import React, { useState, useMemo } from 'react';
import {
  Employee,
  ExpenseRecord,
  AttendanceRecord,
  SalaryAdvance,
  BonusRecord,
  AccommodationLease,
} from '../../types';
import { MoneyUtils } from '../../services/salaryEngine';
import {
  Users,
  Wallet,
  Receipt,
  HandCoins,
  Gift,
  Building2,
  TrendingUp,
  AlertCircle,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  PieChart,
} from 'lucide-react';

interface AdminDashboardProps {
  employees: Employee[];
  expenses: ExpenseRecord[];
  attendance: AttendanceRecord[];
  advances: SalaryAdvance[];
  bonuses: BonusRecord[];
  leases: AccommodationLease[];
  onNavigateToTab: (tab: any) => void;
  onOpenSalaryProcessing: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  employees,
  expenses,
  advances,
  bonuses,
  leases,
  onNavigateToTab,
  onOpenSalaryProcessing,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(9);
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [filterDepartment, setFilterDepartment] = useState<string>('ALL');

  // Filter employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      if (filterDepartment !== 'ALL' && emp.department !== filterDepartment) return false;
      return true;
    });
  }, [employees, filterDepartment]);

  const departments = useMemo(() => {
    const set = new Set(employees.map((e) => e.department));
    return ['ALL', ...Array.from(set)];
  }, [employees]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter((e) => e.status === 'ACTIVE').length;
    const inactiveEmployees = employees.filter((e) => e.status !== 'ACTIVE').length;
    const dailyWorkers = employees.filter(
      (e) => e.employmentType === 'DAILY_WAGE' || e.employmentType === 'CONTRACT_WORKER'
    ).length;
    const monthlyWorkers = employees.filter(
      (e) => e.employmentType === 'MONTHLY_SALARY'
    ).length;

    // Current month expenses
    const monthExpenses = expenses.filter((e) => {
      const d = new Date(e.expenseDate);
      return d.getMonth() + 1 === selectedMonth && d.getFullYear() === selectedYear;
    });

    const pendingApprovals = monthExpenses.filter((e) => e.approvalStatus === 'PENDING').length;

    let totalFood = 0;
    let totalTravel = 0;
    let totalDailyExp = 0;
    let totalMedicalOther = 0;

    monthExpenses
      .filter((e) => e.approvalStatus === 'APPROVED' || e.approvalStatus === 'PAID')
      .forEach((e) => {
        if (e.category === 'FOOD') totalFood += e.amount;
        else if (e.category === 'TRAVEL') totalTravel += e.amount;
        else if (e.category === 'DAILY_EXPENSE') totalDailyExp += e.amount;
        else totalMedicalOther += e.amount;
      });

    // Rent from accommodations
    const totalRent = leases
      .filter((l) => l.isCompanyPaid)
      .reduce((acc, l) => acc + l.monthlyRent + l.electricityBill + l.waterBill, 0);

    const totalCompanyExpenses = totalFood + totalTravel + totalDailyExp + totalMedicalOther + totalRent;

    // Monthly Salary Liability estimate
    // Monthly employees base + daily workers estimate (~25 working days)
    const monthlySalaryLiability = employees.reduce((acc, emp) => {
      if (emp.employmentType === 'MONTHLY_SALARY') {
        return acc + emp.monthlySalary + (emp.foodAllowance || 0) + (emp.travelAllowance || 0);
      } else {
        return acc + emp.dailyWage * 25 + (emp.foodAllowance || 0) + (emp.travelAllowance || 0);
      }
    }, 0);

    // Total bonuses for month
    const totalBonuses = bonuses
      .filter((b) => b.month === selectedMonth && b.year === selectedYear)
      .reduce((acc, b) => acc + b.amount, 0);

    // Total advances pending/active
    const totalAdvances = advances.reduce(
      (acc, a) => acc + (a.remainingAmount ?? a.remainingBalance ?? a.amount ?? 0),
      0
    );

    const totalCompanyOutlay = monthlySalaryLiability + totalCompanyExpenses + totalBonuses;

    return {
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      dailyWorkers,
      monthlyWorkers,
      monthlySalaryLiability,
      totalCompanyExpenses,
      totalFood,
      totalTravel,
      totalRent,
      totalDailyExp,
      totalMedicalOther,
      totalBonuses,
      totalAdvances,
      pendingApprovals,
      totalCompanyOutlay,
    };
  }, [employees, expenses, advances, bonuses, leases, selectedMonth, selectedYear]);

  return (
    <div className="space-y-6">
      {/* Top Filter Bar & Processing Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Executive Site Overview</h2>
          <p className="text-xs text-slate-400">
            Real-time financial liabilities, workforce distribution, and expense audit summary
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-200 outline-none cursor-pointer"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept} className="bg-slate-900 text-slate-200">
                  {dept === 'ALL' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
            <span className="text-xs font-medium text-slate-400">Month:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="bg-transparent text-xs font-semibold text-amber-400 outline-none cursor-pointer"
            >
              <option value={9} className="bg-slate-900">September 2026</option>
              <option value={8} className="bg-slate-900">August 2026</option>
              <option value={10} className="bg-slate-900">October 2026</option>
            </select>
          </div>

          <button
            onClick={onOpenSalaryProcessing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Wallet className="h-4 w-4" />
            <span>Process Payroll</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Workforce */}
        <div
          onClick={() => onNavigateToTab('employees')}
          className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Workforce
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white">{metrics.totalEmployees}</span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> {metrics.activeEmployees} Active
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span>Daily: {metrics.dailyWorkers}</span>
            <span>Monthly: {metrics.monthlyWorkers}</span>
          </div>
        </div>

        {/* Est. Salary Liability */}
        <div
          onClick={() => onNavigateToTab('salary')}
          className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Salary Liability
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-amber-400 font-mono">
              {MoneyUtils.formatINR(metrics.monthlySalaryLiability)}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Sept 2026</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span>Includes Allowances</span>
            <span className="text-amber-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Review <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
        </div>

        {/* Company-Paid Expenses */}
        <div
          onClick={() => onNavigateToTab('expenses')}
          className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Company-Paid Expenses
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Receipt className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white font-mono">
              {MoneyUtils.formatINR(metrics.totalCompanyExpenses)}
            </span>
            {metrics.pendingApprovals > 0 ? (
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30 animate-pulse">
                {metrics.pendingApprovals} Pending
              </span>
            ) : (
              <span className="text-xs text-emerald-400 font-semibold">All Approved</span>
            )}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span>Food: {MoneyUtils.formatINR(metrics.totalFood)}</span>
            <span>Rent: {MoneyUtils.formatINR(metrics.totalRent)}</span>
          </div>
        </div>

        {/* Advances & Total Outlay */}
        <div
          onClick={() => onNavigateToTab('advances')}
          className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Advances &amp; Total Outlay
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <HandCoins className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white font-mono">
              {MoneyUtils.formatINR(metrics.totalCompanyOutlay)}
            </span>
            <span className="text-xs text-slate-400">Total Outlay</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span>Active Debt: {MoneyUtils.formatINR(metrics.totalAdvances)}</span>
            <span className="text-emerald-400">Bonuses: {MoneyUtils.formatINR(metrics.totalBonuses)}</span>
          </div>
        </div>
      </div>

      {/* Visual Analytics & Breakdown Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expense Category Breakdown (Visual Bars) */}
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieChart className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Expense Distribution (Company-Paid Liabilities)</h3>
            </div>
            <span className="text-xs font-mono text-slate-400 font-semibold">
              Total: {MoneyUtils.formatINR(metrics.totalCompanyExpenses)}
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {/* Rent & Accommodation */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Accommodation &amp; Utilities (Rent + Power + Water)</span>
                <span className="font-mono text-slate-200 font-semibold">
                  {MoneyUtils.formatINR(metrics.totalRent)}
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${metrics.totalCompanyExpenses > 0 ? (metrics.totalRent / metrics.totalCompanyExpenses) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* Food Allowance */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Labour Mess &amp; Food Subsidy</span>
                <span className="font-mono text-slate-200 font-semibold">
                  {MoneyUtils.formatINR(metrics.totalFood)}
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${metrics.totalCompanyExpenses > 0 ? (metrics.totalFood / metrics.totalCompanyExpenses) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* Travel & Transport */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Site Travel &amp; Logistics (Taxis, Buses, Depot)</span>
                <span className="font-mono text-slate-200 font-semibold">
                  {MoneyUtils.formatINR(metrics.totalTravel)}
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${metrics.totalCompanyExpenses > 0 ? (metrics.totalTravel / metrics.totalCompanyExpenses) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* Daily Minor Expenses */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Daily Site Emergency Procurements (Tools/Fasteners)</span>
                <span className="font-mono text-slate-200 font-semibold">
                  {MoneyUtils.formatINR(metrics.totalDailyExp)}
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${metrics.totalCompanyExpenses > 0 ? (metrics.totalDailyExp / metrics.totalCompanyExpenses) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Workforce Category Card */}
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 className="h-4 w-4 text-amber-400" />
                <span>Workforce Types</span>
              </h3>
              <span className="text-xs text-slate-400 font-semibold">100+ On-Site</span>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="text-xs font-semibold text-slate-200">Daily Wage Workers</span>
                </div>
                <span className="text-xs font-bold text-white">{metrics.dailyWorkers}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                  <span className="text-xs font-semibold text-slate-200">Monthly Salaried</span>
                </div>
                <span className="text-xs font-bold text-white">{metrics.monthlyWorkers}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-semibold text-slate-200">Company Accommodation</span>
                </div>
                <span className="text-xs font-bold text-white">
                  {employees.filter((e) => e.accommodationStatus === 'COMPANY_PROVIDED').length}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <p className="leading-tight text-[11px]">
              Ready for September 2026 payroll review. Daily wages will be automatically multiplied by authenticated bio-metric presence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
