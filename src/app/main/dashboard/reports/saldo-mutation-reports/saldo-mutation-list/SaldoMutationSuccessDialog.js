import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import {
  getSaldoMutationReports,
  successManualSaldoMutationReports,
} from 'app/store/redux/actions/dashboard-actions/reports-actions/saldo-mutation-reports-action';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

function SaldoMutationReportsSuccessDialog({ open, closeDialogHandler }) {
  const dispatch = useDispatch();

  const { loadingPost, saldoMutationReportsDetailData } = useSelector(
    (state) => state.saldoMutationReportsReducer
  );
  const formValue = useMemo(() => {
    return saldoMutationReportsDetailData;
  }, [saldoMutationReportsDetailData]);
  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: formValue,
  });

  const { control, handleSubmit } = formMethods;

  const handleSave = handleSubmit(async (data) => {
    const payload = {
      id: data?.id,
      keterangan: data?.keterangan,
    };

    const response = await dispatch(successManualSaldoMutationReports(payload, data?.id));
    if (response) {
      closeDialogHandler();
      dispatch(getSaldoMutationReports());
    }
  });

  const saldoMutationReportsId = useWatch({ control, name: 'id' });

  return (
    <Dialog open={open} fullWidth maxWidth="sm">
      <DialogTitle>Sukses manual tagihan?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Konfirmasi untuk melakukan aksi sukses manual dengan ID tagihan {saldoMutationReportsId}
        </DialogContentText>
        <Controller
          name="keterangan"
          control={control}
          render={({ field: { value } }) => (
            <TextField
              value={value}
              label="Keterangan"
              id="keterangan"
              variant="standard"
              fullWidth
              multiline
              margin="normal"
              placeholder="Masukkan keterangan"
            />
          )}
        />
      </DialogContent>
      <DialogActions className="py-8 px-24">
        <div className="flex justify-end items-center gap-12">
          <Button onClick={closeDialogHandler} aria-label="tutup">
            Batal
          </Button>
          <Button
            variant="contained"
            color="success"
            type="submit"
            aria-label="sukses-manual"
            onClick={handleSave}
            disabled={loadingPost}
          >
            {loadingPost ? 'Memproses' : 'Sukses Manual'}
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}

SaldoMutationReportsSuccessDialog.propTypes = {
  closeDialogHandler: PropTypes.func.isRequired,
  open: PropTypes.bool,
};

SaldoMutationReportsSuccessDialog.defaultProps = {
  closeDialogHandler: () => {
    console.log('close dialog');
  },
  openDialog: false,
};

export default SaldoMutationReportsSuccessDialog;
