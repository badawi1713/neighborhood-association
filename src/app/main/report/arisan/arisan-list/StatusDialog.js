/* eslint-disable camelcase */
import FuseSvgIcon from '@fuse/core/FuseSvgIcon/FuseSvgIcon';
import {
  AppBar,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Input,
  Toolbar,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { styled } from '@mui/material/styles';

import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.grey[200],
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function createData(name, id, keterangan) {
  return {
    name,
    id,
    keterangan,
  };
}
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Nama',
  },
  {
    id: 'keterangan',
    numeric: true,
    disablePadding: false,
    label: 'Keterangan',
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <StyledTableCell
            key={headCell.id}
            align={headCell.align || 'left'}
            padding="normal"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  //   rowCount: PropTypes.number.isRequired,
};

function StatusDialog({ open, closeDialogHandler }) {
  const { reportArisanStatusDetailData, reportArusanStatusTitle } = useSelector(
    (state) => state.reportArisanReducer
  );

  const rows = useMemo(() => {
    return reportArisanStatusDetailData?.length > 0
      ? reportArisanStatusDetailData?.map((user) => {
          return createData(user?.name, user?.id, user?.keterangan);
        })
      : [];
  }, [reportArisanStatusDetailData]);

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [keyword, setKeyword] = useState('');

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rows, rowsPerPage]
  );

  const filterData = useMemo(() => {
    return visibleRows.filter((obj) => obj?.name?.toLowerCase().includes(keyword.toLowerCase()));
  }, [keyword, visibleRows]);

  return (
    <Dialog open={open} fullScreen fullWidth>
      <AppBar position="static" elevation={1}>
        <Toolbar
          sx={{ backgroundColor: 'secondary.main' }}
          className="flex w-full items-center justify-between"
        >
          <Typography variant="h6" color="inherit">
            {reportArusanStatusTitle}
          </Typography>
          <IconButton onClick={closeDialogHandler}>
            <FuseSvgIcon color="white">heroicons-solid:x</FuseSvgIcon>
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent className="p-0">
        <Box sx={{ width: '100%', height: '100%' }}>
          <Paper
            square
            sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <Toolbar
              sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
              }}
            >
              <Paper
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
                className="flex items-center w-full md:max-w-256 space-x-8 px-16 rounded-full border-1 shadow-0 ml-auto"
              >
                <FuseSvgIcon color="disabled">heroicons-solid:search</FuseSvgIcon>

                <Input
                  placeholder="Pencarian..."
                  className="flex flex-1"
                  disableUnderline
                  fullWidth
                  type="search"
                  inputProps={{
                    'aria-label': 'Search',
                  }}
                  value={keyword}
                  onChange={(ev) => {
                    const { value } = ev.target;
                    setKeyword(value);
                  }}
                />
              </Paper>
            </Toolbar>
            <TableContainer sx={{ minHeight: 0, flexGrow: 1, overflow: 'scroll' }}>
              <Table stickyHeader sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
                <EnhancedTableHead
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  rowCount={rows.length}
                />
                <TableBody>
                  {filterData.map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <StyledTableRow hover tabIndex={-1} key={row.id}>
                        <TableCell component="th" id={labelId} scope="row">
                          {row.name || '-'}
                        </TableCell>
                        <TableCell align="left">{row.keterangan || '-'}</TableCell>
                      </StyledTableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: 33 * emptyRows,
                      }}
                    />
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </DialogContent>
      <DialogActions className="py-8 px-24">
        <TablePagination
          showLastButton
          showFirstButton
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Baris per halaman:"
          backIconButtonProps={{
            'aria-label': 'Halaman Sebelumnya',
          }}
          nextIconButtonProps={{
            'aria-label': 'Halaman Berikutnya',
          }}
          labelDisplayedRows={function defaultLabelDisplayedRows({ from, count, to }) {
            return `${from}–${to} dari ${count !== -1 ? count : `lebih dari ${to}`}`;
          }}
        />
      </DialogActions>
    </Dialog>
  );
}

StatusDialog.propTypes = {
  closeDialogHandler: PropTypes.func.isRequired,
  open: PropTypes.bool,
};

StatusDialog.defaultProps = {
  closeDialogHandler: () => {
    console.log('close dialog');
  },
  openDialog: false,
};

export default StatusDialog;

// function StatusDialog({ open, closeDialogHandler }) {
//   const { reportArisanStatusDetailData, reportArusanStatusTitle } = useSelector(
//     (state) => state.reportArisanReducer
//   );

//   console.log(reportArisanStatusDetailData);

//   return (
//     <Dialog open={open} maxWidth="md" fullWidth>
//       <AppBar position="static" elevation={1}>
//         <Toolbar sx={{ backgroundColor: 'secondary.main' }} className="flex w-full">
//           <Typography variant="h6" color="inherit">
//             {reportArusanStatusTitle}
//           </Typography>
//         </Toolbar>
//       </AppBar>
//       <DialogContent />
//       <DialogActions className="py-8 px-24">
//         <div className="flex justify-end items-center gap-12">
//           <Button onClick={closeDialogHandler} aria-label="tutup">
//             Tutup
//           </Button>
//         </div>
//       </DialogActions>
//     </Dialog>
//   );
// }

// StatusDialog.propTypes = {
//   closeDialogHandler: PropTypes.func.isRequired,
//   open: PropTypes.bool,
// };

// StatusDialog.defaultProps = {
//   closeDialogHandler: () => {
//     console.log('close dialog');
//   },
//   openDialog: false,
// };

// export default StatusDialog;
