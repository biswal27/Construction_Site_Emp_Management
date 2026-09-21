import React, { useState } from 'react';
import {
  Employee,
  ExpenseCategory,
  ExpenseRecord,
  TransportMode,
  PaymentMethod,
} from '../../types';
import { X, UploadCloud, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface NewExpenseModalProps {
  employees: Employee[];
  currentEmployee?: Employee | null;
  isAdmin: boolean;
  onClose: () => void;
  onSubmit: (expense: ExpenseRecord) => void;
}

export const NewExpenseModal: React.FC<NewExpenseModalProps> = ({
  employees,
  currentEmployee,
  isAdmin,
  onClose,
  onSubmit,
}) => {
  const [employeeId, setEmployeeId] = useState<string>(
    currentEmployee ? currentEmployee.id : employees[0]?.id || 'EMP-101'
  );
  const [category, setCategory] = useState<ExpenseCategory>('FOOD');
  const [amount, setAmount] = useState<number>(350);
  const [expenseDate, setExpenseDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [description, setDescription] = useState<string>('');
  const [paidByCompany, setPaidByCompany] = useState<boolean>(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');

  // Travel fields
  const [travelFrom, setTravelFrom] = useState<string>('Noida Sec 62 Site');
  const [travelTo, setTravelTo] = useState<string>('Greater Noida Warehouse');
  const [transportMode, setTransportMode] = useState<TransportMode>('COMPANY_VEHICLE');
  const [ticketNumber, setTicketNumber] = useState<string>('');

  // Receipt mock upload
  const [receiptFileName, setReceiptFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;

    const newExpense: ExpenseRecord = {
      id: `EXP-${Date.now().toString().slice(-6)}`,
      employeeId,
      category,
      amount: Number(amount),
      expenseDate,
      description: description || `${category} expense recorded on ${expenseDate}`,
      paidByCompany,
      approvalStatus: isAdmin ? 'APPROVED' : 'PENDING',
      paymentMethod,
      travelFrom: category === 'TRAVEL' ? travelFrom : undefined,
      travelTo: category === 'TRAVEL' ? travelTo : undefined,
      transportMode: category === 'TRAVEL' ? transportMode : undefined,
      ticketNumber: category === 'TRAVEL' ? ticketNumber : undefined,
      receiptUrl: receiptFileName ? '/receipts/sample_voucher.pdf' : undefined,
      receiptName: receiptFileName || undefined,
    };

    onSubmit(newExpense);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Record Construction Site Expense</h3>
            <p className="text-xs text-slate-400">
              Submit company-paid or reimbursable expense voucher with receipt
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Employee Selection */}
            <div>
              <label className="text-xs text-slate-400 block mb-1">Beneficiary Worker</label>
              <select
                disabled={!isAdmin && Boolean(currentEmployee)}
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500 cursor-pointer"
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.fullName} ({emp.id})
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="text-xs text-slate-400 block mb-1">Expense Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="FOOD">Food &amp; Site Mess</option>
                <option value="TRAVEL">Travel &amp; Logistics</option>
                <option value="RENT">Accommodation &amp; Rent</option>
                <option value="MEDICAL">Medical &amp; First Aid</option>
                <option value="DAILY_EXPENSE">Daily Minor Site Expense</option>
                <option value="BONUS">Project Bonus</option>
                <option value="ADVANCE">Salary Advance</option>
                <option value="OTHER">Other Miscellaneous</option>
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="text-xs text-slate-400 block mb-1">Voucher Amount (₹) *</label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-amber-400 outline-none focus:border-amber-500"
              />
            </div>

            {/* Expense Date */}
            <div>
              <label className="text-xs text-slate-400 block mb-1">Expense Date</label>
              <input
                type="date"
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Conditional Travel Logistics Section */}
          {category === 'TRAVEL' && (
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/60 space-y-3">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Travel &amp; Transit Details (Section 12)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Origin / From</label>
                  <input
                    type="text"
                    value={travelFrom}
                    onChange={(e) => setTravelFrom(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Destination / To</label>
                  <input
                    type="text"
                    value={travelTo}
                    onChange={(e) => setTravelTo(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Transport Mode</label>
                  <select
                    value={transportMode}
                    onChange={(e) => setTransportMode(e.target.value as TransportMode)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="COMPANY_VEHICLE">Company Vehicle</option>
                    <option value="BUS">Public Bus</option>
                    <option value="TRAIN">Train / Metro</option>
                    <option value="AUTO">Auto Rickshaw</option>
                    <option value="TAXI">Taxi / Cab</option>
                    <option value="FLIGHT">Flight</option>
                    <option value="OTHER">Other Transit</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Ticket / Toll Slip No.</label>
                  <input
                    type="text"
                    value={ticketNumber}
                    onChange={(e) => setTicketNumber(e.target.value)}
                    placeholder="e.g. TOLL-99214 or TKT-4412"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="text-xs text-slate-400 block mb-1">Expense Description / Purpose</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Rebar transport toll fee and driver allowance"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white outline-none focus:border-amber-500 resize-none"
            />
          </div>

          {/* Receipt Upload Box (Drag & Drop or Select) */}
          <div className="border-2 border-dashed border-slate-700 hover:border-amber-500/60 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-slate-800/30">
            <input
              type="file"
              id="receipt-file-input"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*,.pdf"
            />
            <label htmlFor="receipt-file-input" className="cursor-pointer block">
              <UploadCloud className="h-6 w-6 text-amber-400 mx-auto mb-1.5" />
              <span className="text-xs font-semibold text-slate-200 block">
                {receiptFileName ? `Attached: ${receiptFileName}` : 'Upload Bill / Receipt / Voucher'}
              </span>
              <span className="text-[10px] text-slate-400">
                Click or drag &amp; drop PNG, JPG, or PDF proof (Up to 5MB)
              </span>
            </label>
          </div>

          {/* Payment & Ledger Mode */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
              >
                <option value="CASH">Site Petty Cash</option>
                <option value="UPI">Company UPI</option>
                <option value="BANK_TRANSFER">Direct Bank Transfer</option>
                <option value="CHEQUE">Company Cheque</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Payment Source</label>
              <select
                value={paidByCompany ? 'COMPANY' : 'REIMBURSABLE'}
                onChange={(e) => setPaidByCompany(e.target.value === 'COMPANY')}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
              >
                <option value="COMPANY">Company Paid (Non-deductible)</option>
                <option value="REIMBURSABLE">Employee Paid (Reimbursable)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              Submit Expense Voucher
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
