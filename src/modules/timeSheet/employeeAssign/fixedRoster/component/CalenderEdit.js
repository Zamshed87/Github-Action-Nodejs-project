/* eslint-disable no-unused-vars */
import moment from "moment";
import { useEffect, useState } from "react";
import Chips from "../../../../../common/Chips";
import { gray200 } from "../../../../../utility/customColor";

const CalenderEdit = ({
  calendar,
  monthYear,
  calendarData,
  setCalendarData,
  setIsRosterSetup,
  uniqueShiftBg,
  rosterDDL,
  uniqueShiftColor,
  isClickable = false,
}) => {
  const [dates, setDates] = useState([]);
  const [date, setDate] = useState({
    year: monthYear.split("-")[0],
    month: monthYear.split("-")[1],
  });

  // date generation
  useEffect(() => {
    let days = moment(`${date?.month}/01/${date?.year}`).daysInMonth();
    const demoDate = [];
    while (days) {
      demoDate.push({
        intDayId: `${days}`,
        dayName: moment(`${date?.month}/${days}/${date?.year}`).format("dddd"),
      });
      days--;
    }
    setDates(demoDate.reverse());
  }, [date]);

  useEffect(() => {
    const demoData = [];
    dates.forEach((element) => {
      const existingElement = calendar.find(
        // eslint-disable-next-line
        (item) => item?.intDay == element.intDayId
      );
      if (!existingElement) {
        demoData.push({
          ...element,
          intDayId: element?.intDayId,
          isActive: false,
        });
      } else {
        demoData.push({
          ...element,
          intDayId: existingElement?.intDay,
          strCalenderName: existingElement?.strCalendarName,
          isOffDay: existingElement?.isOffDay,
          isHoliday: existingElement?.isHoliday,
          isActive: false,
        });
      }
    });
    setCalendarData(demoData);
    // eslint-disable-next-line
  }, [dates, calendar]);

  return (
    <>
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
                  <div className="calendar-date-cell" key={i}>
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
                          ? `${
                              uniqueShiftBg[calendarData[i]?.shiftName]
                                ? uniqueShiftBg[calendarData[i]?.shiftName]
                                : "rgba(222,228,239,1)"
                            }`
                          : `${
                              calendarData[i]?.isOffDay
                                ? uniqueShiftBg["off Day"]
                                : calendarData[i]?.isHoliday
                                ? uniqueShiftBg['Holiday']
                                : uniqueShiftBg[
                                    calendarData[i]?.strCalenderName
                                  ]
                                ? uniqueShiftBg[
                                    calendarData[i]?.strCalenderName
                                  ]
                                : ""
                            }`,
                        color: calendarData[i]?.isActive
                          ? `${
                              uniqueShiftColor[calendarData[i]?.shiftName]
                                ? uniqueShiftColor[calendarData[i]?.shiftName]
                                : "gray"
                            }`
                          : `${
                              calendarData[i]?.isOffDay
                                ? uniqueShiftColor["off Day"]
                                : calendarData[i]?.isHoliday
                                ? uniqueShiftColor['Holiday']
                                : uniqueShiftColor[
                                    calendarData[i]?.strCalenderName
                                  ]
                                ? uniqueShiftColor[
                                    calendarData[i]?.strCalenderName
                                  ]
                                : ""
                            }`,
                      }}
                      onClick={() => {
                        calendarData[i].isActive = true;
                        setIsRosterSetup(true);
                        isClickable && setCalendarData([...calendarData]);
                      }}
                    >
                      {item?.intDayId}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className=" my-2 d-flex justify-content-around">
        {rosterDDL.length > 0 &&
          rosterDDL.map((item, index) => (
            <div key={index} className="text-center">
              {/* <p style={getChipStyleShift(item)}>{`${item} Shift `}</p> */}
              <p
                style={{
                  // borderRadius: "99px",
                  fontSize: "14px",
                  // padding: "2px 5px",
                  // fontWeight: 500,
                  color: `${uniqueShiftColor[item?.label]}`,
                  backgroundColor: `${uniqueShiftBg[item?.label]}`,
                }}
              >
                <Chips label={`${item?.label}`} />
              </p>
            </div>
          ))}
      </div>
    </>
  );
};
// <Chips label="Pending" classess=" warning" />
export default CalenderEdit;
