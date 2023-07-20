import { lighten } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Tooltip from '@mui/material/Tooltip';
import {
  changeFundWithdrawalReducer,
  getFundWithdrawal,
} from 'app/store/redux/actions/dashboard-actions/fund-withdrawal-actions';
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
    id: 'created_date',
    align: 'center',
    disablePadding: false,
    label: 'Tanggal',
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
    id: 'no_rek',
    align: 'left',
    disablePadding: false,
    label: 'No. Rekening',
    sort: false,
  },
  {
    id: 'bank_name',
    align: 'left',
    disablePadding: false,
    label: 'Bank',
    sort: false,
  },
  {
    id: 'atas_nama',
    align: 'left',
    disablePadding: false,
    label: 'Atas Nama',
    sort: false,
  },
  {
    id: 'status_id',
    align: 'center',
    disablePadding: false,
    label: 'Status',
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

function FundWithdrawaListTableHead() {
  const dispatch = useDispatch();

  const { fundWithdrawalSortBy, fundWithdrawalSortType } = useSelector(
    (state) => state.fundWithdrawalReducer
  );

  const handleRequestSort = async (event, column) => {
    const isAsc = fundWithdrawalSortBy === column.id && fundWithdrawalSortType === 'asc';
    await dispatch(
      changeFundWithdrawalReducer({
        loading: true,
        fundWithdrawalPage: 0,
        fundWithdrawalSortBy: column.id,
        fundWithdrawalSortType: isAsc ? 'desc' : 'asc',
      })
    );
    await dispatch(getFundWithdrawal());
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
              sortDirection={fundWithdrawalSortBy === row.id ? fundWithdrawalSortType : false}
            >
              {row.sort ? (
                <Tooltip
                  title="Sort"
                  placement={row.align === 'right' ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={fundWithdrawalSortBy === row.id}
                    direction={fundWithdrawalSortType === 'desc' ? 'desc' : 'asc'}
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

export default FundWithdrawaListTableHead;
