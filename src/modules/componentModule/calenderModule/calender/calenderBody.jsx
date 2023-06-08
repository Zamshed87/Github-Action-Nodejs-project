import React, { Fragment } from 'react';
import { colorList } from './../../../../utility/colorList';

export default function CalenderBody({ allDayList, endDay, blankList, lastWeekDay }) {
  return (
    <>
      <div className="allCalendarDays">
        {/* First Week Blank Days start */}
        {blankList && blankList.map((item, index) => {
          return (
            <div
              key={index}
              style={colorList.default.backgroundColor}
              className="singleCalendarDay"
            >
              <span className="day">-</span>
            </div>
          );
        })}
        {/* First Week Blank Days End */}

        {/* All Days of a month */}
        {allDayList?.length > 0 &&
          allDayList?.map((item, i) => {
            return (
              <Fragment key={i}>
                <div
                  style={colorList.unprocessed.backgroundColor}
                  className="singleCalendarDay"
                >
                  <span className="day">{item}</span>
                </div>
              </Fragment>
            );
          })}
        {/* All Days of a month End */}

        {/* Last Week Blank Days start */}
        {lastWeekDay && lastWeekDay.map((item, index) => {
          return (
            <div
              key={index}
              style={colorList.default.backgroundColor}
              className="singleCalendarDay"
            >
              <span className="day">-</span>
            </div>
          );
        })}
        {/* Last Week Blank Days End */}
      </div>

    </>
  );
}
