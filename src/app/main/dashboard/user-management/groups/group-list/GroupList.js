import FusePageCarded from '@fuse/core/FusePageCarded';
import GroupListHeader from './GroupListHeader';
import GroupListTable from './GroupListTable';

function GroupList(props) {
  const { title } = props;

  return (
    <FusePageCarded
      header={<GroupListHeader title={title} />}
      content={<GroupListTable />}
      scroll="page"
    />
  );
}

export default GroupList;
