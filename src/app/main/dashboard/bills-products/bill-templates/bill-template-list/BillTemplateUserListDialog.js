/* eslint-disable camelcase */
import FuseSvgIcon from '@fuse/core/FuseSvgIcon/FuseSvgIcon';
import {
  AppBar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Input,
  Toolbar,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
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
import {
  getBillTemplate,
  updateBillTemplateByUserData,
} from 'app/store/redux/actions/dashboard-actions/bills-products-actions/bill-template-action';
import ConfirmationDialog from 'app/theme-layouts/shared-components/ConfirmationDialog';
import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.grey[200],
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function createData(full_name, email, checked, user_id, no_telp) {
  return {
    full_name,
    email,
    checked,
    user_id,
    no_telp,
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
    id: 'full_name',
    numeric: false,
    disablePadding: true,
    label: 'Nama',
  },
  {
    id: 'no_telp',
    numeric: true,
    disablePadding: false,
    label: 'No. Telepon',
  },
  {
    id: 'email',
    numeric: true,
    disablePadding: false,
    label: 'Email',
  },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <StyledTableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </StyledTableCell>
        {headCells.map((headCell) => (
          <StyledTableCell
            key={headCell.id}
            align={headCell.align || 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
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
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function BillTemplateUserListDialog({ open, closeDialogHandler }) {
  const dispatch = useDispatch();
  const { loadingPost, billTemplateByUserData, dialogId } = useSelector(
    (state) => state.billTemplateReducer
  );

  const rows = useMemo(() => {
    return billTemplateByUserData?.length > 0
      ? billTemplateByUserData?.map((user) => {
          return createData(
            user?.full_name,
            user?.email,
            user?.checked,
            user?.user_id,
            user?.no_telp
          );
        })
      : [];
  }, [billTemplateByUserData]);

  const selectedData = useMemo(() => {
    const checkedData =
      billTemplateByUserData?.length > 0
        ? billTemplateByUserData?.filter((data) => data?.checked === true)
        : [];
    const isChecked = checkedData?.length > 0 ? checkedData?.map((data) => data?.user_id) : [];
    return isChecked;
  }, [billTemplateByUserData]);

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('full_name');
  const [selected, setSelected] = useState(selectedData);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.user_id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

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
    return visibleRows.filter((obj) =>
      obj?.full_name?.toLowerCase().includes(keyword.toLowerCase())
    );
  }, [keyword, visibleRows]);

  const handleSave = async (data) => {
    const payload = {
      list_user: selected,
    };

    const response = await dispatch(updateBillTemplateByUserData(payload, dialogId));
    if (response) {
      closeDialogHandler();
      dispatch(getBillTemplate());
    }
    setOpenConfirmation(false);
  };

  return (
    <Dialog open={open} maxWidth="lg" fullWidth>
      <AppBar position="static" elevation={1}>
        <Toolbar
          sx={{ backgroundColor: 'secondary.main' }}
          className="flex w-full items-center justify-between"
        >
          <Typography variant="h6" color="inherit">
            Daftar User
          </Typography>
        </Toolbar>
      </AppBar>
      <DialogContent className="p-0">
        <section className="flex flex-col gap-16">
          <Box sx={{ width: '100%' }}>
            <Paper square sx={{ width: '100%' }}>
              <Toolbar
                sx={{
                  pl: { sm: 2 },
                  pr: { xs: 1, sm: 1 },
                }}
              >
                <Typography
                  sx={{ flex: '1 1 100%' }}
                  color="inherit"
                  variant="subtitle2"
                  component="div"
                >
                  {selected?.length} data tercentang
                </Typography>

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
              <TableContainer sx={{ height: 290 }}>
                <Table
                  stickyHeader
                  sx={{ minWidth: 750 }}
                  aria-labelledby="tableTitle"
                  size="medium"
                >
                  <EnhancedTableHead
                    numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    rowCount={rows.length}
                  />
                  <TableBody>
                    {filterData.map((row, index) => {
                      const isItemSelected = isSelected(row.user_id);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <StyledTableRow
                          hover
                          onClick={(event) => handleClick(event, row.user_id)}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.user_id}
                          selected={isItemSelected}
                          sx={{ cursor: 'pointer' }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              color="primary"
                              checked={isItemSelected}
                              inputProps={{
                                'aria-labelledby': labelId,
                              }}
                            />
                          </TableCell>
                          <TableCell component="th" id={labelId} scope="row" padding="none">
                            {row.full_name || '-'}
                          </TableCell>
                          <TableCell align="left">{row.no_telp || '-'}</TableCell>
                          <TableCell align="left">{row.email || '-'}</TableCell>
                        </StyledTableRow>
                      );
                    })}
                    {emptyRows > 0 && (
                      <TableRow
                        style={{
                          height: 33 * emptyRows,
                        }}
                      >
                        <TableCell colSpan={4} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                showLastButton
                showFirstButton
                rowsPerPageOptions={[5, 10, 25]}
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
            </Paper>
          </Box>
        </section>
      </DialogContent>
      <DialogActions className="py-8 px-24">
        <div className="flex justify-end items-center gap-12">
          <Button onClick={closeDialogHandler} aria-label="tutup">
            Tutup
          </Button>
          <Button
            variant="contained"
            color="secondary"
            type="submit"
            aria-label="simpan"
            onClick={() => setOpenConfirmation(true)}
            disabled={loadingPost}
          >
            Simpan
          </Button>
        </div>
      </DialogActions>
      {openConfirmation && (
        <ConfirmationDialog
          open={openConfirmation}
          title="Simpan data template tagihan user?"
          type="secondary"
          content={`Konfirmasi untuk melakukan penyimpanan data dengan ID: ${dialogId}`}
          loading={loadingPost}
          confirmActionText="OK"
          loadingText="Menyimpan..."
          cancelActionHandler={() => setOpenConfirmation(false)}
          confirmActionHandler={handleSave}
        />
      )}
    </Dialog>
  );
}

BillTemplateUserListDialog.propTypes = {
  closeDialogHandler: PropTypes.func.isRequired,
  open: PropTypes.bool,
};

BillTemplateUserListDialog.defaultProps = {
  closeDialogHandler: () => {
    console.log('close dialog');
  },
  openDialog: false,
};

export default BillTemplateUserListDialog;
