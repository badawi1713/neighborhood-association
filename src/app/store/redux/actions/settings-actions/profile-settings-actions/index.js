import { showMessage } from 'app/store/fuse/messageSlice';
import { SET_SETTINGS_PROFILE_REDUCER } from 'app/store/redux/constants';
import axios from 'axios';

export const changeProfileSettingsReducer = (data) => {
  return async (dispatch) => {
    dispatch({
      type: SET_SETTINGS_PROFILE_REDUCER,
      payload: data,
    });
  };
};

export const getProfileSaldo = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`/v1/api/merchant/user/profile`);

      dispatch({
        type: SET_SETTINGS_PROFILE_REDUCER,
        payload: {
          saldo: response?.data?.data?.saldo || 0,
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
    }
  };
};
