import { showMessage } from 'app/store/fuse/messageSlice';
import { SET_DASHBOARD_SALDO_MUTATION_REPORTS_REDUCER } from 'app/store/redux/constants';
import axios from 'axios';

export const changeSaldoMutationReportsReducer = (data) => {
  return async (dispatch) => {
    dispatch({
      type: SET_DASHBOARD_SALDO_MUTATION_REPORTS_REDUCER,
      payload: data,
    });
  };
};

export const getSaldoMutationReports = () => {
  return async (dispatch, getState) => {
    const { saldoMutationReportsReducer } = getState();

    const {
      saldoMutationReportsNameSearch,
      //   saldoMutationReportsSortBy,
      //   saldoMutationReportsSortType,
      saldoMutationReportsPage,
      saldoMutationReportsLimit,
      // saldoMutationReportsFilterFormData,
    } = saldoMutationReportsReducer;

    // const { periode, memberId, groupId, status } = saldoMutationReportsFilterFormData;
    // const selectedPeriode = periode ? moment(periode).format('YYYY-M') : moment().format('YYYY-M');

    dispatch({
      type: SET_DASHBOARD_SALDO_MUTATION_REPORTS_REDUCER,
      payload: {
        error: null,
        loading: true,
      },
    });
    try {
      const response = await axios.get(
        `/v1/api/merchant/mutasi?pageSize=${saldoMutationReportsLimit}&pageNo=${saldoMutationReportsPage}&search=${saldoMutationReportsNameSearch}`
      );

      dispatch({
        type: SET_DASHBOARD_SALDO_MUTATION_REPORTS_REDUCER,
        payload: {
          loading: false,
          saldoMutationReportsData: response.data?.data?.content || [],
          saldoMutationReportsTotal: response.data?.data?.totalElements || 0,
        },
      });
      return true;
    } catch (error) {
      if (error?.response?.status === 500) {
        dispatch({
          type: SET_DASHBOARD_SALDO_MUTATION_REPORTS_REDUCER,
          payload: {
            error: 'Maaf, terjadi kesalahan. Silakan dicoba kembali.',
            loading: false,
          },
        });
      } else {
        dispatch({
          type: SET_DASHBOARD_SALDO_MUTATION_REPORTS_REDUCER,
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

export const postSaldoMutationReports = (payload) => {
  return async (dispatch, getState) => {
    dispatch({
      type: SET_DASHBOARD_SALDO_MUTATION_REPORTS_REDUCER,
      payload: {
        loadingPost: true,
      },
    });
    try {
      await axios.post(`/v1/api/merchant/mutasi`, payload);

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
        type: SET_DASHBOARD_SALDO_MUTATION_REPORTS_REDUCER,
        payload: {
          loadingPost: false,
        },
      });
    }
  };
};

export const successManualSaldoMutationReports = (payload, id) => {
  return async (dispatch, getState) => {
    dispatch({
      type: SET_DASHBOARD_SALDO_MUTATION_REPORTS_REDUCER,
      payload: {
        loadingPost: true,
      },
    });
    try {
      await axios.put(`/v1/api/merchant/mutasi/sukses`, payload);

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
        type: SET_DASHBOARD_SALDO_MUTATION_REPORTS_REDUCER,
        payload: {
          loadingPost: false,
        },
      });
    }
  };
};

export const getSaldoMutationReportsById = (id) => {
  return async (dispatch, getState) => {
    dispatch(
      changeSaldoMutationReportsReducer({
        loadingDialog: true,
      })
    );
    try {
      const response = await axios.get(`/v1/api/merchant/mutasi/${id}`);

      dispatch({
        type: SET_DASHBOARD_SALDO_MUTATION_REPORTS_REDUCER,
        payload: {
          saldoMutationReportsDetailData: { ...response?.data?.data },
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
        type: SET_DASHBOARD_SALDO_MUTATION_REPORTS_REDUCER,
        payload: {
          loadingDialog: false,
        },
      });
    }
  };
};

export const deleteSaldoMutationReports = (id) => {
  return async (dispatch, getState) => {
    dispatch(
      changeSaldoMutationReportsReducer({
        loadingDelete: true,
      })
    );
    try {
      await axios.delete(`/v1/api/merchant/mutasi/${id}`);

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
        type: SET_DASHBOARD_SALDO_MUTATION_REPORTS_REDUCER,
        payload: {
          loadingDelete: false,
        },
      });
    }
  };
};

export const reminderSaldoMutationReports = (id) => {
  return async (dispatch, getState) => {
    dispatch(
      changeSaldoMutationReportsReducer({
        loadingPost: true,
      })
    );
    const payload = {
      id,
    };
    try {
      await axios.post(`/v1/api/merchant/mutasi/reminder`, payload);

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
        type: SET_DASHBOARD_SALDO_MUTATION_REPORTS_REDUCER,
        payload: {
          loadingPost: false,
        },
      });
    }
  };
};

export const getSaldoMutationReportsGroupList = () => {
  return async (dispatch) => {
    dispatch({
      type: SET_DASHBOARD_SALDO_MUTATION_REPORTS_REDUCER,
      payload: {
        loadingList: true,
        isGroupListEmpty: false,
      },
    });
    try {
      const response = await axios.get(`/v1/api/merchant/group`);

      dispatch({
        type: SET_DASHBOARD_SALDO_MUTATION_REPORTS_REDUCER,
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
        type: SET_DASHBOARD_SALDO_MUTATION_REPORTS_REDUCER,
        payload: {
          groupListData: [],
          isGroupListEmpty: true,
        },
      });
    }
  };
};
