import { render, screen } from '@testing-library/react';
import { ShareViewer } from './ShareViewer';
import { encodeSnapshot } from '@/utils/snapshot';

test('renders readonly balances from snapshot', () => {
  const payload = encodeSnapshot({
    schemaVersion:1,
    group:{id:'g', name:'Trip', currency:'VND', createdAt:'2025-01-01'},
    members:[{id:'u1', name:'An', groupId:'g'}],
    expenses:[]
  });
  const old = window.location.hash;
  window.location.hash = '#' + payload;

  render(<ShareViewer />);
  expect(screen.getByText(/Readonly/)).toBeInTheDocument();

  window.location.hash = old;
});
