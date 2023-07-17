/* eslint-disable no-unused-vars */
import { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import PrintView from "../../../../common/PrintView";

const tableData = [
  {
    leaveType: "Casual Leave",
    dateRange: "11/02/21-21/02/21",
    appDate: "21/02/2021",
    duration: "10",
    Reason: "Personal Problem",
  },
];

const EmLeaveReportPrint = () => {
  const [rowDto, setRowDto] = useState([...tableData]);
  const { supervisor } = useSelector(
    (state) => state?.auth?.keywords,
    shallowEqual
  );
  return (
    <>
      <PrintView isSignature>
        <div className="goForPrintBody">
          <div className="sub-header">
            <div className="row">
              <div className="col-lg-4">
                <h6>Md. Mridul Hasan [12345]</h6>
                <h5>Business Analyst, Full-time</h5>
                <h5>Engineering</h5>
              </div>
              <div className="col-lg-8">
                <div className="row">
                  <div className="col-lg-4">
                    <p>Workplace Group</p>
                    <p>Business Unit</p>
                    <p>{supervisor || "Supervisor"}</p>
                  </div>
                  <div className="col-lg-8">
                    <small>ABCD</small>
                    <small>iBOS Limited</small>
                    <small>MD Al-Amin</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="table-title">
            <h4>Leave Details From 2nd January 2021 To 30th January 2021</h4>
          </div>
          <div className="table-body">
            <table className="table print-table">
              <thead className="thead-light">
                <tr>
                  <th scope="col" className=" d-flex flex-grow-1">
                    Leave Type
                  </th>
                  <th scope="col">Date Range</th>
                  <th scope="col">Application Date</th>
                  <th scope="col">Duration</th>
                  <th scope="col">Reason</th>
                </tr>
              </thead>
              <tbody>
                {rowDto?.map((data, index) => (
                  <>
                    <tr key={index}>
                      <td>{data?.leaveType}</td>
                      <td>{data?.dateRange}</td>
                      <td>{data?.appDate}</td>
                      <td>{data?.duration} Days</td>
                      <td>{data?.Reason}</td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </PrintView>
    </>
  );
};

export default EmLeaveReportPrint;
