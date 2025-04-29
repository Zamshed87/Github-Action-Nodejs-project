import { Col, Divider, Form, Row } from "antd";
import { PInput, PSelect } from "Components";
import { useApiRequest } from "Hooks";
import React, { useEffect } from "react";

export const Additional = ({ form }: any) => {
  const enumApi = useApiRequest({});

  const getDependTypes = () => {
    enumApi?.action({
      urlKey: "GetEnums",
      method: "GET",
      params: {
        types: "LeaveApplicationTimeEnum",
      },
    });
  };
  useEffect(() => {
    getDependTypes();
  }, []);

  return (
    <>
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
      <Row gutter={[10, 2]}>
        <Col md={6} sm={24}>
          <PSelect
            // mode="multiple"
            allowClear
            options={[
              { value: 1, label: "Yes" },
              { value: 0, label: "No" },
            ]}
            name="isEssShowBalance"
            label="Show Balance From Self Service "
            placeholder="Show Balance From Self Service "
            onChange={(value, op) => {
              form.setFieldsValue({
                isEssShowBalance: op,
              });
            }}
            rules={[
              {
                required: true,
                message: "Show Balance From Self Service  is required",
              },
            ]}
          />
        </Col>
        {/* <Col md={5} sm={24} style={{ marginTop: "1.2rem" }}>
        <PInput
          label="Show Balance From Self Service"
          type="checkbox"
          layout="horizontal"
          name="isEssShowBalance"
        />
      </Col> */}
        <Col md={6} sm={24}>
          <PSelect
            // mode="multiple"
            allowClear
            options={[
              { value: 1, label: "Yes" },
              { value: 0, label: "No" },
            ]}
            name="isEssApply"
            label="Apply From Self Service "
            placeholder="Apply From Self Service "
            onChange={(value, op) => {
              form.setFieldsValue({
                isEssApply: op,
              });
            }}
            rules={[
              {
                required: true,
                message: "Apply From Self Service  is required",
              },
            ]}
          />
        </Col>
      </Row>
      <Row gutter={[10, 2]}>
        <Col md={6} sm={24}>
          <PSelect
            // mode="multiple"
            allowClear
            options={[
              { value: 1, label: "No Round" },
              // { value: 2, label: "Round Up" },
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
            options={enumApi?.data?.LeaveApplicationTimeEnum || []}
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
      </Row>
      <Row gutter={[10, 2]}>
        <Col md={6} sm={24}>
          <PSelect
            // mode="multiple"
            allowClear
            options={[
              { value: 1, label: "Yes" },
              { value: 0, label: "No" },
            ]}
            name="isAttachmentMandatory"
            label="Attachment Mandatory "
            placeholder="Attachment Mandatory "
            onChange={(value, op) => {
              form.setFieldsValue({
                isAttachmentMandatory: op,
              });
            }}
            rules={[
              {
                required: true,
                message: "Attachment Mandatory  is required",
              },
            ]}
          />
        </Col>
        {/* <Col md={4} sm={24} style={{ marginTop: "1.2rem" }}>
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
      </Col> */}
        <Form.Item shouldUpdate noStyle>
          {() => {
            const { isAttachmentMandatory } = form.getFieldsValue(true);

            return (
              isAttachmentMandatory?.value === 1 && (
                <>
                  <Col md={7} sm={24}>
                    <PInput
                      type="number"
                      name="attachmentMandatoryAfter"
                      label="Attachment Mandatory After consuming (Min Days)"
                      placeholder=""
                      rules={[
                        {
                          required: isAttachmentMandatory?.value === 1,
                          message: "attachmentMandatoryAfter is required",
                        },
                        {
                          message: "Number must be positive",
                          pattern: new RegExp(/^[+]?([.]\d+|\d+([.]\d+)?)$/),
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
      <Row gutter={[10, 2]}>
        <Col md={6} sm={24}>
          <PInput
            type="number"
            name="maxLeaveApplyInLapse"
            label="Max. Leave Application in Lapse"
            placeholder=""
            rules={[
              {
                required: true,
                message: "Max. Leave Application in Lapse is required",
              },
              {
                message: "Number must be positive",
                pattern: new RegExp(/^[+]?([.]\d+|\d+([.]\d+)?)$/),
              },
            ]}
          />
        </Col>
      </Row>
      <Row gutter={[10, 2]}>
        <Col md={6} sm={24}>
          <PInput
            type="number"
            name="maxLeaveApplyMonthly"
            label="Max. Leave Apply Days (Monthly)"
            placeholder=""
            rules={[
              {
                message: "Number must be positive",
                pattern: new RegExp(/^[+]?([.]\d+|\d+([.]\d+)?)$/),
              },
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
            name="minLeaveApplyDays"
            label="Max. Leave Apply Days (At a Time)"
            placeholder=""
            rules={[
              {
                message: "Number must be positive",
                pattern: new RegExp(/^[+]?([.]\d+|\d+([.]\d+)?)$/),
              },
              {
                required: true,
                message: "Max. Leave Apply Days (At a Time) is required",
              },
            ]}
          />
        </Col>
      </Row>
      <Row gutter={[10, 2]}>
        <Col md={6} sm={24}>
          <PInput
            type="number"
            name="minLeaveInApplication"
            label="Min. Leave Application"
            placeholder=""
            rules={[
              {
                required: true,
                message: "Min. Leave Application",
              },
              {
                message: "Number must be positive",
                pattern: new RegExp(/^[+]?([.]\d+|\d+([.]\d+)?)$/),
              },
            ]}
          />
        </Col>
      </Row>
    </>
  );
};
