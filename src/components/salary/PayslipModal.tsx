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
import { X, Printer, Download, Building, ShieldCheck } from 'lucide-react';

interface PayslipModalProps {
  employee: Employee | null;
  attendance: AttendanceRecord[];
  expenses: ExpenseRecord[];
  advances: SalaryAdvance[];
  bonuses: BonusRecord[];
  leases: AccommodationLease[];
  onClose: () => void;
  month?: number;
  year?: number;
}

export const PayslipModal: React.FC<PayslipModalProps> = ({
  employee,
  attendance,
  expenses,
  advances,
  bonuses,
  leases,
  onClose,
  month = 9,
  year = 2026,
}) => {
  if (!employee) return null;

  const payroll = useMemo(() => {
    return SalaryCalculationService.calculateMonthlySalary(
      employee,
      month,
      year,
      attendance,
      expenses,
      advances,
      bonuses,
      leases
    );
  }, [employee, month, year, attendance, expenses, advances, bonuses, leases]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Modal Top Actions */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Official Salary Slip
            </span>
            <span className="text-xs text-slate-400">September 2026 Cycle</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Payslip Body */}
        <div id="payslip-content" className="p-6 sm:p-8 space-y-6 bg-slate-950 text-slate-100 font-sans">
          {/* Header */}
          <div className="text-center border-b border-slate-800 pb-5 space-y-1">
            <div className="flex items-center justify-center gap-2 text-amber-400 font-extrabold text-lg tracking-wider uppercase">
              <Building className="h-5 w-5" />
              <span>CONSTRUCTPRO INFRASTRUCTURE &amp; STRUCTURES PVT. LTD.</span>
            </div>
            <p className="text-xs text-slate-400">
              Site Office: Sector 62 Structural Complex, Noida, UP &bull; CIN: U45201UP2020PTC128490
            </p>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider pt-2">
              Salary Slip for the month of September 2026
            </h3>
          </div>

          {/* Employee Meta Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <div>
              <span className="text-slate-400 block text-[11px]">Employee Name:</span>
              <strong className="text-white text-sm">{employee.fullName}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Employee ID:</span>
              <strong className="text-amber-400 font-mono">{employee.id}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Department:</span>
              <span className="text-slate-200">{employee.department}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Designation / Trade:</span>
              <span className="text-slate-200">{employee.designation}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px]">Payment Mode:</span>
              <span className="text-slate-200">{employee.employmentType.replace('_', ' ')}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Bank Account:</span>
              <span className="font-mono text-slate-200">{employee.bankAccountNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Bank &amp; IFSC:</span>
              <span className="font-mono text-slate-200">{employee.bankIfsc}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Effective Working Days:</span>
              <strong className="text-amber-400 font-mono text-sm">{payroll.effectiveWorkingDays} / 30</strong>
            </div>
          </div>

          {/* Earnings vs Deductions Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Earnings Column */}
            <div className="border border-slate-800 rounded-xl overflow-hidden">
              <div className="bg-slate-800/80 px-4 py-2 text-xs font-bold text-slate-200 uppercase tracking-wider flex justify-between">
                <span>Earnings Breakdown</span>
                <span>Amount (₹)</span>
              </div>
              <div className="divide-y divide-slate-800/50 text-xs p-2 space-y-1">
                <div className="flex justify-between py-1.5 px-2">
                  <span className="text-slate-300">
                    {employee.employmentType === 'DAILY_WAGE' ? 'Earned Daily Wages' : 'Basic Monthly Salary'}
                  </span>
                  <span className="font-mono font-bold text-white">
                    {MoneyUtils.formatINR(payroll.baseEarnedSalary)}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 px-2">
                  <span className="text-slate-300">Food Allowance</span>
                  <span className="font-mono text-slate-200">{MoneyUtils.formatINR(payroll.foodAllowance)}</span>
                </div>
                <div className="flex justify-between py-1.5 px-2">
                  <span className="text-slate-300">Travel Allowance</span>
                  <span className="font-mono text-slate-200">{MoneyUtils.formatINR(payroll.travelAllowance)}</span>
                </div>
                {payroll.bonusAmount > 0 && (
                  <div className="flex justify-between py-1.5 px-2 text-emerald-400 font-semibold">
                    <span>Milestone / Festival Bonus</span>
                    <span className="font-mono">+{MoneyUtils.formatINR(payroll.bonusAmount)}</span>
                  </div>
                )}
                {payroll.otherAllowance > 0 && (
                  <div className="flex justify-between py-1.5 px-2">
                    <span className="text-slate-300">Special / Other Allowance</span>
                    <span className="font-mono text-slate-200">{MoneyUtils.formatINR(payroll.otherAllowance)}</span>
                  </div>
                )}
              </div>
              <div className="bg-slate-900 px-4 py-2 border-t border-slate-800 flex justify-between text-xs font-bold text-amber-400">
                <span>Gross Earnings:</span>
                <span className="font-mono">{MoneyUtils.formatINR(payroll.grossEarnings)}</span>
              </div>
            </div>

            {/* Deductions Column */}
            <div className="border border-slate-800 rounded-xl overflow-hidden">
              <div className="bg-slate-800/80 px-4 py-2 text-xs font-bold text-slate-200 uppercase tracking-wider flex justify-between">
                <span>Deductions</span>
                <span>Amount (₹)</span>
              </div>
              <div className="divide-y divide-slate-800/50 text-xs p-2 space-y-1">
                <div className="flex justify-between py-1.5 px-2">
                  <span className="text-slate-300">Salary Advance Repayment</span>
                  <span className="font-mono font-bold text-rose-400">
                    -{MoneyUtils.formatINR(payroll.advanceDeduction)}
                  </span>
                </div>
                {payroll.unpaidLeaveDeduction > 0 && (
                  <div className="flex justify-between py-1.5 px-2">
                    <span className="text-slate-300">Unpaid Leaves</span>
                    <span className="font-mono text-rose-400">
                      -{MoneyUtils.formatINR(payroll.unpaidLeaveDeduction)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-1.5 px-2">
                  <span className="text-slate-300">Provident Fund / ESI</span>
                  <span className="font-mono text-slate-400">₹0.00</span>
                </div>
                <div className="flex justify-between py-1.5 px-2">
                  <span className="text-slate-300">TDS / Professional Tax</span>
                  <span className="font-mono text-slate-400">₹0.00</span>
                </div>
              </div>
              <div className="bg-slate-900 px-4 py-2 border-t border-slate-800 flex justify-between text-xs font-bold text-rose-400">
                <span>Total Deductions:</span>
                <span className="font-mono">-{MoneyUtils.formatINR(payroll.totalDeductions)}</span>
              </div>
            </div>
          </div>

          {/* Net Take-Home Highlight */}
          <div className="bg-gradient-to-r from-amber-500/20 via-amber-600/10 to-amber-500/20 p-4 rounded-xl border border-amber-500/40 flex items-center justify-between">
            <div>
              <span className="text-xs text-amber-300 font-bold block">NET PAYABLE SALARY (Take Home)</span>
              <span className="text-[11px] text-slate-400">Disbursed directly via NEFT/UPI to registered account</span>
            </div>
            <div className="text-3xl font-black font-mono text-amber-400">
              {MoneyUtils.formatINR(payroll.netPayableSalary)}
            </div>
          </div>

          {/* Section: Company-Paid Expenses on Behalf of Employee (Requirement 16) */}
          <div className="border border-slate-800 rounded-xl p-4 bg-slate-900/40 space-y-2 text-xs">
            <h4 className="font-bold text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-purple-400" />
              <span>Company-Paid Expenses on Employee's Behalf (Non-Taxable Provision)</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-slate-300">
              <div>Food Subsidy: <strong className="font-mono text-white">{MoneyUtils.formatINR(payroll.companyPaidFood)}</strong></div>
              <div>Rent &amp; Power: <strong className="font-mono text-white">{MoneyUtils.formatINR(payroll.companyPaidRent)}</strong></div>
              <div>Travel Logistics: <strong className="font-mono text-white">{MoneyUtils.formatINR(payroll.companyPaidTravel)}</strong></div>
              <div>Daily Site Exp: <strong className="font-mono text-white">{MoneyUtils.formatINR(payroll.companyPaidDailyExpenses)}</strong></div>
            </div>
            <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800 flex justify-between">
              <span>Total Non-Cash Company Expense:</span>
              <span className="font-mono font-bold text-slate-200">
                {MoneyUtils.formatINR(payroll.totalCompanyExpenses)}
              </span>
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs text-slate-400">
            <div className="border-t border-slate-800 pt-2">
              <p className="font-semibold text-slate-300">Employee Signature / Biometric Acknowledgment</p>
              <p className="text-[10px] text-slate-400">{employee.fullName}</p>
            </div>
            <div className="border-t border-slate-800 pt-2">
              <p className="font-semibold text-slate-300">For CONSTRUCTPRO INFRASTRUCTURE PVT. LTD.</p>
              <p className="text-[10px] text-amber-400 font-mono">Authorised Signatory / Director</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
