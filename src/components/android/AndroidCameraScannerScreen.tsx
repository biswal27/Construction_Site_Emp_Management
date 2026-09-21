import React, { useState } from 'react';
import { 
  Camera, 
  Sparkles, 
  Flashlight, 
  RotateCcw, 
  UploadCloud, 
  CheckCircle2, 
  Receipt, 
  AlertCircle,
  FileText,
  DollarSign
} from 'lucide-react';
import { ExpenseRecord, ExpenseCategory, User, Employee } from '../../types';
import { MoneyUtils } from '../../services/salaryEngine';
import { MaterialTheme } from './types';
import { THEMES } from './themeUtils';

interface AndroidCameraScannerScreenProps {
  currentUser: User;
  employees: Employee[];
  onAddExpense: (expense: Omit<ExpenseRecord, 'id'>) => void;
  theme: MaterialTheme;
}

interface SampleReceipt {
  id: string;
  name: string;
  merchant: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  imageUrl: string;
}

const SAMPLE_RECEIPTS: SampleReceipt[] = [
  {
    id: 'rec-1',
    name: 'Generator Diesel (50L)',
    merchant: 'Indian Oil Fuel Hub, Sector 63',
    amount: 4650,
    category: 'DAILY_EXPENSE',
    date: '2026-09-20',
    imageUrl: 'https://images.unsplash.com/photo-1527018607637-02363bc8063a?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'rec-2',
    name: 'Site Labor Lunch (25 Thalis)',
    merchant: 'Radhe Shyam Bhojnalaya',
    amount: 2500,
    category: 'FOOD',
    date: '2026-09-20',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'rec-3',
    name: 'Cement Auto Freight',
    merchant: 'Noida Cargo Logistics',
    amount: 1400,
    category: 'TRAVEL',
    date: '2026-09-19',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&auto=format&fit=crop&q=80',
  },
];

export const AndroidCameraScannerScreen: React.FC<AndroidCameraScannerScreenProps> = ({
  currentUser,
  employees,
  onAddExpense,
  theme,
}) => {
  const currentTheme = THEMES[theme];
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [scanning, setScanning] = useState<boolean>(false);
  const [scannedResult, setScannedResult] = useState<SampleReceipt | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);

  const handleSimulateScan = (receipt: SampleReceipt) => {
    setScanning(true);
    setScannedResult(null);
    setSubmissionSuccess(false);

    setTimeout(() => {
      setScanning(false);
      setScannedResult(receipt);
    }, 1800);
  };

  const handleSubmitVoucher = () => {
    if (!scannedResult) return;

    onAddExpense({
      title: scannedResult.name,
      description: `AI OCR Scanned from ${scannedResult.merchant}`,
      amount: scannedResult.amount,
      expenseDate: scannedResult.date,
      category: scannedResult.category,
      paymentMethod: 'CASH',
      approvalStatus: 'PENDING',
      employeeId: currentUser.employeeId || employees[0].id,
      receiptUrl: scannedResult.imageUrl,
    });

    setSubmissionSuccess(true);
    setTimeout(() => {
      setScannedResult(null);
      setSubmissionSuccess(false);
    }, 2500);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-20 px-4 pt-3 space-y-4 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Camera className="w-5 h-5 text-sky-400" />
            <span>AI Receipt Scanner</span>
          </h2>
          <p className="text-[11px] text-slate-400">Android CameraX + ML Kit OCR Engine</p>
        </div>

        <button
          onClick={() => setTorchOn(!torchOn)}
          className={`p-2 rounded-xl border transition-colors ${
            torchOn
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30'
              : 'bg-slate-900 text-slate-300 border-slate-800'
          }`}
          title="Toggle Camera Flashlight"
        >
          <Flashlight className="w-4 h-4" />
        </button>
      </div>

      {/* Simulated Viewfinder */}
      <div className="relative w-full h-64 rounded-3xl bg-slate-900 border-2 border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center">
        {/* Background sample receipt or camera texture */}
        {scannedResult ? (
          <img
            src={scannedResult.imageUrl}
            alt="Scanned Bill"
            className="w-full h-full object-cover opacity-80"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950/90 flex flex-col items-center justify-center text-center p-4">
            <Receipt className="w-12 h-12 text-slate-600 mb-2" />
            <span className="text-xs font-bold text-slate-300">Point Camera at Receipt / Invoice</span>
            <span className="text-[10px] text-slate-500 mt-0.5">Keep receipt within the glowing alignment brackets</span>
          </div>
        )}

        {/* Viewfinder Alignment Brackets */}
        <div className="absolute inset-6 pointer-events-none border-2 border-dashed border-sky-400/40 rounded-2xl">
          <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-sky-400" />
          <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-sky-400" />
          <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-sky-400" />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-sky-400" />
        </div>

        {/* Animated Laser Scanning Line */}
        {scanning && (
          <div className="absolute inset-x-6 h-0.5 bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_15px_#38bdf8] animate-pulse transition-all duration-1000 top-1/2 -translate-y-1/2" />
        )}

        {/* Scanning Badge */}
        {scanning && (
          <div className="absolute bottom-4 px-3 py-1 bg-sky-500/90 text-slate-950 text-xs font-extrabold rounded-full flex items-center gap-1.5 shadow-lg animate-bounce">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>AI OCR Analyzing Document...</span>
          </div>
        )}
      </div>

      {/* Preset Test Receipts Picker */}
      <div>
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 px-1">
          Select Site Bill to Scan:
        </span>
        <div className="grid grid-cols-3 gap-2">
          {SAMPLE_RECEIPTS.map((r) => (
            <button
              key={r.id}
              onClick={() => handleSimulateScan(r)}
              className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-800/80 flex flex-col items-start gap-1 transition-all text-left"
            >
              <div className="text-[11px] font-bold text-white truncate w-full">{r.name}</div>
              <div className="text-xs font-mono font-bold text-sky-400">{MoneyUtils.formatINR(r.amount)}</div>
              <span className="text-[9px] text-slate-400 truncate w-full">{r.merchant}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Scanned OCR Result Card */}
      {scannedResult && !submissionSuccess && (
        <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-850 border border-sky-500/40 space-y-3 shadow-xl animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-bold text-sky-300 uppercase tracking-wide">
                OCR Data Extracted
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">
              Confidence: 99.4%
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Merchant:</span>
              <strong className="text-white font-semibold">{scannedResult.merchant}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Expense Category:</span>
              <span className="font-bold text-amber-400">{scannedResult.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Invoice Date:</span>
              <span className="font-mono text-slate-300">{scannedResult.date}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-800 text-sm">
              <span className="text-slate-300 font-bold">Total Amount:</span>
              <span className="font-mono font-bold text-emerald-400 text-base">
                {MoneyUtils.formatINR(scannedResult.amount)}
              </span>
            </div>
          </div>

          <button
            onClick={handleSubmitVoucher}
            className="w-full py-3 rounded-2xl bg-sky-500 text-slate-950 font-bold text-xs hover:bg-sky-400 active:scale-95 transition-all shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Submit Claim to Site Supervisor</span>
          </button>
        </div>
      )}

      {/* Success Banner */}
      {submissionSuccess && (
        <div className="p-4 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-center space-y-1 animate-in fade-in zoom-in-95">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
          <div className="text-sm font-bold text-emerald-300">Expense Voucher Created!</div>
          <p className="text-xs text-slate-300">
            Uploaded to Room local database and queued for WorkManager cloud sync.
          </p>
        </div>
      )}
    </div>
  );
};
