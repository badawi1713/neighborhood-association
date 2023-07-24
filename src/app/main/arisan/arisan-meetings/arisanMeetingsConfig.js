import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const List = lazy(() => import('./arisan-meeting-list/List'));

const ArisanMeetingsConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: 'arisan/daftar-pertemuan',
      element: <List />,
    },
    {
      path: 'arisan/daftar-pertemuan',
      element: <Navigate to="arisan/daftar-pertemuan" />,
    },
  ],
};

export default ArisanMeetingsConfig;
