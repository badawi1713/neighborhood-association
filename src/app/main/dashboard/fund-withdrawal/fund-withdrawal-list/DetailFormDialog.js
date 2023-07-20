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
import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { currencyFormat } from 'src/utils/utils';

function DetailFormDialog({ open, closeDialogHandler }) {
  const { fundWithdrawalDetailData } = useSelector((state) => state.fundWithdrawalReducer);

  const formData = useMemo(() => {
    return fundWithdrawalDetailData;
  }, [fundWithdrawalDetailData]);

  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: formData,
  });

  const { control } = formMethods;

  const convertStatus = useCallback(() => {
    const statusId = +fundWithdrawalDetailData?.status_id;
    switch (statusId) {
      case 0:
        return 'info.main';
      case 1:
        return 'succes.main';
      case 2:
        return 'error.main';
      default:
        return 'default';
    }
  }, [fundWithdrawalDetailData?.status_id]);

  return (
    <FormProvider {...formMethods}>
      <Dialog open={open} maxWidth="md" fullWidth>
        <AppBar position="static" elevation={1}>
          <Toolbar
            sx={{ backgroundColor: 'secondary.main' }}
            className="flex w-full justify-between items-center"
          >
            <Typography variant="h6" color="inherit">
              Detail Penarikan Dana
            </Typography>
            <Typography title="ID Penarikan Dana" variant="h6" color="inherit">
              #{fundWithdrawalDetailData?.id}
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
                        <Typography fontWeight={500} variant="body2" color={convertStatus()}>
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
                name="atas_nama"
                control={control}
                render={({ field: { value } }) => (
                  <ListItem className="p-0">
                    <ListItemText
                      primary="Atas Nama"
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
                name="transfer_date"
                control={control}
                render={({ field: { value } }) => (
                  <ListItem className="p-0">
                    <ListItemText
                      primary="Tanggal Transfer"
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
                name="nominal"
                control={control}
                render={({ field: { value } }) => (
                  <ListItem className="p-0">
                    <ListItemText
                      primary="Nominal"
                      secondary={
                        <Typography fontWeight={500} variant="body2" color="text.primary">
                          Rp{currencyFormat(value || 0)}
                        </Typography>
                      }
                    />
                  </ListItem>
                )}
              />
              <Controller
                name="no_rek"
                control={control}
                render={({ field: { value } }) => (
                  <ListItem className="p-0">
                    <ListItemText
                      primary="No. Rekening"
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
                name="bank_name"
                control={control}
                render={({ field: { value } }) => (
                  <ListItem className="p-0">
                    <ListItemText
                      primary="Bank"
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
                name="cabang"
                control={control}
                render={({ field: { value } }) => (
                  <ListItem className="p-0">
                    <ListItemText
                      primary="Cabang"
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
