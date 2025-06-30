import React from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ChatAppSocket } from "../..";
import { setCallStageAction, setCallerDataAction } from "../../redux/Action";
import Timer from "./timer";

export default function InCallAudio({ ownVideo, otherVideo }) {
  const dispatch = useDispatch();

  // get user profile data from store
  const { values, profileData } = useSelector((state) => {
    return { profileData: state.auth.profileData, values: state.iChatApp };
  }, shallowEqual);

  return (
    <>
      <div className="chatAppCallUiWrapper">
        {/* Audio Call */}
        <div className="chatAppCallUi">
          <div>
            <div className="chatAppProfilePicUi animate-pulse">
              <span>{values?.callerData?.senderName[0]}</span>
            </div>

            <div className="text-center mt-4">
              <Timer />
            </div>
          </div>

          <div className="chatAppEndSectionAllIcon">
            {/* <span
              onClick={() => {
                ownVideo.current.play();
              }}
            >
              <i className="fas fa-microphone"></i>
            </span>
            <span
              onClick={() => {
                ownVideo.current.pause();
              }}
            >
              <i className="fas fa-microphone-slash"></i>
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
                dispatch(setCallStageAction("notCalling"));
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
          <video style={{ display: "none" }} ref={otherVideo} />
          <video style={{ display: "none" }} ref={ownVideo} />
        </div>
      </div>
    </>
  );
}
