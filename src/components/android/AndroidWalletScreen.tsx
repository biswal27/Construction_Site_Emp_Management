import React, { useState } from 'react';
import { 
  Wallet, 
  QrCode, 
  Download, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  Copy, 
  Check, 
  FileText, 
  HelpCircle, 
  Clock, 
  CreditCard,
  Building2,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Employee, SalaryAdvance, BonusRecord, User } from '../../types';
import { MoneyUtils } from '../../services/salaryEngine';
import { MaterialTheme } from './types';
import { THEMES } from './themeUtils';

interface AndroidWalletScreenProps {
  currentUser: User;
  employee?: Employee;
  employees: Employee[];
  advances: SalaryAdvance[];
  bonuses: BonusRecord[];
  onAddAdvance: (advance: Omit<SalaryAdvance, 'id'>) => void;
  theme: MaterialTheme;
}

export const AndroidWalletScreen: React.FC<AndroidWalletScreenProps> = ({
  currentUser,
  employee,
  employees,
  advances,
  bonuses,
  onAddAdvance,
  theme,
}) => {
  const currentTheme = THEMES[theme];
  const [copiedUPI, setCopiedUPI] = useState<boolean>(false);
  const [showAdvanceModal, setShowAdvanceModal] = useState<boolean>(false);
  const [advanceAmount, setAdvanceAmount] = useState<number>(5000);
  const [advanceReason, setAdvanceReason] = useState<string>('Family Medical Emergency');
  const [installments, setInstallments] = useState<number>(2);
  const [advanceSuccess, setAdvanceSuccess] = useState<boolean>(false);

  const emp = employee || employees[0];
  const userAdvances = advances.filter((a) => a.employeeId === emp.id);
  const userBonuses = bonuses.filter((b) => b.employeeId === emp.id);

  // Copy UPI
  const handleCopyUPI = () => {
    const upi = emp.upiId || `${emp.mobileNumber.replace(/[^0-9]/g, '')}@upi`;
    navigator.clipboard.writeText(upi);
    setCopiedUPI(true);
    setTimeout(() => setCopiedUPI(false), 2000);
  };

  // Trigger Payslip Download
  const handleDownloadPayslip = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });
    alert(`Payslip for ${emp.fullName} (Sept 2026) downloaded successfully as PDF.`);
  };

  // Submit Advance Request
  const handleSubmitAdvance = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAdvance({
      employeeId: emp.id,
      amount: advanceAmount,
      date: new Date().toISOString().split('T')[0],
      reason: advanceReason,
      status: 'ACTIVE',
      deductedAmount: 0,
      remainingAmount: advanceAmount,
    });

    setAdvanceSuccess(true);
    setTimeout(() => {
      setAdvanceSuccess(false);
      setShowAdvanceModal(false);
    }, 2000);
  };

  const monthlyGross = emp.employmentType === 'MONTHLY_SALARY' ? emp.monthlySalary : emp.dailyWage * 26;
  const advanceDeduction = MoneyUtils.round(advanceAmount / installments);

  return (
    <div className="flex-1 overflow-y-auto pb-20 px-4 pt-3 space-y-4 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-400" />
            <span>Worker Passbook &amp; Payslip</span>
          </h2>
          <p className="text-[11px] text-slate-400">Direct Benefit Transfer &amp; Wage Statements</p>
        </div>

        <button
          onClick={() => setShowAdvanceModal(true)}
          className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/30 active:scale-95 transition-all flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Apply Advance</span>
        </button>
      </div>

      {/* Virtual NFC Construction Smart Badge (Credit Card format) */}
      <div className="relative rounded-3xl p-5 bg-gradient-to-br from-amber-600 via-amber-500 to-amber-700 text-slate-950 shadow-xl overflow-hidden">
        {/* Holographic pattern overlay */}
        <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-6 -bottom-6 w-28 h-28 bg-black/10 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-start justify-between relative z-10 mb-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-900/80">
              BuildForce Smart NFC Pass
            </span>
            <h3 className="text-lg font-black tracking-tight">{emp.fullName}</h3>
            <span className="text-xs font-bold text-slate-900/90">{emp.skillTrade}</span>
          </div>

          <div className="p-1.5 bg-slate-950/10 rounded-xl backdrop-blur-sm">
            <QrCode className="w-8 h-8 text-slate-950" />
          </div>
        </div>

        <div className="relative z-10 flex items-end justify-between pt-2 border-t border-slate-950/20">
          <div>
            <span className="text-[9px] font-bold text-slate-900/70 block uppercase">Worker ID</span>
            <span className="font-mono font-bold text-xs">{emp.id}</span>
          </div>
          <div>
            <span className="text-[9px] font-bold text-slate-900/70 block uppercase">Aadhaar (Masked)</span>
            <span className="font-mono font-bold text-xs">XXXX-XXXX-8921</span>
          </div>
          <div className="text-right">
            <span className="text-[9px] font-bold text-slate-900/70 block uppercase">Site Sector</span>
            <span className="font-bold text-xs">Sec 62 Metro</span>
          </div>
        </div>
      </div>

      {/* Direct Bank Account & UPI Details */}
      <div className="p-3.5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>Bank &amp; UPI Disbursement Account</span>
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
            Verified NPCI
          </span>
        </div>

        <div className="p-2.5 bg-slate-950 rounded-2xl border border-slate-800/80 flex items-center justify-between text-xs">
          <div>
            <div className="text-slate-400 text-[10px]">Direct UPI VPA:</div>
            <div className="font-mono font-bold text-white">
              {emp.upiId || `${emp.mobileNumber.replace(/[^0-9]/g, '')}@sbi`}
            </div>
          </div>
          <button
            onClick={handleCopyUPI}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Copy UPI ID"
          >
            {copiedUPI ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Latest Payslip Breakdown Card */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Payslip Statement
            </span>
            <h4 className="text-sm font-bold text-white">September 2026 Cycle</h4>
          </div>
          <button
            onClick={handleDownloadPayslip}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs flex items-center gap-1 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Basic Wage / Salary:</span>
            <span className="font-mono font-bold text-white">{MoneyUtils.formatINR(monthlyGross)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Overtime &amp; Special Duty:</span>
            <span className="font-mono font-bold text-emerald-400">+₹2,400</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Advance Installment Deduction:</span>
            <span className="font-mono font-bold text-rose-400">-₹2,000</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Camp Electricity/Water Subsidy:</span>
            <span className="font-mono font-bold text-emerald-400">100% Free</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-slate-800 text-sm">
            <span className="text-slate-200 font-bold">Estimated Net Payable:</span>
            <span className="font-mono font-bold text-emerald-400 text-base">
              {MoneyUtils.formatINR(monthlyGross + 400)}
            </span>
          </div>
        </div>
      </div>

      {/* Active Advance Repayment Schedule */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Advances &amp; Loan Ledger
        </h4>

        {userAdvances.length === 0 ? (
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-400">
            No active salary advances. Worker has clean ledger.
          </div>
        ) : (
          userAdvances.map((adv) => (
            <div
              key={adv.id}
              className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
            >
              <div>
                <div className="font-bold text-white">{adv.reason}</div>
                <div className="text-[10px] text-slate-400 font-mono">Disbursed: {adv.date}</div>
              </div>
              <div className="text-right">
                <div className="font-mono font-bold text-amber-400">
                  {MoneyUtils.formatINR(adv.remainingAmount ?? adv.amount)} remaining
                </div>
                <span className="text-[9px] font-bold text-emerald-400">
                  {adv.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Request Advance Modal Drawer */}
      {showAdvanceModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-2 animate-in fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Apply for Salary Advance</span>
              </h3>
              <button
                onClick={() => setShowAdvanceModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                Cancel
              </button>
            </div>

            {advanceSuccess ? (
              <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-center space-y-1">
                <Check className="w-6 h-6 text-emerald-400 mx-auto" />
                <div className="text-xs font-bold text-emerald-300">Advance Approved &amp; Disbursed!</div>
                <span className="text-[10px] text-slate-300">Transferred directly to UPI VPA.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitAdvance} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Advance Amount (₹):</label>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {[3000, 5000, 10000].map((amt) => (
                      <button
                        type="button"
                        key={amt}
                        onClick={() => setAdvanceAmount(amt)}
                        className={`py-1.5 rounded-xl font-mono font-bold transition-colors ${
                          advanceAmount === amt
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        ₹{amt.toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Reason for Advance:</label>
                  <select
                    value={advanceReason}
                    onChange={(e) => setAdvanceReason(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Family Medical Emergency">Family Medical Emergency</option>
                    <option value="Festival & Pooja Expenses">Festival &amp; Pooja Expenses</option>
                    <option value="Child Schooling & Books">Child Schooling &amp; Books</option>
                    <option value="Personal Construction Tools">Personal Construction Tools</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Repayment Recovery Period:</label>
                  <div className="flex gap-2">
                    {[1, 2, 3].map((m) => (
                      <button
                        type="button"
                        key={m}
                        onClick={() => setInstallments(m)}
                        className={`flex-1 py-1.5 rounded-xl font-bold transition-colors ${
                          installments === m
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {m} {m === 1 ? 'Month' : 'Months'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 text-[11px] space-y-1">
                  <div className="flex justify-between">
                    <span>Monthly Deduction:</span>
                    <strong className="text-amber-400 font-mono">
                      {MoneyUtils.formatINR(advanceDeduction)} / month
                    </strong>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 active:scale-95 transition-all"
                >
                  Submit &amp; Disburse Immediately
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
