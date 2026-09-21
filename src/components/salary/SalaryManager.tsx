import React, { useState, useMemo } from 'react';
import {
  Employee,
  AttendanceRecord,
  ExpenseRecord,
  SalaryAdvance,
  BonusRecord,
  AccommodationLease,
  SalaryCalculationResult,
  PaymentStatus,
  PaymentMethod,
} from '../../types';
import { SalaryCalculationService, MoneyUtils } from '../../services/salaryEngine';
import {
  BadgeDollarSign,
  Wallet,
  CheckCircle,
  FileText,
  CreditCard,
  Building,
  Check,
  Sparkles,
} from 'lucide-react';

interface SalaryManagerProps {
  employees: Employee[];
  attendance: AttendanceRecord[];
  expenses: ExpenseRecord[];
  advances: SalaryAdvance[];
  bonuses: BonusRecord[];
  leases: AccommodationLease[];
  onOpenPayslip: (emp: Employee) => void;
  onOpenBatchProcessing: () => void;
}

export const SalaryManager: React.FC<SalaryManagerProps> = ({
  employees,
  attendance,
  expenses,
  advances,
  bonuses,
  leases,
  onOpenPayslip,
  onOpenBatchProcessing,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(9);
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  // Maintain local payment status state for each employee
  const [paymentStatuses, setPaymentStatuses] = useState<Record<string, { status: PaymentStatus; method?: PaymentMethod; ref?: string }>>({
    'EMP-101': { status: 'PAID', method: 'BANK_TRANSFER', ref: 'CMS-HDFC-991204' },
    'EMP-102': { status: 'PROCESSED', method: 'UPI', ref: 'UPI-SBIN-884210' },
    'EMP-103': { status: 'PROCESSED', method: 'BANK_TRANSFER', ref: 'NEFT-ICIC-129034' },
    'EMP-104': { status: 'CALCULATED' },
    'EMP-105': { status: 'CALCULATED' },
    'EMP-106': { status: 'CALCULATED' },
  });

  // Calculate salary for each employee
  const payrollRows = useMemo(() => {
    return employees.map((emp) => {
      const paymentInfo = paymentStatuses[emp.id] || { status: 'CALCULATED' };
      const res = SalaryCalculationService.calculateMonthlySalary(
        emp,
        selectedMonth,
        selectedYear,
        attendance,
        expenses,
        advances,
        bonuses,
        leases,
        paymentInfo.status
      );

      return {
        ...res,
        employee: emp,
        paymentMethod: paymentInfo.method,
        transactionRef: paymentInfo.ref,
      };
    });
  }, [employees, selectedMonth, selectedYear, attendance, expenses, advances, bonuses, leases, paymentStatuses]);

  const totalPayrollNet = payrollRows.reduce((acc, r) => acc + r.netPayableSalary, 0);
  const totalCompanyExpenses = payrollRows.reduce((acc, r) => acc + r.totalCompanyExpenses, 0);
  const totalPaidCount = payrollRows.filter((r) => r.status === 'PAID').length;

  const handleMarkPaid = (employeeId: string, method: PaymentMethod) => {
    setPaymentStatuses((prev) => ({
      ...prev,
      [employeeId]: {
        status: 'PAID',
        method,
        ref: `TXN-${Date.now().toString().slice(-6)}`,
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Batch Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Salary &amp; Payroll Management</h2>
          <p className="text-xs text-slate-400">
            Automated attendance-linked payroll, advance deductions, and payment status lifecycle
          </p>
        </div>

        <button
          onClick={onOpenBatchProcessing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Sparkles className="h-4 w-4" />
          <span>Execute Monthly Payroll Processing</span>
        </button>
      </div>

      {/* Aggregate Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Total Net Take-Home Liability
          </span>
          <div className="text-2xl font-black font-mono text-amber-400">
            {MoneyUtils.formatINR(totalPayrollNet)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Across {payrollRows.length} active construction employees
          </span>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Company-Paid Expenses Non-Cash
          </span>
          <div className="text-2xl font-black font-mono text-white">
            {MoneyUtils.formatINR(totalCompanyExpenses)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Housing rent, site mess, transport &amp; materials
          </span>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Disbursement Progress
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400 font-mono">
              {totalPaidCount} / {payrollRows.length}
            </span>
            <span className="text-xs text-slate-400">Paid</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 mt-2 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${(totalPaidCount / payrollRows.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Payroll List */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Employee</th>
                <th className="px-3 py-3">Type &amp; Rate</th>
                <th className="px-3 py-3 text-center">Days</th>
                <th className="px-3 py-3 text-right">Gross Earnings</th>
                <th className="px-3 py-3 text-right">Advance Ded.</th>
                <th className="px-3 py-3 text-right">Net Payable</th>
                <th className="px-3 py-3 text-center">Payment Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {payrollRows.map((row) => (
                <tr key={row.employeeId} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={row.employee.profilePhoto}
                        alt={row.employee.fullName}
                        className="w-9 h-9 rounded-xl object-cover border border-slate-700"
                      />
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{row.employee.fullName}</span>
                          <span className="text-[10px] font-mono text-amber-400">{row.employeeId}</span>
                        </div>
                        <div className="text-[11px] text-slate-400">{row.employee.designation}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="text-slate-300 font-semibold">
                      {row.employmentType === 'DAILY_WAGE' ? (
                        <span className="text-amber-400">₹{row.employee.dailyWage}/day</span>
                      ) : (
                        <span>₹{row.employee.monthlySalary}/mo</span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400">{row.employmentType.replace('_', ' ')}</div>
                  </td>
                  <td className="px-3 py-3 text-center font-mono font-bold text-slate-200">
                    {row.effectiveWorkingDays}
                  </td>
                  <td className="px-3 py-3 text-right font-mono font-semibold text-slate-200">
                    {MoneyUtils.formatINR(row.grossEarnings)}
                  </td>
                  <td className="px-3 py-3 text-right font-mono text-rose-400">
                    {row.advanceDeduction > 0 ? `-${MoneyUtils.formatINR(row.advanceDeduction)}` : '₹0'}
                  </td>
                  <td className="px-3 py-3 text-right font-mono font-bold text-amber-400 text-sm">
                    {MoneyUtils.formatINR(row.netPayableSalary)}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        row.status === 'PAID'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : row.status === 'PROCESSED'
                          ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {row.status}
                    </span>
                    {row.transactionRef && (
                      <div className="text-[9px] font-mono text-slate-400 mt-0.5">{row.transactionRef}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onOpenPayslip(row.employee)}
                        title="View Detailed Payslip"
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
                      >
                        <FileText className="h-3.5 w-3.5 text-amber-400" />
                        <span>Payslip</span>
                      </button>

                      {row.status !== 'PAID' ? (
                        <button
                          onClick={() => handleMarkPaid(row.employeeId, 'BANK_TRANSFER')}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all cursor-pointer"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Mark Paid</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-400 font-semibold px-2 py-1">
                          Disbursed
                        </span>
                      )}
                    </div>
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
