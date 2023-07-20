import { showMessage } from 'app/store/fuse/messageSlice';
import { SET_DASHBOARD_PRODUCTS_REDUCER } from 'app/store/redux/constants';
import axios from 'axios';

export const changeProductReducer = (data) => {
  return async (dispatch) => {
    dispatch({
      type: SET_DASHBOARD_PRODUCTS_REDUCER,
      payload: data,
    });
  };
};

export const getProduct = () => {
  return async (dispatch, getState) => {
    // const { productReducer } = getState();

    // const {
    //   productNameSearch,
    //   productSortBy,
    //   productSortType,
    //   productPage,
    //   productLimit,
    //   productFilterFormData,
    // } = productReducer;

    // const { paymentType, filterDate } = productFilterFormData;

    dispatch({
      type: SET_DASHBOARD_PRODUCTS_REDUCER,
      payload: {
        error: null,
        loading: true,
      },
    });
    try {
      const response = await axios.get(`/v1/api/merchant/produk`);

      dispatch({
        type: SET_DASHBOARD_PRODUCTS_REDUCER,
        payload: {
          loading: false,
          productData: response.data?.data?.content || [],
          productTotal: response.data?.data?.totalElements || 0,
        },
      });
      return true;
    } catch (error) {
      if (error?.response?.status === 500) {
        dispatch({
          type: SET_DASHBOARD_PRODUCTS_REDUCER,
          payload: {
            error: 'Maaf, terjadi kesalahan. Silakan dicoba kembali.',
            loading: false,
          },
        });
      } else {
        dispatch({
          type: SET_DASHBOARD_PRODUCTS_REDUCER,
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

export const postProduct = (payload) => {
  return async (dispatch, getState) => {
    dispatch({
      type: SET_DASHBOARD_PRODUCTS_REDUCER,
      payload: {
        loadingPost: true,
      },
    });
    try {
      await axios.post(`/v1/api/merchant/produk`, payload);

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
        type: SET_DASHBOARD_PRODUCTS_REDUCER,
        payload: {
          loadingPost: false,
        },
      });
    }
  };
};

export const updateProduct = (payload, id) => {
  return async (dispatch, getState) => {
    dispatch({
      type: SET_DASHBOARD_PRODUCTS_REDUCER,
      payload: {
        loadingPost: true,
      },
    });
    try {
      await axios.put(`/v1/api/merchant/produk/${id}`, payload);

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
        type: SET_DASHBOARD_PRODUCTS_REDUCER,
        payload: {
          loadingPost: false,
        },
      });
    }
  };
};

export const getProductById = (id) => {
  return async (dispatch, getState) => {
    dispatch(
      changeProductReducer({
        loadingDialog: true,
      })
    );
    try {
      const response = await axios.get(`/v1/api/merchant/produk/${id}`);

      dispatch({
        type: SET_DASHBOARD_PRODUCTS_REDUCER,
        payload: {
          productDetailData: { ...response?.data?.data },
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
        type: SET_DASHBOARD_PRODUCTS_REDUCER,
        payload: {
          loadingDialog: false,
        },
      });
    }
  };
};

export const deleteProduct = (id) => {
  return async (dispatch, getState) => {
    dispatch(
      changeProductReducer({
        loadingDelete: true,
      })
    );
    try {
      await axios.delete(`/v1/api/merchant/produk/${id}`);

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
        type: SET_DASHBOARD_PRODUCTS_REDUCER,
        payload: {
          loadingDelete: false,
        },
      });
    }
  };
};
