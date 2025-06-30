import React from "react";
import moment from "moment";
import { useSelector, shallowEqual } from "react-redux";
import { ProfilePicIcon } from "../../api";

function SingleMsg({ item }) {
  // Get Data from Redux State
  const { values, profileData } = useSelector((state) => {
    return {
      values: state.iChatApp,
      profileData: state.auth.profileData,
    };
  }, shallowEqual);

  return (
    <>
      {/* Divider With Date */}
      {/* <div className="chat-box-single-line">
        <abbr className="timestamp">October 9th, 2015</abbr>
      </div> */}

      {profileData?.userAutoId !== +item?.senderId ? (
        <div>
          {/* Left Chat | Sender */}
          <div className="direct-chat-info clearfix">
            <span className="direct-chat-name pull-left">
              {values?.selectedUserData?.strUserName}
            </span>
          </div>
          {/* <img
            alt="iamgurdeepEmdadul Hauqe"
            src="https://avatars.githubusercontent.com/u/57855533?s=400&u=dbe46684e54ed5be402bd63d447daf45e84d28bb&v=4"
            className="direct-chat-img"
          /> */}
          <ProfilePicIcon
            className="direct-chat-img"
            color="#EF4444"
            name={values?.selectedUserData?.strUserName}
          />
          <div className="direct-chat-text">{item?.body || ""}</div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              marginLeft: "50px",
            }}
            className="direct-chat-info clearfix"
          >
            <span
              style={{ fontSize: "11px" }}
              className="direct-chat-timestamp pull-right pb-2"
            >
              {moment(item?.dateTime, "YYYY-MM-DD HH:mm:ss").fromNow()}
            </span>
          </div>
        </div>
      ) : (
        <div>
          {/* Right Chat | Me | Logged in User */}
          <div className="direct-chat-info clearfix">
            <span className="direct-chat-name-right pull-right">
              {profileData?.fullname || ""}
            </span>
          </div>
          {/* <img
            alt="iamgurdeepEmdadul Hauqe"
            src="https://avatars.githubusercontent.com/u/57855533?s=400&u=dbe46684e54ed5be402bd63d447daf45e84d28bb&v=4"
            className="direct-chat-img-right"
          /> */}
          <ProfilePicIcon
            color="#F59E0B"
            className="direct-chat-img-right"
            name={profileData?.fullname}
          />
          <div className="direct-chat-text-right text-right">
            {item?.body || ""}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginRight: "45px",
            }}
            className="direct-chat-info clearfix"
          >
            <span
              style={{ fontSize: "11px" }}
              className="direct-chat-timestamp pull-left pb-2"
            >
              {moment(item?.dateTime, "YYYY-MM-DD HH:mm:ss").fromNow()}
            </span>
          </div>
        </div>
      )}
    </>
  );
}

export default SingleMsg;
