import { lighten } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Tooltip from '@mui/material/Tooltip';
import {
  changeUserManagementUserReducer,
  getUserManagementUser,
} from 'app/store/redux/actions/dashboard-actions/user-management-actions/user-management-user-action';
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
    id: 'email',
    align: 'left',
    disablePadding: false,
    label: 'Email',
    sort: false,
  },
  {
    id: 'no_telp',
    align: 'left',
    disablePadding: false,
    label: 'No. Telepon',
    sort: false,
  },
  {
    id: 'type',
    align: 'left',
    disablePadding: false,
    label: 'Role',
    sort: false,
  },
  {
    id: 'instansi_name',
    align: 'left',
    disablePadding: false,
    label: 'Instansi',
    sort: false,
  },
  {
    id: 'status',
    align: 'center',
    disablePadding: false,
    label: 'Status',
    sort: false,
  },
  {
    id: 'created_date',
    align: 'center',
    disablePadding: false,
    label: 'Tgl Dibuat',
    sort: false,
  },
  {
    id: 'last_updated',
    align: 'center',
    disablePadding: false,
    label: 'Tgl Diubah',
    sort: false,
  },
  {
    id: 'keterangan',
    align: 'left',
    disablePadding: false,
    label: 'Keterangan',
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

function UserListTableHead() {
  const dispatch = useDispatch();

  const { userManagementUserSortBy, userManagementUserSortType } = useSelector(
    (state) => state.userManagementUserReducer
  );

  const handleRequestSort = async (event, column) => {
    const isAsc = userManagementUserSortBy === column.id && userManagementUserSortType === 'asc';
    await dispatch(
      changeUserManagementUserReducer({
        loading: true,
        userManagementUserPage: 0,
        userManagementUserSortBy: column.id,
        userManagementUserSortType: isAsc ? 'desc' : 'asc',
      })
    );
    await dispatch(getUserManagementUser());
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
                userManagementUserSortBy === row.id ? userManagementUserSortType : false
              }
            >
              {row.sort ? (
                <Tooltip
                  title="Sort"
                  placement={row.align === 'right' ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={userManagementUserSortBy === row.id}
                    direction={userManagementUserSortType === 'desc' ? 'desc' : 'asc'}
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

export default UserListTableHead;
