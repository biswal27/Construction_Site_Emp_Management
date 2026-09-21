import React, { useState } from 'react';
import { Employee, ExpenseRecord } from '../../types';
import { MoneyUtils } from '../../services/salaryEngine';
import { PlusCircle, Calculator, CheckCircle2 } from 'lucide-react';

interface DailyExpenseRecorderProps {
  employees: Employee[];
  onAddDailyBatch: (records: ExpenseRecord[]) => void;
}

export const DailyExpenseRecorder: React.FC<DailyExpenseRecorderProps> = ({
  employees,
  onAddDailyBatch,
}) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(
    employees[0]?.id || 'EMP-101'
  );
  const [expenseDate, setExpenseDate] = useState<string>('2026-09-15');
  const [foodAmount, setFoodAmount] = useState<number>(200);
  const [travelAmount, setTravelAmount] = useState<number>(150);
  const [otherAmount, setOtherAmount] = useState<number>(100);
  const [description, setDescription] = useState<string>('Site lunch, local tempo travel & water canes');
  const [successNotice, setSuccessNotice] = useState(false);

  const totalDaily = (Number(foodAmount) || 0) + (Number(travelAmount) || 0) + (Number(otherAmount) || 0);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalDaily <= 0) return;

    const newRecords: ExpenseRecord[] = [];
    const timestamp = Date.now();

    if (foodAmount > 0) {
      newRecords.push({
        id: `EXP-FOOD-${timestamp}`,
        employeeId: selectedEmployeeId,
        category: 'FOOD',
        amount: Number(foodAmount),
        expenseDate,
        description: `Daily site meal: ${description}`,
        paidByCompany: true,
        approvalStatus: 'APPROVED',
        paymentMethod: 'CASH',
      });
    }

    if (travelAmount > 0) {
      newRecords.push({
        id: `EXP-TRV-${timestamp}`,
        employeeId: selectedEmployeeId,
        category: 'TRAVEL',
        amount: Number(travelAmount),
        expenseDate,
        description: `Daily site travel: ${description}`,
        paidByCompany: true,
        approvalStatus: 'APPROVED',
        paymentMethod: 'CASH',
      });
    }

    if (otherAmount > 0) {
      newRecords.push({
        id: `EXP-OTH-${timestamp}`,
        employeeId: selectedEmployeeId,
        category: 'DAILY_EXPENSE',
        amount: Number(otherAmount),
        expenseDate,
        description: `Daily misc expense: ${description}`,
        paidByCompany: true,
        approvalStatus: 'APPROVED',
        paymentMethod: 'CASH',
      });
    }

    onAddDailyBatch(newRecords);
    setSuccessNotice(true);
    setTimeout(() => setSuccessNotice(false), 3000);
  };

  return (
    <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calculator className="h-4 w-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white">
            Daily On-Site Expense Quick Entry (Section 10)
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Food + Travel + Other Daily Consolidation
        </span>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Employee Picker */}
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Select Worker</label>
            <select
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500 cursor-pointer"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.fullName} ({emp.id})
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Expense Date</label>
            <input
              type="date"
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500 cursor-pointer"
            >
            </input>
          </div>

          {/* Food Expense */}
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Food (₹)</label>
            <input
              type="number"
              value={foodAmount}
              onChange={(e) => setFoodAmount(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white outline-none focus:border-amber-500"
            />
          </div>

          {/* Travel Expense */}
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Travel (₹)</label>
            <input
              type="number"
              value={travelAmount}
              onChange={(e) => setTravelAmount(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white outline-none focus:border-amber-500"
            />
          </div>

          {/* Other Daily Expense */}
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Other / Misc (₹)</label>
            <input
              type="number"
              value={otherAmount}
              onChange={(e) => setOtherAmount(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Description & Auto Total Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-slate-800/60 rounded-xl border border-slate-700">
          <input
            type="text"
            placeholder="Description / Site reason (e.g. Lunch & auto fare to Sector 72)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="flex-1 bg-transparent text-xs text-white placeholder-slate-400 outline-none w-full"
          />

          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Total Daily Expense</span>
              <span className="text-base font-black font-mono text-amber-400">
                {MoneyUtils.formatINR(totalDaily)}
              </span>
            </div>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer whitespace-nowrap"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Record Expense</span>
            </button>
          </div>
        </div>

        {successNotice && (
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4" />
            <span>
              Recorded ₹{totalDaily} on {expenseDate} for {selectedEmployeeId}. Consolidated into monthly ledger!
            </span>
          </div>
        )}
      </form>
    </div>
  );
};
