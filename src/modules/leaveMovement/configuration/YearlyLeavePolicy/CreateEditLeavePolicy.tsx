import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { yearDDLAction } from "../../../../utility/yearDDL";
import { DeleteOutline } from "@mui/icons-material";
import { AddOutlined } from "@mui/icons-material";

import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  commonDDL,
  dependsOnDDL,
  getYearlyPolicyById,
  getYearlyPolicyPopUpDDL,
  isPolicyExist,
} from "./helper";
import { getPeopleDeskAllDDL } from "../../../../common/api";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { IconButton, Tooltip, Alert } from "@mui/material";
import { toast } from "react-toastify";
import { Col, Form, List, Row, Divider } from "antd";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { useApiRequest } from "../../../../Hooks";
import { useHistory, useParams } from "react-router-dom";
import {
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PInput,
  PSelect,
} from "Components";
import { generatePayload } from "./Utils";
import Loading from "common/loading/Loading";

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
      // `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=BusinessUnit&BusinessUnitId=${buId}&WorkplaceGroupId=0&intId=${employeeId}`,
      `/PeopleDeskDdl/BusinessUnitWithRoleExtension?accountId=${orgId}&businessUnitId=${buId}&workplaceGroupId=${wgId}&empId=${employeeId}`,
      "intBusinessUnitId",
      "strBusinessUnit",
      setBuDDL
    );
    getPeopleDeskAllDDL(
      // `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&AccountId=${orgId}&BusinessUnitId=${0}&WorkplaceGroupId=${0}&intId=${employeeId}`,
      `/PeopleDeskDdl/WorkplaceWithRoleExtension?accountId=${orgId}&businessUnitId=${buId}&workplaceGroupId=${wgId}&empId=${employeeId}`,
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
    const values = form.getFieldsValue(true);
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
        } else {
          history.push("/administration/leaveandmovement/yearlyLeavePolicy");
        }
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Something went wrong",
          {
            toastId: "savePolicyError",
          }
        );
      },
    });
  };

  return (
    <>
      {loading && <Loading />}
      <PForm
        form={form}
        onFinish={submitHandler}
        initialValues={{
          showLveIndays: dependsOnDDL[0],
          intLeaveDependOn: dependsOnDDL[0],
          isProdataBasis: commonDDL[1]?.value,
          isHalfDayLeave: commonDDL[0]?.value,
          isCarryForward: commonDDL[0]?.value,
          isEncashable: commonDDL[0]?.value,
          isApplicableBeforeAndAfterOffday: commonDDL[0]?.value,
          isApplicableBeforeAndAfterHoliday: commonDDL[0]?.value,
          isMinuteBased: commonDDL[0]?.value,
          isAutoRenewable: commonDDL[0]?.value,
          isLveBalanceApplyForSelfService: commonDDL[1]?.value,
          isLveBalanceShowForSelfService: commonDDL[1]?.value,
          isIncludeHoliday: commonDDL[1]?.value,
          isIncludeOffday: commonDDL[1]?.value,
        }}
      >
        <PCard>
          <PCardHeader
            backButton
            title={params?.id ? "Edit Leave Policy" : "Create Leave Policy"}
            submitText="Save"
            submitType="primary-outline"
            buttonList={[
              {
                type: "primary",
                content: "Save & Assign",
                onClick: () => {
                  form.setFieldsValue({
                    isGenerate: true,
                  });
                  form
                    .validateFields()
                    .then(() => {
                      submitHandler();
                    })
                    .catch(() => {
                      console.log();
                    });
                },
              },
            ]}
          />
          <PCardBody>
            <Row gutter={[30, 2]}>
              <Col
                span={12}
                style={{ borderRight: "1px solid rgb(239, 239, 239)" }}
              >
                <Row gutter={[10, 2]}>
                  {/* leave config */}
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
                      <span>General Configuration</span>
                    </div>
                  </Divider>
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
                        label="Display Name"
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
                            intLwpamountOrPercentage: undefined,
                            intLwpbasedOn: undefined,
                            isCarryWillBeCounted: undefined,
                            isCompensatoryLve: false,
                            intLeaveType: op,
                            isEarnLveIncludeOffday: false,
                            isEarnLveIncludeHoliday: false,
                            intDayForOneEarnLve: undefined,
                            intEarnLveInDay: undefined,
                            intLeaveDependOn: undefined,
                            intCompensatoryLveExpireInDays: undefined,
                            isCompensatoryLveExpire: false,
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
                        label="Availability After End"
                        placeholder="Leave Type"
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
                        const { intLeaveType } = form.getFieldsValue();
                        // const empType = employeeType?.label;

                        return (
                          <>
                            <Col md={12} sm={24}>
                              <PSelect
                                options={
                                  [4, 5].includes(intLeaveType?.value)
                                    ? [
                                        ...dependsOnDDL,
                                        { value: 3, label: "Calculation" },
                                      ]
                                    : dependsOnDDL
                                }
                                name="intLeaveDependOn"
                                label="Depeneds on"
                                placeholder="Depeneds on"
                                onChange={(value, op) => {
                                  if (value == 2) {
                                    form.setFieldsValue({
                                      isDependOnServiceLength: true,
                                      intLeaveDependOn: op,
                                      intLveInDay: undefined,
                                      intEndServiceLengthInYear: undefined,
                                      intStartServiceLengthInYear: undefined,
                                      showLveIndays: dependsOnDDL[0],
                                      isProdataBasis: false,
                                    });
                                  } else {
                                    setTableData([]);
                                    form.setFieldsValue({
                                      intLeaveDependOn: op,
                                      isDependOnServiceLength: false,
                                      showLveIndays: undefined,
                                    });
                                  }
                                }}
                                rules={[
                                  {
                                    required: true,
                                    message: "Leave Depend On is required",
                                  },
                                ]}
                              />
                            </Col>
                          </>
                        );
                      }}
                    </Form.Item>

                    <Form.Item shouldUpdate noStyle>
                      {() => {
                        const {
                          showLveIndays,
                          intLeaveDependOn,
                          isDependOnServiceLength,
                          intStartServiceLengthInYear,
                          intLveInDay,
                          intEndServiceLengthInYear,
                          intLeaveType,
                        } = form.getFieldsValue(true);
                        // const empType = employeeType?.label;

                        return intLeaveDependOn?.value === 2 ? (
                          <>
                            <Col md={12}></Col>
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
                            <Col
                              md={
                                showLveIndays?.value === 3 || !showLveIndays
                                  ? 10
                                  : 12
                              }
                              sm={24}
                            >
                              <PSelect
                                options={
                                  [4, 5].includes(intLeaveType?.value)
                                    ? [
                                        { value: 1, label: "Standard" },

                                        { value: 3, label: "Calculation" },
                                      ]
                                    : [{ value: 1, label: "Standard" }]
                                }
                                name="showLveIndays"
                                label="Depened on"
                                placeholder="Depened on"
                                onChange={(value, op) => {
                                  if (value == 3) {
                                    form.setFieldsValue({
                                      showLveIndays: op,
                                      intLveInDay: 0,
                                    });
                                  } else {
                                    form.setFieldsValue({
                                      showLveIndays: op,
                                      intLveInDay: undefined,
                                    });
                                  }
                                }}
                                // rules={[
                                //   {
                                //     required: false,
                                //     message: "Leave Type is required",
                                //   },
                                // ]}
                              />
                            </Col>
                            {showLveIndays?.value === 1 && (
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
                            )}
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
                                      showLveIndays: showLveIndays,
                                    },
                                  ]);
                                  form.setFieldsValue({
                                    intLveInDay: undefined,
                                    intEndServiceLengthInYear: undefined,
                                    intStartServiceLengthInYear: undefined,
                                    showLveIndays: undefined,
                                  });
                                }}
                              >
                                <AddOutlined sx={{ fontSize: "16px" }} />
                              </button>
                            </Col>
                          </>
                        ) : (
                          intLeaveDependOn?.value === 1 && (
                            <>
                              <Col md={12} sm={24}>
                                <PInput
                                  type="number"
                                  min={0}
                                  name="intAllocatedLveInDay"
                                  label="Allocated Leave(Day)"
                                  placeholder="Allocated Leave(Day)"
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
                                        " Allocated Leave(Day) is required",
                                    },
                                    {
                                      message:
                                        "Allocated Leave(Day) must be positive",
                                      pattern: new RegExp(
                                        /^[+]?([.]\d+|\d+([.]\d+)?)$/
                                      ),
                                    },
                                  ]}
                                  disabled={
                                    // isDependOnServiceLength ||
                                    (intLeaveType?.value === 4 ||
                                      intLeaveType?.value === 5) &&
                                    intLeaveDependOn?.value === 3
                                  }
                                />
                              </Col>
                            </>
                          )
                        );
                      }}
                    </Form.Item>
                    <Col md={15} sm={24}>
                      {tableData?.length > 0 && (
                        <div
                          className="table-card-body pt-3 "
                          style={{ marginLeft: "-.8em" }}
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
                                    <div className="d-flex align-items-center">
                                      Depends on
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
                                    {tableData.map(
                                      (item: any, index: number) => {
                                        return (
                                          <tr key={index}>
                                            <td>
                                              {item?.intStartServiceLengthInYear
                                                ?.label ===
                                              item?.intEndServiceLengthInYear
                                                ?.label
                                                ? `${item?.intEndServiceLengthInYear?.label}
                                              years`
                                                : item
                                                    ?.intStartServiceLengthInYear
                                                    ?.label +
                                                  " - " +
                                                  `${item?.intEndServiceLengthInYear?.label}` +
                                                  " years "}
                                            </td>
                                            <td>{item?.intLveInDay}</td>
                                            <td>
                                              {item?.showLveIndays?.label}
                                            </td>
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
                                      }
                                    )}
                                  </>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </Col>
                    <Col md={12} sm={24}>
                      <PInput
                        type="number"
                        name="intMaxLveDaySelf"
                        label="Max  Available from Self"
                        placeholder="Max  Available from Self"
                        rules={[
                          {
                            message: "Max  Available must be positive",
                            pattern: new RegExp(/^[+]?([.]\d+|\d+([.]\d+)?)$/),
                          },
                        ]}
                      />
                    </Col>
                    <Col md={12} sm={24}>
                      <PInput
                        type="number"
                        name="intMaxLveApplicationSelfInMonth"
                        label="Max Application In Month"
                        placeholder="Max Application In Month"
                        rules={[
                          {
                            message:
                              " Max Application must be positive And No Decimals are allowed",
                            pattern: new RegExp(/^[+]?\d+$/),
                          },
                        ]}
                      />
                    </Col>
                    <Col md={12} sm={24}>
                      <PInput
                        type="number"
                        name="intMaxLveApplicationSelfInYear"
                        label="Max Application In Year"
                        placeholder="Max Application In Year"
                        rules={[
                          {
                            message: "Max Application must be positive",
                            pattern: new RegExp(/^[+]?\d+$/),
                          },
                        ]}
                      />
                    </Col>
                  </>
                  <Form.Item shouldUpdate noStyle>
                    {() => {
                      const { intLeaveDependOn, showLveIndays } =
                        form.getFieldsValue(true);
                      // const empType = employeeType?.label;

                      return (
                        <>
                          {(intLeaveDependOn?.value === 1 ||
                            showLveIndays?.value === 1) && (
                            <Col md={12} sm={24}>
                              <PSelect
                                options={commonDDL as any}
                                name="isProdataBasis"
                                label="Prodata Basis"
                                placeholder="Prodata Basis"
                                // disabled={
                                //   intLeaveDependOn?.value !== 1 ||
                                //   showLveIndays?.value !== 1
                                // }
                                onChange={(value, op) => {
                                  form.setFieldsValue({
                                    isProdataBasis: value,
                                  });
                                }}
                                rules={[
                                  {
                                    required: false,
                                    message: "Prodata Basis is required",
                                  },
                                ]}
                              />
                            </Col>
                          )}
                        </>
                      );
                    }}
                  </Form.Item>
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
                      const { bu } = form.getFieldsValue();

                      // const empType = employeeType?.label;

                      return (
                        <>
                          {/* {intWorkplaceList?.length === workplaceDDL?.length ? ( */}
                          <>
                            <Col md={24}>
                              <PSelect
                                // mode="multiple"
                                allowClear
                                options={[...buDDL]}
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
                                    // `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplaceGroup&WorkplaceGroupId=0&BusinessUnitId=${op?.value}&intId=${employeeId}`,
                                    `/PeopleDeskDdl/WorkplaceGroupWithRoleExtension?accountId=${orgId}&businessUnitId=${op?.value}&workplaceGroupId=${wgId}&empId=${employeeId}`,
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
                                    // `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&AccountId=${orgId}&BusinessUnitId=${bu?.value}&WorkplaceGroupId=${op?.value}&intId=${employeeId}`,
                                    `/PeopleDeskDdl/WorkplaceWithRoleExtension?accountId=${orgId}&businessUnitId=${bu?.value}&workplaceGroupId=${op?.value}&empId=${employeeId}`,
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
                      label="Active From Joining date (Day)"
                      placeholder="Days"
                      rules={[
                        // {
                        //   required: true,
                        //   message: "Active From Joining day(Day) is required",
                        // },
                        {
                          message:
                            "Active From Joining date (Day) must be positive",
                          pattern: new RegExp(/^[+]?\d+$/),
                        },
                      ]}
                    />
                  </Col>
                  <Col md={12} sm={24}>
                    <PInput
                      type="number"
                      name="intActiveFromConfirmationInDay"
                      label="Active From Confirmation date (Day)"
                      placeholder="Days"
                      rules={[
                        // {
                        //   required: true,
                        //   message:
                        //     "Active From Confirmation(Day) is required",
                        // },
                        {
                          message:
                            "Active From Confirmation date (Day) must be positive",
                          pattern: new RegExp(/^[+]?\d+$/),
                        },
                      ]}
                    />
                  </Col>
                  {/* LWP Configuration  */}
                  <>
                    <Form.Item shouldUpdate noStyle>
                      {() => {
                        const { intLeaveType, intLwpbasedOn } =
                          form.getFieldsValue(true);

                        // const empType = employeeType?.label;

                        return intLeaveType?.value === 6 ? (
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
                              Leave Without Pay Configuration
                            </Divider>

                            <Col md={12} sm={24}>
                              <PSelect
                                options={[
                                  { value: 1, label: "Basic" },
                                  { value: 2, label: "Gross" },
                                  { value: 3, label: "Fixed Amount" },
                                ]}
                                name="intLwpbasedOn"
                                label="Based On"
                                placeholder="Based On"
                                onChange={(value, op) => {
                                  form.setFieldsValue({
                                    intLwpbasedOn: op,
                                    intLwpamountOrPercentage: undefined,
                                  });
                                }}
                                // rules={[
                                //   {
                                //     required: intLeaveType?.value === 6,
                                //     message: `Based On is required`,
                                //   },
                                // ]}
                              />
                            </Col>
                            <Col md={12} sm={24}>
                              <PInput
                                type="number"
                                name="intLwpamountOrPercentage"
                                label={
                                  intLwpbasedOn?.value === 3
                                    ? "Amount"
                                    : "Percentage"
                                }
                                placeholder={
                                  intLwpbasedOn?.value === 3
                                    ? "Amount"
                                    : "Percentage"
                                }
                                size="small"
                                rules={[
                                  {
                                    required: intLwpbasedOn?.value
                                      ? true
                                      : false,
                                    message: `${
                                      intLwpbasedOn?.value === 3
                                        ? "Amount"
                                        : "Percentage"
                                    } is required`,
                                  },
                                  {
                                    message: `${
                                      intLwpbasedOn?.value === 3
                                        ? "Amount"
                                        : "Percentage"
                                    } be positive`,
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
                  {/* Compensatory Leave Configuration  */}
                  <>
                    <Form.Item shouldUpdate noStyle>
                      {() => {
                        const {
                          intLeaveType,
                          intLeaveDependOn,
                          isCompensatoryLveExpire,
                        } = form.getFieldsValue(true);

                        // const empType = employeeType?.label;

                        return intLeaveType?.value === 5 &&
                          (intLeaveDependOn?.value === 3 ||
                            tableData?.filter(
                              (i: any) => i?.showLveIndays?.value === 3
                            )?.length > 0) ? (
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
                                name="isCompensatoryLveExpire"
                              />
                            </Col>
                            <Col md={12} sm={24}>
                              <PInput
                                disabled={!isCompensatoryLveExpire}
                                type="number"
                                name="intCompensatoryLveExpireInDays"
                                label="Conpensatory Leave Expire In Days"
                                placeholder="Conpensatory Leave Expire In Days"
                                size="small"
                                rules={[
                                  {
                                    required: isCompensatoryLveExpire,
                                    message:
                                      "Conpensatory Leave Expire In Days is required",
                                  },
                                  {
                                    message:
                                      "Conpensatory Leave Expire In Days must be positive",
                                    pattern: new RegExp(/^[+]?\d+$/),
                                  },
                                ]}
                              />
                            </Col>
                            <Col md={12} sm={24}>
                              <PInput
                                type="number"
                                name="intMinWorkingHourForComl"
                                label="Minimum Working Hour"
                                placeholder="Minimum Working Hour"
                                size="small"
                                rules={[
                                  {
                                    required:
                                      intLeaveType?.label ===
                                      "Compensatory Leave",
                                    message: "Minimum Working Hour is required",
                                  },
                                  {
                                    message:
                                      "Minimum Working Hour must be positive",
                                    pattern: new RegExp(/^[+]?\d+$/),
                                  },
                                ]}
                              />
                            </Col>
                            <Col md={12} sm={24}>
                              <PInput
                                type="number"
                                name="intMaxComlLveInMonth"
                                label="Max Leave In Month"
                                placeholder="Max Leave In Month"
                                size="small"
                                rules={[
                                  {
                                    required:
                                      intLeaveType?.label ===
                                      "Compensatory Leave",
                                    message: "Max Leave In Month is required",
                                  },
                                  {
                                    message:
                                      "Max Leave In Month must be positive",
                                    pattern: new RegExp(/^[+]?\d+$/),
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
                        const { intLeaveType, intLeaveDependOn } =
                          form.getFieldsValue(true);
                        // const empType = employeeType?.label;

                        return intLeaveType?.value === 4 &&
                          (intLeaveDependOn?.value === 3 ||
                            tableData?.filter(
                              (i: any) => i?.showLveIndays?.value === 3
                            )?.length > 0) ? (
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
                                <span>Earn Leave Configuration</span>
                              </div>
                            </Divider>
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
                                label="One Earn Leave Generated By (Day)"
                                placeholder="Day"
                                size="small"
                                rules={[
                                  {
                                    message:
                                      "One Earn Leave Generated By (Day) must be positive",
                                    pattern: new RegExp(/^[+]?\d+$/),
                                  },
                                ]}
                              />
                            </Col>
                            <Col md={12} sm={24}>
                              <PInput
                                type="number"
                                name="intEarnLveInDay"
                                label=" One Earn Leave Value"
                                placeholder="Days"
                                size="small"
                                rules={[
                                  {
                                    message:
                                      "One Earn Leave Value must be positive",
                                    pattern: new RegExp(/^[+]?\d+$/),
                                  },
                                ]}
                              />
                            </Col>
                          </>
                        ) : null;
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
                          isHalfDayLeave,
                          isCarryForward,
                          isEncashable,
                        } = form.getFieldsValue();

                        // const empType = employeeType?.label;

                        return (
                          <>
                            <Col md={12} sm={24}>
                              <PSelect
                                options={commonDDL as any}
                                name="isHalfDayLeave"
                                label="Half Day"
                                placeholder="Half Day"
                                onChange={(value, op) => {
                                  form.setFieldsValue({
                                    isHalfDayLeave: value,
                                    intHalfdayMaxInMonth: undefined,
                                    intHalfdayMaxInYear: undefined,
                                  });
                                }}
                                rules={[
                                  {
                                    required: false,
                                    message: "Half Day is required",
                                  },
                                ]}
                              />
                            </Col>
                            {isHalfDayLeave && (
                              <Col md={12} sm={24}>
                                <PInput
                                  disabled={!isHalfDayLeave}
                                  type="number"
                                  name="intHalfdayMaxInYear"
                                  label=" Max Half Day Availability (Year)"
                                  placeholder=" Max Half Day Availability (Year)"
                                  size="small"
                                  rules={[
                                    {
                                      message:
                                        "Max Half Day Availability in Year must be positive",
                                      pattern: new RegExp(/^[+]?\d+$/),
                                    },
                                  ]}
                                />
                              </Col>
                            )}
                            {isHalfDayLeave && (
                              <Col md={12} sm={24}>
                                <PInput
                                  disabled={!isHalfDayLeave}
                                  type="number"
                                  name="intHalfdayMaxInMonth"
                                  label="Max Half Day Availability (Month)"
                                  placeholder="Max Half Day Availability (Month)"
                                  size="small"
                                  rules={[
                                    {
                                      message:
                                        "Max Half Day Availability in Month must be positive",
                                      pattern: new RegExp(/^[+]?\d+$/),
                                    },
                                  ]}
                                />
                              </Col>
                            )}
                            {isHalfDayLeave && (
                              <Col md={12} sm={24}>
                                <PSelect
                                  options={[
                                    { value: 0, label: "None" },
                                    ...leaveTypeDDL,
                                  ]}
                                  name="intHalfdayPreviousLveTypeEnd"
                                  label="Half Day Availability After End"
                                  placeholder="Leave Type"
                                  disabled={!isHalfDayLeave}
                                  onChange={(value, op) => {
                                    form.setFieldsValue({
                                      intHalfdayPreviousLveTypeEnd: op,
                                    });
                                  }}
                                />
                              </Col>
                            )}
                            <Divider
                              style={{
                                marginBlock: "4px",
                                marginTop: "6px",
                                fontSize: "14px",
                                fontWeight: 600,
                              }}
                              orientation="left"
                            ></Divider>
                            <Col md={12} sm={24}>
                              <PSelect
                                options={commonDDL as any}
                                name="isCarryForward"
                                label="Carry Forward"
                                placeholder="Carry Forward"
                                onChange={(value, op) => {
                                  form.setFieldsValue({
                                    isCarryForward: value,
                                    intCarryForwardMaxInDay: undefined,
                                    intCarryForwarExpiryDay: undefined,
                                    intCarryForwarExpiryMonth: undefined,
                                    isCarryWillBeCounted: undefined,
                                  });
                                }}
                                rules={[
                                  {
                                    required: false,
                                    message: "Carry Forward is required",
                                  },
                                ]}
                              />
                            </Col>
                            {isCarryForward && (
                              <Col md={12} sm={24}>
                                <PSelect
                                  options={commonDDL as any}
                                  name="isCarryWillBeCounted"
                                  label="Add previous year carry balance"
                                  placeholder="Add previous year carry balance"
                                  onChange={(value, op) => {
                                    form.setFieldsValue({
                                      isCarryWillBeCounted: value,
                                    });
                                  }}
                                  disabled={!isCarryForward}
                                  rules={[
                                    {
                                      required: false,
                                      message:
                                        "Add previous year carry balance is required",
                                    },
                                  ]}
                                />
                              </Col>
                            )}
                            {/* <Col md={12} sm={24}>
                              <PInput
                                disabled={!isCarryForward}
                                label="Add previous year carry balance"
                                type="checkbox"
                                layout="horizontal"
                                name="isCarryWillBeCounted"
                              />
                            </Col> */}
                            {isCarryForward && (
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
                                      pattern: new RegExp(/^[+]?\d+$/),
                                    },
                                  ]}
                                />
                              </Col>
                            )}

                            {isCarryForward && (
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
                                      pattern: new RegExp(/^[+]?\d+$/),
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
                            )}
                            {isCarryForward && (
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
                                      pattern: new RegExp(/^[+]?\d+$/),
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
                            )}
                            <Divider
                              style={{
                                marginBlock: "4px",
                                marginTop: "6px",
                                fontSize: "14px",
                                fontWeight: 600,
                              }}
                              orientation="left"
                            ></Divider>
                            <Col md={12} sm={24}>
                              <PSelect
                                options={commonDDL as any}
                                name="isEncashable"
                                label="Encashable"
                                placeholder="Encashable"
                                onChange={(value, op) => {
                                  form.setFieldsValue({
                                    isEncashable: value,
                                    IntMaxEncashableLveInDay: undefined,
                                    intEncashableMonth: undefined,
                                  });
                                }}
                                rules={[
                                  {
                                    required: false,
                                    message: "Carry Forward is required",
                                  },
                                ]}
                              />
                            </Col>
                            {isEncashable && (
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
                                      pattern: new RegExp(/^[+]?\d+$/),
                                    },
                                  ]}
                                />
                              </Col>
                            )}
                            {isEncashable && (
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
                                      pattern: new RegExp(/^[+]?\d+$/),
                                    },
                                  ]}
                                />
                              </Col>
                            )}
                            <Divider
                              style={{
                                marginBlock: "4px",
                                marginTop: "6px",
                                fontSize: "14px",
                                fontWeight: 600,
                              }}
                              orientation="left"
                            ></Divider>
                            {/* <Col md={12} sm={24}>
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
                            </Col> */}
                            {/* <Col md={12} sm={24}>
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
                            </Col> */}
                            <Col md={12} sm={24}>
                              <PSelect
                                options={commonDDL as any}
                                name="isAdvanceLeave"
                                label="Advance Leave"
                                placeholder="Advance Leave"
                                onChange={(value, op) => {
                                  form.setFieldsValue({
                                    isAdvanceLeave: value,
                                    intMaxForAdvLveInYear: undefined,
                                  });
                                }}
                                rules={[
                                  {
                                    required: false,
                                    message: "Advance Leave is required",
                                  },
                                ]}
                              />
                            </Col>
                            {isAdvanceLeave && (
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
                                      pattern: new RegExp(/^[+]?\d+$/),
                                    },
                                  ]}
                                />
                              </Col>
                            )}
                            <Divider
                              style={{
                                marginBlock: "4px",
                                marginTop: "6px",
                                fontSize: "14px",
                                fontWeight: 600,
                              }}
                              orientation="left"
                            ></Divider>
                            <Col md={12} sm={24}>
                              {/* <PInput
                                label=" Bridge Leave/Apply Offday as Leave"
                                type="checkbox"
                                layout="horizontal"
                                name="isIncludeOffday"
                              /> */}
                              <PSelect
                                options={commonDDL as any}
                                name="isIncludeOffday"
                                label="Bridge Leave/Apply Offday as Leave"
                                placeholder="Bridge Leave/Apply Offday as Leave"
                                onChange={(value, op) => {
                                  form.setFieldsValue({
                                    isIncludeOffday: value,
                                  });
                                }}
                                rules={[
                                  {
                                    required: false,
                                    message:
                                      "Bridge Leave/Apply Offday as Leave is required",
                                  },
                                ]}
                              />
                            </Col>
                            <Col md={12} sm={24}>
                              {/* <PInput
                                label="Bridge Leave/Apply holiday as Leave"
                                type="checkbox"
                                layout="horizontal"
                                name="isIncludeHoliday"
                              /> */}
                              <PSelect
                                options={commonDDL as any}
                                name="isIncludeHoliday"
                                label="Bridge Leave/Apply holiday as Leave"
                                placeholder="Bridge Leave/Apply holiday as Leave"
                                onChange={(value, op) => {
                                  form.setFieldsValue({
                                    isIncludeHoliday: value,
                                  });
                                }}
                                rules={[
                                  {
                                    required: false,
                                    message:
                                      "Bridge Leave/Apply holiday as Leave is required",
                                  },
                                ]}
                              />
                            </Col>
                            <Col md={12} sm={24}>
                              {/* <PInput
                                label="Balance Show From Self Service"
                                type="checkbox"
                                layout="horizontal"
                                name="isLveBalanceShowForSelfService"
                              /> */}
                              <PSelect
                                options={commonDDL as any}
                                name="isLveBalanceShowForSelfService"
                                label="Balance Show From Self Service"
                                placeholder="Balance Show From Self Service"
                                onChange={(value, op) => {
                                  form.setFieldsValue({
                                    isLveBalanceShowForSelfService: value,
                                  });
                                }}
                                rules={[
                                  {
                                    required: false,
                                    message:
                                      "Balance Show From Self Service is required",
                                  },
                                ]}
                              />
                            </Col>
                            <Col md={12} sm={24}>
                              {/* <PInput
                                label="Leave Apply From Self Service"
                                type="checkbox"
                                layout="horizontal"
                                name="isLveBalanceApplyForSelfService"
                              /> */}
                              <PSelect
                                options={commonDDL as any}
                                name="isLveBalanceApplyForSelfService"
                                label="Leave Apply From Self Service"
                                placeholder="Leave Apply From Self Service"
                                onChange={(value, op) => {
                                  form.setFieldsValue({
                                    isLveBalanceApplyForSelfService: value,
                                  });
                                }}
                                rules={[
                                  {
                                    required: false,
                                    message:
                                      "Leave Apply From Self Service is required",
                                  },
                                ]}
                              />
                            </Col>
                            <Col md={12} sm={24}>
                              {/* <PInput
                                label="Applicable Before And After Offday"
                                type="checkbox"
                                layout="horizontal"
                                name="isApplicableBeforeAndAfterOffday"
                              /> */}
                              <PSelect
                                options={commonDDL as any}
                                name="isApplicableBeforeAndAfterOffday"
                                label="Applicable Before And After Offday"
                                placeholder="Applicable Before And After Offday"
                                onChange={(value, op) => {
                                  form.setFieldsValue({
                                    isApplicableBeforeAndAfterOffday: value,
                                  });
                                }}
                                rules={[
                                  {
                                    required: false,
                                    message:
                                      "Applicable Before And After Offday is required",
                                  },
                                ]}
                              />
                            </Col>
                            <Col md={12} sm={24}>
                              {/* <PInput
                                label="Applicable Before And After Holiday"
                                type="checkbox"
                                layout="horizontal"
                                name="isApplicableBeforeAndAfterHoliday"
                              /> */}
                              <PSelect
                                options={commonDDL as any}
                                name="isApplicableBeforeAndAfterHoliday"
                                label="Applicable Before And After Holiday"
                                placeholder="Applicable Before And After Holiday"
                                onChange={(value, op) => {
                                  form.setFieldsValue({
                                    isApplicableBeforeAndAfterHoliday: value,
                                  });
                                }}
                                rules={[
                                  {
                                    required: false,
                                    message:
                                      "Applicable Before And After Holiday is required",
                                  },
                                ]}
                              />
                            </Col>
                            <Col md={12} sm={24}>
                              {/* <PInput
                                label="Is Minute Based? "
                                type="checkbox"
                                layout="horizontal"
                                name="isMinuteBased"
                              /> */}
                              <PSelect
                                options={commonDDL as any}
                                name="isMinuteBased"
                                label="Is Minute Based"
                                placeholder="Is Minute Based"
                                onChange={(value, op) => {
                                  form.setFieldsValue({
                                    isMinuteBased: value,
                                  });
                                }}
                                rules={[
                                  {
                                    required: false,
                                    message: "Is Minute Based is required",
                                  },
                                ]}
                              />
                            </Col>
                            <Col md={12} sm={24}>
                              {/* <PInput
                                label="Is Auto Renewable?"
                                type="checkbox"
                                layout="horizontal"
                                name="isAutoRenewable"
                              /> */}
                              <PSelect
                                options={commonDDL as any}
                                name="isAutoRenewable"
                                label="Is Auto Renewable"
                                placeholder="Is Auto Renewable"
                                onChange={(value, op) => {
                                  form.setFieldsValue({
                                    isAutoRenewable: value,
                                  });
                                }}
                                rules={[
                                  {
                                    required: false,
                                    message: "Is Auto Renewable is required",
                                  },
                                ]}
                              />
                            </Col>
                            {/* <Col md={12} sm={24}>
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
                            </Col> */}
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
                    // const { intWorkplaceList } = form.getFieldsValue();

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
                                    // requirement from habiba apu🔥🔥🔥
                                    // const temp = intWorkplaceList?.filter(
                                    //   (item: any) =>
                                    //     item?.value !==
                                    //     existingPolicies[index]?.intWorkplace
                                    // );

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
