import { yupResolver } from '@hookform/resolvers/yup';
import { AddOutlined, Delete } from '@mui/icons-material';
import {
  AppBar,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  getUserManagementUser,
  postUserManagementUser,
} from 'app/store/redux/actions/dashboard-actions/user-management-actions/user-management-user-action';
import PropTypes from 'prop-types';
import { Controller, FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { phoneNumberNormalize, phoneNumberValidate } from 'src/utils/utils';
import * as yup from 'yup';

const userSchema = yup.object().shape({
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

const schema = yup.object().shape({
  users: yup.array().of(userSchema),
});

function NewFormDialog({ open, closeDialogHandler }) {
  const dispatch = useDispatch();
  const { loadingPost } = useSelector((state) => state.userManagementUserReducer);

  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: {
      users: [
        {
          name: '',
          email: '',
          no_telp: '',
          keterangan: '',
        },
      ],
    },
    resolver: yupResolver(schema),
  });

  const { control, formState, handleSubmit } = formMethods;
  const { errors } = formState;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'users',
  });

  const handleSave = handleSubmit(async (data) => {
    const payload = data?.users?.map((item) => {
      return {
        name: item?.name,
        email: item?.email,
        no_telp: phoneNumberNormalize(item?.no_telp),
        keterangan: item?.keterangan,
      };
    });

    const response = await dispatch(postUserManagementUser(payload));
    if (response) {
      closeDialogHandler();
      dispatch(getUserManagementUser());
    }
  });

  const handleAddData = handleSubmit(() => {
    append({
      name: '',
      email: '',
      no_telp: '',
      keterangan: '',
    });
  });

  const handleRemoveData = (id) => {
    remove(id);
  };

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
          <main className="w-full flex flex-col gap-48 mt-20">
            {fields?.map((userItem, userIndex) => (
              <section
                className="flex flex-col gap-16 border-2 rounded-6 relative px-12 py-32"
                key={userItem?.id}
              >
                <div className="absolute inset-x-0 -top-16 ml-10">
                  <Chip label={`User ${userIndex + 1}`} color="primary" />
                </div>

                <div className="absolute left-0 ml-10 -bottom-16 flex items-center gap-12 flex-row-reverse">
                  {fields.length - 1 === userIndex && (
                    <Chip
                      icon={<AddOutlined fontSize="small" />}
                      label="Tambah Data"
                      onClick={handleAddData}
                      color="success"
                      className="flex items-center h-32 px-10"
                    />
                  )}
                  {fields.length > 1 && (
                    <Chip
                      icon={<Delete fontSize="small" />}
                      label="Hapus"
                      onClick={() => handleRemoveData(userIndex)}
                      color="error"
                      className="flex items-center h-32 px-10"
                    />
                  )}
                </div>
                <div className="flex flex-col md:flex-row items-center gap-16 md:items-stretch">
                  <Controller
                    name={`users.${userIndex}.name`}
                    control={control}
                    render={({ field: { onChange, ...field } }) => (
                      <TextField
                        {...field}
                        onChange={(e) => {
                          onChange(e);
                        }}
                        autoFocus
                        error={!!errors?.users?.[userIndex]?.name}
                        label="Nama User"
                        id="name"
                        variant="outlined"
                        fullWidth
                        helperText={errors?.users?.[userIndex]?.name?.message}
                        placeholder="Nama User"
                      />
                    )}
                  />
                  <Controller
                    name={`users.${userIndex}.email`}
                    control={control}
                    render={({ field: { onChange, ...field } }) => (
                      <TextField
                        {...field}
                        onChange={(e) => {
                          onChange(e);
                        }}
                        error={!!errors?.users?.[userIndex]?.email}
                        label="Alamat Email"
                        id="email"
                        variant="outlined"
                        fullWidth
                        type="email"
                        helperText={errors?.users?.[userIndex]?.email?.message}
                        placeholder="zonapay@mail.com"
                      />
                    )}
                  />
                </div>
                <div className="flex flex-col md:flex-row items-center gap-16 md:items-stretch">
                  <Controller
                    name={`users.${userIndex}.no_telp`}
                    control={control}
                    render={({ field: { onChange, ...field } }) => (
                      <TextField
                        {...field}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          const cleanedNumber = newValue.replace(/\D/g, '');
                          onChange(cleanedNumber);
                        }}
                        error={!!errors?.users?.[userIndex]?.no_telp}
                        label="Nomor Telepon"
                        id="no_telp"
                        variant="outlined"
                        fullWidth
                        helperText={errors?.users?.[userIndex]?.no_telp?.message}
                        placeholder="Masukkan nomor telepon"
                      />
                    )}
                  />
                  <Controller
                    name={`users.${userIndex}.keterangan`}
                    control={control}
                    render={({ field: { onChange, ...field } }) => (
                      <TextField
                        {...field}
                        onChange={(e) => {
                          onChange(e);
                        }}
                        error={!!errors?.users?.[userIndex]?.keterangan}
                        label="Keterangan"
                        id="keterangan"
                        variant="outlined"
                        fullWidth
                        helperText={errors?.users?.[userIndex]?.keterangan?.message}
                        placeholder="Masukkan keterangan"
                      />
                    )}
                  />
                </div>
              </section>
            ))}
          </main>
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
