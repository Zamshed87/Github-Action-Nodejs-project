import React from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ChatAppPeer, ChatAppSocket, getUserMedia } from "../..";
import { setCallerDataAction, setCallStageAction } from "../../redux/Action";

export default function CallingTo({ ownVideo, otherVideo }) {
  const dispatch = useDispatch();

  // get user profile data from store
  const { profileData, values } = useSelector((state) => {
    return { profileData: state.auth.profileData, values: state.iChatApp };
  }, shallowEqual);

  return (
    <>
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
              Incomming Call from {values?.callerData?.senderName}
            </div>
            <div>
              {values?.callerData?.isVideo ? "Video Call" : "Audio Call"}
            </div>
          </div>

          <div className="chatAppEndSectionAllIcon">
            <span
              onClick={() => {
                const payload = {
                  senderId: +profileData?.userAutoId,
                  senderName: profileData?.fullname,
                  receiverId: values?.callerData?.senderId,
                  receiverName: values?.callerData?.senderName,
                  isVideo: values?.callerData?.isVideo,
                };
                ChatAppSocket.emit("callAccpet", payload);
                getUserMedia(
                  { video: true, audio: true },
                  function (stream) {
                    var call = ChatAppPeer.call(
                      `${values?.callerData?.senderId}`,
                      stream
                    );

                    ownVideo.current.srcObject = stream;
                    ownVideo.current.muted = true;
                    ownVideo.current.play();

                    /* Other Video Come From Another Client */
                    call.on("stream", (remoteStream) => {
                      otherVideo.current.srcObject = remoteStream;
                      otherVideo.current.play();
                    });
                  },
                  function (err) {
                    toast.warning("Camera or microphone permission denied");
                    const payload = {
                      senderId: +profileData?.userAutoId,
                      senderName: profileData?.fullname,
                      receiverId: +values?.callerData?.senderId,
                      receiverName: values?.callerData?.senderName,
                    };
                    ChatAppSocket.emit("endCall", payload);
                    dispatch(setCallStageAction("notCalling"));
                    dispatch(setCallerDataAction(null));
                  }
                );

                if (values?.callerData?.isVideo) {
                  dispatch(setCallStageAction("inCallVideo"));
                } else {
                  dispatch(setCallStageAction("inCallAudio"));
                }
              }}
              className="acceptDeclineBtn"
            >
              Accept
            </span>
            <span
              onClick={() => {
                const payload = {
                  senderId: +profileData?.userAutoId,
                  senderName: profileData?.fullname,
                  receiverId: +values?.callerData?.senderId,
                  receiverName: values?.callerData?.senderName,
                };
                dispatch(setCallStageAction("notCalling"));
                dispatch(setCallerDataAction(null));
                ChatAppSocket.emit("callDecline", payload);
              }}
              className="acceptDeclineBtn acceptDeclineBtn-decline"
            >
              Decline
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
