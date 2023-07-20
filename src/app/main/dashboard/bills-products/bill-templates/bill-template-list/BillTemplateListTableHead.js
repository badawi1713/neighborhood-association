import { lighten } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Tooltip from '@mui/material/Tooltip';
import {
  changeBillTemplateReducer,
  getBillTemplate,
} from 'app/store/redux/actions/dashboard-actions/bills-products-actions/bill-template-action';
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
    id: 'group_name',
    align: 'left',
    disablePadding: false,
    label: 'Grup',
    sort: false,
  },
  {
    id: 'admin',
    align: 'left',
    disablePadding: false,
    label: 'Admin',
    sort: false,
  },
  {
    id: 'denda',
    align: 'left',
    disablePadding: false,
    label: 'Denda',
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
    id: 'type_name',
    align: 'center',
    disablePadding: false,
    label: 'Tipe',
    sort: false,
  },
  {
    id: 'tanggal_tagihan',
    align: 'center',
    disablePadding: false,
    label: 'Tgl Tagihan',
    sort: false,
  },
  {
    id: 'tanggal_tempo',
    align: 'center',
    disablePadding: false,
    label: 'Tgl Jatuh Tempo',
    sort: false,
  },
  {
    id: 'until_periode',
    align: 'center',
    disablePadding: false,
    label: 'Periode',
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
    id: 'id',
    align: 'center',
    disablePadding: false,
    label: 'Aksi',
    sort: false,
  },
];

function BillTemplateListTableHead() {
  const dispatch = useDispatch();

  const { billTemplateSortBy, billTemplateSortType } = useSelector(
    (state) => state.billTemplateReducer
  );

  const handleRequestSort = async (event, column) => {
    const isAsc = billTemplateSortBy === column.id && billTemplateSortType === 'asc';
    await dispatch(
      changeBillTemplateReducer({
        loading: true,
        billTemplatePage: 0,
        billTemplateSortBy: column.id,
        billTemplateSortType: isAsc ? 'desc' : 'asc',
      })
    );
    await dispatch(getBillTemplate());
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
              sortDirection={billTemplateSortBy === row.id ? billTemplateSortType : false}
            >
              {row.sort ? (
                <Tooltip
                  title="Sort"
                  placement={row.align === 'right' ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={billTemplateSortBy === row.id}
                    direction={billTemplateSortType === 'desc' ? 'desc' : 'asc'}
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

export default BillTemplateListTableHead;
