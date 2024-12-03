import React from "react";
import moment from "moment";
import type { Moment } from "moment";
import { Calendar, Badge } from "antd";
import "./calender.css";

const getListData = (value: Moment): { type: string; content: string }[] => {
  // Ensure this function returns an array of objects with type and content properties
  return [];
};

const getMonthData = (value: Moment): number | null => {
  // Keep your implementation and ensure it returns a number or null
  return null; // Example return value
};

const dateCellRender = (value: Moment) => {
  const listData: { type: string; content: string }[] = getListData(value);
  return (
    <ul className="events">
      {listData?.map((item: any) => (
        <li key={item.content}>
          <Badge status={item.type as any} text={item.content} />
        </li>
      ))}
    </ul>
  );
};

const monthCellRender = (value: Moment) => {
  const num = getMonthData(value);
  return num ? (
    <div className="notes-month">
      <section>{num}</section>
      <span>Backlog number</span>
    </div>
  ) : null;
};

const TrainingCalender: React.FC = () => {
  return (
    <Calendar
      dateCellRender={dateCellRender}
      monthCellRender={monthCellRender}
    />
  );
};

export default TrainingCalender;
