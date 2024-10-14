/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { HubConnectionBuilder } from "@microsoft/signalr";
import { Menu } from "@mui/icons-material";
import axios from "axios";
// import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import authLogo from "../../assets/images/logo.svg";
// import { getTotalNotificationsCount } from "./helper";
import AutoCompleteWithHint from "./AutoComplete";
import LanguageDropdown from "./LanguageDropdown";
import NotificationMenu from "./NotificationMenu";
import ProfileMenu from "./ProfileMenu";
import QuickAccess from "./QuickAccess";
import ResourcesDropdown from "./ResourcesDropdown";
import url from "./notification.mp3";
import { useAudio } from "./useAudio";

export default function TopNavigation({
  setIsOpenSidebar,
  isOpenSidebar,
  isHideDropdown,
}) {
  const { employeeId, orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [playing, toggle] = useAudio(url);
  const [connection, setConnection] = useState(null);
  const [myCount, setMyCount] = useState(0);

  const notificationCount = async () => {
    try {
      const res = await axios.get(
        `/Notification/GetNotificationCount?employeeId=${employeeId}&accountId=${orgId}`
      );
      if (res?.data > 0) {
        setMyCount(res?.data);
        const connect = new HubConnectionBuilder()
          .withUrl("https://signal.peopledesk.io/NotificationHub")
          // .withUrl("https://10.209.99.141/NotificationHub")
          .withAutomaticReconnect()
          .build();
        setConnection(connect);
      }
    } catch (error) {
      console.log("connection error", error);
    }
  };

  // useEffect(() => {
  //   getTotalNotificationsCount(employeeId, orgId, setMyCount);
  // }, []);

  useEffect(() => {
    notificationCount();
  }, []);

  const notify_KEY =
    "people_desk_saas_" +
    (origin.includes("dev") ? "devapp.peopledesk.io" : "app.peopledesk.io") +
    "_" +
    orgId +
    "_" +
    employeeId;

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          connection.on(`sendTo_${notify_KEY}`, (count) => {
            setMyCount(myCount + count);
            if (count) {
              toast.info("A new notification has come!!", {
                autoClose: 2000,
                limit: 10,
                closeOnClick: true,
                newestOnTop: true,
              });
            }
            // element.innerHTML = (+count || 0) + 1;
            toggle();
          });
        })
        .catch((error) => {});
    }
  }, [connection]);

  return (
    <>
      <div className="top-navigation">
        {/* sidebar */}
        <div className="logo-wrapper">
          {!isHideDropdown && (
            <div
              onClick={() => setIsOpenSidebar(!isOpenSidebar)}
              className="sidebar-toggle"
            >
              <Menu sx={{ marginRight: "10px", fontSize: "20px" }} />
            </div>
          )}

          <Link to="/">
            <div className="logo-img">
              <img src={authLogo} alt="iBOS" />
            </div>
          </Link>
        </div>

        {/* profile sidebar */}
        <div className="top-menu">
          {!isHideDropdown && (
            <>
              <LanguageDropdown />
              <AutoCompleteWithHint />

              <ResourcesDropdown />

              <QuickAccess />

              <NotificationMenu myCount={myCount} setMyCount={setMyCount} />

              {/* 

              <SmsOutlinedIcon
                sx={{
                  color: "rgba(96, 96, 96, 1)",
                  cursor: "pointer",
                  marginTop: "2px",
                  marginLeft: "15px",
                }}
                onClick={() => history.push("/chat")}
              /> */}
            </>
          )}
          <ProfileMenu />
        </div>
      </div>
    </>
  );
}
