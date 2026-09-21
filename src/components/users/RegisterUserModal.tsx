import React, { useState } from 'react';
import { User, Role, Employee } from '../../types';
import { X, ShieldCheck, UserPlus, AlertCircle, KeyRound, User as UserIcon, Mail, Phone, Check } from 'lucide-react';

interface RegisterUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterUser: (newUser: Omit<User, 'id'>) => void;
  employees: Employee[];
  existingUsers: User[];
  currentAdmin: User;
}

export const RegisterUserModal: React.FC<RegisterUserModalProps> = ({
  isOpen,
  onClose,
  onRegisterUser,
  employees,
  existingUsers,
  currentAdmin,
}) => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<Role>('EMPLOYEE');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
  );
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Security Check: Only Admin can access this modal
  const isAdmin = currentAdmin.role === 'ADMIN';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isAdmin) {
      setError('Access Denied: Only administrators have permission to register new users.');
      return;
    }

    if (!fullName.trim()) {
      setError('Full Name is required.');
      return;
    }

    if (!username.trim()) {
      setError('Username is required.');
      return;
    }

    // Check if username is already taken
    const usernameClean = username.trim().toLowerCase();
    const isTaken = existingUsers.some((u) => u.username.toLowerCase() === usernameClean);
    if (isTaken) {
      setError(`Username "${usernameClean}" is already registered. Please choose another.`);
      return;
    }

    if (password && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    onRegisterUser({
      username: usernameClean,
      role,
      fullName: fullName.trim(),
      employeeId: role === 'EMPLOYEE' && selectedEmployeeId ? selectedEmployeeId : undefined,
      avatarUrl: avatarUrl || undefined,
    });

    onClose();
  };

  // Auto-populate full name and username if an existing employee is selected
  const handleEmployeeSelect = (empId: string) => {
    setSelectedEmployeeId(empId);
    const emp = employees.find((e) => e.id === empId);
    if (emp) {
      if (!fullName) setFullName(emp.fullName);
      if (!username) {
        const generatedUser = emp.fullName.toLowerCase().replace(/\s+/g, '.') + (Math.floor(Math.random() * 90) + 10);
        setUsername(generatedUser);
      }
      if (emp.profilePhoto) {
        setAvatarUrl(emp.profilePhoto);
      }
    }
  };

  const presetAvatars = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/95">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold shadow-md shadow-amber-500/10">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Register New User Account</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500 text-slate-950 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Admin Only</span>
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Create login credentials and role assignment for site personnel
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Security Notice */}
          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700 text-xs text-slate-300 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Admin RBAC Enforcement: </span>
              <span>Only authorized administrators can provision system users and link employee profiles. Active admin: </span>
              <strong className="text-amber-400">{currentAdmin.fullName}</strong>.
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* User Role Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">System Role</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('ADMIN')}
                className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                  role === 'ADMIN'
                    ? 'bg-amber-500/15 border-amber-500/40 ring-1 ring-amber-500/30'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${role === 'ADMIN' ? 'text-amber-400' : 'text-slate-200'}`}>
                    Site Administrator
                  </span>
                  {role === 'ADMIN' && <Check className="w-4 h-4 text-amber-400" />}
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Full access to register users, add employees, approve payroll, and manage site expenses.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setRole('EMPLOYEE')}
                className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                  role === 'EMPLOYEE'
                    ? 'bg-indigo-500/15 border-indigo-500/40 ring-1 ring-indigo-500/30'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${role === 'EMPLOYEE' ? 'text-indigo-400' : 'text-slate-200'}`}>
                    Worker / Employee
                  </span>
                  {role === 'EMPLOYEE' && <Check className="w-4 h-4 text-indigo-400" />}
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Mobile view, biometric punch, attendance history, payslips, and petty cash vouchers.
                </p>
              </button>
            </div>
          </div>

          {/* Link to Employee (if Employee role) */}
          {role === 'EMPLOYEE' && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Link to Workforce Employee Record</span>
                <span className="text-[10px] text-slate-400">Optional</span>
              </label>
              <select
                value={selectedEmployeeId}
                onChange={(e) => handleEmployeeSelect(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
              >
                <option value="">-- Standalone User Account --</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.id} - {emp.fullName} ({emp.designation} &bull; {emp.department})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Full Name *</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Chandra"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Username *</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-xs text-slate-400 font-mono">@</span>
              <input
                type="text"
                required
                placeholder="e.g. ramesh.chandra"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-400 outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          {/* Password / PIN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Initial Password / PIN</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Confirm Password</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Avatar Preset Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Profile Avatar</label>
            <div className="flex items-center gap-3">
              <img
                src={avatarUrl}
                alt="Selected Avatar"
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-amber-500/40"
              />
              <div className="flex items-center gap-2 flex-wrap">
                {presetAvatars.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatarUrl(url)}
                    className={`w-9 h-9 rounded-xl overflow-hidden border transition-all ${
                      avatarUrl === url ? 'ring-2 ring-amber-500 border-transparent scale-105' : 'border-slate-700 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register User</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
