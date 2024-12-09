import { Col, Row } from "antd";
import React from "react";

const valueStyle = { fontSize: "14px", fontWeight: "550" };
const labelStyle = { fontSize: "12px" };
const PlanningView = ({ data }: any) => {
  return (
    <Row gutter={[10, 2]} style={{ paddingLeft: "15px" }}>
      <Col md={8}>
        <div style={labelStyle}>Business Unit:</div>
        <div style={valueStyle}>{data?.bUnit || "N/A"}</div>
      </Col>
      <Col md={8}>
        <div style={labelStyle}>Workplace Group:</div>
        <div style={valueStyle}>{data?.workplaceGroup || "N/A"}</div>
      </Col>
      <Col md={8}>
        <div style={labelStyle}>Workplace:</div>
        <div style={valueStyle}>{data?.workplace || "N/A"}</div>
      </Col>
      <Col md={8} style={{ marginTop: "10px" }}>
        <div style={labelStyle}>Training Type:</div>
        <div style={valueStyle}>{data?.trainingType || "N/A"}</div>
      </Col>
      <Col md={8} style={{ marginTop: "10px" }}>
        <div style={labelStyle}>Training Title:</div>
        <div style={valueStyle}>{data?.trainingTitle || "N/A"}</div>
      </Col>
      <Col md={8} style={{ marginTop: "10px" }}>
        <div style={labelStyle}>Training Mode:</div>
        <div style={valueStyle}>{data?.trainingMode || "N/A"}</div>
      </Col>
      <Col md={8} style={{ marginTop: "10px" }}>
        <div style={labelStyle}>Training Organizer:</div>
        <div style={valueStyle}>{data?.trainingOrganizer || "N/A"}</div>
      </Col>
      <Col md={8} style={{ marginTop: "10px" }}>
        <div style={labelStyle}>Training Status:</div>
        <div style={valueStyle}>{data?.trainingStatus || "N/A"}</div>
      </Col>
      <Col md={8} style={{ marginTop: "10px" }}>
        <div style={labelStyle}>Objectives/ Key Learnings/ Outcomes:</div>
        <div style={valueStyle}>{data?.objectives || "N/A"}</div>
      </Col>
      <Col md={8} style={{ marginTop: "10px" }}>
        <div style={labelStyle}>Training Venue:</div>
        <div style={valueStyle}>{data?.trainingVanue || "N/A"}</div>
      </Col>
      <Col md={8} style={{ marginTop: "10px" }}>
        <div style={labelStyle}>Training Start Date:</div>
        <div style={valueStyle}>{data?.trainingStartDate || "N/A"}</div>
      </Col>
      <Col md={8} style={{ marginTop: "10px" }}>
        <div style={labelStyle}>Training Start Time:</div>
        <div style={valueStyle}>{data?.trainingStartTime || "N/A"}</div>
      </Col>
      <Col md={8} style={{ marginTop: "10px" }}>
        <div style={labelStyle}>Training End Date:</div>
        <div style={valueStyle}>{data?.trainingEndDate || "N/A"}</div>
      </Col>
      <Col md={8} style={{ marginTop: "10px" }}>
        <div style={labelStyle}>Training End Time:</div>
        <div style={valueStyle}>{data?.trainingEndTime || "N/A"}</div>
      </Col>
      <Col md={8} style={{ marginTop: "10px" }}>
        <div style={labelStyle}>Training Duration:</div>
        <div style={valueStyle}>{data?.trainingDuration || "N/A"}</div>
      </Col>
    </Row>
  );
};

export default PlanningView;
