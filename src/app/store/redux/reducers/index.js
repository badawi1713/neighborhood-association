import arisanMeetingsReducer from './arisan-reducers/arisan-meetings-reducer';
import arisanMembersReducer from './arisan-reducers/arisan-members-reducer';
import masterMembersReducer from './master-reducers/master-members-reducer';
import transactionArisanReducer from './transaction-reducers/transaction-arisan-reducers';
import reportArisanReducer from './report-reducers/report-arisan-reducers';

const reducers = {
  arisanMembersReducer,
  arisanMeetingsReducer,
  masterMembersReducer,
  transactionArisanReducer,
  reportArisanReducer,
};

export default reducers;
