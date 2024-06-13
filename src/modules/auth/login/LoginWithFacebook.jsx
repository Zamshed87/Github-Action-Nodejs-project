import React from "react";
import FacebookLogin from "react-facebook-login";
import FacebookIcon from "@mui/icons-material/Facebook";
import { useDispatch } from "react-redux";
import { setLoginAction } from "../../../commonRedux/auth/actions";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";


const LoginWithFacebook = ({
  isSelf = false,
  saveHandler = {},
  values = {},
  history = {},
  setLoading = {},
}) => {
  const dispatch = useDispatch();

  const responseFacebook = (response, isSelf, saveHandler, values) => {
    if (isSelf && response?.status !== "unknown") {
      saveHandler(values, response);
    } else if (response?.status === "unknown") {
    } else {
      dispatch(
        setLoginAction("", "", history, setLoading, true, response, false)
      );
      dispatch(setFirstLevelNameAction("Dashboard"));
    }
  };
  return (
    <FacebookLogin
      appId="237476869276582"
      autoLoad={false}
      fields="name,email,picture,id"
      callback={(response) =>
        responseFacebook(response, isSelf, saveHandler, values)
      }
      textButton="Login With Facebook"
      cssClass="facebook-btn"
      icon={<FacebookIcon />}
    />
  );
};

export default LoginWithFacebook;
