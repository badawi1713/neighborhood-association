import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const List = lazy(() => import('./arisan-member-list/List'));

const ArisanMembersConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: 'arisan/daftar-anggota',
      element: <List />,
    },
    {
      path: 'arisan/daftar-anggota',
      element: <Navigate to="arisan/daftar-anggota" />,
    },
  ],
};

export default ArisanMembersConfig;
