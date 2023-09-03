import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ChatAppPeer, ChatAppSocket, getUserMedia } from "../../";
import { setCallerDataAction, setCallStageAction } from "../../redux/Action";
import Calling from "./calling";
import CallingTo from "./callingTo";
import CallNotAccept from "./callNotAccept";
import InCallAudio from "./inCallAudio";
import InCallVideo from "./InCallVideo";

function AudioVideoCall({ ownVideo, otherVideo }) {
  const dispatch = useDispatch();

  // get user profile data from store
  const { values, profileData } = useSelector((state) => {
    return { profileData: state.auth.profileData, values: state.iChatApp };
  }, shallowEqual);

  useEffect(() => {
    ChatAppSocket.on("callingTo", (data) => {
      dispatch(setCallerDataAction(data));
      dispatch(setCallStageAction("callingTo"));
    });

    ChatAppSocket.on("callDecline", (data) => {
      dispatch(setCallerDataAction(data));
      dispatch(setCallStageAction("decline"));
    });

    ChatAppSocket.on("endCall", (data) => {
      dispatch(setCallerDataAction(null));
      dispatch(setCallStageAction("notCalling"));
      // window.location.reload();
    });

    ChatAppSocket.on("callAccpet", (data) => {
      dispatch(setCallerDataAction(data));
      if (data?.isVideo) {
        dispatch(setCallStageAction("inCallVideo"));
      } else {
        dispatch(setCallStageAction("inCallAudio"));
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    ChatAppPeer.on("call", (call) => {
      getUserMedia(
        { video: true, audio: true },
        (stream) => {
          ownVideo.current.srcObject = stream;
          ownVideo.current.muted = true;
          ownVideo.current.play();
          call.answer(stream);
          call.on("stream", (remoteStream) => {
            otherVideo.current.srcObject = remoteStream;
            otherVideo.current.play();
          });
        },
        (err) => {
          toast.warning("Camera or microphone permission denied");
          const payload = {
            senderId: profileData?.userAutoId,
            senderName: profileData?.fullname,
            receiverId: +values?.callerData?.senderId,
            receiverName: values?.callerData?.senderName,
          };
          ChatAppSocket.emit("endCall", payload);
          dispatch(setCallStageAction("notCalling"));
          dispatch(setCallerDataAction(null));
        }
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div>
        {values?.callStage === "calling" ? (
          <div className="chatAppCallBlackOverlay"></div>
        ) : null}

        {/* Calling Stage */}
        {values?.callStage === "calling" ? <Calling /> : null}

        {/* InComming Call Stage */}
        {values?.callStage === "callingTo" ? (
          <CallingTo ownVideo={ownVideo} otherVideo={otherVideo} />
        ) : null}

        {/* In Call Audio Stage */}
        {values?.callStage === "inCallAudio" && !values?.callerData?.isVideo ? (
          <InCallAudio ownVideo={ownVideo} otherVideo={otherVideo} />
        ) : null}

        {/* In Call Video Stage */}
        {values?.callStage === "inCallVideo" && values?.callerData?.isVideo ? (
          <InCallVideo ownVideo={ownVideo} otherVideo={otherVideo} />
        ) : null}

        {/* Decline Stage */}
        {values?.callStage === "decline" ? <CallNotAccept /> : null}
      </div>
    </>
  );
}

export default AudioVideoCall;
