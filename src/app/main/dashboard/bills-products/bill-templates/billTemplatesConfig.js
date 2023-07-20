import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const BillTemplateList = lazy(() => import('./bill-template-list/BillTemplateList'));

const BillTemplatesConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: 'dashboard/produk-dan-tagihan/template-tagihan',
      element: <BillTemplateList />,
    },
    {
      path: 'dashboard/produk-dan-tagihan/template-tagihan',
      element: <Navigate to="dashboard/produk-dan-tagihan/template-tagihan" />,
    },
  ],
};

export default BillTemplatesConfig;
