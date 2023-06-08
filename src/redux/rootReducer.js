import { combineReducers } from "redux";
import { authSlice } from "../commonRedux/auth/slice";
import { localStorageSlice } from "../commonRedux/reduxForLocalStorage/slice";
import { iChatAppSlice } from "../modules/chatApp/redux/Slice";

export const rootReducer = combineReducers({
  localStorage: localStorageSlice?.reducer,
  auth: authSlice?.reducer,
  iChatApp: iChatAppSlice?.reducer,
});
