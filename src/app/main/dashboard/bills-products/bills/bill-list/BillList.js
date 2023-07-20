import FusePageCarded from '@fuse/core/FusePageCarded';
import BillListHeader from './BillListHeader';
import BillListTable from './BillListTable';

function BillList(props) {
  const { title } = props;

  return (
    <FusePageCarded
      header={<BillListHeader title={title} />}
      content={<BillListTable />}
      scroll="page"
    />
  );
}

export default BillList;
