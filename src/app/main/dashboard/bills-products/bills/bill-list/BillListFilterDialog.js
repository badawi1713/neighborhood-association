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
  changeBillReducer,
  getBill,
} from 'app/store/redux/actions/dashboard-actions/bills-products-actions/bill-action';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';

const schema = yup.object().shape({
  periode: yup
    .date()
    .typeError('Diharuskan untuk mengisi periode.')
    .required('Diharuskan untuk mengisi periode.'),
});

function BillListFilterDialog({ open, closeDialogHandler, module }) {
  const dispatch = useDispatch();
  const { billFilterFormData, loadingDialog, groupListData } = useSelector(
    (state) => state.billReducer
  );

  const formDefaultValue = useMemo(() => {
    return billFilterFormData;
  }, [billFilterFormData]);

  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: formDefaultValue,
    resolver: yupResolver(schema),
  });

  const { control, formState, reset, getValues } = formMethods;
  const { errors } = formState;

  const periode = useWatch({ control, name: 'periode' });

  async function handleFilter() {
    const data = getValues();
    await dispatch(
      changeBillReducer({
        loadingDialog: true,
        billSortBy: 'id',
        billSortType: 'desc',
        billPage: 0,
        billLimit: 10,
        billFilterFormData: {
          ...data,
        },
      })
    );
    const response = await dispatch(getBill());
    if (response) {
      closeDialogHandler();
    }
    await dispatch(
      changeBillReducer({
        loadingDialog: false,
      })
    );
  }

  return (
    <FormProvider {...formMethods}>
      <Dialog open={open} maxWidth="md" fullWidth>
        <AppBar position="static" elevation={1}>
          <Toolbar className="flex w-full" sx={{ backgroundColor: 'secondary.main' }}>
            <Typography variant="h6" color="inherit">
              Filter Data Tagihan
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <section className="flex flex-col gap-16">
            <div className="flex flex-col md:flex-row items-center gap-16 md:items-stretch">
              <Controller
                name="periode"
                control={control}
                render={({ field: { onChange, ...field } }) => (
                  <TextField
                    {...field}
                    onChange={(e) => {
                      onChange(e);
                    }}
                    error={!!errors.periode}
                    label="Periode"
                    id="periode"
                    variant="outlined"
                    fullWidth
                    type="month"
                    helperText={errors?.periode?.message || (!periode && 'Pilih periode.')}
                    placeholder="Periode"
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
                name="status"
                rules={{ required: false }}
                render={({ field: { onChange, ...field } }) => (
                  <FormControl error={!!errors?.status} fullWidth>
                    <InputLabel id="statusLabel">:: Pilih Status</InputLabel>
                    <Select
                      labelId="statusLabel"
                      input={<OutlinedInput label=":: Pilih Status" />}
                      id="status"
                      placeholder=":: Pilih jenis status"
                      {...field}
                      onChange={(newValue) => {
                        onChange(newValue);
                      }}
                      variant="outlined"
                      fullWidth
                    >
                      <MenuItem value="-1">Semua</MenuItem>
                      <MenuItem value="0">Belum Bayar</MenuItem>
                      <MenuItem value="1">Sudah Bayar</MenuItem>
                      <MenuItem value="2">Sukses Manual</MenuItem>
                    </Select>
                    <FormHelperText>{errors?.status?.message}</FormHelperText>
                  </FormControl>
                )}
              />
            </div>
            <div className="flex flex-col md:flex-row items-center gap-16 md:items-stretch">
              <Controller
                name="memberId"
                control={control}
                render={({ field: { onChange, ...field } }) => (
                  <TextField
                    {...field}
                    onChange={(e) => {
                      onChange(e);
                    }}
                    error={!!errors.memberId}
                    label="ID Member"
                    id="memberId"
                    variant="outlined"
                    fullWidth
                    type="text"
                    helperText={errors?.memberId?.message}
                    placeholder="Masukkan ID Member"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FuseSvgIcon size={20}>heroicons-outline:credit-card</FuseSvgIcon>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
              <Controller
                name="groupId"
                control={control}
                render={({ field: { onChange, ...field } }) => (
                  <FormControl fullWidth error={!!errors?.groupId}>
                    <InputLabel id="group-select">:: Pilih Grup</InputLabel>
                    <Select
                      {...field}
                      labelId="group-select"
                      id="groupId"
                      label=":: Pilih Grup"
                      onChange={onChange}
                    >
                      <MenuItem disabled value="">
                        <em>:: Pilih grup</em>
                      </MenuItem>
                      {groupListData?.length > 0 ? (
                        groupListData?.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled value="x">
                          Data tidak tersedia
                        </MenuItem>
                      )}
                    </Select>
                    <FormHelperText>{errors?.groupId?.message}</FormHelperText>
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
                periode: moment().format('YYYY-MM'),
                status: '-1',
                groupId: '',
                memberId: '',
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
              color="secondary"
              type="submit"
              aria-label="tampilkan data"
              onClick={handleFilter}
              disabled={loadingDialog}
            >
              {loadingDialog ? 'Memuat Data' : 'Tampilkan Data'}
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
}

BillListFilterDialog.propTypes = {
  closeDialogHandler: PropTypes.func.isRequired,
  open: PropTypes.bool,
};

BillListFilterDialog.defaultProps = {
  closeDialogHandler: () => {
    console.log('close dialog');
  },
  openDialog: false,
};

export default BillListFilterDialog;
