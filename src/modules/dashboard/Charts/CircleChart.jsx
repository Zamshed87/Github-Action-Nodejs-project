/* eslint-disable no-useless-concat */
import GraphChart from "../../../common/GraphChart";

const CircleChart = () => {
  let attendence = 19;
  let totalDays = 30;
  let inTotal = Math.floor((attendence * 100) / totalDays);
  const radialChartData = {
    series: [inTotal],
    options: {
      chart: {
        height: 300,
        type: "radialBar",
        toolbar: {
          show: true,
        },
      },
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 0,
            size: "70%",
            background: "#fff",
            image: undefined,
            imageOffsetX: 0,
            imageOffsetY: 0,
            position: "front",
          },
          track: {
            background: "rgba(145, 158, 171, 0.16)",
            strokeWidth: "90%",
            margin: 0, // margin is in pixels
          },

          dataLabels: {
            show: true,
            name: {
              offsetY: -10,
              show: true,
              color: "#637381",
              fontSize: "14px",
            },
            value: {
              formatter: function (val) {
                return parseInt(attendence) + " " + "Days";
              },
              color: "#212B36",
              fontSize: "26px",
              fontWeight: "bold",
              show: true,
            },
            // formatter: (value) => {
            //   return 10;
            // },
          },
        },
      },
      fill: {
        type: ["gradient"],
        gradient: {
          type: "vertical",
          shadeIntensity: 1,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100],
          colorStops: [
            {
              offset: 10,
              color: "#5BE584",
              opacity: 1,
            },
            {
              offset: 80,
              color: "#007B55",
              opacity: 1,
            },
            {
              offset: 90,
              color: "#007B55",
              opacity: 1,
            },
          ],
        },
      },
      stroke: {
        lineCap: "round",
      },
      labels: ["Present"],
    },
  };

  return (
    <>
      <GraphChart
        chartDataObj={radialChartData}
        type="radialBar"
        height="300"
        width="300"
      />
    </>
  );
};

export default CircleChart;
