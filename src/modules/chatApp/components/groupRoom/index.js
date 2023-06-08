import moment from "moment";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ChatAppSocket } from "../..";
import Loading from "../../../../common/loading/Loading";
import ViewModal from "../../../../common/ViewModal";
import {
  setPopUpStateAction,
  setSelectedGroupDataAction
} from "../../redux/Action";
import CreateGroupModal from "../groupInbox/createGroupModal/addEditForm";
import Header from "./header";
import SingleGroupMsg from "./singleGroupMsg";

export default function ChatGroupRoom() {
  const [groupModal, setGroupModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msgs, setMsgs] = useState();
  const [text, setText] = useState();
  const [skip, setSkip] = useState(0);
  const limit = 15;
  const [scroll, setScroll] = useState(false);
  const [seeMoreDisabled, setSeeMoreDisabled] = useState(false);
  const [typeing, setTyping] = useState(false);
  const dispatch = useDispatch();

  // Get Data from Redux State
  const { values, profileData } = useSelector((state) => {
    return {
      values: state.iChatApp,
      profileData: state.auth.profileData,
    };
  }, shallowEqual);

  useEffect(() => {
    /* Get All message for between Two Person */
    ChatAppSocket.on("getAllGroupMessage", (data) => {
      if (data?.length === 0 || data?.length < limit) {
        setSeeMoreDisabled(true);
      }
      setMsgs((oldData) => (oldData?.length ? [...data, ...oldData] : data));
      setLoading(false);
    });
    /* Get All message for between Two Person End */

    /* Send Group Msg Receive */
    ChatAppSocket.on("sendGroupMsgReceive", (rcvData) => {
      if (+rcvData?.receiverId === +values?.selectedGroupData?.groupId) {
        setMsgs((oldState) => [...oldState, rcvData]);
        /* If Recive last message then unSeenMsg 0 */
        ChatAppSocket.emit("changeUnseenMsgNumber", {
          ownerId: profileData?.userAutoId,
          senderId: +values?.selectedGroupData?.groupId,
          type: "group",
        });
        setScroll(false);
      }
    });
    /* Send Msg Receive End */

    /* Request Emit For get All Msg */
    ChatAppSocket.emit("getAllGroupMessage", {
      senderId: profileData?.userAutoId,
      receiverId: +values?.selectedGroupData?.groupId,
      skip: skip,
      limit: limit,
    });
    setLoading(true);
    /* Request Emit For get All Msg End */

    /* Change UnseenNumber Of Message  */
    if (+values?.selectedGroupData?.unseenMsgNumber > 0) {
      ChatAppSocket.emit("changeUnseenMsgNumber", {
        ownerId: profileData?.userAutoId,
        senderId: +values?.selectedGroupData?.groupId,
        type: "group",
      });
    }
    /* Change UnseenNumber Of Message End  */

    /* Show Typing Notification When Typing Start or End... */
    ChatAppSocket.on("getIstypingStart", (rcvData) => {
      if (+rcvData?.senderId === +values?.selectedGroupData?.groupId) {
        setTyping(true);
      }
    });
    ChatAppSocket.on("getIstypingEnd", (rcvData) => {
      if (+rcvData?.senderId === +values?.selectedGroupData?.groupId) {
        setTyping(false);
      }
    });
    /* Show Typing Notification When Typing Start or End... */

    return () => {
      ChatAppSocket.off("sendGroupMsgReceive");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values?.selectedGroupData]);

  useEffect(() => {
    /* Delete Group */
    ChatAppSocket.on("deleteGroup", (data) => {
      if (+data?.payload?.actionBy === profileData?.userAutoId) {
        toast.success("Group deleted successfully", { toastId: 1412 });
      }
      dispatch(
        setPopUpStateAction(
          values?.popUpState === "close" ? "close" : "groupInbox"
        )
      );
    });

    ChatAppSocket.on("removeGroupMember", (res) => {
      if (
        !res?.payload?.isUserLeave &&
        res?.payload?.ownerId === profileData?.userAutoId
      ) {
        toast.success(`You removed from a group`, { toastId: 100 });
        setGroupModal(false);
        dispatch(setSelectedGroupDataAction(null));
        dispatch(setPopUpStateAction("groupInbox"));
      }
    });
    // eslint-disable-next-line
  }, []);

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
      receiverId: +values?.selectedGroupData?.groupId,
      body: `${value}`,
      strUserName: profileData?.fullname,
      dateTime: `${moment().format("YYYY-MM-DD HH:mm:ss")}`,
    };
    ChatAppSocket.emit("sendGroupMsg", payload, (response) => {
      /* Request Emit For Get All Recent Message */
      // ChatAppSocket.emit("getRecentGroupInbox", {
      //   ownerId: +values?.selectedGroupData?.groupId,
      // });
      ChatAppSocket.emit("getRecentGroupInbox", {
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
        <Header setGroupModal={setGroupModal} />

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
                        ChatAppSocket.emit("getAllGroupMessage", {
                          senderId: profileData?.userAutoId,
                          receiverId: +values?.selectedGroupData?.groupId,
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
                  <SingleGroupMsg key={index} item={item} />
                ))}
              </>
            ) : null}

            {/* Typeing Notification */}
            {typeing ? (
              <div className="animate-pulse" style={{ fontSize: "10px" }}>
                {`${values?.selectedGroupData?.groupName || ""} is typing...`}
              </div>
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
                e.key === "Enter" &&
                e?.target?.value?.length < 1000
              ) {
                sendMessageHandler(e.target.value);
              }
            }}
          />
          <span
            onClick={() => {
              if (text?.length > 0) {
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

      <div className="chat-app-create-group-from">
        <ViewModal
          modelSize="md"
          title="Edit Chat Group"
          show={groupModal}
          onHide={() => setGroupModal(false)}
        >
          <CreateGroupModal
            data={values?.selectedGroupData}
            setCreateGroupModal={setGroupModal}
          />
        </ViewModal>
      </div>
    </>
  );
}
