import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  AppBar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  changeFundWithdrawalReducer,
  getFundWithdrawal,
} from 'app/store/redux/actions/dashboard-actions/fund-withdrawal-actions';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';

const schema = yup.object().shape({
  filterDate: yup
    .date()
    .typeError('Diharuskan untuk mengisi tanggal.')
    .required('Diharuskan untuk mengisi tanggal.'),
});

function FundWithdrawaListFilterDialog({ open, closeDialogHandler, module }) {
  const dispatch = useDispatch();
  const { fundWithdrawalFilterFormData, loadingDialog } = useSelector(
    (state) => state.fundWithdrawalReducer
  );

  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: useMemo(() => {
      return fundWithdrawalFilterFormData;
    }, [fundWithdrawalFilterFormData]),
    resolver: yupResolver(schema),
  });

  const { control, formState, reset, getValues } = formMethods;
  const { errors, isValid } = formState;

  const filterDate = useWatch({ control, name: 'filterDate' });

  async function handleFilter() {
    const data = getValues();
    await dispatch(
      changeFundWithdrawalReducer({
        loadingDialog: true,
        fundWithdrawalSortBy: 'id',
        fundWithdrawalSortType: 'desc',
        fundWithdrawalPage: 0,
        fundWithdrawalLimit: 10,
        fundWithdrawalFilterFormData: {
          ...data,
        },
      })
    );
    const response = await dispatch(getFundWithdrawal());
    if (response) {
      closeDialogHandler();
    }
    await dispatch(
      changeFundWithdrawalReducer({
        loadingDialog: false,
      })
    );
  }

  return (
    <FormProvider {...formMethods}>
      <Dialog open={open} maxWidth="md" fullWidth>
        <AppBar position="static" elevation={1}>
          <Toolbar className="flex w-full">
            <Typography variant="h6" color="inherit">
              Filter Data Pasien
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <section className="flex flex-col gap-16">
            <div className="flex flex-col md:flex-row items-center gap-16 md:items-stretch">
              <Controller
                name="filterDate"
                control={control}
                render={({ field: { onChange, ...field } }) => (
                  <TextField
                    {...field}
                    onChange={(e) => {
                      onChange(e);
                    }}
                    error={!!errors.filterDate}
                    label="Tanggal"
                    id="filterDate"
                    variant="outlined"
                    fullWidth
                    type="date"
                    helperText={errors?.filterDate?.message || (!filterDate && 'Isi tanggal.')}
                    placeholder="Tanggal"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FuseSvgIcon size={20}>heroicons-outline:calendar</FuseSvgIcon>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
              <Controller
                control={control}
                name="paymentType"
                rules={{ required: false }}
                render={({ field: { onChange, ...field } }) => (
                  <FormControl error={!!errors?.paymentType} fullWidth>
                    <InputLabel id="paymentTypeLabel">:: Pilih Jenis Pembiayaan</InputLabel>
                    <Select
                      labelId="paymentTypeLabel"
                      input={<OutlinedInput label=":: Pilih Jenis Pembiayaan" />}
                      id="paymentType"
                      placeholder=":: Pilih jenis pembiayaan"
                      {...field}
                      onChange={(newValue) => {
                        onChange(newValue);
                      }}
                      variant="outlined"
                      fullWidth
                    >
                      <MenuItem value="0">Semua</MenuItem>
                      <MenuItem value="1">Umum</MenuItem>
                      <MenuItem value="2">BPJS</MenuItem>
                    </Select>
                    <FormHelperText>{errors?.paymentType?.message}</FormHelperText>
                  </FormControl>
                )}
              />
            </div>
          </section>
        </DialogContent>
        <DialogActions className="justify-between py-8 px-24">
          <Button
            variant="outlined"
            color="error"
            onClick={() =>
              reset({
                filterDate: moment().format('YYYY-MM-DD'),
                endDate: moment().format('YYYY-MM-DD'),
              })
            }
            aria-label="reset-filter"
          >
            Reset Filter
          </Button>
          <div className="flex items-center gap-12">
            <Button onClick={closeDialogHandler} aria-label="tutup">
              Tutup
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              aria-label="tampilkan data"
              onClick={handleFilter}
              disabled={!isValid || loadingDialog}
            >
              {loadingDialog ? 'Memuat Data' : 'Tampilkan Data'}
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
}

FundWithdrawaListFilterDialog.propTypes = {
  closeDialogHandler: PropTypes.func.isRequired,
  open: PropTypes.bool,
};

FundWithdrawaListFilterDialog.defaultProps = {
  closeDialogHandler: () => {
    console.log('close dialog');
  },
  openDialog: false,
};

export default FundWithdrawaListFilterDialog;
