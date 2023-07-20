import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef } from 'react';

import FuseLoading from '@fuse/core/FuseLoading';
import withRouter from '@fuse/core/withRouter';
import { Button, TableContainer } from '@mui/material';
import {
  changeSaldoMutationReportsReducer,
  getSaldoMutationReports,
  getSaldoMutationReportsGroupList,
} from 'app/store/redux/actions/dashboard-actions/reports-actions/saldo-mutation-reports-action';
import { useDispatch, useSelector } from 'react-redux';
import { currencyFormat } from 'src/utils/utils';
import moment from 'moment';
import { getProfileSaldo } from 'app/store/redux/actions/settings-actions/profile-settings-actions';
import SaldoMutationListTableHead from './SaldoMutationListTableHead';

function SaldoMutationListTable(props) {
  const isMounted = useRef(true);
  const dispatch = useDispatch();
  const {
    saldoMutationReportsData,
    error,
    saldoMutationReportsPage,
    saldoMutationReportsLimit,
    saldoMutationReportsTotal,
    loading,
  } = useSelector((state) => state.saldoMutationReportsReducer);

  const getSaldoMutationListData = useCallback(() => {
    dispatch(getProfileSaldo());
    dispatch(getSaldoMutationReports());
    dispatch(getSaldoMutationReportsGroupList());
  }, [dispatch]);

  useEffect(() => {
    if (isMounted.current) {
      getSaldoMutationListData();
      isMounted.current = false;
    }
  }, [getSaldoMutationListData]);

  async function handleChangePage(event, value) {
    await dispatch(
      changeSaldoMutationReportsReducer({
        loading: true,
        saldoMutationReportsPage: value,
      })
    );
    await dispatch(getSaldoMutationReports());
  }

  async function handleChangeRowsPerPage(event) {
    await dispatch(
      changeSaldoMutationReportsReducer({
        loading: true,
        saldoMutationReportsPage: 0,
        saldoMutationReportsLimit: event.target.value,
      })
    );
    await dispatch(getSaldoMutationReports());
  }

  async function handleRetry() {
    await dispatch(
      changeSaldoMutationReportsReducer({
        saldoMutationReportsFilterFormData: {
          periode: moment().format('YYYY-MM'),
          status: '-1',
          groupId: '',
          memberId: '',
        },
        saldoMutationReportsSortBy: 'id',
        saldoMutationReportsSortType: 'desc',
        saldoMutationReportsPage: 0,
        saldoMutationReportsLimit: 10,
        saldoMutationReportsTotal: 0,
        saldoMutationReportsId: 0,
      })
    );
    await dispatch(getSaldoMutationReports());
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="error" textAlign="center" variant="h5">
          {error}
        </Typography>
        <Button className="mt-24" onClick={handleRetry} variant="outlined" color="inherit">
          Coba lagi
        </Button>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-24 px-10">
        <FuseLoading />
      </div>
    );
  }

  if (saldoMutationReportsData?.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-1 items-center justify-center h-full text-center py-24 px-10"
      >
        <Typography color="text.secondary" variant="h5">
          Tidak ada data yang tersedia!
        </Typography>
      </motion.div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-full">
      <TableContainer className="grow overflow-x-auto">
        <Table stickyHeader className="min-w-xl whitespace-nowrap" aria-labelledby="tableTitle">
          <SaldoMutationListTableHead />
          <TableBody>
            {saldoMutationReportsData?.map((item, index) => {
              return (
                <TableRow className="h-72" hover tabIndex={-1} key={index}>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
                    {item?.tanggal || '-'}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
                    {item?.reff_id || '-'}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                    {item?.keterangan || '-'}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                    Rp{currencyFormat(item?.kredit || 0)}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                    Rp{currencyFormat(item?.debit || 0)}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                    Rp{currencyFormat(item?.saldo || 0)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        showLastButton
        showFirstButton
        labelDisplayedRows={function defaultLabelDisplayedRows({ from, count, to }) {
          return `${from}–${to} dari ${count !== -1 ? count : `lebih dari ${to}`}`;
        }}
        labelRowsPerPage="Baris per halaman:"
        className="shrink-0 border-t-1"
        component="div"
        count={saldoMutationReportsTotal}
        rowsPerPage={saldoMutationReportsLimit}
        page={saldoMutationReportsPage}
        backIconButtonProps={{
          'aria-label': 'Halaman Sebelumnya',
        }}
        nextIconButtonProps={{
          'aria-label': 'Halaman Berikutnya',
        }}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}

export default withRouter(SaldoMutationListTable);
