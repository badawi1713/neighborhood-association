import { showMessage } from 'app/store/fuse/messageSlice';
import { SET_DASHBOARD_USER_MANAGEMENT_GROUP_REDUCER } from 'app/store/redux/constants';
import axios from 'axios';

export const changeUserManagementGroupReducer = (data) => {
  return async (dispatch) => {
    dispatch({
      type: SET_DASHBOARD_USER_MANAGEMENT_GROUP_REDUCER,
      payload: data,
    });
  };
};

export const getUserManagementGroup = () => {
  return async (dispatch, getState) => {
    // const { userManagementGroupReducer } = getState();

    // const {
    //   userManagementGroupNameSearch,
    //   userManagementGroupSortBy,
    //   userManagementGroupSortType,
    //   userManagementGroupPage,
    //   userManagementGroupLimit,
    //   userManagementGroupFilterFormData,
    // } = userManagementGroupReducer;

    // const { paymentType, filterDate } = userManagementGroupFilterFormData;

    dispatch({
      type: SET_DASHBOARD_USER_MANAGEMENT_GROUP_REDUCER,
      payload: {
        error: null,
        loading: true,
      },
    });
    try {
      const response = await axios.get(`/v1/api/merchant/group`);

      dispatch({
        type: SET_DASHBOARD_USER_MANAGEMENT_GROUP_REDUCER,
        payload: {
          loading: false,
          userManagementGroupData: response.data?.data?.content || [],
          userManagementGroupTotal: response.data?.data?.totalElements || 0,
        },
      });
      return true;
    } catch (error) {
      if (error?.response?.status === 500) {
        dispatch({
          type: SET_DASHBOARD_USER_MANAGEMENT_GROUP_REDUCER,
          payload: {
            error: 'Maaf, terjadi kesalahan. Silakan dicoba kembali.',
            loading: false,
          },
        });
      } else {
        dispatch({
          type: SET_DASHBOARD_USER_MANAGEMENT_GROUP_REDUCER,
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

export const postUserManagementGroup = (payload) => {
  return async (dispatch, getState) => {
    dispatch({
      type: SET_DASHBOARD_USER_MANAGEMENT_GROUP_REDUCER,
      payload: {
        loadingPost: true,
      },
    });
    try {
      await axios.post(`/v1/api/merchant/group`, payload);

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
        type: SET_DASHBOARD_USER_MANAGEMENT_GROUP_REDUCER,
        payload: {
          loadingPost: false,
        },
      });
    }
  };
};

export const updateUserManagementGroup = (payload, id) => {
  return async (dispatch, getState) => {
    dispatch({
      type: SET_DASHBOARD_USER_MANAGEMENT_GROUP_REDUCER,
      payload: {
        loadingPost: true,
      },
    });
    try {
      await axios.put(`/v1/api/merchant/group/${id}`, payload);

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
        type: SET_DASHBOARD_USER_MANAGEMENT_GROUP_REDUCER,
        payload: {
          loadingPost: false,
        },
      });
    }
  };
};

export const getUserManagementGroupById = (id) => {
  return async (dispatch, getState) => {
    dispatch(
      changeUserManagementGroupReducer({
        loadingDialog: true,
      })
    );
    try {
      const response = await axios.get(`/v1/api/merchant/group/${id}`);

      dispatch({
        type: SET_DASHBOARD_USER_MANAGEMENT_GROUP_REDUCER,
        payload: {
          userManagementGroupDetailData: response?.data?.data,
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
        type: SET_DASHBOARD_USER_MANAGEMENT_GROUP_REDUCER,
        payload: {
          loadingDialog: false,
        },
      });
    }
  };
};

export const deleteUserManagementGroup = (id) => {
  return async (dispatch, getState) => {
    dispatch(
      changeUserManagementGroupReducer({
        loadingDelete: true,
      })
    );
    try {
      await axios.delete(`/v1/api/merchant/group/${id}`);

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
        type: SET_DASHBOARD_USER_MANAGEMENT_GROUP_REDUCER,
        payload: {
          loadingDelete: false,
        },
      });
    }
  };
};
