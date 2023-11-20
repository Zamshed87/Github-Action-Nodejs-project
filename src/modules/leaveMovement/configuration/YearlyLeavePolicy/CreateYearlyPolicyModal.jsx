import { Form, Formik, useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import { getPeopleDeskAllDDL } from "../../../../common/api";
// import FormikInput from "../../../../common/FormikInput";
import FormikSelect from "../../../../common/FormikSelect";
import Loading from "../../../../common/loading/Loading";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { yearDDLAction } from "../../../../utility/yearDDL";
import { yearlyLeavePolicyAction } from "../helper";
import "../style.css";
import { getYearlyPolicyPopUpDDL } from "./helper";
import {
  gray600,
  gray900,
  greenColor,
  success500,
} from "../../../../utility/customColor";
import FormikCheckBox from "../../../../common/FormikCheckbox";
import { IconButton, Tooltip } from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
import DefaultInput from "../../../../common/DefaultInput";
import { monthDDL } from "../../../../utility/monthUtility";

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
  intWorkPlace: "",
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
};

const CreateYearlyPolicyModal = ({ setShow, singleData, getData }) => {
  const [employmentTypeDDL, setEmploymentTypeDDL] = useState([]);
  const [leaveTypeDDL, setLeaveTypeDDL] = useState([]);
  const [workplaceDDL, setWorkplaceDDL] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);

  const { orgId, employeeId, buId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const saveHandler = (values, cb) => {
    // yearlyLeavePolicyAction(
    //   values?.autoId || 0,
    //   values?.employmentType?.value,
    //   +values?.days,
    //   values?.year?.value,
    //   values?.leaveType?.value,
    //   values?.gender?.value,
    //   values?.gender?.label,
    //   buId,
    //   wgId,
    //   values?.workplace?.value,
    //   orgId,
    //   employeeId,
    //   cb,
    //   buId,
    //   setLoading
    // );
  };

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
  }, [orgId, buId, wgId]);

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&AccountId=${orgId}&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&intId=${employeeId}`,
      "intWorkplaceId",
      "strWorkplace",
      setWorkplaceDDL
    );
  }, [orgId, buId, employeeId, wgId]);
  const { handleSubmit, values, errors, touched, setFieldValue } = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues: singleData?.autoId
      ? singleData
      : { ...initData, gender: { value: 0, label: "Male & Female" } },

    onSubmit: () => saveHandler(),
  });
  const remover = (payload) => {
    const filterArr = tableData.filter((itm, idx) => idx !== payload);
    setTableData(filterArr);
  };
  return (
    <form onSubmit={handleSubmit}>
      {loading && <Loading />}
      <div className="create-approval-form">
        <div className="modal-body2 py-0">
          <div className="row">
            <div className="col-lg-6">
              <div className="input-field-main">
                <label>Workplace</label>
                <FormikSelect
                  placeholder=" "
                  classes="input-sm"
                  styles={{
                    ...customStyles,
                  }}
                  name="intWorkPlace"
                  options={workplaceDDL || []}
                  value={values?.intWorkPlace}
                  onChange={(valueOption) => {
                    setFieldValue("intWorkPlace", valueOption);
                  }}
                  isDisabled={singleData?.autoId}
                  errors={errors}
                  touched={touched}
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="input-field-main">
                <label>Employment Type </label>
                <FormikSelect
                  placeholder=" "
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
                        values?.employmentType?.length > 1 ? "auto" : "30px",
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
                    setFieldValue("intEmploymentTypeList", valueOption);
                  }}
                  isMulti
                  errors={errors}
                  touched={touched}
                />
              </div>
            </div>
            <div className="col-lg-6">
              <label>Year</label>
              <FormikSelect
                name="intYear"
                options={yearDDLAction()}
                value={values?.intYear}
                label=""
                onChange={(valueOption) => {
                  setFieldValue("intYear", valueOption);
                }}
                menuPosition="fixed"
                placeholder=" "
                styles={customStyles}
                errors={errors}
                touched={touched}
              />
            </div>
            {/* <div className="col-lg-6">
                  <label>Employment Type</label>
                  <FormikSelect
                    name="employmentType"
                    options={employmentTypeDDL}
                    value={values?.employmentType}
                    menuPosition="fixed"
                    label=""
                    onChange={(valueOption) => {
                      setFieldValue("employmentType", valueOption);
                    }}
                    placeholder=" "
                    styles={customStyles}
                    errors={errors}
                    touched={touched}
                  />
                </div> */}
            {/* leave type */}
            <div className="col-lg-6">
              <label>Leave Type</label>
              <FormikSelect
                name="intLeaveType"
                options={leaveTypeDDL}
                menuPosition="fixed"
                value={values?.intLeaveType}
                label=""
                onChange={(valueOption) => {
                  setFieldValue("intLeaveType", valueOption);
                  setFieldValue("isCompensatoryLve", false);
                  setFieldValue("isEarnLeave", false);
                }}
                placeholder=" "
                styles={customStyles}
                errors={errors}
                touched={touched}
              />
            </div>
            <div className="col-lg-6">
              <label>Leave Display Name</label>
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
            {/* gender */}
            <div className="col-lg-6">
              <label>Gender</label>
              <FormikSelect
                name="intGender"
                options={[
                  { value: 0, label: "Male & Female" },
                  { value: 1, label: "Male" },
                  { value: 2, label: "Female" },
                ]}
                menuPosition="fixed"
                value={values?.intGender}
                label=""
                onChange={(valueOption) => {
                  setFieldValue("intGender", valueOption);
                }}
                placeholder=" "
                styles={customStyles}
                errors={errors}
                touched={touched}
              />
            </div>
            <div className="col-lg-6">
              <label>Previous Leave Type End</label>
              <FormikSelect
                name="inPreviousLveTypeEnd"
                options={[{ value: 0, label: "None" }, ...leaveTypeDDL]}
                menuPosition="fixed"
                value={values?.inPreviousLveTypeEnd}
                label=""
                onChange={(valueOption) => {
                  setFieldValue("inPreviousLveTypeEnd", valueOption);
                }}
                placeholder=" "
                styles={customStyles}
                errors={errors}
                touched={touched}
              />
            </div>
            <div className="col-lg-6">
              <label>Max Leave </label>
              <DefaultInput
                min={0}
                placeholder=" "
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
            {/* max leave in yr */}
            <div className="col-lg-6">
              <label>Max Leave Application In Year </label>
              <DefaultInput
                min={0}
                placeholder=" "
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
            <div className="col-lg-6">
              <label>Max Leave Application In Month </label>
              <DefaultInput
                min={0}
                placeholder=" "
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
            {!values?.isDependOnServiceLength &&
              values?.intLeaveType?.label !== "Earn Leave" &&
              values?.intLeaveType?.label !== "Compensatory Leave" && (
                <div className="col-lg-6">
                  <label>Allocated Leave in Day</label>
                  <DefaultInput
                    min={0}
                    placeholder=" "
                    classes="input-sm"
                    value={values?.intAllocatedLveInDay}
                    onChange={(e) => {
                      setFieldValue("intAllocatedLveInDay", e.target.value);
                    }}
                    name="intAllocatedLveInDay"
                    type="number"
                    // className="form-control"
                    errors={errors}
                    touched={touched}
                  />
                </div>
              )}

            <div className="col-6">
              <label>Active From Joining day In Day</label>
              <DefaultInput
                // label="Days"
                step="any"
                placeholder=" "
                classes="input-sm"
                value={values?.intActiveFromJoiningdayInDay}
                onChange={(e) => {
                  setFieldValue("intActiveFromJoiningdayInDay", e.target.value);
                }}
                name="intActiveFromJoiningdayInDay"
                type="number"
                // className="form-control"
                errors={errors}
                touched={touched}
              />
            </div>
            <div className="col-6">
              <label>Active From Confirmation In Day</label>
              <DefaultInput
                // label="Days"
                step="any"
                placeholder=" "
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
            {/* compensatory */}
            {values?.intLeaveType?.label === "Compensatory Leave" ? (
              <div className="col-3">
                <label> </label>
                <div className="d-flex align-items-center small-checkbox">
                  <FormikCheckBox
                    styleObj={{
                      color: gray900,
                      checkedColor: greenColor,
                    }}
                    label="Compensatory Leave"
                    checked={values?.isCompensatoryLve}
                    onChange={(e) => {
                      setFieldValue("isCompensatoryLve", e.target.checked);
                    }}
                    labelFontSize="12px"
                  />
                </div>
              </div>
            ) : null}
            {values?.isCompensatoryLve ? (
              <>
                <div className="col-3">
                  <label> </label>
                  <div className="d-flex align-items-center small-checkbox">
                    <FormikCheckBox
                      styleObj={{
                        color: gray900,
                        checkedColor: greenColor,
                      }}
                      label="Conpensatory Leave Expire"
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
                </div>
                <div className="col-lg-6">
                  <label>Conpensatory Leave Expire In Days</label>
                  <DefaultInput
                    min={0}
                    placeholder=" "
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
              </>
            ) : null}
            {/* earn leave */}
            {values?.intLeaveType?.label === "Earn Leave" ? (
              <div className="col-3">
                <label> </label>
                <div className="d-flex align-items-center small-checkbox">
                  <FormikCheckBox
                    styleObj={{
                      color: gray900,
                      checkedColor: greenColor,
                    }}
                    label="Earn Leave"
                    checked={values?.isEarnLeave}
                    onChange={(e) => {
                      setFieldValue("isEarnLeave", e.target.checked);
                    }}
                    labelFontSize="12px"
                  />
                </div>
              </div>
            ) : null}
            {values?.isEarnLeave ? (
              <>
                <div className="col-3">
                  <label> </label>
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
                </div>
                <div className="col-4">
                  <label> </label>
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
                </div>
                <div className="col-lg-6">
                  <label>Day For One Earn Leave</label>
                  <DefaultInput
                    // label="Days"
                    step="any"
                    placeholder=" "
                    classes="input-sm"
                    value={values?.intDayForOneEarnLve}
                    onChange={(e) => {
                      setFieldValue("intDayForOneEarnLve", e.target.value);
                    }}
                    name="intDayForOneEarnLve"
                    type="number"
                    // className="form-control"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-6">
                  <label>Earn Leave In Day</label>
                  <DefaultInput
                    // label="Days"
                    step="any"
                    placeholder=" "
                    classes="input-sm"
                    value={values?.intEarnLveInDay}
                    onChange={(e) => {
                      setFieldValue("intEarnLveInDay", e.target.value);
                    }}
                    name="intEarnLveInDay"
                    type="number"
                    // className="form-control"
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </>
            ) : null}
            {/* half leave */}

            <div
              className={`col-${
                values?.isCompensatoryLve ||
                values?.isEarnLeave ||
                values?.isDependOnServiceLength
                  ? 6
                  : 3
              }`}
            >
              <label> </label>
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
            </div>
            {values?.isHalfDayLeave ? (
              <>
                <div className="col-lg-6">
                  <label>Half day Max In Month</label>
                  <DefaultInput
                    min={0}
                    placeholder=" "
                    classes="input-sm"
                    value={values?.intHalfdayMaxInMonth}
                    onChange={(e) => {
                      setFieldValue("intHalfdayMaxInMonth", e.target.value);
                    }}
                    name="intHalfdayMaxInMonth"
                    type="number"
                    // className="form-control"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-6">
                  <label>Half day Max In Year</label>
                  <DefaultInput
                    // label="Days"
                    placeholder=" "
                    classes="input-sm"
                    value={values?.intHalfdayMaxInYear}
                    onChange={(e) => {
                      setFieldValue("intHalfdayMaxInYear", e.target.value);
                    }}
                    name="intHalfdayMaxInYear"
                    type="number"
                    // className="form-control"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-6">
                  <label>Half day Previous Leave End</label>
                  <FormikSelect
                    name="intHalfdayPreviousLveTypeEnd"
                    options={[{ value: 0, label: "None" }, ...leaveTypeDDL]}
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
                    styles={customStyles}
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </>
            ) : null}
            {/* carry forward leave */}

            <div className={`col-${values?.isHalfDayLeave ? 6 : 3}`}>
              <label> </label>
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
            </div>
            {values?.isCarryForward ? (
              <>
                <div className="col-lg-6">
                  <label>Carry Forward Max In Day</label>
                  <DefaultInput
                    // label="Days"
                    step="any"
                    placeholder=" "
                    classes="input-sm"
                    value={values?.intCarryForwardMaxInDay}
                    onChange={(e) => {
                      setFieldValue("intCarryForwardMaxInDay", e.target.value);
                    }}
                    name="intCarryForwardMaxInDay"
                    type="number"
                    // className="form-control"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-6">
                  <label>Carry Forward Month</label>
                  <FormikSelect
                    name="intCarryForwardMonth"
                    options={monthDDL}
                    menuPosition="fixed"
                    value={values?.intCarryForwardMonth}
                    label=""
                    onChange={(valueOption) => {
                      setFieldValue("intCarryForwardMonth", valueOption);
                    }}
                    placeholder=" "
                    styles={customStyles}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-6">
                  <label>Carry Forwar Expiry Month</label>
                  <FormikSelect
                    name="intCarryForwarExpiryMonth"
                    options={monthDDL}
                    menuPosition="fixed"
                    value={values?.intCarryForwarExpiryMonth}
                    label=""
                    onChange={(valueOption) => {
                      setFieldValue("intCarryForwarExpiryMonth", valueOption);
                    }}
                    placeholder=" "
                    styles={customStyles}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-6">
                  <label> Carry Forward Expiry Day</label>
                  <DefaultInput
                    // label="Days"
                    min={1}
                    max={31}
                    placeholder=" "
                    classes="input-sm"
                    value={values?.intCarryForwarExpiryDay}
                    onChange={(e) => {
                      setFieldValue("intCarryForwarExpiryDay", e.target.value);
                    }}
                    name="intCarryForwarExpiryDay"
                    type="number"
                    // className="form-control"
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </>
            ) : null}

            {/* encashable */}
            <div
              className={`col-lg-${
                values?.intLeaveType?.label !== "Earn Leave" ||
                values?.intLeaveType?.label !== "Compensatory Leave"
                  ? 6
                  : 3
              }`}
            >
              <label> </label>
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
            </div>
            {values?.isEncashable ? (
              <>
                <div className="col-lg-6">
                  <label>Max Encashable </label>
                  <DefaultInput
                    // label="Days"
                    placeholder=" "
                    classes="input-sm"
                    value={values?.IntMaxEncashableLveInDay}
                    onChange={(e) => {
                      setFieldValue("IntMaxEncashableLveInDay", e.target.value);
                    }}
                    name="IntMaxEncashableLveInDay"
                    type="number"
                    // className="form-control"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-6">
                  <label>Encashable Month </label>
                  <DefaultInput
                    // label="Days"
                    placeholder=" "
                    classes="input-sm"
                    value={values?.intEncashableMonth}
                    onChange={(e) => {
                      setFieldValue("intEncashableMonth", e.target.value);
                    }}
                    name="intEncashableMonth"
                    type="number"
                    // className="form-control"
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </>
            ) : null}
            <div className="col-3">
              <label> </label>
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
            </div>
            {values?.intLeaveType?.label !== "Earn Leave" &&
              values?.intLeaveType?.label !== "Compensatory Leave" && (
                <div className="col-3">
                  <label> </label>
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
                    />
                  </div>
                </div>
              )}
            <div className="col-3">
              <label> </label>
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
            </div>
            <div className="col-3">
              <label> </label>
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
            </div>
            {/* balance show */}
            <div className="col-3">
              <label> </label>
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
            </div>
            {/* self service */}
            <div className="col-3">
              <label> </label>
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
            </div>
            {/* auto renew */}
            <div className="col-3">
              <label> </label>
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
            </div>

            <div className="col-3">
              <label> </label>
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
            </div>
            <div className="col-3">
              <label> </label>
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
            </div>

            {/* monthwise expire */}
            <div className="col-3">
              <label> </label>
              <div className="d-flex align-items-center small-checkbox">
                <FormikCheckBox
                  styleObj={{
                    color: gray900,
                    checkedColor: greenColor,
                  }}
                  label="Month Wise Expired"
                  checked={values?.isMonthWiseExpired}
                  onChange={(e) => {
                    setFieldValue("isMonthWiseExpired", e.target.checked);
                  }}
                  labelFontSize="12px"
                />
              </div>
            </div>
            {values?.isMonthWiseExpired ? (
              <>
                <div className="col-lg-6">
                  <label>How Much Month</label>
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
                    styles={customStyles}
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </>
            ) : null}

            {values?.intLeaveType?.label !== "Earn Leave" &&
              values?.intLeaveType?.label !== "Compensatory Leave" && (
                <div className="col-6">
                  <label> </label>
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
                          setFieldValue("intAllocatedLveInDay", null);
                        }
                        setFieldValue(
                          "isDependOnServiceLength",
                          e.target.checked
                        );
                      }}
                      labelFontSize="12px"
                    />
                  </div>
                </div>
              )}
            {/* depend on service */}
            {values?.isDependOnServiceLength ? (
              <>
                <div className="col-lg-6">
                  <label>Starting Service Length In Year</label>
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
                      setFieldValue("intStartServiceLengthInYear", valueOption);
                    }}
                    placeholder=" "
                    styles={customStyles}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-6">
                  <label>End Service Length in Years</label>
                  <FormikSelect
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
                      setFieldValue("intEndServiceLengthInYear", valueOption);
                    }}
                    placeholder=" "
                    styles={customStyles}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-6">
                  <label>Leave in Days</label>
                  <DefaultInput
                    // label="Days"
                    placeholder=" "
                    classes="input-sm"
                    value={values?.intLveInDay}
                    onChange={(e) => {
                      setFieldValue("intLveInDay", e.target.value);
                    }}
                    name="intLveInDay"
                    type="number"
                    step="any"
                    min={0}
                    // className="form-control"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-3 d-flex mt-4 ml-1 ">
                  <button
                    type="button"
                    className="btn btn-green"
                    onClick={() => {
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
                    Add
                  </button>
                </div>
                {tableData?.length > 0 && (
                  <div className="table-card-body pt-3">
                    <div
                      className=" table-card-styled tableOne"
                      style={{ padding: "0px 12px" }}
                    >
                      <table className="table align-middle">
                        <thead style={{ color: "#212529" }}>
                          <tr>
                            <th>
                              <div className="d-flex align-items-center">
                                Starting Service Length
                              </div>
                            </th>
                            <th>
                              <div className="d-flex align-items-center">
                                End Service Length
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
                              {tableData.map((item, index) => {
                                // const { strWorkplace } = item;
                                return (
                                  <tr key={index}>
                                    <td>
                                      {item?.intStartServiceLengthInYear?.label}
                                    </td>
                                    <td>
                                      {item?.intEndServiceLengthInYear?.label}
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
              </>
            ) : null}
          </div>
        </div>
        <div className="modal-footer form-modal-footer">
          <button
            type="button"
            onClick={(e) => {
              setShow(false);
            }}
            className="btn btn-cancel"
            style={{
              marginRight: "15px",
            }}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-green">
            Save
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreateYearlyPolicyModal;
