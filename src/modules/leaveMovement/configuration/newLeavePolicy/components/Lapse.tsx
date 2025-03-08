import { Col, Divider, Form, Row } from "antd";
import { PInput, PSelect } from "Components";
import { useApiRequest } from "Hooks";
import React, { useEffect } from "react";

export const Lapse = ({ form }: any) => {
  const enumApi = useApiRequest({});

  const getDependTypes = () => {
    enumApi?.action({
      urlKey: "GetEnums",
      method: "GET",
      params: {
        types: "LeaveLapseEnum",
      },
    });
  };
  useEffect(() => {
    getDependTypes();
  }, []);
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
          options={enumApi?.data?.LeaveLapseEnum || []}
          name="leavelapse"
          label="Leave Lapse After"
          placeholder=""
          onChange={(value, op) => {
            form.setFieldsValue({
              leavelapse: op,
              afterLeaveCompleted: undefined,
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
            leavelapse?.value == 5 && (
              <>
                <Col md={6} sm={24}>
                  <PInput
                    type="number"
                    name="afterLeaveCompleted"
                    label="After Leaves Completed"
                    placeholder=""
                    rules={[
                      {
                        message: "Number must be positive",
                        pattern: new RegExp(/^[+]?([.]\d+|\d+([.]\d+)?)$/),
                      },
                      {
                        required: leavelapse?.value == 5,
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
