import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const List = lazy(() => import('./arisan-list/List'));

const TransactionArisanConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: 'transaksi/arisan',
      element: <List />,
    },
    {
      path: 'transaksi/arisan',
      element: <Navigate to="transaksi/arisan" />,
    },
  ],
};

export default TransactionArisanConfig;
