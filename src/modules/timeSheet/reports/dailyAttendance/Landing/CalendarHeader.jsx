/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import CalendarBody from "./CalendarBody.jsx";
import { ArrowForwardIosOutlined, ArrowBackIosNewOutlined } from "@mui/icons-material";
import { getEmployeeAttendenceDetailsReport } from "./helper";

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function CalendarHeader({ value, setValue, allDayList }) {
  const [attendanceListDate, setAttendanceListDate] = useState([]);

  function currMonthName() {
    return value.format("MMMM");
  }

  function currMonth() {
    return value.format("MM");
  }

  function currYear() {
    return value.format("YYYY");
  }

  function prevMonth() {
    return value.clone().subtract(1, "month");
  }

  function nextMonth() {
    return value.clone().add(1, "month");
  }

  // get user profile data from store
  const { employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    if (allDayList?.length > 0) {
      getEmployeeAttendenceDetailsReport(
        employeeId,
        currMonth(),
        currYear(),
        setAttendanceListDate,
        allDayList
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDayList]); // This dependancy must need for change the date and fetch next or prev month day's data

  return (
    <>
      <header>
        <div className="row">
          <div className="col-9">
            <div className="currentMonthYear">
              <span
                onClick={() => {
                  setValue(prevMonth());
                }}
                style={{ cursor: 'pointer' }}
              >
                <ArrowBackIosNewOutlined sx={{ fontSize: '15px' }} />
              </span>

              <div className="monthDate">
                <span className="month">{currMonthName()}</span>
                <span className="year">{currYear()}</span>
              </div>

              <span
                onClick={() => {
                  setValue(nextMonth());
                }}
                style={{ cursor: 'pointer' }}
              >
                <ArrowForwardIosOutlined sx={{ fontSize: '15px' }} />
              </span>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-9">
            <div className="allDays">
              {weekdays?.map((item, index) => {
                return (
                  <h5 key={index} className="day">
                    {item}
                  </h5>
                );
              })}
            </div>
          </div>
        </div>
      </header>
      <div className="row">
        <div className="col-9">
          <CalendarBody
            allDayList={allDayList}
            value={value}
            attendanceListDate={attendanceListDate}
          />
        </div>
      </div>

    </>
  );
}

export default CalendarHeader;
