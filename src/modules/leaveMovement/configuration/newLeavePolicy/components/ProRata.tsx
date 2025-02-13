import { Col, Divider, Form, Row } from "antd";
import { PInput, PSelect } from "Components";
import React from "react";

export const ProRata = ({ form }: any) => {
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
          <span>Pro Rata</span>
        </div>
      </Divider>
      <Col md={4} sm={24} style={{ marginTop: "1.2rem" }}>
        <PInput
          label="Is Pro Rata Basis"
          type="checkbox"
          layout="horizontal"
          name="isProRata"
        />
      </Col>
      <Form.Item shouldUpdate noStyle>
        {() => {
          const { isProRata } = form.getFieldsValue(true);

          return (
            isProRata && (
              <>
                <Col md={6} sm={24}>
                  <PSelect
                    // mode="multiple"
                    allowClear
                    options={[
                      { value: 1, label: "Monthly Increment" },
                      { value: 2, label: "Update From Start" },
                      { value: 3, label: "Update After End" },
                      // { value: 3, label: "Clock Time" },
                    ]}
                    name="proRataBasis"
                    label="Pro Rata Basis"
                    placeholder=""
                    onChange={(value, op) => {
                      form.setFieldsValue({
                        proRataBasis: op,
                      });
                    }}
                    rules={[
                      {
                        required: true,
                        message: "Pro Rata Basis is required",
                      },
                    ]}
                  />
                </Col>
                <Col md={8} sm={24}>
                  <PInput
                    type="number"
                    name="proRataCount"
                    label="Pro Rata Count Last Start Days (As Calander Date)"
                    placeholder=""
                    rules={[
                      {
                        required: true,
                        message: "proRataCount is required",
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
