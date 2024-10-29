import { AccountBox, BusinessCenter } from "@mui/icons-material";
import React from "react";
import CakeIcon from "@mui/icons-material/Cake";
import { dateFormatter } from "../../../../../utility/dateFormatter";
import PersonIcon from "@mui/icons-material/Person";
import SpaIcon from "@mui/icons-material/Spa";
import { APIUrl } from "../../../../../App";
import DemoImage from "../../../../../assets/images/avatar_logo.jpg";
import { gray900 } from "../../../../../utility/customColor";
import { Tag } from "antd";
import { shallowEqual, useSelector } from "react-redux";

const iconStyle = {
  fontSize: "16px",
  color: gray900,
  marginRight: "9px",
};

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

const About = ({ empInfo }) => {
  const { employeeId, orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  return (
    <>
      <div className="card-about-info row w-full ">
        <div className="add-image-about-info-card">
          {empInfo?.intEmployeeImageUrlId > 0 ? (
            <img
              src={`${APIUrl}/Document/DownloadFile?id=${empInfo?.intEmployeeImageUrlId}`}
              alt="Profile Pic"
              style={{ maxHeight: "140px", minWidth: "140px" }}
            />
          ) : (
            <img
              src={DemoImage}
              alt="Profile Pic"
              style={{ height: "inherit" }}
            />
          )}
        </div>
        <div className="content-about-info-card">
          <div className="d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <h4 className="name-about-info">{empInfo?.strEmployeeName}</h4>
              <Tag
                style={{ borderRadius: "50px", fontWeight: 600 }}
                className={getChipData(empInfo?.intEmployeeStatusId).class}
              >
                {getChipData(empInfo?.intEmployeeStatusId).label}
              </Tag>
            </div>
          </div>
          {orgId === 7 && (
            <h4 className="name-about-info">
              {empInfo?.strEmployeeNameBn || "N/A"}
            </h4>
          )}
          <div className="single-info">
            <AccountBox sx={iconStyle} />
            <p className="text-single-info">{empInfo?.strCardNumber}</p>
          </div>
          <div className="single-info">
            <BusinessCenter sx={iconStyle} />
            <p className="text-single-info">{empInfo?.strDesignation}</p>
          </div>
          <div className="single-info">
            <CakeIcon sx={iconStyle} />
            <p className="text-single-info">
              {dateFormatter(empInfo?.dteDateOfBirth)}
            </p>
          </div>
          <div className="single-info">
            <PersonIcon sx={iconStyle} />
            <p className="text-single-info">{empInfo?.strGender}</p>
          </div>
          <div className="single-info">
            <SpaIcon sx={iconStyle} />
            <p className="text-single-info">{empInfo?.strReligion}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
