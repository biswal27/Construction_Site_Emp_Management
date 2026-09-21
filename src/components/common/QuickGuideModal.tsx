import React, { useState } from 'react';
import { 
  BookOpen, 
  Fingerprint, 
  Users, 
  Camera, 
  Wallet, 
  Smartphone, 
  X, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Building2
} from 'lucide-react';

interface QuickGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenInstallModal: () => void;
}

export const QuickGuideModal: React.FC<QuickGuideModalProps> = ({ 
  isOpen, 
  onClose,
  onOpenInstallModal 
}) => {
  const [activeSection, setActiveSection] = useState<number>(0);

  if (!isOpen) return null;

  const sections = [
    {
      title: '1. GPS Biometric Punch-In',
      icon: <Fingerprint className="w-5 h-5 text-amber-400" />,
      tag: 'Home Screen',
      summary: 'Biometric attendance with real-time site geofence verification.',
      steps: [
        'Open the Home screen on your phone or in the Android view.',
        'Ensure the GPS Geofence indicator shows "Active (within 14m of Gate)".',
        'Tap the large circular fingerprint button to Punch IN.',
        'Your daily attendance status, wage accumulator, and shift start time record immediately.',
      ],
      tip: 'Works completely offline—records queue automatically and sync when network returns.',
    },
    {
      title: '2. Daily Muster Roll & Overtime',
      icon: <Users className="w-5 h-5 text-emerald-400" />,
      tag: 'Muster Roll Screen',
      summary: 'Supervisor tool to mark workforce shifts and calculate overtime.',
      steps: [
        'Navigate to the "Muster Roll" tab at the bottom.',
        'Filter workforce by trade (Masons, Carpenters, Welders, Helpers).',
        'Tap "P" (Present), "H" (Half Day), or "A" (Absent) on any worker.',
        'Use the Overtime Slider to assign 1h–4h of extra shift work with real-time statutory 2x wage calculations.',
        'Tap "Mark All Present" at the top for rapid morning muster roll roll-call.',
      ],
      tip: 'Tap on any worker card to view their complete profile, Aadhaar, and trade specs.',
    },
    {
      title: '3. CameraX AI Receipt Scanner',
      icon: <Camera className="w-5 h-5 text-sky-400" />,
      tag: 'Scanner Screen',
      summary: 'Scan fuel, hardware, and cement vouchers with automatic optical recognition.',
      steps: [
        'Navigate to the "Scanner" tab.',
        'Aim the viewfinder at any site voucher or receipt.',
        'Tap "Snap & Analyze Voucher" or pick one of the sample site receipts (Diesel Fuel, Steel Fasteners, Cement).',
        'The simulated ML Kit OCR instantly extracts the Vendor, Total Amount, Date, and Tax.',
        'Tap "Approve & Submit Expense" to log into site petty cash records.',
      ],
      tip: 'Supports flash toggle, front/rear camera switching, and gallery uploads.',
    },
    {
      title: '4. Digital Worker Wallet & NFC Badge',
      icon: <Wallet className="w-5 h-5 text-indigo-400" />,
      tag: 'Wallet Screen',
      summary: 'Worker passbook with NFC smart card, UPI payments, and salary advances.',
      steps: [
        'Navigate to the "Wallet" tab.',
        'Flip the NFC Smart Badge to view front/back RFID details and QR gate pass.',
        'Review current month net earnings, daily wage breakdown, and overtime bonuses.',
        'Apply for a Salary Advance (up to ₹10,000) with flexible EMI deductions.',
        'Download instant PDF/printable monthly payslip with legal statutory deductions.',
      ],
      tip: 'Workers can verify their registered UPI VPA (e.g., ravi.kumar@okhdfcbank).',
    },
    {
      title: '5. Install on Your Mobile Phone',
      icon: <Smartphone className="w-5 h-5 text-purple-400" />,
      tag: 'PWA Mobile App',
      summary: 'Install BuildForce directly on your phone like a native Android app.',
      steps: [
        'Tap "Install Mobile App" in the top bar or inside the quick settings shade.',
        'On Android: Tap "Install" to add to your home screen with offline capabilities.',
        'On iPhone: Tap the Safari Share button [↑] and select "Add to Home Screen".',
        'On Laptop/Desktop: Scan the QR code with your phone camera to open and install.',
      ],
      tip: 'Requires less than 2MB of storage and works seamlessly with offline Room DB.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20">
              <BookOpen className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                User Guide &amp; Quick Walkthrough
              </h3>
              <p className="text-xs text-slate-400">
                How to use BuildForce on mobile &amp; desktop
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 overflow-x-auto px-4 py-2 gap-1.5 scrollbar-none">
          {sections.map((sec, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSection(idx)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeSection === idx
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{idx + 1}.</span>
              <span>{sec.title.split('. ')[1]}</span>
            </button>
          ))}
        </div>

        {/* Active Section Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                {sections[activeSection].icon}
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  {sections[activeSection].title}
                </h4>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  {sections[activeSection].tag}
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
            {sections[activeSection].summary}
          </p>

          <div className="space-y-2.5">
            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Step-by-Step Instructions:
            </h5>
            <div className="space-y-2">
              {sections[activeSection].steps.map((step, sIdx) => (
                <div key={sIdx} className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-200">
                  <div className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center text-[11px] shrink-0 border border-slate-700">
                    {sIdx + 1}
                  </div>
                  <div className="pt-0.5 leading-relaxed">{step}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Tip Box */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-amber-400">Site Tip: </strong>
              <span>{sections[activeSection].tip}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/95 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onOpenInstallModal();
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition active:scale-95"
          >
            <Smartphone className="w-4 h-4" />
            <span>Install on Mobile</span>
          </button>

          <div className="flex items-center gap-2">
            {activeSection > 0 && (
              <button
                onClick={() => setActiveSection(activeSection - 1)}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Previous
              </button>
            )}
            {activeSection < sections.length - 1 ? (
              <button
                onClick={() => setActiveSection(activeSection + 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
              >
                Got it!
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
