import { SET_DASHBOARD_USER_MANAGEMENT_GROUP_REDUCER } from 'app/store/redux/constants';
import moment from 'moment';

const initialState = {
  userManagementGroupDetailData: null,
  userManagementGroupFilterFormData: {
    filterDate: moment().format('YYYY-MM-DD'),
    paymentType: '0',
  },
  userManagementGroupNameSearch: '',
  userManagementGroupData: [],
  userManagementGroupList: [],
  userManagementGroupFilterList: [],
  userManagementGroupSubGroupList: [],
  userManagementGroupTypeList: [],
  userManagementGroupClassList: [],
  userManagementGroupWorkList: [],
  userManagementGroupSortBy: 'id',
  userManagementGroupSortType: 'desc',
  userManagementGroupPage: 0,
  userManagementGroupLimit: 10,
  userManagementGroupTotal: 0,
  userManagementGroupId: 0,
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

const userManagementGroupReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DASHBOARD_USER_MANAGEMENT_GROUP_REDUCER:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default userManagementGroupReducer;
