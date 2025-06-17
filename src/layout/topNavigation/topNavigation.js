/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { HubConnectionBuilder } from "@microsoft/signalr";
import { Menu } from "@mui/icons-material";
import axios from "axios";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import authLogo from "../../assets/images/logo.svg";
// import { getTotalNotificationsCount } from "./helper";
import AutoCompleteWithHint from "./AutoComplete";
import NotificationMenu from "./NotificationMenu";
import ProfileMenu from "./ProfileMenu";
import QuickAccess from "./QuickAccess";
import ResourcesDropdown from "./ResourcesDropdown";
import url from "./notification.mp3";
import { useAudio } from "./useAudio";
import {
  setMsgNotifyCountAction,
  setNotifyCountAction,
  setSignalRConnectionAction,
} from "modules/chattingApp/redux/Action";

export default function TopNavigation({
  setIsOpenSidebar,
  isOpenSidebar,
  isHideDropdown,
}) {
  const { employeeId, orgId, strLoginId, connectionKEY } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const history = useHistory();
  const dispatch = useDispatch();

  const [playing, toggle] = useAudio(url);
  const [connection, setConnection] = useState(null);
  const [myCount, setMyCount] = useState(0);
  const [messageState, setMessageState] = useState({});
  const connectionChat = useSelector(
    (state) => state?.chattingApp?.signalRConnection,
    shallowEqual
  );
  const msgNotifyCount = useSelector(
    (state) => state?.chattingApp?.msgNotifyCount,
    shallowEqual
  );
  const notifyCount = useSelector(
    (state) => state?.chattingApp?.notifyCount,
    shallowEqual
  );
  const chatting_KEY = connectionKEY + "___chatting_notify";

  const notificationCount = async () => {
    try {
      const res = await axios.get(
        `/Notification/GetNotificationCount?employeeId=${employeeId}&accountId=${orgId}`
      );
      // if (res?.data > 0) {
      setMyCount(res?.data);
      dispatch(setNotifyCountAction(res?.data));

      const connect = new HubConnectionBuilder()
        .withUrl("https://signal.peopledesk.io/NotificationHub")
        // .withUrl("https://10.209.99.141/NotificationHub")
        .withAutomaticReconnect()
        .build();
      if (connect) {
        connect.start().then(() => {
          console.log({ connect });
          dispatch(setSignalRConnectionAction(connect));
        });
      }
      setConnection(connect);
      // }
    } catch (error) {
      console.log("connection error", { error });
    }
  };
  const mesNotificationCount = async () => {
    const msgNotifyRes = await axios.get(
      `/ChattingApp/GetMsgNotificationCount?accountId=${orgId}&userid=${strLoginId}`
    );
    dispatch(setMsgNotifyCountAction(msgNotifyRes?.data));
  };
  // useEffect(() => {
  //   getTotalNotificationsCount(employeeId, orgId, setMyCount);
  // }, []);

  useEffect(() => {
    notificationCount();
    mesNotificationCount();
    // try {
    //   const connectionHub = new HubConnectionBuilder()
    //     .withUrl("https://signal.peopledesk.io/NotificationHub")
    //     .withAutomaticReconnect()
    //     .build();
    //   if (connectionHub) {
    //     setConnection(connectionHub);

    //     connectionHub.start().then(() => {
    //       dispatch(setSignalRConnectionAction(connectionHub));
    //     });
    //   }
    // } catch (error) {
    //   console.error("Error establishing SignalR connection:", { error });
    // }
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
  // useEffect(async () => {
  //   if (connectionChat) {
  //     connectionChat.on(`${chatting_KEY}`, (message) => {
  //       if (message) {
  //         if (!window.location.href.includes("/chat-app")) {
  //           setMessageState(message);
  //         }
  //         if (document.hidden || !window.location.href.includes("/chat-app")) {
  //           if (Notification.permission === "granted") {
  //             new Notification(`"New message form ${message?.senderName}`, {
  //               body: message?.message,
  //             });
  //           }
  //         }
  //       }
  //       toggle();
  //     });
  //   }
  // }, [connectionChat]);
  useEffect(() => {
    let isMounted = true;

    if (connectionChat && isMounted) {
      const handler = (message) => {
        if (message) {
          if (!window.location.href.includes("/chat-app")) {
            setMessageState(message);
          }
          if (document.hidden || !window.location.href.includes("/chat-app")) {
            if (Notification.permission === "granted") {
              new Notification(`New message from ${message?.senderName}`, {
                body: message?.message,
              });
            }
          }
        }
        toggle();
      };

      connectionChat.on(chatting_KEY, handler);

      // Cleanup function
      return () => {
        isMounted = false;
        connectionChat.off(chatting_KEY, handler);
        // DON'T call connectionChat.destroy() — it's not a valid method
        // Use connectionChat.stop() if needed
      };
    }
  }, [connectionChat, chatting_KEY]);
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
              {/* <LanguageDropdown /> */}
              <AutoCompleteWithHint />

              <ResourcesDropdown />

              <QuickAccess />

              <NotificationMenu myCount={myCount} setMyCount={setMyCount} />

              <div
                className="top-user pointer notification-bell"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(setMsgNotifyCountAction(0));

                  history.push("/chat-app");
                }}
              >
                <span>
                  <SmsOutlinedIcon
                    sx={{
                      color: "rgba(96, 96, 96, 1)",
                      cursor: "pointer",
                      marginTop: "2px",
                      // marginLeft: "15px",
                    }}
                    // onClick={() => history.push("/chat-app")}
                  />
                </span>
                {msgNotifyCount > 0 && (
                  <span id="notiCount" className="badge">
                    {msgNotifyCount}
                  </span>
                )}
              </div>
            </>
          )}
          <ProfileMenu />
        </div>
      </div>
    </>
  );
}
