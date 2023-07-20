import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const BillList = lazy(() => import('./bill-list/BillList'));

const BillsConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: 'dashboard/produk-dan-tagihan/daftar-tagihan',
      element: <BillList />,
    },
    {
      path: 'dashboard/produk-dan-tagihan/daftar-tagihan',
      element: <Navigate to="dashboard/produk-dan-tagihan/daftar-tagihan" />,
    },
  ],
};

export default BillsConfig;
