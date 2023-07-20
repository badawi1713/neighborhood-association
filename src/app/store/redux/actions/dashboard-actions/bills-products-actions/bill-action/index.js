import { showMessage } from 'app/store/fuse/messageSlice';
import { SET_DASHBOARD_BILLS_REDUCER } from 'app/store/redux/constants';
import axios from 'axios';
import moment from 'moment';

export const changeBillReducer = (data) => {
  return async (dispatch) => {
    dispatch({
      type: SET_DASHBOARD_BILLS_REDUCER,
      payload: data,
    });
  };
};

export const getBill = () => {
  return async (dispatch, getState) => {
    const { billReducer } = getState();

    const {
      billNameSearch,
      //   billSortBy,
      //   billSortType,
      billPage,
      billLimit,
      billFilterFormData,
    } = billReducer;

    const { periode, memberId, groupId, status } = billFilterFormData;
    const selectedPeriode = periode ? moment(periode).format('YYYY-M') : moment().format('YYYY-M');

    dispatch({
      type: SET_DASHBOARD_BILLS_REDUCER,
      payload: {
        error: null,
        loading: true,
      },
    });
    try {
      const response = await axios.get(
        `/v1/api/merchant/tagihan?pageSize=${billLimit}&pageNo=${billPage}&search=${billNameSearch}&memberId=${
          memberId || ''
        }&groupId=${groupId || ''}&statusId=${status || -1}&periode=${selectedPeriode}`
      );

      dispatch({
        type: SET_DASHBOARD_BILLS_REDUCER,
        payload: {
          loading: false,
          billData: response.data?.data?.content || [],
          billTotal: response.data?.data?.totalElements || 0,
        },
      });
      return true;
    } catch (error) {
      if (error?.response?.status === 500) {
        dispatch({
          type: SET_DASHBOARD_BILLS_REDUCER,
          payload: {
            error: 'Maaf, terjadi kesalahan. Silakan dicoba kembali.',
            loading: false,
          },
        });
      } else {
        dispatch({
          type: SET_DASHBOARD_BILLS_REDUCER,
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

export const postBill = (payload) => {
  return async (dispatch, getState) => {
    dispatch({
      type: SET_DASHBOARD_BILLS_REDUCER,
      payload: {
        loadingPost: true,
      },
    });
    try {
      await axios.post(`/v1/api/merchant/tagihan`, payload);

      dispatch(
        showMessage({
          message: 'Berhasil menambahkan data baru!',
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
        type: SET_DASHBOARD_BILLS_REDUCER,
        payload: {
          loadingPost: false,
        },
      });
    }
  };
};

export const successManualBill = (payload, id) => {
  return async (dispatch, getState) => {
    dispatch({
      type: SET_DASHBOARD_BILLS_REDUCER,
      payload: {
        loadingPost: true,
      },
    });
    try {
      await axios.put(`/v1/api/merchant/tagihan/sukses`, payload);

      dispatch(
        showMessage({
          message: `Berhasil sukses manual tagihan dengan ID: ${id}`,
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
        type: SET_DASHBOARD_BILLS_REDUCER,
        payload: {
          loadingPost: false,
        },
      });
    }
  };
};

export const getBillById = (id) => {
  return async (dispatch, getState) => {
    dispatch(
      changeBillReducer({
        loadingDialog: true,
      })
    );
    try {
      const response = await axios.get(`/v1/api/merchant/tagihan/${id}`);

      dispatch({
        type: SET_DASHBOARD_BILLS_REDUCER,
        payload: {
          billDetailData: { ...response?.data?.data },
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
        type: SET_DASHBOARD_BILLS_REDUCER,
        payload: {
          loadingDialog: false,
        },
      });
    }
  };
};

export const deleteBill = (id) => {
  return async (dispatch, getState) => {
    dispatch(
      changeBillReducer({
        loadingDelete: true,
      })
    );
    try {
      await axios.delete(`/v1/api/merchant/tagihan/${id}`);

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
        type: SET_DASHBOARD_BILLS_REDUCER,
        payload: {
          loadingDelete: false,
        },
      });
    }
  };
};

export const reminderBill = (id) => {
  return async (dispatch, getState) => {
    dispatch(
      changeBillReducer({
        loadingPost: true,
      })
    );
    const payload = {
      id,
    };
    try {
      await axios.post(`/v1/api/merchant/tagihan/reminder`, payload);

      dispatch(
        showMessage({
          message: `Berhasil mengingatkan tagihan dengan ID: ${id}`,
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
        type: SET_DASHBOARD_BILLS_REDUCER,
        payload: {
          loadingPost: false,
        },
      });
    }
  };
};

export const getBillGroupList = () => {
  return async (dispatch) => {
    dispatch({
      type: SET_DASHBOARD_BILLS_REDUCER,
      payload: {
        loadingList: true,
        isGroupListEmpty: false,
      },
    });
    try {
      const response = await axios.get(`/v1/api/merchant/group`);

      dispatch({
        type: SET_DASHBOARD_BILLS_REDUCER,
        payload: {
          groupListData: response?.data?.data?.content || [],
          isGroupListEmpty: response?.data?.data?.content?.length === 0,
        },
      });
    } catch (error) {
      dispatch(
        showMessage({
          message: error.response?.data?.message || error.message,
          variant: 'warning',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        })
      );
      dispatch({
        type: SET_DASHBOARD_BILLS_REDUCER,
        payload: {
          groupListData: [],
          isGroupListEmpty: true,
        },
      });
    }
  };
};
