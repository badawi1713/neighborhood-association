import { yupResolver } from '@hookform/resolvers/yup';
import { AddOutlined, Delete } from '@mui/icons-material';
import {
  AppBar,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  InputAdornment,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import NumberFormatCustom from 'app/shared-components/NumberFormatCustom';
import {
  getBill,
  postBill,
} from 'app/store/redux/actions/dashboard-actions/bills-products-actions/bill-action';
import { isNaN } from 'lodash';
import PropTypes from 'prop-types';
import { Controller, FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';

const userSchema = yup.object().shape({
  name: yup
    .string()
    .typeError('Diharuskan untuk mengisi nama user.')
    .required('Diharuskan untuk mengisi nama user.'),
  nominal: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .nullable()
    .typeError('Nominal harus dalam format angka')
    .min(0, 'Minimal nominal bernilai Rp0')
    .required('Diharuskan untuk mengisi nominal harga produk.'),
});

const schema = yup.object().shape({
  users: yup.array().of(userSchema),
});

function NewFormDialog({ open, closeDialogHandler }) {
  const dispatch = useDispatch();
  const { loadingPost } = useSelector((state) => state.billReducer);

  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: {
      users: [
        {
          name: '',
          nominal: 0,
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
        nominal: item?.nominal,
        keterangan: item?.keterangan,
      };
    });

    const response = await dispatch(postBill(payload));
    if (response) {
      closeDialogHandler();
      dispatch(getBill());
    }
  });

  const handleAddData = handleSubmit(() => {
    append({
      name: '',
      nominal: 0,
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
                  <Chip label={`Produk ${userIndex + 1}`} color="primary" />
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
                        label="Nama Bill"
                        id="name"
                        variant="outlined"
                        fullWidth
                        helperText={errors?.users?.[userIndex]?.name?.message}
                        placeholder="Nama Bill"
                      />
                    )}
                  />
                  <Controller
                    name={`users.${userIndex}.nominal`}
                    control={control}
                    render={({ field: { onChange, ...field } }) => (
                      <TextField
                        {...field}
                        onChange={(e) => {
                          onChange(e);
                        }}
                        error={!!errors?.users?.[userIndex]?.nominal}
                        label="Nominal"
                        id="nominal"
                        variant="outlined"
                        fullWidth
                        helperText={errors?.users?.[userIndex]?.nominal?.message}
                        placeholder="0"
                        InputProps={{
                          inputComponent: NumberFormatCustom,
                          startAdornment: <InputAdornment position="start">Rp </InputAdornment>,
                        }}
                      />
                    )}
                  />
                </div>
                <div className="flex flex-col md:flex-row items-center gap-16 md:items-stretch">
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
                        multiline
                        rows={3}
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
