import React, { useState } from 'react';
import { SyncStatus } from '../../types';
import { CODE_VAULT } from '../../data/codeVaultData';
import {
  Smartphone,
  Server,
  Database,
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Code,
  Copy,
  Check,
  X,
  Layers,
  FileCode,
} from 'lucide-react';

interface AndroidOfflineSyncModalProps {
  isOnline: boolean;
  onToggleOnline: () => void;
  onClose: () => void;
}

export const AndroidOfflineSyncModal: React.FC<AndroidOfflineSyncModalProps> = ({
  isOnline,
  onToggleOnline,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'sync_status' | 'android_code' | 'spring_code' | 'db_schema'>(
    'sync_status'
  );
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedCount, setSyncedCount] = useState(14);
  const [pendingQueue, setPendingQueue] = useState([
    { id: 'EXP-LOC-9921', type: 'Expense Voucher', amount: '₹450', action: 'Daily Lunch + Auto', status: 'PENDING' },
    { id: 'ATT-LOC-4412', type: 'Muster Roll Entry', amount: '8 hrs', action: 'EMP-104 Present', status: 'PENDING' },
    { id: 'EXP-LOC-1104', type: 'Fuel Receipt', amount: '₹1,200', action: 'Generator Diesel', status: 'PENDING' },
  ]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleTriggerSync = () => {
    if (!isOnline) return;
    setIsSyncing(true);
    setTimeout(() => {
      setSyncedCount((prev) => prev + pendingQueue.length);
      setPendingQueue([]);
      setIsSyncing(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Android Native (Java 21) &amp; Spring Boot Architecture
              </h3>
              <p className="text-xs text-slate-400">
                WorkManager Background Sync, Room DB Offline-First Store, and Backend Specifications
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="px-6 pt-4 border-b border-slate-800 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('sync_status')}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-xl text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'sync_status'
                ? 'border-amber-400 text-amber-400 bg-slate-800/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Live Offline Sync Simulator</span>
          </button>
          <button
            onClick={() => setActiveTab('android_code')}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-xl text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'android_code'
                ? 'border-amber-400 text-amber-400 bg-slate-800/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>Android Room &amp; WorkManager (Java)</span>
          </button>
          <button
            onClick={() => setActiveTab('spring_code')}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-xl text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'spring_code'
                ? 'border-amber-400 text-amber-400 bg-slate-800/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="h-3.5 w-3.5" />
            <span>Spring Boot 3 REST &amp; Salary Service</span>
          </button>
          <button
            onClick={() => setActiveTab('db_schema')}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-xl text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'db_schema'
                ? 'border-amber-400 text-amber-400 bg-slate-800/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="h-3.5 w-3.5" />
            <span>PostgreSQL Flyway V1 Migration</span>
          </button>
        </div>

        {/* Tab 1: Sync Status Simulator */}
        {activeTab === 'sync_status' && (
          <div className="p-6 space-y-6">
            {/* Network State Controller */}
            <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-2xl ${
                    isOnline
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {isOnline ? <Wifi className="h-6 w-6" /> : <WifiOff className="h-6 w-6" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">
                      Device Network Connection:{' '}
                      <span className={isOnline ? 'text-emerald-400' : 'text-rose-400'}>
                        {isOnline ? 'ONLINE (4G Site LTE)' : 'OFFLINE (Remote Tunnel / Basement)'}
                      </span>
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isOnline
                      ? 'WorkManager background queue enabled. Synchronization operates automatically.'
                      : 'All site expenses, muster rolls, and advances are stored locally in Room SQLite DB.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={onToggleOnline}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isOnline
                      ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30'
                      : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {isOnline ? 'Simulate Signal Loss (Go Offline)' : 'Restore Network (Go Online)'}
                </button>

                <button
                  disabled={!isOnline || isSyncing || pendingQueue.length === 0}
                  onClick={handleTriggerSync}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
                </button>
              </div>
            </div>

            {/* Sync Queue Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pending Queue in Room DB */}
              <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <Database className="h-4 w-4 text-amber-400" />
                    <span>Local Room DB &bull; Pending Outbox</span>
                  </h4>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                    {pendingQueue.length} Pending
                  </span>
                </div>

                {pendingQueue.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 bg-slate-900/40 rounded-xl">
                    <CheckCircle2 className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
                    <span>All local records are synchronized with Spring Boot server!</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {pendingQueue.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-white">{item.action}</div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {item.id} &bull; {item.type}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-amber-400">{item.amount}</span>
                          <span className="text-[10px] text-amber-300 block">Status: PENDING</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Conflict Resolution & Idempotency Rules (Section 25) */}
              <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/60 space-y-3">
                <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-emerald-400" />
                  <span>Sync Guarantees &amp; Conflict Resolution</span>
                </h4>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="p-2.5 bg-slate-900/50 rounded-xl border border-slate-800">
                    <strong className="text-amber-400 block mb-0.5">1. Idempotent UUID Transactions</strong>
                    <p className="text-[11px] text-slate-400">
                      Every offline-created expense receives a client UUID. Re-submitting on network reconnection will never cause duplicate debits.
                    </p>
                  </div>

                  <div className="p-2.5 bg-slate-900/50 rounded-xl border border-slate-800">
                    <strong className="text-amber-400 block mb-0.5">2. Last-Write-Wins with Ledger Audit</strong>
                    <p className="text-[11px] text-slate-400">
                      If an attendance record is updated simultaneously on site and in the central office, the latest verified timestamp prevails with an immutable audit log entry.
                    </p>
                  </div>

                  <div className="p-2.5 bg-slate-900/50 rounded-xl border border-slate-800">
                    <strong className="text-amber-400 block mb-0.5">3. Battery &amp; Metered Network Safe</strong>
                    <p className="text-[11px] text-slate-400">
                      Android WorkManager constraints: <code className="text-white">NetworkType.CONNECTED</code> with exponential backoff retry.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Android Native Java 21 Code */}
        {activeTab === 'android_code' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">
                ExpenseSyncWorker.java (Android WorkManager + Room SQLite)
              </span>
              <button
                onClick={() => handleCopy('android', CODE_VAULT.androidWorkManager)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold"
              >
                {copiedKey === 'android' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedKey === 'android' ? 'Copied' : 'Copy Java Code'}</span>
              </button>
            </div>
            <pre className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-slate-300 text-xs font-mono overflow-x-auto max-h-[500px]">
              <code>{CODE_VAULT.androidWorkManager}</code>
            </pre>
          </div>
        )}

        {/* Tab 3: Spring Boot 3 Java Service */}
        {activeTab === 'spring_code' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">
                SalaryCalculationService.java (Deterministic BigDecimal Financial Engine)
              </span>
              <button
                onClick={() => handleCopy('spring', CODE_VAULT.springSalaryService)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold"
              >
                {copiedKey === 'spring' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedKey === 'spring' ? 'Copied' : 'Copy Java Code'}</span>
              </button>
            </div>
            <pre className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-slate-300 text-xs font-mono overflow-x-auto max-h-[500px]">
              <code>{CODE_VAULT.springSalaryService}</code>
            </pre>
          </div>
        )}

        {/* Tab 4: PostgreSQL Flyway Schema */}
        {activeTab === 'db_schema' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">
                V1__init_workforce_schema.sql (Flyway Production Migration)
              </span>
              <button
                onClick={() => handleCopy('flyway', CODE_VAULT.flywayMigration)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold"
              >
                {copiedKey === 'flyway' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedKey === 'flyway' ? 'Copied' : 'Copy SQL Schema'}</span>
              </button>
            </div>
            <pre className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-slate-300 text-xs font-mono overflow-x-auto max-h-[500px]">
              <code>{CODE_VAULT.flywayMigration}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
