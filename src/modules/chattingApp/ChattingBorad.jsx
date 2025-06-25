import {
  DoneAllOutlined,
  EmojiEmotionsOutlined,
  Send,
} from "@mui/icons-material";
import { Card } from "@mui/material";
import moment from "moment";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { shallowEqual, useSelector } from "react-redux";
import NoResult from "../../common/NoResult";
import MessageLoader from "./MessageLoader";
import {
  gray400,
  lightGreen100,
  navyGray,
  success500,
  whiteColor,
} from "../../utility/customColor";
import { emojis, emojisReact } from "../../utility/emojis";
import { todayTimeFormate } from "../../utility/todayTimeFormate";
import ChattingBoradHeader from "./ChattingBoradHeader";
import {
  SendMessageToSingleUserByUsernameReact,
  getMessageListBySenderNReceiverIdPaginationAsync,
  seenNUnseenMessageStatusUpdate,
  sendMessageToSingleUserByUsernameAsync,
} from "./helper";

const ChattingBorad = () => {
  const bottomRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [messageList, setMessageList] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [resivedMessage, setResivedMessage] = useState("");
  const [emojiCheck, setEmojiCheck] = useState(false);
  const [page, setPage] = useState(1);

  const fetchMore = () => {
    setPage((prevPage) => prevPage + 1);
    let newPage = page + 1;

    if (newPage > 1) {
      getMessageListBySenderNReceiverIdPaginationAsync(
        intAccountId,
        strLoginId,
        receiverId,
        receiverGroupId,
        newPage,
        9,
        null,
        null,
        (res) => {
          setMessageList((prev) => [...prev, ...res]);
        }
      );
    }
  };

  const { intAccountId, strLoginId, strDisplayName, connectionKEY } =
    useSelector((state) => state?.auth?.profileData, shallowEqual);

  const selectedUserForChat = useSelector(
    (state) => state?.chattingApp?.selectedUserForChat,
    shallowEqual
  );

  const connection = useSelector(
    (state) => state?.chattingApp?.signalRConnection,
    shallowEqual
  );

  // const lastUserForChatting = useSelector(
  //   (state) => state?.chattingApp?.lastUserForChatting,
  //   shallowEqual
  // );

  const receiverId =
    selectedUserForChat != null ? selectedUserForChat?.userId : "";

  const receiverGroupId =
    selectedUserForChat != null && selectedUserForChat.isGroup === true
      ? selectedUserForChat?.userId
      : 0;

  const handleChange = (e) => {
    setMessageText(e.target.value);
  };
  const onKeyDownHandler = (e) => {
    if (e.keyCode === 13 && (messageText != null || messageText === "")) {
      sendMessageFun();
    }
  };
  const sendMessageFun = () => {
    if (messageText == null || messageText === "") {
      return;
    }

    // setMessageList((cData) => [
    //   ...cData,
    //   {
    //     createdAt: todayTimeFormate(),
    //     isReceiver: false,
    //     isSending: true,
    //   },
    // ]);

    setLoading(true);

    let newMessage = {
      id: 0,
      accountId: intAccountId,
      senderId: strLoginId,
      receiverId: receiverGroupId ? null : receiverId,
      receiverGroupId: +receiverGroupId,
      messageType: "text",
      message: messageText,
      isSeen: false,
      isDelete: false,
      createdAt: todayTimeFormate(),
      isReceiver: false,
      // appName: selectedUserForChat?.connectionKEY,
      connectionKEY: selectedUserForChat?.connectionKEY + "___chatting",
      senderName:
        strDisplayName !== null ||
        strDisplayName !== undefined ||
        strDisplayName !== ""
          ? strDisplayName
          : "",
      receiverName:
        selectedUserForChat != null ? selectedUserForChat?.name : "",
    };
    const cb = (data) => {
      setMessageText("");
      // setMessageList((cData) => [...cData, data]);
      setMessageList((prev) => {
        // let newMessageList = [...prev, resivedMessage]
        // let sortedMessageList = newMessageList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        // sortedMessageList?.length > 9 && sortedMessageList?.shift()
        return prev?.length > 8
          ? [...prev.slice(0, prev.length - 1), data]
          : [...prev, data];
        // return [...prev, resivedMessage]
      });
      setLoading(false);
    };

    sendMessageToSingleUserByUsernameAsync(newMessage, cb);
  };
  const messageReact = (message, react) => {
    const payload = {
      intId: message?.id,
      senderReact: !message?.isReceiver ? react.emoji : message?.senderReact,
      receiverReact: message?.isReceiver ? react.emoji : message?.recieverReact,
    };

    const updatedData = messageList.map((item) => {
      if (item.id === message.id) {
        return {
          ...item,
          senderReact: !message?.isReceiver
            ? react.emoji
            : message?.senderReact,
          recieverReact: message?.isReceiver
            ? react.emoji
            : message?.recieverReact,
        };
      } else {
        return item;
      }
    });
    setMessageList(updatedData);
    SendMessageToSingleUserByUsernameReact(payload);
  };

  useEffect(() => {
    setMessageText("");
  }, [receiverId]);

  useEffect(() => {
    setMessageList([]);
    setPage(1);
    getMessageListBySenderNReceiverIdPaginationAsync(
      intAccountId,
      strLoginId,
      receiverId,
      receiverGroupId,
      1,
      9,
      setMessageList,
      null
    );
    seenNUnseenMessageStatusUpdate(
      intAccountId,
      receiverId,
      strLoginId,
      receiverGroupId
    );
  }, [receiverId, receiverGroupId, intAccountId, strLoginId]);

  // useEffect(() => {
  //   return () => {
  //     const sendTo = `sendTo_${
  //       chatting_KEY +
  //       "_" +
  //       (receiverGroupId <= 0 ? strLoginId : "group_" + receiverGroupId)
  //     }`;
  //     if (lastUserForChatting) {
  //       dispatch(resetSelectedUserForChatAction(null));
  //       dispatch(resetLastUserForChattingAction(null));
  //       connection?.close?.(sendTo);
  //     }
  //   };
  // }, [lastUserForChatting]);

  useEffect(() => {
    try {
      if (connection) {
        const connectTo =
          receiverGroupId > 0
            ? selectedUserForChat?.connectionKEY + "___chatting"
            : connectionKEY + "___chatting";

        connection.on(connectTo, (message) => {
          setResivedMessage(message);
        });
      }
    } catch (error) {}

    // eslint-disable-next-line
  }, [receiverId, receiverGroupId]);
  useEffect(() => {
    if (resivedMessage) {
      if (
        selectedUserForChat?.isGroup === false &&
        resivedMessage?.receiverGroupId <= 0 &&
        resivedMessage?.receiverId &&
        (selectedUserForChat?.userId === resivedMessage?.senderId ||
          selectedUserForChat?.userId === resivedMessage?.receiverId)
      ) {
        setMessageList((prev) => {
          return prev?.length > 8
            ? [...prev.slice(0, prev.length - 1), resivedMessage]
            : [...prev, resivedMessage];
          // return [...prev, resivedMessage]
        });
      } else if (
        selectedUserForChat?.isGroup === true &&
        resivedMessage?.receiverGroupId > 0 &&
        selectedUserForChat?.connectionKEY + "___chatting" ===
          resivedMessage?.connectionKEY &&
        strLoginId !== resivedMessage?.senderId
      ) {
        setMessageList((prev) => {
          return prev?.length > 8
            ? [...prev.slice(0, prev.length - 1), resivedMessage]
            : [...prev, resivedMessage];
          // return [...prev, resivedMessage]
        });
      }
    }
    // eslint-disable-next-line
  }, [resivedMessage]);

  return (
    <>
      {/* {loading && <Loading />} */}

      {selectedUserForChat ? (
        <>
          <ChattingBoradHeader selectedUserForChat={selectedUserForChat} />
          <div
            id="scrollableDiv"
            className="container chat-container"
            style={{
              height: "calc(100vh - 205px)",
              paddingTop: "10px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column-reverse",
            }}
          >
            <br></br>
            {/* main message body */}
            <div>
              <InfiniteScroll
                dataLength={messageList.length}
                next={fetchMore}
                hasMore={true}
                scrollableTarget="scrollableDiv"
                inverse={true}
                style={{
                  display: "flex",
                  flexDirection: "column-reverse",
                  gap: "16px",
                }}
              >
                {messageList
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((message, index) => (
                    <div key={index}>
                      {message?.isReceiver ? (
                        <>
                          <div
                            className="chat_sms_card my_chat_message my_receiver_chat_message"
                            ref={bottomRef}
                          >
                            <div className="chat_txt">
                              <p
                                className="chat_message_txt"
                                style={{
                                  background: whiteColor,
                                  position: "relative",
                                }}
                              >
                                {message?.receiverGroupId > 0 ? (
                                  <span
                                    style={{ color: gray400 }}
                                    className="txt mb-1"
                                  >
                                    {message?.senderName}
                                  </span>
                                ) : null}
                                <span className="txt">{message?.message}</span>
                                <span className="time">
                                  {moment(message?.createdAt).format(
                                    "MMM DD, yyyy hh:mm a"
                                  )}
                                  <DoneAllOutlined
                                    sx={{
                                      fontSize: "12px",
                                      marginLeft: "5px",
                                      color: message?.isSeen
                                        ? success500
                                        : gray400,
                                    }}
                                  />
                                </span>
                                {/* <span className="receiver_react">{"😮"}</span> */}
                                <p
                                  style={{
                                    display: "flex",
                                    position: "absolute",
                                    bottom: "-11px",
                                    right: "6px",
                                  }}
                                >
                                  <p
                                    style={{
                                      background: "white",
                                      borderRadius: "50%",
                                    }}
                                    className="receiver_react"
                                  >
                                    {message?.senderReact}
                                  </p>
                                  <p
                                    style={{
                                      background: "white",
                                      borderRadius: "50%",
                                    }}
                                    className="receiver_react"
                                  >
                                    {message?.recieverReact}
                                  </p>
                                </p>
                              </p>
                              <div className="chat_message_icon">
                                <EmojiEmotionsOutlined
                                  sx={{
                                    color: navyGray,
                                    fontSize: "18px",
                                    marginLeft: "10px",
                                  }}
                                />
                                <div className="chat_react_emoji_section">
                                  <div className="emoji">
                                    {emojisReact.map((itm, index) => (
                                      <span
                                        key={index}
                                        onClick={() => {
                                          messageReact(message, itm);
                                        }}
                                      >
                                        {itm?.emoji}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div
                            className="chat_sms_card my_chat_message"
                            ref={bottomRef}
                          >
                            <div className="chat_txt">
                              {/* {loading ? (
                                
                              ) : (
                                
                              )} */}
                              <>
                                <div className="chat_message_icon">
                                  <EmojiEmotionsOutlined
                                    sx={{
                                      color: navyGray,
                                      fontSize: "18px",
                                      marginRight: "10px",
                                    }}
                                  />
                                  <div className="chat_react_emoji_section">
                                    <div className="emoji">
                                      {emojisReact.map((itm, index) => (
                                        <span
                                          key={index}
                                          onClick={() => {
                                            messageReact(message, itm);
                                          }}
                                        >
                                          {itm?.emoji}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <p
                                  className="chat_message_txt"
                                  style={{
                                    background: lightGreen100,
                                    position: "relative",
                                  }}
                                >
                                  <span className="txt">
                                    {message?.message}
                                  </span>
                                  <span className="time">
                                    {moment(message?.createdAt).format(
                                      "MMM DD, yyyy hh:mm a"
                                    )}
                                    <DoneAllOutlined
                                      sx={{
                                        fontSize: "12px",
                                        marginLeft: "5px",
                                        color: message?.isSeen
                                          ? success500
                                          : gray400,
                                      }}
                                    />
                                  </span>
                                  {/* <span className="receiver_react">{message?.senderReact || "😮"}</span> */}
                                  <p
                                    style={{
                                      display: "flex",
                                      position: "absolute",
                                      bottom: "-11px",
                                      right: "6px",
                                    }}
                                  >
                                    <p
                                      style={{
                                        background: "white",
                                        borderRadius: "50%",
                                      }}
                                    >
                                      {message?.senderReact}
                                    </p>
                                    <p
                                      style={{
                                        background: "white",
                                        borderRadius: "50%",
                                      }}
                                      className="receiver_react"
                                    >
                                      {message?.recieverReact}
                                    </p>
                                  </p>
                                </p>
                              </>
                            </div>
                            <div className="text-right">
                              {loading && index === 0 && <MessageLoader />}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
              </InfiniteScroll>
            </div>
            {/* main message body ends */}

            <div style={{ height: "20px" }}></div>

            <div ref={bottomRef} />
          </div>
          <div
            className="chatting-input-field-div"
            style={{ overflow: "visible" }}
          >
            <div
              className="input-group shadow-lg"
              style={{
                alignItems: "center",
                background: whiteColor,
                borderRadius: "12px",
              }}
            >
              <div
                className="input-group-append"
                style={{ margin: "0 10px 0 18px" }}
              >
                <input
                  type="checkbox"
                  id="chatEmoji"
                  style={{ display: "none" }}
                  // disabled={loading}
                />
                <label
                  htmlFor="chatEmoji"
                  className="chat-emoji"
                  onClick={(e) => setEmojiCheck(!emojiCheck)}
                >
                  <EmojiEmotionsOutlined
                    sx={{
                      color: navyGray,
                      fontSize: "18px",
                      position: "relative",
                      top: "2px",
                    }}
                  />
                </label>
                {emojiCheck && (
                  <div className="chat_emoji_section">
                    <div className="emoji">
                      {emojis.map((itm, index) => (
                        <span
                          key={index}
                          onClick={() => {
                            setMessageText(messageText + itm?.emoji);
                          }}
                        >
                          {itm?.emoji}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <input
                type="text"
                className={`form-control chatting-input-field-cls bg-white rounded `}
                placeholder="Message"
                aria-label="Message"
                value={messageText}
                onChange={handleChange}
                onKeyDown={onKeyDownHandler}
                // disabled={loading}
              />

              <div className="chat_send_button">
                <button type="button" onClick={sendMessageFun}>
                  <Send sx={{ color: success500, fontSize: "18px" }} />
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <Card style={{ borderRadius: 0 }}>
            <div className="container">
              <div style={{ height: "48px" }}></div>
            </div>
          </Card>
          <div
            className="container chat-container"
            style={{
              height: "calc(100vh - 205px)",
              overflowY: "auto",
            }}
          >
            <div className="chat_empty_container">
              <NoResult title="Please select user" para=" " />
            </div>
          </div>
          <div className="chatting-input-field-div">
            <div
              className="input-group shadow-lg"
              style={{
                alignItems: "center",
                background: whiteColor,
                borderRadius: "12px",
                height: "45px",
              }}
            ></div>
          </div>
        </>
      )}
    </>
  );
};

export default ChattingBorad;
