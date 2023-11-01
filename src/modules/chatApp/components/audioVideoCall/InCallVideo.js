import React from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ChatAppSocket } from "../..";
import { setCallStageAction, setCallerDataAction } from "../../redux/Action";
import Timer from "./timer";
import {ChatAppPeer} from "../../"

export default function InCallVideo({ ownVideo, otherVideo }) {
  const dispatch = useDispatch();

  // get user profile data from store
  const { values, profileData } = useSelector((state) => {
    return { profileData: state.auth.profileData, values: state.iChatApp };
  }, shallowEqual);

  return (
    <>
      <div className="chatAppCallUiWrapper">
        {/* Video Call */}
        <div className="chatAppCallUi">
          <div style={{ height: "100%", width: "100%" }}>
            <video style={{ height: "100%", width: "100%" }} ref={otherVideo} />
          </div>

          <div className="chatAppEndSectionAllIcon">
            {/* <span
              onClick={() => {
                ownVideo.current.play();
              }}
            >
              <i className="fas fa-video"></i>
            </span>
            <span
              onClick={() => {
                ownVideo.current.pause();
              }}
            >
              <i className="fas fa-video-slash"></i>
            </span> */}
            <span
              onClick={() => {
                const payload = {
                  senderId: +profileData?.userAutoId,
                  senderName: profileData?.fullname,
                  receiverId: +values?.callerData?.senderId,
                  receiverName: values?.callerData?.senderName,
                };
                ChatAppSocket.emit("endCall", payload);
                dispatch(setCallStageAction, setCallerDataAction("notCalling"));
                dispatch(setCallerDataAction(null));
                // window.location.reload();
              }}
            >
              <i style={{ color: "tomato" }} className="fas fa-phone-square"></i>
            </span>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            margin: "80px 250px",
            right: 0,
          }}
        >
          <Timer />
          <video style={{ height: "100px", width: "100px" }} ref={ownVideo} />
        </div>
      </div>
    </>
  );
}
