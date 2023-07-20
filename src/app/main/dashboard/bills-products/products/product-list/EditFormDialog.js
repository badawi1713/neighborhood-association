import { yupResolver } from '@hookform/resolvers/yup';
import {
  AppBar,
  Button,
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
  getProduct,
  updateProduct,
} from 'app/store/redux/actions/dashboard-actions/bills-products-actions/product-action';
import { isNaN } from 'lodash';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';

const schema = yup.object().shape({
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

function EditFormDialog({ open, closeDialogHandler }) {
  const dispatch = useDispatch();
  const { loadingPost, productDetailData } = useSelector((state) => state.productReducer);

  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: useMemo(() => {
      return productDetailData;
    }, [productDetailData]),
    resolver: yupResolver(schema),
  });

  const { control, formState, handleSubmit, reset } = formMethods;
  const { errors } = formState;

  useEffect(() => {
    reset(productDetailData);
  }, [reset, productDetailData]);

  const handleSave = handleSubmit(async (data) => {
    const payload = {
      name: data?.name,
      nominal: data?.nominal,
      keterangan: data?.keterangan,
    };

    const response = await dispatch(updateProduct(payload, data?.id));
    if (response) {
      closeDialogHandler();
      dispatch(getProduct());
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
                    label="Nama Produk"
                    id="name"
                    variant="outlined"
                    fullWidth
                    helperText={errors?.name?.message}
                    placeholder="Nama Produk"
                  />
                )}
              />
              <Controller
                name="nominal"
                control={control}
                render={({ field: { onChange, ...field } }) => (
                  <TextField
                    {...field}
                    onChange={(e) => {
                      onChange(e);
                    }}
                    error={!!errors.nominal}
                    label="Nominal"
                    id="nominal"
                    variant="outlined"
                    fullWidth
                    helperText={errors?.nominal?.message}
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
                    multiline
                    rows={3}
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
