import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const UserList = lazy(() => import('./user-list/UserList'));

const UsersConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: 'dashboard/manajemen-user/daftar-user',
      element: <UserList />,
    },
    {
      path: 'dashboard/manajemen-user/daftar-user',
      element: <Navigate to="dashboard/manajemen-user/daftar-user" />,
    },
  ],
};

export default UsersConfig;
