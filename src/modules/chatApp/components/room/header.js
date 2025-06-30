import React, { useState, useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ChatAppSocket } from "../..";
import { ProfilePicIcon } from "../../api";
import {
  setCallStageAction,
  setPopUpStateAction,
  setCallerDataAction,
} from "../../redux/Action";

function Header() {
  const dispatch = useDispatch();
  const [onlineStatus, setOnlineStatus] = useState(false);

  // Get Data from Redux State
  const { values, profileData } = useSelector((state) => {
    return {
      values: state.iChatApp,
      profileData: state.auth.profileData,
    };
  }, shallowEqual);

  useEffect(() => {
    ChatAppSocket.on("getOnlineStatus", (rcvData) => {
      setOnlineStatus(rcvData?.status);
    });

    ChatAppSocket.emit("getOnlineStatus", {
      senderId: profileData?.userAutoId,
      receiverId: +values?.selectedUserData?.intUserId,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="popup-head d-flex justify-content-between align-items-center">
        <div
          style={{ display: "flex", alignItems: "center" }}
          className="popup-head-left pull-left"
        >
          <div style={{ position: "relative" }}>
            {/* <img
              style={{
                height: "40px",
                width: "40px",
                borderRadius: "50%",
              }}
              src="https://avatars.githubusercontent.com/u/57855533?s=400&u=dbe46684e54ed5be402bd63d447daf45e84d28bb&v=4"
              alt="iamgurdeepEmdadul Hauqe"
            /> */}
            <ProfilePicIcon
              color="#EF4444"
              name={values?.selectedUserData?.strUserName}
            />

            {/* Is Active Small Dot Icon Design */}
            {values?.selectedUserData?.lastMsg?.length > 0 ? (
              <div
                style={{
                  backgroundColor: onlineStatus ? "#10B981" : "lightgray",
                  height: "15px",
                  width: "15px",
                  borderRadius: "50%",
                  position: "absolute",
                  bottom: "0px",
                  right: "0px",
                  marginRight: "-4px",
                  marginBottom: "4px",
                  border: "2px solid white",
                }}
              ></div>
            ) : null}
          </div>
          <span
            style={{
              color: "white",
              width: "80%",
              marginLeft: "8px",
            }}
          >
            {values?.selectedUserData?.strUserName?.length < 23
              ? values?.selectedUserData?.strUserName
              : values?.selectedUserData?.strUserName?.slice(0, 23) + "..." ||
                ""}
          </span>
        </div>

        <div className="d-flex"> 
          
          {/* Called */}
          <div className="popup-head-right pull-right">
            <span
              onClick={() => {
                const payload = {
                  senderId: +profileData?.userAutoId,
                  receiverId: +values?.selectedUserData?.intUserId,
                  senderName: profileData?.fullname,
                  receiverName: values?.selectedUserData?.strUserName,
                };
                ChatAppSocket.emit("callingTo", payload);
                dispatch(setCallerDataAction(payload));
                dispatch(setCallStageAction("calling"));
              }}
              className="chat-header-button pull-right"
            >
              <i
                style={{
                  color: "white",
                }}
                className="fas fa-phone"
              ></i>
            </span>
          </div>
          <div className="popup-head-right pull-right">
            <span
              onClick={() => {
                const payload = {
                  senderId: +profileData?.userAutoId,
                  receiverId: +values?.selectedUserData?.intUserId,
                  senderName: profileData?.fullname,
                  receiverName: values?.selectedUserData?.strUserName,
                  isVideo: true,
                };
                ChatAppSocket.emit("callingTo", payload);
                dispatch(setCallerDataAction(payload));
                dispatch(setCallStageAction("calling"));
              }}
              className="chat-header-button pull-right"
            >
              <i
                style={{
                  color: "white",
                }}
                className="fas fa-video"
              ></i>
            </span>
          </div>
          <div className="popup-head-right pull-right">
            <span
              onClick={() => {
                dispatch(setPopUpStateAction("inbox"));
              }}
              data-widget="remove"
              id="removeClass"
              className="chat-header-button pull-right"
              type="button"
            >
              <i
                style={{
                  color: "white",
                }}
                className="fas fa-chevron-left"
              ></i>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
