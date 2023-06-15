import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import Axios from "axios";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
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
import { refreshTokenAction } from "./commonRedux/auth/actions";
import store from "./redux/store";
import { _zx123_Zx001_45___45_9999_ } from "./utility/cz";
import { _Ad_xcvbn_df__dfg_568_dfghfff_ } from "./utility/czy";
import { detectBrowserConsole } from "./utility/devtools";
import { withoutEncryptionList } from "./utility/withoutEncryptionApi";

const origin = window.location.origin;
const prodUrl = "https://akijbiri.peopledesk.io";

// set axios base url
export const APIUrl =
  process.env.NODE_ENV === "development"
    ? "https://devakijbiri.peopledesk.io/api"
    : `${origin}/api`;
Axios.defaults.baseURL = APIUrl;

export const domainUrl =
  process.env.NODE_ENV === "development"
    ? "https://devakijbiri.peopledesk.io"
    : origin;

if (process.env.NODE_ENV === "production") {
  disableReactDevTools();
}

Axios.interceptors.request.use(
  async function (config) {
    let url = config.url;
    for (let index = 0; index < withoutEncryptionList.length; index++) {
      const element = withoutEncryptionList[index];
      if (url.includes(`${element}`)) return config;
    }
    let newConfig = { ...config };
    const isIncludesQueryString = url.includes("?");

    if (isIncludesQueryString) {
      let splitUrl = url.split("?");
      const encryptedQuery = await _zx123_Zx001_45___45_9999_(splitUrl[1]);
      url = `${splitUrl[0]}?${encryptedQuery}`;

      newConfig = { ...config, url };
    }
    let payload = null;

    if (config.data) {
      payload = await _zx123_Zx001_45___45_9999_(JSON.stringify(config.data));
    }

    if (process.env.NODE_ENV === "development") {
    }

    newConfig = {
      ...newConfig,
      data: payload,
      headers: { ...newConfig.headers, "Content-Type": "application/json" },
    };
    return newConfig;
  },
  function (error) {
    if (process.env.NODE_ENV === "development") {
    }
    return Promise.reject(error);
  }
);

Axios.interceptors.response.use(
  async function (response) {
    for (let index = 0; index < withoutEncryptionList.length; index++) {
      const element = withoutEncryptionList[index];
      if (response?.config?.url?.includes(`${element}`)) return response;
    }

    let decryptedData = _Ad_xcvbn_df__dfg_568_dfghfff_(response?.data);
    let decryptedRes = {
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
        let apiRefreshResponse = await Axios.post(
          "/Auth/GenerateRefreshToken",
          payload
        );
        if (apiRefreshResponse?.status === 200) {
          store.dispatch(
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
      } catch (error) { }
    }

    if (process.env.NODE_ENV === "development") {
    }
    let decryptedData = await _Ad_xcvbn_df__dfg_568_dfghfff_(
      error?.response?.data
    );
    let newError = { response: { data: decryptedData } };
    return Promise.reject(newError);
  }
);

function App() {
  const { isAuth, isLoggedInWithOtp, isOtpAuth } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const { tokenData } = useSelector((state) => state?.auth, shallowEqual);
  Axios.defaults.headers.common["Authorization"] = `Bearer ${tokenData}`;

  useEffect(() => {
    let appVersion = localStorage.getItem("appVersion");
    if (appVersion !== PackageJson.version) {
      localStorage.setItem("appVersion", PackageJson.version);
      window.location.reload();
    }
  }, []);

  const componentRender = (isOpen) => {
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

  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    let interval = null;
    if (origin === prodUrl) {
      interval = setInterval(() => {
        if (!isOpen) {
          detectBrowserConsole(setIsOpen);
        }
      }, 500);
    }
    return () => {
      interval && clearInterval(interval);
    };
  }, [isOpen]);

  return (
    <div className="app">
      {componentRender(isOpen)}
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
