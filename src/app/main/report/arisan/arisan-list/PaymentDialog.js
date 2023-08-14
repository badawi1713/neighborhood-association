import { useDebounce } from '@fuse/hooks';
import {
  AppBar,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  FormControlLabel,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { showMessage } from 'app/store/fuse/messageSlice';
import {
  changeReportArisanReducer,
  getReportArisan,
  getReportArisanPaymentCheckedList,
  getReportArisanPaymentList,
  handleArisanPayment,
} from 'app/store/redux/actions/report-actions/report-arisan-actions';
import ConfirmationDialog from 'app/theme-layouts/shared-components/ConfirmationDialog';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { currencyFormat } from 'src/utils/utils';

function PaymentDialog({ open, closeDialogHandler }) {
  const isMounted = useRef(true);
  const dispatch = useDispatch();
  const { loadingPost, loadingList, reportArisanPaymentList, reportArisanPaymentCheckedList } =
    useSelector((state) => state.reportArisanReducer);

  const searchRef = useRef(null);
  const checkboxRef = useRef(null);
  const checkboxListRef = useRef(null);
  const checkboxes = useRef([]);
  const [resetForm, setResetForm] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [focusedIndex, setFocusedIndex] = useState(null);

  const handleCloseDialog = (event) => {
    if (event.key === 'Escape') {
      closeDialogHandler();
    }
  };

  const handleGetUserList = useDebounce(async (keyword) => {
    if (keyword) {
      dispatch(getReportArisanPaymentList(keyword));
    } else {
      dispatch(
        changeReportArisanReducer({
          loadingList: true,
        })
      );
    }
  }, 1000);

  useEffect(() => {
    if (isMounted.current) {
      isMounted.current = false;
    }

    return () => {
      setSelectedUser(null);
      dispatch(
        changeReportArisanReducer({
          reportArisanPaymentList: [],
          reportArisanPaymentCheckedList: [],
        })
      );
    };
  }, [dispatch]);

  const isCheckedAll = useMemo(() => {
    return reportArisanPaymentCheckedList?.every((item) => item?.checked === true) || false;
  }, [reportArisanPaymentCheckedList]);

  const isCheckedSome = useMemo(() => {
    return reportArisanPaymentCheckedList?.some((item) => item?.checked === true) || false;
  }, [reportArisanPaymentCheckedList]);

  const totalPayment = useMemo(() => {
    return reportArisanPaymentCheckedList.reduce((total, item) => {
      if (item.checked) {
        return total + item.nominal;
      }
      return total;
    }, 0);
  }, [reportArisanPaymentCheckedList]);

  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: {
      selectedPayment: [],
    },
    // resolver: yupResolver(schema),
  });

  const { control, formState, handleSubmit, reset } = formMethods;
  const { errors } = formState;

  const selectedData = useMemo(() => {
    return reportArisanPaymentCheckedList
      ?.filter((item) => item?.checked === true)
      .map((item) => item?.id);
  }, [reportArisanPaymentCheckedList]);

  const handleChecked = (value, id) => {
    const newValue = reportArisanPaymentCheckedList?.map((item) =>
      item.id === id ? { ...item, checked: value } : item
    );
    return dispatch(
      changeReportArisanReducer({
        reportArisanPaymentCheckedList: newValue,
      })
    );
  };

  const handleCheckedAll = (event) => {
    const newValue = reportArisanPaymentCheckedList?.map((item) => ({
      ...item,
      checked: event.target.checked,
    }));
    return dispatch(
      changeReportArisanReducer({
        reportArisanPaymentCheckedList: newValue,
      })
    );
  };

  const handleSave = handleSubmit(async () => {
    const payload = {
      id: selectedData,
    };
    const response = await dispatch(handleArisanPayment(payload));
    if (response) {
      await dispatch(getReportArisan());
      await dispatch(
        changeReportArisanReducer({
          reportArisanPaymentList: [],
          reportArisanPaymentCheckedList: [],
        })
      );
      setOpenConfirmation(false);
      setSelectedUser(null);
      setTimeout(() => {
        searchRef.current.focus();
      }, 500);
    }
  });

  const handleConfirmation = () => {
    if (!isCheckedSome) {
      if (reportArisanPaymentCheckedList?.length < 1) {
        return dispatch(
          showMessage({
            message: 'Silakan cari dan pilih anggota terlebih dahulu.',
            variant: 'error',
          })
        );
      }
      return dispatch(
        showMessage({
          message: 'Silakan centang minimal 1 dari daftar pembayaran.',
          variant: 'error',
        })
      );
    }
    return setOpenConfirmation(true);
  };

  const handleCheckboxKeyDown = (event, index) => {
    if (event.key === 'ArrowUp' && index === -1) {
      // Move focus to the previous checkbox
      searchRef.current.focus();
    } else if (event.key === 'ArrowDown' && index === -1) {
      // Move focus to the previous checkbox
      document.getElementById(`checkbox-0`)?.focus();
    } else if (event.key === 'ArrowUp' && index === 0) {
      // Move focus to the previous checkbox
      document.getElementById(`checkbox-all`)?.focus();
    } else if (event.key === 'ArrowUp' && index > 0) {
      // Move focus to the previous checkbox
      document.getElementById(`checkbox-${index - 1}`)?.focus();
    } else if (event.key === 'ArrowDown' && index < Object.keys(selectedData).length - 1) {
      // Move focus to the next checkbox
      document.getElementById(`checkbox-${index + 1}`)?.focus();
    }
  };

  return (
    <form onSubmit={handleSubmit(handleConfirmation)}>
      <Dialog
        open={open}
        maxWidth="md"
        fullWidth
        fullScreen
        PaperProps={{ style: { borderRadius: 0 } }}
        onKeyDown={handleCloseDialog}
      >
        <AppBar position="static" elevation={1}>
          <Toolbar sx={{ backgroundColor: 'secondary.main' }} className="flex w-full">
            <Typography variant="h6" color="inherit">
              Bayar Arisan
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <section className="flex flex-col gap-16">
            <div>
              <Autocomplete
                id="search-user"
                onChange={(event, newValue) => {
                  if (newValue?.id) {
                    setSelectedUser(newValue);
                    dispatch(getReportArisanPaymentCheckedList(newValue?.id));
                  }
                }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(option) => option.nama}
                options={reportArisanPaymentList || []}
                loading={loadingList}
                loadingText="Memuat data"
                noOptionsText="Silakan melakukan pencarian"
                value={selectedUser || null}
                onInputChange={(e, newValue, reason) => {
                  if (reason === 'input') {
                    if (newValue?.length >= 3) {
                      handleGetUserList(newValue);
                    }
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    autoFocus
                    inputRef={searchRef}
                    label="Cari Data Anggota"
                    helperText="Ketik minimal 3 karakter untuk melakukan pencarian data anggota"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingList ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </div>
            <Divider />
            {reportArisanPaymentCheckedList?.length > 0 && (
              <div>
                <FormControlLabel
                  label="Pilih Semua"
                  control={
                    <Checkbox
                      id="checkbox-all"
                      checked={isCheckedAll}
                      onChange={handleCheckedAll}
                      sx={{
                        '&.Mui-focusVisible': {
                          color: 'green',
                        },
                      }}
                      inputProps={{
                        'aria-label': 'controlled',
                        role: 'checkbox',
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault(); // Prevent the default behavior of the Enter key
                          handleSubmit(handleConfirmation)();
                        }
                      }}
                      onKeyDown={(event) => handleCheckboxKeyDown(event, -1)}
                    />
                  }
                />
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    ml: 3,
                  }}
                >
                  <Controller
                    name="selectedPayment"
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => {
                      return reportArisanPaymentCheckedList?.map((member, index) => (
                        <FormControlLabel
                          id={`checkbox-${member?.id}`}
                          key={member?.id}
                          label={member?.nama || '-'}
                          ref={checkboxListRef}
                          control={
                            <Checkbox
                              id={`checkbox-${index}`}
                              sx={{
                                '&.Mui-focusVisible': {
                                  color: 'green',
                                },
                              }}
                              {...field}
                              checked={member?.checked}
                              onChange={(event) =>
                                handleChecked(event?.target?.checked, member?.id)
                              }
                              inputProps={{
                                'aria-label': 'controlled',
                                role: 'checkbox',
                                'aria-checked': member?.checked,
                                'aria-labelledby': `checkbox-${member?.id}`,
                              }}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault(); // Prevent the default behavior of the Enter key
                                  handleSubmit(handleConfirmation)();
                                }
                              }}
                              onKeyDown={(event) => handleCheckboxKeyDown(event, index)}
                            />
                          }
                        />
                      ));
                    }}
                  />
                </Box>
              </div>
            )}
          </section>
        </DialogContent>
        <DialogActions className="py-8 px-24">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 w-full">
            <Typography variant="body2" fontWeight={700}>
              Total: Rp{currencyFormat(totalPayment || 0)}
            </Typography>
            <div className="flex flex-col md:flex-row">
              <Button
                role="button"
                disabled={loadingPost}
                type="button"
                onClick={closeDialogHandler}
                aria-label="tutup"
              >
                Tutup
              </Button>
              <Button
                variant="contained"
                color="success"
                type="button"
                aria-label="bayar"
                onClick={() => {
                  handleConfirmation();
                }}
                disabled={loadingPost}
              >
                Bayar
              </Button>
            </div>
          </div>
        </DialogActions>
      </Dialog>
      {openConfirmation && (
        <ConfirmationDialog
          open={openConfirmation}
          title="Bayar arisan?"
          type="error"
          content="Konfirmasi untuk melakukan pembayaran arisan"
          loading={loadingPost}
          confirmActionText="Bayar"
          loadingText="Memproses..."
          cancelActionHandler={() => setOpenConfirmation(false)}
          confirmActionHandler={handleSave}
        />
      )}
    </form>
  );
}

PaymentDialog.propTypes = {
  closeDialogHandler: PropTypes.func.isRequired,
  open: PropTypes.bool,
};

PaymentDialog.defaultProps = {
  closeDialogHandler: () => {
    console.log('close dialog');
  },
  openDialog: false,
};

export default PaymentDialog;
