import { Col, Divider, Form, Row } from "antd";
import { PInput, PSelect } from "Components";
import React from "react";

export const Lapse = ({ form }: any) => {
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
          <span>Leave Lapse</span>
        </div>
      </Divider>
      <Col md={6} sm={24}>
        <PSelect
          // mode="multiple"
          allowClear
          options={[
            { value: 1, label: "Calendar Year" },
            { value: 2, label: "Fiscal Year" },
            { value: 3, label: "Date of Joining" },
            { value: 4, label: "Date of Confirmation" },
            { value: 5, label: "Leaves Completed" },
          ]}
          name="leavelapse"
          label="Leave Lapse After"
          placeholder=""
          onChange={(value, op) => {
            form.setFieldsValue({
              leavelapse: op,
            });
          }}
          rules={[
            {
              required: true,
              message: "Leave Lapse is required",
            },
          ]}
        />
      </Col>

      <Form.Item shouldUpdate noStyle>
        {() => {
          const { leavelapse } = form.getFieldsValue(true);

          return (
            leavelapse?.value === 5 && (
              <>
                <Col md={6} sm={24}>
                  <PInput
                    type="number"
                    name="afterLeaveCompleted"
                    label="After Leaves Completed"
                    placeholder=""
                    rules={[
                      {
                        required: leavelapse?.value === 5,
                        message: "After Leaves Completed is required",
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
