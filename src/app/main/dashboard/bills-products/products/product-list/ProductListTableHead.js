import { lighten } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Tooltip from '@mui/material/Tooltip';
import {
  changeProductReducer,
  getProduct,
} from 'app/store/redux/actions/dashboard-actions/bills-products-actions/product-action';
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
    id: 'nominal',
    align: 'left',
    disablePadding: false,
    label: 'Nominal',
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

function ProductListTableHead() {
  const dispatch = useDispatch();

  const { productSortBy, productSortType } = useSelector((state) => state.productReducer);

  const handleRequestSort = async (event, column) => {
    const isAsc = productSortBy === column.id && productSortType === 'asc';
    await dispatch(
      changeProductReducer({
        loading: true,
        productPage: 0,
        productSortBy: column.id,
        productSortType: isAsc ? 'desc' : 'asc',
      })
    );
    await dispatch(getProduct());
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
              sortDirection={productSortBy === row.id ? productSortType : false}
            >
              {row.sort ? (
                <Tooltip
                  title="Sort"
                  placement={row.align === 'right' ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={productSortBy === row.id}
                    direction={productSortType === 'desc' ? 'desc' : 'asc'}
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

export default ProductListTableHead;
