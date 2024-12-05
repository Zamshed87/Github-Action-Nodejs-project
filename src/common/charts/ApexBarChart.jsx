import React from "react";
import Chart from "react-apexcharts";

const ApexBarChart = ({ target, achievement, label }) => {
  const options = {
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
      },
    },
    xaxis: {
      categories: [" ", " "],
    },
  };

  const series = [
    {
      name: "Target",
      data: [target, null],
    },
    {
      name: "Achievement",
      data: [null, achievement],
      colors: ["#FF5733"],
    },
  ];

  return (
    <div>
      <div className="d-flex justify-content-center">
        <Chart options={options} series={series} type="bar" height={200} />
      </div>
      <div className="d-flex justify-content-center">
        <h6 className="mt-2">{label}</h6>
      </div>
    </div>
  );
};

export default ApexBarChart;
