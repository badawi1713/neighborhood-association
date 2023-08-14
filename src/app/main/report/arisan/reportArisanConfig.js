import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const List = lazy(() => import('./arisan-list/List'));

const ReportArisanConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: 'laporan/arisan',
      element: <List />,
    },
    {
      path: 'laporan/arisan',
      element: <Navigate to="laporan/arisan" />,
    },
  ],
};

export default ReportArisanConfig;
