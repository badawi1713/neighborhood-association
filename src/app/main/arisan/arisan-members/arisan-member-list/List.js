import FusePageCarded from '@fuse/core/FusePageCarded';
import ListHeader from './ListHeader';
import ListTable from './ListTable';

function List(props) {
  const { title } = props;

  return (
    <FusePageCarded header={<ListHeader title={title} />} content={<ListTable />} scroll="page" />
  );
}

export default List;
