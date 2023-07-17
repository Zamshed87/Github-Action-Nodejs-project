import React from "react";
import { useHistory } from "react-router";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import { Popover } from "@mui/material";
import { Person, Logout } from "@mui/icons-material";
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
// import profileImg from "../../assets/images/profile.png";
import { setLogoutAction } from "../../commonRedux/auth/actions";
import { setFirstLevelNameAction } from "../../commonRedux/reduxForLocalStorage/actions";
import { APIUrl } from "../../App";

const ProfilePopUp = ({ propsObj }) => {
  const { id, open, anchorEl, handleClose } = propsObj;
  const dispatch = useDispatch();
  const history = useHistory();
  const { userName, email, intProfileImageUrl } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const date = new Date();
  const year = date.getFullYear();
  return (
    <Popover
      sx={{
        "& .MuiPaper-root": {
          minWidth: "370px",
          padding: "25px",
        },
      }}
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <div className="profile-popup">
        <ul className="profile-popup-list">
          <li>
            <div className="single-profile-popup-list-icon-wrapper">
              {intProfileImageUrl ? (
                <img
                  src={`${APIUrl}/Document/DownloadFile?id=${intProfileImageUrl}`}
                  alt="Person"
                />
              ) : (
                <Person className="mr-3"/>
              )}
            </div>
            <div className="single-profile-popup-list-txt">
              <h3>{userName}</h3>
              <p>{email}</p>
            </div>
          </li>
          <li
            onClick={() => {
              history.push("/changepassword");
              handleClose();
            }}
          >
            <div className="single-profile-popup-list-icon">
              <KeyOutlinedIcon />
            </div>
            <div className="single-profile-popup-list-txt">
              <h3>{"Change Password"}</h3>
            </div>
          </li>

          <li
            onClick={() => {
              history.push("/");
              dispatch(setLogoutAction());
              dispatch(setFirstLevelNameAction(""));
            }}
          >
            <div className="single-profile-popup-list-icon">
              <Logout />
            </div>
            <div className="single-profile-popup-list-txt">
              <h3>{"Log Out"}</h3>
            </div>
          </li>
        </ul>

        <div className="profile-popup-footer">
          <ul>
            <li>
              <div className="profile-popup-footer-inner-div">
                <div className="circle"></div>
                <div>PeopleDesk@ {year}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Popover>
  );
};

export default ProfilePopUp;
