import React from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { setPopUpStateAction } from "../../redux/Action";

function ChatAppTabComponent() {
  const dispatch = useDispatch();

  // Get Data from Redux State
  const { values, popUpState } = useSelector((state) => {
    return {
      popUpState: state.iChatApp.popUpState,
      values: state.iChatApp,
    };
  }, shallowEqual);

  /* Total Unseen Message Private Chat */
  let recentInboxUnseenMsgNumber = values?.recentInboxUserList?.length
    ? values?.recentInboxUserList?.reduce(
        (acc, obj) => acc + +obj?.unseenMsgNumber,
        0
      )
    : null;

  /* Total Unseen Message Group Chat */
  let recentGroupInboxUnseenMsgNumber = values?.recentGroupChatUserList?.length
    ? values?.recentGroupChatUserList?.reduce(
        (acc, obj) => acc + +obj?.unseenMsgNumber,
        0
      )
    : null;

  return (
    <div className="chatApp-tab">
      <ul className="nav nav-tabs">
        <li
          onClick={() => dispatch(setPopUpStateAction("inbox"))}
          style={{ position: "relative" }}
          className="nav-item pointer"
        >
          <span
            className={`nav-link py-1 ${popUpState === "inbox" && "active"}`}
            aria-current="page"
          >
            <i style={{ marginRight: "5px" }} className="fas fa-comment-dots"></i>{" "}
            Recent
          </span>

          {recentInboxUnseenMsgNumber ? (
            <span className="smallIconColorChatApp">
              {recentInboxUnseenMsgNumber <= 99
                ? recentInboxUnseenMsgNumber
                : `${99}+`}
            </span>
          ) : null}
        </li>

        <li
          onClick={() => dispatch(setPopUpStateAction("groupInbox"))}
          style={{ position: "relative" }}
          className="nav-item pointer"
        >
          <span
            className={`nav-link py-1 ${popUpState === "groupInbox" &&
              "active"}`}
          >
            <i
              style={{ fontSize: "15px", marginRight: "5px" }}
              className="fas fa-users"
            ></i>{" "}
            Group
            {recentGroupInboxUnseenMsgNumber ? (
              <span className="smallIconColorChatApp">
                {recentGroupInboxUnseenMsgNumber <= 99
                  ? recentGroupInboxUnseenMsgNumber
                  : `${99}+`}
              </span>
            ) : null}
          </span>
        </li>

        {/* <li className="nav-item pointer">
          <span className={`nav-link py-1 ${"disabled"}`}>
            <i
              style={{ fontSize: "15px", marginRight: "5px" }}
              className="fas fa-star"
            ></i>{" "}
            Favorite
          </span>
        </li> */}
      </ul>
    </div>
  );
}

export default ChatAppTabComponent;
