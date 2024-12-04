import { Col, Row } from "antd";
import React from "react";

const valueStyle = { fontSize: "14px", fontWeight: "550" };
const labelStyle = { fontSize: "12px" };
const RequisitionView = () => {
  interface Data {
    employee?: string;
    workplaceGroup?: string;
    comments?: string;
    trainingType?: string;
    upcommingTraining?: string;
    trainingMode?: string;
    trainingOrganizer?: string;
    trainingStatus?: string;
    objectives?: string;
    trainingVanue?: string;
    reasonForRequisition?: string;
    objectivesToAchieve?: string;
    trainingEndDate?: string;
    remarks?: string;
    requisitionStatus?: string;
  }

  const data: Data = {};
  return (
    <Row gutter={[10, 2]}>
      <Col md={8} sm={24}>
        <div style={labelStyle}>Employee:</div>
        <div style={valueStyle}>{data?.employee || "N/A"}</div>
      </Col>
      <Col md={8} sm={24}>
        <div style={labelStyle}>Training Type:</div>
        <div style={valueStyle}>{data?.trainingType || "N/A"}</div>
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
        <div style={valueStyle}>{data?.requisitionStatus || "N/A"}</div>
      </Col>

      <Col md={8} sm={24}>
        <div style={labelStyle}>Upcoming Training:</div>
        <div style={valueStyle}>{data?.upcommingTraining || "N/A"}</div>
      </Col>

      <Col md={8} sm={24}>
        <div style={labelStyle}>Comments:</div>
        <div style={valueStyle}>{data?.comments || "N/A"}</div>
      </Col>
    </Row>
  );
};

export default RequisitionView;
