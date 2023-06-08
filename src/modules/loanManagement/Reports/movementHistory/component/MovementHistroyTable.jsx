import React from "react";
import AvatarComponent from "../../../../../common/AvatarComponent";

const MovementHistroyTable = ({ item }) => {
  return (
    <>
      <td>
        <div className="employeeInfo d-flex align-items-center">
          <AvatarComponent letterCount={1} label={item?.EmployeeName || ""} />
          <div className="employeeTitle ml-3">
            <p className="employeeName">{item?.EmployeeName}</p>
          </div>
        </div>
      </td>
      <td>
        <div className="content tableBody-title">{item?.DesignationName}</div>
      </td>
      <td>
        <div className="content tableBody-title">{item?.DepartmentName}</div>
      </td>
      <td>
        <div className="content tableBody-title text-center"> {item?.Duration}</div>
      </td>
    </>
  );
};

export default MovementHistroyTable;
