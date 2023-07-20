import { SET_DASHBOARD_BILLS_REDUCER } from 'app/store/redux/constants';
import moment from 'moment';

const initialState = {
  billDetailData: null,
  billFilterFormData: {
    periode: moment().format('YYYY-MM'),
    status: '-1',
    groupId: '',
    memberId: '',
  },

  groupListData: [],
  isGroupListEmpty: true,

  billNameSearch: '',
  billData: [],
  billList: [],
  billFilterList: [],
  billSubProductList: [],
  billTypeList: [],
  billClassList: [],
  billWorkList: [],
  billSortBy: 'id',
  billSortType: 'desc',
  billPage: 0,
  billLimit: 10,
  billTotal: 0,
  billId: 0,
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

const billReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DASHBOARD_BILLS_REDUCER:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default billReducer;
