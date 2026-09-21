import React, { useState } from 'react';
import { AccommodationLease, Employee } from '../../types';
import { MoneyUtils } from '../../services/salaryEngine';
import {
  Home,
  Users,
  Phone,
  Building,
  Zap,
  Droplets,
  Plus,
  ShieldCheck,
  MapPin,
  FileText,
} from 'lucide-react';

interface AccommodationManagerProps {
  leases: AccommodationLease[];
  employees: Employee[];
  onAddLease?: (lease: AccommodationLease) => void;
}

export const AccommodationManager: React.FC<AccommodationManagerProps> = ({
  leases,
  employees,
}) => {
  const [selectedLease, setSelectedLease] = useState<AccommodationLease>(leases[0]);

  // Aggregate stats
  const totalRentLiability = leases.reduce(
    (acc, l) => acc + l.monthlyRent + l.electricityBill + l.waterBill,
    0
  );
  const totalBeds = leases.reduce((acc, l) => acc + (l.capacity || 10), 0);
  const totalOccupants = leases.reduce((acc, l) => acc + (l.assignedEmployeeIds ? l.assignedEmployeeIds.length : (l.employeeId ? 1 : 0)), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Labor Camps &amp; Accommodation Management (Section 13)
          </h2>
          <p className="text-xs text-slate-400">
            Track rented guest houses, labor colonies, utilities, landlord leases, and worker room assignments
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Total Housing &amp; Utility Outlay
          </span>
          <div className="text-2xl font-black font-mono text-amber-400">
            {MoneyUtils.formatINR(totalRentLiability)} / mo
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Covers rent, high-tension power &amp; borewell water
          </span>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Occupancy &amp; Bed Capacity
          </span>
          <div className="text-2xl font-black font-mono text-emerald-400">
            {totalOccupants} / {totalBeds} Beds Occupied
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {totalBeds - totalOccupants} vacant beds across {leases.length} site camps
          </span>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Corporate Rent Policy
          </span>
          <div className="text-lg font-bold text-slate-200 mt-1 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <span>100% Company Subsidized</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Zero wage deductions for site workforce
          </span>
        </div>
      </div>

      {/* Camps List & Selected Camp Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Properties */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Building className="h-4 w-4 text-amber-400" />
            <span>Active Property Leases</span>
          </h3>

          <div className="space-y-3">
            {leases.map((lease) => {
              const isSelected = selectedLease?.id === lease.id;
              const occupantCount = lease.assignedEmployeeIds ? lease.assignedEmployeeIds.length : (lease.employeeId ? 1 : 0);
              const capacity = lease.capacity || 8;
              return (
                <div
                  key={lease.id}
                  onClick={() => setSelectedLease(lease)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800 border-amber-500 shadow-md'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-white text-sm">{lease.propertyName || lease.propertyAddress}</h4>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span>{lease.address || lease.propertyAddress}</span>
                      </p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {lease.status || 'ACTIVE'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-700/50 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Monthly Rent</span>
                      <span className="font-mono font-bold text-white">
                        {MoneyUtils.formatINR(lease.monthlyRent)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Occupancy</span>
                      <span className="font-bold text-amber-400">
                        {occupantCount} / {capacity} Workers
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Property Audit */}
        <div className="lg:col-span-2 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex items-start justify-between pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{selectedLease.propertyName || selectedLease.propertyAddress}</h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {selectedLease.id}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{selectedLease.address || selectedLease.propertyAddress}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Total Monthly Cost</span>
              <span className="text-xl font-bold font-mono text-amber-400">
                {MoneyUtils.formatINR(
                  selectedLease.monthlyRent + selectedLease.electricityBill + selectedLease.waterBill
                )}
              </span>
            </div>
          </div>

          {/* Landlord & Lease Terms */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Landlord &amp; Agreement Terms
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 block mb-0.5">Owner / Landlord</span>
                <strong className="text-white text-sm block">{selectedLease.ownerName || 'Balwant Estates'}</strong>
                <span className="text-slate-400 text-[11px] flex items-center gap-1 mt-1">
                  <Phone className="h-3 w-3" /> {selectedLease.ownerPhone || '+91 98111 22334'}
                </span>
              </div>

              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 block mb-0.5">Security Deposit</span>
                <span className="font-mono font-bold text-white text-sm block">
                  {MoneyUtils.formatINR(selectedLease.depositAmount ?? selectedLease.securityDeposit ?? 0)}
                </span>
                <span className="text-slate-400 text-[11px] block mt-1">Refundable on lease exit</span>
              </div>

              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 block mb-0.5">Payment Responsibility</span>
                <span className="font-bold text-emerald-400 text-xs block">
                  {(selectedLease.rentResponsibility || (selectedLease.isCompanyPaid ? 'COMPANY_PAID' : 'EMPLOYEE_PAID')).replace('_', ' ')}
                </span>
                <span className="text-slate-400 text-[11px] block mt-1">
                  Due date: 5th of each month
                </span>
              </div>
            </div>
          </div>

          {/* Utility Bill Breakdown */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-amber-400" />
              <span>Electricity &amp; Water Subsidies</span>
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-amber-400" /> Electricity Bill:
                </span>
                <span className="font-mono font-bold text-white">
                  {MoneyUtils.formatINR(selectedLease.electricityBill)}
                </span>
              </div>
              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Droplets className="h-3.5 w-3.5 text-blue-400" /> Water Supply &amp; Tanker:
                </span>
                <span className="font-mono font-bold text-white">
                  {MoneyUtils.formatINR(selectedLease.waterBill)}
                </span>
              </div>
            </div>
          </div>

          {/* Assigned Workers in this camp */}
          <div>
            {(() => {
              const assignedList = selectedLease.assignedEmployeeIds || (selectedLease.employeeId ? [selectedLease.employeeId] : []);
              return (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-amber-400" />
                      <span>Assigned Construction Workers ({assignedList.length})</span>
                    </h4>
                    <span className="text-xs text-slate-400">
                      Cost share:{' '}
                      <strong className="font-mono text-white">
                        {MoneyUtils.formatINR(
                          Math.round(
                            (selectedLease.monthlyRent +
                              selectedLease.electricityBill +
                              selectedLease.waterBill) /
                              (assignedList.length || 1)
                          )
                        )}
                      </strong>{' '}
                      / worker
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {assignedList.map((empId: string) => {
                      const emp = employees.find((e) => e.id === empId);
                      if (!emp) return null;
                      return (
                        <div
                          key={emp.id}
                          className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 flex items-center gap-3"
                        >
                          <img
                            src={emp.profilePhoto}
                            alt={emp.fullName}
                            className="w-9 h-9 rounded-lg object-cover"
                          />
                          <div>
                            <div className="font-bold text-white text-xs">{emp.fullName}</div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {emp.id} &bull; {emp.skillTrade}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};
