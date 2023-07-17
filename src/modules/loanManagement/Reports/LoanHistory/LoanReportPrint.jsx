/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import PrintView from "../../../../common/PrintView";

const tableData = [
  {
    leaveType: "Casual Leave", 
    dateRange:"11/02/21-21/02/21",
    appDate:"21/02/2021",
    duration: "10",
    Reason:"Personal Problem"
  }
];

const LoanReportPrint = () => {
  const [rowDto, setRowDto] = useState([...tableData]);
  return (
    <>
      <PrintView isSignature>
        <div className="goForPrintBody">
          
          <div className="table-title">
            <h4>Loan Details From 2nd January 2021 To 30th January 2021</h4>
          </div>
          <div className="table-body">
            <table className="table print-table">
              <thead className="thead-light">
                <tr>
                  <th scope="col" >Employee</th>
                  <th scope="col">Loan Type</th>
                  <th scope="col">Loan Amount</th>
                  <th scope="col">Installment</th>
                  <th scope="col">Approval</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {
                  rowDto?.map((data, index) => (
                    <>
                      <tr key={index}>
                        <td>{data?.leaveType}</td>
                        <td>{data?.dateRange}</td>
                        <td>{data?.appDate}</td>
                        <td>{data?.duration} Days</td>
                        <td>{data?.Reason}</td>
                      </tr>
                    </>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </PrintView>
    </>
  );
};

export default LoanReportPrint;