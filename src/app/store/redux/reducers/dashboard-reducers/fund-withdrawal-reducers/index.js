import { SET_DASHBOARD_FUND_WITHDRAWAL } from 'app/store/redux/constants';
import moment from 'moment';

const initialState = {
  fundWithdrawalDetailData: null,
  fundWithdrawalFilterFormData: {
    filterDate: moment().format('YYYY-MM-DD'),
    paymentType: '0',
  },
  fundWithdrawalNameSearch: '',
  fundWithdrawalData: [],
  fundWithdrawalList: [],
  fundWithdrawalFilterList: [],
  fundWithdrawalSubGroupList: [],
  fundWithdrawalTypeList: [],
  fundWithdrawalClassList: [],
  fundWithdrawalWorkList: [],
  fundWithdrawalSortBy: 'id',
  fundWithdrawalSortType: 'desc',
  fundWithdrawalPage: 0,
  fundWithdrawalLimit: 10,
  fundWithdrawalTotal: 0,
  fundWithdrawalId: 0,
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

const fundWithdrawalReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DASHBOARD_FUND_WITHDRAWAL:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default fundWithdrawalReducer;
