/* eslint-disable @typescript-eslint/no-unused-vars */
//  @ts-nocheck
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
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { toast } from "react-toastify";
import { Col, Form, List, Row, Typography, Divider } from "antd";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { useApiRequest } from "../../../../Hooks";
import Loading from "common/loading/Loading";
import { useHistory } from "react-router-dom";
import { PButton, PForm, PInput, PSelect } from "Components";

const CreateEditLeavePolicy = () => {
  const policyApi = useApiRequest([]);
  const params = useParams();
  const [form] = Form.useForm();

  const [employmentTypeDDL, setEmploymentTypeDDL] = useState([]);
  const [leaveTypeDDL, setLeaveTypeDDL] = useState([]);
  const [workplaceDDL, setWorkplaceDDL] = useState(null);
  const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState([]);
  const [buDDL, setBuDDL] = useState([]);
  const [hrPositionDDL, setHrPositionDDL] = useState([]);
  const [allPolicies, setAllPolicies] = useState([]);
  const [singleData, setSingleData] = useState({});
  const [existingPolicies, setExistingPolicies] = useState([]);
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const { orgId, employeeId, buId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
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
    getYearlyPolicyPopUpDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmploymentType&WorkplaceGroupId=${wgId}&BusinessUnitId=${buId}&intId=0`,
      "Id",
      "EmploymentType",
      setEmploymentTypeDDL
    );
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=LeaveType&BusinessUnitId=${buId}&intId=0&WorkplaceGroupId=${wgId}`,
      "LeaveTypeId",
      "LeaveType",
      setLeaveTypeDDL
    );
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=AllPosition&BusinessUnitId=${buId}&intId=0&WorkplaceGroupId=${wgId}&intId=0`,
      "PositionId",
      "PositionName",
      setHrPositionDDL
    );
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
    }
  }, [singleData]);

  const remover = (payload) => {
    const filterArr = tableData.filter((itm, idx) => idx !== payload);
    setTableData(filterArr);
  };

  return (
    <>
      <PForm
        form={form}
        onFinish={(values) => {
          saveHandler(
            values,
            form.resetFields,
            policyApi,
            tableData,
            existingPolicies,
            params,
            history
          );
        }}
        initialValues={{}}
        onValuesChange={(changedFields, allFields) => {
          console.log({ changedFields }, { allFields });
        }}
      >
        <div className="leavePolicy-container table-card ">
          {/* btns */}
          <div className="table-card-heading ">
            <div className="d-flex align-items-center">
              <BackButton />
              <h2>
                {params?.id ? "Edit Leave Policy" : "Create Leave Policy"}
              </h2>
            </div>

            <ul className="d-flex flex-wrap">
              <li>
                <button
                  type="button"
                  className="btn btn-cancel mr-2"
                  onClick={() => {
                    form.resetFields();
                  }}
                >
                  Reset
                </button>
              </li>
              <li>
                <PButton
                  type="primary"
                  content={"Save"}
                  // onClick={onSubmit}
                  action={"submit"}
                />
              </li>
            </ul>
          </div>
          {/* -------------------------------- */}
          {loading ? (
            <Loading />
          ) : (
            <div className="table-card-body">
              <div className="card-style">
                <Row gutter={[10, 2]}>
                  <Col span={14}>
                    <div className="row">
                      {/* leave config */}
                      <>
                        <div className="col-12">
                          <h2>Leave Configuration</h2>
                        </div>
                        <div
                          className="col-12"
                          style={{ marginBottom: "12px" }}
                        ></div>
                      </>
                    </div>
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
                            onChange={(value, op) => {
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
                            options={
                              [{ value: 0, label: "None" }, ...leaveTypeDDL] ||
                              []
                            }
                            name="inPreviousLveTypeEnd"
                            label="Previous Leave Type End"
                            placeholder="Previous Leave Type End"
                            onChange={(value, op) => {
                              form.setFieldsValue({
                                inPreviousLveTypeEnd: op,
                              });
                              console.log(form.getFieldsValue());
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
                                        required: true,
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
                                      intLeaveType?.label ===
                                        "Compensatory Leave"
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
                                required: true,
                                message:
                                  " Max Leave Available from Self is required",
                              },
                              {
                                message:
                                  " Max Leave Available must be positive",
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
                            name="intMaxLveApplicationSelfInMonth"
                            label="Max Leave Application In Month"
                            placeholder="Max Leave Application In Month"
                            rules={[
                              {
                                required: true,
                                message:
                                  " Max Leave Application In Month is required",
                              },
                              {
                                message:
                                  " Max Leave Application must be positive",
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
                            name="intMaxLveApplicationSelfInYear"
                            label="Max Leave Application In Year"
                            placeholder="Max Leave Application In Year"
                            rules={[
                              {
                                required: true,
                                message:
                                  " Max Leave Application In Year is required",
                              },
                              {
                                message:
                                  "Max Leave Application must be positive",
                                pattern: new RegExp(
                                  /^[+]?([.]\d+|\d+([.]\d+)?)$/
                                ),
                              },
                            ]}
                          />
                        </Col>
                      </>
                      {/* ORG */}
                      <>
                        <div
                          className="col-12 mt-3"
                          style={{ marginLeft: "-0.8em" }}
                        >
                          <h2>Organization Configuration</h2>
                        </div>
                        <div
                          className="col-12"
                          style={{ marginBottom: "12px" }}
                        ></div>
                      </>

                      <Form.Item shouldUpdate noStyle>
                        {() => {
                          const { intWorkplaceList, wg, bu } =
                            form.getFieldsValue();

                          // const empType = employeeType?.label;

                          return (
                            <>
                              {intWorkplaceList?.length ===
                              workplaceDDL?.length ? (
                                <>
                                  <Col md={24}>
                                    <PSelect
                                      mode="multiple"
                                      allowClear
                                      options={[...buDDL] || []}
                                      name="bu"
                                      label="Business Unit"
                                      placeholder="Business Unit"
                                      onChange={(value, op) => {
                                        form.setFieldsValue({
                                          bu: op,
                                        });
                                        getPeopleDeskAllDDL(
                                          `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplaceGroup&WorkplaceGroupId=0&BusinessUnitId=${
                                            op[op?.length - 1]?.value
                                          }&intId=${employeeId}`,
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
                                      mode="multiple"
                                      allowClear
                                      options={[...workplaceGroupDDL] || []}
                                      name="wg"
                                      label="Workplace Group"
                                      placeholder="Workplace Group"
                                      onChange={(value, op) => {
                                        const wddl = [...workplaceDDL];
                                        form.setFieldsValue({
                                          wg: op,
                                        });
                                        getYearlyPolicyPopUpDDL(
                                          `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&AccountId=${orgId}&BusinessUnitId=${
                                            bu[0]?.value
                                          }&WorkplaceGroupId=${
                                            op[op?.length - 1]?.value
                                          }&intId=${employeeId}`,
                                          "intWorkplaceId",
                                          "strWorkplace",
                                          setWorkplaceDDL,
                                          (res) => {
                                            if (op?.length === 1) {
                                              const newState1 = res.filter(
                                                (obj1) =>
                                                  intWorkplaceList?.some(
                                                    (obj2) =>
                                                      obj2.value === obj1.value
                                                  )
                                              );
                                              form.setFieldsValue({
                                                intWorkplaceList: newState1,
                                              });
                                            } else {
                                              setWorkplaceDDL(() => {
                                                const ar = [...wddl, ...res];
                                                const uniqueObjectMap =
                                                  new Map();
                                                ar.forEach((obj) => {
                                                  uniqueObjectMap.set(
                                                    obj.value,
                                                    obj
                                                  );
                                                });

                                                const newState1 = Array.from(
                                                  uniqueObjectMap.values()
                                                ).filter((obj1) =>
                                                  intWorkplaceList?.some(
                                                    (obj2) =>
                                                      obj2.value === obj1.value
                                                  )
                                                );
                                                form.setFieldsValue({
                                                  intWorkplaceList: newState1,
                                                });
                                                return Array.from(
                                                  uniqueObjectMap.values()
                                                );
                                              });
                                            }
                                          }
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
                              ) : null}
                              <Col md={24} sm={24}>
                                <PSelect
                                  mode="multiple"
                                  allowClear
                                  maxTagCount={5}
                                  options={
                                    workplaceDDL?.length > 0
                                      ? [
                                          { value: 0, label: "All" },
                                          ...workplaceDDL,
                                        ]
                                      : [{ value: 0, label: "All" }]
                                  }
                                  name="intWorkplaceList"
                                  label="Workplace"
                                  placeholder="Workplace"
                                  onChange={(value, op) => {
                                    const temp = form.getFieldsValue();
                                    const flag = op?.find(
                                      (item) => item?.label === "All"
                                    );
                                    if (flag) {
                                      form.setFieldsValue({
                                        intWorkplaceList: workplaceDDL?.filter(
                                          (itm) => itm.value !== 0
                                        ),
                                      });

                                      isPolicyExist(
                                        {
                                          ...temp,
                                          intWorkplaceList:
                                            workplaceDDL?.filter(
                                              (itm) => itm.label !== "All"
                                            ),
                                        },
                                        allPolicies,
                                        setExistingPolicies
                                      );
                                    } else {
                                      form.setFieldsValue({
                                        intWorkplaceList: op,
                                      });
                                      isPolicyExist(
                                        {
                                          ...temp,
                                          intWorkplaceList: op,
                                        },
                                        allPolicies,
                                        setExistingPolicies
                                      );
                                    }

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
                            </>
                          );
                        }}
                      </Form.Item>
                      {/* employee */}
                      <>
                        <div
                          className="col-12 mt-3"
                          style={{ marginLeft: "-0.8em" }}
                        >
                          <h2>Employee Configuration</h2>
                        </div>
                        <div
                          className="col-12"
                          style={{ marginBottom: "12px" }}
                        ></div>
                      </>
                      <>
                        <Col md={12} sm={24}>
                          <PSelect
                            mode="multiple"
                            allowClear
                            options={[...employmentTypeDDL] || []}
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
                            options={[...hrPositionDDL] || []}
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
                        {/* <Col md={12} sm={24}>
                          <PInput
                            type="number"
                            name="intMaxLveDaySelf"
                            label="Max Leave Available from Self"
                            placeholder="Max Leave Available from Self"
                            rules={[
                              {
                                required: true,
                                message:
                                  " Max Leave Available from Self is required",
                              },
                            ]}
                          />
                        </Col> */}
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
                          {/* <PInput
                            type="date"
                            picker={"year"}
                            name="intYear"
                            label="Year"
                            placeholder="Year"
                            rules={[
                              {
                                required: true,
                                message: "Year is required",
                              },
                            ]}
                          /> */}
                        </Col>

                        <Col md={12} sm={24}>
                          <PInput
                            type="number"
                            name="intActiveFromJoiningdayInDay"
                            label="Active From Joining day In Day"
                            placeholder="Active From Joining day In Day"
                            rules={[
                              {
                                required: true,
                                message:
                                  "Active From Joining day In Day is required",
                              },
                              {
                                message:
                                  "Active From Joining day In Day must be positive",
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
                            name="intActiveFromConfirmationInDay"
                            label="Active From Confirmation In Day"
                            placeholder="Active From Confirmation In Day"
                            rules={[
                              {
                                required: true,
                                message:
                                  "Active From Confirmation In Day is required",
                              },
                              {
                                message:
                                  "Active From Confirmation In Day must be positive",
                                pattern: new RegExp(
                                  /^[+]?([.]\d+|\d+([.]\d+)?)$/
                                ),
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
                                      intLeaveType?.label ===
                                        "Compensatory Leave"
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
                                          intStartServiceLengthInYear:
                                            undefined,
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
                                      console.log(form.getFieldsValue());
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
                                      console.log(form.getFieldsValue());
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
                                        intEndServiceLengthInYear === "" ||
                                        intLveInDay === "" ||
                                        intStartServiceLengthInYear === ""
                                      ) {
                                        return toast.warn(
                                          "Please fill up the fields"
                                        );
                                      }
                                      setTableData((prev) => [
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
                                        {tableData.map(
                                          (item: any, index: number) => {
                                            return (
                                              <tr key={index}>
                                                <td>
                                                  {item
                                                    ?.intStartServiceLengthInYear
                                                    ?.label ===
                                                  item
                                                    ?.intEndServiceLengthInYear
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
                      </>
                      {/* Compensatory Leave Configuration  */}

                      <>
                        <Form.Item shouldUpdate noStyle>
                          {() => {
                            const { intLeaveType, isConpensatoryLveExpire } =
                              form.getFieldsValue();

                            // const empType = employeeType?.label;

                            return intLeaveType?.label ===
                              "Compensatory Leave" ? (
                              <>
                                <>
                                  <div
                                    className="col-12 mt-3"
                                    style={{ marginLeft: "-0.8em" }}
                                  >
                                    <h2>Compensatory Leave Configuration</h2>
                                  </div>
                                  <div
                                    className="col-12"
                                    style={{ marginBottom: "12px" }}
                                  ></div>
                                </>
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
                                        required: true,
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
                        <div
                          className="col-12 mt-3"
                          style={{ marginLeft: "-0.8em" }}
                        >
                          <h2>Half Leave Configuration</h2>
                        </div>
                        <div
                          className="col-12"
                          style={{ marginBottom: "12px" }}
                        ></div>
                      </>
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
                                <Col md={12} sm={24}>
                                  <PInput
                                    label="Half Day Leave"
                                    type="checkbox"
                                    layout="horizontal"
                                    name="isHalfDayLeave"
                                    onChange={() => {
                                      form.setFieldsValue({
                                        intHalfdayMaxInMonth: undefined,
                                        intHalfdayMaxInYear: undefined,
                                        intHalfdayMaxInMonth: undefined,
                                      });
                                    }}
                                  />
                                </Col>
                                <Col md={12} sm={24}>
                                  <PInput
                                    disabled={!isHalfDayLeave}
                                    type="number"
                                    name="intHalfdayMaxInMonth"
                                    label="Half day Max In Month"
                                    placeholder="Half day Max In Month"
                                    size="small"
                                    rules={[
                                      {
                                        message:
                                          "Half day Max In Month must be positive",
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
                                    label=" Half day Max In Year"
                                    placeholder=" Half day Max In Year"
                                    size="small"
                                    rules={[
                                      {
                                        message:
                                          "Half day Max In Year must be positive",
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
                                    label="Half day Previous Leave End"
                                    placeholder="Half day Previous Leave End"
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
                        <div
                          className="col-12 mt-3"
                          style={{ marginLeft: "-0.8em" }}
                        >
                          <h2>Carry Forward Configuration</h2>
                        </div>
                        <div
                          className="col-12"
                          style={{ marginBottom: "12px" }}
                        ></div>
                      </>
                      <>
                        <Form.Item shouldUpdate noStyle>
                          {() => {
                            const { intLeaveType, isCarryForward } =
                              form.getFieldsValue();

                            // const empType = employeeType?.label;

                            return (
                              <>
                                <Col md={12} sm={24}>
                                  <PInput
                                    label="Carry Forward"
                                    type="checkbox"
                                    layout="horizontal"
                                    name="isCarryForward"
                                    onChange={() => {
                                      form.setFieldsValue({
                                        intCarryForwardMaxInDay: undefined,
                                        intCarryForwarExpiryDay: undefined,
                                        intCarryForwardMonth: undefined,
                                      });
                                    }}
                                  />
                                </Col>
                                <Col md={12} sm={24}>
                                  <PInput
                                    disabled={!isCarryForward}
                                    type="number"
                                    name="intCarryForwardMaxInDay"
                                    label="Carry Forward Max In Day"
                                    placeholder="Carry Forward Max In Day"
                                    size="small"
                                    rules={[
                                      {
                                        message:
                                          "Carry Forward Max In Day must be positive",
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
                                    ]}
                                  />
                                </Col>
                                <Col md={12} sm={24}>
                                  <PInput
                                    disabled={!isCarryForward}
                                    type="number"
                                    name="intCarryForwardMonth"
                                    label="Carry Forward Month"
                                    placeholder="Carry Forward Month"
                                    size="small"
                                    rules={[
                                      {
                                        required: false,
                                        message:
                                          "Carry Forward Month must be positive",
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
                      {/*Encashable  Configuration  */}
                      <>
                        <div
                          className="col-12 mt-3"
                          style={{ marginLeft: "-0.8em" }}
                        >
                          <h2>Encashable Configuration</h2>
                        </div>
                        <div
                          className="col-12"
                          style={{ marginBottom: "12px" }}
                        ></div>
                      </>
                      <>
                        <Form.Item shouldUpdate noStyle>
                          {() => {
                            const { isEncashable } = form.getFieldsValue();

                            // const empType = employeeType?.label;

                            return (
                              <>
                                <Col md={12} sm={24}>
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
                                </Col>
                                <Col md={12} sm={24}>
                                  <PInput
                                    disabled={!isEncashable}
                                    type="number"
                                    name="IntMaxEncashableLveInDay"
                                    label="Max Encashable"
                                    placeholder="Max Encashable"
                                    size="small"
                                    rules={[
                                      {
                                        message:
                                          "Max Encashable must be positive",
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
                        <div
                          className="col-12 mt-3"
                          style={{ marginLeft: "-0.8em" }}
                        >
                          <h2>Other Configuration</h2>
                        </div>
                        <div
                          className="col-12"
                          style={{ marginBottom: "12px" }}
                        ></div>
                      </>
                      <>
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
                                    label="Month Wise Expired"
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
                                    label=" How Much Month"
                                    placeholder=" How Much Month"
                                    size="small"
                                    rules={[
                                      {
                                        message:
                                          "How Much Month must be positive",
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
                                    label="Minute Based "
                                    type="checkbox"
                                    layout="horizontal"
                                    name="isMinuteBased"
                                  />
                                </Col>
                                <Col md={12} sm={24}>
                                  <PInput
                                    label="Include Offday"
                                    type="checkbox"
                                    layout="horizontal"
                                    name="isIncludeOffday"
                                  />
                                </Col>
                                <Col md={12} sm={24}>
                                  <PInput
                                    label="Include Holiday"
                                    type="checkbox"
                                    layout="horizontal"
                                    name="isIncludeHoliday"
                                  />
                                </Col>
                                <Col md={12} sm={24}>
                                  <PInput
                                    label="Balance Show For SelfService"
                                    type="checkbox"
                                    layout="horizontal"
                                    name="isLveBalanceShowForSelfService"
                                  />
                                </Col>
                                <Col md={12} sm={24}>
                                  <PInput
                                    label="Leave Apply For SelfService"
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
                                    label="Auto Renewable"
                                    type="checkbox"
                                    layout="horizontal"
                                    name="isAutoRenewable"
                                  />
                                </Col>
                                <Col md={12} sm={24}>
                                  <PInput
                                    label="Prodata"
                                    type="checkbox"
                                    layout="horizontal"
                                    name="isProdataBasis"
                                    disabled={
                                      intLeaveType?.label ===
                                        "Earn Leave/Annual Leave" ||
                                      intLeaveType?.label ===
                                        "Compensatory Leave"
                                    }
                                  />
                                </Col>
                                <Col md={12} sm={24}>
                                  <PInput
                                    label="Do you want assign right now?"
                                    type="checkbox"
                                    layout="horizontal"
                                    name="isGenerate"
                                  />
                                </Col>
                              </>
                            );
                          }}
                        </Form.Item>
                      </>
                    </Row>
                  </Col>
                  <Form.Item shouldUpdate noStyle>
                    {() => {
                      const { intWorkplaceList, wg, bu } =
                        form.getFieldsValue();

                      // const empType = employeeType?.label;

                      return (
                        <Col span={1}>
                          <div
                            className="d-flex"
                            style={{
                              borderLeft: `3px solid ${success500}`,
                              minHeight:
                                tableData?.length > 0 ? "250vh" : "240vh",
                            }}
                          ></div>
                        </Col>
                      );
                    }}
                  </Form.Item>
                  <Form.Item shouldUpdate noStyle>
                    {() => {
                      const { intWorkplaceList } = form.getFieldsValue();

                      // const empType = employeeType?.label;

                      return (
                        <Col span={8}>
                          {existingPolicies?.length > 0 ? (
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
                                  renderItem={(item, index) => (
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

                                          const filterArr =
                                            existingPolicies.filter(
                                              (itm, idx) => idx !== index
                                            );
                                          setExistingPolicies(filterArr);
                                          const temp = intWorkplaceList?.filter(
                                            (item) =>
                                              item?.value !==
                                              existingPolicies[index]
                                                ?.intWorkplace
                                          );
                                          form.setFieldsValue({
                                            intWorkplaceList: temp,
                                          });
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
                          ) : null}
                        </Col>
                      );
                    }}
                  </Form.Item>
                </Row>
              </div>
            </div>
          )}
        </div>
      </PForm>
    </>
  );
};

export default CreateEditLeavePolicy;
