import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import {
  getBill,
  successManualBill,
} from 'app/store/redux/actions/dashboard-actions/bills-products-actions/bill-action';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

function BillSuccessDialog({ open, closeDialogHandler }) {
  const dispatch = useDispatch();

  const { loadingPost, billDetailData } = useSelector((state) => state.billReducer);
  const formValue = useMemo(() => {
    return billDetailData;
  }, [billDetailData]);
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

    const response = await dispatch(successManualBill(payload, data?.id));
    if (response) {
      closeDialogHandler();
      dispatch(getBill());
    }
  });

  const billId = useWatch({ control, name: 'id' });

  return (
    <Dialog open={open} fullWidth maxWidth="sm">
      <DialogTitle>Sukses manual tagihan?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Konfirmasi untuk melakukan aksi sukses manual dengan ID tagihan {billId}
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

BillSuccessDialog.propTypes = {
  closeDialogHandler: PropTypes.func.isRequired,
  open: PropTypes.bool,
};

BillSuccessDialog.defaultProps = {
  closeDialogHandler: () => {
    console.log('close dialog');
  },
  openDialog: false,
};

export default BillSuccessDialog;
