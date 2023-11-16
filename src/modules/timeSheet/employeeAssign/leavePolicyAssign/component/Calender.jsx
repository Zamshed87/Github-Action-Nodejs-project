// import moment from "moment";
// import { useEffect, useState } from "react";
import { gray200 } from "../../../../../utility/customColor";
// import { getChipStyle } from "../helper";
// import { gray200 } from "../utility/customColor";

const Calender = ({
  monthYear,
  singleShiftData,
  uniqueShiftColor,
  uniqueShiftBg,
}) => {

  return (
    <div className="employee-attendance-calendar-wrapper h-100">
      <div className=" " style={{ height: "80%" }}>
        <div
          className=" h-100"
          style={{
            padding: "12px",
            borderRight: `1px solid ${gray200}`,
          }}
        >
          <div className="calendar p-0 rounded-0">
            <div className="calendar-heading">
              <div>
                <p>Sunday</p>
              </div>
              <div>
                <p>Monday</p>
              </div>
              <div>
                <p>Tuesday</p>
              </div>
              <div>
                <p>Wednesday</p>
              </div>
              <div>
                <p>Thursday</p>
              </div>
              <div>
                <p>Friday</p>
              </div>
              <div>
                <p>Saturday</p>
              </div>
            </div>
            <div className="calendar-body">
              {singleShiftData?.map((item, i) => (
                <div
                  className="calendar-date-cell"
                  key={i}
                  style={{
                    gridColumn: `${
                      item?.dayName === "Monday"
                        ? "2/3"
                        : item?.dayName === "Tuesday"
                        ? "3/4"
                        : item?.dayName === "Wednesday"
                        ? "4/5"
                        : item?.dayName === "Thursday"
                        ? "5/6"
                        : item?.dayName === "Friday"
                        ? "6/7"
                        : item?.dayName === "Saturday"
                        ? "7/8"
                        : "1/2"
                    }`,
                  }}
                >
                  {/* <p style={getChipStyle(item?.strCalendarName)}>{item?.intDayId}</p> */}
                  <p
                    style={{
                      borderRadius: "50%",
                      fontSize: "15px",
                      paddingTop: "7px",
                      fontWeight: 500,
                      textAlign: "center",
                      width: "30px",
                      height: "30px",
                      color: `${uniqueShiftColor[item?.strCalendarName]}`,
                      backgroundColor: `${
                        uniqueShiftBg[item?.strCalendarName]
                      }`,
                    }}
                  >
                    {item?.intDayId}
                  </p>
                  
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calender;
