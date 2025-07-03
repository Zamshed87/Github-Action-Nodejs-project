import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import { useDispatch  } from "react-redux";
import { APIUrl } from "../../App";
import profileImg from "../../assets/images/profile_avatar.png";
import { nameCutter } from "../../utility/nameCutter";
import {
  setSelectedUserForChatAction
} from "./redux/Action";
import { gray100 } from "../../utility/customColor";

function notificationsLabel(count) {
  if (count > 99) {
    return "99+";
  }
  return `${count}`;
}

const ChattingLeftSideBarElement = ({
  cuser,
  chattingUserListByUserIdPagination,
  setChattingUserListByUserIdPagination,
  selectedUserForChatValue,
}) => {
  const dispatch = useDispatch();

  // const connection = useSelector(
  //   (state) => state?.chattingApp?.signalRConnection,
  //   shallowEqual
  // );

  // const lastUserForChatting = useSelector(
  //   (state) => state?.chattingApp?.lastUserForChatting,
  //   shallowEqual
  // );

  function selectedUserForChat(user) {
    dispatch(setSelectedUserForChatAction(user));
    // if (lastUserForChatting) {
    //   dispatch(resetLastUserForChattingAction(null));
    //   connection?.close?.(lastUserForChatting);
    // }

    if (user?.unSeenMessage > 0) {
      const updatedItems = chattingUserListByUserIdPagination.map((item) => {
        if (item?.userId === user?.userId) {
          return {
            ...item,
            unSeenMessage: 0,
          };
        }
        return item;
      });
      setChattingUserListByUserIdPagination(updatedItems);
    }
  }

  return (
    <div
      className="d-flex chatting_element_cls"
      style={{
        cursor: "pointer",
        alignItems: "center",
        backgroundColor: `${
          selectedUserForChatValue?.userId === cuser?.userId ? gray100 : ""
        }`,
      }}
      onClick={() => {
        selectedUserForChat(cuser);
      }}
    >
      <div className="p-2">
        <Avatar
          alt={cuser?.name}
          src={
            cuser?.imgId > 0
              ? `${APIUrl}/Document/DownloadFile?id=${cuser?.imgId}`
              : profileImg
          }
        />
      </div>
      <div className="p-2">
        <p className="chat_user_name">
          <b>{cuser?.name}</b> <br></br>
          {/* <span style={{ color: greenColor, fontWeight: "600" }}>
            typing...
          </span> */}
          <span>{nameCutter(0, 20, cuser?.lastMessage)}</span>
        </p>
      </div>
      <div
        className="ml-auto p-2"
        style={{ textAlign: "right", position: "relative", zIndex: "0" }}
      >
        <p>
          {cuser?.lastMessageAt}
          <br></br>
          {cuser.unSeenMessage > 0 ? (
            <IconButton aria-label={notificationsLabel(cuser?.unSeenMessage)}>
              <Badge
                badgeContent={notificationsLabel(cuser?.unSeenMessage)}
                color="primary"
              ></Badge>
            </IconButton>
          ) : null}
        </p>
      </div>
    </div>
  );
};

export default ChattingLeftSideBarElement;
