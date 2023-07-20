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
        id: 'dashboard.user.management',
        title: 'Manajemen User',
        type: 'collapse',
        icon: 'material-outline:supervised_user_circle',
        children: [
          {
            id: 'dashboard.user.management.group',
            title: 'Grup User',
            type: 'item',
            url: '/dashboard/manajemen-user/grup',
            icon: 'material-outline:people_alt',
          },
          {
            id: 'dashboard.user.management.list',
            title: 'Daftar User',
            type: 'item',
            url: '/dashboard/manajemen-user/daftar-user',
            icon: 'material-outline:person_add',
          },
        ],
      },
      {
        id: 'dashboard.bills.products',
        title: 'Produk & Tagihan',
        type: 'collapse',
        icon: 'material-outline:receipt_long',
        children: [
          {
            id: 'dashboard.bills.products',
            title: 'Produk',
            type: 'item',
            url: '/dashboard/produk-dan-tagihan/daftar-produk',
            icon: 'material-outline:shopping_bag',
          },
          {
            id: 'dashboard.bills.templates',
            title: 'Template Tagihan',
            type: 'item',
            url: '/dashboard/produk-dan-tagihan/template-tagihan',
            icon: 'material-outline:table_chart',
          },
          {
            id: 'dashboard.bills',
            title: 'Tagihan',
            type: 'item',
            url: '/dashboard/produk-dan-tagihan/daftar-tagihan',
            icon: 'material-outline:receipt',
          },
        ],
      },
      {
        id: 'dashboard.reports',
        title: 'Laporan',
        type: 'collapse',
        icon: 'material-outline:menu_book',
        children: [
          {
            id: 'dashboard.saldo.mutation.reports',
            title: 'Mutasi Saldo',
            type: 'item',
            url: '/dashboard/laporan/mutasi-saldo',
            icon: 'material-outline:insert_drive_file',
          },
          {
            id: 'dashboard.bill.reports',
            title: 'Tagihan',
            type: 'item',
            url: '/dashboard/laporan/daftar-tagihan',
            icon: 'material-outline:insert_drive_file',
          },
        ],
      },
      {
        id: 'dashboard.fund.withdrawal',
        title: 'Penarikan Dana',
        type: 'item',
        url: '/dashboard/penarikan-dana',
        icon: 'material-outline:file_download',
      },
    ],
  },
  {
    id: 'settings',
    title: 'Pengaturan',
    type: 'group',
    translate: 'PENGATURAN',
    children: [
      {
        id: 'settings.menu',
        title: 'Pengaturan',
        type: 'collapse',
        icon: 'material-outline:settings',
        children: [
          {
            id: 'settings.bank',
            title: 'Bank',
            type: 'item',
            url: '/pengaturan/bank',
            icon: 'material-outline:account_balance',
          },
          {
            id: 'settings.profile',
            title: 'Profil',
            type: 'item',
            url: '/pengaturan/profil',
            icon: 'material-outline:person',
          },
        ],
      },
    ],
  },
];

export default navigationConfig;
