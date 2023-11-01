import { Button } from "@material-ui/core";
import { AccountBox, BusinessCenter } from "@mui/icons-material";
import React from "react";
import Chips from "../../../../../common/Chips";
import CakeIcon from "@mui/icons-material/Cake";
import { dateFormatter } from "../../../../../utility/dateFormatter";
import PersonIcon from "@mui/icons-material/Person";
import SpaIcon from "@mui/icons-material/Spa";
import { APIUrl } from "../../../../../App";
import DemoImage from "../../../../../assets/images/avatar_logo.jpg";
import { gray900 } from "../../../../../utility/customColor";

const iconStyle = {
  fontSize: "16px",
  color: gray900,
  marginRight: "9px",
};


const About = ({ empInfo }) => {
  return (
    <>
      <div className="card-about-info row w-full ">
        <div className="add-image-about-info-card">
          {
            empInfo?.intEmployeeImageUrlId > 0 ? (
              <img
                src={`${APIUrl}/Document/DownloadFile?id=${empInfo?.intEmployeeImageUrlId}`}
                alt="Profile Pic"
                style={{ maxHeight: "140px", minWidth:"140px" }}
              />
            ) : (
              <img
                src={DemoImage}
                alt="Profile Pic"
                style={{ height: "inherit" }}
              />
            )
          }
        </div>
        <div className="content-about-info-card">
          <div className="d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <h4 className="name-about-info">{empInfo?.strEmployeeName}</h4>
              <Button>
                <Chips
                  style={{ padding: "1px 8px!important" }}
                  label={
                    empInfo?.intEmployeeStatusId === 1
                      ? "Active"
                      : empInfo?.intEmployeeStatusId === 2
                        ? "InActive"
                        : empInfo?.intEmployeeStatusId === 3
                          ? "Retired"
                          : empInfo?.intEmployeeStatusId === 4
                            ? "Salary Hold"
                            : ""
                  }
                  classess={
                    empInfo?.intEmployeeStatusId === 1
                      ? "success"
                      : empInfo?.intEmployeeStatusId === 2
                        ? "danger"
                        : empInfo?.intEmployeeStatusId === 3
                          ? "warning"
                          : empInfo?.intEmployeeStatusId === 4
                            ? "hold"
                            : ""
                  }
                />
              </Button>
            </div>
          </div>
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
