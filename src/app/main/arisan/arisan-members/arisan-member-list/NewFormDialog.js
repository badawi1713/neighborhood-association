import { yupResolver } from '@hookform/resolvers/yup';
import {
  AppBar,
  Autocomplete,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  getArisanMembers,
  postArisanMembers,
} from 'app/store/redux/actions/arisan-actions/arisan-member-actions';
import PropTypes from 'prop-types';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';

const schema = yup.object().shape({
  anggota_id: yup
    .object()
    .nullable()
    .typeError('Diharuskan untuk memilih anggota')
    .required('Diharuskan untuk memilih anggota'),
  jumlah_lot: yup
    .number()
    .min(1, 'Jumlah lot minimum adalah 1')
    .typeError('Diharuskan untuk mengisi dalam format angka')
    .required('Diharuskan untuk mengisi jumlah lot'),
});

function NewFormDialog({ open, closeDialogHandler }) {
  const dispatch = useDispatch();
  const { loadingPost, arisanMembersList, loadingList } = useSelector(
    (state) => state.arisanMembersReducer
  );

  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: {
      anggota_id: null,
      jumlah_lot: '',
      keterangan: '',
    },
    resolver: yupResolver(schema),
  });

  const { control, formState, handleSubmit } = formMethods;
  const { errors } = formState;

  const handleSave = handleSubmit(async (data) => {
    const payload = {
      anggota_id: data?.anggota_id?.id,
      jumlah_lot: data?.jumlah_lot,
      keterangan: data?.keterangan,
    };

    const response = await dispatch(postArisanMembers(payload));
    if (response) {
      closeDialogHandler();
      dispatch(getArisanMembers());
    }
  });

  return (
    <FormProvider {...formMethods}>
      <Dialog open={open} maxWidth="md" fullWidth>
        <AppBar position="static" elevation={1}>
          <Toolbar sx={{ backgroundColor: 'secondary.main' }} className="flex w-full">
            <Typography variant="h6" color="inherit">
              Data Baru
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <section className="flex flex-col gap-16">
            <div className="flex flex-col md:flex-row items-center gap-16 md:items-stretch">
              <Controller
                name="anggota_id"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    fullWidth
                    id="anggota_id"
                    value={value}
                    options={arisanMembersList}
                    loading={loadingList}
                    loadingText="Memuat data"
                    noOptionsText="Data tidak tersedia"
                    isOptionEqualToValue={(option, newValue) => option.id === newValue.id}
                    getOptionLabel={(option) => `${option.id} - ${option.name}`}
                    onChange={(e, newValue) => onChange(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={!!errors?.anggota_id}
                        helperText={errors?.anggota_id?.message}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loadingList ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                        label=":: Pilih Daftar Anggota"
                        placeholder="Anggota"
                      />
                    )}
                  />
                )}
              />
            </div>
            <div className="flex flex-col md:flex-row items-center gap-16 md:items-stretch">
              <Controller
                name="jumlah_lot"
                control={control}
                render={({ field: { onChange, ...field } }) => (
                  <TextField
                    {...field}
                    onChange={(e) => {
                      onChange(e);
                    }}
                    error={!!errors.jumlah_lot}
                    label="Jumlah Lot"
                    id="jumlah_lot_lengkap"
                    variant="outlined"
                    fullWidth
                    helperText={errors?.jumlah_lot?.message}
                    placeholder="Jumlah Lot"
                    type="number"
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
              variant="contained"
              color="success"
              type="submit"
              aria-label="simpan"
              onClick={handleSave}
              disabled={loadingPost}
            >
              {loadingPost ? 'Menyimpan' : 'Simpan'}
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
}

NewFormDialog.propTypes = {
  closeDialogHandler: PropTypes.func.isRequired,
  open: PropTypes.bool,
};

NewFormDialog.defaultProps = {
  closeDialogHandler: () => {
    console.log('close dialog');
  },
  openDialog: false,
};

export default NewFormDialog;
