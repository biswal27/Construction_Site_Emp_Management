import React, { useState } from 'react';
import { Employee, EmploymentType } from '../../types';
import { X, Save, AlertCircle, ShieldCheck, UserPlus, KeyRound, Lock } from 'lucide-react';

interface EmployeeFormModalProps {
  employee?: Employee | null;
  onClose: () => void;
  onSave: (emp: Employee, createUserData?: { username: string; password?: string; role: 'ADMIN' | 'EMPLOYEE' }) => void;
  isAdmin?: boolean;
}

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  employee,
  onClose,
  onSave,
  isAdmin = true,
}) => {
  const isEdit = Boolean(employee);

  const [formData, setFormData] = useState<Employee>({
    id: employee?.id || `EMP-${Math.floor(100 + Math.random() * 900)}`,
    fullName: employee?.fullName || '',
    parentName: employee?.parentName || '',
    dateOfBirth: employee?.dateOfBirth || '1995-01-01',
    gender: employee?.gender || 'MALE',
    mobileNumber: employee?.mobileNumber || '',
    alternateMobileNumber: employee?.alternateMobileNumber || '',
    email: employee?.email || '',
    address: employee?.address || '',
    city: employee?.city || 'Noida',
    state: employee?.state || 'Uttar Pradesh',
    country: employee?.country || 'India',
    emergencyContactName: employee?.emergencyContactName || '',
    emergencyContactNumber: employee?.emergencyContactNumber || '',
    joiningDate: employee?.joiningDate || new Date().toISOString().split('T')[0],
    department: employee?.department || 'Civil Structure',
    designation: employee?.designation || 'Mason',
    skillTrade: employee?.skillTrade || 'Brickwork',
    employmentType: employee?.employmentType || 'DAILY_WAGE',
    monthlySalary: employee?.monthlySalary || 0,
    dailyWage: employee?.dailyWage || 800,
    foodAllowance: employee?.foodAllowance || 2500,
    travelAllowance: employee?.travelAllowance || 1000,
    rentAllowance: employee?.rentAllowance || 0,
    otherAllowance: employee?.otherAllowance || 500,
    bankAccountNumber: employee?.bankAccountNumber || '',
    bankIfsc: employee?.bankIfsc || '',
    bankName: employee?.bankName || '',
    upiId: employee?.upiId || '',
    aadhaarNumberMasked: employee?.aadhaarNumberMasked || 'XXXX-XXXX-9999',
    panNumberMasked: employee?.panNumberMasked || 'ABCDE****K',
    accommodationStatus: employee?.accommodationStatus || 'COMPANY_PROVIDED',
    rentResponsibility: employee?.rentResponsibility || 'COMPANY_PAID',
    status: employee?.status || 'ACTIVE',
    profilePhoto:
      employee?.profilePhoto ||
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    notes: employee?.notes || '',
  });

  // User Account registration option for new employees
  const [createUserAccount, setCreateUserAccount] = useState<boolean>(false);
  const [accountUsername, setAccountUsername] = useState<string>('');
  const [accountPassword, setAccountPassword] = useState<string>('');
  const [userRole, setUserRole] = useState<'ADMIN' | 'EMPLOYEE'>('EMPLOYEE');

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      setError('Access Denied: Only administrators have permission to register or add employees.');
      return;
    }
    if (!formData.fullName.trim()) {
      setError('Full Name is required');
      return;
    }
    if (!formData.mobileNumber.trim()) {
      setError('Mobile Number is required');
      return;
    }
    if (!formData.bankAccountNumber.trim()) {
      setError('Bank Account Number is required for salary disbursement');
      return;
    }
    if (
      (formData.employmentType === 'DAILY_WAGE' || formData.employmentType === 'CONTRACT_WORKER') &&
      formData.dailyWage <= 0
    ) {
      setError('Daily wage must be greater than zero for daily workers');
      return;
    }
    if (formData.employmentType === 'MONTHLY_SALARY' && formData.monthlySalary <= 0) {
      setError('Monthly salary must be greater than zero for monthly employees');
      return;
    }

    if (createUserAccount && !accountUsername.trim()) {
      setError('Username is required to create a user account for this employee');
      return;
    }

    const userData = createUserAccount
      ? {
          username: accountUsername.trim().toLowerCase(),
          password: accountPassword || undefined,
          role: userRole,
        }
      : undefined;

    onSave(formData, userData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">
                {isEdit ? `Edit Employee Profile (${formData.id})` : 'Register New Construction Worker'}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500 text-slate-950 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Admin Only</span>
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Configure profile, banking details, and compensation. Authorized by Administrator.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!isAdmin ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Administrator Access Required</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              You do not have permission to add new employees. Please switch to an Administrator account to register workforce members.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Section 1: Basic Information */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                1. Basic Profile &amp; Contact
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => {
                      const name = e.target.value;
                      setFormData({ ...formData, fullName: name });
                      if (!accountUsername && name) {
                        setAccountUsername(name.toLowerCase().replace(/\s+/g, '.') + (Math.floor(Math.random() * 90) + 10));
                      }
                    }}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Father's / Guardian Name</label>
                  <input
                    type="text"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    placeholder="e.g. Suresh Kumar"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Mobile Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Provision User Account Section (For Admins) */}
            {!isEdit && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-amber-300">
                      Provision App User Login Account
                    </span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={createUserAccount}
                      onChange={(e) => setCreateUserAccount(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-slate-800 border-slate-700"
                    />
                    <span className="text-xs text-slate-300 font-medium">Create User Account</span>
                  </label>
                </div>

                {createUserAccount && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-amber-500/20">
                    <div>
                      <label className="text-[11px] text-slate-300 block mb-1 font-semibold">
                        System Username *
                      </label>
                      <input
                        type="text"
                        required={createUserAccount}
                        value={accountUsername}
                        onChange={(e) => setAccountUsername(e.target.value)}
                        placeholder="e.g. ramesh.kumar12"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-amber-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-300 block mb-1 font-semibold">
                        Mobile App PIN / Password
                      </label>
                      <input
                        type="password"
                        value={accountPassword}
                        onChange={(e) => setAccountPassword(e.target.value)}
                        placeholder="e.g. 1234 or pass"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-300 block mb-1 font-semibold">
                        Assigned Role
                      </label>
                      <select
                        value={userRole}
                        onChange={(e) => setUserRole(e.target.value as any)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-amber-500 cursor-pointer"
                      >
                        <option value="EMPLOYEE">Worker / Employee</option>
                        <option value="ADMIN">Site Administrator</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Section 2: Department & Designation */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                2. Job Role &amp; Trade
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                >
                  <option value="Civil Structure">Civil Structure</option>
                  <option value="Masonry & Plastering">Masonry &amp; Plastering</option>
                  <option value="Site Supervision">Site Supervision</option>
                  <option value="Steel & Rebar Fabrication">Steel &amp; Rebar Fabrication</option>
                  <option value="Electrical & MEP">Electrical &amp; MEP</option>
                  <option value="Heavy Equipment Operations">Heavy Equipment Operations</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Designation</label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  placeholder="e.g. Lead Carpenter"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Trade Skill</label>
                <input
                  type="text"
                  value={formData.skillTrade}
                  onChange={(e) => setFormData({ ...formData, skillTrade: e.target.value })}
                  placeholder="e.g. Shuttering & Formwork"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Compensation & Wage Structure */}
          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
              2. Wage Structure &amp; Employment Type
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Employment Type *</label>
                <select
                  value={formData.employmentType}
                  onChange={(e) =>
                    setFormData({ ...formData, employmentType: e.target.value as EmploymentType })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                >
                  <option value="DAILY_WAGE">Daily Wage</option>
                  <option value="MONTHLY_SALARY">Monthly Salary</option>
                  <option value="CONTRACT_WORKER">Contract Worker</option>
                  <option value="TEMPORARY_WORKER">Temporary Worker</option>
                </select>
              </div>

              {formData.employmentType === 'DAILY_WAGE' || formData.employmentType === 'CONTRACT_WORKER' ? (
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Daily Wage Rate (₹ / day) *</label>
                  <input
                    type="number"
                    value={formData.dailyWage}
                    onChange={(e) => setFormData({ ...formData, dailyWage: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-amber-400 outline-none focus:border-amber-500"
                  />
                </div>
              ) : (
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Monthly Base Salary (₹) *</label>
                  <input
                    type="number"
                    value={formData.monthlySalary}
                    onChange={(e) => setFormData({ ...formData, monthlySalary: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white outline-none focus:border-amber-500"
                  />
                </div>
              )}

              <div>
                <label className="text-xs text-slate-400 block mb-1">Monthly Food Allowance Cap (₹)</label>
                <input
                  type="number"
                  value={formData.foodAllowance}
                  onChange={(e) => setFormData({ ...formData, foodAllowance: Number(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Monthly Travel Allowance (₹)</label>
                <input
                  type="number"
                  value={formData.travelAllowance}
                  onChange={(e) => setFormData({ ...formData, travelAllowance: Number(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Accommodation Status</label>
                <select
                  value={formData.accommodationStatus}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      accommodationStatus: e.target.value as any,
                    })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                >
                  <option value="COMPANY_PROVIDED">Company Provided</option>
                  <option value="SELF_RENTED">Self Rented</option>
                  <option value="NOT_APPLICABLE">Not Applicable</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Rent Responsibility</label>
                <select
                  value={formData.rentResponsibility}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rentResponsibility: e.target.value as any,
                    })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                >
                  <option value="COMPANY_PAID">Company Paid</option>
                  <option value="EMPLOYEE_PAID">Employee Paid</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Banking Details */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              3. Banking &amp; Payment Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Bank Name *</label>
                <input
                  type="text"
                  required
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  placeholder="e.g. State Bank of India"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Bank Account Number *</label>
                <input
                  type="text"
                  required
                  value={formData.bankAccountNumber}
                  onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                  placeholder="320145892341"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">IFSC Code *</label>
                <input
                  type="text"
                  required
                  value={formData.bankIfsc}
                  onChange={(e) => setFormData({ ...formData, bankIfsc: e.target.value })}
                  placeholder="SBIN0004512"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Emergency Contacts */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              4. Emergency Contact (Mandatory for Construction Site Safety)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Emergency Contact Person</label>
                <input
                  type="text"
                  required
                  value={formData.emergencyContactName}
                  onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                  placeholder="e.g. Kailash Devi (Spouse)"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Emergency Phone Number</label>
                <input
                  type="text"
                  required
                  value={formData.emergencyContactNumber}
                  onChange={(e) => setFormData({ ...formData, emergencyContactNumber: e.target.value })}
                  placeholder="+91 97123 45670"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                />
              </div>
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
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20"
            >
              <Save className="h-4 w-4" />
              <span>{isEdit ? 'Update Profile' : 'Save Employee'}</span>
            </button>
          </div>
        </form>
      )}
      </div>
    </div>
  );
};
