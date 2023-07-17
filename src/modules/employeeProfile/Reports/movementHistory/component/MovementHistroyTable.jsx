import React from "react";
import AvatarComponent from "../../../../../common/AvatarComponent";

const MovementHistroyTable = ({ item, index }) => {
  return (
    <>
      <td style={{ minWidth: "30px" }}>
        <div>{index + 1}</div>
      </td>
      <td>
        <div className="tableBody-title">{item?.employeeCode}</div>
      </td>
      <td>
        <div className="employeeInfo d-flex align-items-center tableBody-title">
          <AvatarComponent letterCount={1} label={item?.EmployeeName || ""} />
          <div className="employeeTitle ml-3">
            <div className="tableBody-title">{item?.EmployeeName}</div>
          </div>
        </div>
      </td>
      <td>
        <div className="tableBody-title">{item?.DesignationName}</div>
      </td>
      <td>
        <div className="tableBody-title"> {item?.DepartmentName}</div>
      </td>
      <td>
        <div className="tableBody-title">{item?.Duration}</div>
      </td>
    </>
  );
};

export default MovementHistroyTable;
