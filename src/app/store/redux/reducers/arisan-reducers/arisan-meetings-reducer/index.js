import { SET_ARISAN_MEETINGS_REDUCER } from 'app/store/redux/constants';
import moment from 'moment';

const initialState = {
  arisanMeetingsDetailData: null,
  arisanMeetingsFilterFormData: {
    filterDate: moment().format('YYYY-MM-DD'),
    paymentType: '0',
  },
  arisanMeetingsNameSearch: '',
  arisanMeetingsData: [],
  arisanMeetingsList: [],
  arisanMeetingsFilterList: [],
  arisanMeetingsSubGroupList: [],
  arisanMeetingsTypeList: [],
  arisanMeetingsClassList: [],
  arisanMeetingsWorkList: [],
  arisanMeetingsSortBy: 'id',
  arisanMeetingsSortType: 'desc',
  arisanMeetingsPage: 0,
  arisanMeetingsLimit: 10,
  arisanMeetingsTotal: 0,
  arisanMeetingsId: 0,
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

const arisanMeetingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ARISAN_MEETINGS_REDUCER:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default arisanMeetingsReducer;
