import React, { useState, useMemo } from 'react';
import { Employee, EmploymentType, EmployeeStatus } from '../../types';
import { MoneyUtils } from '../../services/salaryEngine';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit2,
  FileText,
  Phone,
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  Lock,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';

interface EmployeeListProps {
  employees: Employee[];
  onSelectEmployee: (emp: Employee) => void;
  onEditEmployee: (emp: Employee) => void;
  onAddEmployee: () => void;
  onViewPayslip: (emp: Employee) => void;
  isAdmin?: boolean;
  onOpenRegisterUser?: () => void;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({
  employees,
  onSelectEmployee,
  onEditEmployee,
  onAddEmployee,
  onViewPayslip,
  isAdmin = true,
  onOpenRegisterUser,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const departments = useMemo(() => {
    return ['ALL', ...Array.from(new Set(employees.map((e) => e.department)))];
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.mobileNumber.includes(searchTerm) ||
        emp.skillTrade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.designation.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDept = departmentFilter === 'ALL' || emp.department === departmentFilter;
      const matchesType = typeFilter === 'ALL' || emp.employmentType === typeFilter;
      const matchesStatus = statusFilter === 'ALL' || emp.status === statusFilter;

      return matchesSearch && matchesDept && matchesType && matchesStatus;
    });
  }, [employees, searchTerm, departmentFilter, typeFilter, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Workforce Directory</h2>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded border flex items-center gap-1 ${
                isAdmin
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
              }`}
            >
              {isAdmin ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Full Access</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Read-Only View</span>
                </>
              )}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage construction site workers, trades, compensation models, and credentials
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          {isAdmin ? (
            <>
              {onOpenRegisterUser && (
                <button
                  onClick={onOpenRegisterUser}
                  className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all cursor-pointer"
                  title="Register new user login credentials"
                >
                  <UserPlus className="h-4 w-4 text-amber-400" />
                  <span>Register User</span>
                </button>
              )}
              <button
                onClick={onAddEmployee}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Worker / Employee</span>
              </button>
            </>
          ) : (
            <div
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400 text-xs font-semibold"
              title="Admin access required to register users or add employees"
            >
              <Lock className="h-4 w-4 text-amber-400" />
              <span>Admin Only: Add Worker</span>
            </div>
          )}
        </div>
      </div>

      {/* Non-Admin Notice Banner */}
      {!isAdmin && (
        <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold text-indigo-200">Role Restriction: </strong>
            <span>
              You are logged in as a Worker/Employee persona. Only administrators can register new user accounts or add new workers.
            </span>
          </div>
        </div>
      )}

      {/* Filter Toolbar (Requirement 20) */}
      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, ID, phone, trade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 outline-none focus:border-amber-500"
            />
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5">
            <Building2 className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-200 outline-none cursor-pointer"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept} className="bg-slate-900">
                  {dept === 'ALL' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
          </div>

          {/* Employment Type Filter */}
          <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-200 outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Employment Types</option>
              <option value="DAILY_WAGE" className="bg-slate-900">Daily Wage Workers</option>
              <option value="MONTHLY_SALARY" className="bg-slate-900">Monthly Salaried</option>
              <option value="CONTRACT_WORKER" className="bg-slate-900">Contract Worker</option>
              <option value="TEMPORARY_WORKER" className="bg-slate-900">Temporary Worker</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-200 outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Statuses</option>
              <option value="ACTIVE" className="bg-slate-900">Active</option>
              <option value="INACTIVE" className="bg-slate-900">Inactive</option>
              <option value="TERMINATED" className="bg-slate-900">Terminated</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <span>
            Showing <strong className="text-white">{filteredEmployees.length}</strong> of {employees.length} employees
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                viewMode === 'table' ? 'bg-slate-700 text-white' : 'hover:bg-slate-800'
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                viewMode === 'cards' ? 'bg-slate-700 text-white' : 'hover:bg-slate-800'
              }`}
            >
              Cards View
            </button>
          </div>
        </div>
      </div>

      {/* Employee Renderers */}
      {viewMode === 'table' ? (
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/60 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Employee &amp; ID</th>
                  <th className="px-4 py-3">Department &amp; Trade</th>
                  <th className="px-4 py-3">Payment Type</th>
                  <th className="px-4 py-3">Rate / Base</th>
                  <th className="px-4 py-3">Allowances</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={emp.profilePhoto}
                          alt={emp.fullName}
                          className="w-9 h-9 rounded-xl object-cover border border-slate-700"
                        />
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{emp.fullName}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              {emp.id}
                            </span>
                          </div>
                          <div className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                            <Phone className="h-3 w-3" /> {emp.mobileNumber}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-200">{emp.department}</div>
                      <div className="text-slate-400 text-[11px]">{emp.skillTrade}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          emp.employmentType === 'DAILY_WAGE'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                        }`}
                      >
                        {emp.employmentType.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-100">
                      {emp.employmentType === 'DAILY_WAGE' ? (
                        <span className="text-amber-400">{MoneyUtils.formatINR(emp.dailyWage)} / day</span>
                      ) : (
                        <span>{MoneyUtils.formatINR(emp.monthlySalary)} / mo</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[11px] text-slate-300">
                      <div>Food: ₹{emp.foodAllowance}</div>
                      <div className="text-slate-400">Travel: ₹{emp.travelAllowance}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          emp.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-slate-700 text-slate-400'
                        }`}
                      >
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onSelectEmployee(emp)}
                          title="View Complete Profile"
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onEditEmployee(emp)}
                          title="Edit Profile"
                          className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onViewPayslip(emp)}
                          title="Generate Payslip"
                          className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map((emp) => (
            <div
              key={emp.id}
              className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={emp.profilePhoto}
                      alt={emp.fullName}
                      className="w-12 h-12 rounded-xl object-cover border border-amber-500/30"
                    />
                    <div>
                      <h3 className="font-bold text-white text-sm">{emp.fullName}</h3>
                      <span className="text-[11px] font-mono text-amber-400">{emp.id}</span>
                      <p className="text-[11px] text-slate-400">{emp.designation}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      emp.employmentType === 'DAILY_WAGE'
                        ? 'bg-amber-500/15 text-amber-400'
                        : 'bg-blue-500/15 text-blue-400'
                    }`}
                  >
                    {emp.employmentType === 'DAILY_WAGE' ? 'Daily' : 'Monthly'}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 py-2 border-y border-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Trade:</span>
                    <span className="font-medium">{emp.skillTrade}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Compensation:</span>
                    <span className="font-mono font-bold text-amber-400">
                      {emp.employmentType === 'DAILY_WAGE'
                        ? `${MoneyUtils.formatINR(emp.dailyWage)} / day`
                        : `${MoneyUtils.formatINR(emp.monthlySalary)} / mo`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Housing:</span>
                    <span className="text-emerald-400">{emp.rentResponsibility.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">{emp.mobileNumber}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onSelectEmployee(emp)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => onViewPayslip(emp)}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-xs text-amber-400 font-medium"
                  >
                    Payslip
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
