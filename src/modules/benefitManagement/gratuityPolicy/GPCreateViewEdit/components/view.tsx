import { Col, Row } from "antd";
import React from "react";

const valueStyle = { fontSize: "14px", fontWeight: "550" };
const labelStyle = { fontSize: "12px" };
const View = ({ data }: any) => {
  return (
    <Row gutter={[10, 2]}>
      <Col md={6} sm={24}>
        <div style={labelStyle}>Policy Name:</div>
        <div style={valueStyle}>{data?.strPolicyName || "N/A"}</div>
      </Col>
      <Col md={6} sm={24}>
        <div style={labelStyle}>Workplace Group:</div>
        <div style={valueStyle}>{data?.strWorkplaceGroupName || "N/A"}</div>
      </Col>
      <Col md={6} sm={24}>
        <div style={labelStyle}>Workplace:</div>
        <div style={valueStyle}>{data?.workplaceName || "N/A"}</div>
      </Col>
      <Col md={6} sm={24}>
        <div style={labelStyle}>Employee Type:</div>
        <div style={valueStyle}>
          {data?.employmentTypeName
            ?.map((item: any) => item.strEmploymentTypeName)
            .join(",") || "N/A"}
        </div>
      </Col>
      <Col md={6} sm={24}>
        <div style={labelStyle}>Eligibility Depened On:</div>
        <div style={valueStyle}>{data?.eligibilityDependOnName || "N/A"}</div>
      </Col>
    </Row>
  );
};

export default View;
