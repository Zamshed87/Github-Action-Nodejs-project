import React from "react";
import ApexBarChart from "../../../../../common/charts/ApexBarChart";
import ApexDonutChart from "../../../../../common/charts/ApexDonutChart";
import ApexGroupedBarChart from "../../../../../common/charts/ApexGroupedChart";
import ApexLineChart from "../../../../../common/charts/ApexLineChart";

const Chart = ({ chart }) => {
  return (
    <>
      {chart.chartType === "Bar" ? (
        <ApexBarChart
          target={chart.target}
          achievement={chart.ach}
          label={chart.label}
        />
      ) : chart.chartType === "Donut" ? (
        <ApexDonutChart
          target={chart.target}
          achievement={chart.ach}
          label={chart.label}
        />
      ) : chart.chartType === "Line" ? (
        <ApexLineChart
          target={chart.target}
          achievement={chart.ach}
          label={chart.label}
        />
      ) : chart.chartType === "Stacked bar" ? (
        <ApexGroupedBarChart
          target={chart.target}
          achievement={chart.ach}
          label={chart.label}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default Chart;
