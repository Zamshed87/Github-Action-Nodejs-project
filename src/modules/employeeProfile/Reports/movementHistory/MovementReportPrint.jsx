/* eslint-disable no-unused-vars */
import { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import PrintView from "../../../../common/PrintView";

const tableData = [
  {
    emp: "MD. Mridul",
    dept: "Engineering",
    designation: "Business Analyst",
    type: "Full-Time",
    duration: "10",
  },
];

const EmMovementReportPrint = () => {
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
            <h4>Movement Details From 2nd January 2021 To 30th January 2021</h4>
          </div>
          <div className="table-body">
            <table className="table print-table">
              <thead className="thead-light">
                <tr>
                  <th scope="col">Employee</th>
                  <th scope="col">Department</th>
                  <th scope="col">Designation</th>
                  <th scope="col">Employment Type</th>
                  <th scope="col">Duration</th>
                </tr>
              </thead>
              <tbody>
                {rowDto?.map((data, index) => (
                  <>
                    <tr key={index}>
                      <td>{data?.emp}</td>
                      <td>{data?.dept}</td>
                      <td>{data?.designation}</td>
                      <td>{data?.type}</td>
                      <td>{data?.duration}</td>
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

export default EmMovementReportPrint;
