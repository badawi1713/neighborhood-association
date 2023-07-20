import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Button, IconButton, Tooltip } from '@mui/material';
import Input from '@mui/material/Input';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import {
  changeUserManagementGroupReducer,
  getUserManagementGroup,
} from 'app/store/redux/actions/dashboard-actions/user-management-actions/user-management-group-action';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GroupListFilterDialog from './GroupListFilterDialog';
import NewFormDialog from './NewFormDialog';

function GroupListHeader() {
  const { userManagementGroupNameSearch, userManagementGroupFilterFormData } = useSelector(
    (state) => state.userManagementGroupReducer
  );
  const { filterDate, paymentType } = userManagementGroupFilterFormData;
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [openFormDialog, setOpenFormDialog] = useState(false);

  const dispatch = useDispatch();

  const handleSearchData = async (e) => {
    e.preventDefault();
    await dispatch(
      changeUserManagementGroupReducer({
        userManagementGroupPage: 0,
      })
    );
    await dispatch(getUserManagementGroup());
  };

  const handleSearchReset = async (e) => {
    e.preventDefault();
    await dispatch(
      changeUserManagementGroupReducer({
        userManagementGroupPage: 0,
        userManagementGroupNameSearch: '',
      })
    );
    await dispatch(getUserManagementGroup());
  };

  const convertPaymentTypeText = (paymentTypeId) => {
    switch (paymentTypeId) {
      case 0:
        return 'Semua';
      case 1:
        return 'Umum';
      case 2:
        return 'BPJS';
      default:
        return '';
    }
  };

  return (
    <section className="flex flex-col gap-16 flex-1 w-full py-32 px-24 md:px-32">
      <div className="flex flex-col md:flex-row md:items-center flex-1 gap-16">
        <Typography
          component={motion.span}
          initial={{ x: -20 }}
          animate={{ x: 0, transition: { delay: 0.2 } }}
          delay={300}
          className="text-24 md:text-32 font-extrabold tracking-tight"
        >
          Grup User
        </Typography>

        <div className="flex flex-col w-full flex-1 md:w-auto md:ml-auto md:flex-row md:items-center gap-16 justify-end">
          <Paper
            component={motion.div}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
            className="flex items-center w-full md:max-w-256 space-x-8 px-16 rounded-full border-1 shadow-0"
          >
            <FuseSvgIcon color="disabled">heroicons-solid:search</FuseSvgIcon>

            <form onSubmit={handleSearchData} className="w-full">
              <Input
                placeholder="Pencarian..."
                className="flex flex-1"
                disableUnderline
                fullWidth
                value={userManagementGroupNameSearch}
                inputProps={{
                  'aria-label': 'Search',
                }}
                onChange={(ev) =>
                  dispatch(
                    changeUserManagementGroupReducer({
                      userManagementGroupNameSearch: ev.target.value,
                    })
                  )
                }
                endAdornment={
                  userManagementGroupNameSearch && (
                    <Tooltip title="Hapus">
                      <IconButton onClick={handleSearchReset} size="small">
                        <FuseSvgIcon size={18} color="error">
                          heroicons-outline:x
                        </FuseSvgIcon>
                      </IconButton>
                    </Tooltip>
                  )
                }
              />
            </form>
          </Paper>
          {false && (
            <Button
              onClick={() => setOpenFilterDialog(true)}
              variant="contained"
              color="secondary"
              startIcon={<FuseSvgIcon>heroicons-outline:filter</FuseSvgIcon>}
            >
              {filterDate
                ? `${filterDate} (${convertPaymentTypeText(+paymentType || 0)})`
                : 'Filter'}
            </Button>
          )}
          <Button
            onClick={() => {
              setOpenFormDialog(true);
            }}
            variant="contained"
            color="primary"
            startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
          >
            Tambah
          </Button>
        </div>
      </div>
      {openFilterDialog && (
        <GroupListFilterDialog
          open={openFilterDialog}
          closeDialogHandler={() => setOpenFilterDialog(false)}
        />
      )}
      {openFormDialog && (
        <NewFormDialog open={openFormDialog} closeDialogHandler={() => setOpenFormDialog(false)} />
      )}
    </section>
  );
}

export default GroupListHeader;
