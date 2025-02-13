import { Col, Divider, Form, Row } from "antd";
import { PInput } from "Components";
import React from "react";

export const LeaveCalculation = ({ form }: any) => {
  return (
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
          <span>Leave Calculation</span>
        </div>
      </Divider>
      <Col md={6} sm={24}>
        <PInput
          type="number"
          name="maxLeaveApplyMonthly"
          label="Max. Leave Apply Days (Monthly)"
          placeholder=""
          rules={[
            {
              required: true,
              message: "Max. Leave Apply Days (Monthly) is required",
            },
          ]}
        />
      </Col>
      <Col md={6} sm={24}>
        <PInput
          type="number"
          name="maxLeaveApplyYearly"
          label="Max. Leave Apply Days (Yearly)"
          placeholder=""
          rules={[
            {
              required: true,
              message: "Max. Leave Apply Days (Yearly) is required",
            },
          ]}
        />
      </Col>
      <Col md={6} sm={24}>
        <PInput
          type="number"
          name="minLeaveApplyDays"
          label="Min. Leave Apply Days (At a Time)"
          placeholder=""
          rules={[
            {
              required: true,
              message: "Min. Leave Apply Days (At a Time) is required",
            },
          ]}
        />
      </Col>
    </Row>
  );
};
