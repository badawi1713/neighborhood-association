import FusePageCarded from '@fuse/core/FusePageCarded';
import ProductListHeader from './ProductListHeader';
import ProductListTable from './ProductListTable';

function ProductList(props) {
  const { title } = props;

  return (
    <FusePageCarded
      header={<ProductListHeader title={title} />}
      content={<ProductListTable />}
      scroll="page"
    />
  );
}

export default ProductList;
