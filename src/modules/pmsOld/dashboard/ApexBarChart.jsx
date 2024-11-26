import React, { Component } from "react";
import Chart from "react-apexcharts";
import IHeart from "./IHeart";

class ApexBarChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        chart: {
          id: "apexchart-example",
          type: "bar",
        },

        xaxis: {
          categories: ["Target", "Actual"],
        },
      },
      series: [
        {
          name: "",
          data: [this.props.target, this.props?.ach],
        },
      ],
    };
  }
  render() {
    return (
      <div className="d-flex justify-content-center">
        <IHeart />
        <Chart
          options={this.state.options}
          series={this.state.series}
          type="bar"
          width={170}
          height={140}
        />
      </div>
    );
  }
}

export default ApexBarChart;
