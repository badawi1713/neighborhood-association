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
  getUserManagementUser,
  updateUserManagementUser,
} from 'app/store/redux/actions/dashboard-actions/user-management-actions/user-management-user-action';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { phoneNumberNormalize, phoneNumberValidate } from 'src/utils/utils';
import * as yup from 'yup';

const schema = yup.object().shape({
  name: yup
    .string()
    .typeError('Diharuskan untuk mengisi nama user.')
    .required('Diharuskan untuk mengisi nama user.'),
  email: yup
    .string()
    .email('Alamat email harus valid, contoh: zonapay@mail.com')
    .typeError('Alamat email harus valid, contoh: zonapay@mail.com')
    .required('Diharuskan untuk mengisi alamat email.'),
  no_telp: yup
    .string()
    .required('Nomor telepon harus diisi')
    .test('is-valid-phone', 'Nomor telepon tidak valid, contoh: 62821xxxxxx', (value) => {
      return phoneNumberValidate(value || '');
    }),
});

function EditFormDialog({ open, closeDialogHandler }) {
  const dispatch = useDispatch();
  const { loadingPost, userManagementUserDetailData } = useSelector(
    (state) => state.userManagementUserReducer
  );

  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: useMemo(() => {
      return userManagementUserDetailData;
    }, [userManagementUserDetailData]),
    resolver: yupResolver(schema),
  });

  const { control, formState, handleSubmit, reset } = formMethods;
  const { errors } = formState;

  useEffect(() => {
    reset(userManagementUserDetailData);
  }, [reset, userManagementUserDetailData]);

  const handleSave = handleSubmit(async (data) => {
    const payload = {
      name: data?.name,
      email: data?.email,
      no_telp: phoneNumberNormalize(data?.no_telp),
      keterangan: data?.keterangan,
    };

    const response = await dispatch(updateUserManagementUser(payload, data?.id));
    if (response) {
      closeDialogHandler();
      dispatch(getUserManagementUser());
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
                name="name"
                control={control}
                render={({ field: { onChange, ...field } }) => (
                  <TextField
                    {...field}
                    onChange={(e) => {
                      onChange(e);
                    }}
                    autoFocus
                    error={!!errors.name}
                    label="Nama User"
                    id="name"
                    variant="outlined"
                    fullWidth
                    helperText={errors?.name?.message}
                    placeholder="Nama User"
                  />
                )}
              />
              <Controller
                name="email"
                control={control}
                render={({ field: { onChange, ...field } }) => (
                  <TextField
                    {...field}
                    onChange={(e) => {
                      onChange(e);
                    }}
                    error={!!errors.email}
                    label="Email"
                    id="email"
                    variant="outlined"
                    fullWidth
                    type="email"
                    helperText={errors?.email?.message}
                    placeholder="zonapay@mail.com"
                  />
                )}
              />
            </div>
            <div className="flex flex-col md:flex-row items-center gap-16 md:items-stretch">
              <Controller
                name="no_telp"
                control={control}
                render={({ field: { onChange, ...field } }) => (
                  <TextField
                    {...field}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      const cleanedNumber = newValue.replace(/\D/g, '');
                      onChange(cleanedNumber);
                    }}
                    error={!!errors.no_telp}
                    label="Nomor Telepon"
                    id="no_telp"
                    variant="outlined"
                    fullWidth
                    helperText={errors?.no_telp?.message}
                    placeholder="Masukkan nomor telepon"
                  />
                )}
              />
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
                    label="Keterangan"
                    id="keterangan"
                    variant="outlined"
                    fullWidth
                    helperText={errors?.keterangan?.message}
                    placeholder="Masukkan keterangan"
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
              color="secondary"
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
