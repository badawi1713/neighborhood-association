import { SET_REPORT_ARISAN_REDUCER } from 'app/store/redux/constants';
import moment from 'moment';

const initialState = {
  reportArisanDetailData: null,
  reportArisanFilterFormData: {
    filterDate: moment().format('YYYY-MM-DD'),
  },
  reportArisanNameSearch: '',
  reportArisanData: [],
  reportArisanPaymentList: [],
  reportArisanPaymentCheckedList: [],
  reportArisanSortBy: 'id',
  reportArisanSortType: 'desc',
  reportArisanPage: 0,
  reportArisanLimit: 10,
  reportArisanTotal: 0,
  reportArisanId: 0,
  reportArisanStatusDetailData: [],
  reportArusanStatusTitle: 'Detail',
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

const reportArisanReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_REPORT_ARISAN_REDUCER:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default reportArisanReducer;
