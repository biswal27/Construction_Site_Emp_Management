import React, { useState, useMemo } from 'react';
import { Employee, SalaryAdvance, BonusRecord, BonusType } from '../../types';
import { MoneyUtils } from '../../services/salaryEngine';
import { HandCoins, Gift, Plus, CheckCircle, Clock } from 'lucide-react';

interface AdvanceManagerProps {
  employees: Employee[];
  advances: SalaryAdvance[];
  bonuses: BonusRecord[];
  onAddAdvance: (adv: SalaryAdvance) => void;
  onAddBonus: (bon: BonusRecord) => void;
}

export const AdvanceManager: React.FC<AdvanceManagerProps> = ({
  employees,
  advances,
  bonuses,
  onAddAdvance,
  onAddBonus,
}) => {
  const [activeTab, setActiveTab] = useState<'advances' | 'bonuses'>('advances');

  // Advance Form Modal State
  const [showAdvanceModal, setShowAdvanceModal] = useState(false);
  const [advEmpId, setAdvEmpId] = useState(employees[0]?.id || 'EMP-101');
  const [advAmount, setAdvAmount] = useState(5000);
  const [advMonthlyDeduction, setAdvMonthlyDeduction] = useState(2500);
  const [advReason, setAdvReason] = useState('Home village emergency repair');

  // Bonus Form Modal State
  const [showBonusModal, setShowBonusModal] = useState(false);
  const [bonEmpId, setBonEmpId] = useState(employees[0]?.id || 'EMP-101');
  const [bonType, setBonType] = useState<BonusType>('FESTIVAL');
  const [bonAmount, setBonAmount] = useState(3000);
  const [bonDescription, setBonDescription] = useState('Diwali 2026 workforce bonus');

  // Total Outstanding Advances
  const totalOutstanding = useMemo(() => {
    return advances.reduce((acc, a) => acc + (a.remainingBalance ?? a.remainingAmount ?? a.amount), 0);
  }, [advances]);

  // Total Bonuses Disbursed
  const totalBonuses = useMemo(() => {
    return bonuses.reduce((acc, b) => acc + b.amount, 0);
  }, [bonuses]);

  const handleCreateAdvance = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    const newAdv: SalaryAdvance = {
      id: `ADV-${Date.now().toString().slice(-6)}`,
      employeeId: advEmpId,
      date: today,
      advanceDate: today,
      amount: Number(advAmount),
      totalAdvanceAmount: Number(advAmount),
      monthlyDeductionAmount: Number(advMonthlyDeduction),
      repaidAmount: 0,
      deductedAmount: 0,
      remainingAmount: Number(advAmount),
      remainingBalance: Number(advAmount),
      reason: advReason,
      status: 'ACTIVE',
      approvedBy: 'Project Director',
    };
    onAddAdvance(newAdv);
    setShowAdvanceModal(false);
  };

  const handleCreateBonus = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    const newBon: BonusRecord = {
      id: `BON-${Date.now().toString().slice(-6)}`,
      employeeId: bonEmpId,
      bonusType: bonType,
      amount: Number(bonAmount),
      date: today,
      declaredDate: today,
      month: 9,
      year: 2026,
      appliedMonth: 9,
      appliedYear: 2026,
      reason: bonDescription,
      description: bonDescription,
      status: 'APPROVED',
    };
    onAddBonus(newBon);
    setShowBonusModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Advances &amp; Bonus Administration</h2>
          <p className="text-xs text-slate-400">
            Track worker advance cash disbursements, monthly salary amortization, and performance bonuses
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === 'advances' ? (
            <button
              onClick={() => setShowAdvanceModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Disburse Salary Advance</span>
            </button>
          ) : (
            <button
              onClick={() => setShowBonusModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Grant Milestone Bonus</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Active Advance Balance Outstanding
            </span>
            <div className="text-2xl font-black font-mono text-rose-400">
              {MoneyUtils.formatINR(totalOutstanding)}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Auto-deducted in monthly payroll batches
            </span>
          </div>
          <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20 text-rose-400">
            <HandCoins className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Total Bonuses Credited (Sept 2026)
            </span>
            <div className="text-2xl font-black font-mono text-emerald-400">
              {MoneyUtils.formatINR(totalBonuses)}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Diwali, safety, and slab completion incentives
            </span>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400">
            <Gift className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900/80 rounded-2xl border border-slate-800">
        <button
          onClick={() => setActiveTab('advances')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'advances'
              ? 'bg-amber-500 text-slate-950 font-bold shadow'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <HandCoins className="h-4 w-4" />
          <span>Salary Advances Ledger ({advances.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('bonuses')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'bonuses'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Gift className="h-4 w-4" />
          <span>Festival &amp; Performance Bonuses ({bonuses.length})</span>
        </button>
      </div>

      {/* Tab 1: Advances Table */}
      {activeTab === 'advances' ? (
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/60 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Advance ID &amp; Worker</th>
                  <th className="px-3 py-3">Disbursed Date</th>
                  <th className="px-3 py-3 text-right">Total Advance</th>
                  <th className="px-3 py-3 text-right">Monthly Recovery</th>
                  <th className="px-3 py-3 text-right">Repaid</th>
                  <th className="px-3 py-3 text-right">Remaining Due</th>
                  <th className="px-3 py-3">Reason</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {advances.map((adv) => {
                  const emp = employees.find((e) => e.id === adv.employeeId);
                  return (
                    <tr key={adv.id} className="hover:bg-slate-800/40">
                      <td className="px-4 py-3">
                        <div className="font-bold text-white">{emp?.fullName || adv.employeeId}</div>
                        <div className="text-[10px] font-mono text-amber-400">{adv.id}</div>
                      </td>
                      <td className="px-3 py-3 text-slate-300 font-mono text-[11px]">
                        {adv.advanceDate || adv.date}
                      </td>
                      <td className="px-3 py-3 text-right font-mono font-bold text-white">
                        {MoneyUtils.formatINR(adv.totalAdvanceAmount ?? adv.amount)}
                      </td>
                      <td className="px-3 py-3 text-right font-mono text-amber-400 font-semibold">
                        {MoneyUtils.formatINR(adv.monthlyDeductionAmount ?? 2000)} / mo
                      </td>
                      <td className="px-3 py-3 text-right font-mono text-emerald-400">
                        {MoneyUtils.formatINR(adv.repaidAmount ?? adv.deductedAmount ?? 0)}
                      </td>
                      <td className="px-3 py-3 text-right font-mono font-bold text-rose-400 text-sm">
                        {MoneyUtils.formatINR(adv.remainingBalance ?? adv.remainingAmount ?? adv.amount)}
                      </td>
                      <td className="px-3 py-3 text-slate-300 text-[11px] max-w-xs">{adv.reason}</td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            adv.status === 'REPAID' || adv.status === 'FULLY_REPAID'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {adv.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Tab 2: Bonuses Table */
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/60 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Bonus ID &amp; Recipient</th>
                  <th className="px-3 py-3">Bonus Category</th>
                  <th className="px-3 py-3">Declared Date</th>
                  <th className="px-3 py-3 text-right">Credit Amount</th>
                  <th className="px-3 py-3">Description &amp; Milestone</th>
                  <th className="px-4 py-3 text-center">Ledger Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {bonuses.map((bon) => {
                  const emp = employees.find((e) => e.id === bon.employeeId);
                  return (
                    <tr key={bon.id} className="hover:bg-slate-800/40">
                      <td className="px-4 py-3">
                        <div className="font-bold text-white">{emp?.fullName || bon.employeeId}</div>
                        <div className="text-[10px] font-mono text-emerald-400">{bon.id}</div>
                      </td>
                      <td className="px-3 py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-200 border border-slate-700">
                          {bon.bonusType.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-slate-300 font-mono text-[11px]">
                        {bon.declaredDate || bon.date}
                      </td>
                      <td className="px-3 py-3 text-right font-mono font-bold text-emerald-400 text-sm">
                        +{MoneyUtils.formatINR(bon.amount)}
                      </td>
                      <td className="px-3 py-3 text-slate-300 text-[11px]">
                        {bon.description || bon.reason}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          {bon.status || 'APPROVED'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Disburse Advance Modal */}
      {showAdvanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Disburse Salary Advance (Section 14)</h3>
            <form onSubmit={handleCreateAdvance} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Employee</label>
                <select
                  value={advEmpId}
                  onChange={(e) => setAdvEmpId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none"
                >
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.fullName} ({e.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Advance Principal (₹)</label>
                  <input
                    type="number"
                    value={advAmount}
                    onChange={(e) => setAdvAmount(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 font-mono font-bold text-amber-400 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Monthly Recovery Cap (₹)</label>
                  <input
                    type="number"
                    value={advMonthlyDeduction}
                    onChange={(e) => setAdvMonthlyDeduction(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 font-mono text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Reason / Purpose</label>
                <input
                  type="text"
                  value={advReason}
                  onChange={(e) => setAdvReason(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAdvanceModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20"
                >
                  Confirm Advance Disbursement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grant Bonus Modal */}
      {showBonusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Grant Employee Bonus (Section 15)</h3>
            <form onSubmit={handleCreateBonus} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Employee</label>
                <select
                  value={bonEmpId}
                  onChange={(e) => setBonEmpId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none"
                >
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.fullName} ({e.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Bonus Type</label>
                  <select
                    value={bonType}
                    onChange={(e) => setBonType(e.target.value as BonusType)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none"
                  >
                    <option value="FESTIVAL_BONUS">Festival / Diwali Bonus</option>
                    <option value="PERFORMANCE_BONUS">Performance Bonus</option>
                    <option value="SITE_COMPLETION_BONUS">Site Completion Bonus</option>
                    <option value="SPECIAL_INCENTIVE">Special Incentive</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Credit Amount (₹)</label>
                  <input
                    type="number"
                    value={bonAmount}
                    onChange={(e) => setBonAmount(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 font-mono font-bold text-emerald-400 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Description / Project Milestone</label>
                <input
                  type="text"
                  value={bonDescription}
                  onChange={(e) => setBonDescription(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowBonusModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20"
                >
                  Credit Bonus into Payroll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
