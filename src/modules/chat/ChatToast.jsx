import React from "react";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { shallowEqual, useSelector } from "react-redux";
import {
  setMessageInfoAction,
  setSelectedUserAction,
} from "../../commonRedux/auth/actions";
import { useDispatch } from "react-redux";
import { useHistory, withRouter } from "react-router-dom";
import { nameCutter } from "../../utility/nameCutter";

const ChatToast = () => {
  const { messageInfo } = useSelector((state) => state?.auth, shallowEqual);

  const dispatch = useDispatch();
  const history = useHistory()

  return (
    <div
      onClick={(e) => {
        history.push("/chat")
        dispatch(setSelectedUserAction(messageInfo?.from));
      }}
      className="chatting-toast"
    >
      <h5>{messageInfo?.from?.strUserName}</h5>
      <p>{nameCutter(0, 100, messageInfo?.strMessage)}</p>
      <div
        onClick={(e) => {
          e.stopPropagation();
          dispatch(setMessageInfoAction(""));
        }}
        className="chatting-close"
      >
        <CancelOutlinedIcon />
      </div>
    </div>
  );
};

export default withRouter(ChatToast);
