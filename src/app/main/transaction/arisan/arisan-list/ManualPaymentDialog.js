import { yupResolver } from '@hookform/resolvers/yup';
import {
  AppBar,
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  getTransactionArisan,
  handleArisanManualPayment,
} from 'app/store/redux/actions/transaction-actions/transaction-arisan-actions';
import ConfirmationDialog from 'app/theme-layouts/shared-components/ConfirmationDialog';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';

const schema = yup.object().shape({
  anggota_id: yup
    .object()
    .nullable()
    .typeError('Diharuskan untuk memilih anggota arisan')
    .required('Diharuskan untuk memilih anggota arisan'),
  // .required('Diharuskan untuk mengisi jumlah dapat 1'),
  pertemuan_id: yup
    .object()
    .nullable()
    .typeError('Diharuskan untuk memilih pertemuan arisan')
    .required('Diharuskan untuk memilih pertemuan arisan'),
});

function ManualPaymentDialog({ open, closeDialogHandler }) {
  const dispatch = useDispatch();
  const { loadingPost, loadingList, transactionArisanMemberList, transactionArisanScheduleList } =
    useSelector((state) => state.transactionArisanReducer);

  const [openConfirmation, setOpenConfirmation] = useState(false);

  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: {
      anggota_id: null,
      pertemuan_id: null,
      keterangan: '',
    },
    resolver: yupResolver(schema),
  });

  const { control, formState, handleSubmit } = formMethods;
  const { errors } = formState;

  const handleSave = handleSubmit(async (data) => {
    const payload = {
      pertemuan_id: data?.pertemuan_id?.id,
      anggota_id: data?.anggota_id?.id,
      keterangan: data?.keterangan || '',
    };

    const response = await dispatch(handleArisanManualPayment(payload));
    if (response) {
      closeDialogHandler();
      await dispatch(getTransactionArisan());
    }
  });

  const handleConfirmation = handleSubmit(() => {
    setOpenConfirmation(true);
  });

  const selectedMember = useWatch({ control, name: 'anggota_id' });

  return (
    <FormProvider {...formMethods}>
      <Dialog open={open} maxWidth="md" fullWidth>
        <AppBar position="static" elevation={1}>
          <Toolbar sx={{ backgroundColor: 'secondary.main' }} className="flex w-full">
            <Typography variant="h6" color="inherit">
              Tagihan Manual
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <section className="flex flex-col gap-16">
            <div className="flex flex-col md:flex-row items-center gap-16 md:items-stretch">
              <Controller
                name="anggota_id"
                control={control}
                render={({ field: { onChange, ...field } }) => (
                  <Autocomplete
                    {...field}
                    onChange={(e, newValue) => onChange(newValue)}
                    fullWidth
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    getOptionLabel={(option) => option.name}
                    options={transactionArisanMemberList || []}
                    loading={loadingList}
                    loadingText="Memuat data"
                    noOptionsText="Tidak ada daftar anggota"
                    value={field?.value || null}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={!!errors.anggota_id}
                        label=":: Anggota Arisan"
                        id="anggota_id"
                        variant="outlined"
                        helperText={errors?.anggota_id?.message}
                        placeholder="Pilih anggota arisan"
                      />
                    )}
                  />
                )}
              />
              <Controller
                name="pertemuan_id"
                control={control}
                render={({ field: { onChange, ...field } }) => (
                  <Autocomplete
                    {...field}
                    onChange={(e, newValue) => onChange(newValue)}
                    fullWidth
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    getOptionLabel={(option) => option.pertemuan_ke}
                    options={transactionArisanScheduleList || []}
                    loading={loadingList}
                    loadingText="Memuat data"
                    noOptionsText="Tidak ada daftar jadwal pertemuan"
                    value={field?.value || null}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={!!errors.pertemuan_id}
                        label=":: Jadwal Pertemuan"
                        id="pertemuan_id"
                        variant="outlined"
                        helperText={errors?.pertemuan_id?.message}
                        placeholder="Pilih jadwal pertemuan"
                      />
                    )}
                  />
                )}
              />
            </div>
            <div className="flex flex-col md:flex-row items-center gap-16 md:items-stretch">
              <Controller
                name="keterangan"
                control={control}
                render={({ field: { onChange, ...field } }) => (
                  <TextField
                    {...field}
                    onChange={(e) => {
                      onChange(e);
                    }}
                    error={!!errors.keterangan}
                    label="Keterangan (Opsional)"
                    id="keterangan"
                    variant="outlined"
                    fullWidth
                    helperText={errors?.keterangan?.message}
                    placeholder="Masukkan keterangan"
                    multiline
                    rows={3}
                  />
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
            <Button
              onClick={() => handleConfirmation()}
              variant="contained"
              color="success"
              type="submit"
              aria-label="proses"
              disabled={loadingPost}
            >
              Proses
            </Button>
          </div>
        </DialogActions>
      </Dialog>
      {openConfirmation && (
        <ConfirmationDialog
          open={openConfirmation}
          title="Proses tagihan manual?"
          type="error"
          content={`Konfirmasi untuk memproses tagihan manual arisan ${selectedMember?.name}`}
          loading={loadingPost}
          confirmActionText="Konfirmasi"
          loadingText="Memproses..."
          cancelActionHandler={() => setOpenConfirmation(false)}
          confirmActionHandler={handleSave}
        />
      )}
    </FormProvider>
  );
}

ManualPaymentDialog.propTypes = {
  closeDialogHandler: PropTypes.func.isRequired,
  open: PropTypes.bool,
};

ManualPaymentDialog.defaultProps = {
  closeDialogHandler: () => {
    console.log('close dialog');
  },
  openDialog: false,
};

export default ManualPaymentDialog;
