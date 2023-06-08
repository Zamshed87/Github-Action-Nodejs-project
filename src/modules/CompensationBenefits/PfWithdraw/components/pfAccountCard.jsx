/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { numberWithCommas } from "../../../../utility/numberWithCommas";


const PfAccountCard = ({ rowDto }) => {
  return (
    <div className="pfAccountCard p-3">
      <h1>Total PF Account</h1>
      <hr />
      <div>
        <div className="d-flex justify-content-between">
          <p>Gratuity</p>
          <p className="bold">{numberWithCommas(rowDto?.gratuity)} Tk</p>
        </div>
        <div className="d-flex justify-content-between">
          <p>Employee Contribution</p>
          <p className="bold">
            {numberWithCommas(rowDto?.employeePFContribution)} Tk
          </p>
        </div>
        <div className="d-flex justify-content-between">
          <p>Employer Contribution</p>
          <p className="bold">
            {numberWithCommas(rowDto?.employerPFContribution)} Tk
          </p>
        </div>
      </div>
      <hr />
      <div>
        <div className="d-flex justify-content-between">
          <p>Total Provident & Fund</p>
          <p className="bold">
            {numberWithCommas(rowDto?.totalPFNGratuity)} Tk
          </p>
        </div>
        <div className="d-flex justify-content-between">
          <p>Total PF Withdraw</p>
          <p className="bold">{numberWithCommas(rowDto?.totalPFWithdraw)} Tk</p>
        </div>
      </div>
      <hr />
      <div>
        <div className="d-flex justify-content-between">
          <p>Total Available Provident & Fund</p>
          <p className="bold">
            {numberWithCommas(rowDto?.totalAvailablePFNGratuity)} Tk
          </p>
        </div>
      </div>
    </div>
  );
};

export default PfAccountCard;
