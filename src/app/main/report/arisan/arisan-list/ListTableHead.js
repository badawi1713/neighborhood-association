import { lighten } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Tooltip from '@mui/material/Tooltip';
import {
  changeReportArisanReducer,
  getReportArisan,
} from 'app/store/redux/actions/report-actions/report-arisan-actions';
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
    id: 'tanggal',
    align: 'center',
    disablePadding: false,
    label: 'Tanggal',
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
    id: 'dapat_1',
    align: 'left',
    disablePadding: false,
    label: 'Dapat 1',
    sort: false,
  },
  {
    id: 'dapat_2',
    align: 'left',
    disablePadding: false,
    label: 'Dapat 2',
    sort: false,
  },
  {
    id: 'jumlah_lunas',
    align: 'left',
    disablePadding: false,
    label: 'Lunas',
    sort: false,
  },
  {
    id: 'jumlah_belum_lunas',
    align: 'left',
    disablePadding: false,
    label: 'Belum Lunas',
    sort: false,
  },
  {
    id: 'jumlah_anggota',
    align: 'left',
    disablePadding: false,
    label: 'Jumlah Anggota',
    sort: false,
  },

  {
    id: 'nominal_lunas',
    align: 'left',
    disablePadding: false,
    label: 'Nominal Sudah Lunas',
    sort: false,
  },
  {
    id: 'nominal_belum_lunas',
    align: 'left',
    disablePadding: false,
    label: 'Nominal Belum Lunas',
    sort: false,
  },

  {
    id: 'jumlah_nominal',
    align: 'left',
    disablePadding: false,
    label: 'Jumlah Nominal',
    sort: false,
  },
];

function ListTableHead() {
  const dispatch = useDispatch();

  const { reportArisanSortBy, reportArisanSortType } = useSelector(
    (state) => state.reportArisanReducer
  );

  const handleRequestSort = async (event, column) => {
    const isAsc = reportArisanSortBy === column.id && reportArisanSortType === 'asc';
    await dispatch(
      changeReportArisanReducer({
        loading: true,
        reportArisanPage: 0,
        reportArisanSortBy: column.id,
        reportArisanSortType: isAsc ? 'desc' : 'asc',
      })
    );
    await dispatch(getReportArisan());
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
              sortDirection={reportArisanSortBy === row.id ? reportArisanSortType : false}
            >
              {row.sort ? (
                <Tooltip
                  title="Sort"
                  placement={row.align === 'right' ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={reportArisanSortBy === row.id}
                    direction={reportArisanSortType === 'desc' ? 'desc' : 'asc'}
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
