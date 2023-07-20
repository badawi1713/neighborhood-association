import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const BankSettings = lazy(() => import('./bank-settings-form/BankSettings'));

const BankSettingsConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: 'pengaturan/bank',
      element: <BankSettings />,
    },
    {
      path: 'pengaturan/bank',
      element: <Navigate to="pengaturan/bank" />,
    },
  ],
};

export default BankSettingsConfig;
