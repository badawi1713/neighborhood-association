import ProductsConfig from './bills-products/products/productsConfig';
import GroupsConfig from './user-management/groups/groupsConfig';
import UsersConfig from './user-management/users/usersConfig';
import BillTemplatesConfig from './bills-products/bill-templates/billTemplatesConfig';
import BillsConfig from './bills-products/bills/billsConfig';
import SaldoMutationReportsConfig from './reports/saldo-mutation-reports/saldoMutationReportsConfig';
import FundWithdrawalConfig from './fund-withdrawal/fundWithdrawalConfig';

const dashboardConfigs = [
  BillsConfig,
  GroupsConfig,
  UsersConfig,
  ProductsConfig,
  BillTemplatesConfig,
  SaldoMutationReportsConfig,
  FundWithdrawalConfig,
];

export default dashboardConfigs;
