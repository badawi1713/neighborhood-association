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
import {
  Button,
  FormControlLabel,
  IconButton,
  Switch,
  TableContainer,
  Tooltip,
} from '@mui/material';
import {
  changeBillTemplateReducer,
  deleteBillTemplate,
  getBillTemplate,
  getBillTemplateById,
  getBillTemplateByProduct,
  getBillTemplateByUser,
  getBillTemplateGroupList,
  getBillTemplateProductList,
  getBillTemplateUserList,
  payBillTemplate,
  updateBillTemplateStatus,
} from 'app/store/redux/actions/dashboard-actions/bills-products-actions/bill-template-action';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmationDialog from 'app/theme-layouts/shared-components/ConfirmationDialog';
import { currencyFormat } from 'src/utils/utils';
import BillTemplateListTableHead from './BillTemplateListTableHead';
import EditFormDialog from './EditFormDialog';
import BillTemplateUserListDialog from './BillTemplateUserListDialog';
import BillTemplateProductListDialog from './BillTemplateProductListDialog';

function BillTemplateListTable(props) {
  const isMounted = useRef(true);
  const dispatch = useDispatch();
  const {
    billTemplateData,
    error,
    billTemplatePage,
    billTemplateLimit,
    billTemplateTotal,
    loading,
    loadingDelete,
    loadingDialog,
    loadingPost,
  } = useSelector((state) => state.billTemplateReducer);

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openUserListDialog, setOpenUserListDialog] = useState(false);
  const [openProductListDialog, setOpenProductListDialog] = useState(false);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const [openBillPayConfirmation, setOpenBillPayConfirmation] = useState(false);
  const [selectedId, setSelectedId] = useState('');

  const getBillTemplateListData = useCallback(() => {
    dispatch(getBillTemplate());
    const userList = dispatch(getBillTemplateUserList());
    const groupList = dispatch(getBillTemplateGroupList());
    const productList = dispatch(getBillTemplateProductList());
    const initiateList = [userList, groupList, productList];
    Promise.all(initiateList).then(() => {
      dispatch(
        changeBillTemplateReducer({
          loadingList: false,
        })
      );
    });
  }, [dispatch]);

  useEffect(() => {
    if (isMounted.current) {
      getBillTemplateListData();
      isMounted.current = false;
    }
  }, [getBillTemplateListData]);

  async function handleChangePage(event, value) {
    await dispatch(
      changeBillTemplateReducer({
        loading: true,
        billTemplatePage: value,
      })
    );
    await dispatch(getBillTemplate());
  }

  async function handleChangeRowsPerPage(event) {
    await dispatch(
      changeBillTemplateReducer({
        loading: true,
        billTemplatePage: 0,
        billTemplateLimit: event.target.value,
      })
    );
    await dispatch(getBillTemplate());
  }

  const handleUpdateStatus = async (status, id) => {
    const statusId = status ? 1 : 0;
    const response = await dispatch(updateBillTemplateStatus(statusId, id));
    if (response) {
      dispatch(getBillTemplate());
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
          onClick={() => dispatch(getBillTemplate())}
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

  if (billTemplateData?.length === 0) {
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
          <BillTemplateListTableHead />
          <TableBody>
            {billTemplateData?.map((item, index) => {
              return (
                <TableRow className="h-72" hover tabIndex={-1} key={index}>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
                    {index + 1}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                    {item?.group_name || '-'}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                    Rp{currencyFormat(item?.admin || 0)}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                    Rp{currencyFormat(item?.denda || 0)}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
                    <Tooltip
                      title={loadingPost ? 'Memproses' : item?.status_id ? 'Aktif' : 'Tidak Aktif'}
                    >
                      <FormControlLabel
                        className="mx-auto"
                        control={
                          <Switch
                            size="small"
                            checked={
                              item?.status_id === 1
                                ? true
                                : item?.status_id === 0
                                ? false
                                : item?.status_id
                            }
                            onChange={(e) => {
                              handleUpdateStatus(e.target.checked, item?.id);
                            }}
                            name="status_id"
                            disabled={loadingDelete || loadingDialog || loadingPost || loading}
                          />
                        }
                      />
                    </Tooltip>
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
                    {item?.type_name || '-'}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
                    {item?.tanggal_tagihan || '-'}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
                    {item?.tanggal_tempo || '-'}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
                    {item?.until_periode || '-'}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                    {item?.keterangan || '-'}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
                    {item?.created_date || '-'}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
                    {item?.last_updated || '-'}
                  </TableCell>

                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
                    <div className="flex justify-center gap-3 items-center">
                      <Button
                        onClick={() => {
                          setOpenBillPayConfirmation(true);
                          setSelectedId(item?.id);
                        }}
                        disabled={loadingDelete || loadingDialog || loadingPost}
                        color="success"
                        variant="contained"
                        size="small"
                      >
                        Tagihkan
                      </Button>
                      <Tooltip arrow title="Edit">
                        <span>
                          <IconButton
                            onClick={async () => {
                              const response = await dispatch(getBillTemplateById(item?.id));
                              if (response) {
                                setOpenEditDialog(true);
                              }
                            }}
                            disabled={loadingDelete || loadingDialog || loadingPost}
                            color="default"
                          >
                            <FuseSvgIcon size={20}>heroicons-outline:pencil</FuseSvgIcon>
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip arrow title="User">
                        <span>
                          <IconButton
                            onClick={async () => {
                              const response = await dispatch(getBillTemplateByUser(item?.id));
                              if (response) {
                                setOpenUserListDialog(true);
                              }
                            }}
                            disabled={loadingDelete || loadingDialog || loadingPost}
                            color="info"
                          >
                            <FuseSvgIcon size={20}>heroicons-outline:user</FuseSvgIcon>
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip arrow title="Produk">
                        <span>
                          <IconButton
                            onClick={async () => {
                              const response = await dispatch(getBillTemplateByProduct(item?.id));
                              if (response) {
                                setOpenProductListDialog(true);
                              }
                            }}
                            disabled={loadingDelete || loadingDialog || loadingPost}
                            color="info"
                          >
                            <FuseSvgIcon size={20}>heroicons-outline:shopping-bag</FuseSvgIcon>
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
        count={billTemplateTotal}
        rowsPerPage={billTemplateLimit}
        page={billTemplatePage}
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
      {openUserListDialog && (
        <BillTemplateUserListDialog
          closeDialogHandler={() => setOpenUserListDialog(false)}
          open={openUserListDialog}
        />
      )}
      {openProductListDialog && (
        <BillTemplateProductListDialog
          closeDialogHandler={() => setOpenProductListDialog(false)}
          open={openProductListDialog}
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
            const response = await dispatch(deleteBillTemplate(selectedId));
            if (response) {
              setOpenDeleteConfirmation(false);
              dispatch(getBillTemplate());
            }
          }}
        />
      )}
      {openBillPayConfirmation && (
        <ConfirmationDialog
          open={openBillPayConfirmation}
          title="Tagihkan tagihan?"
          type="secondary"
          content={`Konfirmasi untuk menagih tagihan dengan ID: ${selectedId}`}
          loading={loadingPost}
          confirmActionText="Konfirmasi"
          loadingText="Menunggu..."
          cancelActionHandler={() => setOpenBillPayConfirmation(false)}
          confirmActionHandler={async () => {
            const response = await dispatch(payBillTemplate(selectedId));
            if (response) {
              setOpenBillPayConfirmation(false);
              dispatch(getBillTemplate());
            }
          }}
        />
      )}
    </div>
  );
}

export default withRouter(BillTemplateListTable);
