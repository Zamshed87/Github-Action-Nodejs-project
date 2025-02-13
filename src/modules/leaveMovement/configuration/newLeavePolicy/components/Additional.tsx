import { Col, Divider, Form, Row } from "antd";
import { PInput, PSelect } from "Components";
import React from "react";

export const Additional = ({ form }: any) => {
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
          <span>Additional Configuration</span>
        </div>
      </Divider>
      <Col md={5} sm={24} style={{ marginTop: "1.2rem" }}>
        <PInput
          label="Show Balance From Self Service"
          type="checkbox"
          layout="horizontal"
          name="isEssShowBalance"
        />
      </Col>
      <Col md={5} sm={24} style={{ marginTop: "1.2rem" }}>
        <PInput
          label="Apply From Self Service"
          type="checkbox"
          layout="horizontal"
          name="isEssApply"
        />
      </Col>
      <Col md={6} sm={24}>
        <PSelect
          // mode="multiple"
          allowClear
          options={[
            { value: 1, label: "No Round" },
            { value: 2, label: "Round Up" },
            { value: 3, label: "Round Down" },
            // { value: 3, label: "Clock Time" },
          ]}
          name="leaveRoundingType"
          label="Leave Rounding Type"
          placeholder=""
          onChange={(value, op) => {
            form.setFieldsValue({
              leaveRoundingType: op,
            });
          }}
          rules={[
            {
              required: true,
              message: "Leave Rounding Type is required",
            },
          ]}
        />
      </Col>
      <Col md={6} sm={24}>
        <PSelect
          // mode="multiple"
          allowClear
          options={[
            { value: 1, label: "Before Leave" },
            { value: 2, label: "After Leave" },
            { value: 3, label: "Anytime" },
            // { value: 3, label: "Clock Time" },
          ]}
          name="leaveApplicationTime"
          label="Leave Application Time"
          placeholder=""
          onChange={(value, op) => {
            form.setFieldsValue({
              leaveApplicationTime: op,
            });
          }}
          rules={[
            {
              required: true,
              message: "Leave Rounding Type is required",
            },
          ]}
        />
      </Col>
      <Col md={4} sm={24} style={{ marginTop: "1.2rem" }}>
        <PInput
          label="Attachment Mandatory"
          type="checkbox"
          layout="horizontal"
          name="isAttachmentMandatory"
          rules={[
            {
              required: true,
              message: "Attachment Mandatory is required",
            },
          ]}
        />
      </Col>
      <Form.Item shouldUpdate noStyle>
        {() => {
          const { isAttachmentMandatory } = form.getFieldsValue(true);

          return (
            isAttachmentMandatory && (
              <>
                <Col md={7} sm={24}>
                  <PInput
                    type="number"
                    name="attachmentMandatoryAfter"
                    label="Attachment Mandatory After consuming (Days)"
                    placeholder=""
                    rules={[
                      {
                        required: isAttachmentMandatory,
                        message: "attachmentMandatoryAfter is required",
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
