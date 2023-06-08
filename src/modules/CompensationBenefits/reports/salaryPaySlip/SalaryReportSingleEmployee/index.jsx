import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import PrintView from "../../../../../common/PrintView";
import { withDecimal } from "../../../../../utility/numberToWord";
import { salaryDetailsPayslipPrint } from "../helper";
import Loading from "./../../../../../common/loading/Loading";
import "./styles.css";

const SalaryReportSingleEmp = () => {
  let location = useLocation();

  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState(null);

  const empId = location.state.employeeId;
  const monthId = location.state.month;
  const yearId = location.state.year;

  useEffect(() => {
    salaryDetailsPayslipPrint(empId, monthId, yearId, setRowDto, setLoading);
  }, [empId, monthId, yearId]);

  const getNetPayable = () => {
    if (rowDto?.length > 0) {
      let amountData = rowDto?.filter(
        (data) =>
          data?.SalaryPortionType === "NetPayable" &&
          data?.SalaryPortionName === "Net Payable Amount"
      );
      return +amountData?.[0]?.PortionAmount || 0;
    } else {
      return 0;
    }
  };

  return (
    <>
      {loading && <Loading />}
      <div className="singleEmp-main">
        <PrintView isSignature theading="Salary Sheet Report">
          <div className="info-salary-sheet-table">
            <div className="row m-0">
              <div className="col-md-6 ">
                <table>
                  <tr>
                    <td>Employee Name</td>
                    <td>Md. Mridul Hasan [12345]</td>
                  </tr>
                  <tr>
                    <td>Business Analyst</td>
                    <td>Business Analyst</td>
                  </tr>
                  <tr>
                    <td>Employment Type</td>
                    <td>Full-time</td>
                  </tr>
                  <tr>
                    <td>Department</td>
                    <td>Engineering</td>
                  </tr>
                  <tr>
                    <td>Workplace Group</td>
                    <td>ABCD</td>
                  </tr>
                  <tr>
                    <td>Business Unit</td>
                    <td>iBOS Limited</td>
                  </tr>
                </table>
              </div>
              <div className="col-md-6 ">
                <table>
                  <tr>
                    <td>Bank Name </td>
                    <td>Standard Chartered Bank Limited</td>
                  </tr>
                  <tr>
                    <td>Branch Name</td>
                    <td>Gulshan</td>
                  </tr>
                  <tr>
                    <td>District</td>
                    <td>Dhaka</td>
                  </tr>
                  <tr>
                    <td>Roting Number</td>
                    <td>2154567896</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
          <hr />
          <div className="payslip-heading">
            Pay Slip Of MD Mridul Hasan <small className="dot">.</small> October
            2021
          </div>
          <div className="box-amount-details">
            <table className="earning-table">
              <thead>
                <tr>
                  <th>Earnings</th>
                  <th>Amount in Taka</th>
                </tr>
              </thead>
              <tbody>
                {rowDto?.length > 0 && (
                  <>
                    {rowDto.map(
                      (data, index) =>
                        data?.SalaryPortionType === "Addition" && (
                          <>
                            <tr key={index}>
                              <td>{data?.SalaryPortionName}</td>
                              <td>{data?.PortionAmount || 0}</td>
                            </tr>
                          </>
                        )
                    )}
                  </>
                )}
                {rowDto?.length > 0 && (
                  <>
                    {rowDto.map(
                      (data, index) =>
                        data?.SalaryPortionType === "GrossEarnings" && (
                          <>
                            <tr key={index}>
                              <td>{data?.SalaryPortionName}</td>
                              <td>{data?.PortionAmount || 0}</td>
                            </tr>
                          </>
                        )
                    )}
                  </>
                )}
              </tbody>
            </table>
            <table className="deduction-table">
              <thead>
                <th>Deductions</th>
                <th>Amount in Taka</th>
              </thead>
              <tbody>
                {rowDto?.length > 0 && (
                  <>
                    {rowDto.map(
                      (data, index) =>
                        data?.SalaryPortionType === "Deduction" &&
                        data?.SalaryPortionName !== "Total Deduction" && (
                          <>
                            <tr key={index}>
                              <td>{data?.SalaryPortionName}</td>
                              <td>{data?.PortionAmount || 0}</td>
                            </tr>
                          </>
                        )
                    )}
                  </>
                )}
                {rowDto?.length > 0 && (
                  <>
                    {rowDto.map(
                      (data, index) =>
                        data?.SalaryPortionType === "Deduction" &&
                        data?.SalaryPortionName === "Total Deduction" && (
                          <>
                            <tr key={index}>
                              <td>{data?.SalaryPortionName}</td>
                              <td>{data?.PortionAmount || 0}</td>
                            </tr>
                          </>
                        )
                    )}
                  </>
                )}
              </tbody>
            </table>
            <hr />
            <div className="box-total-amount-info">
              <div className="row m-0 justify-content-between">
                <p>Net Pay</p>
                <h6>{getNetPayable()}</h6>
              </div>
              <p className="text-right py-2 text-small">
                In words: {withDecimal(getNetPayable())}
              </p>
              <div className="row m-0 justify-content-between">
                <p>Provident Fund Balance</p>
                <h6>
                  {rowDto?.length > 0 && (
                    <>
                      {rowDto.map(
                        (data) =>
                          data?.SalaryPortionType === "GratuityBalance" &&
                          data?.SalaryPortionName === "Gratuity Balance" && (
                            <>{data?.PortionAmount || 0}</>
                          )
                      )}
                    </>
                  )}
                </h6>
              </div>
              <div className="row m-0 justify-content-between pt-2">
                <p>Gratuity Balance</p>
                <h6>
                  {rowDto?.length > 0 && (
                    <>
                      {rowDto.map(
                        (data) =>
                          data?.SalaryPortionType === "PFBalance" &&
                          data?.SalaryPortionName ===
                            "Provident Fund Balance" && (
                            <>{data?.PortionAmount || 0}</>
                          )
                      )}
                    </>
                  )}
                </h6>
              </div>
            </div>
          </div>
        </PrintView>
      </div>
    </>
  );
};

export default SalaryReportSingleEmp;
