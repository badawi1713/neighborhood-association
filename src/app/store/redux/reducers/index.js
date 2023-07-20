import userManagementGroupReducer from './dashboard-reducers/user-management-reducers/user-management-group-reducer';
import userManagementUserReducer from './dashboard-reducers/user-management-reducers/user-management-user-reducer';
import productReducer from './dashboard-reducers/bills-products-reducers/product-reducer';
import billTemplateReducer from './dashboard-reducers/bills-products-reducers/bill-template-reducer';
import billReducer from './dashboard-reducers/bills-products-reducers/bill-reducer';
import saldoMutationReportsReducer from './dashboard-reducers/reports-reducers/saldo-mutation-reports-reducer';
import profileSettingsReducer from './settings-reducers/profile-settings-reducer';
import bankSettingsReducer from './settings-reducers/bank-settings-reducer';
import fundWithdrawalReducer from './dashboard-reducers/fund-withdrawal-reducers';

const reducers = {
  fundWithdrawalReducer,
  bankSettingsReducer,
  profileSettingsReducer,
  saldoMutationReportsReducer,
  billReducer,
  userManagementGroupReducer,
  userManagementUserReducer,
  productReducer,
  billTemplateReducer,
};

export default reducers;
