import { lighten } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Tooltip from '@mui/material/Tooltip';
import {
  changeUserManagementGroupReducer,
  getUserManagementGroup,
} from 'app/store/redux/actions/dashboard-actions/user-management-actions/user-management-group-action';
import { useDispatch, useSelector } from 'react-redux';

const rows = [
  {
    id: 'index',
    align: 'center',
    disablePadding: false,
    label: 'No',
    sort: false,
  },
  {
    id: 'name',
    align: 'left',
    disablePadding: false,
    label: 'Nama',
    sort: false,
  },
  {
    id: 'id',
    align: 'center',
    disablePadding: false,
    label: 'Aksi',
    sort: false,
  },
];

function GroupListTableHead() {
  const dispatch = useDispatch();

  const { userManagementGroupSortBy, userManagementGroupSortType } = useSelector(
    (state) => state.userManagementGroupReducer
  );

  const handleRequestSort = async (event, column) => {
    const isAsc = userManagementGroupSortBy === column.id && userManagementGroupSortType === 'asc';
    await dispatch(
      changeUserManagementGroupReducer({
        loading: true,
        userManagementGroupPage: 0,
        userManagementGroupSortBy: column.id,
        userManagementGroupSortType: isAsc ? 'desc' : 'asc',
      })
    );
    await dispatch(getUserManagementGroup());
  };

  return (
    <TableHead>
      <TableRow className="h-48 sm:h-64">
        {rows.map((row) => {
          return (
            <TableCell
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === 'light'
                    ? lighten(theme.palette.background.default, 0.4)
                    : lighten(theme.palette.background.default, 0.02),
              }}
              className="p-4 md:p-16"
              key={row.id}
              align={row.align}
              padding={row.disablePadding ? 'none' : 'normal'}
              sortDirection={
                userManagementGroupSortBy === row.id ? userManagementGroupSortType : false
              }
            >
              {row.sort ? (
                <Tooltip
                  title="Sort"
                  placement={row.align === 'right' ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={userManagementGroupSortBy === row.id}
                    direction={userManagementGroupSortType === 'desc' ? 'desc' : 'asc'}
                    onClick={(event) => {
                      handleRequestSort(event, row);
                    }}
                    className="font-semibold"
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              ) : (
                <span className="font-semibold">{row.label}</span>
              )}
            </TableCell>
          );
        }, this)}
      </TableRow>
    </TableHead>
  );
}

export default GroupListTableHead;
