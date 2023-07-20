import FusePageCarded from '@fuse/core/FusePageCarded';
import SaldoMutationListHeader from './SaldoMutationListHeader';
import SaldoMutationListTable from './SaldoMutationListTable';

function SaldoMutationList(props) {
  const { title } = props;

  return (
    <FusePageCarded
      header={<SaldoMutationListHeader title={title} />}
      content={<SaldoMutationListTable />}
      scroll="page"
    />
  );
}

export default SaldoMutationList;
