import React from "react";
import AvatarComponent from "../../../../../common/AvatarComponent";
import ScrollableTable from "../../../../../common/ScrollableTable";
import { getPDFAction } from "../../../../../utility/downloadFile";
let date = new Date()
let year = date.getFullYear()

const TableScrollable = ({ rowDto, setLoading,employeeId }) => {
  return (
    <ScrollableTable>
      <thead>
        <tr>
          <th scope="col">
            <div className="d-flex align-items-center  ">Employee</div>
          </th>
          <th scope="col">
            <div className="d-flex align-items-center  ">Designation</div>
          </th>
          <th scope="col">
            <div className="d-flex align-items-center  ">Department</div>
          </th>
          <th>
            <div className="d-flex align-items-center justify-content-center ">
              CL
            </div>
          </th>
          <th>
            <div className="d-flex align-items-center justify-content-center ">
              SL
            </div>
          </th>
          <th>
            <div className="d-flex align-items-center justify-content-center ">
              EL
            </div>
          </th>
          <th scope="col">
            <div className="d-flex align-items-center  justify-content-center">
              LWP
            </div>
          </th>
          <th scope="col">
            <div className="d-flex align-items-center  justify-content-center">
              ML
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {rowDto?.map((data, i) => (
          data?.employeeId === employeeId &&
          <tr
            key={i}
            onClick={(e) => {
              getPDFAction(
                `/emp/PdfAndExcelReport/LeaveHistoryReport?EmployeeId=${data?.employeeId}&fromDate=${year}-01-01&toDate=${year}-12-31`,
                setLoading
              );
            }}
          >
            <td>
              <div className="employeeInfo d-flex align-items-center">
                <AvatarComponent letterCount={1} label={data?.employee || ""} />
                <div className="employeeTitle ml-2">
                  <p className="employeeName">{data?.employee}</p>
                </div>
              </div>
            </td>
            <td>
              <div className="d-flex align-items-center">
                {data?.designation}
              </div>
            </td>
            <td>
              <div className="d-flex align-items-center">
                {data?.department}
              </div>
            </td>
            <td className="text-center">
              {data?.clTaken || 0}/{data?.clBalance || 0}
            </td>
            <td>
              <div className=" text-center d-flex flex-column">
                {data?.slTaken || 0}/{data?.slBalance || 0}
              </div>
            </td>
            <td>
              <div className="text-center d-flex flex-column">
                {data?.elTaken || 0}/{data?.elBalance || 0}
              </div>
            </td>
            <td>
              <div className="text-center d-flex flex-column">
                {data?.lwpTaken || 0}/{data?.lwpBalance || 0}
              </div>
            </td>
            <td>
              <div className="text-center d-flex flex-column">
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
