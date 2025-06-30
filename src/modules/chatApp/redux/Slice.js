import { createSlice } from "@reduxjs/toolkit";

const initAuthState = {
  /* Pop up */
  popUpState: "close", // enum ("close", "room", "inbox", "groupInbox", "groupRoom")

  /* Global Search User State */
  searchUserText: "",
  searchUserList: null,

  /* Private chating State */
  recentInboxUserList: null,
  selectedUserData: null,

  /* Group chating State */
  recentGroupChatUserList: null,
  selectedGroupData: null,

  /* Audio, Video Call State */
  // "accept", "decline", "",
  // "notCalling" , "calling", "callingTo" ,"inCall"
  callStage: "notCalling",
  callerData: null,
};

export const iChatAppSlice = createSlice({
  name: "iChatApp",
  initialState: initAuthState,
  reducers: {
    /* Popup Reducer */
    setPopUpState: (state, action) => {
      const { payload } = action;
      state.popUpState = payload;
    },

    /* Search User Reducer */
    setSearchUserText: (state, action) => {
      const { payload } = action;
      state.searchUserText = payload;
    },
    setSearchUserList: (state, action) => {
      const { payload } = action;
      state.searchUserList = payload;
    },

    /* Private Chat Reducer */
    setRecentInboxUserList: (state, action) => {
      const { payload } = action;
      state.recentInboxUserList = payload;
    },
    setSelectedUserData: (state, action) => {
      const { payload } = action;
      state.selectedUserData = payload;
    },

    /* Group Reducer */
    setRecentGroupChatUserList: (state, action) => {
      const { payload } = action;
      state.recentGroupChatUserList = payload;
    },
    setSelectedGroupData: (state, action) => {
      const { payload } = action;
      state.selectedGroupData = payload;
    },

    /* Calling State */
    setCallStage: (state, action) => {
      const { payload } = action;
      state.callStage = payload;
    },
    setInCommingCall: (state, action) => {
      const { payload } = action;
      state.inCommingCall = payload;
    },
    setCallerData: (state, action) => {
      const { payload } = action;
      state.callerData = payload;
    },

    /* Reset for logout */
    setResetData: (state, action) => {
      return initAuthState;
    },
  },
});
