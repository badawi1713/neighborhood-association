import { SET_MASTER_MEMBERS_REDUCER } from 'app/store/redux/constants';
import moment from 'moment';

const initialState = {
  masterMembersDetailData: null,
  masterMembersFilterFormData: {
    filterDate: moment().format('YYYY-MM-DD'),
    paymentType: '0',
  },
  masterMembersNameSearch: '',
  masterMembersData: [],
  masterMembersSortBy: 'id',
  masterMembersSortType: 'desc',
  masterMembersPage: 0,
  masterMembersLimit: 10,
  masterMembersTotal: 0,
  masterMembersId: 0,
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

const masterMembersReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MASTER_MEMBERS_REDUCER:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default masterMembersReducer;
