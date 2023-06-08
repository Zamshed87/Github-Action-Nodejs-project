import React, { useState, useEffect } from "react";
import { getUserSearch } from "../../api";
import SingleRecentMessageCard from "./singleRecentMessageCard";
import SingleSearchUserCard, {
  SingleUserCardDemoForLoading,
} from "./singleSearchUserCard";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import {
  setPopUpStateAction,
  setSearchUserListAction,
  setSearchUserTextAction,
  setSelectedUserDataAction,
} from "../../redux/Action";
import ChatAppTabComponent from "../common/chatAppTabComponent";

export default function ChatAppInbox({ searchSkip, setSearchSkip }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const limit = 15;

  // Get Data from Redux State
  const { values, orgId } = useSelector((state) => {
    return {
      values: state.iChatApp,
      orgId: state?.auth?.profileData?.orgId,
    };
  }, shallowEqual);

  // Scroll To Top When Search Pagination Called
  useEffect(() => {
    const chatContent = document.querySelector(".popup-messages");
    chatContent.scrollTop = 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values?.searchUserList]);

  return (
    <>
      <div
        className="chat-box-main-wrapper popup-box chat-popup popup-box-on"
        id="qnimate"
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          className="popup-head"
        >
          <div>
            <h3 style={{ color: "white" }}>
              <i style={{ color: "white" }} className="fas fa-comment-dots"></i>{" "}
            </h3>
          </div>
          <div
            style={{
              fontSize: "15px",
              color: "white",
            }}
          >
            <div className="row">
              <div className="col-lg-12 d-flex align-center">
                <input
                  className="searchInputChat"
                  value={values?.searchUserText}
                  name="searchUserText"
                  placeholder="Search someone...."
                  type="text"
                  onChange={(e) => {
                    dispatch(setSearchUserTextAction(e.target.value));
                    if (e?.target?.value?.length >= 3) {
                      getUserSearch(
                        e?.target?.value,
                        orgId,
                        dispatch,
                        setLoading,
                        searchSkip,
                        limit
                      );
                    }
                    if (e.target.value.length === 0) {
                      dispatch(setSearchUserListAction(null));
                      setSearchSkip(0);
                    }
                  }}
                  onKeyPress={(e) => {
                    if (
                      values?.searchUserText?.length > 0 &&
                      e.key === "Enter"
                    ) {
                      getUserSearch(
                        values?.searchUserText,
                        orgId,
                        dispatch,
                        setLoading,
                        searchSkip,
                        limit
                      );
                    }
                  }}
                />

                {values?.searchUserText?.length > 0 ? (
                  <span
                    title="Clear Search"
                    onClick={() => {
                      dispatch(setSearchUserTextAction(""));
                      dispatch(setSearchUserListAction(null));
                      setSearchSkip(0);
                    }}
                    style={{
                      backgroundColor: "white",
                      display: "flex",
                      alignItems: "center",
                      padding: "0px 4px",
                      cursor: "pointer",
                    }}
                  >
                    <i
                      style={{
                        color: "#374151",
                      }}
                      className="fas fa-times mr-2 opacity-25"
                    ></i>
                  </span>
                ) : null}
                <span
                  title="Search..."
                  onClick={() => {
                    if (values?.searchUserText?.length > 0) {
                      getUserSearch(
                        values?.searchUserText,
                        orgId,
                        dispatch,
                        setLoading,
                        searchSkip,
                        limit
                      );
                    }
                  }}
                  style={{
                    backgroundColor: "white",
                    display: "flex",
                    alignItems: "center",
                    padding: "0px 4px",
                    cursor: "pointer",
                    borderTopRightRadius: "5px",
                    borderBottomRightRadius: "5px",
                  }}
                >
                  <i
                    style={{
                      color: "#374151",
                    }}
                    className="fas fa-search"
                  ></i>
                </span>
              </div>
            </div>
          </div>
          <div>
            <span
              onClick={() => {
                dispatch(setSearchUserTextAction(""));
                dispatch(setSearchUserListAction(null));
                dispatch(setSelectedUserDataAction(null));
                dispatch(setPopUpStateAction("close"));
              }}
              data-widget="remove"
              id="removeClass"
              className="chat-header-button pull-right"
              type="button"
            >
              <i
                style={{
                  color: "white",
                }}
                className="fas fa-times"
              ></i>
            </span>
          </div>
        </div>

        {/* Tab Menu */}
        {!values?.searchUserText?.length ? <ChatAppTabComponent /> : null}

        <div className="popup-messages">
          <div
            style={{
              paddingBottom: "0px",
            }}
            className="direct-chat-messages"
          >
            {/* Single Card User Search */}
            {values?.searchUserList?.length > 0 ? (
              <>
                {values?.searchUserList?.map((item, index) => (
                  <SingleSearchUserCard item={item} key={index} />
                ))}
              </>
            ) : null}

            {/* Single Card Recent Message */}
            {values?.recentInboxUserList?.length &&
            values?.searchUserText?.length === 0
              ? values?.recentInboxUserList?.map((item, index) => (
                  <SingleRecentMessageCard item={item} key={index} />
                ))
              : null}

            {/* Search Loading Card */}
            {loading && <SingleUserCardDemoForLoading />}

            {/* No Data Found Section For User | Conversion */}
            {values?.searchUserList?.length === 0 &&
            values?.searchUserText?.length > 0 ? (
              <div className="text-center">No User Found</div>
            ) : null}

            {/* Welcome Message */}
            {!values?.recentInboxUserList?.length &&
            values?.searchUserText?.length === 0 ? (
              <div
                style={{
                  height: "250px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div>
                  <h4
                    style={{ marginBottom: "0px", fontSize: "20px" }}
                    className="text-center"
                  >
                    Welcome to PeopleDesk Messenger
                  </h4>
                  <div className="text-center">
                    <small>Version 1.0</small>
                  </div>
                  <p className="text-center">
                    <i
                      style={{
                        fontSize: "10px",
                        color: "#374151",
                      }}
                      className="fas fa-search"
                    ></i>{" "}
                    Search a user for new conversation
                  </p>
                </div>
              </div>
            ) : null}

            {/* Single Card Pagination Button */}
            {values?.searchUserList?.length >= 0 ? (
              <div className="text-center">
                <div className="btn-group" role="group" aria-label="Basic example">
                  <button
                    disabled={searchSkip - limit < 0}
                    onClick={() => {
                      getUserSearch(
                        values?.searchUserText,
                        orgId,
                        dispatch,
                        setLoading,
                        searchSkip - limit,
                        limit
                      );
                      setSearchSkip(searchSkip - limit);
                    }}
                    type="button"
                    className="my-2 btn btn-secondary"
                  >
                    Prev
                  </button>
                  <button
                    disabled={
                      values?.searchUserList?.length === 0 ||
                      values?.searchUserList?.length < limit
                    }
                    onClick={() => {
                      getUserSearch(
                        values?.searchUserText,
                        orgId,
                        dispatch,
                        setLoading,
                        searchSkip + limit,
                        limit
                      );
                      setSearchSkip(searchSkip + limit);
                    }}
                    type="button"
                    className="my-2 btn btn-secondary"
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
