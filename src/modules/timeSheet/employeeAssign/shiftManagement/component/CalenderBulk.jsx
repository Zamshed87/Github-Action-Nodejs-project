/* eslint-disable no-unused-vars */
import moment from "moment";
import { useEffect, useState } from "react";
import { gray200 } from "../../../../../utility/customColor";

const CalenderBulk = ({
  monthYear,
  calendarData,
  setCalendarData,
  isClickable = false,
}) => {
  const [dates, setDates] = useState([]);

  useEffect(() => {
    const [year, month] = monthYear.split("-");
    const daysInMonth = moment(`${year}-${month}-01`).daysInMonth();
    const generatedDates = Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      return {
        intDayId: `${day}`,
        dayName: moment(`${year}-${month}-${day}`).format("dddd"),
      };
    });
    setDates(generatedDates);
  }, [monthYear]);

  useEffect(() => {
    if (calendarData.length !== dates.length) {
      const newCalendarData = dates.map((item) => ({
        date: "",
        intDayId: item.intDayId,
        dayName: item.dayName,
        isActive: false,
      }));
      setCalendarData(newCalendarData);
    }
  }, [dates, calendarData, setCalendarData]);

  return (
    <div className="employee-attendance-calendar-wrapper h-100">
      <div className="mx-0" style={{ height: "80%" }}>
        <div
          className="h-100"
          style={{ padding: "12px", borderRight: `1px solid ${gray200}` }}
        >
          <div className="calendar p-0 rounded-0">
            <div className="calendar-heading">
              {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                <div key={day}>
                  <p>{day}</p>
                </div>
              ))}
            </div>
            <div className="calendar-body">
              {dates.map((item, i) => (
                <div
                  className="calendar-date-cell"
                  key={i}
                  style={{
                    gridColumn: `${
                      item.dayName === "Monday"
                        ? "2/3"
                        : item.dayName === "Tuesday"
                        ? "3/4"
                        : item.dayName === "Wednesday"
                        ? "4/5"
                        : item.dayName === "Thursday"
                        ? "5/6"
                        : item.dayName === "Friday"
                        ? "6/7"
                        : item.dayName === "Saturday"
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
                      backgroundColor: calendarData[i]?.isActive
                        ? "rgba(222,228,239,1)"
                        : "",
                      color: calendarData[i]?.isActive ? "gray" : "",
                    }}
                    onClick={() => {
                      if (calendarData[i]) {
                        const updatedCalendarData = [...calendarData];
                        updatedCalendarData[i].isActive = !updatedCalendarData[i].isActive;
                        isClickable && setCalendarData(updatedCalendarData);
                      }
                    }}
                  >
                    {item.intDayId}
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

export default CalenderBulk;
