import { lighten } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Tooltip from '@mui/material/Tooltip';
import {
  changeSaldoMutationReportsReducer,
  getSaldoMutationReports,
} from 'app/store/redux/actions/dashboard-actions/reports-actions/saldo-mutation-reports-action';
import { useDispatch, useSelector } from 'react-redux';

const rows = [
  {
    id: 'tanggal',
    align: 'center',
    disablePadding: false,
    label: 'Tanggal',
    sort: false,
  },
  {
    id: 'reff_id',
    align: 'center',
    disablePadding: false,
    label: 'Reff ID',
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
    id: 'kredit',
    align: 'left',
    disablePadding: false,
    label: 'Kredit',
    sort: false,
  },
  {
    id: 'debit',
    align: 'left',
    disablePadding: false,
    label: 'Debit',
    sort: false,
  },
  {
    id: 'saldo',
    align: 'left',
    disablePadding: false,
    label: 'Saldo',
    sort: false,
  },
];

function SaldoMutationListTableHead() {
  const dispatch = useDispatch();

  const { saldoMutationReportsSortBy, saldoMutationReportsSortType } = useSelector(
    (state) => state.saldoMutationReportsReducer
  );

  const handleRequestSort = async (event, column) => {
    const isAsc =
      saldoMutationReportsSortBy === column.id && saldoMutationReportsSortType === 'asc';
    await dispatch(
      changeSaldoMutationReportsReducer({
        loading: true,
        saldoMutationReportsPage: 0,
        saldoMutationReportsSortBy: column.id,
        saldoMutationReportsSortType: isAsc ? 'desc' : 'asc',
      })
    );
    await dispatch(getSaldoMutationReports());
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
                saldoMutationReportsSortBy === row.id ? saldoMutationReportsSortType : false
              }
            >
              {row.sort ? (
                <Tooltip
                  title="Sort"
                  placement={row.align === 'right' ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={saldoMutationReportsSortBy === row.id}
                    direction={saldoMutationReportsSortType === 'desc' ? 'desc' : 'asc'}
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

export default SaldoMutationListTableHead;
