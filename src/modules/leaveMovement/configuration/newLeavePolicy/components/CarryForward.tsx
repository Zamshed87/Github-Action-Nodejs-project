import { Col, Divider, Form, Row } from "antd";
import { PInput, PSelect } from "Components";
import React from "react";

export const CarryForward = ({ form }: any) => {
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
          <span>Leave Carry Forward</span>
        </div>
      </Divider>
      <Col md={3} sm={24} style={{ marginTop: "1.2rem" }}>
        <PInput
          label="Is Carry Forward"
          type="checkbox"
          layout="horizontal"
          name="isCarryForward"
        />
      </Col>

      <Form.Item shouldUpdate noStyle>
        {() => {
          const { isCarryForward, leaveCarryForwardType } =
            form.getFieldsValue(true);

          return (
            isCarryForward && (
              <>
                <Col md={4} sm={24}>
                  <PSelect
                    // mode="multiple"
                    allowClear
                    options={[
                      { value: 1, label: "Percentage of Days" },
                      { value: 2, label: "Fixed Days" },
                    ]}
                    name="leaveCarryForwardType"
                    label="Leave Carry Forward Type"
                    placeholder="Leave Carry Forward Type"
                    onChange={(value, op) => {
                      form.setFieldsValue({
                        leaveCarryForwardType: op,
                      });
                    }}
                    rules={[
                      {
                        required: isCarryForward,
                        message: "Leave Carry Forward Type is required",
                      },
                    ]}
                  />
                </Col>
                <Col md={5} sm={24}>
                  <PInput
                    type="number"
                    name="minConsumeTime"
                    label={`Max Carry Forward After Lapse (${
                      leaveCarryForwardType?.value === 1 ? "%" : "Days"
                    })`}
                    placeholder=""
                    rules={[
                      {
                        required: isCarryForward,
                        message:
                          "Max Carry Forward After Lapse (%, Days) is required",
                      },
                    ]}
                  />
                </Col>
                <Col md={6} sm={24}>
                  <PInput
                    type="number"
                    name="expiryCarryForwardDaysAfterLapse"
                    label="Expiry of Carry Forward Days After Lapse"
                    placeholder=""
                    rules={[
                      {
                        required: isCarryForward,
                        message:
                          "Expiry of Carry Forward Days After Lapse is required",
                      },
                    ]}
                  />
                </Col>
              </>
            )
          );
        }}
      </Form.Item>

      <Form.Item shouldUpdate noStyle>
        {() => {
          const { leavelapse } = form.getFieldsValue(true);

          return (
            leavelapse?.value === 5 && (
              <>
                <Col md={5} sm={24}>
                  <PInput
                    type="number"
                    name="maxCarryForwardBalance"
                    label="Max Carry Forward Balance (Days)"
                    placeholder=""
                    rules={[
                      {
                        required: leavelapse?.value === 5,
                        message: "Max Carry Forward Balance (Days) is required",
                      },
                    ]}
                  />
                </Col>
              </>
            )
          );
        }}
      </Form.Item>
    </Row>
  );
};
