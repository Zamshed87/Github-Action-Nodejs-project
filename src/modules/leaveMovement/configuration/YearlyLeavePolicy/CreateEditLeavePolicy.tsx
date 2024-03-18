/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { yearDDLAction } from "../../../../utility/yearDDL";
import { DeleteOutline } from "@mui/icons-material";
import { AddOutlined } from "@mui/icons-material";

import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  getYearlyPolicyById,
  getYearlyPolicyPopUpDDL,
  isPolicyExist,
  saveHandler,
} from "./helper";
import { getPeopleDeskAllDDL } from "../../../../common/api";
import BackButton from "../../../../common/BackButton";
import { success500 } from "../../../../utility/customColor";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { IconButton, Tooltip, Alert } from "@mui/material";
import { toast } from "react-toastify";
import { Col, Form, List, Row, Typography, Divider } from "antd";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { useApiRequest } from "../../../../Hooks";
import Loading from "common/loading/Loading";
import { useHistory, useParams } from "react-router-dom";
import {
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PInput,
  PSelect,
} from "Components";
import { generatePayload } from "./Utils";

const CreateEditLeavePolicy = () => {
  const policyApi = useApiRequest([]);
  const params: any = useParams();
  const [form] = Form.useForm();

  const EmploymentTypeDDL = useApiRequest([]);
  const HRPositionDDL = useApiRequest([]);

  const [leaveTypeDDL, setLeaveTypeDDL] = useState([]);
  const [workplaceDDL, setWorkplaceDDL] = useState<any>(null);
  const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState([]);
  const [buDDL, setBuDDL] = useState([]);
  const [allPolicies, setAllPolicies] = useState([]);
  const [singleData, setSingleData] = useState<any>({});
  const [existingPolicies, setExistingPolicies] = useState<any>([]);
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState<any>([]);
  const { orgId, employeeId, buId, wgId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );
  useEffect(() => {
    policyApi?.action({
      method: "GET",
      urlKey: "SaasMasterDataAllLeavePolicy",
      onSuccess: (data) => {
        setAllPolicies(data || []);
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // getYearlyPolicyPopUpDDL(
    //   `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmploymentType&WorkplaceGroupId=${wgId}&BusinessUnitId=${buId}&intId=0`,
    //   "Id",
    //   "EmploymentType",
    //   setEmploymentTypeDDL
    // );
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=LeaveType&BusinessUnitId=${buId}&intId=0&WorkplaceGroupId=${wgId}`,
      "LeaveTypeId",
      "LeaveType",
      setLeaveTypeDDL
    );
    // getPeopleDeskAllDDL(
    //   `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=AllPosition&BusinessUnitId=${buId}&intId=0&WorkplaceGroupId=${wgId}&intId=0`,
    //   "PositionId",
    //   "PositionName",
    //   setHrPositionDDL
    // );
  }, [orgId, buId, wgId]);

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=BusinessUnit&BusinessUnitId=${buId}&WorkplaceGroupId=0&intId=${employeeId}`,
      "intBusinessUnitId",
      "strBusinessUnit",
      setBuDDL
    );
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&AccountId=${orgId}&BusinessUnitId=${0}&WorkplaceGroupId=${0}&intId=${employeeId}`,
      "intWorkplaceId",
      "strWorkplace",
      setWorkplaceDDL
    );
  }, [orgId, buId, employeeId, wgId]);

  // for edit
  useEffect(() => {
    if (params?.id && workplaceDDL?.length > 0) {
      getYearlyPolicyById(
        params?.id,
        setSingleData,
        workplaceDDL,
        setTableData,
        allPolicies,
        setExistingPolicies,
        setLoading
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id, workplaceDDL, allPolicies]);

  useEffect(() => {
    if (singleData?.policyId) {
      form.setFieldsValue(singleData);
      getEmploymentType();
      getHRPosition();
    }
  }, [singleData]);

  const remover = (payload: number) => {
    const filterArr = tableData.filter(
      (itm: any, idx: number) => idx !== payload
    );
    setTableData(filterArr);
  };

  const getEmploymentType = () => {
    const { intWorkplaceList } = form.getFieldsValue();
    const strWorkplaceIdList = intWorkplaceList
      .map((item: any) => item.value)
      .join(",");

    EmploymentTypeDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmploymentTypeWorkplaceWise",
        WorkplaceGroupId: wgId,
        BusinessUnitId: buId,
        strWorkplaceIdList: strWorkplaceIdList,
      },
      onSuccess: (data) => {
        data?.forEach((item: any, idx: number) => {
          data[idx].label = item?.EmploymentType;
          data[idx].value = item?.Id;
        });
      },
    });
  };
  const getHRPosition = () => {
    const { intWorkplaceList } = form.getFieldsValue();
    const strWorkplaceIdList = intWorkplaceList
      .map((item: any) => item.value)
      .join(",");

    HRPositionDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "AllPosition",
        WorkplaceGroupId: wgId,
        BusinessUnitId: buId,
        strWorkplaceIdList: strWorkplaceIdList,
      },
      onSuccess: (data) => {
        data?.forEach((item: any, idx: number) => {
          data[idx].label = item?.PositionName;
          data[idx].value = item?.PositionId;
        });
      },
    });
  };

  const submitHandler = () => {
    const values = form.getFieldsValue();
    const payload = generatePayload(values, tableData, existingPolicies);
    policyApi?.action({
      method: "POST",
      urlKey: "SaasMasterDataCRUDLeavePolicy",
      payload: { ...payload, policyId: params?.id || 0 },
      onSuccess: (data) => {
        toast.success(data?.message || "Submitted successfully", {
          toastId: "savePolicy",
        });
        if (data?.statusCode === 201) {
          history.push({
            pathname: `/administration/timeManagement/leavePolicyAssign`,
            state: { list: data?.intPolicyIdList, year: payload?.intYear },
          });
        }
      },
      onError: (error) => {
        toast.error(error?.message || "Something went wrong", {
          toastId: "savePolicyError",
        });
      },
    });
  };

  return (
    <>
      <PForm
        form={form}
        // onFinish={(values) => {
        //   saveHandler(
        //     values,
        //     form.resetFields,
        //     policyApi,
        //     tableData,
        //     existingPolicies,
        //     params,
        //     history
        //   );
        // }}
        onFinish={submitHandler}
        initialValues={{}}
      >
        <PCard>
          <PCardHeader
            backButton
            title={params?.id ? "Edit Leave Policy" : "Create Leave Policy"}
            submitText="Save"
          />
          <PCardBody>
            <Row gutter={[30, 2]}>
              <Col
                span={12}
                style={{ borderRight: "1px solid rgb(239, 239, 239)" }}
              >
                <Row gutter={[10, 2]}>
                  {/* leave config */}
                  <>
                    <Col md={12} sm={24}>
                      <PInput
                        type="text"
                        name="strPolicyName"
                        label="Policy Name"
                        placeholder="Policy Name"
                      />
                    </Col>

                    <Col md={12} sm={24}>
                      <PInput
                        type="text"
                        name="strDisplayName"
                        label="Leave Display Name"
                        placeholder="Display Name"
                      />
                    </Col>
                    <Col md={12} sm={24}>
                      <PSelect
                        options={leaveTypeDDL || []}
                        name="intLeaveType"
                        label="Leave Type"
                        placeholder="  Leave Type"
                        onChange={(value: number, op: any) => {
                          form.setFieldsValue({
                            isProdataBasis: false,
                            isDependOnServiceLength: false,
                            isEarnLeave: false,
                            isCompensatoryLve: false,
                            intLeaveType: op,
                            isEarnLveIncludeOffday: false,
                            isEarnLveIncludeHoliday: false,
                            intDayForOneEarnLve: undefined,
                            intEarnLveInDay: undefined,
                            intConpensatoryLveExpireInDays: undefined,
                            isConpensatoryLveExpire: false,
                          });

                          if (op.label === "Earn Leave/Annual Leave") {
                            form.setFieldsValue({
                              isEarnLeave: true,
                              intAllocatedLveInDay: undefined,
                            });
                          }
                          if (op.label === "Compensatory Leave") {
                            form.setFieldsValue({
                              isCompensatoryLve: true,
                              intAllocatedLveInDay: undefined,
                            });
                          }
                          const temp = form.getFieldsValue();
                          isPolicyExist(
                            {
                              ...temp,
                              intLeaveType: op,
                            },
                            allPolicies,
                            setExistingPolicies
                          );
                          // value && getWorkplace();
                        }}
                        rules={[
                          {
                            required: true,
                            message: "Leave Type is required",
                          },
                        ]}
                      />
                    </Col>
                    <Col md={12} sm={24}>
                      <PSelect
                        options={[{ value: 0, label: "None" }, ...leaveTypeDDL]}
                        name="inPreviousLveTypeEnd"
                        label="Previous Leave Type Availability After End"
                        placeholder="Previous Leave Type Availability After End"
                        onChange={(value, op) => {
                          form.setFieldsValue({
                            inPreviousLveTypeEnd: op,
                          });
                        }}
                        rules={[
                          {
                            required: false,
                            message: "Leave Type is required",
                          },
                        ]}
                      />
                    </Col>
                    <Form.Item shouldUpdate noStyle>
                      {() => {
                        const { isDependOnServiceLength, intLeaveType } =
                          form.getFieldsValue();

                        // const empType = employeeType?.label;

                        return (
                          <>
                            <Col md={12} sm={24}>
                              <PInput
                                type="number"
                                min={0}
                                name="intAllocatedLveInDay"
                                label="Allocated Leave in Day"
                                placeholder="Allocated Leave in Day"
                                rules={[
                                  {
                                    required: !(
                                      isDependOnServiceLength ||
                                      intLeaveType?.label ===
                                        "Earn Leave/Annual Leave" ||
                                      intLeaveType?.label ===
                                        "Compensatory Leave"
                                    ),
                                    message:
                                      " Allocated Leave in Day is required",
                                  },
                                  {
                                    message:
                                      "Allocated Leave in Day must be positive",
                                    pattern: new RegExp(
                                      /^[+]?([.]\d+|\d+([.]\d+)?)$/
                                    ),
                                  },
                                ]}
                                disabled={
                                  isDependOnServiceLength ||
                                  intLeaveType?.label ===
                                    "Earn Leave/Annual Leave" ||
                                  intLeaveType?.label === "Compensatory Leave"
                                }
                              />
                            </Col>
                          </>
                        );
                      }}
                    </Form.Item>
                    <Col md={12} sm={24}>
                      <PInput
                        type="number"
                        name="intMaxLveDaySelf"
                        label="Max Leave Available from Self"
                        placeholder="Max Leave Available from Self"
                        rules={[
                          {
                            message: "Max Leave Available must be positive",
                            pattern: new RegExp(/^[+]?([.]\d+|\d+([.]\d+)?)$/),
                          },
                        ]}
                      />
                    </Col>
                    <Col md={12} sm={24}>
                      <PInput
                        type="number"
                        name="intMaxLveApplicationSelfInMonth"
                        label="Max Leave Application In Month"
                        placeholder="Max Leave Application In Month"
                        rules={[
                          {
                            message: " Max Leave Application must be positive",
                            pattern: new RegExp(/^[+]?([.]\d+|\d+([.]\d+)?)$/),
                          },
                        ]}
                      />
                    </Col>
                    <Col md={12} sm={24}>
                      <PInput
                        type="number"
                        name="intMaxLveApplicationSelfInYear"
                        label="Max Leave Application In Year"
                        placeholder="Max Leave Application In Year"
                        rules={[
                          {
                            message: "Max Leave Application must be positive",
                            pattern: new RegExp(/^[+]?([.]\d+|\d+([.]\d+)?)$/),
                          },
                        ]}
                      />
                    </Col>
                  </>
                  {/* Organization Configuration */}
                  <Divider
                    style={{
                      marginBlock: "4px",
                      marginTop: "6px",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                    orientation="left"
                  >
                    Organization Configuration
                  </Divider>
                  <Form.Item shouldUpdate noStyle>
                    {() => {
                      const { intWorkplaceList, wg, bu } =
                        form.getFieldsValue();

                      // const empType = employeeType?.label;

                      return (
                        <>
                          {/* {intWorkplaceList?.length === workplaceDDL?.length ? ( */}
                          <>
                            <Col md={24}>
                              <PSelect
                                // mode="multiple"
                                allowClear
                                options={[...buDDL] || []}
                                name="bu"
                                disabled={params?.id}
                                label="Business Unit"
                                placeholder="Business Unit"
                                onChange={(value, op: any) => {
                                  form.setFieldsValue({
                                    bu: op,
                                  });
                                  // getPeopleDeskAllDDL(
                                  //   `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplaceGroup&WorkplaceGroupId=0&BusinessUnitId=${
                                  //     op[op?.length - 1]?.value
                                  //   }&intId=${employeeId}`,
                                  //   "intWorkplaceGroupId",
                                  //   "strWorkplaceGroup",
                                  //   setWorkplaceGroupDDL
                                  // );
                                  getPeopleDeskAllDDL(
                                    `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplaceGroup&WorkplaceGroupId=0&BusinessUnitId=${op?.value}&intId=${employeeId}`,
                                    "intWorkplaceGroupId",
                                    "strWorkplaceGroup",
                                    setWorkplaceGroupDDL
                                  );
                                }}
                                // rules={[
                                //   {
                                //     required: true,
                                //     message: "Business Unit is required",
                                //   },
                                // ]}
                              />
                            </Col>
                            <Col md={24}>
                              <PSelect
                                // mode="multiple"
                                allowClear
                                options={workplaceGroupDDL || []}
                                name="wg"
                                disabled={params?.id}
                                label="Workplace Group"
                                placeholder="Workplace Group"
                                onChange={(value, op: any) => {
                                  const wddl = [...workplaceDDL];
                                  form.setFieldsValue({
                                    wg: op,
                                  });
                                  // getYearlyPolicyPopUpDDL(
                                  //   `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&AccountId=${orgId}&BusinessUnitId=${
                                  //     bu[0]?.value
                                  //   }&WorkplaceGroupId=${
                                  //     op[op?.length - 1]?.value
                                  //   }&intId=${employeeId}`,
                                  //   "intWorkplaceId",
                                  //   "strWorkplace",
                                  //   setWorkplaceDDL
                                  //   // (res: any) => {
                                  //   //   if (op?.length === 1) {
                                  //   //     const newState1 = res.filter(
                                  //   //       (obj1: any) =>
                                  //   //         intWorkplaceList?.some(
                                  //   //           (obj2: any) =>
                                  //   //             obj2.value === obj1.value
                                  //   //         )
                                  //   //     );
                                  //   //     form.setFieldsValue({
                                  //   //       intWorkplaceList: newState1,
                                  //   //     });
                                  //   //   } else {
                                  //   //     setWorkplaceDDL(() => {
                                  //   //       const ar = [...wddl, ...res];
                                  //   //       const uniqueObjectMap = new Map();
                                  //   //       ar.forEach((obj) => {
                                  //   //         uniqueObjectMap.set(obj.value, obj);
                                  //   //       });

                                  //   //       const newState1 = Array.from(
                                  //   //         uniqueObjectMap.values()
                                  //   //       ).filter((obj1) =>
                                  //   //         intWorkplaceList?.some(
                                  //   //           (obj2: any) =>
                                  //   //             obj2.value === obj1.value
                                  //   //         )
                                  //   //       );
                                  //   //       form.setFieldsValue({
                                  //   //         intWorkplaceList: newState1,
                                  //   //       });
                                  //   //       return Array.from(
                                  //   //         uniqueObjectMap.values()
                                  //   //       );
                                  //   //     });
                                  //   //   }
                                  //   //   const { intWorkplaceList } =
                                  //   //     form.getFieldsValue(true);

                                  //   //   intWorkplaceList?.length &&
                                  //   //     getEmploymentType();
                                  //   //   getHRPosition();
                                  //   // }
                                  // );
                                  getYearlyPolicyPopUpDDL(
                                    `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&AccountId=${orgId}&BusinessUnitId=${bu?.value}&WorkplaceGroupId=${op?.value}&intId=${employeeId}`,
                                    "intWorkplaceId",
                                    "strWorkplace",
                                    setWorkplaceDDL
                                    // (res: any) => {
                                    //   if (op?.length === 1) {
                                    //     const newState1 = res.filter(
                                    //       (obj1: any) =>
                                    //         intWorkplaceList?.some(
                                    //           (obj2: any) =>
                                    //             obj2.value === obj1.value
                                    //         )
                                    //     );
                                    //     form.setFieldsValue({
                                    //       intWorkplaceList: newState1,
                                    //     });
                                    //   } else {
                                    //     setWorkplaceDDL(() => {
                                    //       const ar = [...wddl, ...res];
                                    //       const uniqueObjectMap = new Map();
                                    //       ar.forEach((obj) => {
                                    //         uniqueObjectMap.set(obj.value, obj);
                                    //       });

                                    //       const newState1 = Array.from(
                                    //         uniqueObjectMap.values()
                                    //       ).filter((obj1) =>
                                    //         intWorkplaceList?.some(
                                    //           (obj2: any) =>
                                    //             obj2.value === obj1.value
                                    //         )
                                    //       );
                                    //       form.setFieldsValue({
                                    //         intWorkplaceList: newState1,
                                    //       });
                                    //       return Array.from(
                                    //         uniqueObjectMap.values()
                                    //       );
                                    //     });
                                    //   }
                                    //   const { intWorkplaceList } =
                                    //     form.getFieldsValue(true);

                                    //   intWorkplaceList?.length &&
                                    //     getEmploymentType();
                                    //   getHRPosition();
                                    // }
                                  );
                                }}

                                // rules={[
                                //   {
                                //     required: true,
                                //     message:
                                //       "Workplace Group is required",
                                //   },
                                // ]}
                              />
                            </Col>
                          </>
                          {/* // ) : null} */}
                          <Col md={24} sm={24}>
                            <PSelect
                              showSearch
                              allowClear
                              options={workplaceDDL || []}
                              name="intWorkplaceList"
                              label="Workplace"
                              placeholder="Workplace"
                              disabled={params?.id}
                              onChange={(value, op) => {
                                form.setFieldsValue({
                                  intEmploymentTypeList: undefined,
                                });
                                form.setFieldsValue({
                                  hrPositionListDTO: undefined,
                                });
                                value
                                  ? form.setFieldsValue({
                                      intWorkplaceList: [op],
                                    })
                                  : form.setFieldsValue({
                                      intWorkplaceList: undefined,
                                    });
                                const temp = form.getFieldsValue();
                                isPolicyExist(
                                  temp,
                                  allPolicies,
                                  setExistingPolicies
                                );

                                value && getEmploymentType();
                                value && getHRPosition();
                              }}
                              rules={[
                                {
                                  required: true,
                                  message: "Workplace is required",
                                },
                              ]}
                            />
                          </Col>
                        </>
                      );
                    }}
                  </Form.Item>

                  {/* Employee Configuration */}
                  <Divider
                    style={{
                      marginBlock: "4px",
                      marginTop: "6px",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                    orientation="left"
                  >
                    Employee Configuration
                  </Divider>
                  <Col md={12} sm={24}>
                    <PSelect
                      mode="multiple"
                      options={EmploymentTypeDDL?.data || []}
                      name="intEmploymentTypeList"
                      label=" Employment Type"
                      placeholder="  Employment Type"
                      onChange={(value, op) => {
                        form.setFieldsValue({
                          intEmploymentTypeList: op,
                        });
                        const temp = form.getFieldsValue();

                        isPolicyExist(
                          {
                            ...temp,
                            intEmploymentTypeList: op,
                          },
                          allPolicies,
                          setExistingPolicies
                        );

                        // value && getWorkplace();
                      }}
                      rules={[
                        {
                          required: true,
                          message: "Employment Type is required",
                        },
                      ]}
                    />
                  </Col>
                  <Col md={12} sm={24}>
                    <PSelect
                      mode="multiple"
                      allowClear
                      options={HRPositionDDL?.data || []}
                      name="hrPositionListDTO"
                      label="HR Position"
                      placeholder="HR Position"
                      onChange={(value, op) => {
                        form.setFieldsValue({
                          hrPositionListDTO: op,
                        });
                        const temp = form.getFieldsValue();
                        isPolicyExist(
                          {
                            ...temp,
                            hrPositionListDTO: op,
                          },
                          allPolicies,
                          setExistingPolicies
                        );
                      }}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "  HR Position is required",
                      //   },
                      // ]}
                    />
                  </Col>
                  <Col md={12} sm={24}>
                    <PSelect
                      mode="multiple"
                      allowClear
                      options={[
                        { value: 1, label: "Male" },
                        { value: 2, label: "Female" },
                      ]}
                      name="intGender"
                      label="Gender"
                      placeholder="Gender"
                      onChange={(value, op) => {
                        form.setFieldsValue({
                          intGender: op,
                        });
                        const temp = form.getFieldsValue();
                        isPolicyExist(
                          {
                            ...temp,
                            intGender: op,
                          },
                          allPolicies,
                          setExistingPolicies
                        );
                      }}
                      rules={[
                        {
                          required: true,
                          message: "Gender is required",
                        },
                      ]}
                    />
                  </Col>

                  <Col md={12} sm={24}>
                    <PSelect
                      options={yearDDLAction()}
                      name="intYear"
                      label="Year"
                      placeholder="Year"
                      onChange={(value, op) => {
                        form.setFieldsValue({
                          intYear: op,
                        });

                        const temp = form.getFieldsValue();
                        isPolicyExist(
                          {
                            ...temp,
                            intYear: op,
                          },
                          allPolicies,
                          setExistingPolicies
                        );
                      }}
                      rules={[
                        {
                          required: true,
                          message: "Year is required",
                        },
                      ]}
                    />
                  </Col>

                  <Col md={12} sm={24}>
                    <PInput
                      type="number"
                      name="intActiveFromJoiningdayInDay"
                      label="Active From Joining day In Day"
                      placeholder="Active From Joining day In Day"
                      rules={[
                        // {
                        //   required: true,
                        //   message: "Active From Joining day In Day is required",
                        // },
                        {
                          message:
                            "Active From Joining day In Day must be positive",
                          pattern: new RegExp(/^[+]?([.]\d+|\d+([.]\d+)?)$/),
                        },
                      ]}
                    />
                  </Col>
                  <Col md={12} sm={24}>
                    <PInput
                      type="number"
                      name="intActiveFromConfirmationInDay"
                      label="Active From Confirmation In Day"
                      placeholder="Active From Confirmation In Day"
                      rules={[
                        // {
                        //   required: true,
                        //   message:
                        //     "Active From Confirmation In Day is required",
                        // },
                        {
                          message:
                            "Active From Confirmation In Day must be positive",
                          pattern: new RegExp(/^[+]?([.]\d+|\d+([.]\d+)?)$/),
                        },
                      ]}
                    />
                  </Col>

                  <Form.Item shouldUpdate noStyle>
                    {() => {
                      const {
                        intLeaveType,
                        isDependOnServiceLength,
                        intLveInDay,
                        intEndServiceLengthInYear,
                        intStartServiceLengthInYear,
                      } = form.getFieldsValue();

                      // const empType = employeeType?.label;

                      return (
                        <>
                          <Col md={12} sm={24}>
                            <PInput
                              label="Depends on Service Length"
                              type="checkbox"
                              layout="horizontal"
                              name="isDependOnServiceLength"
                              disabled={
                                intLeaveType?.label ===
                                  "Earn Leave/Annual Leave" ||
                                intLeaveType?.label === "Compensatory Leave"
                              }
                              onChange={(e) => {
                                setTableData([]);
                                if (e.target.checked) {
                                  form.setFieldsValue({
                                    intAllocatedLveInDay: undefined,
                                  });
                                } else {
                                  form.setFieldsValue({
                                    intLveInDay: undefined,
                                    intEndServiceLengthInYear: undefined,
                                    intStartServiceLengthInYear: undefined,
                                  });
                                }
                              }}
                            />
                          </Col>
                          <Col md={12} sm={24}>
                            <PSelect
                              options={[
                                { value: 0, label: "0" },
                                { value: 1, label: "1" },
                                { value: 2, label: "2" },
                                { value: 3, label: "3" },
                                { value: 4, label: "4" },
                                { value: 5, label: "5" },
                                { value: 6, label: "6" },
                                { value: 7, label: "7" },
                                { value: 8, label: "8" },
                                { value: 9, label: "9" },
                                { value: 10, label: "10" },
                                { value: 11, label: "11" },
                                { value: 12, label: "12" },
                                { value: 13, label: "13" },
                                { value: 14, label: "14" },
                                { value: 15, label: "15" },
                                { value: 16, label: "16" },
                                { value: 17, label: "17" },
                                { value: 18, label: "18" },
                                { value: 19, label: "19" },
                                { value: 20, label: "20" },
                              ]}
                              name="intStartServiceLengthInYear"
                              label=" Starting Service Length In Years"
                              disabled={!isDependOnServiceLength}
                              placeholder="Starting Service Length In Years"
                              onChange={(value, op) => {
                                form.setFieldsValue({
                                  intStartServiceLengthInYear: op,
                                });
                              }}
                            />
                          </Col>
                          <Col md={12} sm={24}>
                            <PSelect
                              options={[
                                { value: 100, label: "Above" },
                                { value: 1, label: "1" },
                                { value: 2, label: "2" },
                                { value: 3, label: "3" },
                                { value: 4, label: "4" },
                                { value: 5, label: "5" },
                                { value: 6, label: "6" },
                                { value: 7, label: "7" },
                                { value: 8, label: "8" },
                                { value: 9, label: "9" },
                                { value: 10, label: "10" },
                                { value: 11, label: "11" },
                                { value: 12, label: "12" },
                                { value: 13, label: "13" },
                                { value: 14, label: "14" },
                                { value: 15, label: "15" },
                                { value: 16, label: "16" },
                                { value: 17, label: "17" },
                                { value: 18, label: "18" },
                                { value: 19, label: "19" },
                                { value: 20, label: "20" },
                              ]}
                              name="intEndServiceLengthInYear"
                              label="End Service Length in Years"
                              disabled={!isDependOnServiceLength}
                              placeholder="End Service Length in Years"
                              onChange={(value, op) => {
                                form.setFieldsValue({
                                  intEndServiceLengthInYear: op,
                                });
                              }}
                            />
                          </Col>
                          <Col md={10} sm={22}>
                            <PInput
                              disabled={!isDependOnServiceLength}
                              type="number"
                              name="intLveInDay"
                              label="Leave Days"
                              placeholder="Leave Days"
                              size="small"
                              rules={[
                                {
                                  message: "Leave Days must be positive",
                                  pattern: new RegExp(
                                    /^[+]?([.]\d+|\d+([.]\d+)?)$/
                                  ),
                                },
                              ]}
                            />
                          </Col>
                          <Col span={2} className="mt-1">
                            <button
                              type="button"
                              className="mt-4  btn add-ddl-btn "
                              style={{
                                margin: "0.4em 0 0 0.7em",
                                padding: "0.2em",
                              }}
                              onClick={() => {
                                if (
                                  intEndServiceLengthInYear === undefined ||
                                  intLveInDay === undefined ||
                                  intStartServiceLengthInYear === undefined
                                ) {
                                  return toast.warn(
                                    "Please fill up the fields"
                                  );
                                }
                                setTableData((prev: any) => [
                                  ...prev,
                                  {
                                    intStartServiceLengthInYear:
                                      intStartServiceLengthInYear,
                                    intEndServiceLengthInYear:
                                      intEndServiceLengthInYear,
                                    intLveInDay: intLveInDay,
                                  },
                                ]);
                                form.setFieldsValue({
                                  intLveInDay: undefined,
                                  intEndServiceLengthInYear: undefined,
                                  intStartServiceLengthInYear: undefined,
                                });
                              }}
                            >
                              <AddOutlined sx={{ fontSize: "16px" }} />
                            </button>
                          </Col>
                        </>
                      );
                    }}
                  </Form.Item>
                  <Col md={12} sm={24}>
                    {tableData?.length > 0 && (
                      <div
                        className="table-card-body pt-3 "
                        style={{ marginLeft: "-1em" }}
                      >
                        <div
                          className=" table-card-styled tableOne"
                          style={{ padding: "0px 12px" }}
                        >
                          <table className="table align-middle">
                            <thead style={{ color: "#212529" }}>
                              <tr>
                                <th>
                                  <div className="d-flex align-items-center">
                                    Service Duration
                                  </div>
                                </th>
                                <th>
                                  <div className="d-flex align-items-center">
                                    Leave in Days
                                  </div>
                                </th>
                                <th>
                                  <div className="d-flex align-items-center justify-content-end">
                                    Action
                                  </div>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {tableData?.length > 0 && (
                                <>
                                  {tableData.map((item: any, index: number) => {
                                    return (
                                      <tr key={index}>
                                        <td>
                                          {item?.intStartServiceLengthInYear
                                            ?.label ===
                                          item?.intEndServiceLengthInYear?.label
                                            ? `${item?.intEndServiceLengthInYear?.label}
                                              years`
                                            : item?.intStartServiceLengthInYear
                                                ?.label +
                                              " - " +
                                              `${item?.intEndServiceLengthInYear?.label}` +
                                              " years "}
                                        </td>
                                        <td>{item?.intLveInDay}</td>
                                        <td>
                                          <div className="d-flex align-items-end justify-content-end">
                                            <IconButton
                                              type="button"
                                              style={{
                                                height: "25px",
                                                width: "25px",
                                              }}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                remover(index);
                                                // deleteRow(item?.intWorkplaceId);
                                              }}
                                            >
                                              <Tooltip title="Delete">
                                                <DeleteOutline
                                                  sx={{
                                                    height: "25px",
                                                    width: "25px",
                                                  }}
                                                />
                                              </Tooltip>
                                            </IconButton>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </Col>
                  {/* Compensatory Leave Configuration  */}

                  <>
                    <Form.Item shouldUpdate noStyle>
                      {() => {
                        const { intLeaveType, isConpensatoryLveExpire } =
                          form.getFieldsValue();

                        // const empType = employeeType?.label;

                        return intLeaveType?.label === "Compensatory Leave" ? (
                          <>
                            <Divider
                              style={{
                                marginBlock: "4px",
                                marginTop: "6px",
                                fontSize: "14px",
                                fontWeight: 600,
                              }}
                              orientation="left"
                            >
                              Compensatory Leave Configuration
                            </Divider>
                            <Col md={12} sm={24}>
                              <PInput
                                label="Compensatory Leave Expire"
                                type="checkbox"
                                layout="horizontal"
                                name="isConpensatoryLveExpire"
                              />
                            </Col>
                            <Col md={12} sm={24}>
                              <PInput
                                disabled={!isConpensatoryLveExpire}
                                type="number"
                                name="intConpensatoryLveExpireInDays"
                                label="Conpensatory Leave Expire In Days"
                                placeholder="Conpensatory Leave Expire In Days"
                                size="small"
                                rules={[
                                  {
                                    required: isConpensatoryLveExpire,
                                    message:
                                      "Conpensatory Leave Expire In Days is required",
                                  },
                                  {
                                    message:
                                      "Conpensatory Leave Expire In Days must be positive",
                                    pattern: new RegExp(
                                      /^[+]?([.]\d+|\d+([.]\d+)?)$/
                                    ),
                                  },
                                ]}
                              />
                            </Col>
                          </>
                        ) : null;
                      }}
                    </Form.Item>
                  </>
                  {/* Earn Leave Configuration  */}

                  <>
                    <Form.Item shouldUpdate noStyle>
                      {() => {
                        const { intLeaveType, isConpensatoryLveExpire } =
                          form.getFieldsValue();

                        // const empType = employeeType?.label;

                        return intLeaveType?.label ===
                          "Earn Leave/Annual Leave" ? (
                          <>
                            <>
                              <div
                                className="col-12 mt-3"
                                style={{ marginLeft: "-0.8em" }}
                              >
                                <h2>Earn Leave Configuration</h2>
                              </div>
                              <div
                                className="col-12"
                                style={{ marginBottom: "12px" }}
                              ></div>
                            </>
                            <Col md={12} sm={24}>
                              <PInput
                                label="Earn Leave Include Offday"
                                type="checkbox"
                                layout="horizontal"
                                name="isEarnLveIncludeOffday"
                              />
                            </Col>
                            <Col md={12} sm={24}>
                              <PInput
                                label="Earn Leave Include Holiday"
                                type="checkbox"
                                layout="horizontal"
                                name="isEarnLveIncludeHoliday"
                              />
                            </Col>
                            <Col md={12} sm={24}>
                              <PInput
                                label="Earn Leave Include Absent"
                                type="checkbox"
                                layout="horizontal"
                                name="isEarnLveIncludeAbsent"
                              />
                            </Col>
                            <Col md={12} sm={24}>
                              <PInput
                                label="Earn Leave Include Movement"
                                type="checkbox"
                                layout="horizontal"
                                name="isEarnLveIncludeLeaveMovement"
                              />
                            </Col>
                            <Col md={24} sm={24}>
                              <PInput
                                label="Earn Leave Count From Confirmation Date"
                                type="checkbox"
                                layout="horizontal"
                                name="isEarnLveCountFromConfirmationDate"
                              />
                            </Col>
                            <Col md={12} sm={24}>
                              <PInput
                                type="number"
                                name="intDayForOneEarnLve"
                                label="Day For One Earn Leave"
                                placeholder="Day For One Earn Leave"
                                size="small"
                                rules={[
                                  {
                                    message:
                                      "Day For One Earn Leave must be positive",
                                    pattern: new RegExp(
                                      /^[+]?([.]\d+|\d+([.]\d+)?)$/
                                    ),
                                  },
                                ]}
                              />
                            </Col>
                            <Col md={12} sm={24}>
                              <PInput
                                type="number"
                                name="intEarnLveInDay"
                                label=" Earn Leave In Day"
                                placeholder=" Earn Leave In Day"
                                size="small"
                                rules={[
                                  {
                                    message:
                                      "Earn Leave In Day must be positive",
                                    pattern: new RegExp(
                                      /^[+]?([.]\d+|\d+([.]\d+)?)$/
                                    ),
                                  },
                                ]}
                              />
                            </Col>
                          </>
                        ) : null;
                      }}
                    </Form.Item>
                  </>

                  {/* Half Leave Configuration  */}

                  <>
                    <Form.Item shouldUpdate noStyle>
                      {() => {
                        const {
                          intLeaveType,
                          isHalfDayLeave,
                          intLveInDay,
                          intEndServiceLengthInYear,
                          intStartServiceLengthInYear,
                        } = form.getFieldsValue();

                        // const empType = employeeType?.label;

                        return (
                          <>
                            <Divider
                              style={{
                                marginBlock: "4px",
                                marginTop: "6px",
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
                                <PInput
                                  type="checkbox"
                                  layout="horizontal"
                                  name="isHalfDayLeave"
                                  onChange={() => {
                                    form.setFieldsValue({
                                      intHalfdayMaxInMonth: undefined,
                                      intHalfdayMaxInYear: undefined,
                                    });
                                  }}
                                />
                                <span>Half Day Leave</span>
                              </div>
                            </Divider>
                            {/* <Col md={12} sm={24}>
                              <PInput
                                label="Half Day Leave"
                                type="checkbox"
                                layout="horizontal"
                                name="isHalfDayLeave"
                                onChange={() => {
                                  form.setFieldsValue({
                                    intHalfdayMaxInMonth: undefined,
                                    intHalfdayMaxInYear: undefined,
                                  });
                                }}
                              />
                            </Col> */}
                            <Col md={12} sm={24}>
                              <PInput
                                disabled={!isHalfDayLeave}
                                type="number"
                                name="intHalfdayMaxInMonth"
                                label="Max Half Day Availability in Month"
                                placeholder="Max Half Day Availability in Month"
                                size="small"
                                rules={[
                                  {
                                    message:
                                      "Max Half Day Availability in Month must be positive",
                                    pattern: new RegExp(
                                      /^[+]?([.]\d+|\d+([.]\d+)?)$/
                                    ),
                                  },
                                ]}
                              />
                            </Col>
                            <Col md={12} sm={24}>
                              <PInput
                                disabled={!isHalfDayLeave}
                                type="number"
                                name="intHalfdayMaxInYear"
                                label=" Max Half Day Availability in Year"
                                placeholder=" Max Half Day Availability in Year"
                                size="small"
                                rules={[
                                  {
                                    message:
                                      "Max Half Day Availability in Year must be positive",
                                    pattern: new RegExp(
                                      /^[+]?([.]\d+|\d+([.]\d+)?)$/
                                    ),
                                  },
                                ]}
                              />
                            </Col>
                            <Col md={12} sm={24}>
                              <PSelect
                                options={[
                                  { value: 0, label: "None" },
                                  ...leaveTypeDDL,
                                ]}
                                name="intHalfdayPreviousLveTypeEnd"
                                label="Previous Half Day Leave Type Availability After End"
                                placeholder="Previous Half Day Leave Type Availability After End"
                                disabled={!isHalfDayLeave}
                                onChange={(value, op) => {
                                  form.setFieldsValue({
                                    intHalfdayPreviousLveTypeEnd: op,
                                  });
                                }}
                              />
                            </Col>
                          </>
                        );
                      }}
                    </Form.Item>
                  </>
                  {/* Carry Forward Configuration  */}
                  <>
                    <Divider
                      style={{
                        marginBlock: "4px",
                        marginTop: "6px",
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
                        <PInput
                          type="checkbox"
                          layout="horizontal"
                          name="isCarryForward"
                          onChange={() => {
                            form.setFieldsValue({
                              intCarryForwardMaxInDay: undefined,
                              intCarryForwarExpiryDay: undefined,
                              intCarryForwarExpiryMonth: undefined,
                            });
                          }}
                        />
                        <span>Is Carry Forward?</span>
                      </div>
                    </Divider>
                    <Form.Item shouldUpdate noStyle>
                      {() => {
                        const { isCarryForward } = form.getFieldsValue();
                        return (
                          <>
                            <Col md={12} sm={24}>
                              <PInput
                                disabled={!isCarryForward}
                                type="number"
                                name="intCarryForwardMaxInDay"
                                label="Max Carry Forward In Year"
                                placeholder="Max Carry Forward In Year"
                                size="small"
                                rules={[
                                  {
                                    message:
                                      "Max Carry Forward In Year must be positive",
                                    pattern: new RegExp(
                                      /^[+]?([.]\d+|\d+([.]\d+)?)$/
                                    ),
                                  },
                                ]}
                              />
                            </Col>
                            <Col md={12} sm={24}>
                              <PInput
                                disabled={!isCarryForward}
                                type="number"
                                name="intCarryForwarExpiryDay"
                                label=" Carry Forward Expiry Day"
                                placeholder=" Carry Forward Expiry Day"
                                size="small"
                                rules={[
                                  {
                                    required: false,
                                    message:
                                      "Carry Forward Expiry Day must be positive",
                                    pattern: new RegExp(
                                      /^[+]?([.]\d+|\d+([.]\d+)?)$/
                                    ),
                                  },
                                  {
                                    type: "number",
                                    min: 1, // Minimum value allowed
                                    max: 31, // Maximum value allowed
                                    message:
                                      "Carry Forward Expiry Day must be between 1 and 31",
                                  },
                                ]}
                              />
                            </Col>
                            <Col md={12} sm={24}>
                              <PInput
                                disabled={!isCarryForward}
                                type="number"
                                name="intCarryForwarExpiryMonth"
                                label="Expiry Month Of Carry Forward"
                                placeholder="Expiry Month Of Carry Forward"
                                size="small"
                                rules={[
                                  {
                                    required: false,
                                    message:
                                      "Expiry Month Of Carry Forward must be positive",
                                    pattern: new RegExp(
                                      /^[+]?([.]\d+|\d+([.]\d+)?)$/
                                    ),
                                  },
                                  {
                                    type: "number",
                                    min: 1, // Minimum value allowed
                                    max: 12, // Maximum value allowed
                                    message:
                                      "Expiry Month Of Carry Forward must be between 1 and 12",
                                  },
                                ]}
                              />
                            </Col>
                          </>
                        );
                      }}
                    </Form.Item>
                  </>
                  {/*Encashable  Configuration  */}

                  <>
                    <Divider
                      style={{
                        marginBlock: "4px",
                        marginTop: "6px",
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
                        <PInput
                          type="checkbox"
                          layout="horizontal"
                          name="isEncashable"
                          onChange={() => {
                            form.setFieldsValue({
                              IntMaxEncashableLveInDay: undefined,
                            });
                          }}
                        />
                        <span>Is Encashable?</span>
                      </div>
                    </Divider>
                    <Form.Item shouldUpdate noStyle>
                      {() => {
                        const { isEncashable } = form.getFieldsValue();

                        return (
                          <>
                            {/* <Col md={12} sm={24}>
                              <PInput
                                label="Encashable"
                                type="checkbox"
                                layout="horizontal"
                                name="isEncashable"
                                onChange={() => {
                                  form.setFieldsValue({
                                    IntMaxEncashableLveInDay: undefined,
                                  });
                                }}
                              />
                            </Col> */}
                            <Col md={12} sm={24}>
                              <PInput
                                disabled={!isEncashable}
                                type="number"
                                name="IntMaxEncashableLveInDay"
                                label="Max Encashable (In Days)"
                                placeholder="Max Encashable (In Days)"
                                size="small"
                                rules={[
                                  {
                                    message:
                                      "Max Encashable (In Days) must be positive",
                                    pattern: new RegExp(
                                      /^[+]?([.]\d+|\d+([.]\d+)?)$/
                                    ),
                                  },
                                ]}
                              />
                            </Col>
                            <Col md={12} sm={24}>
                              <PInput
                                disabled={!isEncashable}
                                type="number"
                                name="intEncashableMonth"
                                label=" Encashable Month"
                                placeholder=" Encashable Month"
                                size="small"
                                rules={[
                                  {
                                    message:
                                      "Encashable Month must be positive",
                                    pattern: new RegExp(
                                      /^[+]?([.]\d+|\d+([.]\d+)?)$/
                                    ),
                                  },
                                ]}
                              />
                            </Col>
                          </>
                        );
                      }}
                    </Form.Item>
                  </>
                  {/*other  Configuration  */}

                  <>
                    <Divider
                      style={{
                        marginBlock: "4px",
                        marginTop: "6px",
                        fontSize: "14px",
                        fontWeight: 600,
                      }}
                      orientation="left"
                    >
                      Other Configuration
                    </Divider>
                    <Form.Item shouldUpdate noStyle>
                      {() => {
                        const {
                          isMonthWiseExpired,
                          isAdvanceLeave,
                          intLeaveType,
                        } = form.getFieldsValue();

                        // const empType = employeeType?.label;

                        return (
                          <>
                            <Col md={12} sm={24}>
                              <PInput
                                label="Is Month Wise Expired?"
                                type="checkbox"
                                layout="horizontal"
                                name="isMonthWiseExpired"
                                onChange={() => {
                                  form.setFieldsValue({
                                    howMuchMonth: undefined,
                                  });
                                }}
                              />
                            </Col>
                            <Col md={12} sm={24}>
                              <PInput
                                disabled={!isMonthWiseExpired}
                                type="number"
                                name="howMuchMonth"
                                label=" Month Wise Expired (In Month)"
                                placeholder=" Month Wise Expired (In Month)"
                                size="small"
                                rules={[
                                  {
                                    message:
                                      "Month Wise Expired (In Month) must be positive",
                                    pattern: new RegExp(
                                      /^[+]?([.]\d+|\d+([.]\d+)?)$/
                                    ),
                                  },
                                ]}
                              />
                            </Col>
                            <Col md={12} sm={24}>
                              <PInput
                                label="Max Advance Leave in Year"
                                type="checkbox"
                                layout="horizontal"
                                name="isAdvanceLeave"
                                onChange={() => {
                                  form.setFieldsValue({
                                    intMaxForAdvLveInYear: undefined,
                                  });
                                }}
                              />
                            </Col>
                            <Col md={12} sm={24}>
                              <PInput
                                disabled={!isAdvanceLeave}
                                type="number"
                                name="intMaxForAdvLveInYear"
                                label="Max Advance Leave in Year"
                                placeholder="Max Advance Leave in Year"
                                size="small"
                                rules={[
                                  {
                                    message:
                                      "Max Advance Leave must be positive",
                                    pattern: new RegExp(
                                      /^[+]?([.]\d+|\d+([.]\d+)?)$/
                                    ),
                                  },
                                ]}
                              />
                            </Col>
                            <Col md={12} sm={24}>
                              <PInput
                                label="Is Minute Based? "
                                type="checkbox"
                                layout="horizontal"
                                name="isMinuteBased"
                              />
                            </Col>
                            <Col md={12} sm={24}>
                              <PInput
                                label="Bridge Leave Include Offday"
                                type="checkbox"
                                layout="horizontal"
                                name="isIncludeOffday"
                              />
                            </Col>
                            <Col md={12} sm={24}>
                              <PInput
                                label="Bridge Leave Include Holiday"
                                type="checkbox"
                                layout="horizontal"
                                name="isIncludeHoliday"
                              />
                            </Col>
                            <Col md={12} sm={24}>
                              <PInput
                                label="Balance Show From ESS"
                                type="checkbox"
                                layout="horizontal"
                                name="isLveBalanceShowForSelfService"
                              />
                            </Col>
                            <Col md={12} sm={24}>
                              <PInput
                                label="Leave Apply From ESS"
                                type="checkbox"
                                layout="horizontal"
                                name="isLveBalanceApplyForSelfService"
                              />
                            </Col>
                            <Col md={12} sm={24}>
                              <PInput
                                label="Applicable Before And After Offday"
                                type="checkbox"
                                layout="horizontal"
                                name="isApplicableBeforeAndAfterOffday"
                              />
                            </Col>
                            <Col md={12} sm={24}>
                              <PInput
                                label="Applicable Before And After Holiday"
                                type="checkbox"
                                layout="horizontal"
                                name="isApplicableBeforeAndAfterHoliday"
                              />
                            </Col>
                            <Col md={12} sm={24}>
                              <PInput
                                label="Is Auto Renewable?"
                                type="checkbox"
                                layout="horizontal"
                                name="isAutoRenewable"
                              />
                            </Col>
                            <Col md={12} sm={24}>
                              <PInput
                                label="Is Prodata Basis?"
                                type="checkbox"
                                layout="horizontal"
                                name="isProdataBasis"
                                disabled={
                                  intLeaveType?.label ===
                                    "Earn Leave/Annual Leave" ||
                                  intLeaveType?.label === "Compensatory Leave"
                                }
                              />
                            </Col>
                            <Col md={12} sm={24}>
                              {/* <PInput
                                label="Do you want assign right now?"
                                type="checkbox"
                                layout="horizontal"
                                name="isGenerate"
                              /> */}
                              <div
                                style={{
                                  marginBlock: "4px",
                                  marginTop: "6px",
                                  fontSize: "12px",
                                  fontWeight: 700,
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "5px",
                                  }}
                                >
                                  <PInput
                                    label=""
                                    type="checkbox"
                                    layout="horizontal"
                                    name="isGenerate"
                                  />
                                  <span>Do you want assign right now?</span>
                                </div>
                              </div>
                            </Col>
                          </>
                        );
                      }}
                    </Form.Item>
                  </>
                </Row>
              </Col>
              <Col span={12}>
                <Form.Item shouldUpdate noStyle>
                  {() => {
                    const { intWorkplaceList } = form.getFieldsValue();

                    // const empType = employeeType?.label;

                    return existingPolicies?.length > 0 ? (
                      <Alert
                        icon={<InfoOutlinedIcon fontSize="inherit" />}
                        severity="warning"
                        style={{
                          width: "27rem",
                          position: "sticky",
                          top: "1px",
                        }}
                      >
                        <div>
                          <div className="mb-3">
                            <h2>Exisitng Policies</h2>
                          </div>
                          {/* <Divider orientation="left">Small Size</Divider> */}
                          <List
                            size="small"
                            style={{ width: "20rem" }}
                            // header={<div>Header</div>}
                            // footer={<div>Footer</div>}
                            bordered
                            dataSource={existingPolicies}
                            renderItem={(item: any, index: number) => (
                              <List.Item key={index} className="d-flex ">
                                <p>{item?.strPolicyName}</p>
                                <IconButton
                                  type="button"
                                  style={{
                                    height: "25px",
                                    width: "25px",
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();

                                    const filterArr = existingPolicies.filter(
                                      (itm: any, idx: number) => idx !== index
                                    );
                                    setExistingPolicies(filterArr);
                                    const temp = intWorkplaceList?.filter(
                                      (item: any) =>
                                        item?.value !==
                                        existingPolicies[index]?.intWorkplace
                                    );
                                    // requirement from habiba apu🔥🔥🔥
                                    // form.setFieldsValue({
                                    //   intWorkplaceList: temp,
                                    // });
                                    // deleteRow(item?.intWorkplaceId);
                                  }}
                                >
                                  <Tooltip title="Delete">
                                    <DeleteOutline
                                      sx={{
                                        height: "20px",
                                        width: "20px",
                                      }}
                                    />
                                  </Tooltip>
                                </IconButton>
                              </List.Item>
                            )}
                          />
                        </div>
                      </Alert>
                    ) : undefined;
                  }}
                </Form.Item>
              </Col>
            </Row>
          </PCardBody>
        </PCard>
      </PForm>
    </>
  );
};

export default CreateEditLeavePolicy;
