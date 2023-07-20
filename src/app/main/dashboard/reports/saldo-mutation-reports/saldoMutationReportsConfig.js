import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const SaldoMutationList = lazy(() => import('./saldo-mutation-list/SaldoMutationList'));

const SaldoMutationReportsConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: 'dashboard/laporan/mutasi-saldo',
      element: <SaldoMutationList />,
    },
    {
      path: 'dashboard/laporan/mutasi-saldo',
      element: <Navigate to="dashboard/laporan/mutasi-saldo" />,
    },
  ],
};

export default SaldoMutationReportsConfig;
