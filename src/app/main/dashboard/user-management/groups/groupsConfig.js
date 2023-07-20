import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const GroupList = lazy(() => import('./group-list/GroupList'));

const GroupsConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: 'dashboard/manajemen-user/grup',
      element: <GroupList />,
    },
    {
      path: 'dashboard/manajemen-user/grup',
      element: <Navigate to="dashboard/manajemen-user/grup" />,
    },
  ],
};

export default GroupsConfig;
