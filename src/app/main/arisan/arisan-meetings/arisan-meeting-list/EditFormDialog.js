import { yupResolver } from '@hookform/resolvers/yup';
import {
  AppBar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  getArisanMeetings,
  updateArisanMeetings,
} from 'app/store/redux/actions/arisan-actions/arisan-meeting-actions';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';

const schema = yup.object().shape({
  nama: yup
    .string()
    .typeError('Diharuskan untuk mengisi nama lengkap.')
    .required('Diharuskan untuk mengisi nama lengkap.'),
});

function EditFormDialog({ open, closeDialogHandler }) {
  const dispatch = useDispatch();
  const { loadingPost, arisanMeetingsDetailData } = useSelector(
    (state) => state.arisanMeetingsReducer
  );

  console.log(arisanMeetingsDetailData);

  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: useMemo(() => {
      return arisanMeetingsDetailData;
    }, [arisanMeetingsDetailData]),
    resolver: yupResolver(schema),
  });

  const { control, formState, handleSubmit, reset } = formMethods;
  const { errors } = formState;

  useEffect(() => {
    reset(arisanMeetingsDetailData);
  }, [reset, arisanMeetingsDetailData]);

  const handleSave = handleSubmit(async (data) => {
    const payload = {
      id: data?.id,
      nama: data?.nama,
      keterangan: data?.keterangan,
    };

    const response = await dispatch(updateArisanMeetings(payload, data?.id));
    if (response) {
      closeDialogHandler();
      dispatch(getArisanMeetings());
    }
  });

  return (
    <FormProvider {...formMethods}>
      <Dialog open={open} maxWidth="md" fullWidth>
        <AppBar position="static" elevation={1}>
          <Toolbar sx={{ backgroundColor: 'secondary.main' }} className="flex w-full">
            <Typography variant="h6" color="inherit">
              Edit Data
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <section className="flex flex-col gap-16">
            <div className="flex flex-col md:flex-row items-center gap-16 md:items-stretch">
              <Controller
                name="nama"
                control={control}
                render={({ field: { onChange, ...field } }) => (
                  <TextField
                    {...field}
                    onChange={(e) => {
                      onChange(e);
                    }}
                    autoFocus
                    error={!!errors.nama}
                    label="Nama Lengkap"
                    id="nama_lengkap"
                    variant="outlined"
                    fullWidth
                    helperText={errors?.nama?.message}
                    placeholder="Nama Lengkap"
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

EditFormDialog.propTypes = {
  closeDialogHandler: PropTypes.func.isRequired,
  open: PropTypes.bool,
};

EditFormDialog.defaultProps = {
  closeDialogHandler: () => {
    console.log('close dialog');
  },
  openDialog: false,
};

export default EditFormDialog;
