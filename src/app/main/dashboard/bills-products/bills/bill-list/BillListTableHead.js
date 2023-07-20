import { lighten } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Tooltip from '@mui/material/Tooltip';
import {
  changeBillReducer,
  getBill,
} from 'app/store/redux/actions/dashboard-actions/bills-products-actions/bill-action';
import { useDispatch, useSelector } from 'react-redux';

const rows = [
  {
    id: 'id',
    align: 'center',
    disablePadding: false,
    label: 'ID',
    sort: false,
  },
  {
    id: 'group_name',
    align: 'left',
    disablePadding: false,
    label: 'Grup',
    sort: false,
  },
  {
    id: 'user_id',
    align: 'left',
    disablePadding: false,
    label: 'ID User',
    sort: false,
  },
  {
    id: 'user_name',
    align: 'left',
    disablePadding: false,
    label: 'User',
    sort: false,
  },

  {
    id: 'nominal',
    align: 'left',
    disablePadding: false,
    label: 'Nominal',
    sort: false,
  },
  {
    id: 'status_name',
    align: 'center',
    disablePadding: false,
    label: 'Status',
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
    id: 'index',
    align: 'center',
    disablePadding: false,
    label: 'Aksi',
    sort: false,
  },
];

function BillListTableHead() {
  const dispatch = useDispatch();

  const { billSortBy, billSortType } = useSelector((state) => state.billReducer);

  const handleRequestSort = async (event, column) => {
    const isAsc = billSortBy === column.id && billSortType === 'asc';
    await dispatch(
      changeBillReducer({
        loading: true,
        billPage: 0,
        billSortBy: column.id,
        billSortType: isAsc ? 'desc' : 'asc',
      })
    );
    await dispatch(getBill());
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
              sortDirection={billSortBy === row.id ? billSortType : false}
            >
              {row.sort ? (
                <Tooltip
                  title="Sort"
                  placement={row.align === 'right' ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={billSortBy === row.id}
                    direction={billSortType === 'desc' ? 'desc' : 'asc'}
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

export default BillListTableHead;
