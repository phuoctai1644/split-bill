import { encodeSnapshot, decodeSnapshot, type Snapshot } from './snapshot';

test('snapshot roundtrip', () => {
  const s: Snapshot = {
    schemaVersion: 1,
    group: { id:'g', name:'Trip', currency:'VND', createdAt:'2025-01-01' },
    members: [{ id:'u1', name:'An', groupId:'g' }],
    expenses: []
  };
  const payload = encodeSnapshot(s);
  const parsed = decodeSnapshot(payload);
  expect(parsed.group.name).toBe('Trip');
  expect(parsed.schemaVersion).toBe(1);
});
