import { Avatar } from "@material-ui/core";
import {
  AccountBox,
  ArrowDropDown,
  ArrowDropUp,
  BusinessCenter,
  EditOutlined,
} from "@mui/icons-material";
import CakeIcon from "@mui/icons-material/Cake";
import PersonIcon from "@mui/icons-material/Person";
import SpaIcon from "@mui/icons-material/Spa";
import { styled } from "@mui/styles";
import React, { useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { APIUrl } from "../../../../App";
import editProPic from "../../../../assets/images/editProPic.svg";
import profileImg from "../../../../assets/images/profile.jpg";
import Loading from "../../../../common/loading/Loading";
import { updateEmpProfilePicString } from "../../../../commonRedux/auth/actions";
import { gray900 } from "../../../../utility/customColor";
import { dateFormatter } from "../../../../utility/dateFormatter";
import "../aboutMe.css";
import AccordionCom from "../accordion";
import { empProfilePicUpload } from "../helper";
import { Tag } from "antd";
import { orgIdsForBn } from "utility/orgForBanglaField";

const Input = styled("input")({
  display: "none",
});

const iconStyle = {
  fontSize: "16px",
  color: gray900,
  marginRight: "9px",
};

const ProfileCard = ({
  progress,
  empBasic,
  isEditBtn,
  editBtnHandler,
  empId,
  strProfileImageUrl,
  getEmpData,
  isOfficeAdmin = false,
  isSelfService,
  viewBtnHandler,
  getEmpPendingData,
}) => {
  console.log({ progress });
  // this component is used from about me and employee landing page
  // accordion
  const [isAccordion, setIsAccordion] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  // eslint-disable-next-line
  const { employeeId, orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const getChipData = (statusId) => {
    switch (statusId) {
      case 1:
        return { label: "Active", class: "success" };
      case 2:
        return { label: "Inactive", class: "danger" };
      case 3:
        return { label: "Retired", class: "warning" };
      case 4:
        return { label: "Salary Hold", class: "hold" };
      default:
        return { label: "", class: "" };
    }
  };
  const progressContainer = {
    position: "relative",
    width: "150px",
    height: "150px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px",
  };

  const progressBorderStyle = {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: "4px",
    border: "4px solid #f0f0f0",
    boxSizing: "border-box",
  };

  const progressFillStyle = (progress) => ({
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: "4px",
    border: "4px solid transparent",
    borderImage: `linear-gradient(to right, #4CAF50 ${progress}%, #f0f0f0 ${progress}%) 1`,
    boxSizing: "border-box",
    clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0)`,
    transition: "border-image 0.3s ease",
  });

  const progressTooltipStyle = {
    position: "absolute",
    bottom: "-30px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#333",
    color: "#fff",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    opacity: 0,
    transition: "opacity 0.3s ease",
    zIndex: 99999999999, // Increased z-index to ensure it's above everything
    whiteSpace: "nowrap",
    pointerEvents: "none", // Ensure it doesn't interfere with image clicks
  };

  return (
    <div className="card-about-info-main about-info-card">
      {loading && <Loading />}
      <div className="card-about-info">
        <div
          style={{
            width:
              strProfileImageUrl > 0 ? strProfileImageUrl && "auto" : "140px",
          }}
          className={
            strProfileImageUrl > 0
              ? strProfileImageUrl && "add-image-about-info-card height-auto"
              : "add-image-about-info-card"
          }
        >
          <div className="hover-container">
            <div style={progressContainer}>
              <div className=""></div>
              <svg
                className="progress-ring"
                width="160"
                height="160"
                viewBox="0 0 100 100"
              >
                <rect
                  x="2"
                  y="2"
                  width="94"
                  height="94"
                  rx="2"
                  ry="2"
                  fill="none"
                  stroke="#f0f0f0"
                  strokeWidth="3"
                />
                <rect
                  x="2"
                  y="2"
                  width="94"
                  height="94"
                  rx="2"
                  ry="2"
                  fill="none"
                  stroke="#4CAF50"
                  strokeWidth="3"
                  strokeDasharray="376" // Total perimeter of 94*4
                  strokeDashoffset={
                    376 -
                    (Math.round(progress?.[0]?.ProfilePercentage) / 100) * 376
                  }
                  style={{ transition: " 1s ease-in-out" }}
                />
              </svg>

              {/* Tooltip in the center */}
              <div className="progress-tooltip">
                {Math.round(progress?.[0]?.ProfilePercentage)}%
              </div>
              <label
                htmlFor="contained-button-file"
                className="label-add-image"
                style={{ position: "relative", zIndex: 1 }} // Ensure image stays below tooltip
              >
                <div style={{ padding: "6px", backgroundColor: "white" }}>
                  {strProfileImageUrl && strProfileImageUrl > 0 ? (
                    <img
                      src={`${APIUrl}/Document/DownloadFile?id=${strProfileImageUrl}`}
                      alt=""
                      className="profile-img"
                      style={{ maxHeight: "150px", minWidth: "140px" }}
                    />
                  ) : (
                    <img
                      src={profileImg}
                      alt="iBOS"
                      className="profile-img"
                      style={{ height: "inherit" }}
                    />
                  )}
                </div>

                <>
                  <Input
                    accept="image/*"
                    id="contained-button-file"
                    multiple
                    disabled={loading}
                    type="file"
                    onChange={(e) => {
                      empProfilePicUpload(
                        orgId,
                        empId,
                        "EmployeePhotoIdentity",
                        1,
                        buId,
                        employeeId,
                        setLoading,
                        e.target.files,
                        (data) => {
                          // if response is successful and we have data , also updated profile picture emp id === login emp id , then update login info
                          if (data?.length > 0 && empId === employeeId) {
                            dispatch(
                              updateEmpProfilePicString(
                                data?.[0]?.globalFileUrlId
                              )
                            );
                          }
                          // get emp data again
                          getEmpData();
                        }
                      );
                    }}
                  />

                  <div className="cart-img-btn">
                    <img src={editProPic} alt="pro pic" />
                  </div>
                </>
              </label>
            </div>
          </div>
        </div>
        <div className="content-about-info-card">
          <div className="d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <h4 className="name-about-info">
                {empBasic?.strEmployeeName || "N/A"}
              </h4>
              <Tag
                style={{ borderRadius: "50px", fontWeight: 600 }}
                className={getChipData(empBasic?.intEmployeeStatusId).class}
              >
                {getChipData(empBasic?.intEmployeeStatusId).label}
              </Tag>
            </div>
            <div className="d-flex" style={{ alignItems: "center" }}>
              {isEditBtn && isOfficeAdmin && (
                <div
                  onClick={editBtnHandler}
                  className="about-edit-icon justify-content-end pointer"
                >
                  <Avatar className="edit-icon-btn">
                    <EditOutlined sx={{ color: gray900, fontSize: "16px" }} />
                  </Avatar>
                </div>
              )}
              {isSelfService && (
                <button
                  style={{
                    marginLeft: "10px",
                    padding: "4px 12px",
                    fontSize: "14px",
                    cursor: "pointer",
                    borderRadius: "4px",
                    border: `1px solid ${gray900}`,
                    background: "white",
                    color: gray900,
                  }}
                  onClick={viewBtnHandler}
                  type="button"
                >
                  View Approval Data
                </button>
              )}
            </div>
          </div>
          {orgIdsForBn.includes(orgId) && (
            <h4 className="name-about-info">
              {empBasic?.strEmployeeNameBn || "N/A"}
            </h4>
          )}
          <div className="single-info">
            <AccountBox sx={iconStyle} />
            <p className="text-single-info">
              {empBasic?.strCardNumber || "N/A"}
            </p>
          </div>
          <div className="single-info">
            <BusinessCenter sx={iconStyle} />
            <p className="text-single-info">
              {empBasic?.strDesignation || "N/A"}
            </p>
          </div>
          <div className="single-info">
            <CakeIcon sx={iconStyle} />
            <p className="text-single-info">
              {dateFormatter(empBasic?.dteDateOfBirth) || "N/A"}
            </p>
          </div>
          <div className="single-info">
            <PersonIcon sx={iconStyle} />
            <p className="text-single-info">{empBasic?.strGender || "N/A"}</p>
          </div>
          <div className="single-info">
            <SpaIcon sx={iconStyle} />
            <p className="text-single-info">{empBasic?.strReligion || "N/A"}</p>
          </div>
        </div>
      </div>

      <AccordionCom empBasic={empBasic} isAccordion={isAccordion} />

      <div
        className="see-more-btn-main"
        onClick={() => setIsAccordion(!isAccordion)}
      >
        <button className="btn-see-more">
          <small className="text-btn-see-more">
            {isAccordion ? "See Less" : "See More "}
          </small>
          {isAccordion ? (
            <ArrowDropUp
              sx={{
                marginLeft: "10px",
                fontSize: "20px",
                color: gray900,
                position: "relative",
                top: "1px",
              }}
            />
          ) : (
            <ArrowDropDown
              sx={{
                marginLeft: "10px",
                fontSize: "20px",
                color: gray900,
                position: "relative",
                top: "1px",
              }}
            />
          )}
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
