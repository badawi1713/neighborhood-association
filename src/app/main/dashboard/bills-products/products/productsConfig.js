import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const ProductList = lazy(() => import('./product-list/ProductList'));

const ProductsConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: 'dashboard/produk-dan-tagihan/daftar-produk',
      element: <ProductList />,
    },
    {
      path: 'dashboard/produk-dan-tagihan/daftar-produk',
      element: <Navigate to="dashboard/produk-dan-tagihan/daftar-produk" />,
    },
  ],
};

export default ProductsConfig;
