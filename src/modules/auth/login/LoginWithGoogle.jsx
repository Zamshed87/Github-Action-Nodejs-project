// client-id-one: 739106075686-o3iq57fl19qmf50planckptdekklb1du.apps.googleusercontent.com
// client-id-two: 342560467301-ne5ot27tp8l6kc1mu3rtctp51c3ju8o6.apps.googleusercontent.com

import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { setLoginAction } from "commonRedux/auth/actions";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

// client-id-iBOS: 631824641431-o0an7ks3k4cee4qqspbtomcgq2h2bvvq.apps.googleusercontent.com



const LoginWithGoogle = ({ history, setLoading }) => {
  const dispatch = useDispatch();

  const containerStyle = {
    width: "100%!important",
    textAlign: "center!important"
  };

  return (
    <div style={containerStyle}>
      <GoogleOAuthProvider  clientId="631824641431-o0an7ks3k4cee4qqspbtomcgq2h2bvvq.apps.googleusercontent.com">
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            dispatch(
              setLoginAction(
                "",
                "",
                history,
                setLoading,
                true,
                credentialResponse,
                true
              )
            );
            dispatch(setFirstLevelNameAction("Dashboard"));
          }}
          onError={() => {
            toast.error("Login Failed");
          }}
        />
      </GoogleOAuthProvider>
    </div>
  );
};

export default LoginWithGoogle;
