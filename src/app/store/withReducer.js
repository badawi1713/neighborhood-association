import { injectReducer } from 'app/store/index';

const withReducer = (key, reducer) => (WrappedComponent) => {
  injectReducer(key, reducer);

  return function (props) {
    return <WrappedComponent {...props} />;
  };
};

export default withReducer;
