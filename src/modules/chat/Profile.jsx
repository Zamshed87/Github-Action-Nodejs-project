import React from "react";
import { nameCutterTwo } from "../../utility/nameCutter";

const Profile = ({ obj }) => {
  const { image, title, designation, isOnlineStatus, lastMessage } = obj;
  return (
    <div className="chat-profile">
      <div className="d-flex align-items-center">
        <div className={isOnlineStatus && "image-container"}>
          {image ? (
            <img
              src={
                image &&
                `https://emgmt.peopledesk.io/emp/Document/DownloadFile?id=${image}`
              }
              alt="pro-pic"
            />
          ) : (
            <div className="avatar d-flex align-items-center justify-content-center">{title?.[0]}</div>
          )}
        </div>
        <div>
          <h5>{title}</h5>
          <p>{designation}</p>
          <p style={{fontWeight: 500, color: lastMessage?.[0] === "1" ? "rgba(0, 0, 0, 0.7)" : "#01d601"}}>{nameCutterTwo(1, 20, lastMessage)}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
