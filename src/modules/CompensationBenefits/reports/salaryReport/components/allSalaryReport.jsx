import React from "react";
import AvatarComponent from "../../../../../common/AvatarComponent";
import ScrollableTable from "../../../../../common/ScrollableTable";
import { getRowTotal } from "../../../../../utility/getRowTotal";
import { numberWithCommas } from "../../../../../utility/numberWithCommas";
// import { total } from '../helper';

export default function AllSalaryReport({ rowDto, index, tabIndex }) {
  return (
    index === tabIndex && (
      <>
        <ScrollableTable
          classes="salary-process-table"
          secondClasses="table-card-styled tableOne scroll-table-height"
        >
          <thead>
            <tr>
              <th rowSpan="2" style={{ minWidth: "200px" }}>
                SL
              </th>
              <th colSpan={3} className="text-center">
                Employee Information
              </th>
              <th style={{ textAlign: "right" }} className="mr-2">
                Salary
              </th>
              <th style={{ textAlign: "right" }} className=" mr-2">
                Total Allowance
              </th>
              <th style={{ textAlign: "right" }} className="mr-2">
                Total Deduction
              </th>
              <th
                style={{ textAlign: "right" }}
                className="th-inner-table mr-2"
              >
                Net Pay
              </th>
              <th style={{ textAlign: "right" }} className=" mr-2">
                Bank Pay
              </th>
              <th style={{ textAlign: "right" }} className="mr-2">
                Digital Bank Pay
              </th>
              <th style={{ textAlign: "right" }} className="mr-2">
                Cash Pay
              </th>
              <th colSpan={2} className="text-center">
                Attendance
              </th>
              <th rowSpan="2">Workplace</th>
              <th rowSpan="2">Workplace Group</th>
              <th rowSpan="2">Payroll Group</th>
            </tr>
            <tr>
              <th className="text-center" style={{ minWidth: "122px" }}>
                Employee ID
              </th>
              <th className="text-center">Employee Name</th>
              <th className="text-center">Designation</th>
              <th className="text-right">
                {numberWithCommas(
                  getRowTotal(rowDto, "GrossSalary").toFixed(2)
                )}
              </th>
              <th className="text-right">
                {" "}
                {numberWithCommas(
                  getRowTotal(rowDto, "TotalAllowance").toFixed(2)
                )}
              </th>
              <th className="text-right">
                {" "}
                {numberWithCommas(
                  getRowTotal(rowDto, "TotalDeduction").toFixed(2)
                )}
              </th>
              <th className="text-right">
                {" "}
                {numberWithCommas(getRowTotal(rowDto, "NetPay").toFixed(2))}
              </th>
              <th className="text-right">
                {numberWithCommas(getRowTotal(rowDto, "BankPay").toFixed(2))}
              </th>
              <th className="text-right">
                {" "}
                {numberWithCommas(
                  getRowTotal(rowDto, "DegitalBankPay").toFixed(2)
                )}
              </th>
              <th className="text-right">
                {" "}
                {numberWithCommas(getRowTotal(rowDto, "CashPay").toFixed(2))}
              </th>
              <th className="text-center">Total Working Days</th>
              <th className="text-center">Total Attendance</th>
            </tr>
          </thead>
          <tbody>
            {rowDto?.map((item, index) => (
              <tr
                key={index}
                colSpan={item?.SalaryGenerateHeaderId === null ? 16 : 1}
              >
                <td>{item?.SL}</td>
                {item?.SalaryGenerateHeaderId !== null && (
                  <>
                    <td>{item?.EmployeeCode}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="emp-avatar">
                          <AvatarComponent
                            classess=""
                            letterCount={1}
                            label={item?.EmployeeName}
                          />
                        </div>
                        <div className="ml-2">
                          <span className="tableBody-title">
                            {item?.EmployeeName}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>{item?.DesignationName}</td>
                    <td style={{ textAlign: "right" }}>
                      {numberWithCommas(item?.GrossSalary) || "-"}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {numberWithCommas(item?.TotalAllowance) || "-"}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {numberWithCommas(item?.TotalDeduction) || "-"}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {numberWithCommas(item?.NetPay) || "-"}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {numberWithCommas(item?.BankPay) || "-"}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {numberWithCommas(item?.DegitalBankPay) || "-"}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {numberWithCommas(item?.CashPay) || "-"}
                    </td>
                    <td>{item?.TotalWorkingDays}</td>
                    <td>{item?.PayableDays}</td>
                    <td>{item?.WorkplaceName}</td>
                    <td>{item?.WorkplaceGroupName}</td>
                    <td>{item?.PayrollGroupName}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </ScrollableTable>
      </>
    )
  );
}

// old table
/* 

<ScrollableTable
          classes="salary-process-table"
          secondClasses="table-card-styled tableOne scroll-table-height"
        >
          <thead>
            <tr>
              <th rowSpan="2" style={{ width: "30px" }}>SL</th>
              <th rowSpan="2">Employee Name</th>
              <th style={{ textAlign: "right" }} className="th-inner-table">
                <span className="mr-2">Salary</span>
                <table className="table table-bordered table-hover m-0 th-table">
                  <thead>
                    <tr>
                      <th
                        className="green"
                        style={{ textAlign: "right" }}
                      >
                        {numberWithCommas(total(rowDto, "numGrossSalary").toFixed(2))}
                      </th>
                    </tr>
                  </thead>
                </table>
              </th>
              <th style={{ textAlign: "right" }} className="th-inner-table">
                <span className="mr-2">Total Allowance</span>
                <table className="table table-bordered table-hover m-0 th-table">
                  <thead>
                    <tr>
                      <th
                        className="green"
                        style={{ textAlign: "right" }}
                      >
                        {numberWithCommas(total(rowDto, "numTotalAllowance").toFixed(2))}
                      </th>
                    </tr>
                  </thead>
                </table>
              </th>
              <th style={{ textAlign: "right" }} className="th-inner-table">
                <span className="mr-2">Total Deduction</span>
                <table className="table table-bordered table-hover m-0 th-table">
                  <thead>
                    <tr>
                      <th
                        className="green"
                        style={{ textAlign: "right" }}
                      >
                        {numberWithCommas(total(rowDto, "numTotalDeduction").toFixed(2))}
                      </th>
                    </tr>
                  </thead>
                </table>
              </th>
              <th style={{ textAlign: "right" }} className="th-inner-table">
                <span className="mr-2">Net Pay</span>
                <table className="table table-bordered table-hover m-0 th-table">
                  <thead>
                    <tr>
                      <th
                        className="green"
                        style={{ textAlign: "right" }}
                      >
                        {numberWithCommas(total(rowDto, "netPay").toFixed(2))}
                      </th>
                    </tr>
                  </thead>
                </table>
              </th>
              <th style={{ textAlign: "right" }} className="th-inner-table">
                <span className="mr-2">Bank Pay</span>
                <table className="table table-bordered table-hover m-0 th-table">
                  <thead>
                    <tr>
                      <th
                        className="green"
                        style={{ textAlign: "right" }}
                      >
                        {numberWithCommas(total(rowDto, "bankPay").toFixed(2))}
                      </th>
                    </tr>
                  </thead>
                </table>
              </th>
              <th style={{ textAlign: "right" }} className="th-inner-table">
                <span className="mr-2">Digital Bank Pay</span>
                <table className="table table-bordered table-hover m-0 th-table">
                  <thead>
                    <tr>
                      <th
                        className="green"
                        style={{ textAlign: "right" }}
                      >
                        {numberWithCommas(total(rowDto, "degitalBankPay").toFixed(2))}
                      </th>
                    </tr>
                  </thead>
                </table>
              </th>
              <th style={{ textAlign: "right" }} className="th-inner-table">
                <span className="mr-2">Cash Pay</span>
                <table className="table table-bordered table-hover m-0 th-table">
                  <thead>
                    <tr>
                      <th
                        className="green"
                        style={{ textAlign: "right" }}
                      >
                        {numberWithCommas(total(rowDto, "cashPay").toFixed(2))}
                      </th>
                    </tr>
                  </thead>
                </table>
              </th>
              <th rowSpan="2">Workplace</th>
              <th rowSpan="2">Workplace Group</th>
              <th rowSpan="2">Payroll Group</th>
            </tr>
          </thead>
          <tbody>
            {rowDto?.map((item, index) => (
              <tr key={index} >
                <td>
                  <div>{index + 1}</div>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <div className="emp-avatar">
                      <AvatarComponent
                        classess=""
                        letterCount={1}
                        label={item?.strEmployeeName}
                      />
                    </div>
                    <div className="ml-2">
                      <span className="tableBody-title">
                        {item?.strEmployeeName}[{item?.intEmployeeId}]
                      </span>
                    </div>
                  </div>
                </td>
                <td style={{ textAlign: "right" }}>
                  {numberWithCommas(item?.numGrossSalary) || "-"}
                </td>
                <td style={{ textAlign: "right" }}>
                  {numberWithCommas(item?.numTotalAllowance) || "-"}
                </td>
                <td style={{ textAlign: "right" }}>
                  {numberWithCommas(item?.numTotalDeduction) || "-"}
                </td>
                <td style={{ textAlign: "right" }}>
                  {numberWithCommas(item?.netPay) || "-"}
                </td>
                <td style={{ textAlign: "right" }}>
                  {numberWithCommas(item?.bankPay) || "-"}
                </td>
                <td style={{ textAlign: "right" }}>
                  {numberWithCommas(item?.degitalBankPay) || "-"}
                </td>
                <td style={{ textAlign: "right" }}>
                  {numberWithCommas(item?.cashPay) || "-"}
                </td>
                <td>{item?.strWorkplaceName}</td>
                <td>{item?.strWorkplaceGroupName}</td>
                <td>{item?.strPayrollGroupName}</td>
              </tr>
            ))}
          </tbody>
        </ScrollableTable>
*/
