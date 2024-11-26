import React from "react";
import Chart from "react-apexcharts";

const ApexLineChart = ({ target, achievement, label }) => {
  const options = {
    chart: {
      type: "line",
      height: 350,
    },
    xaxis: {
      categories: [" ", " "],
    }
  };

  const series = [
    {
      name: "Target",
      type: "line",
      data: [target, achievement],
    },
    {
      name: "Achievement",
      type: "column",
      data: [target, achievement],
    },
  ];

  return (
    <div>
      <div className="d-flex justify-content-center">
        <Chart options={options} series={series} type="line" height={200} width={210}/>
      </div>
      <div className="d-flex justify-content-center">
        <h6 className="mt-2">{label}</h6>
      </div>
    </div>
  );
};

export default ApexLineChart;