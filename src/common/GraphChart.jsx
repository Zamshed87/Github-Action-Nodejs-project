import React from 'react';
import Chart from "react-apexcharts";

export default function GraphChart({ chartDataObj, type, width, height }) {
   return (
      <>
         <div className="radial-chart">
            <Chart
               options={chartDataObj?.options}
               series={chartDataObj?.series}
               type={type}
               height={height}
               width={width}
            />
         </div>
      </>
   );
}
