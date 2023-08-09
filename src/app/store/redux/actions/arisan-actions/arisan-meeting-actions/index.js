import { showMessage } from 'app/store/fuse/messageSlice';
import { SET_ARISAN_MEETINGS_REDUCER } from 'app/store/redux/constants';
import axios from 'axios';

export const changeArisanMeetingsReducer = (data) => {
  return async (dispatch) => {
    dispatch({
      type: SET_ARISAN_MEETINGS_REDUCER,
      payload: data,
    });
  };
};

export const getArisanMeetings = () => {
  return async (dispatch, getState) => {
    const { arisanMeetingsReducer } = getState();

    const {
      arisanMeetingsNameSearch,
      arisanMeetingsSortBy,
      arisanMeetingsSortType,
      arisanMeetingsPage,
      arisanMeetingsLimit,
    } = arisanMeetingsReducer;

    dispatch({
      type: SET_ARISAN_MEETINGS_REDUCER,
      payload: {
        error: null,
        loading: true,
      },
    });
    try {
      const response = await axios.get(`/v1/api/arisan-pertemuan`, {
        params: {
          pageNo: arisanMeetingsPage,
          pageSize: arisanMeetingsLimit,
          sort: arisanMeetingsSortType,
          sortBy: arisanMeetingsSortBy,
          nama: arisanMeetingsNameSearch,
        },
      });

      dispatch({
        type: SET_ARISAN_MEETINGS_REDUCER,
        payload: {
          loading: false,
          arisanMeetingsData: response.data?.data?.content || [],
          arisanMeetingsTotal: response.data?.data?.totalElements || 0,
        },
      });
      return true;
    } catch (error) {
      if (error?.response?.status === 500) {
        dispatch({
          type: SET_ARISAN_MEETINGS_REDUCER,
          payload: {
            error: 'Maaf, terjadi kesalahan. Silakan dicoba kembali.',
            loading: false,
          },
        });
      } else {
        dispatch({
          type: SET_ARISAN_MEETINGS_REDUCER,
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

export const postArisanMeetings = (payload) => {
  return async (dispatch, getState) => {
    dispatch({
      type: SET_ARISAN_MEETINGS_REDUCER,
      payload: {
        loadingPost: true,
      },
    });
    try {
      await axios.post(`/v1/api/arisan-pertemuan`, payload);

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
        type: SET_ARISAN_MEETINGS_REDUCER,
        payload: {
          loadingPost: false,
        },
      });
    }
  };
};

export const updateArisanMeetings = (payload, id) => {
  return async (dispatch, getState) => {
    dispatch({
      type: SET_ARISAN_MEETINGS_REDUCER,
      payload: {
        loadingPost: true,
      },
    });
    try {
      await axios.put(`/v1/api/arisan-pertemuan`, payload);

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
        type: SET_ARISAN_MEETINGS_REDUCER,
        payload: {
          loadingPost: false,
        },
      });
    }
  };
};

export const getArisanMeetingsById = (id) => {
  return async (dispatch, getState) => {
    dispatch(
      changeArisanMeetingsReducer({
        loadingDialog: true,
      })
    );
    try {
      const response = await axios.get(`/v1/api/arisan-pertemuan/${id}`);

      dispatch({
        type: SET_ARISAN_MEETINGS_REDUCER,
        payload: {
          arisanMeetingsDetailData: response?.data?.data,
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
        type: SET_ARISAN_MEETINGS_REDUCER,
        payload: {
          loadingDialog: false,
        },
      });
    }
  };
};

export const deleteArisanMeetings = (id) => {
  return async (dispatch, getState) => {
    dispatch(
      changeArisanMeetingsReducer({
        loadingDelete: true,
      })
    );
    try {
      await axios.delete(`/v1/api/arisan-pertemuan/${id}`);

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
        type: SET_ARISAN_MEETINGS_REDUCER,
        payload: {
          loadingDelete: false,
        },
      });
    }
  };
};
