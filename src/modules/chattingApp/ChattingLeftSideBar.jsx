import { useEffect, useState } from "react";
import ChattingLeftSideBarElement from "./ChattingLeftSideBarElement";
import { shallowEqual, useSelector } from "react-redux";
import Card from "@mui/material/Card";
import React from "react";
import { IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { getUserListForChatByAccountIdAsync } from "./helper";
import useDebounce from "../../utility/customHooks/useDebounce";
import Loading from "../../common/loading/Loading";
import InfiniteScroll from "react-infinite-scroll-component";
import profileImg from "../../assets/images/profile.png";
import { APIUrl } from "../../App";
import { AddOutlined } from "@mui/icons-material";
import { gray900 } from "../../utility/customColor";
import GroupChatCreate from "./component/GroupChatCreate";
import SkeletonLoader from "./SkeletonLoader";

const ChattingLeftSideBar = () => {
  const debounce = useDebounce();
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loaderCount, setLoaderCount] = useState(5);
  const [groupCreate, setGroupCreate] = useState(false);

  const [
    chattingUserListByUserIdPagination,
    setChattingUserListByUserIdPagination,
  ] = useState([]);

  const {
    orgId,
    intAccountId,
    strLoginId,
    intProfileImageUrl,
    strDisplayName,
  } = useSelector((state) => state?.auth?.profileData, shallowEqual);

  const fetchMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const getSearchedUsersList = (
    page,
    setter = true,
    searchText = "",
    handleLoading,
    cb = null
  ) => {
    getUserListForChatByAccountIdAsync(
      intAccountId,
      strLoginId,
      searchText,
      page,
      20,
      !setter ? null : setChattingUserListByUserIdPagination,
      handleLoading,
      setHasMore,
      cb
    );
  };

  const handleChange = (e) => {
    setSearchText(e.target.value);
    debounce(() => {
      if (e.target.value.length > 2) {
        setPage(1);
        setLoaderCount(5);
        getSearchedUsersList(1, true, e.target.value);
      } else {
        getSearchedUsersList(1);
      }
    }, 500);
  };

  useEffect(() => {
    if (page > 1) {
      setLoaderCount(2);
      if (searchText.length > 2) {
        getSearchedUsersList(page, false, searchText, setLoading, (res) => {
          setChattingUserListByUserIdPagination((prev) => [...prev, ...res]);
        });
      } else {
        getSearchedUsersList(page, false, "", setLoading, (res) => {
          setChattingUserListByUserIdPagination((prev) => [...prev, ...res]);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    getSearchedUsersList(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intAccountId, strLoginId]);

  const { connectionKEY } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const selectedUserForChat = useSelector(
    (state) => state?.chattingApp?.selectedUserForChat,
    shallowEqual
  );

  const connection = useSelector(
    (state) => state?.chattingApp?.signalRConnection,
    shallowEqual
  );

  const receiverId =
    selectedUserForChat != null ? selectedUserForChat?.userId : "";

  const receiverGroupId =
    selectedUserForChat != null && selectedUserForChat.isGroup === true
      ? selectedUserForChat?.userId
      : 0;

  const [message, setMessage] = useState({});

  useEffect(() => {
    try {
      if (connection) {
        const connectTo = connectionKEY + "___chatting_msgcount";

        connection.on(connectTo, (message) => {
          setMessage(message);
        });
      }
    } catch (error) {}

    // eslint-disable-next-line
  }, [receiverId, receiverGroupId, connection]);

  useEffect(() => {
    if (message?.senderId !== selectedUserForChat?.userId) {
      const userIndex = chattingUserListByUserIdPagination?.findIndex(
        (user) => user.userId === message.senderId
      );
      if (userIndex !== -1) {
        getSearchedUsersList(1, false, message.senderName, null, (res) => {
          const filteredUsers = chattingUserListByUserIdPagination?.filter(
            (user) => user.userId !== message.senderId
          );

          setChattingUserListByUserIdPagination([res[0], ...filteredUsers]);
        });
      } else {
        getSearchedUsersList(1, false, message.senderName, null, (res) => {
          setChattingUserListByUserIdPagination((prev) => [
            res[0],
            ...prev.slice(1, prev.length - 1),
          ]);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

  useEffect(() => {
    return () => {
      setChattingUserListByUserIdPagination([]);
    };
  }, []);

  return (
    <>
      {loading && <Loading />}
      <Card
        style={{
          borderRadius: 0,
          height: "calc(100vh - 89px)",
          position: "relative",
        }}
      >
        <div className="chat_messenger_top">
          <div className="chat_messenger_image_name">
            <div className="chat_messenger_img">
              <img
                src={
                  intProfileImageUrl
                    ? `${APIUrl}/Document/DownloadFile?id=${intProfileImageUrl}`
                    : profileImg
                }
                alt="Profile"
              />
            </div>
            <div className="chat_messenger_name">
              <h3>{strDisplayName}</h3>
            </div>
          </div>
        </div>

        {/* srearch */}
        <div className="d-flex">
          {searchText.length ? (
            <div className="p-1">
              <IconButton
                aria-label="cross"
                size="small"
                onClick={() => {
                  setSearchText("");
                  getSearchedUsersList(1);
                }}
                sx={{
                  position: "relative",
                  top: "7px",
                }}
              >
                <ClearIcon fontSize="inherit" />
              </IconButton>
            </div>
          ) : null}
          <div className="p-1" style={{ width: "100%" }}>
            <div className="form-group has-search">
              <span className="fa fa-search form-control-feedback"></span>
              <input
                type="text"
                className="form-control"
                placeholder="Search"
                value={searchText}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* user list */}
        <div
          id="chatting_user_list_id"
          style={{
            height: "calc(100vh - 240px)",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <InfiniteScroll
            dataLength={chattingUserListByUserIdPagination.length}
            next={fetchMore}
            hasMore={hasMore}
            scrollableTarget="chatting_user_list_id"
            loader={<SkeletonLoader loaderCount={loaderCount} />}
          >
            {chattingUserListByUserIdPagination.map((cuser, index) => (
              <ChattingLeftSideBarElement
                key={index}
                cuser={cuser}
                chattingUserListByUserIdPagination={
                  chattingUserListByUserIdPagination
                }
                setChattingUserListByUserIdPagination={
                  setChattingUserListByUserIdPagination
                }
                selectedUserForChatValue={selectedUserForChat}
              />
            ))}
          </InfiniteScroll>
        </div>

        {/* create group */}
        <div
          className="chat_create_group"
          onClick={() => {
            setGroupCreate(true);
          }}
        >
          <div className="chat_create_group_icon">
            <AddOutlined
              sx={{
                color: gray900,
                fontSize: "16px",
              }}
            />
          </div>
          <div className="chat_create_group_text">Create New Group</div>
        </div>

        {/* group creat */}
        {groupCreate && (
          <GroupChatCreate
            propsObj={{
              orgId,
              setGroupCreate,
            }}
          />
        )}
      </Card>
    </>
  );
};

export default ChattingLeftSideBar;
