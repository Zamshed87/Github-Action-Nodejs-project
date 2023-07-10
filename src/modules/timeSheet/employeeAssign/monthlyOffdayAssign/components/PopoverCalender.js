import { Divider } from "@mui/material";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { APIUrl } from "../../../../../App";
import CommonEmpInfo from "../../../../../common/CommonEmpInfo";
import CalenderCommon from "../calenderCommon";
import moment from "moment";

const PopoverCalender = ({ propsObj }) => {
  const { orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const { selectedSingleEmployee, profileImg, calendarData, setCalendarData } =
    propsObj;

  return (
    <div>
      <div className="d-flex align-items-center my-3">
        <img
          className="ml-3"
          src={
            selectedSingleEmployee[0]?.profileImageUrl
              ? `${APIUrl}/Document/DownloadFile?id=${selectedSingleEmployee[0]?.profileImageUrl}`
              : profileImg
          }
          alt=""
          style={{ maxHeight: "78px", minWidth: "78px" }}
        />
        <CommonEmpInfo
          employeeName={selectedSingleEmployee[0]?.employeeName}
          designationName={selectedSingleEmployee[0]?.designation}
          departmentName={selectedSingleEmployee[0]?.department}
        />
      </div>
      <Divider sx={{ my: "8px !important" }} />
      <div className="px-3 pb-3">
        <div className="mb-2" style={{ fontSize: "14px", fontWeight: 500 }}>
          {moment().format("MMM, YYYY")}
        </div>
        <CalenderCommon
          orgId={orgId}
          monthYear={moment().format("YYYY-MM")}
          calendarData={calendarData}
          setCalendarData={setCalendarData}
        />
      </div>
    </div>
  );
};

export default PopoverCalender;
