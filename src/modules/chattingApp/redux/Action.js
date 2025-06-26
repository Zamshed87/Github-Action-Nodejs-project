import { chattingAppSlice } from "./Slice";
const { actions } = chattingAppSlice;

export const setSelectedUserForChatAction = (data) => (dispatch) => {
  dispatch(actions.setSelectedUserForChat(data));
};
export const resetSelectedUserForChatAction = (data) => (dispatch) => {
  dispatch(actions.resetSelectedUserForChat(data));
};
export const setSignalRConnectionAction = (data) => (dispatch) => {
  dispatch(actions.setSignalRConnection(data));
};

// export const setLastUserForChattingAction = (data) => (dispatch) => {
//   dispatch(actions.setLastUserForChatting(data));
// };
// export const resetLastUserForChattingAction = (data) => (dispatch) => {
//   dispatch(actions.resetLastUserForChatting(data));
// };

export const setNotifyCountAction = (data) => (dispatch) => {
  dispatch(actions.setNotifyCount(data));
};

export const setMsgNotifyCountAction = (data) => (dispatch) => {
  dispatch(actions.setMsgNotifyCount(data));
};
