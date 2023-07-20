import FusePageCarded from '@fuse/core/FusePageCarded';
import UserListHeader from './UserListHeader';
import UserListTable from './UserListTable';

function UserList(props) {
  const { title } = props;

  return (
    <FusePageCarded
      header={<UserListHeader title={title} />}
      content={<UserListTable />}
      scroll="page"
    />
  );
}

export default UserList;
