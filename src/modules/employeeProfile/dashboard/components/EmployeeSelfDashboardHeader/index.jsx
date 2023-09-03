import moment from "moment";
import React from "react";
import calenderIcon from "../../../../../assets/images/calenderIcon.svg";
import clockIcon from "../../../../../assets/images/clockIcon.svg";
import { dateFormatter } from "../../../../../utility/dateFormatter";

const EmployeeSelfDashboardHeader = ({
  calendarName,
  workingPeriod,
  calendarStartTime,
  calendarEndTime,
  serviceLength,
  joiningDate,
  confirmationDate,
}) => {
  return (
    <>
      <div className="col-md-5 pl-0">
        <div
          className="d-flex align-items-center"
          style={{
            boxShadow: "0px 1px 4px 1px rgba(99, 115, 129, 0.3)",
            padding: "12px",
          }}
        >
          <div className="d-flex align-items-center">
            <div style={{ paddingRight: "12px" }}>
              <img src={clockIcon} alt="" />
            </div>
            <div className="date-period-container">
              <h4>Today Working Period</h4>
              <p>{workingPeriod || "N/A"}</p>
            </div>
          </div>
          <div className="date-period-container date-period-container-left-border">
            <h4>{calendarName}</h4>
            <p>
              {calendarStartTime && calendarStartTime
                ? `${moment(calendarStartTime, "hh:mm:ss").format(
                    "hh:mm A"
                  )} - ${moment(calendarEndTime, "hh:mm:ss").format("hh:mm A")}`
                : "N/A"}
            </p>
          </div>
        </div>
      </div>
      <div
        className="col-md-7 px-0"
        style={{
          boxShadow: "0px 1px 4px 1px rgba(99, 115, 129, 0.3)",
        }}
      >
        <div
          className="d-flex align-items-center"
          style={{
            boxShadow: "0px 4px 10px #EAEAEA",
            padding: "12px",
          }}
        >
          <div className="d-flex align-items-center">
            <div className="small-card-area" style={{ paddingRight: "12px" }}>
              <img src={calenderIcon} alt="" />
            </div>
            <div className="date-period-container">
              <h4>Length of Service</h4>
              <p>{serviceLength || "N/A"} </p>
            </div>
          </div>
          <div className="date-period-container date-period-container-left-border">
            <h4>Joining Date</h4>
            <p>{joiningDate ? dateFormatter(joiningDate) : "N/A"}</p>
          </div>
          <div className="date-period-container date-period-container-left-border">
            <h4>Confirmation Date</h4>
            <p>
              {/* {confirmationDate
                ? moment(confirmationDate).format("MMMM d, YYYY")
                : "N/A"} */}
              {confirmationDate ? dateFormatter(confirmationDate) : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeSelfDashboardHeader;
