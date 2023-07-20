import { SET_DASHBOARD_BILL_TEMPLATES_REDUCER } from 'app/store/redux/constants';
import moment from 'moment';

const initialState = {
  billTemplateDetailData: null,
  billTemplateFilterFormData: {
    filterDate: moment().format('YYYY-MM-DD'),
    paymentType: '0',
  },
  billTemplateNameSearch: '',
  billTemplateData: [],
  billTemplateList: [],
  billTemplateFilterList: [],
  billTemplateSubGroupList: [],
  billTemplateTypeList: [],
  billTemplateClassList: [],
  billTemplateWorkList: [],
  billTemplateSortBy: 'id',
  billTemplateSortType: 'desc',
  billTemplatePage: 0,
  billTemplateLimit: 10,
  billTemplateTotal: 0,
  billTemplateId: 0,

  userListData: [],
  productListData: [],
  groupListData: [],

  isUserListEmpty: false,
  isProductListEmpty: false,
  isGroupListEmpty: false,

  billTemplateByUserData: [],
  billTemplateByProductData: [],

  dialogId: '',

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

const billTemplateReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DASHBOARD_BILL_TEMPLATES_REDUCER:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default billTemplateReducer;
