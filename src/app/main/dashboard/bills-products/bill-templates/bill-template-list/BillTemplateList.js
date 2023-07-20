import FusePageCarded from '@fuse/core/FusePageCarded';
import BillTemplateListHeader from './BillTemplateListHeader';
import BillTemplateListTable from './BillTemplateListTable';

function BillTemplateList(props) {
  const { title } = props;

  return (
    <FusePageCarded
      header={<BillTemplateListHeader title={title} />}
      content={<BillTemplateListTable />}
      scroll="page"
    />
  );
}

export default BillTemplateList;
