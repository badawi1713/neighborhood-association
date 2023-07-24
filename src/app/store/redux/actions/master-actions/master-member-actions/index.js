import { showMessage } from 'app/store/fuse/messageSlice';
import { SET_MASTER_MEMBERS_REDUCER } from 'app/store/redux/constants';
import axios from 'axios';

export const changeMasterMembersReducer = (data) => {
  return async (dispatch) => {
    dispatch({
      type: SET_MASTER_MEMBERS_REDUCER,
      payload: data,
    });
  };
};

export const getMasterMembers = () => {
  return async (dispatch, getState) => {
    // const { masterMembersReducer } = getState();

    // const {
    //   masterMembersNameSearch,
    //   masterMembersSortBy,
    //   masterMembersSortType,
    //   masterMembersPage,
    //   masterMembersLimit,
    //   masterMembersFilterFormData,
    // } = masterMembersReducer;

    // const { paymentType, filterDate } = masterMembersFilterFormData;

    dispatch({
      type: SET_MASTER_MEMBERS_REDUCER,
      payload: {
        error: null,
        loading: true,
      },
    });
    try {
      const response = await axios.get(`/v1/api/Anggota`);

      dispatch({
        type: SET_MASTER_MEMBERS_REDUCER,
        payload: {
          loading: false,
          masterMembersData: response.data?.data?.content || [],
          masterMembersTotal: response.data?.data?.totalElements || 0,
        },
      });
      return true;
    } catch (error) {
      if (error?.response?.status === 500) {
        dispatch({
          type: SET_MASTER_MEMBERS_REDUCER,
          payload: {
            error: 'Maaf, terjadi kesalahan. Silakan dicoba kembali.',
            loading: false,
          },
        });
      } else {
        dispatch({
          type: SET_MASTER_MEMBERS_REDUCER,
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

export const postMasterMembers = (payload) => {
  return async (dispatch, getState) => {
    dispatch({
      type: SET_MASTER_MEMBERS_REDUCER,
      payload: {
        loadingPost: true,
      },
    });
    try {
      await axios.post(`/v1/api/Anggota`, payload);

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
        type: SET_MASTER_MEMBERS_REDUCER,
        payload: {
          loadingPost: false,
        },
      });
    }
  };
};

export const updateMasterMembers = (payload, id) => {
  return async (dispatch, getState) => {
    dispatch({
      type: SET_MASTER_MEMBERS_REDUCER,
      payload: {
        loadingPost: true,
      },
    });
    try {
      await axios.put(`/v1/api/Anggota/${id}`, payload);

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
        type: SET_MASTER_MEMBERS_REDUCER,
        payload: {
          loadingPost: false,
        },
      });
    }
  };
};

export const getMasterMembersById = (id) => {
  return async (dispatch, getState) => {
    dispatch(
      changeMasterMembersReducer({
        loadingDialog: true,
      })
    );
    try {
      const response = await axios.get(`/v1/api/Anggota/${id}`);

      dispatch({
        type: SET_MASTER_MEMBERS_REDUCER,
        payload: {
          masterMembersDetailData: response?.data?.data,
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
        type: SET_MASTER_MEMBERS_REDUCER,
        payload: {
          loadingDialog: false,
        },
      });
    }
  };
};

export const deleteMasterMembers = (id) => {
  return async (dispatch, getState) => {
    dispatch(
      changeMasterMembersReducer({
        loadingDelete: true,
      })
    );
    try {
      await axios.delete(`/v1/api/Anggota/${id}`);

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
        type: SET_MASTER_MEMBERS_REDUCER,
        payload: {
          loadingDelete: false,
        },
      });
    }
  };
};
