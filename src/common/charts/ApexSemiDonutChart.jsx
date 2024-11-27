import React from "react";
import Chart from "react-apexcharts";

const ApexSemiDonutChart = ({ target, achievement, label }) => {
  var options = {
    series: [target, achievement],
    chart: {
    type: 'donut',
  },
  axis: {
    show: false
  },
  plotOptions: {
    pie: {
      startAngle: -90,
      endAngle: 90,
      offsetY: 10
    }
  },
  grid: {
    padding: {
      bottom: -80
    }
  },
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 200
      },
      legend: {
        position: 'bottom',
      }
    }
  }]
  };

  const series = [target, achievement];

  return (
    <div className="d-flex flex-column align-items-center">
      <div className="d-flex justify-content-center">
        <Chart options={options} series={series} type="donut" height={350} />
      </div>
      <div className="d-flex justify-content-center mt-3">
        <h6>{label}</h6>
      </div>
    </div>
  );
};

export default ApexSemiDonutChart;