/* eslint-disable react-hooks/exhaustive-deps */
import React, { Suspense, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Redirect, Route, Switch
} from "react-router-dom";

// layout
import axios from "axios";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import companyLogo from "../assets/images/company/logo.png";
import Loading from "../common/loading/Loading";
import {
  getKeywordsAction, getMenuListAction, getPermissionListAction, //setIsExpiredTokenAction
} from "../commonRedux/auth/actions";
import ProfileSidebar from "../layout/profileSidebar/profileSidebar";
import Sidebar from "../layout/sidebar";
import TopNavigation from "../layout/topNavigation/topNavigation";
import AttachmentViewer from "./../common/AttachmentViewer";
import { routingList } from "./routingList";
// import ChatApp from "../modules/chatApp/"
// import { useAudio } from "../layout/topNavigation/useAudio";
// import url from "../modules/chat/message-sound.mp3";
// import { io } from "socket.io-client";
import DashboardHead from "../layout/dashboardHead/DashboardHead";
import DashboardSidemenu from "../layout/menuComponent/DashboardSidemenu";
import SideMenu from "../layout/menuComponent/SideMenu";
import ApprovalSidemenu from './../layout/menuComponent/ApprovalSidemenu';
// import ExpiredToken from "../layout/expiredToken/ExpiredToken";

// Connected to the Server Side Socket iO
// export let ChatAppSocket;

