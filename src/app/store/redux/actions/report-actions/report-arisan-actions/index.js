import { showMessage } from 'app/store/fuse/messageSlice';
import { SET_REPORT_ARISAN_REDUCER } from 'app/store/redux/constants';
import axios from 'axios';
import { currencyFormat } from 'src/utils/utils';

export const changeReportArisanReducer = (data) => {
  return async (dispatch) => {
    dispatch({
      type: SET_REPORT_ARISAN_REDUCER,
      payload: data,
    });
  };
};

export const getReportArisan = () => {
  return async (dispatch, getState) => {
    const { reportArisanReducer } = getState();

    const {
      reportArisanNameSearch,
      reportArisanSortBy,
      reportArisanSortType,
      reportArisanPage,
      reportArisanLimit,
    } = reportArisanReducer;

    dispatch({
      type: SET_REPORT_ARISAN_REDUCER,
      payload: {
        error: null,
        loading: true,
      },
    });
    try {
      const response = await axios.get(`/v1/api/arisan-report`, {
        params: {
          pageNo: reportArisanPage,
          pageSize: reportArisanLimit,
          sort: reportArisanSortType,
          sortBy: reportArisanSortBy,
          nama: reportArisanNameSearch,
        },
      });

      dispatch({
        type: SET_REPORT_ARISAN_REDUCER,
        payload: {
          loading: false,
          reportArisanData: response.data?.data?.content || [],
          reportArisanTotal: response.data?.data?.totalElements || 0,
        },
      });
      return true;
    } catch (error) {
      if (error?.response?.status === 500) {
        dispatch({
          type: SET_REPORT_ARISAN_REDUCER,
          payload: {
            error: 'Maaf, terjadi kesalahan. Silakan dicoba kembali.',
            loading: false,
          },
        });
      } else {
        dispatch({
          type: SET_REPORT_ARISAN_REDUCER,
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

export const postReportArisan = (payload) => {
  return async (dispatch, getState) => {
    dispatch({
      type: SET_REPORT_ARISAN_REDUCER,
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
        type: SET_REPORT_ARISAN_REDUCER,
        payload: {
          loadingPost: false,
        },
      });
    }
  };
};

export const updateReportArisan = (payload, id) => {
  return async (dispatch, getState) => {
    dispatch({
      type: SET_REPORT_ARISAN_REDUCER,
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
        type: SET_REPORT_ARISAN_REDUCER,
        payload: {
          loadingPost: false,
        },
      });
    }
  };
};

export const getReportArisanById = (id) => {
  return async (dispatch, getState) => {
    dispatch(
      changeReportArisanReducer({
        loadingDialog: true,
      })
    );
    try {
      const response = await axios.get(`/v1/api/Anggota/${id}`);

      dispatch({
        type: SET_REPORT_ARISAN_REDUCER,
        payload: {
          reportArisanDetailData: response?.data?.data,
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
        type: SET_REPORT_ARISAN_REDUCER,
        payload: {
          loadingDialog: false,
        },
      });
    }
  };
};

export const deleteReportArisan = (id) => {
  return async (dispatch, getState) => {
    dispatch(
      changeReportArisanReducer({
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
        type: SET_REPORT_ARISAN_REDUCER,
        payload: {
          loadingDelete: false,
        },
      });
    }
  };
};

export const getReportArisanPaymentList = (keyword) => {
  return async (dispatch) => {
    dispatch({
      type: SET_REPORT_ARISAN_REDUCER,
      payload: {
        loadingList: true,
      },
    });
    try {
      const response = await axios.get(`/v1/api/Anggota/list-search/${keyword}`);

      dispatch({
        type: SET_REPORT_ARISAN_REDUCER,
        payload: {
          reportArisanPaymentList: response?.data?.data || [],
          loadingList: false,
        },
      });
    } catch (error) {
      if (error?.response?.status === 500) {
        dispatch({
          type: SET_REPORT_ARISAN_REDUCER,
          payload: {
            loadingList: false,
          },
        });
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
      } else {
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
      }
      dispatch({
        type: SET_REPORT_ARISAN_REDUCER,
        payload: {
          loadingList: false,
        },
      });
    }
  };
};

export const getReportArisanPaymentCheckedList = (id) => {
  return async (dispatch) => {
    dispatch({
      type: SET_REPORT_ARISAN_REDUCER,
      payload: {
        loadingList: true,
      },
    });
    try {
      const response = await axios.get(`/v1/api/arisan-transaksi/inquiry/${id}`);

      dispatch({
        type: SET_REPORT_ARISAN_REDUCER,
        payload: {
          reportArisanPaymentCheckedList:
            response?.data?.data?.list?.length > 0
              ? response?.data?.data?.list?.map((item) => ({
                  ...item,
                  checked: true,
                  nama: `${item?.nama} - ${item?.pertemuan_ke} (${
                    item?.periode
                  }) - Rp${currencyFormat(item?.nominal || 0)}`,
                }))
              : [],
          loadingList: false,
        },
      });
    } catch (error) {
      if (error?.response?.status === 500) {
        dispatch({
          type: SET_REPORT_ARISAN_REDUCER,
          payload: {
            loadingList: false,
          },
        });
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
      } else {
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
      }
      dispatch({
        type: SET_REPORT_ARISAN_REDUCER,
        payload: {
          loadingList: false,
        },
      });
    }
  };
};

export const handleArisanPayment = (payload) => {
  return async (dispatch, getState) => {
    dispatch({
      type: SET_REPORT_ARISAN_REDUCER,
      payload: {
        loadingPost: true,
      },
    });
    try {
      await axios.post(`/v1/api/arisan-transaksi/payment`, payload);

      dispatch(
        showMessage({
          message: 'Berhasil melakukan pembayaran!',
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
        type: SET_REPORT_ARISAN_REDUCER,
        payload: {
          loadingPost: false,
        },
      });
    }
  };
};

export const getReportArisanStatusById = (id, type = 'sudah') => {
  return async (dispatch, getState) => {
    dispatch(
      changeReportArisanReducer({
        loadingDialog: true,
      })
    );
    const url =
      type === 'sudah'
        ? `/v1/api/arisan-report/sudah-bayar/${id}`
        : `/v1/api/arisan-report/belum-bayar/${id}`;
    try {
      const response = await axios.get(url);

      dispatch({
        type: SET_REPORT_ARISAN_REDUCER,
        payload: {
          reportArisanStatusDetailData: response?.data || [],
          reportArusanStatusTitle:
            type !== 'sudah' ? 'Daftar Arisan Belum Bayar' : 'Daftar Arisan Sudah Bayar',
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
        type: SET_REPORT_ARISAN_REDUCER,
        payload: {
          loadingDialog: false,
        },
      });
    }
  };
};
