import React, { useState } from 'react';
import {
  Download,
  Search,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownLeft,
  Trash2,
  FileText,
} from 'lucide-react';
import { TransferItem } from '../types/tunnel';
import { formatBytes, formatSpeed } from '../utils/crypto';

interface TransferLedgerViewProps {
  transfers: TransferItem[];
  onClearCompleted: () => void;
  onSwitchToStudio: () => void;
}

export const TransferLedgerView: React.FC<TransferLedgerViewProps> = ({
  transfers,
  onClearCompleted,
  onSwitchToStudio,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [directionFilter, setDirectionFilter] = useState<'all' | 'outgoing' | 'incoming'>('all');

  const filteredTransfers = transfers.filter((item) => {
    const matchesDirection =
      directionFilter === 'all' ? true : item.direction === directionFilter;
    const matchesQuery =
      !searchQuery.trim() ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sha256.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDirection && matchesQuery;
  });

  const totalBytesMoved = transfers.reduce((acc, t) => acc + t.bytesTransferred, 0);
  const verifiedCount = transfers.filter((t) => t.verified).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            Transfer &amp; Cryptographic Integrity Ledger
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Audit end-to-end SHA-256 verification digests, chunk throughput metrics, and negotiated NAT transport paths for every file moved during this session.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {transfers.length > 0 && (
            <button
              onClick={onClearCompleted}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Completed Log
            </button>
          )}
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-lg">
          <div className="text-xs text-slate-400 font-medium">Total Encrypted Volume</div>
          <div className="mt-2 text-xl font-mono font-semibold text-slate-100 tabular-nums">
            {formatBytes(totalBytesMoved)}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            64 KB AES-256-GCM authenticated blocks
          </div>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-lg">
          <div className="text-xs text-slate-400 font-medium">SHA-256 Verified Transfers</div>
          <div className="mt-2 text-xl font-mono font-semibold text-emerald-400 tabular-nums">
            {verifiedCount} / {transfers.length}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            End-to-end digest verification
          </div>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-lg">
          <div className="text-xs text-slate-400 font-medium">Session Cipher Suite</div>
          <div className="mt-2 text-base font-mono font-semibold text-slate-100">
            PBKDF2-SHA256 · AES-256-GCM
          </div>
          <div className="mt-1 text-xs text-slate-400">
            100,000 iterations · 96-bit per-chunk IV
          </div>
        </div>
      </div>

      {/* Filter Bar & Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by filename or SHA-256 checksum..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-400"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg self-start">
            {(['all', 'outgoing', 'incoming'] as const).map((dir) => (
              <button
                key={dir}
                onClick={() => setDirectionFilter(dir)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  directionFilter === dir
                    ? 'bg-slate-800 text-slate-100'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {dir === 'all'
                  ? 'All Transfers'
                  : dir === 'outgoing'
                  ? 'Sent (Outgoing)'
                  : 'Received (Incoming)'}
              </button>
            ))}
          </div>
        </div>

        {filteredTransfers.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileText className="w-8 h-8 text-slate-500 mx-auto" />
            <div className="text-sm font-semibold text-slate-200">
              No file transfers recorded yet
            </div>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Once you send or receive files through the encrypted P2P tunnel, their SHA-256 checksums, chunk counts, and transport paths will appear here.
            </p>
            <div className="pt-2">
              <button
                onClick={onSwitchToStudio}
                className="px-4 py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors cursor-pointer"
              >
                Go to Tunnel Studio
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs text-slate-400 bg-slate-950/50">
                  <th className="py-3 px-6 font-medium">Direction &amp; File</th>
                  <th className="py-3 px-4 font-medium text-right">Size</th>
                  <th className="py-3 px-4 font-medium text-right">Chunks</th>
                  <th className="py-3 px-4 font-medium">NAT Transport Path</th>
                  <th className="py-3 px-4 font-medium">SHA-256 Integrity Digest</th>
                  <th className="py-3 px-6 font-medium text-right">Status / Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-sm">
                {filteredTransfers.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-2.5">
                        {item.direction === 'outgoing' ? (
                          <ArrowUpRight className="w-4 h-4 text-sky-400 shrink-0" />
                        ) : (
                          <ArrowDownLeft className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        <div>
                          <div className="font-medium text-slate-100 text-xs">
                            {item.name}
                          </div>
                          <div className="text-xs text-slate-400">
                            {item.direction === 'outgoing' ? 'Sent' : 'Received'} · {formatSpeed(item.speedBps)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-200 text-right tabular-nums">
                      {formatBytes(item.size)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-300 text-right tabular-nums">
                      {item.transferredChunks} / {item.totalChunks}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-300">
                      {item.transportUsed}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-400 max-w-xs truncate" title={item.sha256}>
                      {item.sha256 ? `${item.sha256.slice(0, 16)}...${item.sha256.slice(-8)}` : 'Computing...'}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="inline-flex items-center justify-end gap-3">
                        {item.status === 'completed' && item.verified ? (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Verified
                          </span>
                        ) : item.status === 'error' ? (
                          <span className="inline-flex items-center gap-1 text-xs text-red-400 font-medium">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Failed
                          </span>
                        ) : (
                          <span className="text-xs font-mono text-sky-400 tabular-nums">
                            {Math.round((item.transferredChunks / Math.max(1, item.totalChunks)) * 100)}%
                          </span>
                        )}

                        {item.downloadUrl && (
                          <a
                            href={item.downloadUrl}
                            download={item.name}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-950 bg-sky-400 hover:bg-sky-300 rounded transition-colors"
                          >
                            <Download className="w-3 h-3" />
                            Save
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
