import { showMessage } from 'app/store/fuse/messageSlice';
import { SET_DASHBOARD_FUND_WITHDRAWAL } from 'app/store/redux/constants';
import axios from 'axios';

export const changeFundWithdrawalReducer = (data) => {
  return async (dispatch) => {
    dispatch({
      type: SET_DASHBOARD_FUND_WITHDRAWAL,
      payload: data,
    });
  };
};

export const getFundWithdrawal = () => {
  return async (dispatch, getState) => {
    // const { fundWithdrawalReducer } = getState();

    // const {
    //   fundWithdrawalNameSearch,
    //   fundWithdrawalSortBy,
    //   fundWithdrawalSortType,
    //   fundWithdrawalPage,
    //   fundWithdrawalLimit,
    //   fundWithdrawalFilterFormData,
    // } = fundWithdrawalReducer;

    // const { paymentType, filterDate } = fundWithdrawalFilterFormData;

    dispatch({
      type: SET_DASHBOARD_FUND_WITHDRAWAL,
      payload: {
        error: null,
        loading: true,
      },
    });
    try {
      const response = await axios.get(`/v1/api/merchant/tarik-dana`);

      dispatch({
        type: SET_DASHBOARD_FUND_WITHDRAWAL,
        payload: {
          loading: false,
          fundWithdrawalData: response.data?.data?.content || [],
          fundWithdrawalTotal: response.data?.data?.totalElements || 0,
        },
      });
      return true;
    } catch (error) {
      if (error?.response?.status === 500) {
        dispatch({
          type: SET_DASHBOARD_FUND_WITHDRAWAL,
          payload: {
            error: 'Maaf, terjadi kesalahan. Silakan dicoba kembali.',
            loading: false,
          },
        });
      } else {
        dispatch({
          type: SET_DASHBOARD_FUND_WITHDRAWAL,
          payload: {
            error: error.response?.data?.message || error.message,
            loading: false,
          },
        });
      }
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

export const postFundWithdrawal = (payload) => {
  return async (dispatch, getState) => {
    dispatch({
      type: SET_DASHBOARD_FUND_WITHDRAWAL,
      payload: {
        loadingPost: true,
      },
    });
    try {
      await axios.post(`/v1/api/merchant/tarik-dana`, payload);

      dispatch(
        showMessage({
          message: 'Berhasil melakukan penarikan dana!',
          variant: 'success',
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
        type: SET_DASHBOARD_FUND_WITHDRAWAL,
        payload: {
          loadingPost: false,
        },
      });
    }
  };
};

export const updateFundWithdrawal = (payload, id) => {
  return async (dispatch, getState) => {
    dispatch({
      type: SET_DASHBOARD_FUND_WITHDRAWAL,
      payload: {
        loadingPost: true,
      },
    });
    try {
      await axios.put(`/v1/api/merchant/tarik-dana/${id}`, payload);

      dispatch(
        showMessage({
          message: 'Berhasil mengubah data!',
          variant: 'success',
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
        type: SET_DASHBOARD_FUND_WITHDRAWAL,
        payload: {
          loadingPost: false,
        },
      });
    }
  };
};

export const getFundWithdrawalById = (id) => {
  return async (dispatch, getState) => {
    dispatch({
      type: SET_DASHBOARD_FUND_WITHDRAWAL,
      payload: {
        loadingDialog: true,
      },
    });
    try {
      const response = await axios.get(`/v1/api/merchant/tarik-dana/${id}`);

      dispatch({
        type: SET_DASHBOARD_FUND_WITHDRAWAL,
        payload: {
          fundWithdrawalDetailData: response?.data?.data,
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
        type: SET_DASHBOARD_FUND_WITHDRAWAL,
        payload: {
          loadingDialog: false,
        },
      });
    }
  };
};

export const deleteFundWithdrawal = (id) => {
  return async (dispatch, getState) => {
    dispatch({
      type: SET_DASHBOARD_FUND_WITHDRAWAL,
      payload: {
        loadingDelete: true,
      },
    });
    try {
      await axios.delete(`/v1/api/merchant/tarik-dana/${id}`);

      dispatch(
        showMessage({
          message: 'Berhasil menghapus data!',
          variant: 'success',
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
        type: SET_DASHBOARD_FUND_WITHDRAWAL,
        payload: {
          loadingDelete: false,
        },
      });
    }
  };
};
