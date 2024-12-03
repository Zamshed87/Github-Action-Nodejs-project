import React from "react";
import type { BadgeProps, CalendarProps } from "antd";
import { Badge, Calendar } from "antd";
import moment from "moment";
import "./calender.css";

const getListData = (value: moment.Moment) => {
  let listData: { type: string; content: string }[] = []; // Specify the type of listData
  switch (value.date()) {
    case 8:
      listData = [
        { type: "warning", content: "This is war" },
        { type: "success", content: "This is us" },
      ];
      break;
    case 10:
      listData = [
        { type: "warning", content: "This is war." },
        { type: "success", content: "This ist." },
        { type: "error", content: "Thient." },
      ];
      break;
    case 15:
      listData = [
        { type: "warning", content: "This it" },
        { type: "success", content: "This.." },
        { type: "error", content: "Th1." },
        { type: "error", content: "Thist 2." },
        { type: "error", content: "This int 3." },
        { type: "error", content: "This ient 4." },
      ];
      break;
    default:
  }
  return listData || [];
};

const getMonthData = (value: moment.Moment) => {
  if (value.month() === 8) {
    return 1394;
  }
};

const TrainingCalender: React.FC = () => {
  const monthCellRender = (value: moment.Moment) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };

  const dateCellRender = (value: moment.Moment) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.content}>
            <Badge
              status={item.type as BadgeProps["status"]}
              text={item.content}
            />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <h3>Training Calender</h3>
      <div style={{ height: "40%", width: "100%", padding: "30px" }}>
        <Calendar
          dateCellRender={dateCellRender}
          monthCellRender={monthCellRender}
        />
      </div>
    </div>
  );
};

export default TrainingCalender;
