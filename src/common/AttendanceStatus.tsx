import { Tag } from "antd";
import React from "react";

interface IAttendanceStatus {
  status: string;
}

const statusColors: { [key: string]: string } = {
  Present: "green",
  Absent: "red",
  Late: "gold",
  "Late Present": "gold",
  Leave: "purple",
  "Leave without pay": "purple",
  Holiday: "secondary",
  Offday: "blue",
  Movement: "lime",
  "Manual Present": "green",
  "Manual Absent": "red",
  "Manual Leave": "purple",
  "Manual Late": "gold",
  "Early Out": "geekblue",
  "Halfday Leave": "purple",
};

const AttendanceStatus: React.FC<IAttendanceStatus> = ({ status }) => {
  const color = statusColors[status];

  if (status === "Holiday") {
    return (
      <Tag style={{ color: "black" }} color={color}>
        {status}
      </Tag>
    );
  }
  if (color) {
    return <Tag color={color}>{status}</Tag>;
  }

  // Handling unknown status
  return status === "Not Found" ? (
    <p>-</p>
  ) : (
    <Tag color="default" style={{ backgroundColor: "#d9d9d9", color: "black" }}>
      {status}
    </Tag>
  );
};

export default AttendanceStatus;
