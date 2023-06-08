/* eslint-disable no-unused-vars */
import React from "react";
import { useDispatch } from "react-redux";
import { setLogoutAction } from "../../commonRedux/auth/actions";
import { setLanguageAction } from "./../../commonRedux/reduxForLocalStorage/actions";
import { useHistory } from "react-router";
import { shallowEqual, useSelector } from "react-redux";
import { Person, Message, Help, Logout } from "@mui/icons-material";
import profileImg from "../../assets/images/profile.png";

export default function ProfileSidebar({
  isProfileSidebar,
  setIsProfileSidebar,
}) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { userImage } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  return (
    <>
      <div className="profile-sidebar-innerbody">
        <div
          onClick={() => setIsProfileSidebar(!isProfileSidebar)}
          className="d-flex justify-content-between align-items-center px-2"
        >
          <span className="profile-sidebar-close">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{ height: "26px", width: "26px" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </span>
        </div>
        <div className="profile-sidebar-innerbody-txt mt-4">
          <div className="col-md-12 d-flex  align-items-center my-1">
            {true ? (
              <img
                src={profileImg}
                alt={"iBOS"}
                style={{ width: "45px", height: "45px", borderRadius: "50%" }}
              />
            ) : (
              <Person />
            )}
            <div
              style={{
                color: "#637381",
                marginLeft: "20px",
              }}
            >
              <p className="font-weight-bold">{"Albert Morata"}</p>
              <p className="font-size-sm">{"peopleDesk@ibos.io"}</p>
            </div>
          </div>
          <hr
            style={{
              width: "100%",
              height: ".8px",
              backgroundColor: "#E5E5E5",
              margin: "10px 0",
            }}
          />

          <div className="col-md-12 d-flex align-items-center my-1">
            <Message />
            <div
              style={{
                color: "#637381",
                marginLeft: "20px",
              }}
            >
              <p className="font-weight-bold">Give Feedback</p>
              <p className="font-size-sm">Help us improve the new Feedback.</p>
            </div>
          </div>
          <hr
            style={{
              width: "100%",
              height: ".8px",
              backgroundColor: "#E5E5E5",
              margin: "10px 0",
            }}
          />

          <div className="col-md-12 d-flex align-items-center my-1">
            <Help />
            <div
              style={{
                color: "#637381",
                marginLeft: "20px",
              }}
            >
              <p className="font-weight-bold">Help & Support</p>
            </div>
          </div>

          <div
            className="btn logoutBtn col-md-12 d-flex align-items-center my-1"
            onClick={() => {
              history.push("/");
              dispatch(setLogoutAction());
            }}
          >
            <Logout />
            <div
              style={{
                color: "#00AB55",
                marginLeft: "20px",
              }}
            >
              <p className="font-weight-bold">Log Out</p>
            </div>
          </div>
          <div className="col-md-12 d-flex justify-content-center align-items-center my-4">
            <div>
              <p className="ml-2 font-size-sm">Terms</p>
            </div>
            <div className="d-flex align-items-center ml-2">
              <span className="dot"></span>
              <p className="ml-2 font-size-sm">Privacy</p>
            </div>
            <div className="d-flex align-items-center ml-2">
              <span className="dot"></span>
              <p className="ml-2 font-size-sm">iBMS@2021</p>
            </div>
          </div>

          {/* old */}
          {/* <div className="profile-inner-txt text-center">
            <button
              type="button"
              className="btn btn-basic my-3"
              onClick={() =>
                dispatch(setLanguageAction({ value: 2, label: "Bangla" }))
              }
            >
              Change Language
            </button>
          </div> */}
        </div>
      </div>
    </>
  );
}
