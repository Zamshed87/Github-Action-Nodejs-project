import { Col, Divider, Form, Row } from "antd";
import { PInput, PSelect } from "Components";
import React from "react";

export const CarryForward = ({ form, PercentOrFixedEnum }: any) => {
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
          <span>Leave Carry Forward</span>
        </div>
      </Divider>
      <Col md={6} sm={24}>
        <PSelect
          // mode="multiple"
          allowClear
          options={[
            { value: 1, label: "Yes" },
            { value: 0, label: "No" },
          ]}
          name="isCarryForward"
          label="Leave Carry Forward "
          placeholder="Leave Carry Forward "
          onChange={(value, op) => {
            form.setFieldsValue({
              isCarryForward: op,
            });
          }}
          rules={[
            {
              required: true,
              message: "Leave Carry Forward  is required",
            },
          ]}
        />
      </Col>
      <Form.Item shouldUpdate noStyle>
        {() => {
          const { isCarryForward, leaveCarryForwardType, isCarryExpired } =
            form.getFieldsValue(true);

          return (
            isCarryForward?.value === 1 && (
              <>
                <Row gutter={[10, 2]}>
                  <Col md={6} sm={24}>
                    <PSelect
                      // mode="multiple"
                      allowClear
                      options={PercentOrFixedEnum?.data?.DaysTypeEnum || []}
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
                          required: isCarryForward?.value,
                          message: "Leave Carry Forward Type is required",
                        },
                      ]}
                    />
                  </Col>
                  <Col md={6} sm={24}>
                    <PInput
                      type="number"
                      name="minConsumeTime"
                      label={`Max Carry Forward After Lapse (${
                        leaveCarryForwardType?.value == 2 ? "%" : "Days"
                      })`}
                      placeholder=""
                      rules={[
                        {
                          message: "Number must be positive",
                          pattern: new RegExp(/^[+]?([.]\d+|\d+([.]\d+)?)$/),
                        },
                        {
                          required: isCarryForward?.value,
                          message:
                            "Max Carry Forward After Lapse (%, Days) is required",
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
                      name="isCarryExpired"
                      label="Carry Expire "
                      placeholder="Carry Expire"
                      onChange={(value, op) => {
                        form.setFieldsValue({
                          isCarryExpired: op,
                        });
                      }}
                      rules={[
                        {
                          required: isCarryForward?.value,
                          message: "Carry Expire  is required",
                        },
                      ]}
                    />
                  </Col>
                  {isCarryExpired?.value === 1 && (
                    <Col md={6} sm={24}>
                      <PInput
                        type="number"
                        name="expiryCarryForwardDaysAfterLapse"
                        label="Expiry of Carry Forward Days After Lapse"
                        placeholder=""
                        rules={[
                          {
                            message: "Number must be positive",
                            pattern: new RegExp(/^[+]?([.]\d+|\d+([.]\d+)?)$/),
                          },
                          {
                            required: isCarryExpired?.value,
                            message:
                              "Expiry of Carry Forward Days After Lapse is required",
                          },
                        ]}
                      />
                    </Col>
                  )}
                </Row>
                <Row gutter={[10, 2]}>
                  <Col md={6} sm={24}>
                    <PInput
                      type="number"
                      name="maxCarryForwardBalance"
                      label="Max Carry Forward Balance (Days)"
                      placeholder=""
                      rules={[
                        {
                          message: "Number must be positive",
                          pattern: new RegExp(/^[+]?([.]\d+|\d+([.]\d+)?)$/),
                        },
                        {
                          required: isCarryForward?.value === 1,
                          message:
                            "Max Carry Forward Balance (Days) is required",
                        },
                      ]}
                    />
                  </Col>
                  <Col md={6} sm={24}>
                    <PSelect
                      // mode="multiple"
                      allowClear
                      options={[
                        { value: 1, label: "Yes" },
                        { value: 0, label: "No" },
                      ]}
                      name="addPrevCarry"
                      label="Add previous year carry balance "
                      placeholder="Add previous year carry balance "
                      onChange={(value, op) => {
                        form.setFieldsValue({
                          addPrevCarry: op,
                        });
                      }}
                      rules={[
                        {
                          required: true,
                          message:
                            "Add previous year carry balance  is required",
                        },
                      ]}
                    />
                  </Col>
                </Row>
              </>
            )
          );
        }}
      </Form.Item>

      <Row gutter={[10, 2]}>
        {/* <Form.Item shouldUpdate noStyle>
          {() => {
            const { leavelapse } = form.getFieldsValue(true);

            return (
              // leavelapse?.value === 5 && (
              true && (
                <>
                  <Col md={6} sm={24}>
                    <PInput
                      type="number"
                      name="maxCarryForwardBalance"
                      label="Max Carry Forward Balance (Days)"
                      placeholder=""
                      rules={[
                        {
                          message: "Number must be positive",
                          pattern: new RegExp(/^[+]?([.]\d+|\d+([.]\d+)?)$/),
                        },
                        {
                          required: true,
                          message:
                            "Max Carry Forward Balance (Days) is required",
                        },
                      ]}
                    />
                  </Col>
                </>
              )
            );
          }}
        </Form.Item> */}
      </Row>
    </>
  );
};
