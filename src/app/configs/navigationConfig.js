import i18next from 'i18next';

import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';

i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('tr', 'navigation', tr);
i18next.addResourceBundle('ar', 'navigation', ar);

const navigationConfig = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    translate: 'DASHBOARD',
    children: [
      {
        id: 'dashboard.master',
        title: 'Master',
        type: 'collapse',
        icon: 'material-outline:storage',
        children: [
          {
            id: 'dashboard.master.member',
            title: 'Anggota',
            type: 'item',
            url: '/master/anggota',
            icon: 'material-outline:supervised_user_circle',
          },
        ],
      },
      {
        id: 'dashboard.arisan',
        title: 'Arisan',
        type: 'collapse',
        icon: 'material-outline:receipt_long',
        children: [
          {
            id: 'dashboard.arisan.member',
            title: 'Anggota Arisan',
            type: 'item',
            url: '/arisan/daftar-anggota',
            icon: 'material-outline:people_alt',
          },
          {
            id: 'dashboard.arisan.schedules',
            title: 'Pertemuan Arisan',
            type: 'item',
            url: '/arisan/daftar-pertemuan',
            icon: 'material-outline:edit_calendar',
          },
        ],
      },
      {
        id: 'dashboard.transaction',
        title: 'Transaksi',
        type: 'collapse',
        icon: 'heroicons-solid:refresh',
        children: [
          {
            id: 'dashboard.transaction.arisan',
            title: 'Arisan',
            type: 'item',
            url: '/transaksi/arisan',
            icon: 'material-outline:receipt_long',
          },
        ],
      },
      {
        id: 'dashboard.report',
        title: 'Laporan',
        type: 'collapse',
        icon: 'heroicons-solid:document-text',
        children: [
          {
            id: 'dashboard.report',
            title: 'Laporan Arisan',
            type: 'item',
            url: '/laporan/arisan',
            icon: 'material-outline:article',
          },
        ],
      },
    ],
  },
];

export default navigationConfig;
