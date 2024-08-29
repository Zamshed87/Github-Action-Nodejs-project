import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Divider } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { APIUrl } from "../../../../../App";
import CommonEmpInfo from "../../../../../common/CommonEmpInfo";
import CalenderCommon from "../calenderCommon";
import { getSingleCalendar } from "../helper";

const PopoverCalender = ({ propsObj }) => {
  console.log(propsObj);
  const [monthYear, setMonthYear] = useState(moment().format("YYYY-MM"));
  const [loading, setLoading] = useState(false);

  const { orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  useEffect(() => {
    const [year, month] = monthYear.split("-");
    getSingleCalendar(
      month,
      year,
      selectedSingleEmployee[0]?.employeeId ||
        selectedSingleEmployee[0]?.employId ||
        selectedSingleEmployee[0]?.intEmpId,
      setCalendarData,
      setLoading
    );
  }, [monthYear]);

  const currMonthName = () => moment(monthYear).format("MMMM");
  const currYear = () => moment(monthYear).format("YYYY");

  const prevMonth = () => {
    setMonthYear((prev) =>
      moment(prev).subtract(1, "months").format("YYYY-MM")
    );
  };

  const nextMonth = () => {
    setMonthYear((prev) => moment(prev).add(1, "months").format("YYYY-MM"));
  };

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
        {/* <div className="mb-2" style={{ fontSize: "14px", fontWeight: 500 }}>
          {moment().format("MMM, YYYY")}
        </div> */}
        <div className="d-flex align-items-center justify-content-center mb-2">
          <KeyboardArrowLeftIcon className="pointer" onClick={prevMonth} />
          <p style={{ fontSize: "20px", margin: "0 15px" }}>
            {currMonthName() + `, ` + currYear()}
          </p>
          <KeyboardArrowRightIcon className="pointer" onClick={nextMonth} />
          <div className="d-flex ml-auto">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
                marginRight: "15px",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "15px",
                  height: "15px",
                  backgroundColor: "yellow", // Updated color for Reassign
                  marginRight: "5px",
                  borderRadius: "3px",
                }}
              ></span>
              <span>Reassign</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
                marginRight: "15px",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "15px",
                  height: "15px",
                  backgroundColor: "rgba(99,196,126)", // Updated color for Swap
                  marginRight: "5px",
                  borderRadius: "3px",
                }}
              ></span>
              <span>Swap</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "15px",
                  height: "15px",
                  backgroundColor: "gray", // Color for Weekly remains the same
                  marginRight: "5px",
                  borderRadius: "3px",
                }}
              ></span>
              <span>Weekly</span>
            </div>
          </div>
        </div>
        <CalenderCommon
          orgId={orgId}
          monthYear={monthYear}
          calendarData={calendarData}
          setCalendarData={setCalendarData}
        />
      </div>
    </div>
  );
};

export default PopoverCalender;
