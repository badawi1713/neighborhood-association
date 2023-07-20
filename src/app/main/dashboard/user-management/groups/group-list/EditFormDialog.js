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
  getUserManagementGroup,
  updateUserManagementGroup,
} from 'app/store/redux/actions/dashboard-actions/user-management-actions/user-management-group-action';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';

const schema = yup.object().shape({
  name: yup
    .string()
    .typeError('Diharuskan untuk mengisi nama group.')
    .required('Diharuskan untuk mengisi nama group.'),
});

function EditFormDialog({ open, closeDialogHandler }) {
  const dispatch = useDispatch();
  const { loadingPost, userManagementGroupDetailData } = useSelector(
    (state) => state.userManagementGroupReducer
  );

  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: useMemo(() => {
      return userManagementGroupDetailData;
    }, [userManagementGroupDetailData]),
    resolver: yupResolver(schema),
  });

  const { control, formState, handleSubmit, reset } = formMethods;
  const { errors } = formState;

  useEffect(() => {
    reset(userManagementGroupDetailData);
  }, [reset, userManagementGroupDetailData]);

  const handleSave = handleSubmit(async (data) => {
    const payload = {
      name: data?.name,
    };

    const response = await dispatch(updateUserManagementGroup(payload, data?.id));
    if (response) {
      closeDialogHandler();
      dispatch(getUserManagementGroup());
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
                    label="Nama Group"
                    id="full_name"
                    variant="outlined"
                    fullWidth
                    helperText={errors?.name?.message}
                    placeholder="Nama Group"
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
