import React from "react";
import Chart from "react-apexcharts";

const ApexDonutChart = ({ target, achievement, label }) => {
  const options = {
    chart: {
      type: "donut",
      height: 350,
    },
    labels: ["Target", "Achievement"],
    colors: ["#008FFB", "#00E396"],
    plotOptions: {
      pie: {
        expandOnClick: false,
        size: 70,
      },
    },
    dataLabels: {
      enabled: true,
    },
    legend: {
      position: "bottom",
    },
    annotations: {
      points: [
        {
          x: 30,
          y: 50,
          marker: {
            size: 0,
          },
          label: {
            borderColor: "#008FFB",
            style: {
              fontSize: "18px",
              background: "transparent",
              textAlign: "left",
            },
            text: target.toString(),
          },
        },
        {
          x: 70,
          y: 50,
          marker: {
            size: 0,
          },
          label: {
            borderColor: "#00E396",
            style: {
              fontSize: "18px",
              background: "transparent",
              textAlign: "right",
            },
            text: achievement.toString(),
          },
        },
      ],
    },
  };

  const series = [target, achievement];

  return (
    <div className="d-flex flex-column align-items-center">
      <div className="d-flex justify-content-center">
        <Chart options={options} series={series} type="donut" height={250} />
      </div>
      <div className="d-flex justify-content-center mt-3">
        <h6>{label}</h6>
      </div>
    </div>
  );
};

export default ApexDonutChart;
