import { Col, Row } from "antd";
import React from "react";

const valueStyle = { fontSize: "14px", fontWeight: "550" };
const labelStyle = { fontSize: "12px" };
const RequisitionView = ({ data }: any) => {
  console.log(data);
  return (
    <Row gutter={[10, 2]}>
      <Col md={8} sm={24}>
        <div style={labelStyle}>Employee:</div>
        <div style={valueStyle}>{data?.employmentName || "N/A"}</div>
      </Col>
      <Col md={8} sm={24}>
        <div style={labelStyle}>Training Type:</div>
        <div style={valueStyle}>{data?.trainingTypeName || "N/A"}</div>
      </Col>
      <Col md={8} sm={24}>
        <div style={labelStyle}>Reason For Requisition:</div>
        <div style={valueStyle}>{data?.reasonForRequisition || "N/A"}</div>
      </Col>
      <Col md={8} sm={24}>
        <div style={labelStyle}>Objectives to Achieve:</div>
        <div style={valueStyle}>{data?.objectivesToAchieve || "N/A"}</div>
      </Col>
      <Col md={8} sm={24}>
        <div style={labelStyle}>Remarks:</div>
        <div style={valueStyle}>{data?.remarks || "N/A"}</div>
      </Col>

      <Col md={8} sm={24}>
        <div style={labelStyle}>Requisition Status:</div>
        <div style={valueStyle}>{data?.status?.label || "N/A"}</div>
      </Col>

      <Col md={8} sm={24}>
        <div style={labelStyle}>Upcoming Training:</div>
        <div style={valueStyle}>{data?.upcommingTraining?.label || "N/A"}</div>
      </Col>

      <Col md={8} sm={24}>
        <div style={labelStyle}>Comments:</div>
        <div style={valueStyle}>{data?.comments || "N/A"}</div>
      </Col>
    </Row>
  );
};

export default RequisitionView;
