import Home from '.';

const homeConfigs = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: 'beranda',
      element: <Home />,
      children: [
        {
          path: '',
          element: <Home />,
        },
      ],
    },
  ],
};

export default homeConfigs;
