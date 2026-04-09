/**
 * Epoch / Timestamp Converter
 *
 * Self-contained React component — zero Astro dependencies.
 * Extractable to standalone package per tool-component-architecture.md
 */

import { useState, useEffect } from 'react';

type Precision = 'seconds' | 'milliseconds';

function nowEpoch(precision: Precision): string {
  return precision === 'seconds'
    ? String(Math.floor(Date.now() / 1000))
    : String(Date.now());
}

function toISOParts(d: Date) {
  return {
    date: d.toISOString().slice(0, 10),
    time: d.toISOString().slice(11, 19),
    utc:  d.toUTCString(),
    local: d.toLocaleString('en-US', {
      weekday: 'short', year: 'numeric', month: 'short',
      day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit',
      timeZoneName: 'short',
    }),
    iso: d.toISOString(),
  };
}

function parseEpoch(raw: string, precision: Precision): Date | null {
  const n = Number(raw.trim());
  if (!Number.isFinite(n)) return null;
  const ms = precision === 'seconds' ? n * 1000 : n;
  const d = new Date(ms);
  return isNaN(d.getTime()) ? null : d;
}

function localDateTimeToEpoch(date: string, time: string, precision: Precision): string {
  if (!date) return '';
  const d = new Date(`${date}T${time || '00:00:00'}`);
  if (isNaN(d.getTime())) return '';
  return precision === 'seconds'
    ? String(Math.floor(d.getTime() / 1000))
    : String(d.getTime());
}

export default function EpochConverter() {
  const [precision, setPrecision] = useState<Precision>('seconds');

  // Epoch → human
  const [epochInput, setEpochInput] = useState(() => nowEpoch('seconds'));
  const [liveEpoch, setLiveEpoch]   = useState<string>('');

  // Human → epoch
  const [dateInput, setDateInput] = useState(new Date().toISOString().slice(0, 10));
  const [timeInput, setTimeInput] = useState(new Date().toTimeString().slice(0, 8));

  // Live clock
  useEffect(() => {
    const tick = () => setLiveEpoch(nowEpoch(precision));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [precision]);

  // Update epoch input when precision changes
  useEffect(() => {
    if (epochInput) {
      const n = Number(epochInput);
      if (Number.isFinite(n)) {
        setEpochInput(precision === 'seconds' ? String(Math.floor(n / (precision === 'seconds' ? 1 : 1000))) : String(n * 1000));
      }
    }
    setEpochInput(nowEpoch(precision));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [precision]);

  const parsedDate = parseEpoch(epochInput, precision);
  const parts      = parsedDate ? toISOParts(parsedDate) : null;
  const humanToEpoch = localDateTimeToEpoch(dateInput, timeInput, precision);

  async function copy(text: string) {
    await navigator.clipboard.writeText(text);
  }

  const CopyBtn = ({ value }: { value: string }) => {
    const [copied, setCopied] = useState(false);
    return (
      <button
        onClick={async () => { await copy(value); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
        className="text-xs text-gray-400 hover:text-blue-600 transition-colors flex-shrink-0"
        title="Copy"
      >
        {copied ? '✓' : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
        )}
      </button>
    );
  };

  const Row = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center justify-between gap-4 py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-xs text-gray-500 w-24 flex-shrink-0">{label}</span>
      <span className="text-sm font-mono text-gray-800 flex-1 break-all">{value}</span>
      <CopyBtn value={value} />
    </div>
  );

  return (
    <div className="space-y-8">

      {/* Precision toggle */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">Precision:</span>
        <div className="flex gap-2">
          {(['seconds', 'milliseconds'] as Precision[]).map(p => (
            <button
              key={p}
              onClick={() => setPrecision(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize ${
                precision === p
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <span className="text-xs text-gray-400 ml-auto">
          Now: <code className="bg-gray-100 px-1 rounded">{liveEpoch}</code>
        </span>
      </div>

      {/* ─── Epoch → Human ─── */}
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">Epoch → Date</span>
        </h3>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={epochInput}
            onChange={e => setEpochInput(e.target.value.replace(/[^0-9\-]/g, ''))}
            placeholder={`Unix timestamp in ${precision}`}
            maxLength={20}
            spellCheck={false}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={() => setEpochInput(nowEpoch(precision))}
            className="px-3 py-2 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
          >
            Now
          </button>
        </div>

        {parsedDate && parts ? (
          <div className="bg-white rounded-xl border border-gray-200 px-4">
            <Row label="ISO 8601"   value={parts.iso} />
            <Row label="UTC"        value={parts.utc} />
            <Row label="Local"      value={parts.local} />
            <Row label="Date"       value={parts.date} />
            <Row label="Time (UTC)" value={parts.time + ' UTC'} />
          </div>
        ) : epochInput ? (
          <p className="text-sm text-red-500">Invalid timestamp</p>
        ) : null}
      </div>

      {/* ─── Human → Epoch ─── */}
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full">Date → Epoch</span>
        </h3>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Date (local time)</label>
            <input
              type="date"
              value={dateInput}
              onChange={e => setDateInput(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Time (local time)</label>
            <input
              type="time"
              value={timeInput}
              step="1"
              onChange={e => setTimeInput(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {humanToEpoch ? (
          <div className="bg-white rounded-xl border border-gray-200 px-4">
            <div className="flex items-center justify-between gap-4 py-3">
              <span className="text-xs text-gray-500">Unix ({precision})</span>
              <code className="text-base font-mono font-bold text-blue-600 flex-1 text-right">{humanToEpoch}</code>
              <CopyBtn value={humanToEpoch} />
            </div>
          </div>
        ) : (
          <p className="text-sm text-red-500">Invalid date</p>
        )}
      </div>

    </div>
  );
}
