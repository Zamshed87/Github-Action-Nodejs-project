import { createSlice } from "@reduxjs/toolkit";

const initState = {
  profileData: {
    isAuth: false,
    isLoggedInWithOtp: false,
    isOtpAuth: false,
    loginPin: "",
  },
  isExpiredToken: false,
  imageView: {},
  businessUnitDDL: [],
  workplaceGroupDDL: [],
  workplaceDDL: [],
  menuList: [],
  permissionList: [],
  userType: "Self",
  keywords: {},
  // for chatting
  messageInfo: "",
  selectedUser: "",
  tokenData: "",
  mostClickedMenuList: [], // this is for most clicked menu list]
  decodedTokenData: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initState,
  reducers: {
    setUserAndEmpName: (state, action) => {
      const { payload } = action;
      state.profileData = {
        ...state.profileData,
        userName: payload,
        fullname: payload,
      };
    },
    setLogin: (state, action) => {
      const { payload } = action;
      state.profileData = { ...payload, isAuth: true, isOtpAuth: false };
      state.isExpiredToken = false;
    },
    setIsOtpAuth: (state, action) => {
      const { payload } = action;
      state.profileData = payload;
    },
    setMenuList: (state, action) => {
      const { payload } = action;
      state.menuList = payload;
    },
    setKeywords: (state, action) => {
      const { payload } = action;
      state.keywords = payload;
    },
    setMessageInfo: (state, action) => {
      const { payload } = action;
      state.messageInfo = payload;
    },
    setSelectedUser: (state, action) => {
      const { payload } = action;
      state.selectedUser = payload;
    },
    setPermissionList: (state, action) => {
      const { payload } = action;
      state.permissionList = payload;
    },
    setBuDDL: (state, action) => {
      const { payload } = action;
      // if don't have any bu list, then make list by user own BU
      state.businessUnitDDL =
        payload?.length > 0
          ? payload
          : [
              {
                BusinessUnitId: state?.profileData?.buId,
                BusinessUnitName: state?.profileData?.buName,
                intLogoUrlId: state?.profileData?.intLogoUrlId,
              },
            ];
    },
    setWGDDL: (state, action) => {
      const { payload } = action;

      const modifyPayload = payload.map((itm) => {
        return {
          WorkplaceGroupId: itm?.intWorkplaceGroupId,
          WorkplaceGroupName: itm?.strWorkplaceGroup,
          WorkplaceGroupCode: itm?.strWorkplaceGroupCode,
        };
      });

      // if don't have any workplace list, then make list by user own workplace group
      state.workplaceGroupDDL =
        payload?.length > 0
          ? modifyPayload
          : [
              {
                WorkplaceGroupId: state?.profileData?.wgId,
                WorkplaceGroupName: state?.profileData?.wgName,
              },
            ];
    },
    setWDDL: (state, action) => {
      const { payload } = action;
      const modifyPayload = payload.map((itm) => {
        return {
          WorkplaceId: itm?.intWorkplaceId,
          WorkplaceName: itm?.strWorkplace,
          WorkplaceGroupCode: itm?.strWorkplaceCode,
        };
      });
      // console.log(state?.profileData);
      // if don't have any workplace list, then make list by user own workplace group
      state.workplaceDDL =
        payload?.length > 0
          ? modifyPayload
          : [
              {
                WorkplaceId: state?.profileData?.wId,
                WorkplaceName: state?.profileData?.wName,
              },
            ];
    },
    setBuIdName: (state, action) => {
      const { payload } = action;
      state.profileData.buName = payload?.buName;
      state.profileData.buId = payload?.buId;
      state.profileData.intLogoUrlId = payload?.intLogoUrlId;
    },
    setWgIdName: (state, action) => {
      const { payload } = action;

      state.profileData.wgName = payload?.wgName;
      state.profileData.wgId = payload?.wgId;
    },
    setWIdName: (state, action) => {
      const { payload } = action;

      state.profileData.wName = payload?.wName;
      state.profileData.wId = payload?.wId;
    },
    setVesselIdName: (state, action) => {
      const { payload } = action;
      state.profileData.vesselName = payload?.vesselName;
      state.profileData.vesselId = payload?.vesselId;
    },
    updateProPicString: (state, action) => {
      const { payload } = action;
      state.profileData.strProfileImageUrl = payload;
    },
    setLogout: (state) => {
      state.profileData = {
        isAuth: false,
        isLoggedInWithOtp: false,
        isOtpAuth: false,
        loginPin: "",
      };
      state.tokenData = "";
      state.isExpiredToken = false;
      state.decodedTokenData=null;
    },
    SetImageView: (state, action) => {
      const { payload } = action;
      state.imageView = payload;
    },
    SetDownlloadFileViewEmpty: (state) => {
      state.imageView = {
        url: "",
        type: "",
        model: false,
      };
    },
    setToken: (state, action) => {
      state.tokenData = action.payload;
    },
    setIsExpiredToken: (state, action) => {
      state.isExpiredToken = action.payload;
    },
    // This is for most clicked menu list updataion and clear
    updateMostClickedMenuList: (state, action) => {
      const { payload } = action;
      let newClickedMenu = JSON.parse(
        JSON.stringify([...state.mostClickedMenuList])
      );
      let found = newClickedMenu.find((item) => item?.to === payload?.to);
      if (found) {
        found.totalClicked = found?.totalClicked + 1;
      } else {
        newClickedMenu.unshift({ ...payload, totalClicked: 1 });
      }
      state.mostClickedMenuList = newClickedMenu;
    },
    clearMoseClickedMenuList: (state) => {
      state.mostClickedMenuList = [];
    },
    setDecodedTokenData: (state, action) => {
      const decodedToken = action.payload
      ? JSON.parse(atob(action.payload.split(".")[1]))
      : null;
      state.decodedTokenData = decodedToken;
    },
    // most clicked menu list updataion and clear end  -----------  

  },
});
