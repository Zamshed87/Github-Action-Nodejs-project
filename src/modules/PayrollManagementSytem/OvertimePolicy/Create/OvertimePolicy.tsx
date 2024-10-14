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
import moment from "moment";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  OTCountFrom,
  OTPolicyGenerate,
  checkPolicyExistance,
  initDataGenerate,
  otCountFrom,
  otDependsOn,
  // policyType,
} from "../Utils";
import "../style.scss";
import { getPeopleDeskAllDDL } from "common/api";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";

type TOvertimePolicy = unknown;
const CreateOvertimePolicy: React.FC<TOvertimePolicy> = () => {
  // Data From Store
  const { orgId, buId, wgId, employeeId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );
  const { workplaceDDL } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );
  const workplaceList = workplaceDDL?.map((item: any) => {
    return {
      value: item?.WorkplaceId,
      label: item?.WorkplaceName,
    };
  });

  const history = useHistory();
  const dispatch = useDispatch();
  const { state }: any = useLocation();

  // States
  const [matchingData, setMatchingData] = React.useState<any[]>([]);
  // Form Instance
  const [form] = Form.useForm();

  // Api Actions
  const HRPositionDDL = useApiRequest([]);
  const EmploymentTypeDDL = useApiRequest([]);
  const AccountWiseGetOverTimeConfig = useApiRequest([]);
  const SaveNUpdateOverTimeConfig = useApiRequest([]);
  const GetOverTimeConfigById = useApiRequest([]);
  const [calendarDDL, setCalendarDDL] = useState([]);

  // Life Cycle Hooks

  // Get All Existing Overtime Policy
  useEffect(() => {
    getAllExistingOvertimePolicy();
  }, []);

  useEffect(() => {
    if (state?.intOtconfigId) {
      getOverTimeConfigById();
    }
  }, [state]);

  const getHRPositionDDL = () => {
    const { workplace } = form.getFieldsValue(true);
    HRPositionDDL?.action({
      method: "GET",
      urlKey: "PeopleDeskAllDDL",
      params: {
        DDLType: "Position",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        IntWorkplaceId: workplace?.value,
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
    const { workplace } = form.getFieldsValue(true);
    EmploymentTypeDDL?.action({
      method: "GET",
      urlKey: "PeopleDeskAllDDL",
      params: {
        DDLType: "EmploymentType",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        IntWorkplaceId: workplace?.value,
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

  // Get Overtime Policy By Id
  const getOverTimeConfigById = () => {
    GetOverTimeConfigById?.action({
      urlKey: "GetOverTimeConfigById",
      method: "GET",
      params: {
        intOtconfigId: state?.intOtconfigId,
      },
      onSuccess: (data) => {
        const initialData = initDataGenerate(data);
        form.setFieldsValue(initialData);
        getHRPositionDDL();
        getEmploymentTypeDDL();
        getPeopleDeskAllDDL(
          `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Calender&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&IntWorkplaceId=${data?.intWorkplaceId}`,
          "CalenderId",
          "CalenderName",
          setCalendarDDL
        );
      },
    });
  };
  // Submit Handler
  const onFinish = () => {
    if (matchingData?.length) {
      console.log("something");
      return toast.info(
        "Please delete existing policy first or create new policy."
      );
    }

    const commonData = {
      dteCreateAt: moment().format("YYYY-MM-DDTHH:mm:ss"),
      intAccountId: orgId,
      intCreatedBy: employeeId,
      isActive: true,
    };
    const payload = OTPolicyGenerate({
      values: form.getFieldsValue(true),
      commonData,
      matchingData,
      state,
    });
    SaveNUpdateOverTimeConfig?.action({
      method: "POST",
      urlKey: "SaveNUpdateOverTimeConfig",
      payload: payload,
      toast: true,
      onSuccess: () => {
        !state?.intOtconfigId &&
          form.setFieldsValue({
            hrPosition: undefined,
            policyName: undefined,
            workplace: undefined,
            employmentType: undefined,
            calendarName: undefined,
          });
        state?.intOtconfigId && history?.goBack();
        //
      },
    });
  };

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          count: 1,
        }}
        onFinish={onFinish}
        onValuesChange={(changedFields) => {
          const changedKey = Object.keys(changedFields);
          const check = [
            // "workplace",
            "policyType",
            "hrPosition",
            "employmentType",
            "fromSalary",
            "toSalary",
          ].some((key) => changedKey.includes(key));

          if (check) {
            checkPolicyExistance(
              form,
              AccountWiseGetOverTimeConfig?.data,
              setMatchingData
            );
          }
        }}
      >
        <PCard>
          <PCardHeader
            title={`${
              state?.intOtconfigIdstate?.intOtconfigId ? "Edit" : "Create"
            } OT Policy`}
            backButton
            submitText="Save"
          />
          <PCardBody>
            <Row gutter={[30, 2]}>
              {/* Left Side Fields */}
              <Col span={12} style={{ borderRight: "1px solid #efefef" }}>
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
                      options={workplaceList || []}
                      onChange={(value, option) => {
                        form.setFieldsValue({
                          workplace: option,
                        });
                        getHRPositionDDL();
                        getEmploymentTypeDDL();
                        getPeopleDeskAllDDL(
                          `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Calender&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&IntWorkplaceId=${value}`,
                          "CalenderId",
                          "CalenderName",
                          setCalendarDDL
                        );
                      }}
                      disabled={state?.intOtconfigId}
                      rules={[
                        {
                          required: true,
                          message: "Please Select Workplace!",
                        },
                      ]}
                    />
                  </Col>
                  {/* change requirement 💥💥 */}
                  {/* <Form.Item noStyle shouldUpdate>
                    {() => {
                      const { workplace } = form.getFieldsValue(true);
                      return (
                        <Col md={12} sm={24}>
                          <PSelect
                            label="Policy Type"
                            name="policyType"
                            placeholder="Policy Type"
                            options={policyType}
                            mode="multiple"
                            maxTagCount={"responsive"}
                            disabled={state?.intOtconfigId || !workplace}
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
                      );
                    }}
                  </Form.Item> */}
                  {/* 💥💥 change requirement  */}

                  {/* 💥💥 change requirement  Fields Render Using Policy Type - 22/02/2024 */}
                  {/* <div className="d-none">
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
                                  disabled={state?.intOtconfigId}
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
                                  disabled={state?.intOtconfigId}
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
                          if (item?.value === 4)
                            formElements.push(
                              <Col md={12} sm={24} key={idx}>
                                <PSelect
                                  label="Calendar Name"
                                  name="calendarName"
                                  placeholder="Calendar Name"
                                  mode="multiple"
                                  // disabled={state?.intOtconfigId}
                                  maxTagCount={"responsive"}
                                  options={calendarDDL || []}
                                  onChange={(value, option) => {
                                    form.setFieldsValue({
                                      calendarName: option,
                                    });
                                  }}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Please Select Calendar Name!",
                                    },
                                  ]}
                                />
                              </Col>
                            );
                        });
                        return formElements;
                      }}
                    </Form.Item>
                  </div> */}
                  {/* 💥💥 change requirement  Fields Render Using Policy Type - 22/02/2024 */}

                  {/* new requirement 💥💥 */}
                  <Col md={12} sm={24}>
                    <PSelect
                      label="HR Position"
                      name="hrPosition"
                      placeholder="HR Position"
                      mode="multiple"
                      maxTagCount={"responsive"}
                      disabled={state?.intOtconfigId}
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
                  <Col md={12} sm={24}>
                    <PSelect
                      label="Employment Type"
                      name="employmentType"
                      placeholder="Employment Type"
                      mode="multiple"
                      disabled={state?.intOtconfigId}
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
                  <Form.Item noStyle shouldUpdate>
                    {() => {
                      return (
                        <>
                          <Col md={12} sm={24}>
                            <PInput
                              label="From Salary"
                              placeholder="From Salary"
                              type="number"
                              name="fromSalary"
                              // rules={[
                              //   {
                              //     required: true,
                              //     message: "Please input From Salary!",
                              //   },
                              // ]}
                            />
                          </Col>
                          <Col md={12} sm={24}>
                            <PInput
                              label="To Salary"
                              placeholder="To Salary"
                              type="number"
                              name="toSalary"
                              rules={[
                                // {
                                //   required: true,
                                //   message: "Please input To Salary!",
                                // },
                                ({ getFieldValue }) => ({
                                  validator(_, value) {
                                    const fromSalary = parseFloat(
                                      getFieldValue("fromSalary")
                                    );
                                    const toSalary = parseFloat(value);

                                    if (!fromSalary || toSalary > fromSalary) {
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
                    }}
                  </Form.Item>
                  <Col md={12} sm={24}>
                    <PSelect
                      label="Calendar Name"
                      name="calendarName"
                      placeholder="Calendar Name"
                      mode="multiple"
                      // disabled={state?.intOtconfigId}
                      maxTagCount={"responsive"}
                      options={calendarDDL || []}
                      onChange={(value, option) => {
                        form.setFieldsValue({
                          calendarName: option,
                        });
                      }}
                      disabled={state?.intOtconfigId}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Please Select Calendar Name!",
                      //   },
                      // ]}
                    />
                  </Col>
                  <Col md={12} sm={24}>
                    <PInput
                      label={`OT Rate Per hour(s)`}
                      placeholder="Enter OT rate Per hour(s)"
                      type="number"
                      name="otRatePerMin"
                      // rules={[

                      // ]}
                    />
                  </Col>
                  {/* <Col md={12} sm={24}>
                    <PInput
                      label="OT Rate per min"
                      placeholder="OT Rate per min"
                      type="number"
                      name="otRatePerMin"
                      // rules={[
                      
                      // ]}
                    />
                  </Col> */}
                  {/* new requirement 💥💥 */}

                  {/* OT Depents on */}
                  <Divider
                    style={{ margin: "3px 0", fontSize: 12 }}
                    orientation="left"
                  >
                    Overtime Depend On
                  </Divider>
                  <Col md={14} sm={24}>
                    <PRadio
                      type="group"
                      name="overtimeDependsOn"
                      onChange={() => {
                        form.setFieldsValue({
                          fixedAmount: undefined,
                        });
                      }}
                      options={otDependsOn}
                    />
                  </Col>
                  {/* Fixed Amount Input  */}
                  <Form.Item noStyle shouldUpdate>
                    {() => {
                      const { overtimeDependsOn } = form.getFieldsValue(true);
                      return (
                        overtimeDependsOn === 3 && (
                          <Col md={10} sm={24}>
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
                  <Col md={14} sm={24}>
                    <PRadio
                      type="group"
                      name="overtimeCountFrom"
                      onChange={() => {
                        form.setFieldsValue({
                          otStartDelay: undefined,
                        });
                      }}
                      options={otCountFrom}
                    />
                  </Col>
                  {/* OT Start Delay Input  */}
                  <Form.Item noStyle shouldUpdate>
                    {() => {
                      const { overtimeCountFrom } = form.getFieldsValue(true);
                      return (
                        overtimeCountFrom === 2 && (
                          <Col md={10} sm={24}>
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
                  <Col md={14} sm={24}>
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
                          <Col md={10} sm={24}>
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

                  {/* Benefit Hour */}
                  <Divider
                    style={{ margin: "3px 0", fontSize: 12 }}
                    orientation="left"
                  >
                    Count Holiday or Offday
                  </Divider>
                  {/* <Col md={14} sm={24}>
                    <PRadio
                      type="group"
                      name="count"
                      onChange={() => {
                        // form.setFieldsValue({
                        //   fixedBenefitHours: undefined,
                        // });
                      }}
                      options={[
                        {
                          label: "Holiday Count As Full Day",
                          value: 1,
                        },
                        {
                          label: "Off Day Count As Full Day",
                          value: 2,
                        },
                      ]}
                    />
                  </Col> */}
                  <Col md={12} sm={24}>
                    <PInput
                      label="Holiday Count As Full Day?"
                      type="checkbox"
                      name="isHolidayCountAsFullDayOt"
                      layout="horizontal"
                      onChange={(e) => {
                        if (e.target.checked) {
                          form.setFieldsValue({
                            isHolidayCountAsFullDayOt: e.target.checked,
                          });
                        }
                      }}
                    />
                  </Col>
                  <Form.Item noStyle shouldUpdate>
                    {() => {
                      const { isHolidayCountAsFullDayOt } =
                        form.getFieldsValue(true);
                      return (
                        isHolidayCountAsFullDayOt && (
                          <Col md={12} sm={24}>
                            <PInput
                              label="Holiday Max OT Limit (Hr)"
                              placeholder="Holiday Max OT Limit (HR)"
                              type="text"
                              name="intMaxOverTimeForHolidayInMin"
                              rules={[
                                {
                                  required: true,
                                  message:
                                    "Holiday Max OT Limit (HR) is required!",
                                },
                              ]}
                            />
                          </Col>
                        )
                      );
                    }}
                  </Form.Item>

                  <Col md={12} sm={24}>
                    <PInput
                      label="Off Day Count As Full Day?"
                      type="checkbox"
                      name="isOffdayCountAsFullDayOt"
                      layout="horizontal"
                      onChange={(e) => {
                        if (e.target.checked) {
                          form.setFieldsValue({
                            isOffdayCountAsFullDayOt: e.target.checked,
                          });
                        }
                      }}
                    />
                  </Col>
                  <Form.Item noStyle shouldUpdate>
                    {() => {
                      const { isOffdayCountAsFullDayOt } =
                        form.getFieldsValue(true);
                      return (
                        isOffdayCountAsFullDayOt && (
                          <Col md={12} sm={24}>
                            <PInput
                              label="Offday Max OT Limit (Hr)"
                              placeholder="Offday Max OT Limit (Hr)"
                              type="text"
                              name="intMaxOverTimeForOffdayInMin"
                              rules={[
                                {
                                  required: true,
                                  message:
                                    "Offday Max OT Limit (Hr) is required!",
                                },
                              ]}
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
                  <Col md={12} sm={24}>
                    <PInput
                      label="Min OT Hour to Display/Avail" // 04-03-24 "Max OT Hour In Working Days (Min)" || 29-02-24 "OT Hour Above (Min)"
                      placeholder="Min OT Hour to Display/Avail"
                      type="number"
                      name="intOTHourShouldBeAboveInMin"
                      rules={[
                        {
                          required: true,
                          message: "Min OT Hour Required",
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
                      options={OTCountFrom}
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
                      options={OTCountFrom}
                    />
                  </Col>
                  {/* tousif told me to replace this name  */}
                  <Col md={24} sm={24}>
                    <PInput
                      type="checkbox"
                      name="isOvertimeAutoCalculate"
                      label="Do you want to calculate overtime automatically from attendance?"
                      layout="horizontal"
                    />
                  </Col>
                </Row>
              </Col>
              {/* Right Side Fields */}
              <Col span={12}>
                <Row gutter={[10, 10]}>
                  {matchingData?.map((item: any, idx: number) => (
                    <Col md={12} sm={24} key={idx}>
                      <div className="policyInfo">
                        <p>
                          Policy Name:<strong> {item?.strPolicyName}</strong>
                        </p>
                        <p>
                          Workplace:<strong> {item?.strWorkplaceName}</strong>
                        </p>
                        {item?.strHrPositionName ? (
                          <p>
                            HR Position:
                            <strong> {item?.strHrPositionName}</strong>
                          </p>
                        ) : undefined}
                        {item?.employmentType ? (
                          <p>
                            Employment Type:
                            <strong> {item?.employmentType}</strong>
                          </p>
                        ) : undefined}
                        {item?.numFromSalary ? (
                          <p>
                            From Salary: <strong> {item?.numFromSalary}</strong>
                          </p>
                        ) : undefined}
                        {item?.numToSalary ? (
                          <p>
                            To Salary: <strong> {item?.numToSalary}</strong>
                          </p>
                        ) : undefined}
                      </div>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          </PCardBody>
        </PCard>
      </PForm>
    </>
  );
};

export default CreateOvertimePolicy;
