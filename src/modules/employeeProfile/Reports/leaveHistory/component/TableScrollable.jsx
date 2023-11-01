import React from "react";
import AvatarComponent from "../../../../../common/AvatarComponent";
import ScrollableTable from "../../../../../common/ScrollableTable";
import { getPDFAction } from "../../../../../utility/downloadFile";
let date = new Date();
let year = date.getFullYear();

const TableScrollable = ({ rowDto, setLoading }) => {
  const hasLeave = (data) => {
    if (
      data?.clTaken > 0 ||
      data?.slTaken > 0 ||
      data?.lwpTaken > 0 ||
      data?.elTaken > 0 ||
      data?.mlTaken > 0
    )
      return true;
    else return false;
  };
  return (
    <ScrollableTable
      classes="salary-process-table"
      secondClasses="table-card-styled tableOne scroll-table-height"
    >
      <thead>
        <tr>
          <th style={{ width: "30px" }}>
            <div>SL</div>
          </th>
          <th>
            <div>Code</div>
          </th>
          <th
           className="fixed-column"
           style={{ left: "125px"}}
          >
            <div>Employee</div>
          </th>
          <th>
            <div>Designation</div>
          </th>
          <th>
            <div>Department</div>
          </th>
          <th>
            <div className="text-center">CL</div>
          </th>
          <th>
            <div className="text-center">SL</div>
          </th>
          <th>
            <div className="text-center">EL</div>
          </th>
          <th>
            <div className="text-center">LWP</div>
          </th>
          <th>
            <div className="text-center">ML</div>
          </th>
        </tr>
      </thead>
      <tbody className="hasEvent">
        {rowDto?.map((data, index) => (
          <tr
            key={index}
            onClick={(e) => {
              hasLeave(data) &&
                getPDFAction(
                  `/PdfAndExcelReport/LeaveHistoryReport?EmployeeId=${data?.employeeId}&fromDate=${year}-01-01&toDate=${year}-12-31`,
                  setLoading
                );
            }}
            className={` ${hasLeave(data) && "pointer"}`}
          >
            <td
              style={{
                textAlign: "center",
                minWidth: "40px",
                color: "rgba(0,0,0,0.6)",
              }}
            >
              {index + 1}
            </td>
            <td>
              <div className="tableBody-title">{data?.employeeCode}</div>
            </td>
            <td
             className="fixed-column"
             style={{ left: "125px"}}
            >
              <div className="employeeInfo d-flex align-items-center">
                <AvatarComponent letterCount={1} label={data?.employee || ""} />
                <div className="tableBody-title ml-2">{data?.employee}</div>
              </div>
            </td>
            <td>
              <div className="tableBody-title">{data?.designation}</div>
            </td>
            <td>
              <div className="tableBody-title">{data?.department}</div>
            </td>
            <td className="text-center">
              <div className="tableBody-title">
                {data?.clTaken || 0}/{data?.clBalance || 0}
              </div>
            </td>
            <td>
              <div className="text-center tableBody-title">
                {data?.slTaken || 0}/{data?.slBalance || 0}
              </div>
            </td>
            <td>
              <div className="text-center tableBody-title">
                {data?.elTaken || 0}/{data?.elBalance || 0}
              </div>
            </td>
            <td>
              <div className="text-center tableBody-title">
                {data?.lwpTaken || 0}/{data?.lwpBalance || 0}
              </div>
            </td>
            <td>
              <div className="text-center tableBody-title">
                {data?.mlTaken || 0}/{data?.mlBalance || 0}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </ScrollableTable>
  );
};

export default TableScrollable;
