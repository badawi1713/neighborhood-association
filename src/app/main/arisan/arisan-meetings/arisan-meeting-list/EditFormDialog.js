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
import moment from 'moment';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';

const schema = yup.object().shape({
  lokasi: yup.string().required('Diharuskan untuk mengisi lokasi arisan'),
  tanggal: yup
    .date()
    .typeError('Format tanggal salah')
    .required('Diharuskan untuk memilih tanggal arisan'),
  pertemuan_ke: yup
    .number()
    .min(1, 'Nilai pertemuan minimal 1')
    .typeError('Diharuskan untuk mengisi dalam format angka')
    .required('Diharuskan untuk mengisi nilai pertemuan ke berapa?'),
  dapat1: yup
    .number()
    .min(0, 'Jumlah minimum tidak boleh minus')
    .typeError('Diharuskan untuk mengisi dalam format angka'),
  // .required('Diharuskan untuk mengisi jumlah dapat 1'),
  dapat2: yup
    .number()
    .min(0, 'Jumlah minimum tidak boleh minus')
    .typeError('Diharuskan untuk mengisi dalam format angka'),
  // .required('Diharuskan untuk mengisi jumlah dapat 2'),
});

function EditFormDialog({ open, closeDialogHandler }) {
  const dispatch = useDispatch();
  const { loadingPost, arisanMeetingsDetailData } = useSelector(
    (state) => state.arisanMeetingsReducer
  );

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
      lokasi: data?.lokasi,
      tanggal: moment(data?.tanggal).format('YYYY-MM-DD') || moment().format('YYYY-MM-DD'),
      pertemuan_ke: data?.pertemuan_ke,
      keterangan: data?.keterangan,
      dapat1: data?.dapat1,
      dapat2: data?.dapat2,
      id: data?.id,
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
                name="lokasi"
                control={control}
                render={({ field: { onChange, ...field } }) => (
                  <TextField
                    {...field}
                    onChange={(e) => {
                      onChange(e);
                    }}
                    error={!!errors.lokasi}
                    label="Lokasi Arisan"
                    id="lokasi"
                    variant="outlined"
                    fullWidth
                    helperText={errors?.lokasi?.message}
                    placeholder="Masukkan lokasi arisan"
                    multiline
                    rows={3}
                  />
                )}
              />
            </div>
            <div className="flex flex-col md:flex-row items-center gap-16 md:items-stretch">
              <Controller
                name="tanggal"
                control={control}
                render={({ field: { onChange, ...field } }) => (
                  <TextField
                    {...field}
                    onChange={(e) => {
                      onChange(e);
                    }}
                    error={!!errors.tanggal}
                    label="Tanggal Arisan"
                    id="tanggal_lengkap"
                    variant="outlined"
                    fullWidth
                    helperText={errors?.tanggal?.message}
                    placeholder="Pilih tanggal arisan"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
              />
              <Controller
                name="pertemuan_ke"
                control={control}
                render={({ field: { onChange, ...field } }) => (
                  <TextField
                    {...field}
                    onChange={(e) => {
                      onChange(e);
                    }}
                    error={!!errors.pertemuan_ke}
                    label="Pertemuan Ke-"
                    id="pertemuan_ke_lengkap"
                    variant="outlined"
                    fullWidth
                    helperText={errors?.pertemuan_ke?.message}
                    placeholder="Masukkan pertemuan"
                    type="number"
                  />
                )}
              />
            </div>
            <div className="flex flex-col md:flex-row items-center gap-16 md:items-stretch">
              <Controller
                name="dapat1"
                control={control}
                render={({ field: { onChange, ...field } }) => (
                  <TextField
                    {...field}
                    onChange={(e) => {
                      onChange(e);
                    }}
                    error={!!errors.dapat1}
                    label="Dapat 1"
                    id="dapat1"
                    variant="outlined"
                    fullWidth
                    helperText={errors?.dapat1?.message}
                    placeholder="Masukkan nilai dapat 1"
                    type="number"
                  />
                )}
              />
              <Controller
                name="dapat2"
                control={control}
                render={({ field: { onChange, ...field } }) => (
                  <TextField
                    {...field}
                    onChange={(e) => {
                      onChange(e);
                    }}
                    error={!!errors.dapat2}
                    label="Dapat 2"
                    id="dapat2"
                    variant="outlined"
                    fullWidth
                    helperText={errors?.dapat2?.message}
                    placeholder="Masukkan nilai dapat 2"
                    type="number"
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
