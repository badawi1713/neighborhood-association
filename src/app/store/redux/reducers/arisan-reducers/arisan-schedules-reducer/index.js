import { SET_ARISAN_SCHEDULES_REDUCER } from 'app/store/redux/constants';
import moment from 'moment';

const initialState = {
  arisanSchedulesDetailData: null,
  arisanSchedulesFilterFormData: {
    filterDate: moment().format('YYYY-MM-DD'),
    paymentType: '0',
  },
  arisanSchedulesNameSearch: '',
  arisanSchedulesData: [],
  arisanSchedulesList: [],
  arisanSchedulesFilterList: [],
  arisanSchedulesSubGroupList: [],
  arisanSchedulesTypeList: [],
  arisanSchedulesClassList: [],
  arisanSchedulesWorkList: [],
  arisanSchedulesSortBy: 'id',
  arisanSchedulesSortType: 'desc',
  arisanSchedulesPage: 0,
  arisanSchedulesLimit: 10,
  arisanSchedulesTotal: 0,
  arisanSchedulesId: 0,
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

const arisanSchedulesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ARISAN_SCHEDULES_REDUCER:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default arisanSchedulesReducer;
