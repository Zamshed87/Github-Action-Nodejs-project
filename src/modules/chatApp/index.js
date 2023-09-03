/* eslint-disable no-undef */
import Peer from "peerjs";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import AudioVideoCall from "./components/audioVideoCall";
import ChatIconBottomFixed from "./components/common/chatIconBottomFixed";
import ChatAppGroupInbox from "./components/groupInbox";
import ChatGroupRoom from "./components/groupRoom";
import ChatAppInbox from "./components/inbox";
import ChatRoom from "./components/room";
import {
  setRecentGroupChatUserListAction,
  setRecentInboxUserListAction
} from "./redux/Action";
import "./styles.css";

// Connected Peer Server
export let ChatAppPeer;
// Connected to the Server Side Socket iO
export let ChatAppSocket;
// User Media
export var getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;

function ChatApp() {
  const dispatch = useDispatch();
  const [searchSkip, setSearchSkip] = useState(0);

  const ownVideo = useRef();
  const otherVideo = useRef();

  const { tokenData, profileData, popUpState } = useSelector((state) => {
    return {
      tokenData: state?.auth?.token,
      profileData: state?.auth?.profileData,
      // values: state.iChatApp,
      popUpState: state.iChatApp.popUpState,
    };
  }, shallowEqual);

  /* Setup Socket Connection */
  useEffect(() => {
    var options = {
      transports: ["websocket"],
      upgrade: false,
      auth: {
        userId: profileData?.userAutoId,
        token: tokenData,
      },
    };

    ChatAppSocket = io("https://chat.ibos.io/chatnamespace", options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData?.userAutoId]);

  useEffect(() => {
    /* Get All Recent Message */
    ChatAppSocket.on("getRecentInbox", (data) => {
      dispatch(setRecentInboxUserListAction(data));
    });

    /* Delete Group */
    ChatAppSocket.on("deleteGroup", (data) => {
      ChatAppSocket.emit("getRecentGroupInbox", {
        ownerId: profileData?.userAutoId,
      });
    });

    /* Get All Recent Message */
    ChatAppSocket.on("getRecentGroupInbox", (data) => {
      dispatch(setRecentGroupChatUserListAction(data));
    });

    /* Request Emit For Get All Recent Message */
    ChatAppSocket.emit("getRecentInbox", {
      ownerId: profileData?.userAutoId,
    });

    /* Request Emit For Get All Recent Message */
    ChatAppSocket.emit("getRecentGroupInbox", {
      ownerId: profileData?.userAutoId,
    });

    return () => {
      ChatAppSocket.off("getRecentInbox");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData?.userAutoId]);

  /* Setting Up a new Peer with Own userAutoId */
  useEffect(() => {
    ChatAppPeer = new Peer(`${profileData?.userAutoId}`);

    ChatAppPeer.on("open", (data) => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData?.userAutoId]);

  return (
    <>
      {/* Fixed Chat Icon in Bottom || If Socket Server Connected Then It will show */}
      <ChatIconBottomFixed />

      {/* Recent Inbox List */}
      {popUpState === "inbox" ? (
        <ChatAppInbox searchSkip={searchSkip} setSearchSkip={setSearchSkip} />
      ) : null}

      {popUpState === "groupInbox" ? (
        <ChatAppGroupInbox
          searchSkip={searchSkip}
          setSearchSkip={setSearchSkip}
        />
      ) : null}

      {/* Private Message Rooms */}
      {popUpState === "room" ? (
        <ChatRoom ownVideo={ownVideo} otherVideo={otherVideo} />
      ) : null}

      {/* Group Message Room */}
      {popUpState === "groupRoom" ? (
        <ChatGroupRoom searchSkip={searchSkip} setSearchSkip={setSearchSkip} />
      ) : null}

      {/* Audio Video Call Component */}
      {ChatAppSocket ? (
        <AudioVideoCall ownVideo={ownVideo} otherVideo={otherVideo} />
      ) : null}
    </>
  );
}

export default ChatApp;
