import { SET_TRANSACTION_ARISAN_REDUCER } from 'app/store/redux/constants';
import moment from 'moment';

const initialState = {
  transactionArisanDetailData: null,
  transactionArisanFilterFormData: {
    filterDate: moment().format('YYYY-MM-DD'),
  },
  transactionArisanNameSearch: '',
  transactionArisanMemberList: [],
  transactionArisanScheduleList: [],
  transactionArisanData: [],
  transactionArisanPaymentList: [],
  transactionArisanPaymentCheckedList: [],
  transactionArisanSortBy: 'id',
  transactionArisanSortType: 'desc',
  transactionArisanPage: 0,
  transactionArisanLimit: 10,
  transactionArisanTotal: 0,
  transactionArisanId: 0,
  loading: true,
  loadingList: false,
  loadingPost: false,
  loadingDelete: false,
  loadingDialog: false,
  loadingDetail: true,
  loadingValidation: false,
  error: false,
  errorDialog: false,
  errorDetail: false,
};

const transactionArisanReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TRANSACTION_ARISAN_REDUCER:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default transactionArisanReducer;
