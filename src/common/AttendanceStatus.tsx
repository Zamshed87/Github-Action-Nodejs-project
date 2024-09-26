import { Tag } from "antd";
import React from "react";

interface IAttendanceStatus {
  status: string;
  rounded?: boolean;
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

const AttendanceStatus: React.FC<IAttendanceStatus> = ({
  status,
  rounded = false,
}) => {
  const color = statusColors[status];

  if (status === "Holiday") {
    return (
      <Tag
        style={{
          color: "grey",
          border: "1px solid lightGrey",
          borderRadius: rounded ? "50px" : "",
          fontWeight: 500,
        }}
        color={color}
      >
        {status}
      </Tag>
    );
  }
  if (color) {
    return (
      <Tag
        color={color}
        style={{ fontWeight: 500, borderRadius: rounded ? "50px" : "" }}
      >
        {status}
      </Tag>
    );
  }

  // Handling unknown status
  return status === "Not Found" || !status ? (
    <p>-</p>
  ) : (
    <Tag
      color="default"
      style={{
        backgroundColor: "#e1f5fe",
        color: "#0091ea",
        border: "1px solid #0091ea",
        borderRadius: rounded ? "50px" : "",
        fontWeight: 500,
      }}
    >
      {status}
    </Tag>
  );
};

export default AttendanceStatus;
