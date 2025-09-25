import { createBrowserRouter, Navigate } from 'react-router-dom';
import { GroupsList } from '@/pages/GroupsList';
import { ExpensesPage } from '@/pages/ExpensesPage';
import { GroupLayout } from '@/pages/GroupLayout';
import { SummaryPage } from '@/pages/SummaryPage';
import { ShareViewer } from '@/pages/ShareViewer';

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/groups" replace /> },
  { path: '/groups', element: <GroupsList /> },
  {
    path: '/groups/:id',
    element: <GroupLayout />,
    children: [
      { index: true, element: <Navigate to="expenses" replace /> },
      { path: 'expenses', element: <ExpensesPage /> },
      { path: 'summary', element: <SummaryPage /> },
    ],
  },
  { path: '/share', element: <ShareViewer /> },
  { path: '*', element: <div className="p-6">404 — Không tìm thấy trang</div> },
]);
