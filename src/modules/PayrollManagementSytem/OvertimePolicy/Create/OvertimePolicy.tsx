import {
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PInput,
  PRadio,
  PSelect,
} from "Components";
import { useApiRequest } from "Hooks";
import { Col, Divider, Form, Row } from "antd";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { OTPolicyGenerate, policyType } from "../Utils";
import moment from "moment";

type TOvertimePolicy = unknown;
const CreateOvertimePolicy: React.FC<TOvertimePolicy> = () => {
  // Data From Store
  const { orgId, buId, wgId, wId, employeeId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );

  // Form Instance
  const [form] = Form.useForm();

  // Api Actions
  const WorkplaceDDL = useApiRequest([]);
  const HRPositionDDL = useApiRequest([]);
  const EmploymentTypeDDL = useApiRequest([]);
  const AccountWiseGetOverTimeConfig = useApiRequest([]);
  const SaveNUpdateOverTimeConfig = useApiRequest([]);

  // Life Cycle Hooks
  useEffect(() => {
    getWorkplaceDDL();
    getHRPositionDDL();
    getEmploymentTypeDDL();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId, wId, employeeId]);

  // Get All Existing Overtime Policy
  useEffect(() => {
    getAllExistingOvertimePolicy();
  }, []);

  const getWorkplaceDDL = () => {
    WorkplaceDDL?.action({
      method: "GET",
      urlKey: "PeopleDeskAllDDL",
      params: {
        DDLType: "Workplace",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        intId: employeeId,
      },
      onSuccess: (data) => {
        data?.forEach((item: any, i: number) => {
          data[i].value = item?.intWorkplaceId;
          data[i].label = item?.strWorkplace;
        });
      },
    });
  };
  const getHRPositionDDL = () => {
    HRPositionDDL?.action({
      method: "GET",
      urlKey: "PeopleDeskAllDDL",
      params: {
        DDLType: "Position",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        IntWorkplaceId: wId,
        intId: 0,
      },
      onSuccess: (data) => {
        data?.forEach((item: any, i: number) => {
          data[i].value = item?.PositionId;
          data[i].label = item?.PositionName;
        });
      },
    });
  };
  const getEmploymentTypeDDL = () => {
    EmploymentTypeDDL?.action({
      method: "GET",
      urlKey: "PeopleDeskAllDDL",
      params: {
        DDLType: "EmploymentType",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        intId: 0,
      },
      onSuccess: (data) => {
        data?.forEach((item: any, i: number) => {
          data[i].value = item?.Id;
          data[i].label = item?.EmploymentType;
        });
      },
    });
  };

  const getAllExistingOvertimePolicy = () => {
    AccountWiseGetOverTimeConfig?.action({
      method: "GET",
      urlKey: "AccountWiseGetOverTimeConfig",
    });
  };
  // Submit Handler
  const onFinish = () => {
    const commonData = {
      dteCreateAt: moment().format("YYYY-MM-DDTHH:mm:ss"),
      intAccountId: orgId,
      intCreatedBy: employeeId,
      isActive: true,
    };
    const payload = OTPolicyGenerate({
      values: form.getFieldsValue(true),
      commonData,
    });

    SaveNUpdateOverTimeConfig?.action({
      method: "POST",
      urlKey: "SaveNUpdateOverTimeConfig",
      payload: payload,
      toast: true,
      onSuccess: (data) => {
        console.log(data);
      },
    });
  };

  return (
    <>
      <PForm
        form={form}
        initialValues={{
          overtimeDependsOn: 1,
          overtimeCountFrom: 1,
          overtimeCount: 1,
          overtimeAmount: 1,
          benefitHours: 1,
        }}
        onFinish={onFinish}
      >
        <PCard>
          <PCardHeader title="Create OT Policy" backButton submitText="Save" />
          <PCardBody>
            <Row gutter={[30, 2]}>
              <Col span={12} style={{ borderRight: "1px solid #efefef" }}>
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
                      options={WorkplaceDDL?.data || []}
                      loading={WorkplaceDDL?.loading}
                      onChange={(value, option) => {
                        form.setFieldsValue({
                          workplace: option,
                        });
                      }}
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
                      options={policyType}
                      mode="multiple"
                      maxTagCount={"responsive"}
                      onChange={(value, option) => {
                        form.setFieldsValue({
                          policyType: option,
                          hrPosition: undefined,
                          employmentType: undefined,
                          fromSalary: undefined,
                          toSalary: undefined,
                        });
                      }}
                      rules={[
                        {
                          required: true,
                          message: "Please Select Policy Type!",
                        },
                      ]}
                    />
                  </Col>

                  {/* Fields Render Using Policy Type */}
                  <Form.Item noStyle shouldUpdate>
                    {() => {
                      const { policyType } = form.getFieldsValue(true);
                      const formElements: React.ReactNode[] = [];

                      // Sort the policyType array based on the 'value' property
                      const sortedPolicyType = policyType
                        ?.slice()
                        .sort((a: any, b: any) => a.value - b.value);

                      sortedPolicyType?.forEach((item: any, idx: number) => {
                        if (item?.value === 1)
                          formElements.push(
                            <Col md={12} sm={24} key={idx}>
                              <PSelect
                                label="HR Position"
                                name="hrPosition"
                                placeholder="HR Position"
                                mode="multiple"
                                maxTagCount={"responsive"}
                                options={HRPositionDDL?.data || []}
                                onChange={(value, option) => {
                                  form.setFieldsValue({
                                    hrPosition: option,
                                  });
                                }}
                                rules={[
                                  {
                                    required: true,
                                    message: "Please Select HR Position!",
                                  },
                                ]}
                              />
                            </Col>
                          );

                        if (item?.value === 2)
                          formElements.push(
                            <Col md={12} sm={24} key={idx}>
                              <PSelect
                                label="Employment Type"
                                name="employmentType"
                                placeholder="Employment Type"
                                mode="multiple"
                                maxTagCount={"responsive"}
                                options={EmploymentTypeDDL?.data || []}
                                onChange={(value, option) => {
                                  form.setFieldsValue({
                                    employmentType: option,
                                  });
                                }}
                                rules={[
                                  {
                                    required: true,
                                    message: "Please Select Employment Type!",
                                  },
                                ]}
                              />
                            </Col>
                          );
                        if (item?.value === 3)
                          formElements.push(
                            <>
                              <Col md={12} sm={24} key={idx}>
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
                              <Col md={12} sm={24} key={idx + 1}>
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
                                    ({ getFieldValue }) => ({
                                      validator(_, value) {
                                        const fromSalary = parseFloat(
                                          getFieldValue("fromSalary")
                                        );
                                        const toSalary = parseFloat(value);

                                        if (
                                          !fromSalary ||
                                          toSalary > fromSalary
                                        ) {
                                          return Promise.resolve();
                                        }
                                        return Promise.reject(
                                          new Error(
                                            "To Salary cannot be less than From Salary!"
                                          )
                                        );
                                      },
                                    }),
                                  ]}
                                />
                              </Col>
                            </>
                          );
                      });
                      return formElements;
                    }}
                  </Form.Item>

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
                        form.setFieldsValue({
                          fixedAmount: undefined,
                        });
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
                  <Col md={12} sm={24}>
                    <PRadio
                      type="group"
                      name="overtimeCountFrom"
                      onChange={(e) => {
                        console.log(e);
                        form.setFieldsValue({
                          otStartDelay: undefined,
                        });
                      }}
                      options={[
                        { value: 1, label: "Assign Calendar" },
                        {
                          value: 2,
                          label: "OT Start Delay (Minutes)",
                        },
                      ]}
                    />
                  </Col>
                  {/* OT Start Delay Input  */}
                  <Form.Item noStyle shouldUpdate>
                    {() => {
                      const { overtimeCountFrom } = form.getFieldsValue(true);
                      return (
                        overtimeCountFrom === 2 && (
                          <Col md={12} sm={24}>
                            <PInput
                              placeholder="Delay Minutes"
                              type="number"
                              name="otStartDelay"
                              rules={[
                                {
                                  required: true,
                                  message: "Please input Delay in Minutes!",
                                },
                              ]}
                              min={0}
                            />
                          </Col>
                        )
                      );
                    }}
                  </Form.Item>

                  {/* Benefit Hour */}
                  <Divider
                    style={{ margin: "3px 0", fontSize: 12 }}
                    orientation="left"
                  >
                    Benefit Hour
                  </Divider>
                  <Col md={12} sm={24}>
                    <PRadio
                      type="group"
                      name="benefitHours"
                      onChange={() => {
                        form.setFieldsValue({
                          fixedBenefitHours: undefined,
                        });
                      }}
                      options={[
                        {
                          label: "Calender Time",
                          value: 1,
                        },
                        {
                          label: "Fixed Hour",
                          value: 2,
                        },
                      ]}
                    />
                  </Col>

                  {/* Fixed Benefit Hour Input  */}
                  <Form.Item noStyle shouldUpdate>
                    {() => {
                      const { benefitHours } = form.getFieldsValue(true);
                      return (
                        benefitHours === 2 && (
                          <Col md={12} sm={24}>
                            <PInput
                              placeholder="Fixed Benefit Hour"
                              type="number"
                              name="fixedBenefitHours"
                              rules={[
                                {
                                  required: true,
                                  message: "Please Fixed Benefit Hour!",
                                },
                              ]}
                              min={0}
                            />
                          </Col>
                        )
                      );
                    }}
                  </Form.Item>

                  <Divider
                    style={{ margin: "3px 0", fontSize: 12 }}
                    orientation="left"
                  >
                    Others
                  </Divider>
                  <Col md={12} sm={24}>
                    <PInput
                      label="Working Days"
                      placeholder="Working Days"
                      type="number"
                      name="workingDays"
                      rules={[
                        {
                          required: true,
                          message: "Working Days is required!",
                        },
                      ]}
                    />
                  </Col>

                  <Col md={12} sm={24}>
                    <PInput
                      label="Benefit Percentage(Working Days)"
                      placeholder="Benefit Percentage"
                      type="number"
                      name="benifitPercentageWorkingDays"
                      rules={[
                        {
                          required: true,
                          message: "Benefit Percentage is required!",
                        },
                      ]}
                    />
                  </Col>
                  <Col md={12} sm={24}>
                    <PInput
                      label="Benefit Percentage(HoliDay)"
                      placeholder="Benefit Percentage"
                      type="number"
                      name="benifitPercentageHoliDays"
                      rules={[
                        {
                          required: true,
                          message: "Benefit Percentage is required!",
                        },
                      ]}
                    />
                  </Col>
                  <Col md={12} sm={24}>
                    <PInput
                      label="Benefit Percentage(Off Day)"
                      placeholder="Benefit Percentage"
                      type="number"
                      name="benifitPercentageOffDays"
                      rules={[
                        {
                          required: true,
                          message: "Benefit Percentage is required!",
                        },
                      ]}
                    />
                  </Col>
                  <Col md={12} sm={24}>
                    <PInput
                      label="Max Over Time Daily(Hour)"
                      placeholder="Max Over Time Daily"
                      type="number"
                      name="maxOverTimeDaily"
                      rules={[
                        {
                          required: true,
                          message: "Max Over Time Daily is required!",
                        },
                      ]}
                    />
                  </Col>
                  <Col md={12} sm={24}>
                    <PInput
                      label="Max Over Time Monthly(Hour)"
                      placeholder="Max Over Time Monthly"
                      type="number"
                      name="maxOverTimeMonthly"
                      rules={[
                        {
                          required: true,
                          message: "Max Over Time Monthly is required!",
                        },
                      ]}
                    />
                  </Col>
                  <Divider
                    style={{ margin: "3px 0", fontSize: 12 }}
                    orientation="left"
                  >
                    Overtime (Minute/Hour)
                  </Divider>
                  <Col md={24} sm={24}>
                    <PRadio
                      type="group"
                      name="overtimeCount"
                      onChange={(e) => {
                        console.log(e);
                      }}
                      options={[
                        { value: 1, label: "At Actual" },
                        {
                          value: 2,
                          label: "Round Down",
                        },
                        {
                          value: 3,
                          label: "Round Up",
                        },
                      ]}
                    />
                  </Col>
                  <Divider
                    style={{ margin: "3px 0", fontSize: 12 }}
                    orientation="left"
                  >
                    Overtime Amount
                  </Divider>
                  <Col md={24} sm={24}>
                    <PRadio
                      type="group"
                      name="overtimeAmount"
                      onChange={(e) => {
                        console.log(e);
                      }}
                      options={[
                        { value: 1, label: "At Actual" },
                        {
                          value: 2,
                          label: "Round Down",
                        },
                        {
                          value: 3,
                          label: "Round Up",
                        },
                      ]}
                    />
                  </Col>
                  <Col md={24} sm={24}>
                    <PInput
                      type="checkbox"
                      name="calculateAutoAttendance"
                      label="Do you want to calculate overtime automatically from attendance?"
                      layout="horizontal"
                    />
                  </Col>
                </Row>
              </Col>
              <Col span={12}></Col>
            </Row>
          </PCardBody>
        </PCard>
      </PForm>
    </>
  );
};

export default CreateOvertimePolicy;
