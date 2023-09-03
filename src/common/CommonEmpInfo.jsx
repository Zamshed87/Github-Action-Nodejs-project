import React from "react";

const CommonEmpInfo = ({
  employeeName,
  designationName,
  departmentName,
  classes = "ml-3",
}) => {
  return (
    <div
      className={classes}
      style={{
        fontSize: "12px",
      }}
    >
      <>
        <div>
          <span style={{ fontWeight: "bold" }}>{employeeName}</span>
        </div>
        <div>
          Designation :{" "}
          <span style={{ fontWeight: "500" }}>{designationName}</span>
        </div>
        <div>
          Department :{" "}
          <span style={{ fontWeight: "500" }}>{departmentName}</span>
        </div>
      </>
    </div>
  );
};

export default CommonEmpInfo;
