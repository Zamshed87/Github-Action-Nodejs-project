import { Col, Divider, Form, Row } from "antd";
import { PInput, PSelect } from "Components";
import { useApiRequest } from "Hooks";
import React, { useEffect } from "react";

export const ProRata = ({ form }: any) => {
  const enumApi = useApiRequest({});

  const getDependTypes = () => {
    enumApi?.action({
      urlKey: "GetEnums",
      method: "GET",
      params: {
        types: "ProRataBasisEnum",
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
          <span>Pro Rata</span>
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
          name="isProRata"
          label="ProRata "
          placeholder="ProRata "
          onChange={(value, op) => {
            form.setFieldsValue({
              isProRata: op,
            });
          }}
          rules={[
            {
              required: true,
              message: "ProRata  is required",
            },
          ]}
        />
      </Col>
      <Row gutter={[10, 2]}>
        <Form.Item shouldUpdate noStyle>
          {() => {
            const { isProRata } = form.getFieldsValue(true);

            return (
              isProRata?.value === 1 && (
                <>
                  <Col md={8} sm={24}>
                    <PInput
                      type="number"
                      name="proRataCount"
                      label="Pro Rata Count Last Start Days (As Calander Date)"
                      placeholder=""
                      rules={[
                        {
                          message: "Number must be positive",
                          pattern: new RegExp(/^[+]?([.]\d+|\d+([.]\d+)?)$/),
                        },
                        {
                          required: isProRata?.value === 1,
                          message:
                            "Pro Rata Count Last Start Days (As Calander Date) is required",
                        },
                      ]}
                    />
                  </Col>
                  <Col md={6} sm={24}>
                    <PSelect
                      // mode="multiple"
                      allowClear
                      options={enumApi?.data?.ProRataBasisEnum || []}
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
                          required: isProRata?.value === 1,
                          message: "Pro Rata Basis is required",
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
    </>
  );
};
