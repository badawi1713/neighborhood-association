import { showMessage } from 'app/store/fuse/messageSlice';
import { SET_ARISAN_MEMBERS_REDUCER } from 'app/store/redux/constants';
import axios from 'axios';

export const changeArisanMembersReducer = (data) => {
  return async (dispatch) => {
    dispatch({
      type: SET_ARISAN_MEMBERS_REDUCER,
      payload: data,
    });
  };
};

export const getArisanMembers = () => {
  return async (dispatch, getState) => {
    const { arisanMembersReducer } = getState();

    const {
      arisanMembersNameSearch,
      arisanMembersSortBy,
      arisanMembersSortType,
      arisanMembersPage,
      arisanMembersLimit,
    } = arisanMembersReducer;

    dispatch({
      type: SET_ARISAN_MEMBERS_REDUCER,
      payload: {
        error: null,
        loading: true,
      },
    });
    try {
      const response = await axios.get(`/v1/api/arisan-anggota`, {
        params: {
          pageNo: arisanMembersPage,
          pageSize: arisanMembersLimit,
          sort: arisanMembersSortType,
          sortBy: arisanMembersSortBy,
          nama: arisanMembersNameSearch,
        },
      });

      dispatch({
        type: SET_ARISAN_MEMBERS_REDUCER,
        payload: {
          loading: false,
          arisanMembersData: response.data?.data?.content || [],
          arisanMembersTotal: response.data?.data?.totalElements || 0,
        },
      });
      return true;
    } catch (error) {
      if (error?.response?.status === 500) {
        dispatch({
          type: SET_ARISAN_MEMBERS_REDUCER,
          payload: {
            error: 'Maaf, terjadi kesalahan. Silakan dicoba kembali.',
            loading: false,
          },
        });
      } else {
        dispatch({
          type: SET_ARISAN_MEMBERS_REDUCER,
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

export const postArisanMembers = (payload) => {
  return async (dispatch, getState) => {
    dispatch({
      type: SET_ARISAN_MEMBERS_REDUCER,
      payload: {
        loadingPost: true,
      },
    });
    try {
      await axios.post(`/v1/api/arisan-anggota`, payload);

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
        type: SET_ARISAN_MEMBERS_REDUCER,
        payload: {
          loadingPost: false,
        },
      });
    }
  };
};

export const updateArisanMembers = (payload) => {
  return async (dispatch) => {
    dispatch({
      type: SET_ARISAN_MEMBERS_REDUCER,
      payload: {
        loadingPost: true,
      },
    });
    try {
      await axios.put(`/v1/api/arisan-anggota`, payload);

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
        type: SET_ARISAN_MEMBERS_REDUCER,
        payload: {
          loadingPost: false,
        },
      });
    }
  };
};

export const getArisanMembersById = (id) => {
  return async (dispatch, getState) => {
    dispatch(
      changeArisanMembersReducer({
        loadingDialog: true,
      })
    );
    try {
      const response = await axios.get(`/v1/api/arisan-anggota/${id}`);

      dispatch({
        type: SET_ARISAN_MEMBERS_REDUCER,
        payload: {
          arisanMembersDetailData: response?.data?.data
            ? { ...response?.data?.data, nama: response?.data?.data?.anggota_name || '' }
            : null,
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
        type: SET_ARISAN_MEMBERS_REDUCER,
        payload: {
          loadingDialog: false,
        },
      });
    }
  };
};

export const deleteArisanMembers = (id) => {
  return async (dispatch, getState) => {
    dispatch(
      changeArisanMembersReducer({
        loadingDelete: true,
      })
    );
    try {
      await axios.delete(`/v1/api/arisan-anggota/${id}`);

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
        type: SET_ARISAN_MEMBERS_REDUCER,
        payload: {
          loadingDelete: false,
        },
      });
    }
  };
};

export const getArisanMembersList = () => {
  return async (dispatch, getState) => {
    dispatch({
      type: SET_ARISAN_MEMBERS_REDUCER,
      payload: {
        loadingList: true,
      },
    });
    try {
      const response = await axios.get(`/v1/api/Anggota/list`);

      dispatch({
        type: SET_ARISAN_MEMBERS_REDUCER,
        payload: {
          loadingList: false,
          arisanMembersList: response.data || [],
        },
      });
      return true;
    } catch (error) {
      if (error?.response?.status === 500) {
        dispatch({
          type: SET_ARISAN_MEMBERS_REDUCER,
          payload: {
            loadingList: false,
          },
        });
      } else {
        dispatch({
          type: SET_ARISAN_MEMBERS_REDUCER,
          payload: {
            loadingList: false,
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
