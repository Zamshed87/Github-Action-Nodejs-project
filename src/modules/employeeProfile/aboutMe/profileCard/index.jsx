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
import { Button } from "@mui/material";
import { styled } from "@mui/styles";
import React, { useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { APIUrl } from "../../../../App";
import editProPic from "../../../../assets/images/editProPic.svg";
import profileImg from "../../../../assets/images/profile.jpg";
import Chips from "../../../../common/Chips";
import Loading from "../../../../common/loading/Loading";
import { updateEmpProfilePicString } from "../../../../commonRedux/auth/actions";
import { gray900 } from "../../../../utility/customColor";
import { dateFormatter } from "../../../../utility/dateFormatter";
import "../aboutMe.css";
import AccordionCom from "../accordion";
import { empProfilePicUpload } from "../helper";
import { toast } from "react-toastify";

const Input = styled("input")({
  display: "none",
});

const iconStyle = {
  fontSize: "16px",
  color: gray900,
  marginRight: "9px",
};

const ProfileCard = ({
  empBasic,
  isEditBtn,
  editBtnHandler,
  empId,
  strProfileImageUrl,
  getEmpData,
  isMargin,
  isOfficeAdmin = false,
}) => {
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
          <label htmlFor="contained-button-file" className="label-add-image">
            {strProfileImageUrl && strProfileImageUrl > 0 ? (
              <img
                src={`${APIUrl}/Document/DownloadFile?id=${strProfileImageUrl}`}
                alt=""
                style={{ maxHeight: "150px", minWidth: "140px" }}
              />
            ) : (
              <img src={profileImg} alt="iBOS" style={{ height: "inherit" }} />
            )}

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
                          updateEmpProfilePicString(data?.[0]?.globalFileUrlId)
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
        <div className="content-about-info-card">
          <div className="d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <h4 className="name-about-info">
                {empBasic?.strEmployeeName || "N/A"}
              </h4>
              <Button>
                <Chips
                  style={{ padding: "1px 8px!important" }}
                  label={getChipData(empBasic?.intEmployeeStatusId).label}
                  className={getChipData(empBasic?.intEmployeeStatusId).class}
                />
              </Button>
            </div>
            {isEditBtn && isOfficeAdmin && (
              <div className="d-flex">
                <div
                  onClick={editBtnHandler}
                  className="about-edit-icon justify-content-end pointer"
                >
                  <Avatar className="edit-icon-btn">
                    <EditOutlined sx={{ color: gray900, fontSize: "16px" }} />
                  </Avatar>
                </div>
              </div>
            )}
          </div>
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
