import React from 'react';
import ScrollableTable from '../../../../../common/ScrollableTable';
import { numberWithCommas } from '../../../../../utility/numberWithCommas';
import { total } from '../helper';

export default function BankSalaryReport({ rowDto, index, tabIndex }) {
  return (
    index === tabIndex && (
      <>
        <ScrollableTable
          classes="salary-process-table"
          secondClasses="table-card-styled tableOne scroll-table-height"
        >
          <thead>
            <tr>
              <th rowSpan="2" style={{ width: "30px" }}>SL</th>
              <th rowSpan="2">Account Name</th>
              <th rowSpan="2">Employee Id</th>
              <th rowSpan="2">Bank Name</th>
              <th rowSpan="2">Branch</th>
              <th rowSpan="2">Accounting No</th>
              <th rowSpan="2">Routing No</th>
              <th style={{ textAlign: "right" }} className="th-inner-table">
                <span className="mr-2">Net Pay</span>
                <table className="table table-bordered table-hover m-0 th-table">
                  <thead>
                    <tr>
                      <th
                        className="green"
                        style={{ textAlign: "right" }}
                      >
                        {numberWithCommas(total(rowDto, "NetPay").toFixed(2))}
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
                        {numberWithCommas(total(rowDto, "BankPay").toFixed(2))}
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
                        {numberWithCommas(total(rowDto, "CashPay").toFixed(2))}
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
              <tr key={index} colSpan={item?.SalaryGenerateHeaderId === null ? 16 : 1}>
                <td style={{minWidth: "200px"}}>
                  <div>{item?.SL}</div>
                </td>
                {
                 item?.SalaryGenerateHeaderId !== null && (
                    <>
                    <td>
                  <div className="d-flex align-items-center">
                    <div className="">
                      <span className="tableBody-title">
                        {item?.AccountName}
                      </span>
                    </div>
                  </div>
                </td>
                <td>{item?.EmployeeId}</td>
                <td>{item?.FinancialInstitution}</td>
                <td>{item?.BankBranchName}</td>
                <td>{item?.AccountNo}</td>
                <td>{item?.RoutingNumber}</td>
                <td style={{ textAlign: "right" }}>
                  {numberWithCommas(item?.NetPay) || "-"}
                </td>
                <td style={{ textAlign: "right" }}>
                  {numberWithCommas(item?.BankPay) || "-"}
                </td>
                <td style={{ textAlign: "right" }}>
                  {numberWithCommas(item?.CashPay) || "-"}
                </td>
                <td>{item?.WorkplaceName}</td>
                <td>{item?.WorkplaceGroupName}</td>
                <td>{item?.PayrollGroupName}</td>
                    </>
                  )
                }
              </tr>
            ))}
          </tbody>
        </ScrollableTable>
      </>
    )
  );
}
