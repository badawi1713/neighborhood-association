import FusePageCarded from '@fuse/core/FusePageCarded';
import FundWithdrawaListHeader from './FundWithdrawaHeader';
import FundWithdrawaListTable from './FundWithdrawaListTable';

function FundWithdrawaList(props) {
  const { title } = props;

  return (
    <FusePageCarded
      header={<FundWithdrawaListHeader title={title} />}
      content={<FundWithdrawaListTable />}
      scroll="page"
    />
  );
}

export default FundWithdrawaList;
