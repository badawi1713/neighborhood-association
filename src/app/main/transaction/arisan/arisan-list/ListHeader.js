import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Button, IconButton, Tooltip } from '@mui/material';
import Input from '@mui/material/Input';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import {
  changeTransactionArisanReducer,
  getTransactionArisan,
} from 'app/store/redux/actions/transaction-actions/transaction-arisan-actions';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GroupListFilterDialog from './ListFilterDialog';
import ManualPaymentDialog from './ManualPaymentDialog';
import PaymentDialog from './PaymentDialog';

function ListHeader() {
  const { transactionArisanNameSearch } = useSelector((state) => state.transactionArisanReducer);
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [openManualPaymentDialog, setOpenManualPaymentDialog] = useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);

  const dispatch = useDispatch();

  const handleSearchData = async (e) => {
    e.preventDefault();
    await dispatch(
      changeTransactionArisanReducer({
        transactionArisanPage: 0,
      })
    );
    await dispatch(getTransactionArisan());
  };

  const handleSearchReset = async (e) => {
    e.preventDefault();
    await dispatch(
      changeTransactionArisanReducer({
        transactionArisanPage: 0,
        transactionArisanNameSearch: '',
      })
    );
    await dispatch(getTransactionArisan());
  };

  return (
    <section className="flex flex-col gap-16 flex-1 w-full py-32 px-24 md:px-32">
      <div className="flex flex-col md:flex-row md:items-center flex-1 gap-16">
        <Typography
          component={motion.span}
          initial={{ x: -20 }}
          animate={{ x: 0, transition: { delay: 0.2 } }}
          delay={300}
          className="text-24 md:text-32 font-extrabold tracking-tight"
        >
          Daftar Transaksi Arisan
        </Typography>

        <div className="flex flex-col w-full flex-1 md:w-auto md:ml-auto md:flex-row md:items-center gap-16 justify-end">
          <Paper
            component={motion.div}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
            className="flex items-center w-full md:max-w-256 space-x-8 px-16 rounded-full border-1 shadow-0"
          >
            <FuseSvgIcon color="disabled">heroicons-solid:search</FuseSvgIcon>

            <form onSubmit={handleSearchData} className="w-full">
              <Input
                placeholder="Pencarian..."
                className="flex flex-1"
                disableUnderline
                fullWidth
                value={transactionArisanNameSearch}
                inputProps={{
                  'aria-label': 'Search',
                }}
                onChange={(ev) =>
                  dispatch(
                    changeTransactionArisanReducer({
                      transactionArisanNameSearch: ev.target.value,
                    })
                  )
                }
                endAdornment={
                  transactionArisanNameSearch && (
                    <Tooltip title="Hapus">
                      <IconButton onClick={handleSearchReset} size="small">
                        <FuseSvgIcon size={18} color="error">
                          heroicons-outline:x
                        </FuseSvgIcon>
                      </IconButton>
                    </Tooltip>
                  )
                }
              />
            </form>
          </Paper>
          <Button
            onClick={() => setOpenPaymentDialog(true)}
            variant="contained"
            color="secondary"
            startIcon={<FuseSvgIcon>heroicons-outline:cash</FuseSvgIcon>}
          >
            Bayar
          </Button>
          <Button
            onClick={() => {
              setOpenManualPaymentDialog(true);
            }}
            variant="contained"
            color="success"
            startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
          >
            Tagihan Manual
          </Button>
        </div>
      </div>
      {openFilterDialog && (
        <GroupListFilterDialog
          open={openFilterDialog}
          closeDialogHandler={() => setOpenFilterDialog(false)}
        />
      )}
      {openManualPaymentDialog && (
        <ManualPaymentDialog
          open={openManualPaymentDialog}
          closeDialogHandler={() => setOpenManualPaymentDialog(false)}
        />
      )}
      {openPaymentDialog && (
        <PaymentDialog
          open={openPaymentDialog}
          closeDialogHandler={() => setOpenPaymentDialog(false)}
        />
      )}
    </section>
  );
}

export default ListHeader;
