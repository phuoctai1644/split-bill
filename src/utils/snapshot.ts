import { deflateRaw, inflateRaw } from 'pako';
// import { TextDecoder, TextEncoder } from 'node:util';

const toB64U = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');

const fromB64U = (s: string) => {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
};

export type Snapshot = {
  schemaVersion: 1;
  group: { id: string; name: string; currency: string; createdAt: string };
  members: Array<{ id: string; name: string; alias?: string; groupId: string }>;
  expenses: Array<{
    id: string; groupId: string; title: string; amount: number; currency: string;
    paidBy: string; date: string; note?: string; splitMode: 'equal' | 'weights' | 'exact';
    weights?: Record<string, number>; exacts?: Record<string, number>;
  }>;
};

export function encodeSnapshot(obj: Snapshot): string {
  const json = new TextEncoder().encode(JSON.stringify(obj));
  const deflated = deflateRaw(json, { level: 9 });
  return toB64U(deflated);
}

export function decodeSnapshot(payload: string): Snapshot {
  const inflated = inflateRaw(fromB64U(payload));
  const json = new TextDecoder().decode(inflated);
  const data = JSON.parse(json);
  if (data.schemaVersion !== 1) throw new Error('Unsupported schema');
  return data;
}
