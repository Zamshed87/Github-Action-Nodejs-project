import React from "react";
import { Pie } from "@ant-design/plots";
import IHeart from "./IHeart";

const IDonutChart = ({target, ach}) => {
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
      <IHeart />
      <Pie {...config} />
    </div>
  );
};

export default IDonutChart;
