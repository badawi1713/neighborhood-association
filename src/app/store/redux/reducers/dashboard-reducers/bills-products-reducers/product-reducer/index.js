import { SET_DASHBOARD_PRODUCTS_REDUCER } from 'app/store/redux/constants';
import moment from 'moment';

const initialState = {
  productDetailData: null,
  productFilterFormData: {
    filterDate: moment().format('YYYY-MM-DD'),
    paymentType: '0',
  },
  productNameSearch: '',
  productData: [],
  productList: [],
  productFilterList: [],
  productSubProductList: [],
  productTypeList: [],
  productClassList: [],
  productWorkList: [],
  productSortBy: 'id',
  productSortType: 'desc',
  productPage: 0,
  productLimit: 10,
  productTotal: 0,
  productId: 0,
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

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DASHBOARD_PRODUCTS_REDUCER:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default productReducer;
