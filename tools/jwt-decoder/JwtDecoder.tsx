/**
 * JWT Decoder
 *
 * Self-contained React component — zero Astro dependencies.
 * Extractable to standalone package per tool-component-architecture.md
 *
 * Decodes only — no signature verification (keys are never available client-side).
 */

import { useState, useMemo } from 'react';

const MAX_JWT_CHARS = 10_000;

interface DecodedJwt {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
  raw: { header: string; payload: string; signature: string };
}

function base64UrlDecode(s: string): string {
  let b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4 !== 0) b64 += '=';
  return atob(b64);
}

function decodeJwt(token: string): DecodedJwt {
  const parts = token.trim().split('.');
  if (parts.length !== 3) throw new Error('JWT must have exactly 3 parts separated by dots.');
  const [rawHeader, rawPayload, rawSig] = parts;
  const header  = JSON.parse(base64UrlDecode(rawHeader));
  const payload = JSON.parse(base64UrlDecode(rawPayload));
  return {
    header,
    payload,
    signature: rawSig,
    raw: { header: rawHeader, payload: rawPayload, signature: rawSig },
  };
}

const EPOCH_CLAIMS = ['exp', 'iat', 'nbf'] as const;
type EpochClaim = (typeof EPOCH_CLAIMS)[number];

const EPOCH_LABELS: Record<EpochClaim, string> = {
  exp: 'Expires',
  iat: 'Issued at',
  nbf: 'Not before',
};

function formatEpoch(ts: number): string {
  const d = new Date(ts * 1000);
  return d.toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    timeZoneName: 'short',
  });
}

function isExpired(payload: Record<string, unknown>): boolean {
  const exp = payload.exp;
  if (typeof exp !== 'number') return false;
  return Date.now() / 1000 > exp;
}

function JsonBlock({ data, label }: { data: Record<string, unknown>; label: string }) {
  const [copied, setCopied] = useState(false);
  const json = JSON.stringify(data, null, 2);

  async function copy() {
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-white">
        <span className="text-xs font-semibold text-gray-700">{label}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Copied
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="px-4 py-3 text-xs font-mono text-gray-800 overflow-x-auto whitespace-pre-wrap break-all">{json}</pre>
    </div>
  );
}

export default function JwtDecoder() {
  const [input, setInput] = useState('');
  const safeInput = input.slice(0, MAX_JWT_CHARS);

  const { decoded, error } = useMemo<{ decoded: DecodedJwt | null; error: string | null }>(() => {
    const t = safeInput.trim();
    if (!t) return { decoded: null, error: null };
    try {
      return { decoded: decodeJwt(t), error: null };
    } catch (e) {
      return { decoded: null, error: e instanceof Error ? e.message : 'Invalid JWT' };
    }
  }, [safeInput]);

  const expired = decoded ? isExpired(decoded.payload) : false;

  return (
    <div className="space-y-6">

      {/* Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">JWT Token</label>
          <span className="text-xs text-gray-400">{safeInput.trim().length.toLocaleString()} / {MAX_JWT_CHARS.toLocaleString()} chars</span>
        </div>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value.slice(0, MAX_JWT_CHARS))}
          placeholder="Paste a JWT here — e.g. eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.signature"
          maxLength={MAX_JWT_CHARS}
          rows={4}
          spellCheck={false}
          className={`w-full border rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        <p className="mt-1.5 text-xs text-gray-400">
          Decoded entirely in your browser. The token never leaves your device.
        </p>
      </div>

      {/* Decoded output */}
      {decoded && (
        <div className="space-y-4">

          {/* Status bar */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2.5 py-1 font-mono">
              alg: {String(decoded.header.alg ?? '—')}
            </span>
            <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2.5 py-1 font-mono">
              typ: {String(decoded.header.typ ?? '—')}
            </span>
            {expired ? (
              <span className="text-xs bg-red-100 text-red-700 rounded-full px-2.5 py-1 font-medium">
                Expired
              </span>
            ) : typeof decoded.payload.exp === 'number' ? (
              <span className="text-xs bg-green-100 text-green-700 rounded-full px-2.5 py-1 font-medium">
                Valid (not expired)
              </span>
            ) : null}
            <span className="text-xs text-gray-400 ml-auto">Decode only — signature not verified</span>
          </div>

          {/* Epoch claim highlights */}
          {EPOCH_CLAIMS.some(c => typeof decoded.payload[c] === 'number') && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {EPOCH_CLAIMS.map(claim => {
                const val = decoded.payload[claim];
                if (typeof val !== 'number') return null;
                const isExp = claim === 'exp';
                const past  = Date.now() / 1000 > val;
                return (
                  <div key={claim} className={`rounded-xl border px-4 py-3 ${isExp && past ? 'border-red-200 bg-red-50' : 'border-gray-100 bg-gray-50'}`}>
                    <p className="text-xs text-gray-500 mb-0.5">{EPOCH_LABELS[claim]}</p>
                    <p className="text-sm font-mono font-semibold text-gray-800">{val}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{formatEpoch(val)}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Header + Payload blocks */}
          <JsonBlock data={decoded.header}  label="Header" />
          <JsonBlock data={decoded.payload} label="Payload" />

          {/* Signature (raw) */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-white">
              <span className="text-xs font-semibold text-gray-700">Signature (raw Base64URL)</span>
              <span className="text-xs text-gray-400">Cannot be verified without the secret/public key</span>
            </div>
            <p className="px-4 py-3 text-xs font-mono text-gray-500 break-all">{decoded.signature}</p>
          </div>

        </div>
      )}

    </div>
  );
}
