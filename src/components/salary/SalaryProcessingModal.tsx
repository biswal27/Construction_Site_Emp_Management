import React, { useState, useMemo } from 'react';
import {
  Employee,
  AttendanceRecord,
  ExpenseRecord,
  SalaryAdvance,
  BonusRecord,
  AccommodationLease,
  SalaryCalculationResult,
} from '../../types';
import { SalaryCalculationService, MoneyUtils } from '../../services/salaryEngine';
import { X, CheckCircle2, ShieldAlert, Sparkles, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SalaryProcessingModalProps {
  employees: Employee[];
  attendance: AttendanceRecord[];
  expenses: ExpenseRecord[];
  advances: SalaryAdvance[];
  bonuses: BonusRecord[];
  leases: AccommodationLease[];
  onClose: () => void;
  onConfirmProcessing: (results: SalaryCalculationResult[]) => void;
}

export const SalaryProcessingModal: React.FC<SalaryProcessingModalProps> = ({
  employees,
  attendance,
  expenses,
  advances,
  bonuses,
  leases,
  onClose,
  onConfirmProcessing,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(9);
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // Compute calculated results for all active employees
  const calculatedRows = useMemo(() => {
    return employees
      .filter((emp) => emp.status === 'ACTIVE')
      .map((emp) =>
        SalaryCalculationService.calculateMonthlySalary(
          emp,
          selectedMonth,
          selectedYear,
          attendance,
          expenses,
          advances,
          bonuses,
          leases,
          'PROCESSED'
        )
      );
  }, [employees, selectedMonth, selectedYear, attendance, expenses, advances, bonuses, leases]);

  const totalGross = calculatedRows.reduce((acc, r) => acc + r.grossEarnings, 0);
  const totalAdvances = calculatedRows.reduce((acc, r) => acc + r.advanceDeduction, 0);
  const totalNet = calculatedRows.reduce((acc, r) => acc + r.netPayableSalary, 0);
  const totalCompanyExpenses = calculatedRows.reduce((acc, r) => acc + r.totalCompanyExpenses, 0);

  const handleExecuteBatch = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsDone(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      onConfirmProcessing(calculatedRows);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-400" />
              <span>Batch Salary &amp; Wage Processing Workflow</span>
            </h3>
            <p className="text-xs text-slate-400">
              Deterministic calculation engine &bull; Immutable ledger commit for {calculatedRows.length} active workers
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Month Selector & Summary Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
              <span className="text-[11px] text-slate-400 block font-medium">Payroll Month:</span>
              <span className="text-base font-bold text-amber-400">September 2026</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
              <span className="text-[11px] text-slate-400 block font-medium">Gross Payroll Liability:</span>
              <span className="text-base font-bold font-mono text-white">
                {MoneyUtils.formatINR(totalGross)}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
              <span className="text-[11px] text-slate-400 block font-medium">Advance Recoveries:</span>
              <span className="text-base font-bold font-mono text-rose-400">
                -{MoneyUtils.formatINR(totalAdvances)}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/40">
              <span className="text-[11px] text-amber-300 block font-bold">Net Bank Disbursement:</span>
              <span className="text-lg font-black font-mono text-amber-400">
                {MoneyUtils.formatINR(totalNet)}
              </span>
            </div>
          </div>

          {/* Review Table (Requirement 35: Employee | Gross | Expenses | Advance | Bonus | Deduction | Net) */}
          <div className="border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="bg-slate-800/60 px-4 py-3 text-xs font-bold text-slate-300 flex justify-between items-center border-b border-slate-800">
              <span>Payroll Audit Matrix (Pre-Commit Review)</span>
              <span className="text-slate-400 font-normal">
                Company-Paid Expenses Total: <strong className="text-white font-mono">{MoneyUtils.formatINR(totalCompanyExpenses)}</strong>
              </span>
            </div>

            <div className="overflow-x-auto max-h-72">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800/40 text-slate-400 font-semibold uppercase sticky top-0 backdrop-blur">
                  <tr>
                    <th className="px-4 py-2.5">Worker &amp; Type</th>
                    <th className="px-3 py-2.5 text-center">Days</th>
                    <th className="px-3 py-2.5 text-right">Gross</th>
                    <th className="px-3 py-2.5 text-right">Bonuses</th>
                    <th className="px-3 py-2.5 text-right">Advance Ded.</th>
                    <th className="px-3 py-2.5 text-right">Net Payable</th>
                    <th className="px-3 py-2.5 text-right">Company Exp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {calculatedRows.map((row) => {
                    const emp = employees.find((e) => e.id === row.employeeId);
                    return (
                      <tr key={row.employeeId} className="hover:bg-slate-800/30">
                        <td className="px-4 py-2.5 font-medium text-white">
                          <div>{emp?.fullName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {row.employeeId} &bull; {row.employmentType.replace('_', ' ')}
                          </div>
                        </td>
                        <td className="px-3 py-2.5 text-center font-mono font-bold text-amber-400">
                          {row.effectiveWorkingDays}d
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono text-slate-200">
                          {MoneyUtils.formatINR(row.grossEarnings)}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono text-emerald-400">
                          +{MoneyUtils.formatINR(row.bonusAmount)}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono text-rose-400">
                          -{MoneyUtils.formatINR(row.advanceDeduction)}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono font-bold text-amber-400">
                          {MoneyUtils.formatINR(row.netPayableSalary)}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono text-purple-300">
                          {MoneyUtils.formatINR(row.totalCompanyExpenses)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" />
            <div>
              <strong className="block text-white">Immutable Financial Commit Policy</strong>
              <p className="text-[11px] text-amber-300/80 leading-relaxed mt-0.5">
                Once confirmed, salary records transition to <code className="text-white">PROCESSED</code> and will be locked against silent edits. Any future wage corrections must be recorded via ledger adjustments.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur px-6 py-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
          >
            Cancel
          </button>

          <button
            disabled={isProcessing || isDone}
            onClick={handleExecuteBatch}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all ${
              isDone
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing Atomic Payroll...</span>
              </>
            ) : isDone ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Payroll Processed Successfully!</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Confirm &amp; Lock September 2026 Payroll</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
