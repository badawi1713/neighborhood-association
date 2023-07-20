import { SET_DASHBOARD_SALDO_MUTATION_REPORTS_REDUCER } from 'app/store/redux/constants';
import moment from 'moment';

const initialState = {
  saldoMutationReportsDetailData: null,
  saldoMutationReportsFilterFormData: {
    periode: moment().format('YYYY-MM'),
    status: '-1',
    groupId: '',
    memberId: '',
  },

  groupListData: [],
  isGroupListEmpty: true,

  saldoMutationReportsNameSearch: '',
  saldoMutationReportsData: [],
  saldoMutationReportsList: [],
  saldoMutationReportsFilterList: [],
  saldoMutationReportsSubProductList: [],
  saldoMutationReportsTypeList: [],
  saldoMutationReportsClassList: [],
  saldoMutationReportsWorkList: [],
  saldoMutationReportsSortBy: 'id',
  saldoMutationReportsSortType: 'desc',
  saldoMutationReportsPage: 0,
  saldoMutationReportsLimit: 10,
  saldoMutationReportsTotal: 0,
  saldoMutationReportsId: 0,
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

const saldoMutationReportsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DASHBOARD_SALDO_MUTATION_REPORTS_REDUCER:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default saldoMutationReportsReducer;
