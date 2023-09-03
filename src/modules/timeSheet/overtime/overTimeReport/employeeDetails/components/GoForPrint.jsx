/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import PrintView from "../../../../../../common/PrintView";

const tableData = [
  {
    date: "01/02/2021",
    startTime: "09:00",
    endTime: "12:00",
    hours: "0.02",
    amount: "20.86",
    reason: "Production Deadline",
  },
  {
    date: "01/02/2021",
    startTime: "09:00",
    endTime: "12:00",
    hours: "0.02",
    amount: "20.86",
    reason: "Production Deadline",
  },
  {
    date: "01/02/2021",
    startTime: "09:00",
    endTime: "12:00",
    hours: "0.02",
    amount: "20.86",
    reason: "Production Deadline",
  },
  {
    date: "01/02/2021",
    startTime: "09:00",
    endTime: "12:00",
    hours: "0.02",
    amount: "20.86",
    reason: "Production Deadline",
  },
  {
    date: "01/02/2021",
    startTime: "09:00",
    endTime: "12:00",
    hours: "0.02",
    amount: "20.86",
    reason: "Production Deadline",
  },
  {
    date: "01/02/2021",
    startTime: "09:00",
    endTime: "12:00",
    hours: "0.02",
    amount: "20.86",
    reason: "Production Deadline",
  },
  {
    date: "01/02/2021",
    startTime: "09:00",
    endTime: "12:00",
    hours: "0.02",
    amount: "20.86",
    reason: "Production Deadline",
  },
  {
    date: "01/02/2021",
    startTime: "09:00",
    endTime: "12:00",
    hours: "0.02",
    amount: "20.86",
    reason: "Production Deadline",
  },
  {
    date: "01/02/2021",
    startTime: "09:00",
    endTime: "12:00",
    hours: "0.02",
    amount: "20.86",
    reason: "Production Deadline",
  },
  {
    date: "01/02/2021",
    startTime: "09:00",
    endTime: "12:00",
    hours: "0.02",
    amount: "20.86",
    reason: "Production Deadline",
  },
  {
    date: "01/02/2021",
    startTime: "09:00",
    endTime: "12:00",
    hours: "0.02",
    amount: "20.86",
    reason: "Production Deadline",
  },
  {
    date: "01/02/2021",
    startTime: "09:00",
    endTime: "12:00",
    hours: "0.02",
    amount: "20.86",
    reason: "Production Deadline",
  },
  {
    date: "01/02/2021",
    startTime: "09:00",
    endTime: "12:00",
    hours: "0.02",
    amount: "20.86",
    reason: "Production Deadline",
  },
  {
    date: "01/02/2021",
    startTime: "09:00",
    endTime: "12:00",
    hours: "0.02",
    amount: "20.86",
    reason: "Production Deadline",
  },
];

const OvertimeReportPrint = () => {
  const [rowDto, setRowDto] = useState([...tableData]);

  return (
    <>
      <PrintView isSignature theading="Overtime Report">
        <div className="goForPrintBody">
          <div className="sub-header">
            <div className="row">
              <div className="col-lg-3">
                <h6>Md. Mridul Hasan [12345]</h6>
                <h5>Business Analyst, Full-time</h5>
                <h5>Engineering</h5>
              </div>
              <div className="col-lg-9">
                <div className="row">
                  <div className="col-lg-3">
                    <p>Month</p>
                    <p>Total Overtime</p>
                    <p>Total Amount</p>
                  </div>
                  <div className="col-lg-3">
                    <small>February 2021</small>
                    <small>4 hrs</small>
                    <small>1300 tk</small>
                  </div>
                  <div className="col-lg-3">
                    <p>Salary</p>
                    <p>Basic Salary</p>
                    <p>Rate</p>
                  </div>
                  <div className="col-lg-3">
                    <small>22,000</small>
                    <small>11,000</small>
                    <small>91.71</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <h3
              style={{
                fontSize: "12px",
                fontWeight: "700",
                lineHeight: "12px",
                color: "rgba(0, 0, 0, 0.7)",
                padding: "8px 0",
                letterSpacing: "0.2px",
              }}
            >
              Overtime Report
            </h3>
          </div>
          <div className="table-body">
            <table className="table">
              <thead className="thead-light">
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Start time</th>
                  <th scope="col">End time</th>
                  <th scope="col">Hours</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Reason</th>
                </tr>
              </thead>
              <tbody>
                {rowDto?.map((data, index) => (
                  <>
                    <tr key={index}>
                      <td>{data?.date}</td>
                      <td>{data?.startTime}AM</td>
                      <td>{data?.endTime}AM</td>
                      <td>{data?.hours}hrs</td>
                      <td>{data?.amount}</td>
                      <td>{data?.reason}</td>
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

export default OvertimeReportPrint;
