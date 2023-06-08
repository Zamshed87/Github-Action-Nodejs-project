import React from "react";
import { gray700 } from "../../../../../../utility/customColor";

const EmployeeDetailsCard = ({ employee }) => {
  const {
    employeeName,
    designation,
    department,
    email,
    phone,
    attendance,
    totalMark,
    answered,
    questions,
  } = employee;

  return (
    <div
      className="d-flex"
      style={{
        // marginLeft: "50px",
        backgroundColor: "#F9FAFB",
        padding: "10px 20px",
        margin: "10px 25px",
        marginBottom: "30px",
      }}
    >
      <div
        className=""
        style={{ display: "flex", flexDirection: "column", gap: "1px" }}
      >
        <div className="single-info">
          <p
            className="text-single-info"
            style={{ fontWeight: "500", color: gray700 }}
          >
            <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
              Employee Name -
            </small>
            <span className="ml-2">{employeeName}</span>
            {/* {dateFormatter(singleData?.SeparationDate)} */}
          </p>
        </div>
        <div className="single-info">
          <p
            className="text-single-info"
            style={{ fontWeight: "500", color: gray700 }}
          >
            <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
              Designation -
            </small>
            <span className="ml-2">{designation}</span>
            {/* {dateFormatter(singleData?.SeparationDate)} */}
          </p>
        </div>
        <div className="single-info">
          <p
            className="text-single-info"
            style={{ fontWeight: "500", color: gray700 }}
          >
            <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
              Department -
            </small>
            <span className="ml-2">{department}</span>
            {/* {dateFormatter(singleData?.SeparationDate)} */}
          </p>
        </div>
        <div className="single-info">
          <p
            className="text-single-info"
            style={{ fontWeight: "500", color: gray700 }}
          >
            <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
              Email -
            </small>
            <span className="ml-2">{email}</span>
            {/* {dateFormatter(singleData?.SeparationDate)} */}
          </p>
        </div>
        <div className="single-info">
          <p
            className="text-single-info"
            style={{ fontWeight: "500", color: gray700 }}
          >
            <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
              Phone -
            </small>
            <span className="ml-2">{phone}</span>
            {/* {dateFormatter(singleData?.SeparationDate)} */}
          </p>
        </div>
      </div>
      <div
        className=""
        style={{
          marginLeft: "50px",
          display: "flex",
          flexDirection: "column",
          gap: "1px",
        }}
      >
        <div className="single-info">
          <p
            className="text-single-info"
            style={{ fontWeight: "500", color: gray700 }}
          >
            <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
              Attendance -
            </small>
            <span className="ml-2">{attendance}</span>
            {/* {dateFormatter(singleData?.SeparationDate)} */}
          </p>
        </div>
        <div className="single-info">
          <p
            className="text-single-info"
            style={{ fontWeight: "500", color: gray700 }}
          >
            <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
              Total Mark -
            </small>
            <span className="ml-2">{totalMark}</span>
            {/* {dateFormatter(singleData?.SeparationDate)} */}
          </p>
        </div>
        <div className="single-info">
          <p
            className="text-single-info"
            style={{ fontWeight: "500", color: gray700 }}
          >
            <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
              Total Question Answered
            </small>
            <span className="ml-2">
              {answered}/{questions}
            </span>
            {/* {dateFormatter(singleData?.SeparationDate)} */}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailsCard;
