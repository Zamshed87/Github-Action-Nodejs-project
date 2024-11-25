import React from "react";

const EmpInfo = ({ empBasic }: any) => {
  console.log(empBasic);
  return (
    <div
      style={{
        fontSize: "12px",
      }}
    >
      <>
        <div>
          <span style={{ fontWeight: 500, fontSize: "14px" }}>
            {empBasic?.EmployeeName}[{empBasic?.EmployeeCode}]
          </span>
        </div>
        <div>
          Designation :{" "}
          <span style={{ fontWeight: "500" }}>{empBasic?.DesignationName}</span>
        </div>
        <div>
          Department :{" "}
          <span style={{ fontWeight: "500" }}>{empBasic?.DepartmentName}</span>
        </div>
        <div>
          Service Length :{" "}
          <span style={{ fontWeight: "500" }}>{empBasic?.ServiceLength}</span>
        </div>
      </>
    </div>
  );
};

export default EmpInfo;
