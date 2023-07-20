import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

import FuseLoading from '@fuse/core/FuseLoading';
import withRouter from '@fuse/core/withRouter';
import { Button, Chip, IconButton, TableContainer, Tooltip } from '@mui/material';
import {
  changeBillReducer,
  deleteBill,
  getBill,
  getBillById,
  getBillGroupList,
  reminderBill,
} from 'app/store/redux/actions/dashboard-actions/bills-products-actions/bill-action';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmationDialog from 'app/theme-layouts/shared-components/ConfirmationDialog';
import { currencyFormat } from 'src/utils/utils';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon/FuseSvgIcon';
import moment from 'moment';
import BillListTableHead from './BillListTableHead';
import DetailFormDialog from './DetailFormDialog';
import BillSuccessDialog from './BillSuccessDialog';

function BillListTable(props) {
  const isMounted = useRef(true);
  const dispatch = useDispatch();
  const {
    billData,
    error,
    billPage,
    billLimit,
    billTotal,
    loading,
    loadingDelete,
    loadingDialog,
    loadingPost,
  } = useSelector((state) => state.billReducer);

  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const [openReminderConfirmation, setOpenReminderConfirmation] = useState(false);
  const [selectedId, setSelectedId] = useState('');

  const getBillListData = useCallback(() => {
    dispatch(getBill());
    const groupList = dispatch(getBillGroupList());
    const initiateList = [groupList];
    Promise.all(initiateList).then(() => {
      dispatch(
        changeBillReducer({
          loadingList: false,
        })
      );
    });
  }, [dispatch]);

  useEffect(() => {
    if (isMounted.current) {
      getBillListData();
      isMounted.current = false;
    }
  }, [getBillListData]);

  async function handleChangePage(event, value) {
    await dispatch(
      changeBillReducer({
        loading: true,
        billPage: value,
      })
    );
    await dispatch(getBill());
  }

  async function handleChangeRowsPerPage(event) {
    await dispatch(
      changeBillReducer({
        loading: true,
        billPage: 0,
        billLimit: event.target.value,
      })
    );
    await dispatch(getBill());
  }

  async function handleRetry() {
    await dispatch(
      changeBillReducer({
        billFilterFormData: {
          periode: moment().format('YYYY-MM'),
          status: '-1',
          groupId: '',
          memberId: '',
        },
        billSortBy: 'id',
        billSortType: 'desc',
        billPage: 0,
        billLimit: 10,
        billTotal: 0,
        billId: 0,
      })
    );
    await dispatch(getBill());
  }

  const convertStatus = useCallback((status) => {
    const statusText = `${status}`.toLowerCase();
    switch (statusText) {
      case 'sudah bayar':
        return <Chip size="small" color="success" label={status} />;
      case 'belum bayar':
        return <Chip size="small" color="error" label={status} />;
      default:
        return <Chip size="small" color="default" label={status} />;
    }
  }, []);

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

  if (billData?.length === 0) {
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
          <BillListTableHead />
          <TableBody>
            {billData?.map((item, index) => {
              return (
                <TableRow className="h-72" hover tabIndex={-1} key={index}>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
                    {item?.id}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                    {item?.group_name || '-'}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                    {item?.user_id || '-'}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                    {item?.user_name || '-'}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                    Rp{currencyFormat(item?.nominal || 0)}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
                    {convertStatus(item?.status_name || 'Tidak Ada Status')}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                    {item?.keterangan || '-'}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
                    <div className="flex justify-center gap-3 items-center">
                      <Tooltip arrow title="Detail">
                        <span>
                          <IconButton
                            onClick={async () => {
                              const response = await dispatch(getBillById(item?.id));
                              if (response) {
                                setOpenDetailDialog(true);
                              }
                            }}
                            disabled={loadingDelete || loadingDialog || loadingPost}
                            color="info"
                          >
                            <FuseSvgIcon size={20}>
                              heroicons-outline:information-circle
                            </FuseSvgIcon>
                          </IconButton>
                        </span>
                      </Tooltip>

                      <Tooltip arrow title="Reminder">
                        <span>
                          <IconButton
                            onClick={() => {
                              setOpenReminderConfirmation(true);
                              setSelectedId(item?.id);
                            }}
                            disabled={loadingDelete || loadingDialog || loadingPost}
                            color="warning"
                          >
                            <FuseSvgIcon size={20}>heroicons-outline:paper-airplane</FuseSvgIcon>
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip arrow title="Sukses Manual">
                        <span>
                          <IconButton
                            onClick={async () => {
                              const response = await dispatch(getBillById(item?.id));
                              if (response) {
                                setOpenSuccessDialog(true);
                              }
                            }}
                            disabled={loadingDelete || loadingDialog || loadingPost}
                            color="success"
                          >
                            <FuseSvgIcon size={20}>heroicons-outline:check-circle</FuseSvgIcon>
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
                            disabled={loadingDelete || loadingDialog || loadingPost}
                            color="error"
                          >
                            <FuseSvgIcon size={20}>heroicons-outline:trash</FuseSvgIcon>
                          </IconButton>
                        </span>
                      </Tooltip>
                    </div>
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
        count={billTotal}
        rowsPerPage={billLimit}
        page={billPage}
        backIconButtonProps={{
          'aria-label': 'Halaman Sebelumnya',
        }}
        nextIconButtonProps={{
          'aria-label': 'Halaman Berikutnya',
        }}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {openDetailDialog && (
        <DetailFormDialog
          closeDialogHandler={() => setOpenDetailDialog(false)}
          open={openDetailDialog}
        />
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
            const response = await dispatch(deleteBill(selectedId));
            if (response) {
              setOpenDeleteConfirmation(false);
              dispatch(getBill());
            }
          }}
        />
      )}
      {openReminderConfirmation && (
        <ConfirmationDialog
          open={openReminderConfirmation}
          title="Reminder tagihan?"
          type="error"
          content={`Konfirmasi untuk melakukan reminder tagihan dengan ID: ${selectedId}`}
          loading={loadingPost}
          confirmActionText="Konfirmasi"
          loadingText="Menunggu..."
          cancelActionHandler={() => setOpenReminderConfirmation(false)}
          confirmActionHandler={async () => {
            const response = await dispatch(reminderBill(selectedId));
            if (response) {
              setOpenReminderConfirmation(false);
              dispatch(getBill());
            }
          }}
        />
      )}
      {openSuccessDialog && (
        <BillSuccessDialog
          open={openSuccessDialog}
          closeDialogHandler={() => setOpenSuccessDialog(false)}
        />
      )}
    </div>
  );
}

export default withRouter(BillListTable);
