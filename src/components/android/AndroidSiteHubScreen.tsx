import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Droplets, 
  Zap, 
  Users, 
  DollarSign, 
  AlertCircle, 
  Truck, 
  CheckCircle2, 
  ShieldAlert 
} from 'lucide-react';
import { AccommodationLease, Employee } from '../../types';
import { MoneyUtils } from '../../services/salaryEngine';
import { MaterialTheme } from './types';
import { THEMES } from './themeUtils';

interface AndroidSiteHubScreenProps {
  leases: AccommodationLease[];
  employees: Employee[];
  theme: MaterialTheme;
}

export const AndroidSiteHubScreen: React.FC<AndroidSiteHubScreenProps> = ({
  leases,
  employees,
  theme,
}) => {
  const currentTheme = THEMES[theme];
  const [tankerRequested, setTankerRequested] = useState<boolean>(false);

  const handleRequestWaterTanker = () => {
    setTankerRequested(true);
    setTimeout(() => setTankerRequested(false), 3000);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-20 px-4 pt-3 space-y-4 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-400" />
            <span>Site Hub &amp; Camp Logistics</span>
          </h2>
          <p className="text-[11px] text-slate-400">Petty Cash, Labor Housing &amp; Utilities</p>
        </div>

        <button
          onClick={handleRequestWaterTanker}
          className="px-2.5 py-1.5 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-bold hover:bg-sky-500/30 active:scale-95 transition-all flex items-center gap-1.5"
        >
          <Droplets className="w-3.5 h-3.5 text-sky-400" />
          <span>Water Tanker</span>
        </button>
      </div>

      {/* Water Tanker Alert */}
      {tankerRequested && (
        <div className="p-3 bg-sky-500/20 border border-sky-500/40 rounded-2xl flex items-center gap-2 text-xs text-sky-300 font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
          <span>Water tanker dispatch requested for Sector 62 Labor Colony! ETA: 35 mins.</span>
        </div>
      )}

      {/* Site Petty Cash Imprest Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-indigo-500/30 shadow-lg space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-semibold uppercase tracking-wider">
            Site Petty Cash Imprest
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
            Imprest: ₹50,000
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-mono font-bold text-white">
            ₹38,450
          </div>
          <span className="text-xs text-emerald-400 font-semibold">
            ₹11,550 Disbursed (77% Remaining)
          </span>
        </div>

        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div className="bg-indigo-500 h-full rounded-full" style={{ width: '77%' }} />
        </div>
      </div>

      {/* Labor Camps / Housing Accommodations */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
          <span>Worker Camps &amp; Barracks ({leases.length})</span>
          <span className="text-[10px] text-slate-400 font-normal">Free Electricity &amp; Water</span>
        </h3>

        {leases.map((lease) => {
          const occupants = lease.assignedEmployeeIds ? lease.assignedEmployeeIds.length : (lease.employeeId ? 1 : 0);
          const capacity = lease.capacity || 8;
          const occupancyRate = Math.round((occupants / capacity) * 100);

          return (
            <div
              key={lease.id}
              className="p-3.5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2.5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {lease.propertyName || lease.propertyAddress}
                  </h4>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{lease.address || lease.propertyAddress}</span>
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {lease.status || 'ACTIVE'}
                </span>
              </div>

              {/* Beds Occupancy bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Bed Allocation:</span>
                  <span className="font-bold text-amber-300">
                    {occupants} / {capacity} Workers ({occupancyRate}%)
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full"
                    style={{ width: `${Math.min(occupancyRate, 100)}%` }}
                  />
                </div>
              </div>

              {/* Utility Subsidies & Rent */}
              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800/80 text-[10px]">
                <div className="p-1.5 bg-slate-950 rounded-xl border border-slate-800 text-center">
                  <span className="text-slate-500 block">Monthly Rent</span>
                  <strong className="text-white font-mono">{MoneyUtils.formatINR(lease.monthlyRent)}</strong>
                </div>
                <div className="p-1.5 bg-slate-950 rounded-xl border border-slate-800 text-center">
                  <span className="text-slate-500 block flex items-center justify-center gap-0.5">
                    <Zap className="w-2.5 h-2.5 text-amber-400" /> Power
                  </span>
                  <strong className="text-emerald-400 font-mono">₹{lease.electricityBill}</strong>
                </div>
                <div className="p-1.5 bg-slate-950 rounded-xl border border-slate-800 text-center">
                  <span className="text-slate-500 block flex items-center justify-center gap-0.5">
                    <Droplets className="w-2.5 h-2.5 text-sky-400" /> Water
                  </span>
                  <strong className="text-emerald-400 font-mono">₹{lease.waterBill}</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Emergency Contacts & Site SOS */}
      <div className="p-3.5 rounded-3xl bg-rose-500/10 border border-rose-500/30 space-y-2">
        <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
          <ShieldAlert className="w-4 h-4" />
          <span>Site Emergency &amp; Ambulance Hotline</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <a
            href="tel:108"
            className="p-2 rounded-xl bg-slate-900 border border-rose-500/30 text-white flex items-center justify-between hover:bg-slate-800 transition-colors"
          >
            <div>
              <div className="font-bold">Ambulance (108)</div>
              <div className="text-[10px] text-slate-400">Direct Medical</div>
            </div>
            <Phone className="w-4 h-4 text-rose-400" />
          </a>

          <a
            href="tel:+919811122334"
            className="p-2 rounded-xl bg-slate-900 border border-rose-500/30 text-white flex items-center justify-between hover:bg-slate-800 transition-colors"
          >
            <div>
              <div className="font-bold">Safety Head</div>
              <div className="text-[10px] text-slate-400">Site Sector 62</div>
            </div>
            <Phone className="w-4 h-4 text-amber-400" />
          </a>
        </div>
      </div>
    </div>
  );
};
