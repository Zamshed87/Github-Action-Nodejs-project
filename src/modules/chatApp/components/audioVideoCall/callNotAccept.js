import React from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ChatAppSocket } from "../..";
import { setCallerDataAction, setCallStageAction } from "../../redux/Action";

export default function CallNotAccept() {
  const dispatch = useDispatch();

  // get user profile data from store
  const { values, profileData } = useSelector((state) => {
    return { profileData: state.auth.profileData, values: state.iChatApp };
  }, shallowEqual);

  return (
    <div className="chatAppCallUiWrapper">
      <div className="inCommingCallUi">
        <div style={{ marginBottom: "80px", textAlign: "center" }}>
          <i
            style={{ color: "white", fontSize: "70px" }}
            className="fas fa-phone animate-pulse"
          ></i>
          <div
            style={{
              fontSize: "17px",
              marginTop: "10px",
            }}
          >
            {values?.callerData?.senderName} decline your call
          </div>
        </div>

        <div className="chatAppEndSectionAllIcon">
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
            className="acceptDeclineBtn"
          >
            Call again
          </span>
          <span
            onClick={() => {
              dispatch(setCallStageAction("notCalling"));
              dispatch(setCallerDataAction(null));
            }}
            className="acceptDeclineBtn acceptDeclineBtn-decline"
          >
            Close
          </span>
        </div>
      </div>
    </div>
  );
}
