import React from "react";
import { Pie } from "@ant-design/plots";
const IDonutChart = ({ target, ach, label }) => {
  const data = [
    {
      type: "Target",
      value: target,
    },
    {
      type: "Actual",
      value: ach,
    },
  ];
  const config = {
    appendPadding: 10,
    data,
    angleField: "value",
    colorField: "type",
    radius: 0.9,
    label: {
      type: "inner",
      offset: "-30%",
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: "center",
      },
    },
    interactions: [
      {
        type: "element-active",
      },
    ],
  };

  return (
    <div className="h-100">
      {label && (
        <div className="text-center">
          <h6 className="mt-2">{label}</h6>
        </div>
      )}
      <Pie {...config} />
    </div>
  );
};

export default IDonutChart;
