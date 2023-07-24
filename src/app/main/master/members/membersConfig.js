import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const List = lazy(() => import('./member-list/List'));

const MembersConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: 'master/anggota',
      element: <List />,
    },
    {
      path: 'master/anggota',
      element: <Navigate to="master/anggota" />,
    },
  ],
};

export default MembersConfig;
