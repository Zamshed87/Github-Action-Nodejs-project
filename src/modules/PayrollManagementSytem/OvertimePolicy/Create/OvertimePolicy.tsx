import { PCard, PCardHeader, PForm, PInput, PRadio, PSelect } from "Components";
import { useApiRequest } from "Hooks";
import { Col, Divider, Form, Row } from "antd";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";

type TOvertimePolicy = {};
const CreateOvertimePolicy: React.FC<TOvertimePolicy> = () => {
  // Data From Store
  const { buId, wgId, wId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );

  // Form Instance
  const [form] = Form.useForm();

  // Api Actions
  const apiKeyFromApiPath = useApiRequest({});

  // Landing Api
  const landingApi = () => {};

  // Life Cycle Hooks
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId, wId]);

  return (
    <>
      <PForm
        form={form}
        initialValues={{
          overtimeDependsOn: 3,
          overtimeCountFrom: 1,
        }}
      >
        <PCard>
          <PCardHeader
            title="Create OT Policy"
            onSearch={() => {}}
            buttonList={[{ type: "primary", content: "Assign" }]}
            backButton
          />
        </PCard>

        <Row>
          <Col span={12}>
            {/* Left Side Fields */}
            <Row gutter={[10, 2]}>
              <Col md={12} sm={24}>
                <PInput
                  type="text"
                  label="Policy Name"
                  name="policyName"
                  placeholder="Policy Name"
                  rules={[
                    {
                      required: true,
                      message: "Please input Policy Name!",
                    },
                  ]}
                />
              </Col>
              <Col md={12} sm={24}>
                <PSelect
                  label="Workplace"
                  name="workplace"
                  placeholder="Workplace Name"
                  rules={[
                    {
                      required: true,
                      message: "Please Select Workplace!",
                    },
                  ]}
                />
              </Col>
              <Col md={12} sm={24}>
                <PSelect
                  label="Policy Type"
                  name="policyType"
                  placeholder="Policy Type"
                  rules={[
                    {
                      required: true,
                      message: "Please Select Policy Type!",
                    },
                  ]}
                />
              </Col>
              <Col md={12} sm={24}>
                <PSelect
                  label="HR Position"
                  name="hrPosition"
                  placeholder="HR Position"
                  rules={[
                    {
                      required: true,
                      message: "Please Select HR Position!",
                    },
                  ]}
                />
              </Col>
              <Col md={12} sm={24}>
                <PSelect
                  label="Employment Type"
                  name="employmentType"
                  placeholder="Employment Type"
                  rules={[
                    {
                      required: true,
                      message: "Please Select Employment Type!",
                    },
                  ]}
                />
              </Col>
              <Col md={12} sm={24}>
                <PInput
                  label="From Salary"
                  placeholder="From Salary"
                  type="number"
                  name="fromSalary"
                  rules={[
                    {
                      required: true,
                      message: "Please input From Salary!",
                    },
                  ]}
                />
              </Col>
              <Col md={12} sm={24}>
                <PInput
                  label="To Salary"
                  placeholder="To Salary"
                  type="number"
                  name="toSalary"
                  rules={[
                    {
                      required: true,
                      message: "Please input To Salary!",
                    },
                  ]}
                />
              </Col>
              {/* OT Depents on */}
              <Divider
                style={{ margin: "3px 0", fontSize: 12 }}
                orientation="left"
              >
                Overtime Depend On
              </Divider>
              <Col md={12} sm={24}>
                <PRadio
                  type="group"
                  name="overtimeDependsOn"
                  onChange={(e) => {
                    console.log(e);
                  }}
                  options={[
                    { value: 1, label: "Basic" },
                    { value: 2, label: "Gross" },
                    { value: 3, label: "Fixed Amount" },
                  ]}
                />
              </Col>
              {/* Fixed Amount Input  */}
              <Form.Item noStyle shouldUpdate>
                {() => {
                  const { overtimeDependsOn } = form.getFieldsValue(true);
                  return (
                    overtimeDependsOn === 3 && (
                      <Col md={12} sm={24}>
                        <PInput
                          placeholder="Fixed Amount"
                          type="number"
                          name="fixedAmount"
                          rules={[
                            {
                              required: true,
                              message: "Please input Fixed Amount!",
                            },
                          ]}
                          min={0}
                        />
                      </Col>
                    )
                  );
                }}
              </Form.Item>

              {/* OT Depents on */}
              <Divider
                style={{ margin: "3px 0", fontSize: 12 }}
                orientation="left"
              >
                Overtime Count From
              </Divider>
              <Col md={24} sm={24}>
                <PRadio
                  type="group"
                  name="overtimeCountFrom"
                  onChange={(e) => {
                    console.log(e);
                  }}
                  options={[
                    { value: 1, label: "Assign Calendar" },
                    {
                      value: 2,
                      label: "Count Minimum Overtime Start(Minutes)",
                    },
                  ]}
                />
              </Col>
            </Row>
          </Col>
          <Col span={12}></Col>
        </Row>
      </PForm>
    </>
  );
};

export default CreateOvertimePolicy;
