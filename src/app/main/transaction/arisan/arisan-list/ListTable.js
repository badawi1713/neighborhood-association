import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

import FuseLoading from '@fuse/core/FuseLoading';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import withRouter from '@fuse/core/withRouter';
import { Button, Chip, IconButton, TableContainer, Tooltip } from '@mui/material';
import {
  changeTransactionArisanReducer,
  deleteTransactionArisan,
  getArisanTransactionMemberList,
  getArisanTransactionScheduleList,
  getTransactionArisan,
  getTransactionArisanById,
} from 'app/store/redux/actions/transaction-actions/transaction-arisan-actions';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmationDialog from 'app/theme-layouts/shared-components/ConfirmationDialog';
import { currencyFormat } from 'src/utils/utils';
import ListTableHead from './ListTableHead';
import EditFormDialog from './EditFormDialog';

function ListTable(props) {
  const isMounted = useRef(true);
  const dispatch = useDispatch();
  const {
    transactionArisanData,
    error,
    transactionArisanPage,
    transactionArisanLimit,
    transactionArisanTotal,
    loading,
    loadingDelete,
    loadingDialog,
  } = useSelector((state) => state.transactionArisanReducer);

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const [selectedId, setSelectedId] = useState('');

  const getGroupListData = useCallback(() => {
    dispatch(getTransactionArisan());
    dispatch(getArisanTransactionScheduleList());
    dispatch(getArisanTransactionMemberList());
  }, [dispatch]);

  useEffect(() => {
    if (isMounted.current) {
      getGroupListData();
      isMounted.current = false;
    }
  }, [getGroupListData]);

  async function handleChangePage(event, value) {
    await dispatch(
      changeTransactionArisanReducer({
        loading: true,
        transactionArisanPage: value,
      })
    );
    await dispatch(getTransactionArisan());
  }

  async function handleChangeRowsPerPage(event) {
    await dispatch(
      changeTransactionArisanReducer({
        loading: true,
        transactionArisanPage: 0,
        transactionArisanLimit: event.target.value,
      })
    );
    await dispatch(getTransactionArisan());
  }

  const convertStatus = (status = '') => {
    const statusText = status.toLowerCase();
    switch (statusText) {
      case 'belum bayar':
        return <Chip size="small" color="error" label={status} variant="filled" />;
      case 'sudah bayar':
        return <Chip size="small" color="success" label={status} variant="filled" />;
      default:
        return <Chip size="small" color="default" label="Tidak ada status" variant="filled" />;
    }
  };

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
        <Button
          className="mt-24"
          onClick={() => dispatch(getTransactionArisan())}
          variant="outlined"
          color="inherit"
        >
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

  if (transactionArisanData?.length === 0) {
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
          <ListTableHead />
          <TableBody>
            {transactionArisanData?.map((item, index) => {
              return (
                <TableRow className="h-72" hover tabIndex={-1} key={index}>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
                    {index + 1}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                    {item?.anggota_nama || '-'}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                    Rp{currencyFormat(item?.nominal || 0)}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
                    {convertStatus(item?.lunas || '-')}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                    {item?.keterangan || '-'}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                    {item?.pertemuan_lokasi || '-'}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
                    {item?.pertemuan_ke || '-'}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
                    {item?.tanggal_bayar || '-'}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                    {item?.updated_who || '-'}
                  </TableCell>
                  {false && (
                    <TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
                      <div className="flex justify-center gap-3 items-center">
                        <Tooltip arrow title="Edit">
                          <span>
                            <IconButton
                              onClick={async () => {
                                const response = await dispatch(getTransactionArisanById(item?.id));
                                if (response) {
                                  setOpenEditDialog(true);
                                }
                              }}
                              disabled={loadingDelete || loadingDialog}
                              color="default"
                            >
                              <FuseSvgIcon size={20}>heroicons-outline:pencil</FuseSvgIcon>
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip arrow title="Hapus">
                          <span>
                            <IconButton
                              onClick={() => {
                                setOpenDeleteConfirmation(true);
                                setSelectedId(item?.id);
                              }}
                              disabled={loadingDelete || loadingDialog}
                              color="error"
                            >
                              <FuseSvgIcon size={20}>heroicons-outline:trash</FuseSvgIcon>
                            </IconButton>
                          </span>
                        </Tooltip>
                      </div>
                    </TableCell>
                  )}
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
        count={transactionArisanTotal}
        rowsPerPage={transactionArisanLimit}
        page={transactionArisanPage}
        backIconButtonProps={{
          'aria-label': 'Halaman Sebelumnya',
        }}
        nextIconButtonProps={{
          'aria-label': 'Halaman Berikutnya',
        }}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {openEditDialog && (
        <EditFormDialog closeDialogHandler={() => setOpenEditDialog(false)} open={openEditDialog} />
      )}
      {openDeleteConfirmation && (
        <ConfirmationDialog
          open={openDeleteConfirmation}
          title="Hapus data?"
          type="error"
          content={`Konfirmasi untuk melakukan hapus data dengan ID: ${selectedId}`}
          loading={loadingDelete}
          confirmActionText="Hapus"
          loadingText="Menunggu..."
          cancelActionHandler={() => setOpenDeleteConfirmation(false)}
          confirmActionHandler={async () => {
            const response = await dispatch(deleteTransactionArisan(selectedId));
            if (response) {
              setOpenDeleteConfirmation(false);
              dispatch(getTransactionArisan());
            }
          }}
        />
      )}
    </div>
  );
}

export default withRouter(ListTable);
