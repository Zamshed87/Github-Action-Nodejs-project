import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import AvatarComponent from '../../../../../common/AvatarComponent';
import ScrollableTable from "../../../../../common/ScrollableTable";

const TableScrollable = ({ propsObj }) => {
  const {rowDto} = propsObj;
  const { supervisor } = useSelector(
    (state) => state?.auth?.keywords,
    shallowEqual
  );
  return (
  <>
    <ScrollableTable>
      <thead>
        <tr>
          <th>
            <div className="d-flex align-items-center  ">Employee Name</div>
          </th>
          <th>
            <div className="d-flex align-items-center justify-content-center">Employee Id</div>
          </th>
          <th>
            <div className="d-flex align-items-center  ">Designation</div>
          </th>
          <th>
            <div className="d-flex align-items-center">
            Department
            </div>
          </th>
          <th>
            <div className="d-flex align-items-center">
              Job Type
            </div>
          </th>
          <th style={{minWidth: "100px"}}>
            <div className="d-flex align-items-center">
              DOJ
            </div>
          </th>
          <th>
            <div className="d-flex align-items-center  justify-content-center">
            Confirmation Date
            </div>
          </th>
          <th>
            <div className="d-flex align-items-center justify-content-center">
            DOB
            </div>
          </th>
          <th>
            <div className="d-flex align-items-center">
            Employee Email
            </div>
          </th>
          <th style={{minWidth: "100px"}}>
            <div className="d-flex align-items-center">
            Religion
            </div>
          </th>
          <th style={{minWidth: "100px"}}>
            <div className="d-flex align-items-center">
            Gender
            </div>
          </th>
          <th scope="col">
            <div className="d-flex align-items-center">
            Personal No
            </div>
          </th>
          <th>
            <div className="d-flex align-items-center">
            Office Contact
            </div>
          </th>
          <th>
            <div className="d-flex align-items-center">
            Permanent Address
            </div>
          </th>
          <th style={{minWidth: "100px"}}>
            <div className="d-flex align-items-center">
            Blood Group
            </div>
          </th>
          <th>
            <div className="d-flex align-items-center">
            {supervisor || "Supervisor"}
            </div>
          </th>
          <th>
            <div className="d-flex align-items-center">
            Bank Name
            </div>
          </th>
          <th>
            <div className="d-flex align-items-center">
            Branch
            </div>
          </th>
          <th>
            <div className="d-flex align-items-center">
            Account No
            </div>
          </th>
          <th style={{minWidth: "100px"}}>
            <div className="d-flex align-items-center">
            Routing
            </div>
          </th>
          <th style={{minWidth: "100px"}}>
            <div className="d-flex align-items-center justify-content-end">
            Gross Salary
            </div>
          </th>
          <th style={{minWidth: "100px"}}>
            <div className="d-flex align-items-center justify-content-end">
            Basic salary
            </div>
          </th>
          <th style={{minWidth: "100px"}}>
            <div className="d-flex align-items-center  justify-content-end">
            Net Payable
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {rowDto?.map((data, i) => (
          <tr
            key={i}
            onClick={(e) => {
             
            }}
          >
            <td>
              <div className="employeeInfo d-flex align-items-center">
                <AvatarComponent letterCount={1} label={data?.employeeName || ""} />
                <div className="employeeTitle ml-2">
                  <p className="employeeName">{data?.employeeName} [{data?.empCode}]</p>
                </div>
              </div>
            </td>
            <td>
              <div className="d-flex align-items-center justify-content-center">
                {data?.empId}
              </div>
            </td>
            <td>
                {data?.designation}
            </td>
            <td>
              {data?.department}
            </td>
            <td>
              <div>
                {data?.jobType}
              </div>
            </td>
            <td>
              <div>
                {data?.doj}
              </div>
            </td>
            <td>
              <div className="text-center d-flex flex-column">
                {data?.confirmDate}
              </div>
            </td>
            <td>
              <div className="text-center d-flex flex-column">
                {data?.dob}
              </div>
            </td>
            <td>
              {data?.empEmail}
            </td>
            <td>
              {data?.religion}
            </td>
            <td>
              {data?.gender}
            </td>
            <td>
              {data?.personalNo}
            </td>
            <td>
              {data?.officeContact}
            </td>
            <td>
              {data?.personalAddress}
            </td>
            <td>
              {data?.bloodGroup}
            </td>
            <td>
              {data?.supervisorName}
            </td>
            <td>
              {data?.bankName}
            </td>
            <td>
              {data?.branch}
            </td>
            <td>
              {data?.accountNo}
            </td>
            <td>
              {data?.Routing}
            </td>
            <td className="text-right">
              {data?.grossSalary}
            </td>
            <td className="text-right">
              {data?.basicSalary}
            </td>
            <td className="text-right">
              {data?.netPayble}
            </td>
          </tr>
        ))}
      </tbody>
    </ScrollableTable>
  </>
  );
};

export default TableScrollable;
