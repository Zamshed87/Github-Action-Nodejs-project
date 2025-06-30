import moment from "moment";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ChatAppSocket } from "../..";
import Loading from "../../../../common/loading/Loading";
import Header from "./header";
import NewMsgStart from "./newMsgStart";
import SingleMsg from "./singleMsg";

export default function ChatRoom() {
  const [loading, setLoading] = useState(false);
  const [msgs, setMsgs] = useState();
  const [text, setText] = useState();
  const [skip, setSkip] = useState(0);
  const limit = 15;
  const [scroll, setScroll] = useState(false);
  const [seeMoreDisabled, setSeeMoreDisabled] = useState(false);
  const [typeing, setTyping] = useState(false);

  // Get Data from Redux State
  const { values, profileData } = useSelector((state) => {
    return {
      values: state.iChatApp,
      profileData: state.auth.profileData,
    };
  }, shallowEqual);

  useEffect(() => {
    /* Get All message for between Two Person */
    ChatAppSocket.on("getAllMsg", (data) => {
      if (data?.length === 0 || data?.length < limit) {
        setSeeMoreDisabled(true);
      }
      setMsgs((oldData) => (oldData?.length ? [...data, ...oldData] : data));
      setLoading(false);
    });
    /* Get All message for between Two Person End */

    /* Send Msg Receive */
    ChatAppSocket.on("sendMsgReceive", (rcvData) => {
      if (+rcvData?.senderId === +values?.selectedUserData?.intUserId) {
        setMsgs((oldState) => [...oldState, rcvData]);
        /* If Recive last message then unSeenMsg 0 */
        ChatAppSocket.emit("changeUnseenMsgNumber", {
          ownerId: profileData?.userAutoId,
          senderId: +values?.selectedUserData?.intUserId,
        });
        setScroll(false);
      }
    });
    /* Send Msg Receive End */

    /* Request Emit For get All Msg */
    ChatAppSocket.emit("getAllMsg", {
      senderId: profileData?.userAutoId,
      receiverId: +values?.selectedUserData?.intUserId,
      skip: skip,
      limit: limit,
    });
    setLoading(true);
    /* Request Emit For get All Msg End */

    /* Change UnseenNumber Of Message  */
    if (+values?.selectedUserData?.unseenMsgNumber > 0) {
      ChatAppSocket.emit("changeUnseenMsgNumber", {
        ownerId: profileData?.userAutoId,
        senderId: +values?.selectedUserData?.intUserId,
      });
    }
    /* Change UnseenNumber Of Message End  */

    /* Show Typing Notification When Typing Start or End... */
    ChatAppSocket.on("getIstypingStart", (rcvData) => {
      if (+rcvData?.senderId === +values?.selectedUserData?.intUserId) {
        setTyping(true);
      }
    });
    ChatAppSocket.on("getIstypingEnd", (rcvData) => {
      if (+rcvData?.senderId === +values?.selectedUserData?.intUserId) {
        setTyping(false);
      }
    });
    /* Show Typing Notification When Typing Start or End... */

    return () => {
      ChatAppSocket.off("sendMsgReceive");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values?.selectedUserData]);

  // Typing Notification...
  useEffect(() => {
    if (text?.length === 0) {
      ChatAppSocket.emit("getIstypingEnd", {
        senderId: profileData?.userAutoId,
        receiverId: +values?.selectedUserData?.intUserId,
      });
    }
    if (text?.length > 0) {
      ChatAppSocket.emit("getIstypingStart", {
        senderId: profileData?.userAutoId,
        receiverId: +values?.selectedUserData?.intUserId,
      });
    }
    // eslint-disable-next-line
  }, [text]);

  // Scroll To Bottom & Top When Paginate See More message
  useEffect(() => {
    if (!scroll) {
      const chatContent = document.querySelector(".popup-messages");
      chatContent.scrollTop =
        chatContent?.scrollHeight - chatContent?.clientHeight;
    } else {
      const chatContent = document.querySelector(".popup-messages");
      chatContent.scrollTop = 0;
    }

    // eslint-disable-next-line
  }, [msgs, typeing]);

  // Send Message handler func
  const sendMessageHandler = (value) => {
    const payload = {
      senderId: +profileData?.userAutoId,
      receiverId: +values?.selectedUserData?.intUserId,
      body: `${value}`,
      dateTime: `${moment().format("YYYY-MM-DD HH:mm:ss")}`,
      type: msgs?.length ? "" : "new",
    };
    ChatAppSocket.emit("sendMsg", payload, (response) => {
      /* Request Emit For Get All Recent Message */
      ChatAppSocket.emit("getRecentInbox", {
        ownerId: +values?.selectedUserData?.intUserId,
      });
      ChatAppSocket.emit("getRecentInbox", {
        ownerId: +profileData?.userAutoId,
      });
    });
    setMsgs([...msgs, payload]);
    setScroll(false);
    setText("");
  };

  return (
    <>
      {loading && <Loading />}
      <div
        className=" chat-box-main-wrapper popup-box chat-popup popup-box-on"
        id="qnimate"
      >
        {/* Header Part */}
        <Header />

        {/* Message Content Part */}
        <div className="popup-messages" style={{ height: "400px" }}>
          <div className="direct-chat-messages">
            {/* See More button */}
            {msgs?.length && msgs?.length >= 15 ? (
              <>
                {!seeMoreDisabled ? (
                  <div className="text-center mb-2">
                    <span
                      onClick={() => {
                        /* Request Emit For get All Msg */
                        ChatAppSocket.emit("getAllMsg", {
                          senderId: profileData?.userAutoId,
                          receiverId: +values?.selectedUserData?.intUserId,
                          skip: skip + limit,
                          limit: limit,
                        });
                        setSkip(skip + limit);
                        setScroll(true);
                        setLoading(true);
                      }}
                      className="my-2 text-primary"
                      style={{ cursor: "pointer" }}
                    >
                      See More
                    </span>
                  </div>
                ) : null}
              </>
            ) : null}

            {/* Message Render */}
            {msgs?.length ? (
              <>
                {msgs?.map((item, index) => (
                  <SingleMsg item={item} key={index} />
                ))}
              </>
            ) : null}

            {/* Typeing Notification */}
            {typeing ? (
              <div className="animate-pulse" style={{ fontSize: "10px" }}>
                {`${values?.selectedUserData?.strUserName || ""} is typing...`}
              </div>
            ) : null}

            {/* New Message Start Component */}
            {!values?.selectedUserData?.lastMsg && !msgs?.length ? (
              <NewMsgStart />
            ) : null}
          </div>
        </div>

        {/* Footer Text Box For Send Message */}
        <div className="popup-messages-footer">
          <input
            id="status_message"
            placeholder="Type a message..."
            name="message"
            value={text || ""}
            onChange={(e) => {
              if (e?.target?.value?.length < 1000) {
                setText(e.target.value);
              }
            }}
            onKeyPress={(e) => {
              if (
                e?.target?.value?.length > 0 &&
                e?.key === "Enter" &&
                e?.target?.value?.length < 1000
              ) {
                if (
                  profileData?.userAutoId ===
                  +values?.selectedUserData?.intUserId
                ) {
                  toast.warning("You can't send message yourself!", {
                    toastId: 111,
                  });
                  return;
                }
                sendMessageHandler(e.target.value);
              }
            }}
          />
          <span
            onClick={() => {
              if (text?.length > 0) {
                if (
                  profileData?.userAutoId ===
                  +values?.selectedUserData?.intUserId
                ) {
                  toast.warning("You can't send message yourself!", {
                    toastId: 111,
                  });
                  return;
                }
                sendMessageHandler(text);
              }
            }}
            className="sendIconBtn"
          >
            <i
              style={{
                color: "black",
              }}
              className="fas fa-paper-plane"
            ></i>
          </span>
        </div>
      </div>
    </>
  );
}
