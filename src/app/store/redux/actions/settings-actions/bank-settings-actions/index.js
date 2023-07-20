import { showMessage } from 'app/store/fuse/messageSlice';
import { SET_SETTINGS_BANK_REDUCER } from 'app/store/redux/constants';
import axios from 'axios';
import moment from 'moment';

export const changeBanlSettingsReducer = (data) => {
  return async (dispatch) => {
    dispatch({
      type: SET_SETTINGS_BANK_REDUCER,
      payload: data,
    });
  };
};

export const getProfileSaldo = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`/v1/api/merchant/user/profile`);

      dispatch({
        type: SET_SETTINGS_BANK_REDUCER,
        payload: {
          saldo: response?.data?.data?.saldo || 0,
        },
      });
      return true;
    } catch (error) {
      dispatch(
        showMessage({
          message: error.response?.data?.message || error.message,
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        })
      );
      return false;
    }
  };
};

export const getUserBankData = () => {
  return async (dispatch) => {
    dispatch({
      type: SET_SETTINGS_BANK_REDUCER,
      payload: {
        loading: true,
      },
    });
    try {
      const response = await axios.get(`/v1/api/merchant/setting/bank`);

      dispatch({
        type: SET_SETTINGS_BANK_REDUCER,
        payload: {
          data: response?.data?.data || {
            cabang: '',
            last_updated: moment().format('YYYY-MM-DD HH:mm'),
            bank_id: '',
            nomor_rekening: '',
            status_name: '',
            bank_name: '',
            id: '',
            atas_nama: '',
          },
        },
      });
      return true;
    } catch (error) {
      dispatch(
        showMessage({
          message: error.response?.data?.message || error.message,
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        })
      );
      return false;
    } finally {
      dispatch({
        type: SET_SETTINGS_BANK_REDUCER,
        payload: {
          loading: false,
        },
      });
    }
  };
};

export const getBankList = () => {
  return async (dispatch) => {
    dispatch({
      type: SET_SETTINGS_BANK_REDUCER,
      payload: {
        loadingList: true,
      },
    });
    try {
      const response = await axios.get(`/v1/api/merchant/bank/list`);

      dispatch({
        type: SET_SETTINGS_BANK_REDUCER,
        payload: {
          bankListData: response?.data || [],
        },
      });
      return true;
    } catch (error) {
      dispatch(
        showMessage({
          message: error.response?.data?.message || error.message,
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        })
      );
      return false;
    } finally {
      dispatch({
        type: SET_SETTINGS_BANK_REDUCER,
        payload: {
          loadingList: false,
        },
      });
    }
  };
};

export const updateUserBankData = (data) => {
  return async (dispatch) => {
    dispatch({
      type: SET_SETTINGS_BANK_REDUCER,
      payload: {
        loadingPost: true,
      },
    });
    try {
      await axios.put(`/v1/api/merchant/setting/bank`, data);

      dispatch(
        showMessage({
          message: 'Berhasil memperbarui data bank',
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        })
      );

      return true;
    } catch (error) {
      dispatch(
        showMessage({
          message: error.response?.data?.message || error.message,
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        })
      );
      return false;
    } finally {
      dispatch({
        type: SET_SETTINGS_BANK_REDUCER,
        payload: {
          loadingPost: false,
        },
      });
    }
  };
};
