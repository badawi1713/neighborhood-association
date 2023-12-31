import { lighten } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Tooltip from '@mui/material/Tooltip';
import {
  changeArisanMeetingsReducer,
  getArisanMeetings,
} from 'app/store/redux/actions/arisan-actions/arisan-meeting-actions';
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
    id: 'lokasi',
    align: 'left',
    disablePadding: false,
    label: 'Lokasi',
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
    align: 'center',
    disablePadding: false,
    label: 'Pertemuan Ke',
    sort: false,
  },
  {
    id: 'anggota_dapat_1',
    align: 'left',
    disablePadding: false,
    label: 'Anggota Dapat 1',
    sort: false,
  },
  {
    id: 'anggota_dapat_2',
    align: 'left',
    disablePadding: false,
    label: 'Anggota Dapat 2',
    sort: false,
  },
  {
    id: 'keterangan',
    align: 'left',
    disablePadding: false,
    label: 'Keterangan',
    sort: false,
  },
  // {
  //   id: 'deleted',
  //   align: 'center',
  //   disablePadding: false,
  //   label: 'Tersedia',
  //   sort: false,
  // },

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

  const { arisanMeetingsSortBy, arisanMeetingsSortType } = useSelector(
    (state) => state.arisanMeetingsReducer
  );

  const handleRequestSort = async (event, column) => {
    const isAsc = arisanMeetingsSortBy === column.id && arisanMeetingsSortType === 'asc';
    await dispatch(
      changeArisanMeetingsReducer({
        loading: true,
        arisanMeetingsPage: 0,
        arisanMeetingsSortBy: column.id,
        arisanMeetingsSortType: isAsc ? 'desc' : 'asc',
      })
    );
    await dispatch(getArisanMeetings());
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
              sortDirection={arisanMeetingsSortBy === row.id ? arisanMeetingsSortType : false}
            >
              {row.sort ? (
                <Tooltip
                  title="Sort"
                  placement={row.align === 'right' ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={arisanMeetingsSortBy === row.id}
                    direction={arisanMeetingsSortType === 'desc' ? 'desc' : 'asc'}
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
