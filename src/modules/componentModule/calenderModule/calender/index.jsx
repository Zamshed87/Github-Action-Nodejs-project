import React, { useState, useEffect } from 'react';
import CalenderBody from './calenderBody';

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function Calender({ item, blankList, lastWeekDay, endDay }) {

  // const [value, setValue] = useState(moment());
  const [allDayList, setAllDayList] = useState([]);

  useEffect(() => {
    let finalDayList = [...(Array(endDay) + 1)]?.map((item, index) => {
      if (index + 1 < 10) {
        return `0${index + 1}`;
      } else {
        return `${index + 1}`;
      }
    });
    setAllDayList(finalDayList);
  }, [endDay]);

  // useEffect(() => {
  //   setValue(moment(value));
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <>
      <div className="daily-attendance-landing self-daily-attendance-landing">
        <div className="table-card-heading">
          {item}
        </div>
        <div>
          <div className="dynamic-calender-css mainBody self-dynamic-calender-css">
            <div className="allDays self-allDays">
              {weekdays?.map((item, index) => {
                return (
                  <h5 key={index} className="day">
                    {item}
                  </h5>
                );
              })}
            </div>
            <CalenderBody
              allDayList={allDayList}
              endDay={endDay}
              blankList={blankList}
              lastWeekDay={lastWeekDay}
            />
          </div>
        </div>
      </div>
    </>
  );
}
