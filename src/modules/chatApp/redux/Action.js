import { iChatAppSlice } from "./Slice";
const { actions } = iChatAppSlice;

/* Popup Action */
export const setPopUpStateAction = (data) => (dispatch) => {
  dispatch(actions.setPopUpState(data));
};

/* Search User Action */
export const setSearchUserTextAction = (data) => (dispatch) => {
  dispatch(actions.setSearchUserText(data));
};
export const setSearchUserListAction = (data) => (dispatch) => {
  dispatch(actions.setSearchUserList(data));
};

/* Private Chat Action */
export const setRecentInboxUserListAction = (data) => (dispatch) => {
  dispatch(actions.setRecentInboxUserList(data));
};
export const setSelectedUserDataAction = (data) => (dispatch) => {
  dispatch(actions.setSelectedUserData(data));
};

/* Group Chat Action */
export const setRecentGroupChatUserListAction = (data) => (dispatch) => {
  dispatch(actions.setRecentGroupChatUserList(data));
};
export const setSelectedGroupDataAction = (data) => (dispatch) => {
  dispatch(actions.setSelectedGroupData(data));
};

/* Calling Action */
export const setCallStageAction = (data) => (dispatch) => {
  dispatch(actions.setCallStage(data));
};
export const setInCommingCallAction = (data) => (dispatch) => {
  dispatch(actions.setInCommingCall(data));
};
export const setCallerDataAction = (data) => (dispatch) => {
  dispatch(actions.setCallerData(data));
};

/* Reset Action */
export const setResetDataAction = (data) => (dispatch) => {
  dispatch(actions.setResetData(data));
};
