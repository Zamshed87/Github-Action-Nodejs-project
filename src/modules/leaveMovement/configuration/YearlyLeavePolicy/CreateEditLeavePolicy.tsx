//  @ts-nocheck
import { useFormik } from "formik";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import * as Yup from "yup";
import { monthDDL } from "../../../../utility/monthUtility";
import { yearDDLAction } from "../../../../utility/yearDDL";
import { DeleteOutline } from "@mui/icons-material";
import { AddOutlined } from "@mui/icons-material";

import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getYearlyPolicyPopUpDDL } from "./helper";
import { getPeopleDeskAllDDL } from "../../../../common/api";
import BackButton from "../../../../common/BackButton";
import FormikCheckBox from "../../../../common/FormikCheckbox";
import {
  gray600,
  gray900,
  greenColor,
  success500,
} from "../../../../utility/customColor";
import DefaultInput from "../../../../common/DefaultInput";
import FormikSelect from "../../../../common/FormikSelect";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { IconButton, Tooltip } from "@mui/material";
import MultiCheckedSelect from "../../../../common/MultiCheckedSelect";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { toast } from "react-toastify";
import { Col, List, Row, Typography } from "antd";
import { useApiRequest } from "../../../../Hooks";

const CreateEditLeavePolicy = ({ singleData }) => {
  const policyApi = useApiRequest([]);
  const params = useParams();
  const validationSchema = Yup.object().shape({
    // businessUnit: Yup.object()
    //   .shape({
    //     label: Yup.string().required("Business Unit type is required"),
    //     value: Yup.string().required("Business Unit type is required"),
    //   })
    //   .typeError("Business Unit type is required"),
    days: Yup.number()
      .min(0, "Days must be a non-negative number")
      .required("Days is required"),
    leaveType: Yup.object()
      .shape({
        label: Yup.string().required("Leave type is required"),
        value: Yup.string().required("Leave type is required"),
      })
      .typeError("Leave type is required"),
    employmentType: Yup.object()
      .shape({
        label: Yup.string().required("Employment type is required"),
        value: Yup.string().required("Employment type is required"),
      })
      .typeError("Employment type is required"),
    gender: Yup.object()
      .shape({
        label: Yup.string().required("Gender is required"),
        value: Yup.string().required("Gender is required"),
      })
      .typeError("Gender is required"),
    year: Yup.object()
      .shape({
        label: Yup.string().required("Year is required"),
        value: Yup.string().required("Year is required"),
      })
      .typeError("Year is required"),
  });

  const initData = {
    intWorkplaceList: [],
    intYear: "",
    intEmploymentTypeList: "",
    intLeaveType: "",
    intGender: "",
    days: "",
    strDisplayName: "",
    isDependOnServiceLength: false,
    intStartServiceLengthInYear: "",
    intEndServiceLengthInYear: "",
    intLveInDay: "",
    intAllocatedLveInDay: "",
    isMinuteBased: false,
    isIncludeOffday: false,
    isIncludeHoliday: false,
    isLveBalanceApplyForSelfService: false,
    isLveBalanceShowForSelfService: false,
    isProdataBasis: false,
    inPreviousLveTypeEnd: false,
    intMaxLveDaySelf: "",
    intMaxLveApplicationSelfInYear: "",
    intMaxLveApplicationSelfInMonth: "",
    isHalfDayLeave: false,
    intHalfdayMaxInMonth: "",
    intHalfdayMaxInYear: "",
    intHalfdayPreviousLveTypeEnd: "",
    isEncashable: false,
    intMaxEncashableLveInDay: "",
    intEncashableMonth: "",
    isCompensatoryLve: false,
    intConpensatoryLveExpireInDays: "",
    isEarnLeave: false,
    intDayForOneEarnLve: "",
    isEarnLveIncludeHoliday: false,
    isEarnLveIncludeOffday: false,
    intEarnLveInDay: "",
    isCarryForward: false,
    intCarryForwardMaxInDay: "",
    intCarryForwardMonth: "",
    intCarryForwarExpiryMonth: "",
    intCarryForwarExpiryDay: "",
    isAutoRenewable: false,
    intActiveFromJoiningdayInDay: "",
    intActiveFromConfirmationInDay: "",
    isApplicableBeforeAndAfterHoliday: false,
    isApplicableBeforeAndAfterOffday: false,
    isMonthWiseExpired: false,
    howMuchMonth: "",
    bu: "",
    wg: "",
    isGenerate: false,
    isAdvanceLeave: false,
    intMaxForAdvLveInYear: "",
    hrPositionListDTO: "",
  };
  const [employmentTypeDDL, setEmploymentTypeDDL] = useState([]);
  const [leaveTypeDDL, setLeaveTypeDDL] = useState([]);
  const [workplaceDDL, setWorkplaceDDL] = useState(null);
  const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState([]);
  const [buDDL, setBuDDL] = useState([]);
  const [hrPositionDDL, setHrPositionDDL] = useState([]);
  const [allPolicies, setAllPolicies] = useState([]);
  const [existingPolicies, setExistingPolicies] = useState([]);

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
  const saveHandler = (values, cb) => {
    const {
      bu,
      wg,
      days,
      intWorkplaceList,
      intGender,
      intEmploymentTypeList,
      intEndServiceLengthInYear,
      intStartServiceLengthInYear,
      ...rest
    } = values;
    const serviceLengthList = tableData?.map((item, idx) => {
      return {
        intId: 0,
        intSerial: idx,
        intStartServiceLengthInYear: item?.intStartServiceLengthInYear?.value,
        intEndServiceLengthInYear: item?.intEndServiceLengthInYear?.value,
        intLveInDay: +item?.intLveInDay,
        isActive: true,
      };
    });
    const policyList = existingPolicies?.map((item) => item?.intPolicyId);
    const payload = {
      ...rest,
      policyId: params?.id || 0,
      isActive: true,
      serviceLengthList,
      workplaceList: intWorkplaceList?.map((item, index) => {
        const exists = existingPolicies?.some(
          (em) => em.intWorkplace === item.value
        );
        return {
          ...item,
          strWorkplaceName: item?.label,
          id: exists ? 1 : 0,
        };
      }),
      employmentTypeList: intEmploymentTypeList?.map((item) => {
        return {
          ...item,
          strEmploymentTypeName: item?.label,
          intEmploymentTypeId: item?.value,
        };
      }),
      intLeaveType: +values?.intLeaveType?.value,
      genderListDTO: intGender?.map((item) => {
        return {
          ...item,
          strGenderName: item?.label,
          intGenderId: item?.value,
        };
      }),
      intYear: +values?.intYear?.value,
      inPreviousLveTypeEnd: +values?.inPreviousLveTypeEnd?.value,
      intMaxLveDaySelf: +values?.intMaxLveDaySelf,
      intMaxLveApplicationSelfInMonth: +values?.intMaxLveApplicationSelfInMonth,
      intMaxLveApplicationSelfInYear: +values?.intMaxLveApplicationSelfInYear,
      intEncashableMonth: +values?.intEncashableMonth,
      intEndServiceLengthInYear: +values?.intEndServiceLengthInYear,
      intHalfdayMaxInMonth: +values?.intHalfdayMaxInMonth,
      intHalfdayMaxInYear: +values?.intHalfdayMaxInYear,
      intHalfdayPreviousLveTypeEnd:
        +values?.intHalfdayPreviousLveTypeEnd?.value,
      intMaxEncashableLveInDay: +values?.intMaxEncashableLveInDay,
      intAllocatedLveInDay: +values?.intAllocatedLveInDay,
      intCarryForwarExpiryMonth: +values?.intCarryForwarExpiryMonth?.value,
      intCarryForwarExpiryDay: +values?.intCarryForwarExpiryDay,
      intActiveFromJoiningdayInDay: +values?.intActiveFromJoiningdayInDay,
      intActiveFromConfirmationInDay: +values?.intActiveFromConfirmationInDay,
      howMuchMonth: +values?.howMuchMonth?.value,
      intCarryForwardMaxInDay: +values?.intCarryForwardMaxInDay,
      intCarryForwardMonth: +values?.intCarryForwardMonth?.value,
      intConpensatoryLveExpireInDays: +values?.intConpensatoryLveExpireInDays,
      intDayForOneEarnLve: +values?.intDayForOneEarnLve,
      intEarnLveInDay: +values?.intEarnLveInDay,
      intMaxForAdvLveInYear: +values?.intMaxForAdvLveInYear,
      intExistingPolicyIdList: policyList?.length > 0 ? policyList : [],
      hrPositionListDTO: [],
    };
    policyApi?.action({
      method: "POST",
      urlKey: "SaasMasterDataCRUDLeavePolicy",
      payload: payload,
      onSuccess: (data) => {
        toast.success(data?.message || "Submitted successfully", {
          toastId: "savePolicy",
        });
      },
    });
  };
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
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Position&BusinessUnitId=${buId}&intId=0&WorkplaceGroupId=${wgId}&intId=0`,
      "LeaveTypeId",
      "LeaveType",
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
  const remover = (payload) => {
    const filterArr = tableData.filter((itm, idx) => idx !== payload);
    setTableData(filterArr);
  };
  const removerPolicy = (payload) => {
    const filterArr = existingPolicies.filter((itm, idx) => idx !== payload);
    setExistingPolicies(filterArr);
    const temp = values?.intWorkplaceList?.filter(
      (item) => item?.value !== existingPolicies[payload]?.intWorkplace
    );
    values.intWorkplaceList = temp;
  };
  const {
    handleSubmit,
    values,
    errors,
    touched,
    setFieldValue,
    handleBlur,
    resetForm,
  } = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues: singleData?.autoId
      ? singleData
      : {
          ...initData,
          //  intGender: { value: 0, label: "Male & Female" }
        },

    onSubmit: (values, { setSubmitting, resetForm }) => {
      saveHandler(values, () => resetForm(initData));
    },
  });

  const isPolicyExist = (values) => {
    if (
      !values?.intLeaveType?.value ||
      !values?.intYear?.value ||
      values?.intGender?.length === 0 ||
      values?.intEmploymentTypeList?.length === 0 ||
      values?.intWorkplaceList?.length === 0
    ) {
      return;
    }

    const existingData = [];

    allPolicies?.forEach((policy, idx) => {
      if (
        policy.intLeaveType === values?.intLeaveType?.value &&
        policy.intYear === values?.intYear?.value
      ) {
        const isGenderExist = values?.intGender?.some(
          (itm) => itm.value === policy.intGenderId
        );
        const isEmploymentTypeExist = values?.intEmploymentTypeList?.some(
          (itm) => itm.Id === policy.intEmploymentId
        );
        const isWorkplaceExist = values?.intWorkplaceList?.some(
          (itm) => itm.value === policy.intWorkplace
        );
        if (isGenderExist && isEmploymentTypeExist && isWorkplaceExist) {
          existingData?.push(policy);
        }
      }
    });

    setExistingPolicies(existingData);
    // return existingData
  };
  // console.log(policyApi?.data, "policyApi?.data");
  // console.log({ workplaceDDL });
  return (
    <form onSubmit={handleSubmit}>
      <div className="leavePolicy-container table-card ">
        {/* btns */}
        <div className="table-card-heading ">
          <div className="d-flex align-items-center">
            <BackButton />
            <h2>{params?.id ? "Create Leave Policy" : "Edit Leave Policy"}</h2>
          </div>
          <ul className="d-flex flex-wrap">
            <li>
              <button
                type="button"
                className="btn btn-cancel mr-2"
                onClick={() => {
                  resetForm(initData);
                }}
              >
                Reset
              </button>
            </li>
            <li>
              <div
                type="submit"
                className="btn btn-default flex-center"
                onClick={(e) => {
                  e.preventDefault();
                  // resetForm(initData);
                  saveHandler(values, () => resetForm(initData));
                }}
              >
                Save
              </div>
            </li>
          </ul>
        </div>
        {/* -------------------------------- */}
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
                    <div className="col-lg-12">
                      {/* leave type */}
                      <div className="input-field-main d-flex ">
                        <label style={{ marginTop: "0.7em" }}>
                          Leave Type?
                        </label>
                        <div style={{ width: "140px", marginLeft: "0.5em" }}>
                          <FormikSelect
                            name="intLeaveType"
                            options={leaveTypeDDL}
                            menuPosition="fixed"
                            value={values?.intLeaveType}
                            label=""
                            onChange={(valueOption) => {
                              const temp = { ...values };

                              setFieldValue("intLeaveType", valueOption);
                              isPolicyExist({
                                ...temp,
                                intLeaveType: valueOption,
                              });
                              // isPolicyExist(values);
                              setFieldValue("isCompensatoryLve", false);
                              setFieldValue("isEarnLeave", false);
                              setFieldValue("isDependOnServiceLength", false);
                              setFieldValue("isProdataBasis", false);
                              if (valueOption?.label === "Earn Leave") {
                                setFieldValue("isEarnLeave", true);
                              } else if (
                                valueOption?.label === "Compensatory Leave"
                              ) {
                                setFieldValue("isCompensatoryLve", true);
                              }
                            }}
                            placeholder=" "
                            styles={customStyles}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                      {/* display name */}
                      <div className="input-field-main d-flex ">
                        <label style={{ marginTop: "0.7em" }}>
                          Leave Display Name
                        </label>
                        <div style={{ width: "140px", marginLeft: "0.5em" }}>
                          <DefaultInput
                            classes="input-sm"
                            value={values?.strDisplayName}
                            placeholder=""
                            name="strDisplayName"
                            type="text"
                            className="form-control"
                            onChange={(e) => {
                              setFieldValue("strDisplayName", e.target.value);
                            }}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                      {/* Previous Leave Type End */}
                      <div className="input-field-main d-flex ">
                        <label style={{ marginTop: "0.7em" }}>
                          Previous Leave Type End
                        </label>
                        <div style={{ width: "140px", marginLeft: "0.5em" }}>
                          <FormikSelect
                            name="inPreviousLveTypeEnd"
                            options={[
                              { value: 0, label: "None" },
                              ...leaveTypeDDL?.filter(
                                (item) =>
                                  item?.value !== values?.intLeaveType?.value
                              ),
                            ]}
                            menuPosition="fixed"
                            value={values?.inPreviousLveTypeEnd}
                            label=""
                            onChange={(valueOption) => {
                              setFieldValue(
                                "inPreviousLveTypeEnd",
                                valueOption
                              );
                            }}
                            placeholder=" "
                            styles={customStyles}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                      {/* Max Leave Available from Self  */}
                      <div className="input-field-main d-flex ">
                        <label style={{ marginTop: "0.7em" }}>
                          Max Leave Available from Self
                        </label>
                        <div style={{ width: "140px", marginLeft: "0.5em" }}>
                          <DefaultInput
                            min={0}
                            placeholder=" "
                            inputClasses="w-80"
                            classes="input-sm"
                            value={values?.intMaxLveDaySelf}
                            onChange={(e) => {
                              setFieldValue("intMaxLveDaySelf", e.target.value);
                            }}
                            name="intMaxLveDaySelf"
                            type="number"
                            // className="form-control"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                      {/* Max Leave Application In Month   */}
                      <div className="input-field-main d-flex ">
                        <label style={{ marginTop: "0.7em" }}>
                          Max Leave Application In Month
                        </label>
                        <div style={{ width: "140px", marginLeft: "0.5em" }}>
                          <DefaultInput
                            min={0}
                            placeholder=" "
                            inputClasses="w-80"
                            classes="input-sm"
                            value={values?.intMaxLveApplicationSelfInMonth}
                            onChange={(e) => {
                              setFieldValue(
                                "intMaxLveApplicationSelfInMonth",
                                e.target.value
                              );
                            }}
                            name="intMaxLveApplicationSelfInMonth"
                            type="number"
                            // className="form-control"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                      {/*Max Leave Application In Year  */}
                      <div className="input-field-main d-flex ">
                        <label style={{ marginTop: "0.7em" }}>
                          Max Leave Application In Year
                        </label>
                        <div style={{ width: "140px", marginLeft: "0.5em" }}>
                          <DefaultInput
                            min={0}
                            placeholder=" "
                            inputClasses="w-80"
                            classes="input-sm"
                            value={values?.intMaxLveApplicationSelfInYear}
                            onChange={(e) => {
                              setFieldValue(
                                "intMaxLveApplicationSelfInYear",
                                e.target.value
                              );
                            }}
                            name="intMaxLveApplicationSelfInYear"
                            type="number"
                            // className="form-control"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                  {/* --------------------- */}
                  {/* employee */}
                  <>
                    <div className="col-12">
                      <h2>Employee Configuration</h2>
                    </div>
                    <div
                      className="col-12"
                      style={{ marginBottom: "12px" }}
                    ></div>
                    <div className="col-lg-12">
                      {/* Employment Type */}
                      <div className="input-field-main d-flex ">
                        <label style={{ marginTop: "0.7em" }}>
                          Employment Type
                        </label>
                        <div style={{ width: "230px", marginLeft: "0.5em" }}>
                          <FormikSelect
                            placeholder=" "
                            isClearable={false}
                            classes="input-sm"
                            styles={{
                              ...customStyles,
                              control: (provided, state) => ({
                                ...provided,
                                minHeight: "auto",
                                height:
                                  values?.intEmploymentTypeList?.length > 1
                                    ? "auto"
                                    : "30px",
                                borderRadius: "4px",
                                boxShadow: `${success500}!important`,
                                ":hover": {
                                  borderColor: `${gray600}!important`,
                                },
                                ":focus": {
                                  borderColor: `${gray600}!important`,
                                },
                              }),
                              valueContainer: (provided, state) => ({
                                ...provided,
                                height:
                                  values?.intEmploymentTypeList?.length > 1
                                    ? "auto"
                                    : "30px",
                                padding: "0 6px",
                              }),
                              multiValue: (styles) => {
                                return {
                                  ...styles,
                                  position: "relative",
                                  top: "-1px",
                                };
                              },
                              multiValueLabel: (styles) => ({
                                ...styles,
                                padding: "0",
                              }),
                            }}
                            name="intEmploymentTypeList"
                            options={
                              values?.intEmploymentTypeList &&
                              values?.intEmploymentTypeList?.filter(
                                (itm) => itm.label === "All"
                              ).length > 0
                                ? [{ value: 0, label: "All" }]
                                : values?.intEmploymentTypeList?.length > 0
                                ? [...employmentTypeDDL]
                                : [...employmentTypeDDL] || []
                            }
                            value={values?.intEmploymentTypeList}
                            onChange={(valueOption) => {
                              setFieldValue(
                                "intEmploymentTypeList",
                                valueOption
                              );
                              const temp = { ...values };
                              // isPolicyExist(values);

                              isPolicyExist({
                                ...temp,
                                intEmploymentTypeList: valueOption,
                              });
                            }}
                            isMulti
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                      {/* Gender */}
                      <div className="input-field-main d-flex ">
                        <label style={{ marginTop: "0.7em" }}>Gender</label>
                        <div style={{ width: "140px", marginLeft: "0.5em" }}>
                          <FormikSelect
                            placeholder=" "
                            isClearable={false}
                            classes="input-sm"
                            styles={{
                              ...customStyles,
                              control: (provided, state) => ({
                                ...provided,
                                minHeight: "auto",
                                height:
                                  values?.intGender?.length > 1
                                    ? "auto"
                                    : "30px",
                                borderRadius: "4px",
                                boxShadow: `${success500}!important`,
                                ":hover": {
                                  borderColor: `${gray600}!important`,
                                },
                                ":focus": {
                                  borderColor: `${gray600}!important`,
                                },
                              }),
                              valueContainer: (provided, state) => ({
                                ...provided,
                                height:
                                  values?.intGender?.length > 1
                                    ? "auto"
                                    : "30px",
                                padding: "0 6px",
                              }),
                              multiValue: (styles) => {
                                return {
                                  ...styles,
                                  position: "relative",
                                  top: "-1px",
                                };
                              },
                              multiValueLabel: (styles) => ({
                                ...styles,
                                padding: "0",
                              }),
                            }}
                            name="intGender"
                            options={[
                              { value: 1, label: "Male" },
                              { value: 2, label: "Female" },
                            ]}
                            value={values?.intGender}
                            onChange={(valueOption) => {
                              setFieldValue("intGender", valueOption);
                              const temp = { ...values };
                              isPolicyExist({
                                ...temp,
                                intGender: valueOption,
                              });
                            }}
                            isMulti
                            errors={errors}
                            touched={touched}
                          />{" "}
                        </div>
                      </div>
                      {/* hr position */}
                      <div className="input-field-main d-flex ">
                        <label style={{ marginTop: "0.7em" }}>
                          HR Position
                        </label>
                        <div style={{ width: "140px", marginLeft: "0.5em" }}>
                          <FormikSelect
                            placeholder=" "
                            isClearable={false}
                            classes="input-sm"
                            styles={{
                              ...customStyles,
                              control: (provided, state) => ({
                                ...provided,
                                minHeight: "auto",
                                height:
                                  values?.hrPositionListDTO?.length > 1
                                    ? "auto"
                                    : "30px",
                                borderRadius: "4px",
                                boxShadow: `${success500}!important`,
                                ":hover": {
                                  borderColor: `${gray600}!important`,
                                },
                                ":focus": {
                                  borderColor: `${gray600}!important`,
                                },
                              }),
                              valueContainer: (provided, state) => ({
                                ...provided,
                                height:
                                  values?.hrPositionListDTO?.length > 1
                                    ? "auto"
                                    : "30px",
                                padding: "0 6px",
                              }),
                              multiValue: (styles) => {
                                return {
                                  ...styles,
                                  position: "relative",
                                  top: "-1px",
                                };
                              },
                              multiValueLabel: (styles) => ({
                                ...styles,
                                padding: "0",
                              }),
                            }}
                            name="intGender"
                            options={hrPositionDDL || []}
                            value={values?.hrPositionListDTO}
                            onChange={(valueOption) => {
                              setFieldValue("hrPositionListDTO", valueOption);
                              const temp = { ...values };
                              isPolicyExist({
                                ...temp,
                                hrPositionListDTO: valueOption,
                              });
                            }}
                            isMulti
                            errors={errors}
                            touched={touched}
                          />{" "}
                        </div>
                      </div>
                      {/* Year */}
                      <div className="input-field-main d-flex ">
                        <label style={{ marginTop: "0.7em" }}>Year</label>
                        <div style={{ width: "140px", marginLeft: "0.5em" }}>
                          <FormikSelect
                            name="intYear"
                            options={yearDDLAction()}
                            value={values?.intYear}
                            label=""
                            onChange={(valueOption) => {
                              setFieldValue("intYear", valueOption);
                              const temp = { ...values };
                              isPolicyExist({
                                ...temp,
                                intYear: valueOption,
                              });
                            }}
                            menuPosition="fixed"
                            placeholder=" "
                            styles={customStyles}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                      {/* Allocated Leave in Day  */}
                      <div className="input-field-main d-flex ">
                        <label style={{ marginTop: "0.7em" }}>
                          Allocated Leave in Day
                        </label>
                        <div style={{ width: "140px", marginLeft: "0.5em" }}>
                          <DefaultInput
                            min={0}
                            placeholder=" "
                            inputClasses="w-80"
                            classes="input-sm"
                            value={values?.intAllocatedLveInDay}
                            onChange={(e) => {
                              setFieldValue(
                                "intAllocatedLveInDay",
                                e.target.value
                              );
                            }}
                            disabled={
                              values?.isDependOnServiceLength ||
                              values?.intLeaveType?.label === "Earn Leave" ||
                              values?.intLeaveType?.label ===
                                "Compensatory Leave"
                            }
                            name="intAllocatedLveInDay"
                            type="number"
                            // className="form-control"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>

                      {/*Active From Joining day In Day  */}
                      <div className="input-field-main d-flex ">
                        <label style={{ marginTop: "0.7em" }}>
                          Active From Joining day In Day
                        </label>
                        <div style={{ width: "140px", marginLeft: "0.5em" }}>
                          <DefaultInput
                            min={0}
                            step="any"
                            placeholder=" "
                            inputClasses="w-80"
                            classes="input-sm"
                            value={values?.intActiveFromJoiningdayInDay}
                            onChange={(e) => {
                              setFieldValue(
                                "intActiveFromJoiningdayInDay",
                                e.target.value
                              );
                            }}
                            name="intActiveFromJoiningdayInDay"
                            type="number"
                            // className="form-control"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                      {/*Active From Confirmation In Day */}
                      <div className="input-field-main d-flex ">
                        <label style={{ marginTop: "0.7em" }}>
                          Active From Confirmation In Day
                        </label>
                        <div style={{ width: "140px", marginLeft: "0.5em" }}>
                          <DefaultInput
                            min={0}
                            step="any"
                            placeholder=" "
                            inputClasses="w-80"
                            classes="input-sm"
                            value={values?.intActiveFromConfirmationInDay}
                            onChange={(e) => {
                              setFieldValue(
                                "intActiveFromConfirmationInDay",
                                e.target.value
                              );
                            }}
                            name="intActiveFromConfirmationInDay"
                            type="number"
                            // className="form-control"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>

                      {/* service length */}
                      <div className="d-flex align-items-center small-checkbox">
                        <FormikCheckBox
                          styleObj={{
                            color: gray900,
                            checkedColor: greenColor,
                          }}
                          label="Depends on Service Length"
                          checked={values?.isDependOnServiceLength}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFieldValue("intAllocatedLveInDay", "");
                            } else {
                              setFieldValue("intStartServiceLengthInYear", "");
                              setFieldValue("intEndServiceLengthInYear", "");
                              setFieldValue("intLveInDay", "");
                              setTableData([]);
                            }
                            setFieldValue(
                              "isDependOnServiceLength",
                              e.target.checked
                            );
                          }}
                          disabled={
                            values?.intLeaveType?.label === "Earn Leave" ||
                            values?.intLeaveType?.label === "Compensatory Leave"
                          }
                          labelFontSize="12px"
                        />
                      </div>
                      {/* Starting Service Length In Year */}
                      <div className="input-field-main d-flex ">
                        <label style={{ marginTop: "0.7em" }}>
                          Starting Service Length In Years
                        </label>
                        <div style={{ width: "80px", marginLeft: "0.5em" }}>
                          <FormikSelect
                            name="intStartServiceLengthInYear"
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
                            menuPosition="fixed"
                            value={values?.intStartServiceLengthInYear}
                            label=""
                            onChange={(valueOption) => {
                              setFieldValue(
                                "intStartServiceLengthInYear",
                                valueOption
                              );
                            }}
                            placeholder=" "
                            styles={customStyles}
                            errors={errors}
                            isDisabled={!values?.isDependOnServiceLength}
                            touched={touched}
                          />
                        </div>
                      </div>
                      {/*End Service Length in Years*/}
                      <div className="input-field-main d-flex ">
                        <label style={{ marginTop: "0.7em" }}>
                          End Service Length in Years
                        </label>
                        <div style={{ width: "120px", marginLeft: "0.5em" }}>
                          <FormikSelect
                            isDisabled={!values?.isDependOnServiceLength}
                            name="intEndServiceLengthInYear"
                            options={[
                              { value: 100, label: "Above(100)" },
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
                            menuPosition="fixed"
                            value={values?.intEndServiceLengthInYear}
                            label=""
                            onChange={(valueOption) => {
                              setFieldValue(
                                "intEndServiceLengthInYear",
                                valueOption
                              );
                            }}
                            placeholder=" "
                            styles={customStyles}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                      {/*Leave in Days */}
                      <div className="input-field-main d-flex ">
                        <label style={{ marginTop: "0.7em" }}>
                          Leave in Days
                        </label>
                        <div
                          style={{
                            width: "80px",
                            marginLeft: "0.5em",
                            padding: "0",
                          }}
                        >
                          <DefaultInput
                            // label="Days"
                            placeholder=" "
                            inputClasses="w-80"
                            classes="input-sm"
                            value={values?.intLveInDay}
                            onChange={(e) => {
                              setFieldValue("intLveInDay", e.target.value);
                            }}
                            name="intLveInDay"
                            type="number"
                            step="any"
                            min={0}
                            disabled={!values?.isDependOnServiceLength}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <>
                          <button
                            type="button"
                            className="btn add-ddl-btn "
                            style={{
                              margin: "0.4em 0 0 0.7em",
                              padding: "0.2em",
                            }}
                            onClick={() => {
                              if (
                                values?.intEndServiceLengthInYear === "" ||
                                values?.intLveInDay === "" ||
                                values?.intStartServiceLengthInYear === ""
                              ) {
                                return toast.warn("Please fill up the fields");
                              }
                              setTableData((prev) => [
                                ...prev,
                                {
                                  intStartServiceLengthInYear:
                                    values?.intStartServiceLengthInYear,
                                  intEndServiceLengthInYear:
                                    values?.intEndServiceLengthInYear,
                                  intLveInDay: values?.intLveInDay,
                                },
                              ]);
                              setFieldValue("intStartServiceLengthInYear", "");
                              setFieldValue("intEndServiceLengthInYear", "");
                              setFieldValue("intLveInDay", "");
                            }}
                          >
                            <AddOutlined sx={{ fontSize: "16px" }} />
                          </button>
                        </>
                      </div>
                      {tableData?.length > 0 && (
                        <div
                          className="table-card-body pt-3 w-25"
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
                                              {item?.intStartServiceLengthInYear
                                                ?.label ===
                                              item?.intEndServiceLengthInYear
                                                ?.label
                                                ? `${item?.intEndServiceLengthInYear?.label}
                                              "years"`
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
                    </div>
                  </>
                  {/* -------------------------- */}
                  {/* compensatory */}
                  {values?.intLeaveType?.label === "Compensatory Leave" ? (
                    <>
                      <div className="col-12">
                        <h2>Compensatory Leave Configuration</h2>
                      </div>
                      <div
                        className="col-12"
                        style={{ marginBottom: "12px" }}
                      ></div>

                      <div className="col-lg-12">
                        {/* Compensatory Type */}
                        <div className="d-flex align-items-center small-checkbox">
                          <FormikCheckBox
                            styleObj={{
                              color: gray900,
                              checkedColor: greenColor,
                            }}
                            label="Compensatory Leave Expire"
                            checked={values?.isConpensatoryLveExpire}
                            onChange={(e) => {
                              setFieldValue(
                                "isConpensatoryLveExpire",
                                e.target.checked
                              );
                            }}
                            labelFontSize="12px"
                          />
                        </div>
                        {/* Conpensatory Leave Expire In Days */}
                        <div className="input-field-main d-flex ">
                          <label style={{ marginTop: "0.7em" }}>
                            Conpensatory Leave Expire In Days
                          </label>
                          <div style={{ width: "140px", marginLeft: "0.5em" }}>
                            <DefaultInput
                              min={0}
                              placeholder=" "
                              inputClasses="w-80"
                              classes="input-sm"
                              value={values?.intConpensatoryLveExpireInDays}
                              onChange={(e) => {
                                setFieldValue(
                                  "intConpensatoryLveExpireInDays",
                                  e.target.value
                                );
                              }}
                              name="intConpensatoryLveExpireInDays"
                              type="number"
                              // className="form-control"
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  ) : null}
                  {/* ----------------------------------------- */}
                  {/* Earn Leave*/}
                  {values?.intLeaveType?.label === "Earn Leave" ? (
                    <>
                      <div className="col-12">
                        <h2>Earn Leave Configuration</h2>
                      </div>
                      <div
                        className="col-12"
                        style={{ marginBottom: "12px" }}
                      ></div>

                      <div className="col-lg-12">
                        {/* Earn Type */}
                        <div className="d-flex align-items-center small-checkbox">
                          <FormikCheckBox
                            styleObj={{
                              color: gray900,
                              checkedColor: greenColor,
                            }}
                            label="Earn Leave Include Offday"
                            checked={values?.isEarnLveIncludeOffday}
                            onChange={(e) => {
                              setFieldValue(
                                "isEarnLveIncludeOffday",
                                e.target.checked
                              );
                            }}
                            labelFontSize="12px"
                          />
                        </div>
                        <div className="d-flex align-items-center small-checkbox">
                          <FormikCheckBox
                            styleObj={{
                              color: gray900,
                              checkedColor: greenColor,
                            }}
                            label="Earn Leave Include Holiday"
                            checked={values?.isEarnLveIncludeHoliday}
                            onChange={(e) => {
                              setFieldValue(
                                "isEarnLveIncludeHoliday",
                                e.target.checked
                              );
                            }}
                            labelFontSize="12px"
                          />
                        </div>
                        {/* Day For One Earn Leave*/}
                        <div className="input-field-main d-flex ">
                          <label style={{ marginTop: "0.7em" }}>
                            Day For One Earn Leave
                          </label>
                          <div style={{ width: "140px", marginLeft: "0.5em" }}>
                            <DefaultInput
                              // label="Days"
                              step="any"
                              placeholder=" "
                              inputClasses="w-80"
                              classes="input-sm"
                              value={values?.intDayForOneEarnLve}
                              onChange={(e) => {
                                setFieldValue(
                                  "intDayForOneEarnLve",
                                  e.target.value
                                );
                              }}
                              name="intDayForOneEarnLve"
                              type="number"
                              // className="form-control"
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </div>
                        {/*  Earn Leave*/}
                        <div className="input-field-main d-flex ">
                          <label style={{ marginTop: "0.7em" }}>
                            Earn Leave In Day
                          </label>
                          <div style={{ width: "140px", marginLeft: "0.5em" }}>
                            <DefaultInput
                              // label="Days"
                              step="any"
                              placeholder=" "
                              inputClasses="w-80"
                              classes="input-sm"
                              value={values?.intEarnLveInDay}
                              onChange={(e) => {
                                setFieldValue(
                                  "intEarnLveInDay",
                                  e.target.value
                                );
                              }}
                              name="intEarnLveInDay"
                              type="number"
                              // className="form-control"
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  ) : null}

                  {/* --------------------------- */}
                  {/* half Leave*/}

                  <>
                    <div className="col-12">
                      <h2>Half Leave Configuration</h2>
                    </div>
                    <div
                      className="col-12"
                      style={{ marginBottom: "12px" }}
                    ></div>

                    <div className="col-lg-12">
                      {/* Half leave */}
                      <div className="d-flex align-items-center small-checkbox">
                        <FormikCheckBox
                          styleObj={{
                            color: gray900,
                            checkedColor: greenColor,
                          }}
                          label="Half Day Leave"
                          checked={values?.isHalfDayLeave}
                          onChange={(e) => {
                            setFieldValue("isHalfDayLeave", e.target.checked);
                          }}
                          labelFontSize="12px"
                        />
                      </div>
                      {/* Half day Max In Month*/}
                      <div className="input-field-main d-flex ">
                        <label style={{ marginTop: "0.7em" }}>
                          Half day Max In Month
                        </label>
                        <div style={{ width: "140px", marginLeft: "0.5em" }}>
                          <DefaultInput
                            min={0}
                            placeholder=" "
                            inputClasses="w-80"
                            classes="input-sm"
                            value={values?.intHalfdayMaxInMonth}
                            onChange={(e) => {
                              setFieldValue(
                                "intHalfdayMaxInMonth",
                                e.target.value
                              );
                            }}
                            name="intHalfdayMaxInMonth"
                            type="number"
                            disabled={!values?.isHalfDayLeave}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                      {/*  Half day Max In Year*/}
                      <div className="input-field-main d-flex ">
                        <label style={{ marginTop: "0.7em" }}>
                          Half day Max In Year
                        </label>
                        <div style={{ width: "140px", marginLeft: "0.5em" }}>
                          <DefaultInput
                            // label="Days"
                            placeholder=" "
                            inputClasses="w-80"
                            classes="input-sm"
                            value={values?.intHalfdayMaxInYear}
                            onChange={(e) => {
                              setFieldValue(
                                "intHalfdayMaxInYear",
                                e.target.value
                              );
                            }}
                            name="intHalfdayMaxInYear"
                            type="number"
                            disabled={!values?.isHalfDayLeave}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                      {/*  Half day Previous Leave End*/}
                      <div className="input-field-main d-flex ">
                        <label style={{ marginTop: "0.7em" }}>
                          Half day Previous Leave End
                        </label>
                        <div style={{ width: "170px", marginLeft: "0.5em" }}>
                          <FormikSelect
                            name="intHalfdayPreviousLveTypeEnd"
                            options={[
                              { value: 0, label: "None" },
                              ...leaveTypeDDL,
                            ]}
                            menuPosition="fixed"
                            value={values?.intHalfdayPreviousLveTypeEnd}
                            label=""
                            onChange={(valueOption) => {
                              setFieldValue(
                                "intHalfdayPreviousLveTypeEnd",
                                valueOption
                              );
                            }}
                            placeholder=" "
                            isDisabled={!values?.isHalfDayLeave}
                            styles={customStyles}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                  {/* --------------------------- */}
                  {/* Carry Leave*/}

                  <>
                    <div className="col-12">
                      <h2>Carry Forward Configuration</h2>
                    </div>
                    <div
                      className="col-12"
                      style={{ marginBottom: "12px" }}
                    ></div>

                    <div className="col-lg-12">
                      {/* Carry leave */}
                      <div className="d-flex align-items-center small-checkbox">
                        <FormikCheckBox
                          styleObj={{
                            color: gray900,
                            checkedColor: greenColor,
                          }}
                          label="Carry Forward"
                          checked={values?.isCarryForward}
                          onChange={(e) => {
                            setFieldValue("isCarryForward", e.target.checked);
                          }}
                          labelFontSize="12px"
                        />
                      </div>
                      {/* Carry Forward Max In Day*/}
                      <div className="input-field-main d-flex ">
                        <label style={{ marginTop: "0.7em" }}>
                          Carry Forward Max In Day
                        </label>
                        <div style={{ width: "140px", marginLeft: "0.5em" }}>
                          <DefaultInput
                            min={0}
                            step="any"
                            placeholder=" "
                            inputClasses="w-80"
                            classes="input-sm"
                            value={values?.intCarryForwardMaxInDay}
                            onChange={(e) => {
                              setFieldValue(
                                "intCarryForwardMaxInDay",
                                e.target.value
                              );
                            }}
                            name="intCarryForwardMaxInDay"
                            type="number"
                            disabled={!values?.isCarryForward}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                      {/*  Carry Forward Expiry Day*/}
                      <div className="input-field-main d-flex ">
                        <label style={{ marginTop: "0.7em" }}>
                          Carry Forward Expiry Day{" "}
                        </label>
                        <div style={{ width: "170px", marginLeft: "0.5em" }}>
                          <DefaultInput
                            min={1}
                            max={31}
                            placeholder=" "
                            inputClasses="w-80"
                            classes="input-sm"
                            value={values?.intCarryForwarExpiryDay}
                            onChange={(e) => {
                              setFieldValue(
                                "intCarryForwarExpiryDay",
                                e.target.value
                              );
                            }}
                            name="intCarryForwarExpiryDay"
                            type="number"
                            disabled={!values?.isCarryForward}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                      {/*  CF Month*/}
                      <div className="input-field-main d-flex ">
                        <label style={{ marginTop: "0.7em" }}>
                          Carry Forward Month
                        </label>
                        <div style={{ width: "120px", marginLeft: "0.5em" }}>
                          <FormikSelect
                            name="intCarryForwardMonth"
                            options={monthDDL}
                            menuPosition="fixed"
                            value={values?.intCarryForwardMonth}
                            label=""
                            onChange={(valueOption) => {
                              setFieldValue(
                                "intCarryForwardMonth",
                                valueOption
                              );
                            }}
                            placeholder=" "
                            styles={customStyles}
                            errors={errors}
                            isDisabled={!values?.isCarryForward}
                            touched={touched}
                          />
                        </div>
                      </div>
                      {/*  CF Expire Month*/}
                      <div className="input-field-main d-flex ">
                        <label style={{ marginTop: "0.7em" }}>
                          Carry Forwar Expiry Month
                        </label>
                        <div style={{ width: "120px", marginLeft: "0.5em" }}>
                          <FormikSelect
                            name="intCarryForwarExpiryMonth"
                            options={monthDDL}
                            menuPosition="fixed"
                            value={values?.intCarryForwarExpiryMonth}
                            label=""
                            onChange={(valueOption) => {
                              setFieldValue(
                                "intCarryForwarExpiryMonth",
                                valueOption
                              );
                            }}
                            placeholder=" "
                            isDisabled={!values?.isCarryForward}
                            styles={customStyles}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                  {/* --------------------------- */}
                  {/* encash Leave*/}

                  <>
                    <div className="col-12">
                      <h2>Encashable Configuration</h2>
                    </div>
                    <div
                      className="col-12"
                      style={{ marginBottom: "12px" }}
                    ></div>

                    <div className="col-lg-12">
                      {/* encash leave */}
                      <div className="d-flex align-items-center small-checkbox">
                        <FormikCheckBox
                          styleObj={{
                            color: gray900,
                            checkedColor: greenColor,
                          }}
                          label="Encashable"
                          checked={values?.isEncashable}
                          onChange={(e) => {
                            setFieldValue("isEncashable", e.target.checked);
                          }}
                          labelFontSize="12px"
                        />
                      </div>
                      {/* Max Encashable */}
                      <div className="input-field-main d-flex ">
                        <label style={{ marginTop: "0.7em" }}>
                          Max Encashable
                        </label>
                        <div style={{ width: "140px", marginLeft: "0.5em" }}>
                          <DefaultInput
                            min={0}
                            placeholder=" "
                            inputClasses="w-80"
                            classes="input-sm"
                            value={values?.IntMaxEncashableLveInDay}
                            onChange={(e) => {
                              setFieldValue(
                                "IntMaxEncashableLveInDay",
                                e.target.value
                              );
                            }}
                            disabled={!values?.isEncashable}
                            name="IntMaxEncashableLveInDay"
                            type="number"
                            // className="form-control"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                      {/*  Encashable Month*/}
                      <div className="input-field-main d-flex ">
                        <label style={{ marginTop: "0.7em" }}>
                          Encashable Month{" "}
                        </label>
                        <div style={{ width: "170px", marginLeft: "0.5em" }}>
                          <DefaultInput
                            min={0}
                            placeholder=" "
                            classes="input-sm"
                            value={values?.intEncashableMonth}
                            onChange={(e) => {
                              setFieldValue(
                                "intEncashableMonth",
                                e.target.value
                              );
                            }}
                            name="intEncashableMonth"
                            type="number"
                            disabled={!values?.isEncashable}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                  {/* --------------------------- */}
                  {/* others */}

                  <>
                    <div className="col-12">
                      <h2>Other Configurations</h2>
                    </div>
                    <div
                      className="col-12"
                      style={{ marginBottom: "12px" }}
                    ></div>

                    <div className="col-lg-12">
                      {/* Month Wise Expired  */}
                      <div className="d-flex align-items-center small-checkbox">
                        <FormikCheckBox
                          styleObj={{
                            color: gray900,
                            checkedColor: greenColor,
                          }}
                          label="Month Wise Expired"
                          checked={values?.isMonthWiseExpired}
                          onChange={(e) => {
                            setFieldValue(
                              "isMonthWiseExpired",
                              e.target.checked
                            );
                          }}
                          labelFontSize="12px"
                        />
                      </div>
                      {/* How Much Month */}
                      <div className="input-field-main d-flex ">
                        <label style={{ marginTop: "0.7em" }}>
                          How Much Month
                        </label>
                        <div style={{ width: "120px", marginLeft: "0.5em" }}>
                          <FormikSelect
                            name="howMuchMonth"
                            options={monthDDL}
                            menuPosition="fixed"
                            value={values?.howMuchMonth}
                            label=""
                            onChange={(valueOption) => {
                              setFieldValue("howMuchMonth", valueOption);
                            }}
                            placeholder=" "
                            isDisabled={!values?.isMonthWiseExpired}
                            styles={customStyles}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>

                      {/* isAdvanceLeave  */}
                      <div className="d-flex align-items-center small-checkbox">
                        <FormikCheckBox
                          styleObj={{
                            color: gray900,
                            checkedColor: greenColor,
                          }}
                          label="Advance Leave"
                          checked={values?.isAdvanceLeave}
                          onChange={(e) => {
                            setFieldValue("isAdvanceLeave", e.target.checked);
                          }}
                          labelFontSize="12px"
                        />
                      </div>
                      {/* intMaxForAdvLveInYear */}
                      <div className="input-field-main d-flex ">
                        <label style={{ marginTop: "0.7em" }}>
                          Max Advance Leave in Year
                        </label>
                        <div style={{ width: "120px", marginLeft: "0.5em" }}>
                          <DefaultInput
                            min={0}
                            placeholder=" "
                            inputClasses="w-80"
                            classes="input-sm"
                            value={values?.intMaxForAdvLveInYear}
                            onChange={(e) => {
                              setFieldValue(
                                "intMaxForAdvLveInYear",
                                e.target.value
                              );
                            }}
                            disabled={!values?.isAdvanceLeave}
                            name="intMaxForAdvLveInYear"
                            type="number"
                            // className="form-control"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>

                      {/* Minute Based */}
                      <div className="d-flex align-items-center small-checkbox">
                        <FormikCheckBox
                          styleObj={{
                            color: gray900,
                            checkedColor: greenColor,
                          }}
                          label="Minute Based"
                          checked={values?.isMinuteBased}
                          onChange={(e) => {
                            setFieldValue("isMinuteBased", e.target.checked);
                          }}
                          labelFontSize="12px"
                        />
                      </div>
                      {/* offday */}
                      <div className="d-flex align-items-center small-checkbox">
                        <FormikCheckBox
                          styleObj={{
                            color: gray900,
                            checkedColor: greenColor,
                          }}
                          label="Include Offday"
                          checked={values?.isIncludeOffday}
                          onChange={(e) => {
                            setFieldValue("isIncludeOffday", e.target.checked);
                          }}
                          labelFontSize="12px"
                        />
                      </div>
                      {/* holiday */}
                      <div className="d-flex align-items-center small-checkbox">
                        <FormikCheckBox
                          styleObj={{
                            color: gray900,
                            checkedColor: greenColor,
                          }}
                          label="Include Holiday"
                          checked={values?.isIncludeHoliday}
                          onChange={(e) => {
                            setFieldValue("isIncludeHoliday", e.target.checked);
                          }}
                          labelFontSize="12px"
                        />
                      </div>
                      {/* selfservice */}
                      <div className="d-flex align-items-center small-checkbox">
                        <FormikCheckBox
                          styleObj={{
                            color: gray900,
                            checkedColor: greenColor,
                          }}
                          label="Balance Show For SelfService"
                          checked={values?.isLveBalanceShowForSelfService}
                          onChange={(e) => {
                            setFieldValue(
                              "isLveBalanceShowForSelfService",
                              e.target.checked
                            );
                          }}
                          labelFontSize="12px"
                        />
                      </div>
                      {/* selfservice */}
                      <div className="d-flex align-items-center small-checkbox">
                        <FormikCheckBox
                          styleObj={{
                            color: gray900,
                            checkedColor: greenColor,
                          }}
                          label="Leave Apply For SelfService"
                          checked={values?.isLveBalanceApplyForSelfService}
                          onChange={(e) => {
                            setFieldValue(
                              "isLveBalanceApplyForSelfService",
                              e.target.checked
                            );
                          }}
                          labelFontSize="12px"
                        />
                      </div>
                      {/* Applicable Before And After Offday */}
                      <div className="d-flex align-items-center small-checkbox">
                        <FormikCheckBox
                          styleObj={{
                            color: gray900,
                            checkedColor: greenColor,
                          }}
                          label="Applicable Before And After Offday"
                          checked={values?.isApplicableBeforeAndAfterOffday}
                          onChange={(e) => {
                            setFieldValue(
                              "isApplicableBeforeAndAfterOffday",
                              e.target.checked
                            );
                          }}
                          labelFontSize="12px"
                        />
                      </div>
                      {/* Applicable Before And After Holiday */}
                      <div className="d-flex align-items-center small-checkbox">
                        <FormikCheckBox
                          styleObj={{
                            color: gray900,
                            checkedColor: greenColor,
                          }}
                          label="Applicable Before And After Holiday"
                          checked={values?.isApplicableBeforeAndAfterHoliday}
                          onChange={(e) => {
                            setFieldValue(
                              "isApplicableBeforeAndAfterHoliday",
                              e.target.checked
                            );
                          }}
                          labelFontSize="12px"
                        />
                      </div>
                      {/* auto renew */}
                      <div className="d-flex align-items-center small-checkbox">
                        <FormikCheckBox
                          styleObj={{
                            color: gray900,
                            checkedColor: greenColor,
                          }}
                          label="Auto Renewable"
                          checked={values?.isAutoRenewable}
                          onChange={(e) => {
                            setFieldValue("isAutoRenewable", e.target.checked);
                          }}
                          labelFontSize="12px"
                        />
                      </div>
                      {/* Prodata  */}

                      <div className="d-flex align-items-center small-checkbox">
                        <FormikCheckBox
                          styleObj={{
                            color: gray900,
                            checkedColor: greenColor,
                          }}
                          label="Prodata Basis"
                          checked={values?.isProdataBasis}
                          onChange={(e) => {
                            setFieldValue("isProdataBasis", e.target.checked);
                          }}
                          labelFontSize="12px"
                          disabled={
                            values?.intLeaveType?.label === "Earn Leave" ||
                            values?.intLeaveType?.label === "Compensatory Leave"
                          }
                        />
                      </div>
                      {/* Generate  */}

                      <div className="d-flex align-items-center small-checkbox">
                        <FormikCheckBox
                          styleObj={{
                            color: gray900,
                            checkedColor: greenColor,
                          }}
                          label="Do you want assign right now?"
                          checked={values?.isGenerate}
                          onChange={(e) => {
                            setFieldValue("isGenerate", e.target.checked);
                          }}
                          labelFontSize="12px"
                        />
                      </div>
                    </div>
                  </>
                  {/* Orgnization */}

                  <>
                    <div className="col-12">
                      <h2>Organization Configurations</h2>
                    </div>
                    <div
                      className="col-12"
                      style={{ marginBottom: "12px" }}
                    ></div>

                    <div className="col-lg-12">
                      {/*Business Unit  */}
                      {values?.intWorkplaceList?.length ===
                      workplaceDDL?.length ? (
                        <>
                          <div className="input-field-main d-flex ">
                            <label style={{ marginTop: "0.7em" }}>
                              Business Unit
                            </label>
                            <div
                              style={{ width: "280px", marginLeft: "0.5em" }}
                            >
                              <FormikSelect
                                placeholder=" "
                                classes="input-sm"
                                styles={{
                                  ...customStyles,
                                  control: (provided, state) => ({
                                    ...provided,
                                    minHeight: "auto",
                                    height:
                                      values?.bu?.length > 1 ? "auto" : "30px",
                                    borderRadius: "4px",
                                    boxShadow: `${success500}!important`,
                                    ":hover": {
                                      borderColor: `${gray600}!important`,
                                    },
                                    ":focus": {
                                      borderColor: `${gray600}!important`,
                                    },
                                  }),
                                  valueContainer: (provided, state) => ({
                                    ...provided,
                                    height:
                                      values?.bu?.length > 1 ? "auto" : "30px",
                                    padding: "0 6px",
                                  }),
                                  multiValue: (styles) => {
                                    return {
                                      ...styles,
                                      position: "relative",
                                      top: "-1px",
                                    };
                                  },
                                  multiValueLabel: (styles) => ({
                                    ...styles,
                                    padding: "0",
                                  }),
                                }}
                                name="bu"
                                options={buDDL || []}
                                value={values?.bu}
                                onChange={(valueOption) => {
                                  setFieldValue("bu", valueOption);
                                  getPeopleDeskAllDDL(
                                    `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplaceGroup&WorkplaceGroupId=0&BusinessUnitId=${
                                      valueOption[valueOption?.length - 1]
                                        ?.value
                                    }&intId=${employeeId}`,
                                    "intWorkplaceGroupId",
                                    "strWorkplaceGroup",
                                    setWorkplaceGroupDDL
                                  );
                                }}
                                isMulti
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          </div>
                          {/*wg  */}
                          <div className="input-field-main d-flex ">
                            <label style={{ marginTop: "0.7em" }}>
                              Workplace Group
                            </label>
                            <div
                              style={{ width: "280px", marginLeft: "0.5em" }}
                            >
                              <FormikSelect
                                placeholder=" "
                                classes="input-sm"
                                styles={{
                                  ...customStyles,
                                  control: (provided, state) => ({
                                    ...provided,
                                    minHeight: "auto",
                                    height:
                                      values?.wg?.length > 1 ? "auto" : "30px",
                                    borderRadius: "4px",
                                    boxShadow: `${success500}!important`,
                                    ":hover": {
                                      borderColor: `${gray600}!important`,
                                    },
                                    ":focus": {
                                      borderColor: `${gray600}!important`,
                                    },
                                  }),
                                  valueContainer: (provided, state) => ({
                                    ...provided,
                                    height:
                                      values?.wg?.length > 1 ? "auto" : "30px",
                                    padding: "0 6px",
                                  }),
                                  multiValue: (styles) => {
                                    return {
                                      ...styles,
                                      position: "relative",
                                      top: "-1px",
                                    };
                                  },
                                  multiValueLabel: (styles) => ({
                                    ...styles,
                                    padding: "0",
                                  }),
                                }}
                                name="wg"
                                options={workplaceGroupDDL || []}
                                value={values?.wg}
                                onChange={(valueOption) => {
                                  const wddl = [...workplaceDDL];
                                  // console.log(values?.bu, "bu");
                                  setFieldValue("wg", valueOption);
                                  console.log(valueOption[0]);
                                  getYearlyPolicyPopUpDDL(
                                    `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&AccountId=${orgId}&BusinessUnitId=${
                                      values?.bu[0]?.value
                                    }&WorkplaceGroupId=${
                                      valueOption[valueOption?.length - 1]
                                        ?.value
                                    }&intId=${employeeId}`,
                                    "intWorkplaceId",
                                    "strWorkplace",
                                    setWorkplaceDDL,
                                    (res) => {
                                      if (valueOption?.length === 1) {
                                        const newState1 = res.filter((obj1) =>
                                          values?.intWorkplaceList?.some(
                                            (obj2) => obj2.value === obj1.value
                                          )
                                        );
                                        setFieldValue(
                                          "intWorkplaceList",
                                          newState1
                                        );
                                      } else {
                                        setWorkplaceDDL(() => {
                                          const ar = [...wddl, ...res];
                                          console.log({ wddl });
                                          const uniqueObjectMap = new Map();
                                          ar.forEach((obj) => {
                                            uniqueObjectMap.set(obj.value, obj);
                                          });
                                          console.log(
                                            Array.from(uniqueObjectMap.values())
                                          );
                                          const newState1 = Array.from(
                                            uniqueObjectMap.values()
                                          ).filter((obj1) =>
                                            values?.intWorkplaceList?.some(
                                              (obj2) =>
                                                obj2.value === obj1.value
                                            )
                                          );
                                          setFieldValue(
                                            "intWorkplaceList",
                                            newState1
                                          );
                                          return Array.from(
                                            uniqueObjectMap.values()
                                          );
                                        });
                                      }
                                    }
                                  );
                                }}
                                isMulti
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          </div>
                        </>
                      ) : null}
                      {/* workplace */}
                      <div className="input-field-main d-flex ">
                        <label style={{ marginTop: "0.7em" }}>Workplace</label>
                        <div style={{ width: "280px", marginLeft: "0.5em" }}>
                          <MultiCheckedSelect
                            name="intWorkplaceList"
                            label=""
                            value={values?.intWorkplaceList}
                            options={workplaceDDL}
                            onChange={(value) => {
                              setFieldValue("intWorkplaceList", value);
                              const temp = { ...values };
                              isPolicyExist({
                                ...temp,
                                intWorkplaceList: value,
                              });
                            }}
                            onBlur={handleBlur}
                            errors={errors}
                            touched={touched}
                            setFieldValue={setFieldValue}
                            searchFieldPlaceholder=""
                          />
                        </div>
                      </div>
                    </div>
                  </>
                </div>
              </Col>
              {existingPolicies?.length > 0 ? (
                <Col span={10}>
                  <div className="mb-3">
                    <h2>Exisitng Policies</h2>
                  </div>
                  {/* <Divider orientation="left">Small Size</Divider> */}
                  <List
                    size="small"
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
                            removerPolicy(index);
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
                </Col>
              ) : null}
            </Row>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreateEditLeavePolicy;
