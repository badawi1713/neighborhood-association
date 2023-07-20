import { SET_DASHBOARD_USER_MANAGEMENT_USER_REDUCER } from 'app/store/redux/constants';
import moment from 'moment';

const initialState = {
  userManagementUserDetailData: null,
  userManagementUserFilterFormData: {
    filterDate: moment().format('YYYY-MM-DD'),
    paymentType: '0',
  },
  userManagementUserNameSearch: '',
  userManagementUserData: [],
  userManagementUserList: [],
  userManagementUserFilterList: [],
  userManagementUserSubUserList: [],
  userManagementUserTypeList: [],
  userManagementUserClassList: [],
  userManagementUserWorkList: [],
  userManagementUserSortBy: 'id',
  userManagementUserSortType: 'desc',
  userManagementUserPage: 0,
  userManagementUserLimit: 10,
  userManagementUserTotal: 0,
  userManagementUserId: 0,
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

const userManagementUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DASHBOARD_USER_MANAGEMENT_USER_REDUCER:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default userManagementUserReducer;
