import { Col, Divider, Form, Row } from "antd";
import { PInput } from "Components";
import React from "react";

export const CalculativeDays = ({ form }: any) => {
  return (
    <>
      <Row gutter={[10, 2]}>
        <Divider
          style={{
            marginBlock: "4px",
            marginTop: "20px",
            fontSize: "14px",
            fontWeight: 600,
          }}
          orientation="left"
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <span>Calculative Days</span>
          </div>
        </Divider>
        <Col md={4} sm={24} style={{ marginTop: "1.2rem" }}>
          <PInput
            label="Include Offday"
            type="checkbox"
            layout="horizontal"
            name="isOffday"
          />
        </Col>
        <Col md={4} sm={24} style={{ marginTop: "1.2rem" }}>
          <PInput
            label="Include Holiday"
            type="checkbox"
            layout="horizontal"
            name="isHoliday"
          />
        </Col>
      </Row>
      <Row gutter={[10, 2]}>
        <Col md={4} sm={24} style={{ marginTop: "1.2rem" }}>
          <PInput
            label="Include Absent"
            type="checkbox"
            layout="horizontal"
            name="isAbsent"
          />
        </Col>
        <Col md={5} sm={24} style={{ marginTop: "1.2rem" }}>
          <PInput
            label="Include Present & Movement"
            type="checkbox"
            layout="horizontal"
            name="isPresentMovement"
          />
        </Col>
      </Row>
    </>
  );
};
