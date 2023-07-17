import React from 'react';
import AvatarComponent from '../../../../../common/AvatarComponent';
import ScrollableTable from '../../../../../common/ScrollableTable';
import { numberWithCommas } from '../../../../../utility/numberWithCommas';
import { total } from '../helper';

export default function CashSalaryReport({ rowDto, index, tabIndex }) {
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
              <th rowSpan="2">Employee Name</th>
              <th style={{ textAlign: "right" }} className="th-inner-table">
                <span className="mr-2">Net Payable</span>
                <table className="table table-bordered table-hover m-0 th-table">
                  <thead>
                    <tr>
                      <th
                        className="green"
                        style={{ textAlign: "right" }}
                      >
                        {numberWithCommas(total(rowDto, "cashPay"))}
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
                        label={item?.EmployeeName}
                      />
                    </div>
                    <div className="ml-2">
                      <span className="tableBody-title">
                        {item?.EmployeeName}[{item?.EmployeeId}]
                      </span>
                    </div>
                  </div>
                </td>
                <td style={{ textAlign: "right" }}>
                  {numberWithCommas(item?.CashPay) || "-"}
                </td>
                <td>{item?.WorkplaceName}</td>
                <td>{item?.WorkplaceGroupName}</td>
                <td>{item?.PayrollGroupName}</td>
              </tr>
            ))}
          </tbody>
        </ScrollableTable>
      </>
    )
  );
}
