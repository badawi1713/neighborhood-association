import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const FundWithdrawaList = lazy(() => import('./fund-withdrawal-list/FundWithdrawalList'));

const FundWithdrawalConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: 'dashboard/penarikan-dana',
      element: <FundWithdrawaList />,
    },
    {
      path: 'dashboard/penarikan-dana',
      element: <Navigate to="dashboard/penarikan-dana" />,
    },
  ],
};

export default FundWithdrawalConfig;
