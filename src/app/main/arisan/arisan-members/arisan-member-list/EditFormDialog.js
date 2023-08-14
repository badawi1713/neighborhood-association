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
  getArisanMembers,
  updateArisanMembers,
} from 'app/store/redux/actions/arisan-actions/arisan-member-actions';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';

const schema = yup.object().shape({
  nama: yup
    .string()
    .typeError('Diharuskan untuk mengisi nama anggota.')
    .required('Diharuskan untuk mengisi nama anggota.'),
});

function EditFormDialog({ open, closeDialogHandler }) {
  const dispatch = useDispatch();
  const { loadingPost, arisanMembersDetailData } = useSelector(
    (state) => state.arisanMembersReducer
  );

  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: useMemo(() => {
      return arisanMembersDetailData;
    }, [arisanMembersDetailData]),
    resolver: yupResolver(schema),
  });

  const { control, formState, handleSubmit, reset } = formMethods;
  const { errors } = formState;

  useEffect(() => {
    reset(arisanMembersDetailData);
  }, [reset, arisanMembersDetailData]);

  const handleSave = handleSubmit(async (data) => {
    const payload = {
      id: data?.id,
      name: data?.nama,
      keterangan: data?.keterangan,
    };

    const response = await dispatch(updateArisanMembers(payload));
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
                    label="Nama Anggota"
                    id="nama"
                    variant="outlined"
                    fullWidth
                    helperText={errors?.nama?.message}
                    placeholder="Nama Anggota"
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
