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
  changeUserManagementUserReducer,
  deleteUserManagementUser,
  getUserManagementUser,
  getUserManagementUserById,
} from 'app/store/redux/actions/dashboard-actions/user-management-actions/user-management-user-action';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmationDialog from 'app/theme-layouts/shared-components/ConfirmationDialog';
import UserListTableHead from './UserListTableHead';
import EditFormDialog from './EditFormDialog';

function UserListTable(props) {
  const isMounted = useRef(true);
  const dispatch = useDispatch();
  const {
    userManagementUserData,
    error,
    userManagementUserPage,
    userManagementUserLimit,
    userManagementUserTotal,
    loading,
    loadingDelete,
    loadingDialog,
  } = useSelector((state) => state.userManagementUserReducer);

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const [selectedId, setSelectedId] = useState('');

  const getUserListData = useCallback(() => {
    dispatch(getUserManagementUser());
  }, [dispatch]);

  useEffect(() => {
    if (isMounted.current) {
      getUserListData();
      isMounted.current = false;
    }
  }, [getUserListData]);

  async function handleChangePage(event, value) {
    await dispatch(
      changeUserManagementUserReducer({
        loading: true,
        userManagementUserPage: value,
      })
    );
    await dispatch(getUserManagementUser());
  }

  async function handleChangeRowsPerPage(event) {
    await dispatch(
      changeUserManagementUserReducer({
        loading: true,
        userManagementUserPage: 0,
        userManagementUserLimit: event.target.value,
      })
    );
    await dispatch(getUserManagementUser());
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
        <Button
          className="mt-24"
          onClick={() => dispatch(getUserManagementUser())}
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

  if (userManagementUserData?.length === 0) {
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

  const convertStatus = (status) => {
    const statusText = `${status}`.toLowerCase();
    switch (statusText) {
      case 'active':
        return <Chip size="small" color="success" label={status} />;
      case 'hapus':
        return <Chip size="small" color="error" label={status} />;
      default:
        return <Chip size="small" color="default" label={status} />;
    }
  };

  return (
    <div className="w-full flex flex-col min-h-full">
      <TableContainer className="grow overflow-x-auto">
        <Table stickyHeader className="min-w-xl whitespace-nowrap" aria-labelledby="tableTitle">
          <UserListTableHead />
          <TableBody>
            {userManagementUserData?.map((item, index) => {
              return (
                <TableRow className="h-72" hover tabIndex={-1} key={index}>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
                    {index + 1}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                    {item?.name || '-'}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                    {item?.email || '-'}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                    {item?.no_telp || '-'}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                    {item?.type || '-'}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                    {item?.instansi_name || '-'}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
                    {convertStatus(item?.status || 'Tidak Ada Status')}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
                    {item?.created_date || '-'}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
                    {item?.last_updated || '-'}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                    {item?.keterangan || '-'}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
                    <div className="flex justify-center gap-3 items-center">
                      <Tooltip arrow title="Edit">
                        <span>
                          <IconButton
                            onClick={async () => {
                              const response = await dispatch(getUserManagementUserById(item?.id));
                              if (response) {
                                setOpenEditDialog(true);
                              }
                            }}
                            disabled={loadingDelete || loadingDialog || item?.status === 'Hapus'}
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
                            disabled={loadingDelete || loadingDialog || item?.status === 'Hapus'}
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
        count={userManagementUserTotal}
        rowsPerPage={userManagementUserLimit}
        page={userManagementUserPage}
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
          const response = await dispatch(deleteUserManagementUser(selectedId));
          if (response) {
            setOpenDeleteConfirmation(false);
            dispatch(getUserManagementUser());
          }
        }}
      />
    </div>
  );
}

export default withRouter(UserListTable);
