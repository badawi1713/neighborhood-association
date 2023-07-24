import { SET_ARISAN_MEMBERS_REDUCER } from 'app/store/redux/constants';
import moment from 'moment';

const initialState = {
  arisanMembersDetailData: null,
  arisanMembersFilterFormData: {
    filterDate: moment().format('YYYY-MM-DD'),
    paymentType: '0',
  },
  arisanMembersNameSearch: '',
  arisanMembersData: [],
  arisanMembersList: [],
  arisanMembersFilterList: [],
  arisanMembersSubGroupList: [],
  arisanMembersTypeList: [],
  arisanMembersClassList: [],
  arisanMembersWorkList: [],
  arisanMembersSortBy: 'id',
  arisanMembersSortType: 'desc',
  arisanMembersPage: 0,
  arisanMembersLimit: 10,
  arisanMembersTotal: 0,
  arisanMembersId: 0,
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

const arisanMembersReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ARISAN_MEMBERS_REDUCER:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default arisanMembersReducer;
