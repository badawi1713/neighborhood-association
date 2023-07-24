import { lighten } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Tooltip from '@mui/material/Tooltip';
import {
  changeArisanMembersReducer,
  getArisanMembers,
} from 'app/store/redux/actions/arisan-actions/arisan-member-actions';
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
    id: 'anggota_name',
    align: 'left',
    disablePadding: false,
    label: 'Nama',
    sort: false,
  },
  {
    id: 'dapat',
    align: 'center',
    disablePadding: false,
    label: 'Dapat Arisan',
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
    id: 'created_date',
    align: 'center',
    disablePadding: false,
    label: 'Tanggal Dibuat',
    sort: false,
  },
  {
    id: 'last_updated',
    align: 'center',
    disablePadding: false,
    label: 'Tanggal Diubah',
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

function ListTableHead() {
  const dispatch = useDispatch();

  const { arisanMembersSortBy, arisanMembersSortType } = useSelector(
    (state) => state.arisanMembersReducer
  );

  const handleRequestSort = async (event, column) => {
    const isAsc = arisanMembersSortBy === column.id && arisanMembersSortType === 'asc';
    await dispatch(
      changeArisanMembersReducer({
        loading: true,
        arisanMembersPage: 0,
        arisanMembersSortBy: column.id,
        arisanMembersSortType: isAsc ? 'desc' : 'asc',
      })
    );
    await dispatch(getArisanMembers());
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
              sortDirection={arisanMembersSortBy === row.id ? arisanMembersSortType : false}
            >
              {row.sort ? (
                <Tooltip
                  title="Sort"
                  placement={row.align === 'right' ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={arisanMembersSortBy === row.id}
                    direction={arisanMembersSortType === 'desc' ? 'desc' : 'asc'}
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

export default ListTableHead;
