import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import withRouter from '@fuse/core/withRouter';

import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import {
  getBankList,
  getUserBankData,
  updateUserBankData,
} from 'app/store/redux/actions/settings-actions/bank-settings-actions';
import FuseLoading from '@fuse/core/FuseLoading';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';

const schema = yup.object().shape({
  atas_nama: yup
    .string()
    .typeError('Diharuskan untuk mengisi nama nasabah.')
    .required('Diharuskan untuk mengisi nama nasabah.'),
  cabang: yup
    .string()
    .typeError('Diharuskan untuk mengisi nama cabang bank.')
    .required('Diharuskan untuk mengisi nama cabang bank.'),
  bank_id: yup
    .string()
    .typeError('Diharuskan untuk memilih bank.')
    .required('Diharuskan untuk memilih bank.'),
  nomor_rekening: yup
    .number()
    .typeError('Diharuskan untuk mengisi nomor rekening dalam format angka.')
    .required('Diharuskan untuk mengisi nomor rekening.'),
});

function BankSettingsForm(props) {
  const isMounted = useRef(true);
  const dispatch = useDispatch();
  const { loading, data, bankListData, loadingList, loadingPost } = useSelector(
    (state) => state.bankSettingsReducer
  );

  const [editForm, setEditForm] = useState(false);

  const formDefaultValue = useMemo(() => {
    return data;
  }, [data]);

  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: formDefaultValue,
    resolver: yupResolver(schema),
  });

  const { control, formState, handleSubmit, reset } = formMethods;
  const { errors } = formState;

  const handleReset = () => {
    reset(data);
  };

  const getBankSettingsData = useCallback(() => {
    dispatch(getUserBankData());
    dispatch(getBankList());
  }, [dispatch]);

  useEffect(() => {
    if (isMounted.current) {
      getBankSettingsData();
      isMounted.current = false;
    }
  }, [getBankSettingsData]);

  useEffect(() => {
    reset(formDefaultValue);
  }, [reset, formDefaultValue]);

  const handleSave = handleSubmit(async (formData) => {
    const payload = {
      id: formData?.id,
      bank_id: formData?.bank_id,
      cabang: formData?.cabang,
      no_rek: formData?.nomor_rekening,
      atas_nama: formData?.atas_nama,
    };

    const response = await dispatch(updateUserBankData(payload));
    if (response) {
      dispatch(getUserBankData());
      setEditForm(false);
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-24 px-10">
        <FuseLoading />
      </div>
    );
  }

  return (
    <main className="w-full flex flex-col min-h-full p-40">
      <form onSubmit={handleSave} className="flex flex-col gap-24 w-full max-w-lg">
        <div className="flex flex-col md:flex-row items-center gap-16 md:items-stretch">
          <Controller
            name="bank_id"
            control={control}
            render={({ field: { onChange, ...field } }) => (
              <FormControl fullWidth error={!!errors?.bank_id}>
                <InputLabel id="bank_id-select">:: Pilih Bank</InputLabel>
                <Select
                  {...field}
                  labelId="bank_id-select"
                  id="bank_id"
                  label=":: Pilih Bank"
                  onChange={onChange}
                  disabled={!editForm}
                >
                  <MenuItem disabled value="">
                    <em>{loadingList ? 'Memuat data' : ':: Pilih bank'}</em>
                  </MenuItem>
                  {bankListData?.map((item) => (
                    <MenuItem key={item?.id} value={item?.id}>
                      {item?.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors?.bank_id?.message}</FormHelperText>
              </FormControl>
            )}
          />
        </div>
        <div className="flex flex-col md:flex-row items-center gap-16 md:items-stretch">
          <Controller
            name="cabang"
            control={control}
            render={({ field: { onChange, ...field } }) => (
              <TextField
                {...field}
                onChange={(e) => {
                  onChange(e);
                }}
                autoFocus
                error={!!errors.cabang}
                label="Nama Cabang"
                id="cabang"
                variant="outlined"
                fullWidth
                helperText={errors?.cabang?.message}
                placeholder="Masukkan nama cabang bank"
                disabled={!editForm}
              />
            )}
          />
        </div>
        <div className="flex flex-col md:flex-row items-center gap-16 md:items-stretch">
          <Controller
            name="atas_nama"
            control={control}
            render={({ field: { onChange, ...field } }) => (
              <TextField
                {...field}
                onChange={(e) => {
                  onChange(e);
                }}
                autoFocus
                error={!!errors.atas_nama}
                label="Nama Nasabah"
                id="atas_nama"
                variant="outlined"
                fullWidth
                helperText={errors?.atas_nama?.message}
                placeholder="Masukkan atas nama nasabah"
                disabled={!editForm}
              />
            )}
          />
        </div>
        <div className="flex flex-col md:flex-row items-center gap-16 md:items-stretch">
          <Controller
            name="nomor_rekening"
            control={control}
            render={({ field: { onChange, ...field } }) => (
              <TextField
                {...field}
                onChange={(e) => {
                  onChange(e);
                }}
                error={!!errors.nomor_rekening}
                label="Nomor Rekening"
                id="nomor_rekening"
                variant="outlined"
                fullWidth
                helperText={errors?.nomor_rekening?.message}
                placeholder="Masukkan nomor rekening bank"
                disabled={!editForm}
                InputProps={{
                  inputProps: {
                    inputMode: 'numeric',
                    pattern: '[0-9]*', // Only allows digits
                  },
                }}
              />
            )}
          />
        </div>
        <div className="flex justify-end items-center gap-12 mt-40">
          <Button
            variant={!editForm ? 'contained' : 'text'}
            color={!editForm ? 'primary' : 'inherit'}
            onClick={() => {
              if (!editForm) {
                setEditForm(true);
              } else {
                handleReset();
                setEditForm(false);
              }
            }}
            aria-label="reset"
          >
            {editForm ? 'Reset' : 'Edit'}
          </Button>
          {editForm && (
            <Button
              variant="contained"
              color="secondary"
              type="submit"
              aria-label="simpan"
              disabled={loadingPost}
            >
              {loadingPost ? 'Menyimpan' : 'Simpan'}
            </Button>
          )}
        </div>
      </form>
    </main>
  );
}

export default withRouter(BankSettingsForm);
