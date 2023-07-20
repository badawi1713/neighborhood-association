import { SET_SETTINGS_PROFILE_REDUCER } from 'app/store/redux/constants';

const initialState = {
  saldo: 0,

  loading: true,
  loadingList: true,
  loadingPost: false,
  loadingDelete: false,
  loadingDialog: false,
  loadingDetail: true,
  loadingValidation: false,
  error: false,
  errorDialog: false,
  errorDetail: false,
};

const profileSettingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SETTINGS_PROFILE_REDUCER:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default profileSettingsReducer;
