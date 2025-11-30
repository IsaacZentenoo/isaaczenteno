import { configureStore, combineReducers } from '@reduxjs/toolkit';

const initialAuth = {
  token: localStorage.getItem('token') || null,
  username: localStorage.getItem('username') || null,
};
function authReducer(state = initialAuth, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { token: action.payload.token, username: action.payload.username };
    case 'LOGOUT':
      return { token: null, username: null };
    default:
      return state;
  }
}

const rootReducer = combineReducers({ auth: authReducer });
const store = configureStore({
  reducer: rootReducer,
});
export default store;