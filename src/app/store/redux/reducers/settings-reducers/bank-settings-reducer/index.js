import { SET_SETTINGS_BANK_REDUCER } from 'app/store/redux/constants';
import moment from 'moment';

const initialState = {
  data: {
    cabang: '',
    last_updated: moment().format('YYYY-MM-DD HH:mm'),
    bank_id: '',
    nomor_rekening: '',
    status_name: '',
    bank_name: '',
    id: '',
    atas_nama: '',
  },
  saldo: 0,

  bankListData: [],

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

const bankSettingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SETTINGS_BANK_REDUCER:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default bankSettingsReducer;
