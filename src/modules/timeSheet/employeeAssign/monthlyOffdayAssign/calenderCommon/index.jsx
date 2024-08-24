/* eslint-disable no-unused-vars */
import moment from "moment";
import { useEffect, useState } from "react";
import { gray200 } from "../../../../../utility/customColor";

const CalenderCommon = ({
  monthYear,
  calendarData,
  setCalendarData,
  isClickable = false,
}) => {
  
  const [dates, setDates] = useState([]);
  const [date, setDate] = useState({
    year: monthYear.split("-")[0],
    month: monthYear.split("-")[1],
  });

  // Update the date state when monthYear changes
  useEffect(() => {
    setDate({
      year: monthYear.split("-")[0],
      month: monthYear.split("-")[1],
    });
  }, [monthYear]);

  useEffect(() => {
    // Generate dates array
    let days = moment(`${date.month}/01/${date.year}`).daysInMonth();
    const demoDate = [];
    while (days) {
      demoDate.push({
        day: `${days}`,
        dayName: moment(`${date.month}/${days}/${date.year}`).format("dddd"),
      });
      days--;
    }
    setDates(demoDate.reverse());
  }, [date]);

  return (
    <div className="employee-attendance-calendar-wrapper h-100">
      <div className="mx-0 " style={{ height: "80%" }}>
        <div
          className="h-100"
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
              {dates?.map((item, i) => (
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
                  <div
                    className=""
                    style={{
                      borderRadius: "50%",
                      width: "35px",
                      height: "35px",
                      textAlign: "center",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: isClickable ? "pointer" : "",
                      backgroundColor: calendarData[i]?.isOffday
                        ? calendarData[i]?.offdayReason === "Reassign"
                          ? "yellow" // Color for Reassign (changed to yellow)
                          : calendarData[i]?.offdayReason === "Swap"
                          ? "rgba(99, 196, 126)" // Color for Swap (swapped with Reassign's color)
                          : calendarData[i]?.offdayReason === "Weekly"
                          ? "gray" // Color for Weekly
                          : "rgba(222,228,239,1)" // Default color
                        : "",
                      color: calendarData[i]?.isOffday ? "black" : "",
                      transition: "background-color 0.3s ease", // Smooth transition for hover
                    }}
                    title={
                      calendarData[i]?.isOffday
                        ? calendarData[i]?.offdayReason
                        : ""
                    }
                  >
                    {item?.day}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalenderCommon;
