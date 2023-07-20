import { showMessage } from 'app/store/fuse/messageSlice';
import { SET_DASHBOARD_BILL_TEMPLATES_REDUCER } from 'app/store/redux/constants';
import axios from 'axios';
import moment from 'moment';

export const changeBillTemplateReducer = (data) => {
  return async (dispatch) => {
    dispatch({
      type: SET_DASHBOARD_BILL_TEMPLATES_REDUCER,
      payload: data,
    });
  };
};

export const getBillTemplate = () => {
  return async (dispatch, getState) => {
    const { billTemplateReducer } = getState();

    const {
      billTemplateNameSearch,
      // billTemplateSortBy,
      // billTemplateSortType,
      billTemplatePage,
      billTemplateLimit,
      // billTemplateFilterFormData,
    } = billTemplateReducer;

    // const { paymentType, filterDate } = billTemplateFilterFormData;

    dispatch({
      type: SET_DASHBOARD_BILL_TEMPLATES_REDUCER,
      payload: {
        error: null,
        loading: true,
      },
    });
    try {
      const response =
        await axios.get(`/v1/api/merchant/tagihan-template?pageSize=${billTemplateLimit}&pageNo=${billTemplatePage}&search=${billTemplateNameSearch}
      `);

      dispatch({
        type: SET_DASHBOARD_BILL_TEMPLATES_REDUCER,
        payload: {
          loading: false,
          billTemplateData: response.data?.data?.content || [],
          billTemplateTotal: response.data?.data?.totalElements || 0,
        },
      });
      return true;
    } catch (error) {
      if (error?.response?.status === 500) {
        dispatch({
          type: SET_DASHBOARD_BILL_TEMPLATES_REDUCER,
          payload: {
            error: 'Maaf, terjadi kesalahan. Silakan dicoba kembali.',
            loading: false,
          },
        });
      } else {
        dispatch({
          type: SET_DASHBOARD_BILL_TEMPLATES_REDUCER,
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

export const postBillTemplate = (payload) => {
  return async (dispatch, getState) => {
    dispatch({
      type: SET_DASHBOARD_BILL_TEMPLATES_REDUCER,
      payload: {
        loadingPost: true,
      },
    });
    try {
      await axios.post(`/v1/api/merchant/tagihan-template`, payload);

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
        type: SET_DASHBOARD_BILL_TEMPLATES_REDUCER,
        payload: {
          loadingPost: false,
        },
      });
    }
  };
};

export const updateBillTemplate = (payload, id) => {
  return async (dispatch, getState) => {
    dispatch({
      type: SET_DASHBOARD_BILL_TEMPLATES_REDUCER,
      payload: {
        loadingPost: true,
      },
    });
    try {
      await axios.put(`/v1/api/merchant/tagihan-template/${id}`, payload);

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
        type: SET_DASHBOARD_BILL_TEMPLATES_REDUCER,
        payload: {
          loadingPost: false,
        },
      });
    }
  };
};

export const updateBillTemplateStatus = (status, id) => {
  return async (dispatch, getState) => {
    dispatch({
      type: SET_DASHBOARD_BILL_TEMPLATES_REDUCER,
      payload: {
        loadingPost: true,
      },
    });
    try {
      await axios.put(`/v1/api/merchant/tagihan-template/status?id=${id}&status=${status}
      `);

      dispatch(
        showMessage({
          message: 'Berhasil mengubah status!',
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
        type: SET_DASHBOARD_BILL_TEMPLATES_REDUCER,
        payload: {
          loadingPost: false,
        },
      });
    }
  };
};

export const getBillTemplateById = (id) => {
  return async (dispatch, getState) => {
    dispatch(
      changeBillTemplateReducer({
        dialogId: '',
        loadingDialog: true,
      })
    );
    try {
      const response = await axios.get(`/v1/api/merchant/tagihan-template/${id}`);
      const dateString = response?.data?.data?.until_periode || '2023-1';
      const [year, month] = dateString.split('-');
      const date = new Date(+year, +month - 1);
      const periode = moment(date).format('YYYY-MM');
      dispatch({
        type: SET_DASHBOARD_BILL_TEMPLATES_REDUCER,
        payload: {
          dialogId: id,
          billTemplateDetailData: {
            admin: '0',
            denda: '0',

            list_user: [],
            list_produk: [],
            group_id: '',
            ...response?.data?.data,
            until_periode: periode,
            tanggal_mulai: response?.data?.data?.tanggal_tagihan,
            tanggal_akhir: response?.data?.data?.tanggal_tempo,
            type: response?.data?.data?.type_id,
          },
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
        type: SET_DASHBOARD_BILL_TEMPLATES_REDUCER,
        payload: {
          loadingDialog: false,
        },
      });
    }
  };
};

export const deleteBillTemplate = (id) => {
  return async (dispatch, getState) => {
    dispatch(
      changeBillTemplateReducer({
        loadingDelete: true,
      })
    );
    try {
      await axios.delete(`/v1/api/merchant/tagihan-template/${id}`);

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
        type: SET_DASHBOARD_BILL_TEMPLATES_REDUCER,
        payload: {
          loadingDelete: false,
        },
      });
    }
  };
};

export const getBillTemplateUserList = () => {
  return async (dispatch) => {
    dispatch({
      type: SET_DASHBOARD_BILL_TEMPLATES_REDUCER,
      payload: {
        loadingList: true,
        isUserListEmpty: false,
      },
    });
    try {
      const response = await axios.get(`/v1/api/merchant/user`);

      dispatch({
        type: SET_DASHBOARD_BILL_TEMPLATES_REDUCER,
        payload: {
          userListData: response?.data?.data?.content || [],
          isUserListEmpty: response?.data?.data?.content?.length === 0,
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
        type: SET_DASHBOARD_BILL_TEMPLATES_REDUCER,
        payload: {
          userListData: [],
          isUserListEmpty: true,
        },
      });
    }
  };
};

export const getBillTemplateProductList = () => {
  return async (dispatch) => {
    dispatch({
      type: SET_DASHBOARD_BILL_TEMPLATES_REDUCER,
      payload: {
        loadingList: true,
        isProductListEmpty: false,
      },
    });
    try {
      const response = await axios.get(`/v1/api/merchant/produk`);

      dispatch({
        type: SET_DASHBOARD_BILL_TEMPLATES_REDUCER,
        payload: {
          productListData: response?.data?.data?.content || [],
          isProductListEmpty: response?.data?.data?.content?.length === 0,
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
        type: SET_DASHBOARD_BILL_TEMPLATES_REDUCER,
        payload: {
          productListData: [],
          isProductListEmpty: true,
        },
      });
    }
  };
};

export const getBillTemplateGroupList = () => {
  return async (dispatch) => {
    dispatch({
      type: SET_DASHBOARD_BILL_TEMPLATES_REDUCER,
      payload: {
        loadingList: true,
        isGroupListEmpty: false,
      },
    });
    try {
      const response = await axios.get(`/v1/api/merchant/group`);

      dispatch({
        type: SET_DASHBOARD_BILL_TEMPLATES_REDUCER,
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
        type: SET_DASHBOARD_BILL_TEMPLATES_REDUCER,
        payload: {
          groupListData: [],
          isGroupListEmpty: true,
        },
      });
    }
  };
};

export const getBillTemplateByUser = (id) => {
  return async (dispatch, getState) => {
    dispatch(
      changeBillTemplateReducer({
        dialogId: '',
        loadingDialog: true,
        billTemplateByUserData: [],
      })
    );
    try {
      const response = await axios.get(`/v1/api/merchant/tagihan-template/user/${id}`);
      dispatch({
        type: SET_DASHBOARD_BILL_TEMPLATES_REDUCER,
        payload: {
          dialogId: id,
          billTemplateByUserData: response?.data?.data || [],
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
        type: SET_DASHBOARD_BILL_TEMPLATES_REDUCER,
        payload: {
          loadingDialog: false,
        },
      });
    }
  };
};

export const getBillTemplateByProduct = (id) => {
  return async (dispatch, getState) => {
    dispatch(
      changeBillTemplateReducer({
        dialogId: '',
        loadingDialog: true,
        billTemplateByProductData: [],
      })
    );
    try {
      const response = await axios.get(`/v1/api/merchant/tagihan-template/produk/${id}`);
      dispatch({
        type: SET_DASHBOARD_BILL_TEMPLATES_REDUCER,
        payload: {
          dialogId: id,
          billTemplateByProductData: response?.data?.data || [],
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
        type: SET_DASHBOARD_BILL_TEMPLATES_REDUCER,
        payload: {
          loadingDialog: false,
        },
      });
    }
  };
};

export const updateBillTemplateByUserData = (payload, id) => {
  return async (dispatch, getState) => {
    dispatch({
      type: SET_DASHBOARD_BILL_TEMPLATES_REDUCER,
      payload: {
        loadingPost: true,
      },
    });
    try {
      await axios.put(`/v1/api/merchant/tagihan-template/user/${id}`, payload);

      dispatch(
        showMessage({
          message: 'Berhasil validasi data user!',
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
        type: SET_DASHBOARD_BILL_TEMPLATES_REDUCER,
        payload: {
          loadingPost: false,
        },
      });
    }
  };
};

export const updateBillTemplateByProductData = (payload, id) => {
  return async (dispatch, getState) => {
    dispatch({
      type: SET_DASHBOARD_BILL_TEMPLATES_REDUCER,
      payload: {
        loadingPost: true,
      },
    });
    try {
      await axios.put(`/v1/api/merchant/tagihan-template/produk/${id}`, payload);

      dispatch(
        showMessage({
          message: 'Berhasil validasi data produk!',
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
        type: SET_DASHBOARD_BILL_TEMPLATES_REDUCER,
        payload: {
          loadingPost: false,
        },
      });
    }
  };
};

export const payBillTemplate = (id) => {
  return async (dispatch, getState) => {
    dispatch(
      changeBillTemplateReducer({
        loadingPost: true,
      })
    );
    try {
      await axios.post(`/v1/api/merchant/tagihan-template/tagihkan/${id}`);

      dispatch(
        showMessage({
          message: 'Berhasil menagihkan tagihan!',
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
        type: SET_DASHBOARD_BILL_TEMPLATES_REDUCER,
        payload: {
          loadingPost: false,
        },
      });
    }
  };
};
