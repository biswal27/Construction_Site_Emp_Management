import React, { useState } from 'react';
import { User, Employee, Role } from '../../types';
import { 
  Users, 
  ShieldCheck, 
  UserPlus, 
  Search, 
  CheckCircle2, 
  Lock, 
  Key, 
  UserCheck, 
  Building2, 
  Phone,
  Filter,
  ArrowRight
} from 'lucide-react';

interface UserManagerProps {
  users: User[];
  currentUser: User;
  employees: Employee[];
  onOpenRegisterUser: () => void;
  onSwitchUser: (user: User) => void;
  onOpenAddEmployee: () => void;
}

export const UserManager: React.FC<UserManagerProps> = ({
  users,
  currentUser,
  employees,
  onOpenRegisterUser,
  onSwitchUser,
  onOpenAddEmployee,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | Role>('ALL');

  const isAdmin = currentUser.role === 'ADMIN';

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.employeeId && u.employeeId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">User Accounts &amp; Security</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Controlled</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Role-based access control (RBAC): Only site administrators can register users and provision workforce employees.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {isAdmin ? (
            <>
              <button
                onClick={onOpenRegisterUser}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition cursor-pointer"
              >
                <UserPlus className="h-4 w-4" />
                <span>Register User</span>
              </button>
              <button
                onClick={onOpenAddEmployee}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold text-xs transition cursor-pointer"
              >
                <Users className="h-4 w-4 text-amber-400" />
                <span>Add Employee</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-400">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Admin Rights Required to Register Users</span>
            </div>
          )}
        </div>
      </div>

      {/* Role Enforcement Explanatory Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Administrator Privileges (Active)
            </h4>
          </div>
          <ul className="text-xs text-slate-300 space-y-1 pl-4 list-disc marker:text-amber-400">
            <li>Exclusively authorized to register new user logins &amp; credentials</li>
            <li>Exclusively authorized to add new workforce employees &amp; daily wage laborers</li>
            <li>Approve petty cash vouchers, advance requests &amp; monthly payroll</li>
          </ul>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-indigo-400" />
            <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
              Worker / Employee Access
            </h4>
          </div>
          <ul className="text-xs text-slate-400 space-y-1 pl-4 list-disc marker:text-indigo-400">
            <li>Restricted from registering other users or creating employees</li>
            <li>Biometric GPS check-in, attendance logs &amp; wage calculations</li>
            <li>Submit personal site expense vouchers and view digital payslips</li>
          </ul>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, username, employee ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none cursor-pointer"
          >
            <option value="ALL">All Roles ({users.length})</option>
            <option value="ADMIN">Administrators ({users.filter((u) => u.role === 'ADMIN').length})</option>
            <option value="EMPLOYEE">Employees / Workers ({users.filter((u) => u.role === 'EMPLOYEE').length})</option>
          </select>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => {
          const isCurrent = user.id === currentUser.id;
          const linkedEmp = user.employeeId ? employees.find((e) => e.id === user.employeeId) : null;

          return (
            <div
              key={user.id}
              className={`p-4 rounded-2xl border transition-all ${
                isCurrent
                  ? 'bg-slate-900/95 border-amber-500/50 ring-1 ring-amber-500/30'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                      alt={user.fullName}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-700"
                    />
                    {isCurrent && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-slate-950 flex items-center justify-center">
                        <CheckCircle2 className="w-2.5 h-2.5 text-slate-950" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>{user.fullName}</span>
                      {isCurrent && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-semibold">
                          You
                        </span>
                      )}
                    </h4>
                    <span className="text-xs text-slate-400 font-mono">@{user.username}</span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    user.role === 'ADMIN'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                  }`}
                >
                  {user.role}
                </span>
              </div>

              {/* Linked Employee Information */}
              <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs space-y-1">
                {linkedEmp ? (
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Linked Profile:</span>
                    <span className="font-semibold text-white">
                      {linkedEmp.id} &bull; {linkedEmp.designation}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Linked Profile:</span>
                    <span className="italic">Direct Administrator Account</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-slate-400">
                  <span>User ID:</span>
                  <span className="font-mono text-slate-300">USR-{String(user.id).padStart(3, '0')}</span>
                </div>
              </div>

              {/* Action */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {user.role === 'ADMIN' ? 'Site Administrator' : 'Worker Persona'}
                </span>
                {!isCurrent && (
                  <button
                    onClick={() => onSwitchUser(user)}
                    className="flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 transition"
                  >
                    <span>Switch Role</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
