import Axios from "axios";
import { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
// components
import PackageJson from "../package.json";
import AuthPage from "./router/AuthPage.jsx";
import BasePage from "./router/basePage.jsx";

// css
import "antd/dist/antd.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-quill/dist/quill.snow.css";
import "react-toastify/dist/ReactToastify.css";
import "swiper/components/navigation/navigation.min.css";
import "swiper/components/pagination/pagination.min.css";
import "swiper/swiper.min.css";
import "./assets/css/index.css";
import {
  refreshTokenAction,
  setIsExpiredTokenAction,
  setLogoutAction,
} from "./commonRedux/auth/actions";
import store from "./redux/store";
import { _zx123_Zx001_45___45_9999_ } from "./utility/cz";
import { _Ad_xcvbn_df__dfg_568_dfghfff_ } from "./utility/czy";
import { withoutEncryptionList } from "./utility/withoutEncryptionApi";

const origin = window.location.origin;
const prodUrl = "https://matador.peopledesk.io";

const isDevServer =
  origin.includes("dev") || process.env.NODE_ENV === "development";

// set axios base url
export const APIUrl = isDevServer
  ? "https://devmatador.peopledesk.io/api"
  : `${origin}/api`;
Axios.defaults.baseURL = APIUrl;

export const domainUrl = isDevServer
  ? "https://devmatador.peopledesk.io"
  : origin;

// if (process.env.NODE_ENV === "production") {
//   disableReactDevTools();
// }

Axios.interceptors.request.use(
  (config: any) => {
    if (isDevServer) return config;
    let url = config.url;
    for (let index = 0; index < withoutEncryptionList.length; index++) {
      const element = withoutEncryptionList[index];
      if (url.includes(`${element}`)) return config;
    }
    let newConfig = { ...config };
    let paramsQuery = "";

    const isIncludesQueryString = url.includes("?");

    if (isIncludesQueryString) {
      const splitUrl = url.split("?");
      paramsQuery += splitUrl[1];
      url = splitUrl[0];
    }
    if (config.params) {
      const params = Object.keys(config.params)
        .map(
          (key) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(
              config.params[key]
            )}`
        )
        .join("&");

      paramsQuery += (paramsQuery ? "&" : "") + params;
      config.params = null;
      newConfig.params = null;
    }

    if (paramsQuery) {
      const encryptedParamsQuery = _zx123_Zx001_45___45_9999_(paramsQuery);
      url += "?" + encryptedParamsQuery;
    }

    newConfig.url = url;

    let payload = null;

    if (config.data) {
      try {
        payload = _zx123_Zx001_45___45_9999_(JSON.stringify(config.data));
      } catch (error) {
        console.error("Error encrypting payload", error);
      }
    }

    newConfig = {
      ...newConfig,
      data: payload,
      headers: { ...newConfig.headers, "Content-Type": "application/json" },
    };
    return newConfig;
  },
  (error: any) => {
    if (process.env.NODE_ENV === "development") {
      console.error("Error in request", error);
    }
    return Promise.reject(error);
  }
);
Axios.interceptors.response.use(
  async function (response: any) {
    if (isDevServer) return response;
    for (let index = 0; index < withoutEncryptionList.length; index++) {
      const element = withoutEncryptionList[index];
      if (response?.config?.url?.includes(`${element}`)) return response;
    }

    const decryptedData = _Ad_xcvbn_df__dfg_568_dfghfff_(response?.data);
    const decryptedRes = {
      status: response.status,
      data: decryptedData,
    };
    return decryptedRes;
  },
  async function (error) {
    if (error?.response?.status === 401) {
      // store
      const state = store.getState();

      const payload = {
        accessToken: state?.auth?.profileData?.token,
        refreshToken: state?.auth?.profileData?.refreshToken,
      };

      try {
        const apiRefreshResponse = await Axios.post(
          "/Auth/GenerateRefreshToken",
          payload
        );
        if (apiRefreshResponse?.status === 200) {
          const dispatch: any = store.dispatch;
          dispatch(
            refreshTokenAction({
              ...state?.auth?.profileData,
              token: apiRefreshResponse?.data?.accessToken,
              refreshToken: apiRefreshResponse?.data?.refreshToken,
            })
          );

          error.config.headers[
            "Authorization"
          ] = `Bearer ${apiRefreshResponse?.data?.accessToken}`;
          window.location.reload();
          // return Axios(originalConfig);
        }
      } catch (error) {
        const dispatch: any = store.dispatch;
        dispatch(setIsExpiredTokenAction(true));
        dispatch(setLogoutAction());
        toast.error("Session Expired, Please login again");
      }
    }
    let decryptedData = error?.response?.data;
    if (!isDevServer) {
      const data = _Ad_xcvbn_df__dfg_568_dfghfff_(JSON.stringify(error));
      decryptedData = data?.response?.data;
    }
    const newError = { response: { data: decryptedData } };
    return Promise.reject(newError);
  }
);

function App() {
  const { isAuth, isLoggedInWithOtp, isOtpAuth } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );

  const { tokenData } = useSelector((state: any) => state?.auth, shallowEqual);

  if (tokenData)
    Axios.defaults.headers.common["Authorization"] = `Bearer ${tokenData}`;

  useEffect(() => {
    const appVersion = localStorage.getItem("appVersion");
    if (appVersion !== PackageJson.version) {
      localStorage.setItem("appVersion", PackageJson.version);
      window.location.reload();
    }
  }, []);

  const componentRender = (isOpen: boolean) => {
    if (isOpen) return "";
    if (isLoggedInWithOtp) {
      if (isOtpAuth) {
        return <BasePage />;
      } else {
        return <AuthPage />;
      }
    } else {
      if (isAuth) {
        return <BasePage />;
      } else {
        return <AuthPage />;
      }
    }
  };

  return (
    <div className="app">
      {componentRender(false)}
      <ToastContainer
        position="bottom-right"
        newestOnTop={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        // limit={10}
        autoClose={1500}
      />
    </div>
  );
}

export default App;
