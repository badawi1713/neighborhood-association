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
  changeFundWithdrawalReducer,
  deleteFundWithdrawal,
  getFundWithdrawal,
  getFundWithdrawalById,
} from 'app/store/redux/actions/dashboard-actions/fund-withdrawal-actions';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmationDialog from 'app/theme-layouts/shared-components/ConfirmationDialog';
import { currencyFormat } from 'src/utils/utils';
import FundWithdrawaListTableHead from './FundWithdrawaListTableHead';
import DetailFormDialog from './DetailFormDialog';

function FundWithdrawaListTable(props) {
  const isMounted = useRef(true);
  const dispatch = useDispatch();
  const {
    fundWithdrawalData,
    error,
    fundWithdrawalPage,
    fundWithdrawalLimit,
    fundWithdrawalTotal,
    loading,
    loadingDelete,
    loadingDialog,
  } = useSelector((state) => state.fundWithdrawalReducer);

  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const [selectedId, setSelectedId] = useState('');

  const getFundWithdrawaListData = useCallback(() => {
    dispatch(getFundWithdrawal());
  }, [dispatch]);

  useEffect(() => {
    if (isMounted.current) {
      getFundWithdrawaListData();
      isMounted.current = false;
    }
  }, [getFundWithdrawaListData]);

  async function handleChangePage(event, value) {
    await dispatch(
      changeFundWithdrawalReducer({
        loading: true,
        fundWithdrawalPage: value,
      })
    );
    await dispatch(getFundWithdrawal());
  }

  async function handleChangeRowsPerPage(event) {
    await dispatch(
      changeFundWithdrawalReducer({
        loading: true,
        fundWithdrawalPage: 0,
        fundWithdrawalLimit: event.target.value,
      })
    );
    await dispatch(getFundWithdrawal());
  }

  const convertStatus = useCallback((id, label) => {
    const statusId = +id;
    switch (statusId) {
      case 0:
        return <Chip size="small" color="info" label={label} />;
      case 1:
        return <Chip size="small" color="success" label={label} />;
      case 2:
        return <Chip size="small" color="error" label={label} />;
      default:
        return <Chip size="small" color="default" label={label} />;
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
        <Button
          className="mt-24"
          onClick={() => dispatch(getFundWithdrawal())}
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

  if (fundWithdrawalData?.length === 0) {
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
          <FundWithdrawaListTableHead />
          <TableBody>
            {fundWithdrawalData?.map((item, index) => {
              return (
                <TableRow className="h-72" hover tabIndex={-1} key={index}>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
                    {item?.id}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
                    {item?.created_date || '-'}
                  </TableCell>

                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                    Rp{currencyFormat(item?.nominal || 0)}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                    {item?.no_rek || '-'}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                    {item?.bank_name || '-'}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                    {item?.atas_nama || '-'}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
                    {convertStatus(item?.status_id, item?.status_name)}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
                    <div className="flex justify-center gap-3 items-center">
                      <Tooltip arrow title="Detail">
                        <span>
                          <IconButton
                            onClick={async () => {
                              const response = await dispatch(getFundWithdrawalById(item?.id));
                              if (response) {
                                setOpenDetailDialog(true);
                              }
                            }}
                            disabled={loadingDelete || loadingDialog}
                            color="info"
                          >
                            <FuseSvgIcon size={20}>
                              heroicons-outline:information-circle
                            </FuseSvgIcon>
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
        count={fundWithdrawalTotal}
        rowsPerPage={fundWithdrawalLimit}
        page={fundWithdrawalPage}
        backIconButtonProps={{
          'aria-label': 'Halaman Sebelumnya',
        }}
        nextIconButtonProps={{
          'aria-label': 'Halaman Berikutnya',
        }}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

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
            const response = await dispatch(deleteFundWithdrawal(selectedId));
            if (response) {
              setOpenDeleteConfirmation(false);
              dispatch(getFundWithdrawal());
            }
          }}
        />
      )}

      {openDetailDialog && (
        <DetailFormDialog
          closeDialogHandler={() => setOpenDetailDialog(false)}
          open={openDetailDialog}
        />
      )}
    </div>
  );
}

export default withRouter(FundWithdrawaListTable);
