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
  getFundWithdrawal,
  postFundWithdrawal,
} from 'app/store/redux/actions/dashboard-actions/fund-withdrawal-actions';
import { isNaN } from 'lodash';
import PropTypes from 'prop-types';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';

const schema = yup.object().shape({
  nominal: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .nullable()
    .typeError('Nominal harus dalam format angka')
    .min(0, 'Minimal nominal bernilai Rp0')
    .required('Diharuskan untuk mengisi nominal.'),
});

function NewFormDialog({ open, closeDialogHandler }) {
  const dispatch = useDispatch();
  const { loadingPost } = useSelector((state) => state.fundWithdrawalReducer);

  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: {
      nominal: '',
    },
    resolver: yupResolver(schema),
  });

  const { control, formState, handleSubmit } = formMethods;
  const { errors } = formState;

  const handleSave = handleSubmit(async (data) => {
    const payload = {
      nominal: data?.nominal,
    };

    const response = await dispatch(postFundWithdrawal(payload));
    if (response) {
      closeDialogHandler();
      dispatch(getFundWithdrawal());
    }
  });

  return (
    <FormProvider {...formMethods}>
      <Dialog open={open} maxWidth="md" fullWidth>
        <AppBar position="static" elevation={1}>
          <Toolbar sx={{ backgroundColor: 'secondary.main' }} className="flex w-full">
            <Typography variant="h6" color="inherit">
              Form Penarikan Dana
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <section className="flex flex-col gap-16">
            <div className="flex flex-col md:flex-row items-center gap-16 md:items-stretch">
              <Controller
                name="nominal"
                control={control}
                render={({ field: { onChange, ...field } }) => (
                  <TextField
                    {...field}
                    onChange={(e) => {
                      onChange(e);
                    }}
                    autoFocus
                    error={!!errors?.nominal}
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
              aria-label="proses"
              onClick={handleSave}
              disabled={loadingPost}
            >
              {loadingPost ? 'Memproses' : 'Proses'}
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
