import React from 'react';
import { Employee } from '../../types';
import { MoneyUtils } from '../../services/salaryEngine';
import {
  X,
  Phone,
  Mail,
  MapPin,
  Building2,
  Briefcase,
  CreditCard,
  Home,
  Shield,
  Calendar,
  AlertTriangle,
} from 'lucide-react';

interface EmployeeDetailModalProps {
  employee: Employee | null;
  onClose: () => void;
  onEdit?: (emp: Employee) => void;
  onViewSalarySlip?: (emp: Employee) => void;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  employee,
  onClose,
  onEdit,
  onViewSalarySlip,
}) => {
  if (!employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={employee.profilePhoto}
              alt={employee.fullName}
              className="w-12 h-12 rounded-xl object-cover border border-amber-500/40"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{employee.fullName}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-semibold border border-amber-500/30">
                  {employee.id}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                  {employee.status}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {employee.designation} &bull; {employee.department}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Financial & Wage Configuration */}
          <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Wage &amp; Financial Structure
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {employee.employmentType.replace('_', ' ')}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {employee.employmentType === 'DAILY_WAGE' || employee.employmentType === 'CONTRACT_WORKER' ? (
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">Daily Wage Rate</span>
                  <span className="text-base font-bold font-mono text-amber-400">
                    {MoneyUtils.formatINR(employee.dailyWage)} / day
                  </span>
                </div>
              ) : (
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">Monthly Base Salary</span>
                  <span className="text-base font-bold font-mono text-white">
                    {MoneyUtils.formatINR(employee.monthlySalary)}
                  </span>
                </div>
              )}

              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Food Allowance Cap</span>
                <span className="text-sm font-bold font-mono text-white">
                  {MoneyUtils.formatINR(employee.foodAllowance)}
                </span>
              </div>

              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Travel Allowance</span>
                <span className="text-sm font-bold font-mono text-white">
                  {MoneyUtils.formatINR(employee.travelAllowance)}
                </span>
              </div>

              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Accommodation</span>
                <span className="text-xs font-bold text-emerald-400">
                  {employee.rentResponsibility.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Banking & Identity Verification (Masked for Compliance) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-400" />
              Banking &amp; Identity Reference (Masked)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <span className="text-slate-400 block">Bank &amp; Account</span>
                <span className="font-semibold text-white block mt-0.5">{employee.bankName}</span>
                <span className="font-mono text-amber-400 block text-[11px] mt-0.5">
                  A/C: {employee.bankAccountNumber}
                </span>
                <span className="font-mono text-slate-400 block text-[10px]">IFSC: {employee.bankIfsc}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <span className="text-slate-400 block">UPI ID</span>
                <span className="font-mono font-semibold text-white block mt-1">
                  {employee.upiId || 'Not Configured'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <span className="text-slate-400 block">National Identity Mask</span>
                <span className="font-mono text-slate-200 block mt-1">
                  Aadhaar: {employee.aadhaarNumberMasked}
                </span>
                <span className="font-mono text-slate-200 block">
                  PAN: {employee.panNumberMasked}
                </span>
              </div>
            </div>
          </div>

          {/* Personal & Emergency Contacts */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-blue-400" />
              Personal &amp; Emergency Profile
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Parent / Guardian:</span>
                  <span className="font-medium text-white">{employee.parentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date of Birth / Gender:</span>
                  <span className="font-medium text-white">{employee.dateOfBirth} ({employee.gender})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Joining Date:</span>
                  <span className="font-medium text-white">{employee.joiningDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Trade Skill:</span>
                  <span className="font-medium text-amber-400">{employee.skillTrade}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span>{employee.mobileNumber}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span>{employee.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  <span>{employee.address}, {employee.city}, {employee.state}</span>
                </div>
                <div className="pt-1.5 border-t border-slate-700/60 flex items-center gap-2 text-rose-400 font-semibold">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Emergency: {employee.emergencyContactName} ({employee.emergencyContactNumber})</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur px-6 py-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
          >
            Close
          </button>
          <div className="flex items-center gap-3">
            {onViewSalarySlip && (
              <button
                onClick={() => onViewSalarySlip(employee)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold border border-slate-700"
              >
                Generate Payslip
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => onEdit(employee)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
