import { showMessage } from 'app/store/fuse/messageSlice';
import { SET_TRANSACTION_ARISAN_REDUCER } from 'app/store/redux/constants';
import axios from 'axios';
import { currencyFormat } from 'src/utils/utils';

export const changeTransactionArisanReducer = (data) => {
  return async (dispatch) => {
    dispatch({
      type: SET_TRANSACTION_ARISAN_REDUCER,
      payload: data,
    });
  };
};

export const getTransactionArisan = () => {
  return async (dispatch, getState) => {
    const { transactionArisanReducer } = getState();

    const {
      transactionArisanNameSearch,
      transactionArisanSortBy,
      transactionArisanSortType,
      transactionArisanPage,
      transactionArisanLimit,
    } = transactionArisanReducer;

    dispatch({
      type: SET_TRANSACTION_ARISAN_REDUCER,
      payload: {
        error: null,
        loading: true,
      },
    });
    try {
      const response = await axios.get(`/v1/api/arisan-transaksi`, {
        params: {
          pageNo: transactionArisanPage,
          pageSize: transactionArisanLimit,
          sort: transactionArisanSortType,
          sortBy: transactionArisanSortBy,
          nama: transactionArisanNameSearch,
        },
      });

      dispatch({
        type: SET_TRANSACTION_ARISAN_REDUCER,
        payload: {
          loading: false,
          transactionArisanData: response.data?.data?.content || [],
          transactionArisanTotal: response.data?.data?.totalElements || 0,
        },
      });
      return true;
    } catch (error) {
      if (error?.response?.status === 500) {
        dispatch({
          type: SET_TRANSACTION_ARISAN_REDUCER,
          payload: {
            error: 'Maaf, terjadi kesalahan. Silakan dicoba kembali.',
            loading: false,
          },
        });
      } else {
        dispatch({
          type: SET_TRANSACTION_ARISAN_REDUCER,
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

export const postTransactionArisan = (payload) => {
  return async (dispatch, getState) => {
    dispatch({
      type: SET_TRANSACTION_ARISAN_REDUCER,
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
        type: SET_TRANSACTION_ARISAN_REDUCER,
        payload: {
          loadingPost: false,
        },
      });
    }
  };
};

export const updateTransactionArisan = (payload, id) => {
  return async (dispatch, getState) => {
    dispatch({
      type: SET_TRANSACTION_ARISAN_REDUCER,
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
        type: SET_TRANSACTION_ARISAN_REDUCER,
        payload: {
          loadingPost: false,
        },
      });
    }
  };
};

export const getTransactionArisanById = (id) => {
  return async (dispatch, getState) => {
    dispatch(
      changeTransactionArisanReducer({
        loadingDialog: true,
      })
    );
    try {
      const response = await axios.get(`/v1/api/Anggota/${id}`);

      dispatch({
        type: SET_TRANSACTION_ARISAN_REDUCER,
        payload: {
          transactionArisanDetailData: response?.data?.data,
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
        type: SET_TRANSACTION_ARISAN_REDUCER,
        payload: {
          loadingDialog: false,
        },
      });
    }
  };
};

export const deleteTransactionArisan = (id) => {
  return async (dispatch, getState) => {
    dispatch(
      changeTransactionArisanReducer({
        loadingDelete: true,
      })
    );
    try {
      await axios.delete(`/v1/api/arisan-transaksi/${id}`);

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
        type: SET_TRANSACTION_ARISAN_REDUCER,
        payload: {
          loadingDelete: false,
        },
      });
    }
  };
};

export const getTransactionArisanPaymentList = (keyword) => {
  return async (dispatch) => {
    dispatch({
      type: SET_TRANSACTION_ARISAN_REDUCER,
      payload: {
        loadingList: true,
      },
    });
    try {
      const response = await axios.get(`/v1/api/Anggota/list-search/${keyword}`);

      dispatch({
        type: SET_TRANSACTION_ARISAN_REDUCER,
        payload: {
          transactionArisanPaymentList: response?.data?.data || [],
          loadingList: false,
        },
      });
    } catch (error) {
      if (error?.response?.status === 500) {
        dispatch({
          type: SET_TRANSACTION_ARISAN_REDUCER,
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
        type: SET_TRANSACTION_ARISAN_REDUCER,
        payload: {
          loadingList: false,
        },
      });
    }
  };
};

export const getTransactionArisanPaymentCheckedList = (id) => {
  return async (dispatch) => {
    dispatch({
      type: SET_TRANSACTION_ARISAN_REDUCER,
      payload: {
        loadingList: true,
      },
    });
    try {
      const response = await axios.get(`/v1/api/arisan-transaksi/inquiry/${id}`);

      dispatch({
        type: SET_TRANSACTION_ARISAN_REDUCER,
        payload: {
          transactionArisanPaymentCheckedList:
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
          type: SET_TRANSACTION_ARISAN_REDUCER,
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
        type: SET_TRANSACTION_ARISAN_REDUCER,
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
      type: SET_TRANSACTION_ARISAN_REDUCER,
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
        type: SET_TRANSACTION_ARISAN_REDUCER,
        payload: {
          loadingPost: false,
        },
      });
    }
  };
};

export const getArisanTransactionMemberList = () => {
  return async (dispatch) => {
    dispatch(
      changeTransactionArisanReducer({
        loadingList: true,
      })
    );
    try {
      const response = await axios.get(`/v1/api/Anggota/list`);

      dispatch({
        type: SET_TRANSACTION_ARISAN_REDUCER,
        payload: {
          transactionArisanMemberList: response?.data || [],
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
        type: SET_TRANSACTION_ARISAN_REDUCER,
        payload: {
          loadingList: false,
        },
      });
    }
  };
};

export const getArisanTransactionScheduleList = () => {
  return async (dispatch) => {
    dispatch(
      changeTransactionArisanReducer({
        loadingList: true,
      })
    );
    try {
      const response = await axios.get(`/v1/api/arisan-pertemuan/list`);

      dispatch({
        type: SET_TRANSACTION_ARISAN_REDUCER,
        payload: {
          transactionArisanScheduleList: response?.data || [],
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
        type: SET_TRANSACTION_ARISAN_REDUCER,
        payload: {
          loadingList: false,
        },
      });
    }
  };
};

export const handleArisanManualPayment = (payload) => {
  return async (dispatch, getState) => {
    dispatch({
      type: SET_TRANSACTION_ARISAN_REDUCER,
      payload: {
        loadingPost: true,
      },
    });
    try {
      await axios.post(`/v1/api/arisan-transaksi`, payload);

      dispatch(
        showMessage({
          message: 'Berhasil memproses tagihan manual!',
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
        type: SET_TRANSACTION_ARISAN_REDUCER,
        payload: {
          loadingPost: false,
        },
      });
    }
  };
};
