import React, { useState, useMemo } from 'react';
import { Employee, ExpenseRecord, ExpenseCategory, ApprovalStatus } from '../../types';
import { MoneyUtils } from '../../services/salaryEngine';
import { FoodAllowanceTracker } from './FoodAllowanceTracker';
import { DailyExpenseRecorder } from './DailyExpenseRecorder';
import {
  Receipt,
  Plus,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Eye,
  FileCheck,
  Utensils,
  Car,
  Home,
  HeartPulse,
} from 'lucide-react';

interface ExpenseManagerProps {
  employees: Employee[];
  expenses: ExpenseRecord[];
  onAddExpense: (exp: ExpenseRecord) => void;
  onUpdateExpenseStatus: (expenseId: string, status: ApprovalStatus) => void;
  onOpenNewExpenseModal: () => void;
  isAdmin: boolean;
}

export const ExpenseManager: React.FC<ExpenseManagerProps> = ({
  employees,
  expenses,
  onAddExpense,
  onUpdateExpenseStatus,
  onOpenNewExpenseModal,
  isAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'register' | 'food_tracker' | 'daily_quick'>('register');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const matchCat = categoryFilter === 'ALL' || e.category === categoryFilter;
      const matchStat = statusFilter === 'ALL' || e.approvalStatus === statusFilter;
      return matchCat && matchStat;
    });
  }, [expenses, categoryFilter, statusFilter]);

  const totalExpenseVolume = useMemo(() => {
    return filteredExpenses.reduce((acc, e) => acc + e.amount, 0);
  }, [filteredExpenses]);

  const pendingCount = useMemo(() => {
    return expenses.filter((e) => e.approvalStatus === 'PENDING').length;
  }, [expenses]);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Expense Management System</h2>
          <p className="text-xs text-slate-400">
            Audit, track, and disburse site food, travel, accommodation, medical, and daily project expenses
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenNewExpenseModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Record New Expense</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900/80 rounded-2xl border border-slate-800">
        <button
          onClick={() => setActiveTab('register')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'register'
              ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Receipt className="h-4 w-4" />
          <span>Voucher Register &amp; Approvals</span>
          {pendingCount > 0 && (
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'register' ? 'bg-slate-950 text-amber-400' : 'bg-amber-500/20 text-amber-400'
              }`}
            >
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('food_tracker')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'food_tracker'
              ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Utensils className="h-4 w-4" />
          <span>Food Allowance Tracker (Allocated vs Used)</span>
        </button>

        <button
          onClick={() => setActiveTab('daily_quick')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'daily_quick'
              ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>Daily Quick Site Logger</span>
        </button>
      </div>

      {/* Tab Renderers */}
      {activeTab === 'food_tracker' ? (
        <FoodAllowanceTracker employees={employees} expenses={expenses} />
      ) : activeTab === 'daily_quick' ? (
        <DailyExpenseRecorder
          employees={employees}
          onAddDailyBatch={(newBatch) => {
            newBatch.forEach((r) => onAddExpense(r));
          }}
        />
      ) : (
        <div className="space-y-4">
          {/* Filters & KPI */}
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Category Filter */}
              <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5">
                <Filter className="h-3.5 w-3.5 text-slate-400" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-transparent text-xs text-slate-200 outline-none cursor-pointer"
                >
                  <option value="ALL" className="bg-slate-900">All Categories</option>
                  <option value="FOOD" className="bg-slate-900">Food &amp; Site Mess</option>
                  <option value="TRAVEL" className="bg-slate-900">Travel &amp; Logistics</option>
                  <option value="RENT" className="bg-slate-900">Accommodation &amp; Rent</option>
                  <option value="MEDICAL" className="bg-slate-900">Medical Expenses</option>
                  <option value="DAILY_EXPENSE" className="bg-slate-900">Daily Site Misc</option>
                  <option value="BONUS" className="bg-slate-900">Bonus</option>
                  <option value="ADVANCE" className="bg-slate-900">Advance</option>
                  <option value="OTHER" className="bg-slate-900">Other</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent text-xs text-slate-200 outline-none cursor-pointer"
                >
                  <option value="ALL" className="bg-slate-900">All Statuses</option>
                  <option value="PENDING" className="bg-slate-900">Pending Review</option>
                  <option value="APPROVED" className="bg-slate-900">Approved</option>
                  <option value="REJECTED" className="bg-slate-900">Rejected</option>
                  <option value="PAID" className="bg-slate-900">Paid Out</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="text-slate-400">
                Filtered Total: <strong className="text-white font-mono">{MoneyUtils.formatINR(totalExpenseVolume)}</strong>
              </span>
            </div>
          </div>

          {/* Expense Table */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800/60 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Voucher &amp; Beneficiary</th>
                    <th className="px-3 py-3">Category</th>
                    <th className="px-3 py-3">Date</th>
                    <th className="px-3 py-3 text-right">Amount</th>
                    <th className="px-3 py-3">Details &amp; Receipt</th>
                    <th className="px-3 py-3 text-center">Status</th>
                    {isAdmin && <th className="px-4 py-3 text-right">Approval Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredExpenses.map((exp) => {
                    const emp = employees.find((e) => e.id === exp.employeeId);
                    return (
                      <tr key={exp.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-bold text-white flex items-center gap-2">
                            <span>{emp?.fullName || exp.employeeId}</span>
                            <span className="text-[10px] font-mono text-slate-400 font-normal">
                              ({exp.employeeId})
                            </span>
                          </div>
                          <div className="text-[10px] text-amber-400 font-mono mt-0.5">{exp.id}</div>
                        </td>
                        <td className="px-3 py-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-200 border border-slate-700">
                            {exp.category}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-slate-300 font-mono text-[11px]">
                          {exp.expenseDate}
                        </td>
                        <td className="px-3 py-3 text-right font-mono font-bold text-white text-sm">
                          {MoneyUtils.formatINR(exp.amount)}
                        </td>
                        <td className="px-3 py-3 max-w-xs text-slate-300 text-[11px]">
                          <div>{exp.description}</div>
                          {exp.travelFrom && (
                            <div className="text-[10px] text-amber-400 mt-0.5">
                              {exp.travelFrom} &rarr; {exp.travelTo} ({exp.transportMode})
                            </div>
                          )}
                          {exp.receiptName && (
                            <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                              <FileCheck className="h-3 w-3" />
                              <span>{exp.receiptName}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              exp.approvalStatus === 'APPROVED'
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : exp.approvalStatus === 'PENDING'
                                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                : exp.approvalStatus === 'PAID'
                                ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                                : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {exp.approvalStatus}
                          </span>
                        </td>
                        {isAdmin && (
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {exp.approvalStatus === 'PENDING' && (
                                <>
                                  <button
                                    onClick={() => onUpdateExpenseStatus(exp.id, 'APPROVED')}
                                    title="Approve Voucher"
                                    className="p-1 text-emerald-400 hover:bg-emerald-500/20 rounded transition-colors"
                                  >
                                    <CheckCircle2 className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => onUpdateExpenseStatus(exp.id, 'REJECTED')}
                                    title="Reject Voucher"
                                    className="p-1 text-rose-400 hover:bg-rose-500/20 rounded transition-colors"
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </button>
                                </>
                              )}
                              {exp.approvalStatus === 'APPROVED' && (
                                <button
                                  onClick={() => onUpdateExpenseStatus(exp.id, 'PAID')}
                                  className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-[10px] font-bold border border-emerald-500/30"
                                >
                                  Disburse
                                </button>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
