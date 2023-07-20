/* eslint-disable camelcase */
import {
  AppBar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  ListItem,
  ListItemText,
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
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { currencyFormat } from 'src/utils/utils';

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

function createData(nama, nominal, detail_id) {
  return {
    nama,
    nominal,
    detail_id,
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
    id: 'nama',
    numeric: false,
    disablePadding: true,
    label: 'Nama',
  },
  {
    id: 'nominal',
    numeric: true,
    disablePadding: false,
    label: 'Nominal',
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
};

function DetailFormDialog({ open, closeDialogHandler }) {
  const { saldoMutationReportsDetailData } = useSelector(
    (state) => state.saldoMutationReportsReducer
  );

  const rows = useMemo(() => {
    return saldoMutationReportsDetailData?.tagihan?.list_data?.length > 0
      ? saldoMutationReportsDetailData?.tagihan?.list_data?.map((saldoMutationReports) => {
          return createData(
            saldoMutationReports?.nama,
            saldoMutationReports?.nominal,
            saldoMutationReports?.detail_id
          );
        })
      : [];
  }, [saldoMutationReportsDetailData]);

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('nama');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

  const visibleRows = useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rows, rowsPerPage]
  );

  const formData = useMemo(() => {
    return saldoMutationReportsDetailData;
  }, [saldoMutationReportsDetailData]);

  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: formData,
  });

  const { control } = formMethods;

  return (
    <FormProvider {...formMethods}>
      <Dialog open={open} maxWidth="md" fullWidth>
        <AppBar position="static" elevation={1}>
          <Toolbar
            sx={{ backgroundColor: 'secondary.main' }}
            className="flex w-full justify-between items-center"
          >
            <Typography variant="h6" color="inherit">
              Detail Tagihan
            </Typography>
            <Typography title="ID Tagihan" variant="h6" color="inherit">
              #{saldoMutationReportsDetailData?.id}
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <section className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row items-center md:items-stretch gap-8">
              <Controller
                name="created_date"
                control={control}
                render={({ field: { value } }) => (
                  <ListItem className="p-0">
                    <ListItemText
                      primary="Tanggal"
                      secondary={
                        <Typography fontWeight={500} variant="body2" color="text.primary">
                          {value || '-'}
                        </Typography>
                      }
                    />
                  </ListItem>
                )}
              />
              <Controller
                name="status_name"
                control={control}
                render={({ field: { value } }) => (
                  <ListItem className="p-0">
                    <ListItemText
                      primary="Status Tagihan"
                      secondary={
                        <Typography
                          fontWeight={500}
                          variant="body2"
                          color={value === 'Belum Bayar' ? 'error' : 'green'}
                        >
                          {value || '-'}
                        </Typography>
                      }
                    />
                  </ListItem>
                )}
              />
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-stretch gap-8">
              <Controller
                name="user_name"
                control={control}
                render={({ field: { value } }) => (
                  <ListItem className="p-0">
                    <ListItemText
                      primary="User"
                      secondary={
                        <Typography fontWeight={500} variant="body2" color="text.primary">
                          {value || '-'}
                        </Typography>
                      }
                    />
                  </ListItem>
                )}
              />
              <Controller
                name="group_name"
                control={control}
                render={({ field: { value } }) => (
                  <ListItem className="p-0">
                    <ListItemText
                      primary="Grup"
                      secondary={
                        <Typography fontWeight={500} variant="body2" color="text.primary">
                          {value || '-'}
                        </Typography>
                      }
                    />
                  </ListItem>
                )}
              />
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-stretch gap-8">
              <Controller
                name="bayar_via"
                control={control}
                render={({ field: { value } }) => (
                  <ListItem className="p-0">
                    <ListItemText
                      primary="Pembayaran Via"
                      secondary={
                        <Typography fontWeight={500} variant="body2" color="text.primary">
                          {value || '-'}
                        </Typography>
                      }
                    />
                  </ListItem>
                )}
              />
              <Controller
                name="nominal"
                control={control}
                render={({ field: { value } }) => (
                  <ListItem className="p-0">
                    <ListItemText
                      primary="Nominal"
                      secondary={
                        <Typography fontWeight={500} variant="body2" color="text.primary">
                          {currencyFormat(value || 0)}
                        </Typography>
                      }
                    />
                  </ListItem>
                )}
              />
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-stretch gap-8">
              <Controller
                name="admin"
                control={control}
                render={({ field: { value } }) => (
                  <ListItem className="p-0">
                    <ListItemText
                      primary="Admin"
                      secondary={
                        <Typography fontWeight={500} variant="body2" color="text.primary">
                          {currencyFormat(value || 0)}
                        </Typography>
                      }
                    />
                  </ListItem>
                )}
              />
              <Controller
                name="denda"
                control={control}
                render={({ field: { value } }) => (
                  <ListItem className="p-0">
                    <ListItemText
                      primary="Denda"
                      secondary={
                        <Typography fontWeight={500} variant="body2" color="text.primary">
                          {currencyFormat(value || 0)}
                        </Typography>
                      }
                    />
                  </ListItem>
                )}
              />
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-stretch gap-8">
              <Controller
                name="periode"
                control={control}
                render={({ field: { value } }) => (
                  <ListItem className="p-0">
                    <ListItemText
                      primary="Periode"
                      secondary={
                        <Typography fontWeight={500} variant="body2" color="text.primary">
                          {value || '-'}
                        </Typography>
                      }
                    />
                  </ListItem>
                )}
              />
              <Controller
                name="tanggal_bayar"
                control={control}
                render={({ field: { value } }) => (
                  <ListItem className="p-0">
                    <ListItemText
                      primary="Tanggal Bayar"
                      secondary={
                        <Typography fontWeight={500} variant="body2" color="text.primary">
                          {value || '-'}
                        </Typography>
                      }
                    />
                  </ListItem>
                )}
              />
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-stretch gap-8">
              <Controller
                name="tanggal_tagihan"
                control={control}
                render={({ field: { value } }) => (
                  <ListItem className="p-0">
                    <ListItemText
                      primary="Tanggal Tagihan"
                      secondary={
                        <Typography fontWeight={500} variant="body2" color="text.primary">
                          {value || '-'}
                        </Typography>
                      }
                    />
                  </ListItem>
                )}
              />
              <Controller
                name="tanggal_tempo"
                control={control}
                render={({ field: { value } }) => (
                  <ListItem className="p-0">
                    <ListItemText
                      primary="Tanggal Tempo"
                      secondary={
                        <Typography fontWeight={500} variant="body2" color="text.primary">
                          {value || '-'}
                        </Typography>
                      }
                    />
                  </ListItem>
                )}
              />
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-stretch gap-8">
              <Controller
                name="keterangan"
                control={control}
                render={({ field: { value } }) => (
                  <ListItem className="p-0">
                    <ListItemText
                      primary="Keterangan"
                      secondary={
                        <Typography fontWeight={500} variant="body2" color="text.primary">
                          {value || '-'}
                        </Typography>
                      }
                    />
                  </ListItem>
                )}
              />
            </div>
            <div className="mt-8">
              <Box sx={{ width: '100%' }}>
                <Paper sx={{ width: '100%' }}>
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
                      Daftar Tagihan
                    </Typography>
                  </Toolbar>
                  <TableContainer>
                    <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
                      <EnhancedTableHead
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                      />
                      <TableBody>
                        {visibleRows?.length > 0 ? (
                          visibleRows.map((row, index) => {
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                              <StyledTableRow hover tabIndex={-1} key={row.detail_id}>
                                <TableCell component="th" id={labelId} scope="row">
                                  {row.nama || '-'}
                                </TableCell>
                                <TableCell align="left">
                                  Rp{currencyFormat(row.nominal || 0)}
                                </TableCell>
                              </StyledTableRow>
                            );
                          })
                        ) : (
                          <StyledTableRow hover>
                            <TableCell component="th" scope="row" align="center" colSpan={2}>
                              Data Tidak Tersedia
                            </TableCell>
                          </StyledTableRow>
                        )}
                        <StyledTableRow>
                          <TableCell component="th" colSpan={1} />
                          <TableCell align="left" colSpan={1}>
                            Rp
                            {currencyFormat(
                              saldoMutationReportsDetailData?.tagihan?.total_nominal || 0
                            )}
                          </TableCell>
                        </StyledTableRow>
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
            </div>
          </section>
        </DialogContent>
        <DialogActions className="py-8 px-24">
          <div className="flex justify-end items-center gap-12">
            <Button onClick={closeDialogHandler} aria-label="tutup">
              Tutup
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
}

DetailFormDialog.propTypes = {
  closeDialogHandler: PropTypes.func.isRequired,
  open: PropTypes.bool,
};

DetailFormDialog.defaultProps = {
  closeDialogHandler: () => {
    console.log('close dialog');
  },
  openDialog: false,
};

export default DetailFormDialog;
