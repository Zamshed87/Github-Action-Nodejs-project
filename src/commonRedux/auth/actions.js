import { toast } from "react-toastify";
import { setCookie } from "../../utility/cookie";
import {
  clearCompensationBenefitsLSAction,
  setDataAction,
} from "../reduxForLocalStorage/actions";
import * as requestFromServer from "./api";
import { authSlice } from "./slice";
const { actions: slice } = authSlice;

export const updateEmpProfilePicString = (string) => (dispatch) => {
  dispatch(slice.updateProPicString(string));
};

export const updateUerAndEmpNameAction = (name) => (dispatch) => {
  dispatch(slice.setUserAndEmpName(name));
};

export const setLoginAction =
  (email, password, history, setLoading) => (dispatch) => {
    setLoading(true);
    return requestFromServer
      .loginApiCall(email, password)
      .then((res) => {
        const {
          strLoginId,
          intAccountId,
          token,
          strDisplayName,
          intBusinessUnitId,
          strBusinessUnit,
          intWorkplaceGroupId,
          intWorkplaceId,
          strWorkplace,
          strWorkplaceGroup,
          logoUrl,
          intEmployeeId,
          isLoggedInWithOtp,
          strOfficeMail,
          strPersonalMail,
          isOwner,
        } = res?.data;
        let obj = {
          ...res?.data,
          strLoginId,
          userName: strDisplayName,
          orgId: intAccountId,
          email: strLoginId,
          token,
          buId: intBusinessUnitId,
          buName: strBusinessUnit,
          wgId: intWorkplaceGroupId,
          wId: intWorkplaceId,
          wgName: strWorkplaceGroup,
          logWgId: intWorkplaceGroupId,
          wName: strWorkplace,
          insertUserId: strLoginId,
          buLogo: logoUrl,
          employeeId: intEmployeeId,
          isLoggedInWithOtp,
          strOfficeMail,
          strPersonalMail,
          isOwner,
        };
        dispatch(slice.setToken(res?.data?.token));
        if (res?.data?.isLoggedInWithOtp) {
          if (res?.data?.strOfficeMail || res?.data?.strPersonalMail) {
            requestFromServer
              .getLoginOTP(
                res?.data?.strOfficeMail || res?.data?.strPersonalMail
              )
              .then((res) => {
                setLoading(false);
                obj = {
                  ...obj,
                  loginPin: +res?.data?.message,
                };
                history.push("/verifypin");
                dispatch(slice.setLogin(obj));
              })
              .catch(() => {
                setLoading(false);
                toast.error("Login failed, please try again");
              });
          } else {
            setLoading(false);
            toast.warning("Please configure your email address!!!");
          }
        } else {
          setLoading(false);
          history.push("/");
          dispatch(slice.setLogin(obj));
        }
      })
      .catch((error) => {
        setLoading(false);
        toast.error(
          error?.response?.data?.message || "Login failed, please try again"
        );
      });
  };

export const isOtpAuthAction = (data) => (dispatch) => {
  dispatch(slice.setIsOtpAuth(data));
};

export const setLogoutAction = () => (dispatch) => {
  setCookie(
    "profileData",
    JSON.stringify({
      isAuth: false,
      isLoggedInWithOtp: false,
      isOtpAuth: false,
      loginPin: "",
    }),
    100
  );
  dispatch(slice.setLogout());
  dispatch(slice.clearMoseClickedMenuList());
  dispatch(clearCompensationBenefitsLSAction());
  dispatch(setDataAction("empManegmentData", "current", 1));
  dispatch(setDataAction("empManegmentData", "pageSize", 100));
};

export const updateBuAction = (buId, buName, intLogoUrlId) => (dispatch) => {
  dispatch(slice.setBuIdName({ buId, buName, intLogoUrlId }));
};

export const updateWgAction = (wgId, wgName) => (dispatch) => {
  dispatch(slice.setWgIdName({ wgId, wgName }));
};
export const updateWAction = (wId, wName) => (dispatch) => {
  dispatch(slice.setWIdName({ wId, wName }));
};

export const setMessageInfoAction = (messageInfo) => (dispatch) => {
  dispatch(slice.setMessageInfo(messageInfo));
};
export const setSelectedUserAction = (user) => (dispatch) => {
  dispatch(slice.setSelectedUser(user));
};

export const getBuDDLAction = (accId, buId, employeeId) => (dispatch) => {
  requestFromServer
    .geBuDDL(accId, buId, employeeId)
    .then((res) => {
      dispatch(slice.setBuDDL(res?.data));
    })
    .catch(() => {
      dispatch(slice.setBuDDL([]));
    });
};

export const getWGDDLAction = (buId, wgId, employeeId) => (dispatch) => {
  requestFromServer
    .getWGDDL(buId, wgId, employeeId)
    .then((res) => {
      dispatch(slice.setWGDDL(res?.data));
    })
    .catch(() => {
      dispatch(slice.setWGDDL([]));
    });
};

export const getWDDLAction = (buId, wgId, employeeId) => (dispatch) => {
  requestFromServer
    .getWDDL(buId, wgId, employeeId)
    .then((res) => {
      dispatch(slice.setWDDL(res?.data));
    })
    .catch(() => {
      dispatch(slice.setWDDL([]));
    });
};

export const getMenuListAction = (employeeId, setLoading) => (dispatch) => {
  setLoading(true);
  requestFromServer
    .getMenuList(employeeId)
    .then((res) => {
      setLoading(false);
      dispatch(slice.setMenuList(res?.data));
    })
    .catch(() => {
      setLoading(false);
      dispatch(slice.setMenuList([]));
    });
};
export const getKeywordsAction =
  (orgId, setLoading, lang = "english") =>
  (dispatch) => {
    setLoading(true);
    requestFromServer
      .getKeywords(orgId, lang)
      .then((res) => {
        setLoading(false);
        dispatch(slice.setKeywords(res?.data));
      })
      .catch(() => {
        setLoading(false);
        dispatch(slice.setKeywords({}));
      });
  };

export const getPermissionListAction = (userId, setLoading) => (dispatch) => {
  setLoading && setLoading(true);
  requestFromServer
    .getPermissionList(userId)
    .then((res) => {
      setLoading && setLoading(false);
      dispatch(slice.setPermissionList(res?.data));
    })
    .catch(() => {
      setLoading && setLoading(false);
      dispatch(slice.setPermissionList([]));
    });
};

// getDownlloadFileView_Action
export const getDownlloadFileView_Action =
  (id, closeModal, cb, setLoading) => (dispatch) => {
    setLoading && setLoading(true);
    requestFromServer.getDownlloadFileView(id).then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        const obj = {
          url: res?.config?.url,
          type: res?.headers?.["content-type"],
          model: closeModal ? false : true,
        };
        dispatch(slice.SetImageView(obj));

        cb && cb();
        setLoading && setLoading(false);
      }
    });
  };

// getDownlloadFileView_Action
export const setDownlloadFileViewEmpty = () => async (dispatch) => {
  return dispatch(slice.SetDownlloadFileViewEmpty());
};

export const setIsExpiredTokenAction = (payload) => (dispatch) => {
  dispatch(slice.setIsExpiredToken(payload));
};

// refresh token store
export const refreshTokenAction = (payload) => (dispatch) => {
  dispatch(slice.setLogin(payload));
};

export const handleMostClickedMenuListAction = (payload) => (dispatch) => {
  dispatch(slice.updateMostClickedMenuList(payload));
};