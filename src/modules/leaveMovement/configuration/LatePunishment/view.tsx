import { Col, Row } from "antd";
import React from "react";
import { Department, Designation, EmploymentType } from "./type";

const valueStyle = { fontSize: "14px", fontWeight: "550" };
const labelStyle = { fontSize: "12px" };
const View = ({ data }: any) => {
  return (
    <Row gutter={[10, 2]}>
      <Col md={8} sm={24}>
        <div style={labelStyle}>Policy Name:</div>
        <div style={valueStyle}>{data?.name || "N/A"}</div>
      </Col>
      <Col md={8} sm={24}>
        <div style={labelStyle}>Description:</div>
        <div style={valueStyle}>{data?.description || "N/A"}</div>
      </Col>
      <Col md={8} sm={24}>
        <div style={labelStyle}>Departments:</div>
        <div style={valueStyle}>
          {data?.departments?.map(
            (dept: Department) => dept?.departmentName + ", "
          ) || "N/A"}
        </div>
      </Col>
      <Col md={8} sm={24}>
        <div style={labelStyle}>Designation:</div>
        <div style={valueStyle}>
          {data?.designations?.map(
            (dept: Designation) => dept?.designationName + ", "
          ) || "N/A"}
        </div>
      </Col>
      <Col md={8} sm={24}>
        <div style={labelStyle}>Employment Types:</div>
        <div style={valueStyle}>
          {data?.employmentTypes?.map(
            (dept: EmploymentType) => dept?.employmentTypeName + ", "
          ) || "N/A"}
        </div>
      </Col>
    </Row>
  );
};

export default View;
