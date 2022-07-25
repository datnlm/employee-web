import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
import productReducer from './slices/product';
import groupReducer from './slices/group';
import employeePartnerReducer from './slices/employee-partner';

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: []
};

const productPersistConfig = {
  key: 'product',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout']
};

const rootReducer = combineReducers({
  product: persistReducer(productPersistConfig, productReducer),
  group: groupReducer,
  employeePartner: employeePartnerReducer
});

export { rootPersistConfig, rootReducer };
