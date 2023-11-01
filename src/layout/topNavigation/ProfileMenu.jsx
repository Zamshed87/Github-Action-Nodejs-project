import React, { useState } from "react";
import ProfilePopUp from "./ProfilePopUp";
import profileImg from "../../assets/images/profile.png";
import { shallowEqual, useSelector } from "react-redux";
import { APIUrl } from "../../App";

export default function ProfileMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const { intProfileImageUrl } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  return (
    <>
      <div className="top-user pointer" onClick={(e) => handleClick(e)}>
        <span className="profile-menu-img">
          {/* <img src={profileImg} alt="Profile" /> */}
          <img
            src={
              intProfileImageUrl
                ? `${APIUrl}/Document/DownloadFile?id=${intProfileImageUrl}`
                : profileImg
            }
            alt="Profile"
          />
        </span>
      </div>

      {/* profile PopUp */}
      <ProfilePopUp
        propsObj={{
          id,
          open,
          anchorEl,
          handleClose,
        }}
      />
    </>
  );
}
