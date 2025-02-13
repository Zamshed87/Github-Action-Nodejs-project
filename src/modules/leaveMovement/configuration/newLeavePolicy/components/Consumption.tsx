import { Col, Divider, Form, Row } from "antd";
import { PInput, PSelect } from "Components";
import React from "react";

export const Consumption = ({ form }: any) => {
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
          <span>Leave Consume Type</span>
        </div>
      </Divider>
      <Col md={6} sm={24}>
        <PSelect
          mode="multiple"
          allowClear
          options={[
            { value: 1, label: "Full Day" },
            { value: 2, label: "Half Day" },
            { value: 3, label: "Clock Time" },
          ]}
          name="leaveConsumeType"
          label="Leave Consume Type"
          placeholder="Leave Consume Type"
          onChange={(value, op) => {
            form.setFieldsValue({
              leaveConsumeType: op,
            });
          }}
          rules={[
            {
              required: true,
              message: "Leave Consume Type is required",
            },
          ]}
        />
      </Col>
      <Col md={6} sm={24}>
        <PInput
          type="number"
          name="minConsumeTime"
          label="Minimum Consume Time"
          placeholder=""
          rules={[
            {
              required: true,
              message: "Minimum Consume Time is required",
            },
          ]}
        />
      </Col>
      <Col md={6} sm={24}>
        <PInput
          type="number"
          name="maxConsumeTime"
          label="Maximum Consume Time"
          placeholder=""
          rules={[
            {
              required: true,
              message: "Maximum Consume Time is required",
            },
          ]}
        />
      </Col>
      <Form.Item shouldUpdate noStyle>
        {() => {
          const { leaveConsumeType } = form.getFieldsValue(true);

          return (
            leaveConsumeType?.filter((i: any) => i?.value === 3).length > 0 && (
              <>
                <Col md={6} sm={24}>
                  <PInput
                    type="number"
                    name="standardWorkHour"
                    label="Standard Working Hour"
                    placeholder=""
                    rules={[
                      {
                        required:
                          leaveConsumeType?.filter((i: any) => i?.value === 3)
                            .length > 0,
                        message: "Standard Working Hour is required",
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
