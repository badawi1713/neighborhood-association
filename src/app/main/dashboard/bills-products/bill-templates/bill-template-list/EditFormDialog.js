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
  Select,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import NumberFormatCustom from 'app/shared-components/NumberFormatCustom';
import {
  getBillTemplate,
  updateBillTemplate,
} from 'app/store/redux/actions/dashboard-actions/bills-products-actions/bill-template-action';
import { isNaN } from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';

const schema = yup.object().shape({
  admin: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .nullable()
    .typeError('Nominal admin harus dalam format angka')
    .min(0, 'Minimal nominal admin bernilai Rp0')
    .required('Diharuskan untuk mengisi nominal admin.'),
  denda: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .nullable()
    .typeError('Nominal denda harus dalam format angka')
    .min(0, 'Minimal nominal denda bernilai Rp0')
    .required('Diharuskan untuk mengisi nominal denda.'),
  tanggal_mulai: yup
    .number()
    .transform((value) => (Number(value) ? value : undefined))
    .nullable()
    .typeError('Tanggal mulai dalam format angka')
    .required('Diharuskan untuk memilih tanggal mulai.'),
  tanggal_akhir: yup
    .number()
    .transform((value) => (Number(value) ? value : undefined))
    .nullable()
    .typeError('Tanggal berakhir dalam format angka')
    .required('Diharuskan untuk memilih tanggal berakhir.')
    .min(yup.ref('tanggal_mulai'), 'Tanggal berakhir harus setelah tanggal mulai.'),
  type: yup
    .string()
    .typeError('Diharuskan untuk memilih tipe.')
    .required('Diharuskan untuk memilih tipe.'),
  until_periode: yup
    .date()
    .typeError('Diharuskan untuk memilih bulan periode.')
    .required('Diharuskan untuk memilih bulan periode.')
    .nullable(),
});

