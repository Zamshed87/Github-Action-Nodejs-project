import { combineReducers } from "redux";
import { authSlice } from "../commonRedux/auth/slice";
import { localStorageSlice } from "../commonRedux/reduxForLocalStorage/slice";
import { chattingAppSlice } from "../modules/chattingApp/redux/Slice";
export const rootReducer = combineReducers({
  localStorage: localStorageSlice?.reducer,
  auth: authSlice?.reducer,
  chattingApp: chattingAppSlice?.reducer,
});
