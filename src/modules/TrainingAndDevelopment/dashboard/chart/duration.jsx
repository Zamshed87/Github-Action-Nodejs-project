import React from "react";
import ReactDOM from "react-dom";
import { Column } from "@ant-design/plots";

const DurationChart = () => {
  const data = [
    { month: "Jan", duration_hour: 120 },
    { month: "Feb", duration_hour: 230 },
    { month: "Mer", duration_hour: 150 },
    { month: "Apr", duration_hour: 160 },
    { month: "May", duration_hour: 70 },
    { month: "Jun", duration_hour: 80 },
    { month: "Jul", duration_hour: 20 },
    { month: "Aug", duration_hour: 300 },
    { month: "Sep", duration_hour: 170 },
    { month: "Oct", duration_hour: 75 },
    { month: "Nov", duration_hour: 97 },
    { month: "Dec", duration_hour: 23 },
  ];
  const config = {
    data,
    xField: "month",
    yField: "duration_hour",
    color: "#eb2f96",
    annotations: [
      {
        type: "text",
        position: ["50%", "0%"], // Centered at the top
        content: "Duration in Hours",
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

export default DurationChart;