function EditFormDialog({ open, closeDialogHandler }) {
  const dispatch = useDispatch();
  const { loadingPost, dialogId, groupListData, billTemplateDetailData } = useSelector(
    (state) => state.billTemplateReducer
  );

  const formValue = useMemo(() => {
    return billTemplateDetailData;
  }, [billTemplateDetailData]);

  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: formValue,
    resolver: yupResolver(schema),
  });

  const { control, formState, handleSubmit, setValue, getValues } = formMethods;
  const { errors } = formState;

  const handleSave = handleSubmit(async (data) => {
    const periode = moment(data?.until_periode).format('YYYY-MM');

    const payload = {
      admin: data?.admin,
      denda: data?.denda,
      tanggal_mulai: data?.tanggal_mulai,
      tanggal_akhir: data?.tanggal_akhir,
      type: data?.type,
      until_periode: periode,
      group_id: data?.group_id,
      keterangan: data?.keterangan,
    };

    const response = await dispatch(updateBillTemplate(payload, dialogId));
    if (response) {
      closeDialogHandler();
      dispatch(getBillTemplate());
    }
  });

  const selectedPeriod = useWatch({ control, name: 'until_periode' });

  const maxDate = useMemo(() => {
    const year = moment(selectedPeriod).format('YYYY');
    const month = moment(selectedPeriod).format('M');
    const endDate = moment(new Date(year, month, 0)).format('D');
    const dateObject = [];
    for (let i = 0; i < endDate; i += 1) {
      dateObject.push(i);
    }
    return dateObject;
  }, [selectedPeriod]);

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
                name="admin"
                control={control}
                render={({ field: { onChange, ...field } }) => (
                  <TextField
                    {...field}
                    autoFocus
                    onChange={(e) => {
                      onChange(e);
                    }}
                    error={!!errors.admin}
                    label="Nominal Admin"
                    id="admin"
                    variant="outlined"
                    fullWidth
                    helperText={errors?.admin?.message}
                    placeholder="0"
                    InputProps={{
                      inputComponent: NumberFormatCustom,
                      startAdornment: <InputAdornment position="start">Rp </InputAdornment>,
                    }}
                  />
                )}
              />
              <Controller
                name="denda"
                control={control}
                render={({ field: { onChange, ...field } }) => (
                  <TextField
                    {...field}
                    onChange={(e) => {
                      onChange(e);
                    }}
                    error={!!errors.denda}
                    label="Nominal Denda"
                    id="denda"
                    variant="outlined"
                    fullWidth
                    helperText={errors?.denda?.message}
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
                name="type"
                control={control}
                render={({ field: { onChange, ...field } }) => (
                  <FormControl fullWidth error={!!errors?.type}>
                    <InputLabel id="type-select">:: Pilih Tipe</InputLabel>
                    <Select
                      {...field}
                      labelId="type-select"
                      id="type"
                      label=":: Pilih Tipe"
                      onChange={onChange}
                    >
                      <MenuItem disabled value="">
                        <em>:: Pilih tipe</em>
                      </MenuItem>
                      <MenuItem value="1">Sekali</MenuItem>
                      <MenuItem value="2">Berulang</MenuItem>
                    </Select>
                    <FormHelperText>{errors?.type?.message}</FormHelperText>
                  </FormControl>
                )}
              />
              <Controller
                name="until_periode"
                control={control}
                render={({ field: { onChange, ...field } }) => (
                  <TextField
                    {...field}
                    onChange={(e) => {
                      setValue('tanggal_mulai', 1);
                      setValue('tanggal_akhir', 1);
                      onChange(e);
                    }}
                    error={!!errors.until_periode}
                    label="Akhir Periode"
                    id="until_periode"
                    variant="outlined"
                    fullWidth
                    type="month"
                    helperText={errors?.until_periode?.message}
                  />
                )}
              />
            </div>
            <div className="flex flex-col md:flex-row items-center gap-16 md:items-stretch">
              <Controller
                name="tanggal_mulai"
                control={control}
                render={({ field: { onChange, ...field } }) => (
                  <FormControl fullWidth error={!!errors?.tanggal_mulai}>
                    <InputLabel id="tanggal_mulai-select">:: Pilih Tanggal Mulai</InputLabel>
                    <Select
                      {...field}
                      labelId="tanggal_mulai-select"
                      id="tanggal_mulai"
                      label=":: Pilih Tanggal Mulai"
                      onChange={onChange}
                    >
                      {maxDate?.length > 0 ? (
                        maxDate?.map((item) => (
                          <MenuItem value={item + 1} key={item}>
                            {item + 1}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value={0}>Tanggal tidak tesedia</MenuItem>
                      )}
                    </Select>
                    <FormHelperText>
                      {errors?.tanggal_mulai?.message ||
                        (!selectedPeriod && 'Pilih akhir periode dahulu.')}
                    </FormHelperText>
                  </FormControl>
                )}
              />
              <Controller
                name="tanggal_akhir"
                control={control}
                render={({ field: { onChange, ...field } }) => (
                  <FormControl fullWidth error={!!errors?.tanggal_akhir}>
                    <InputLabel id="tanggal_akhir-select">:: Pilih Tanggal Akhir</InputLabel>
                    <Select
                      {...field}
                      labelId="tanggal_akhir-select"
                      id="tanggal_akhir"
                      label=":: Pilih Tanggal Akhir"
                      onChange={onChange}
                    >
                      {maxDate?.length > 0 ? (
                        maxDate?.map((item) => (
                          <MenuItem value={item + 1} key={item}>
                            {item + 1}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value={0}>Tanggal tidak tesedia</MenuItem>
                      )}
                    </Select>
                    <FormHelperText>
                      {errors?.tanggal_akhir?.message ||
                        (!selectedPeriod && 'Pilih akhir periode dahulu.')}
                    </FormHelperText>
                  </FormControl>
                )}
              />
            </div>

            <div className="flex flex-col md:flex-row items-center gap-16 md:items-stretch">
              <Controller
                name="group_id"
                control={control}
                render={({ field: { onChange, ...field } }) => (
                  <FormControl fullWidth error={!!errors?.group_id}>
                    <InputLabel id="group-select">:: Pilih Grup</InputLabel>
                    <Select
                      {...field}
                      labelId="group-select"
                      id="group_id"
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
                    <FormHelperText>{errors?.group_id?.message}</FormHelperText>
                  </FormControl>
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
