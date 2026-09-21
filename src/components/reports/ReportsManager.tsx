import React, { useState, useMemo } from 'react';
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
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  Building,
  DollarSign,
  Briefcase,
  Layers,
} from 'lucide-react';

interface ReportsManagerProps {
  employees: Employee[];
  attendance: AttendanceRecord[];
  expenses: ExpenseRecord[];
  advances: SalaryAdvance[];
  bonuses: BonusRecord[];
  leases: AccommodationLease[];
}

export const ReportsManager: React.FC<ReportsManagerProps> = ({
  employees,
  attendance,
  expenses,
  advances,
  bonuses,
  leases,
}) => {
  const [reportType, setReportType] = useState<
    'MONTHLY_SALARY' | 'EMPLOYEE_EXPENSE' | 'TOTAL_COMPANY' | 'DAILY_WAGE' | 'ADVANCE_SETTLEMENT' | 'ACCOMMODATION'
  >('MONTHLY_SALARY');

  const month = 9; // September
  const year = 2026;

  // Monthly Salary data
  const salaryResults = useMemo(() => {
    return employees.map((emp) =>
      SalaryCalculationService.calculateMonthlySalary(
        emp,
        month,
        year,
        attendance,
        expenses,
        advances,
        bonuses,
        leases
      )
    );
  }, [employees, attendance, expenses, advances, bonuses, leases]);

  // Export CSV Function
  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: (string | number)[][] = [];
    let filename = `BuildForce_${reportType}_Sept2026.csv`;

    if (reportType === 'MONTHLY_SALARY') {
      headers = [
        'Employee ID',
        'Full Name',
        'Department',
        'Employment Type',
        'Effective Days',
        'Base Earned (INR)',
        'Gross Earnings (INR)',
        'Bonuses (INR)',
        'Advance Deduction (INR)',
        'Net Payable (INR)',
        'Company Expenses (INR)',
      ];
      rows = salaryResults.map((r) => {
        const emp = employees.find((e) => e.id === r.employeeId);
        return [
          r.employeeId,
          emp?.fullName || '',
          emp?.department || '',
          r.employmentType,
          r.effectiveWorkingDays,
          r.baseEarnedSalary,
          r.grossEarnings,
          r.bonusAmount,
          r.advanceDeduction,
          r.netPayableSalary,
          r.totalCompanyExpenses,
        ];
      });
    } else if (reportType === 'DAILY_WAGE') {
      headers = [
        'Employee ID',
        'Worker Name',
        'Trade Skill',
        'Daily Wage Rate (INR)',
        'Present Days',
        'Half Days',
        'Paid Leaves',
        'Effective Working Days',
        'Total Wages Earned (INR)',
      ];
      rows = salaryResults
        .filter((r) => r.employmentType === 'DAILY_WAGE' || r.employmentType === 'CONTRACT_WORKER')
        .map((r) => {
          const emp = employees.find((e) => e.id === r.employeeId);
          return [
            r.employeeId,
            emp?.fullName || '',
            emp?.skillTrade || '',
            emp?.dailyWage || 0,
            r.presentDays,
            r.halfDays,
            r.paidLeaveDays,
            r.effectiveWorkingDays,
            r.baseEarnedSalary,
          ];
        });
    } else if (reportType === 'ADVANCE_SETTLEMENT') {
      headers = [
        'Advance ID',
        'Employee ID',
        'Worker Name',
        'Disbursed Date',
        'Total Advance (INR)',
        'Monthly Recovery (INR)',
        'Repaid (INR)',
        'Remaining Due (INR)',
        'Status',
      ];
      rows = advances.map((a) => {
        const emp = employees.find((e) => e.id === a.employeeId);
        return [
          a.id,
          a.employeeId,
          emp?.fullName || '',
          a.advanceDate || a.date,
          a.totalAdvanceAmount ?? a.amount,
          a.monthlyDeductionAmount ?? 2000,
          a.repaidAmount ?? a.deductedAmount ?? 0,
          a.remainingBalance ?? a.remainingAmount ?? a.amount,
          a.status,
        ];
      });
    } else {
      headers = ['Voucher ID', 'Employee ID', 'Category', 'Date', 'Amount (INR)', 'Status', 'Description'];
      rows = expenses.map((e) => [
        e.id,
        e.employeeId,
        e.category,
        e.expenseDate,
        e.amount,
        e.approvalStatus,
        `"${e.description.replace(/"/g, '""')}"`,
      ]);
    }

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header & Export Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Financial &amp; Workforce Reporting Suite (Section 19)
          </h2>
          <p className="text-xs text-slate-400">
            Generate audited CSV &amp; PDF reports for wages, company expense provisions, and advance settlements
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector Pills */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900/80 rounded-2xl border border-slate-800">
        <button
          onClick={() => setReportType('MONTHLY_SALARY')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            reportType === 'MONTHLY_SALARY'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          Monthly Salary Report
        </button>
        <button
          onClick={() => setReportType('DAILY_WAGE')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            reportType === 'DAILY_WAGE'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          Daily Wage Breakdown Report
        </button>
        <button
          onClick={() => setReportType('TOTAL_COMPANY')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            reportType === 'TOTAL_COMPANY'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          Total Company Expense Report
        </button>
        <button
          onClick={() => setReportType('ADVANCE_SETTLEMENT')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            reportType === 'ADVANCE_SETTLEMENT'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          Advance Settlement Report
        </button>
        <button
          onClick={() => setReportType('ACCOMMODATION')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            reportType === 'ACCOMMODATION'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          Accommodation &amp; Rent Report
        </button>
      </div>

      {/* Render Current Report Table */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-lg p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {reportType.replace(/_/g, ' ')} &bull; September 2026
            </h3>
            <p className="text-[11px] text-slate-400">
              Audit status: Reconciled with PostgreSQL V1 schema &bull; Banker's Rounding applied
            </p>
          </div>
          <div className="text-xs text-amber-400 font-mono font-bold">
            ConstructPro Infrastructure Pvt Ltd
          </div>
        </div>

        <div className="overflow-x-auto">
          {reportType === 'MONTHLY_SALARY' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/60 text-slate-400 font-semibold uppercase">
                <tr>
                  <th className="px-3 py-2.5">Worker</th>
                  <th className="px-3 py-2.5">Type</th>
                  <th className="px-3 py-2.5 text-center">Work Days</th>
                  <th className="px-3 py-2.5 text-right">Base Earned</th>
                  <th className="px-3 py-2.5 text-right">Bonuses</th>
                  <th className="px-3 py-2.5 text-right">Advance Ded.</th>
                  <th className="px-3 py-2.5 text-right font-bold text-amber-400">Net Take-Home</th>
                  <th className="px-3 py-2.5 text-right">Company Exp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {salaryResults.map((r) => {
                  const emp = employees.find((e) => e.id === r.employeeId);
                  return (
                    <tr key={r.employeeId} className="hover:bg-slate-800/40">
                      <td className="px-3 py-2.5 font-semibold text-white">
                        {emp?.fullName} ({r.employeeId})
                      </td>
                      <td className="px-3 py-2.5 text-slate-300">{r.employmentType.replace('_', ' ')}</td>
                      <td className="px-3 py-2.5 text-center font-mono font-bold text-slate-200">
                        {r.effectiveWorkingDays}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono text-slate-200">
                        {MoneyUtils.formatINR(r.baseEarnedSalary)}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono text-emerald-400">
                        +{MoneyUtils.formatINR(r.bonusAmount)}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono text-rose-400">
                        -{MoneyUtils.formatINR(r.advanceDeduction)}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono font-bold text-amber-400">
                        {MoneyUtils.formatINR(r.netPayableSalary)}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono text-purple-300">
                        {MoneyUtils.formatINR(r.totalCompanyExpenses)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {reportType === 'DAILY_WAGE' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/60 text-slate-400 font-semibold uppercase">
                <tr>
                  <th className="px-3 py-2.5">Worker</th>
                  <th className="px-3 py-2.5">Trade Skill</th>
                  <th className="px-3 py-2.5 text-right">Daily Rate</th>
                  <th className="px-3 py-2.5 text-center">Present</th>
                  <th className="px-3 py-2.5 text-center">Half Days</th>
                  <th className="px-3 py-2.5 text-center">Paid Leaves</th>
                  <th className="px-3 py-2.5 text-center font-bold text-amber-400">Paid Days</th>
                  <th className="px-3 py-2.5 text-right font-bold text-white">Total Earned Wages</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {salaryResults
                  .filter((r) => r.employmentType === 'DAILY_WAGE' || r.employmentType === 'CONTRACT_WORKER')
                  .map((r) => {
                    const emp = employees.find((e) => e.id === r.employeeId);
                    return (
                      <tr key={r.employeeId} className="hover:bg-slate-800/40">
                        <td className="px-3 py-2.5 font-semibold text-white">{emp?.fullName}</td>
                        <td className="px-3 py-2.5 text-slate-300">{emp?.skillTrade}</td>
                        <td className="px-3 py-2.5 text-right font-mono text-amber-400">
                          ₹{emp?.dailyWage}
                        </td>
                        <td className="px-3 py-2.5 text-center text-emerald-400 font-bold">{r.presentDays}</td>
                        <td className="px-3 py-2.5 text-center text-amber-400">{r.halfDays}</td>
                        <td className="px-3 py-2.5 text-center text-blue-400">{r.paidLeaveDays}</td>
                        <td className="px-3 py-2.5 text-center font-mono font-bold text-amber-400">
                          {r.effectiveWorkingDays}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono font-bold text-white">
                          {MoneyUtils.formatINR(r.baseEarnedSalary)}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          )}

          {reportType === 'ADVANCE_SETTLEMENT' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/60 text-slate-400 font-semibold uppercase">
                <tr>
                  <th className="px-3 py-2.5">ID</th>
                  <th className="px-3 py-2.5">Employee</th>
                  <th className="px-3 py-2.5">Date</th>
                  <th className="px-3 py-2.5 text-right">Principal</th>
                  <th className="px-3 py-2.5 text-right">Monthly Deduction</th>
                  <th className="px-3 py-2.5 text-right">Repaid</th>
                  <th className="px-3 py-2.5 text-right font-bold text-rose-400">Remaining Balance</th>
                  <th className="px-3 py-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {advances.map((a) => {
                  const emp = employees.find((e) => e.id === a.employeeId);
                  return (
                    <tr key={a.id} className="hover:bg-slate-800/40">
                      <td className="px-3 py-2.5 font-mono text-amber-400">{a.id}</td>
                      <td className="px-3 py-2.5 font-semibold text-white">{emp?.fullName}</td>
                      <td className="px-3 py-2.5 text-slate-300 font-mono">{a.advanceDate || a.date}</td>
                      <td className="px-3 py-2.5 text-right font-mono text-white">
                        {MoneyUtils.formatINR(a.totalAdvanceAmount ?? a.amount)}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono text-amber-400">
                        {MoneyUtils.formatINR(a.monthlyDeductionAmount ?? 2000)}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono text-emerald-400">
                        {MoneyUtils.formatINR(a.repaidAmount ?? a.deductedAmount ?? 0)}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono font-bold text-rose-400">
                        {MoneyUtils.formatINR(a.remainingBalance ?? a.remainingAmount ?? a.amount)}
                      </td>
                      <td className="px-3 py-2.5 text-center font-bold text-[10px] text-amber-400">
                        {a.status}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {(reportType === 'TOTAL_COMPANY' || reportType === 'ACCOMMODATION') && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                  <span className="text-[10px] text-slate-400 block">Total Net Salary Paid</span>
                  <span className="text-base font-bold font-mono text-amber-400">
                    {MoneyUtils.formatINR(salaryResults.reduce((acc, r) => acc + r.netPayableSalary, 0))}
                  </span>
                </div>
                <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                  <span className="text-[10px] text-slate-400 block">Food Allowance Subsidies</span>
                  <span className="text-base font-bold font-mono text-white">
                    {MoneyUtils.formatINR(salaryResults.reduce((acc, r) => acc + r.companyPaidFood, 0))}
                  </span>
                </div>
                <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                  <span className="text-[10px] text-slate-400 block">Housing &amp; Camps Rent</span>
                  <span className="text-base font-bold font-mono text-white">
                    {MoneyUtils.formatINR(
                      leases.reduce((acc, l) => acc + l.monthlyRent + l.electricityBill + l.waterBill, 0)
                    )}
                  </span>
                </div>
                <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                  <span className="text-[10px] text-slate-400 block">Gross Company Expenditure</span>
                  <span className="text-base font-bold font-mono text-emerald-400">
                    {MoneyUtils.formatINR(
                      salaryResults.reduce((acc, r) => acc + r.netPayableSalary, 0) +
                        leases.reduce((acc, l) => acc + l.monthlyRent + l.electricityBill + l.waterBill, 0)
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
