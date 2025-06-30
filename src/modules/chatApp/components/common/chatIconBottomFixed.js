import React from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { setPopUpStateAction } from "../../redux/Action";

function ChatIconBottomFixed() {
  const dispatch = useDispatch();

  // Get Data from Redux
  const { values } = useSelector((state) => {
    return {
      values: state.iChatApp,
    };
  }, shallowEqual);

  /* Total Unseen Message */
  let recentInboxUnseenMsgNumber = values?.recentInboxUserList?.length
    ? values?.recentInboxUserList?.reduce(
        (acc, obj) => acc + +obj?.unseenMsgNumber,
        0
      )
    : null;

  /* Total Unseen Group Message */
  let recentGroupInboxUnseenMsgNumber = values?.recentGroupChatUserList?.length
    ? values?.recentGroupChatUserList?.reduce(
        (acc, obj) => acc + +obj?.unseenMsgNumber,
        0
      )
    : null;

  /* Set The Document title When a Msg Come */
  document.title = `${
    +recentInboxUnseenMsgNumber > 0 || +recentGroupInboxUnseenMsgNumber > 0
      ? `PeopleDesk | (${
          +recentInboxUnseenMsgNumber + +recentGroupInboxUnseenMsgNumber
        }) Unseen Message`
      : "PeopleDesk | Web App"
  }`;

  return (
    <div className="container text-center">
      <div className="round hollow text-center chatButtonCssWrapper">
        <div
          onClick={() => {
            if (
              +recentInboxUnseenMsgNumber < +recentGroupInboxUnseenMsgNumber
            ) {
              dispatch(setPopUpStateAction("groupInbox"));
            } else {
              dispatch(setPopUpStateAction("inbox"));
            }
          }}
          className="chatButtonCss"
        >
          <i
            style={{
              color: "white",
              fontSize: "27px",
            }}
            className="fas fa-comment-dots"
          ></i>

          {+recentInboxUnseenMsgNumber > 0 ||
          +recentGroupInboxUnseenMsgNumber > 0 ? (
            <span
              className="animate-bounce"
              style={{
                border: "3px solid white",
                borderRadius: "50%",
                height: "20px",
                width: "20px",
                position: "absolute",
                bottom: 0,
                right: 0,
                margin: "1px",
                background: "#34a853",
              }}
            >
              {+recentInboxUnseenMsgNumber + +recentGroupInboxUnseenMsgNumber <=
              99
                ? +recentInboxUnseenMsgNumber + +recentGroupInboxUnseenMsgNumber
                : `${99}+`}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ChatIconBottomFixed;
