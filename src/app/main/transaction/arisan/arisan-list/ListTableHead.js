import { lighten } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Tooltip from '@mui/material/Tooltip';
import {
  changeTransactionArisanReducer,
  getTransactionArisan,
} from 'app/store/redux/actions/transaction-actions/transaction-arisan-actions';
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
    id: 'anggota_nama',
    align: 'left',
    disablePadding: false,
    label: 'Nama',
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
    id: 'lunas',
    align: 'center',
    disablePadding: false,
    label: 'Lunas',
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
    id: 'pertemuan_lokasi',
    align: 'left',
    disablePadding: false,
    label: 'Lokasi',
    sort: false,
  },
  {
    id: 'pertemuan_ke',
    align: 'left',
    disablePadding: false,
    label: 'Pertemuan Ke',
    sort: false,
  },
  {
    id: 'tanggal_bayar',
    align: 'center',
    disablePadding: false,
    label: 'Tanggal Bayar',
    sort: false,
  },
  {
    id: 'updated_who',
    align: 'left',
    disablePadding: false,
    label: 'Diubah Oleh',
    sort: false,
  },
];

function ListTableHead() {
  const dispatch = useDispatch();

  const { transactionArisanSortBy, transactionArisanSortType } = useSelector(
    (state) => state.transactionArisanReducer
  );

  const handleRequestSort = async (event, column) => {
    const isAsc = transactionArisanSortBy === column.id && transactionArisanSortType === 'asc';
    await dispatch(
      changeTransactionArisanReducer({
        loading: true,
        transactionArisanPage: 0,
        transactionArisanSortBy: column.id,
        transactionArisanSortType: isAsc ? 'desc' : 'asc',
      })
    );
    await dispatch(getTransactionArisan());
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
              sortDirection={transactionArisanSortBy === row.id ? transactionArisanSortType : false}
            >
              {row.sort ? (
                <Tooltip
                  title="Sort"
                  placement={row.align === 'right' ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={transactionArisanSortBy === row.id}
                    direction={transactionArisanSortType === 'desc' ? 'desc' : 'asc'}
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
