import moment from "moment";
import React, { Fragment } from "react";

const CalenderDateBody = ({ allDayList, value, attendanceListDate }) => {
  // {checkStatusAndChangeColor(item, i)}

  const checkStatusAndChangeColor = (date, index) => {
    if (attendanceListDate[index]?.presentStatus.toLowerCase() === "present") {
      return (
        <div
          //  style={colorList.preset.backgroundColor}
           
          className="singleCalendarDay"
        >
          <span className="day">{date}</span>
          <span className="status" style={{borderRadius: "99px", background: "#E6F9E9", color: "#299647", padding: "1px 8px"}}>
            {attendanceListDate[index]?.presentStatus}
          </span>
        </div>
      );
    } else if (
      attendanceListDate[index]?.presentStatus.toLowerCase() === "offday"
    ) {
      return (
        <div
          //  style={colorList.offday.backgroundColor}
           
          className="singleCalendarDay"
        >
          <span className="day">{date}</span>
          <span className="status" style={{borderRadius: "99px", background: "#F2F4F7", color: "#667085", padding: "1px 8px"}}>
            {attendanceListDate[index]?.presentStatus}
          </span>
        </div>
      );
    } else if (
      attendanceListDate[index]?.presentStatus.toLowerCase() === "leave"
    ) {
      return (
        <div
          //  style={colorList.leave.backgroundColor}
           
          className="singleCalendarDay"
        >
          <span className="day">{date}</span>
          <span className="status" style={{borderRadius: "99px", background: "#ECE9FE", color: "#6927DA", padding: "1px 8px"}}>
            {attendanceListDate[index]?.presentStatus}
          </span>
        </div>
      );
    } else if (
      attendanceListDate[index]?.presentStatus.toLowerCase() === "holiday"
    ) {
      return (
        <div
          //  style={colorList.holiday.backgroundColor}
           
          className="singleCalendarDay"
        >
          <span className="day">{date}</span>
          <span className="status" style={{borderRadius: "99px", background: "#E0EAFF", color: "#3538CD;", padding: "1px 8px"}}>
            {attendanceListDate[index]?.presentStatus}
          </span>
        </div>
      );
    } else if (
      attendanceListDate[index]?.presentStatus.toLowerCase() === "late"
    ) {
      return (
        <div
          //  style={colorList.late.backgroundColor}
           
          className="singleCalendarDay"
        >
          <span className="day">{date}</span>
          <span className="status" style={{borderRadius: "99px", background: "#FEF0C7", color: "#B54708;", padding: "1px 8px"}}> 
            {attendanceListDate[index]?.presentStatus}
          </span>
        </div>
      );
    } else if (
      attendanceListDate[index]?.presentStatus.toLowerCase() === "unprocessed"
    ) {
      return (
        <div
          //  style={colorList.unprocessed.backgroundColor}
           
          className="singleCalendarDay"
        >
          <span className="day">{date}</span>
          <span className="status" style={{borderRadius: "99px", background: "#FCE7F6", color: "#C11574", padding: "1px 8px"}}>
            {attendanceListDate[index]?.presentStatus}
          </span>
        </div>
      );
    } else if (
      attendanceListDate[index]?.presentStatus.toLowerCase() === "absent"
    ) {
      return (
        <div
          //  style={colorList.absent.backgroundColor}
           
          className="singleCalendarDay"
        >
          <span className="day">{date}</span>
          <span className="status" style={{borderRadius: "99px", background: "#FEE4E2", color: "#B42318", padding: "1px 8px"}}>
            {attendanceListDate[index]?.presentStatus}
          </span>
        </div>
      );
    } else if (
      attendanceListDate[index]?.presentStatus.toLowerCase() === "movement"
    ) {
      return (
        <div
          //  style={colorList.movement.backgroundColor}
           
          className="singleCalendarDay"
        >
          <span className="day">{date}</span>
          <span className="status" style={{borderRadius: "99px", background: "#FBE8FF", color: "#9F1AB1", padding: "1px 8px"}}>
            {attendanceListDate[index]?.presentStatus}
          </span>
        </div>
      );
    } else {
      return (
        <div
          //  style={colorList.default.backgroundColor}
           
          className="singleCalendarDay"
        >
          <span className="day">{date}</span>
        </div>
      );
    }
  };
  return (
    <div className="allCalendarDays">
      {/* first emty week */}
      {[...Array(Number(moment(value).startOf("month").format("day")[0]))].map(
        (item, index) => {
          return (
            <div
              key={index}
               
              className="singleCalendarDay"
            >
              <span className="day"></span>
            </div>
          );
        }
      )}
      
      {allDayList?.length > 0 &&
        allDayList?.map((item, i) => {
          return (
            <Fragment key={i}>{checkStatusAndChangeColor(item, i)}</Fragment>
          );
        })}

      {/* last empty week */}
      {[
        ...Array(Number(6 - moment(value).endOf("month").format("day")[0])),
      ].map((item, index) => {
        return (
          <div
            key={index}
             
            className="singleCalendarDay"
          >
            <span className="day"></span>
          </div>
        );
      })}
    </div>
  );
};

export default CalenderDateBody;
