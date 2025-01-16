import React from "react";
import { Column } from "@ant-design/plots";

const DurationChart = ({ data }) => {
  // Ensure data is defined and has a valid structure
  const validData = Array.isArray(data) ? data : [];

  const config = {
    data: validData, // Correctly pass the data key
    xField: "month",
    yField: "totalDurationInHours",
    color: "#eb2f96",
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
        if (!chart._container) {
          return;
        }
        const { height } = chart._container.getBoundingClientRect();
        if (!validData || validData.length === 0) {
          return;
        }
        const tooltipItem =
          validData[Math.floor(Math.random() * validData.length)];
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
