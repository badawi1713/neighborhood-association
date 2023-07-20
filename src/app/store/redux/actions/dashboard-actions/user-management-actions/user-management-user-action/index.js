import { showMessage } from 'app/store/fuse/messageSlice';
import { SET_DASHBOARD_USER_MANAGEMENT_USER_REDUCER } from 'app/store/redux/constants';
import axios from 'axios';

export const changeUserManagementUserReducer = (data) => {
  return async (dispatch) => {
    dispatch({
      type: SET_DASHBOARD_USER_MANAGEMENT_USER_REDUCER,
      payload: data,
    });
  };
};

export const getUserManagementUser = () => {
  return async (dispatch, getState) => {
    // const { userManagementUserReducer } = getState();

    // const {
    //   userManagementUserNameSearch,
    //   userManagementUserSortBy,
    //   userManagementUserSortType,
    //   userManagementUserPage,
    //   userManagementUserLimit,
    //   userManagementUserFilterFormData,
    // } = userManagementUserReducer;

    // const { paymentType, filterDate } = userManagementUserFilterFormData;

    dispatch({
      type: SET_DASHBOARD_USER_MANAGEMENT_USER_REDUCER,
      payload: {
        error: null,
        loading: true,
      },
    });
    try {
      const response = await axios.get(`/v1/api/merchant/user`);

      dispatch({
        type: SET_DASHBOARD_USER_MANAGEMENT_USER_REDUCER,
        payload: {
          loading: false,
          userManagementUserData: response.data?.data?.content || [],
          userManagementUserTotal: response.data?.data?.totalElements || 0,
        },
      });
      return true;
    } catch (error) {
      if (error?.response?.status === 500) {
        dispatch({
          type: SET_DASHBOARD_USER_MANAGEMENT_USER_REDUCER,
          payload: {
            error: 'Maaf, terjadi kesalahan. Silakan dicoba kembali.',
            loading: false,
          },
        });
      } else {
        dispatch({
          type: SET_DASHBOARD_USER_MANAGEMENT_USER_REDUCER,
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

export const postUserManagementUser = (payload) => {
  return async (dispatch, getState) => {
    dispatch({
      type: SET_DASHBOARD_USER_MANAGEMENT_USER_REDUCER,
      payload: {
        loadingPost: true,
      },
    });
    try {
      await axios.post(`/v1/api/merchant/user`, payload);

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
        type: SET_DASHBOARD_USER_MANAGEMENT_USER_REDUCER,
        payload: {
          loadingPost: false,
        },
      });
    }
  };
};

export const updateUserManagementUser = (payload, id) => {
  return async (dispatch, getState) => {
    dispatch({
      type: SET_DASHBOARD_USER_MANAGEMENT_USER_REDUCER,
      payload: {
        loadingPost: true,
      },
    });
    try {
      await axios.put(`/v1/api/merchant/user/${id}`, payload);

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
        type: SET_DASHBOARD_USER_MANAGEMENT_USER_REDUCER,
        payload: {
          loadingPost: false,
        },
      });
    }
  };
};

export const getUserManagementUserById = (id) => {
  return async (dispatch, getState) => {
    dispatch({
      type: SET_DASHBOARD_USER_MANAGEMENT_USER_REDUCER,
      payload: {
        loadingDialog: true,
      },
    });
    try {
      const response = await axios.get(`/v1/api/merchant/user/${id}`);

      dispatch({
        type: SET_DASHBOARD_USER_MANAGEMENT_USER_REDUCER,
        payload: {
          userManagementUserDetailData: { ...response?.data?.data },
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
        type: SET_DASHBOARD_USER_MANAGEMENT_USER_REDUCER,
        payload: {
          loadingDialog: false,
        },
      });
    }
  };
};

export const deleteUserManagementUser = (id) => {
  return async (dispatch, getState) => {
    dispatch({
      type: SET_DASHBOARD_USER_MANAGEMENT_USER_REDUCER,
      payload: {
        loadingDelete: true,
      },
    });
    try {
      await axios.delete(`/v1/api/merchant/user/${id}`);

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
        type: SET_DASHBOARD_USER_MANAGEMENT_USER_REDUCER,
        payload: {
          loadingDelete: false,
        },
      });
    }
  };
};
