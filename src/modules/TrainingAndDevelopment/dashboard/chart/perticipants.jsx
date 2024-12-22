import React from "react";
import { Column } from "@ant-design/plots";

const PerticipantsChart = () => {
  const data = [
    { month: "Jan", perticipants: 20 },
    { month: "Feb", perticipants: 30 },
    { month: "Mer", perticipants: 50 },
    { month: "Apr", perticipants: 60 },
    { month: "May", perticipants: 70 },
    { month: "Jun", perticipants: 80 },
    { month: "Jul", perticipants: 90 },
    { month: "Aug", perticipants: 100 },
    { month: "Sep", perticipants: 70 },
    { month: "Oct", perticipants: 45 },
    { month: "Nov", perticipants: 67 },
    { month: "Dec", perticipants: 23 },
  ];

  const config = {
    data,
    xField: "month",
    yField: "perticipants",
    color: "#1890ff", // Single color for bars
    annotations: [
      {
        type: "text",
        position: ["50%", "0%"], // Centered at the top
        style: {
          fontSize: 15,
          fontWeight: "bold",
          textAlign: "center",
          fill: "#333",
          marginBottom: 25,
        },
      },
    ],
    onReady: ({ chart }) => {
      try {
        const { height } = chart._container.getBoundingClientRect();
        const tooltipItem = data[Math.floor(Math.random() * data.length)];
        chart.on(
          "afterrender",
          () => {
            chart.emit("tooltip:show", {
              data: {
                data: tooltipItem,
              },
              offsetY: height / 2 - 60,
            });
          },
          true
        );
      } catch (e) {
        console.error(e);
      }
    },
  };

  return <Column {...config} />;
};

export default PerticipantsChart;