const BasePage = () => {
  const [isOpenSidebar, setIsOpenSidebar] = useState(true);
  const [isOpenSecondSidebar, setIsOpenSecondSidebar] = useState(false);
  const [isProfileSidebar, setIsProfileSidebar] = useState(true);
  const [loading, setLoading] = useState(false);

  // const [, toggle] = useAudio(url);

  const { orgId, token, userAutoId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // const { isExpiredToken } = useSelector(
  //   (state) => state?.auth,
  //   shallowEqual
  // );

  const { firstLevelName } = useSelector(
    (state) => state?.localStorage,
    shallowEqual
  );

  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMenuListAction(employeeId, setLoading));
    dispatch(getKeywordsAction(orgId, setLoading));
    dispatch(getPermissionListAction(employeeId, setLoading));
  }, [userAutoId]);

  // axios.interceptors.request.use(
  //   function (config) { return config; },
  //   function (error) {
  //     if (error?.response?.status === 401) {
  //       dispatch(setIsExpiredTokenAction(true));
  //       return Promise.reject(error);
  //     }
  //     else {
  //       return Promise.reject(error);
  //     }
  //   }
  // );

  // axios.interceptors.response.use(
  //   function (response) {
  //     return response;
  //   },
  //   function (error) {
  //     if (error?.response?.status === 401) {
  //       dispatch(setIsExpiredTokenAction(true));
  //       return Promise.reject(error);
  //     }
  //     else {
  //       return Promise.reject(error);
  //     }
  //   }
  // );

  // useEffect(() => {
  //   var options = {
  //     transports: ["websocket"],
  //     upgrade: false,
  //     auth: {
  //       userAutoId,
  //       token: token,
  //     },
  //   };

  //   ChatAppSocket = io("http://localhost:5000/chat", options);
  // }, [userAutoId]);

  // const { messageInfo, selectedUser } = useSelector(
  //   (state) => state?.auth,
  //   shallowEqual
  // );

  // useEffect(() => {
  //   ChatAppSocket.on("message", (data) => {
  //     dispatch(setMessageInfoAction(data));
  //   });
  //   ChatAppSocket.on("messageSendFailed", (data) => {
  //     alert("Failed, try again");
  //   });
  //   return () => {
  //     dispatch(setMessageInfoAction(""));
  //   };
  // }, []);

  // useEffect(() => {
  //   if (messageInfo?.intMsgId && !selectedUser?.intUserId) {
  //     // only will be played sound when user interact in dom, else can't play audio, this is chrome autoplay policy
  //     toggle();
  //   }
  // }, [messageInfo]);

  return (
    <div id="main" className="main">
      {/* {isExpiredToken && <ExpiredToken />} */}
      {loading && <Loading />}
      <div
        onClick={() => setIsOpenSidebar(!isOpenSidebar)}
        className={isOpenSidebar ? "main-overlay w-0" : "main-overlay"}
      ></div>
      <AttachmentViewer />
      {/* <ChatApp /> */}
      <Router>
        {/* {messageInfo?.intMsgId && !selectedUser?.intUserId && <ChatToast />} */}
        {/* topNavigation */}
        <div className="top-navigation-wrapper" id="topNav">
          <TopNavigation
            setIsOpenSidebar={setIsOpenSidebar}
            isOpenSidebar={isOpenSidebar}
            setIsProfileSidebar={setIsProfileSidebar}
            isProfileSidebar={isProfileSidebar}
          />
        </div>

        {/* sidebar section */}
        <div className={isOpenSidebar ? "sidebar width-0" : "sidebar width-15"}>
          <div
            className={
              isOpenSecondSidebar
                ? "sidebar-overlay overlay-none"
                : "sidebar-overlay"
            }
          ></div>
          <Sidebar
            setIsOpenSidebar={setIsOpenSidebar}
            isOpenSidebar={isOpenSidebar}
            isOpenSecondSidebar={isOpenSecondSidebar}
            setIsOpenSecondSidebar={setIsOpenSecondSidebar}
          />
        </div>

        {/* body */}
        <div className={isOpenSidebar ? "body width-85" : "body width-100"}>
          {/* body-inner */}
          <div className="body-inner" onClick={() => setIsProfileSidebar(true)}>
            <Suspense fallback={<div>Loading...</div>}>
              <DashboardHead companyLogo={companyLogo} />
              <div className="landing-wrapper dashboard-scroll">
                <div className="container-fluid">
                  <div className="">
                    {firstLevelName !== "Overview" && (
                      <div className="">
                        {firstLevelName === "Approval" && <ApprovalSidemenu />}
                        {firstLevelName === "dashboard" && <DashboardSidemenu />}
                        {(firstLevelName !== "Approval" && firstLevelName !== "dashboard") && <SideMenu />}
                      </div>
                    )}

                    <div
                      className={
                        firstLevelName === "Overview"
                          ? ""
                          : "layout-body"
                      }
                    >
                      <Switch>
                        {routingList?.map((item, index) => (
                          <Route
                            exact
                            path={item?.path}
                            component={item?.component}
                            key={index}
                          />
                        ))}

                        {/* redirect from first label to second label */}
                        <Redirect
                          from="/administration/roleManagement"
                          to="/administration/roleManagement/usersInfo"
                        />
                        <Redirect
                          from="/taskManagement"
                          to="/taskmanagement/taskmgmt/dashboard"
                        />
                        <Redirect
                          from="/performancemanagementsystem"
                          to="/performancemanagementsystem/pms/dshboard"
                        />
                        <Redirect
                          from="/compensationAndBenefits/employeeSalary"
                          to="/compensationAndBenefits/employeeSalary/employeeSalary"
                        />

                        <Route
                          exact
                          path="/upcoming"
                          component={() => (
                            <div className="mt-5 ml-5">
                              <h4>Upcoming Features</h4>
                            </div>
                          )}
                        />
                        <Redirect to="/" />
                      </Switch>
                    </div>
                  </div>
                </div>
              </div>
            </Suspense>
          </div>
        </div>

        {/* Profile-sidebar */}
        <div
          className={
            isProfileSidebar ? "profile-sidebar" : "profile-sidebar view"
          }
        >
          <ProfileSidebar
            isProfileSidebar={isProfileSidebar}
            setIsProfileSidebar={setIsProfileSidebar}
          />
        </div>
      </Router>
    </div>
  );
};

export default BasePage;
