/* eslint-disable array-callback-return */
import { ArrowDropDown, ArrowDropUp, DeleteOutline } from "@mui/icons-material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import axios from "axios";
import AsyncFormikSelect from "../../../../../common/AsyncFormikSelect";
import DefaultInput from "../../../../../common/DefaultInput";
import FormikSelect from "../../../../../common/FormikSelect";
import Loading from "../../../../../common/loading/Loading";
import {
  gray200,
  gray400,
  gray700,
  gray900,
} from "../../../../../utility/customColor";
import { customStyles } from "../../../../../utility/selectCustomStyle";
import { getBreakdownListDDL, getByIdBreakdownListDDL } from "../helper";
import { adjustPaymentFiledFun } from "./utils";
import BankForm from "modules/employeeProfile/aboutMe/bankDetails/component/BankForm";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { getPeopleDeskAllDDL } from "common/api";
import {
  bankDetailsAction,
  getBankBranchDDL,
} from "modules/employeeProfile/aboutMe/helper";
import { todayDate } from "utility/todayDate";
import { getEmployeeProfileViewData } from "modules/employeeProfile/employeeFeature/helper";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Typography } from "antd";
import { makeStyles } from "@material-ui/core/styles";

const DefaultSalary = ({ propsObj }) => {
  const {
    singleData,
    buId,
    orgId,
    wgId,
    wId,
    defaultPayrollElement,
    finalPayrollElement,
    breakDownList,
    setBreakDownList,
    defaultSalaryInitData,
    netGross,
    totalAmount,
    finalTotalAmount,
    setLoading,
    loading,
    isBulk,
    setStep,
    step,
    selectedEmployee,
    addHandler,
    deleteHandler,

    // formik
    rowDtoHandler,
    resetForm,
    setFieldValue,
    values,
    errors,
    touched,
    setOpenIncrement,
    setIsOpen,
    setOpenBank,
  } = propsObj;

  const payrollGroupDDL = (positionId) => {
    return finalPayrollElement.filter(
      (itm) => itm?.intHrPositonId === positionId
    );
  };

  // state
  const [bankDDL, setBankDDL] = useState([]);
  const [bankBranchDDL, setBankBranchDDL] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [empBasic, setEmpBasic] = useState({});
  const { employeeId, empId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Bank&WorkplaceGroupId=${wgId}&BusinessUnitId=${buId}&intId=0`,
      "BankID",
      "BankName",
      setBankDDL
    );
  }, []);
  const getEmpData = () => {
    getEmployeeProfileViewData(employeeId, setEmpBasic, setLoading, buId, wgId);
  };
  useEffect(() => {
    getEmpData();
  }, [singleData]);

  const loadEmployeeList = (v) => {
    if (v?.length < 2) return [];

    const payload = {
      partType: "SalaryAssignLanding",
      businessUnitId: buId,
      workplaceGroupId: wgId || 0,
      workplaceId: wId || 0,
      departmentId: 0,
      designationId: 0,
      supervisorId: 0,
      employeeId: 0,
      strStatus: "NotAssigned",
      strSearchTxt: v,
      isPaginated: false,
    };

    return axios
      .post(`/Payroll/EmployeeSalaryManagement`, payload)
      .then((res) => {
        const modifiedData = res?.data?.map((item) => {
          return {
            ...item,
            value: item?.EmployeeId,
            label: item?.EmployeeName,
          };
        });
        return modifiedData;
      })
      .catch(() => {
        //
      });
  };

  const [expanded, setExpanded] = React.useState(false);
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const useStyles = makeStyles({
    fullWidthAccordion: {
      width: "100%",
    },
  });
  const classes = useStyles();
  return (
    <>
      {loading && <Loading />}
      <div
        className="pl-2 salary-info-wrapper"
        style={{ overflow: "scroll !important" }}
      >
        {/* effective month */}
        <div className="row d-none">
          <div className="col-lg-9">
            <h2
              style={{
                fontWeight: "500",
                fontSize: "14px",
                lineHeight: "20px",
                color: gray700,
              }}
            >
              Effective Month
            </h2>
          </div>
          <div className="col-lg-3">
            <DefaultInput
              classes="input-sm"
              value={values?.effectiveDate}
              name="effectiveDate"
              type="month"
              className="form-control"
              onChange={(e) => {
                setFieldValue(
                  "effectiveYear",
                  +e.target.value.split("").slice(0, 4).join("")
                );
                setFieldValue(
                  "effectiveMonth",
                  +e.target.value.split("").slice(-2).join("")
                );
                setFieldValue("effectiveDate", e.target.value);
              }}
              errors={errors}
              touched={touched}
            />
          </div>
        </div>

        {isBulk && step === 1 && (
          <>
            <div className="row">
              <div className="col-6">
                <div className="input-field-main">
                  <AsyncFormikSelect
                    selectedValue={values?.employee}
                    isSearchIcon={true}
                    handleChange={(valueOption) => {
                      setFieldValue("employee", valueOption);
                    }}
                    placeholder="Search Employee..."
                    loadOptions={loadEmployeeList}
                  />
                </div>
              </div>
              <div className="col-6">
                <button
                  type="button"
                  className="btn btn-green btn-green-disable"
                  style={{ width: "auto" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    addHandler(values);
                  }}
                >
                  Add
                </button>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="table-card-body">
                  <div className="table-card-styled tableOne">
                    <table className="table">
                      <thead>
                        <tr>
                          <th className="sortable" style={{ width: "30px" }}>
                            SL
                          </th>
                          <th>Employee ID</th>
                          <th>Employee</th>
                          <th>Designation</th>
                          <th>Workplace Group</th>
                          <th>Department</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedEmployee?.length > 0 &&
                          selectedEmployee?.map((item, index) => (
                            <tr key={index}>
                              <td>
                                <p className="tableBody-title pl-1">
                                  {index + 1}
                                </p>
                              </td>
                              <td>
                                <div className="tableBody-title">
                                  {item?.EmployeeCode}
                                </div>
                              </td>
                              <td>
                                <div className="tableBody-title">
                                  {item?.EmployeeName}
                                </div>
                              </td>
                              <td>
                                <div className="tableBody-title">
                                  {item?.DesignationName}
                                </div>
                              </td>
                              <td>
                                <div className="tableBody-title">
                                  {item?.WorkplaceGroupName}
                                </div>
                              </td>

                              <td>
                                <div className="content tableBody-title">
                                  {item?.DepartmentName}
                                </div>
                              </td>
                              <td>
                                <div className="text-center tableBody-title">
                                  <Tooltip title="Delete" arrow>
                                    <IconButton
                                      type="button"
                                      style={{
                                        border: "none",
                                        padding: "5px",
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteHandler(index);
                                      }}
                                    >
                                      <DeleteOutline className="edit-icon-btn" />
                                    </IconButton>
                                  </Tooltip>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {((!isBulk && step === 1) || !step || step === 2) && (
          <>
            {/* payroll element */}
            <div
              className="row mb-less"
              style={{ alignItems: "center", marginBottom: "12px" }}
            >
              <div className="col-lg-7">
                <h2
                  style={{
                    fontWeight: "500",
                    fontSize: "14px",
                    lineHeight: "20px",
                    color: gray700,
                    position: "relative",
                    top: "-1px",
                  }}
                >
                  Payroll Group
                </h2>
              </div>
              {defaultPayrollElement?.length > 0 ? (
                <div className="col-lg-5">
                  <FormikSelect
                    name="payrollElement"
                    options={
                      payrollGroupDDL(singleData[0]?.intHRPositionId) || []
                    }
                    value={values?.payrollElement}
                    onChange={(valueOption) => {
                      getBreakdownListDDL(
                        "BREAKDOWN ELEMENT BY ID",
                        orgId,
                        valueOption?.value,
                        values?.totalGrossSalary,
                        setBreakDownList
                      );
                      setFieldValue("payrollElement", valueOption);
                    }}
                    placeholder=" "
                    isSearchable={false}
                    isClearable={false}
                    styles={customStyles}
                    errors={errors}
                    touched={touched}
                  />
                </div>
              ) : (
                <div className="col-lg-5">
                  <FormikSelect
                    name="payrollElement"
                    options={
                      payrollGroupDDL(singleData[0]?.intHRPositionId) || []
                    }
                    value={values?.payrollElement}
                    onChange={(valueOption) => {
                      getBreakdownListDDL(
                        "BREAKDOWN ELEMENT BY ID",
                        orgId,
                        valueOption?.value,
                        values?.totalGrossSalary,
                        setBreakDownList
                      );
                      setFieldValue("payrollElement", valueOption);
                    }}
                    placeholder=" "
                    isSearchable={false}
                    isClearable={false}
                    styles={customStyles}
                    errors={errors}
                    touched={touched}
                  />
                </div>
              )}
            </div>

            {/* perday Salary */}
            {values?.payrollElement?.isPerday === true && (
              <>
                <div
                  className="row mb-less"
                  style={{ alignItems: "center", marginBottom: "12px" }}
                >
                  <div className="col-lg-7">
                    <h2
                      style={{
                        fontWeight: "500",
                        fontSize: "14px",
                        lineHeight: "20px",
                        color: gray700,
                        position: "relative",
                        top: "-1px",
                      }}
                    >
                      Perday Salary
                    </h2>
                  </div>
                  <div className="col-lg-5">
                    <DefaultInput
                      classes="input-sm"
                      value={values?.perDaySalary}
                      name="perDaySalary"
                      type="number"
                      className="form-control"
                      onChange={(e) => {
                        setFieldValue("finalGrossSalary", e.target.value);
                        setFieldValue("perDaySalary", e.target.value);
                        setFieldValue("bankPay", e.target.value);
                        setFieldValue("digitalPay", 0);
                        setFieldValue("netPay", 0);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>

                <div
                  className="row mb-less"
                  style={{ alignItems: "center", marginBottom: "12px" }}
                >
                  <div className="col-12">
                    <div
                      style={{
                        marginBottom: "10px",
                        borderBottom: `1px solid ${gray200}`,
                      }}
                    ></div>
                  </div>
                  <div className="col-lg-7">
                    <h2
                      style={{
                        fontWeight: "500",
                        fontSize: "14px",
                        lineHeight: "20px",
                        color: gray700,
                        position: "relative",
                        top: "-1px",
                      }}
                    >
                      {true
                        ? `Bank (${
                            values?.bankPay === 0
                              ? 0
                              : (
                                  (values?.bankPay * 100) /
                                  values?.perDaySalary
                                )?.toFixed(6)
                          }%) Pay`
                        : null}
                    </h2>
                  </div>
                  <div className="col-lg-5">
                    <DefaultInput
                      classes="input-sm"
                      value={values?.bankPay}
                      name="bankPay"
                      type="number"
                      className="form-control"
                      onChange={(e) => {
                        setFieldValue("bankPay", e.target.value);
                      }}
                      errors={errors}
                      touched={touched}
                      // disabled={true}
                    />
                  </div>
                </div>

                {/* digital pay */}
                <div
                  className="row mb-less"
                  style={{ alignItems: "center", marginBottom: "12px" }}
                >
                  <div className="col-12"></div>
                  <div className="col-lg-7">
                    <h2
                      style={{
                        fontWeight: "500",
                        fontSize: "14px",
                        lineHeight: "20px",
                        color: gray700,
                        position: "relative",
                        top: "-1px",
                      }}
                    >
                      {true
                        ? `Digital/MFS (${
                            values?.digitalPay === 0
                              ? 0
                              : (
                                  (values?.digitalPay * 100) /
                                  values?.perDaySalary
                                )?.toFixed(6)
                          }%) Pay`
                        : null}
                    </h2>
                  </div>
                  <div className="col-lg-5">
                    <DefaultInput
                      classes="input-sm"
                      value={values?.digitalPay}
                      name="digitalPay"
                      type="number"
                      className="form-control"
                      onChange={(e) => {
                        const bank = +values?.perDaySalary - +e.target.value;
                        setFieldValue("digitalPay", e.target.value);
                        setFieldValue("bankPay", bank);
                      }}
                      errors={errors}
                      touched={touched}
                      // disabled={true}
                    />
                  </div>
                </div>
                {/* net */}
                <div
                  className="row mb-less"
                  style={{ alignItems: "center", marginBottom: "12px" }}
                >
                  <div className="col-12"></div>
                  <div className="col-lg-7">
                    <h2
                      style={{
                        fontWeight: "500",
                        fontSize: "14px",
                        lineHeight: "20px",
                        color: gray700,
                        position: "relative",
                        top: "-1px",
                      }}
                    >
                      {true
                        ? `Cash (${
                            values?.netPay === 0
                              ? 0
                              : (
                                  (values?.netPay * 100) /
                                  values?.perDaySalary
                                )?.toFixed(6)
                          }%) Pay`
                        : null}
                    </h2>
                  </div>
                  <div className="col-lg-5">
                    <DefaultInput
                      classes="input-sm"
                      value={values?.netPay}
                      name="netPay"
                      type="number"
                      className="form-control"
                      onChange={(e) => {
                        const bank =
                          +values?.perDaySalary -
                          +e.target.value -
                          +values?.digitalPay;

                        setFieldValue("bankPay", bank);
                        setFieldValue("netPay", e.target.value);
                      }}
                      errors={errors}
                      touched={touched}
                      // disabled={true}
                    />
                  </div>
                </div>
              </>
            )}

            {!values?.payrollElement?.isPerday && (
              <>
                {/* gross salary */}
                <div
                  className="row mb-less"
                  style={{ alignItems: "center", marginBottom: "12px" }}
                >
                  <div className="col-12">
                    <div
                      style={{
                        marginBottom: "10px",
                        borderBottom: `1px solid ${gray200}`,
                      }}
                    ></div>
                  </div>
                  <div className="col-lg-7">
                    <h2
                      style={{
                        fontWeight: "500",
                        fontSize: "14px",
                        lineHeight: "20px",
                        color: gray700,
                        position: "relative",
                        top: "-1px",
                      }}
                    >
                      {values?.payrollElement?.strDependOn === "Basic"
                        ? "Total Gross Salary"
                        : "Total Gross Salary"}
                    </h2>
                  </div>
                  <div className="col-lg-5">
                    <DefaultInput
                      classes="input-sm"
                      value={values?.totalGrossSalary}
                      name="totalGrossSalary"
                      type="number"
                      className="form-control"
                      onChange={(e) => {
                        if (
                          singleData[0]?.intSalaryBreakdownHeaderId ===
                          values?.payrollElement?.value
                        ) {
                          getByIdBreakdownListDDL(
                            "ASSIGNED_BREAKDOWN_ELEMENT_BY_EMPLOYEE_ID",
                            orgId,
                            singleData[0]?.EmployeeId || 0,
                            values?.payrollElement?.value,
                            setBreakDownList,
                            +e.target.value,
                            "",
                            wId
                          );
                        } else {
                          getBreakdownListDDL(
                            "BREAKDOWN ELEMENT BY ID",
                            orgId,
                            values?.payrollElement?.value,
                            +e.target.value,
                            setBreakDownList,
                            setLoading,
                            wId
                          );
                        }
                        setFieldValue("totalGrossSalary", e.target.value);
                        setFieldValue("bankPay", 0);
                        setFieldValue("digitalPay", 0);
                        setFieldValue("netPay", e.target.value);
                      }}
                      errors={errors}
                      touched={touched}
                      // disabled={true}
                    />
                  </div>
                </div>

                {breakDownList?.length > 0 && (
                  <>
                    {/* payroll elememt */}
                    <div className="row">
                      <div className="col-12">
                        <div
                          style={{
                            marginBottom: "10px",
                            borderBottom: `1px solid ${gray200}`,
                          }}
                        ></div>
                      </div>
                      <div className="col-lg-7">
                        <h2
                          style={{
                            fontWeight: "400",
                            fontSize: "12px",
                            lineHeight: "18px",
                            color: gray400,
                          }}
                        >
                          Payroll Elements
                        </h2>
                      </div>
                      <div className="col-lg-5">
                        <h2
                          style={{
                            fontWeight: "400",
                            fontSize: "12px",
                            lineHeight: "18px",
                            color: gray400,
                            textAlign: "right",
                          }}
                        >
                          Amount
                        </h2>
                      </div>
                      <div className="col-12">
                        <div
                          style={{
                            marginTop: "10px",
                            marginBottom: "12px",
                            borderBottom: `1px solid ${gray200}`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {breakDownList?.length > 0 &&
                      breakDownList?.map((itm, index) => {
                        return (
                          <div
                            className="row"
                            key={index}
                            style={{
                              alignItems: "baseline",
                              marginBottom: "12px",
                            }}
                          >
                            <div className="col-lg-7">
                              <h2
                                style={{
                                  fontWeight: "400",
                                  fontSize: "12px",
                                  lineHeight: "18px",
                                  color: gray700,
                                }}
                              >
                                {itm?.strPayrollElementName}
                                {itm?.strBasedOn === "Amount"
                                  ? ""
                                  : `( ${itm?.showPercentage || 0} %) `}
                                [Depends on {itm?.strDependOn}]
                              </h2>
                            </div>
                            <div className="col-lg-5">
                              <div className="input-field-main breakdownlist">
                                <div className="form-container">
                                  <div className="form-group login-input input-xl input-sm">
                                    <input
                                      className="form-control"
                                      value={itm[itm?.levelVariable]}
                                      name={itm?.levelVariable}
                                      placeholder=" "
                                      type="number"
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        if (itm?.strBasedOn === "Amount") {
                                          rowDtoHandler(
                                            `${itm?.levelVariable}`,
                                            index,
                                            e.target.value,
                                            setBreakDownList
                                          );
                                        }
                                      }}
                                      required
                                      // errors={errors}
                                      // touched={touched}
                                      disabled={
                                        itm?.strBasedOn === "Percentage" ||
                                        itm?.isCustomPayrollFor10ms
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </>
                )}

                {/* total result */}
                {values?.payrollElement?.value && (
                  <>
                    {/* hr */}
                    {/* bank Pay */}
                    <div className="row">
                      <div className="col-12"></div>
                    </div>

                    {/* hr close*/}
                    <div
                      className="row mb-less"
                      style={{ alignItems: "center", marginBottom: "12px" }}
                    >
                      <div className="col-12">
                        <div
                          style={{
                            marginBottom: "10px",
                            borderBottom: `1px solid ${gray200}`,
                          }}
                        ></div>
                      </div>
                      <div className="col-lg-7">
                        <h2
                          style={{
                            fontWeight: "500",
                            fontSize: "14px",
                            lineHeight: "20px",
                            color: gray700,
                            position: "relative",
                            top: "-1px",
                          }}
                        >
                          {true
                            ? `Bank (${
                                values?.bankPay === 0
                                  ? 0
                                  : (
                                      (values?.bankPay * 100) /
                                      values?.totalGrossSalary
                                    )?.toFixed(6)
                              }%) Pay`
                            : null}
                        </h2>
                      </div>
                      <div className="col-lg-5">
                        <DefaultInput
                          classes="input-sm"
                          value={values?.bankPay}
                          name="bankPay"
                          type="number"
                          className="form-control"
                          onChange={(e) => {
                            const netPay =
                              +values?.totalGrossSalary -
                              +e.target.value -
                              +values?.digitalPay;

                            // setFieldValue("netPay", netPay); -- removed

                            setFieldValue("bankPay", e.target.value);
                            adjustPaymentFiledFun(
                              +e.target.value,
                              "bankPay",
                              +values?.totalGrossSalary,
                              values,
                              setFieldValue
                            );
                          }}
                          errors={errors}
                          touched={touched}
                          // disabled={true}
                        />
                      </div>
                    </div>
                    {/* net */}

                    {/* digital pay */}
                    <div
                      className="row mb-less"
                      style={{ alignItems: "center", marginBottom: "12px" }}
                    >
                      <div className="col-12"></div>
                      <div className="col-lg-7">
                        <h2
                          style={{
                            fontWeight: "500",
                            fontSize: "14px",
                            lineHeight: "20px",
                            color: gray700,
                            position: "relative",
                            top: "-1px",
                          }}
                        >
                          {true
                            ? `Digital/MFS (${
                                values?.digitalPay === 0
                                  ? 0
                                  : (
                                      (values?.digitalPay * 100) /
                                      values?.totalGrossSalary
                                    )?.toFixed(6)
                              }%) Pay`
                            : null}
                        </h2>
                      </div>
                      <div className="col-lg-5">
                        <DefaultInput
                          classes="input-sm"
                          value={values?.digitalPay}
                          name="digitalPay"
                          type="number"
                          className="form-control"
                          onChange={(e) => {
                            const netPay =
                              +values?.totalGrossSalary - +e.target.value;
                            setFieldValue("digitalPay", e.target.value);
                            adjustPaymentFiledFun(
                              +e.target.value,
                              "digitalPay",
                              +values?.totalGrossSalary,
                              values,
                              setFieldValue
                            );

                            // setFieldValue("netPay", netPay); -- removed
                          }}
                          errors={errors}
                          touched={touched}
                          // disabled={true}
                        />
                      </div>
                    </div>
                    <div
                      className="row mb-less"
                      style={{ alignItems: "center", marginBottom: "12px" }}
                    >
                      <div className="col-12"></div>
                      <div className="col-lg-7">
                        <div
                          className="d-flex align-items-center"
                          style={{
                            width: "100% !important",
                            fontSize: "12px !important",
                          }}
                        >
                          <h2
                            style={{
                              fontWeight: "500",
                              fontSize: "14px",
                              lineHeight: "20px",
                              color: gray700,
                              position: "relative",
                              top: "-1px",
                              marginRight: "10px",
                            }}
                          >
                            {true
                              ? `Cash (${
                                  values?.netPay === 0
                                    ? 0
                                    : (
                                        (values?.netPay * 100) /
                                        values?.totalGrossSalary
                                      )?.toFixed(6)
                                }%) Pay`
                              : null}
                          </h2>
                        </div>
                      </div>
                      <div className="col-lg-5">
                        <DefaultInput
                          classes="input-sm"
                          value={values?.netPay}
                          name="netPay"
                          type="number"
                          className="form-control"
                          onChange={(e) => {
                            // const bank =
                            //   +values?.totalGrossSalary -
                            //   +e.target.value -
                            //   +values?.digitalPay;

                            // setFieldValue("bankPay", bank);

                            adjustPaymentFiledFun(
                              +e.target.value,
                              "netPay",
                              +values?.totalGrossSalary,
                              values,
                              setFieldValue
                            );
                            setFieldValue("netPay", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                          // disabled={true}
                        />
                      </div>
                    </div>
                    <div
                      className="row"
                      style={{ alignItems: "center", marginBottom: "8px" }}
                    >
                      <div className="col-lg-7">
                        <h2
                          style={{
                            fontWeight: "500",
                            fontSize: "14px",
                            lineHeight: "20px",
                            color: gray700,
                          }}
                        >
                          Gross Salary
                        </h2>
                      </div>
                      <div className="col-lg-5">
                        <h2
                          style={{
                            fontWeight: "500",
                            fontSize: "14px",
                            lineHeight: "20px",
                            color: gray700,
                            textAlign: "right",
                          }}
                        >
                          {netGross()}
                        </h2>
                      </div>
                    </div>
                    <div
                      className="row"
                      style={{ alignItems: "center", marginBottom: "8px" }}
                    >
                      <div className="col-lg-7">
                        <h2
                          style={{
                            fontWeight: "500",
                            fontSize: "14px",
                            lineHeight: "20px",
                            color: gray700,
                          }}
                        >
                          Fixed Amount
                        </h2>
                      </div>
                      <div className="col-lg-5">
                        <h2
                          style={{
                            fontWeight: "500",
                            fontSize: "14px",
                            lineHeight: "20px",
                            color: gray700,
                            textAlign: "right",
                          }}
                        >
                          {totalAmount}
                        </h2>
                      </div>
                    </div>
                    <div className="row" style={{ alignItems: "center" }}>
                      <div className="col-lg-7">
                        <h2
                          style={{
                            fontWeight: "500",
                            fontSize: "14px",
                            lineHeight: "20px",
                            color: gray700,
                          }}
                        >
                          Net Salary Amount
                        </h2>
                      </div>
                      <div className="col-lg-5">
                        <h2
                          style={{
                            fontWeight: "500",
                            fontSize: "14px",
                            lineHeight: "20px",
                            color: gray700,
                            textAlign: "right",
                          }}
                        >
                          {finalTotalAmount}
                        </h2>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )}

        {/* footer */}
        <div
          style={{
            marginTop: "12px",
            marginBottom: "12px",
            borderBottom: `1px solid ${gray200}`,
          }}
        ></div>

        <div style={{ width: "100%", maxWidth: "100%" }}>
          <Accordion
            expanded={expanded === "panel1"}
            onChange={handleChange("panel1")}
          >
            <AccordionSummary aria-controls="panel1-content" id="panel1-header">
              <Typography>Bank Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div>
                {/* Bank Name */}
                <div className="row">
                  <div className="col-lg-7">
                    <h2
                      style={{
                        fontWeight: "500",
                        fontSize: "14px",
                        lineHeight: "20px",
                        color: gray700,
                        position: "relative",
                        top: "-1px",
                      }}
                    >
                      Bank Name
                    </h2>
                  </div>
                  <div className="col-md-5">
                    <FormikSelect
                      name="bankName"
                      options={bankDDL}
                      value={values?.bankName}
                      menuPosition="fixed"
                      onChange={(valueOption) => {
                        setFieldValue("routingNo", "");
                        setFieldValue("branchName", "");
                        setFieldValue("bankName", valueOption);
                        setSelectedBank(valueOption);
                        getBankBranchDDL(
                          valueOption?.value,
                          orgId,
                          0,
                          setBankBranchDDL
                        );
                      }}
                      placeholder=" "
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                      isDisabled={false}
                    />
                  </div>
                </div>

                {/* Branch Name */}
                <div className="row">
                  <div className="col-lg-7">
                    <h2
                      style={{
                        fontWeight: "500",
                        fontSize: "14px",
                        lineHeight: "20px",
                        color: gray700,
                        position: "relative",
                        top: "-1px",
                      }}
                    >
                      Branch Name
                    </h2>
                  </div>
                  <div className="col-md-5">
                    <div
                      className="policy-category-ddl-wrapper"
                      style={{ marginBottom: "5px" }}
                    >
                      <FormikSelect
                        name="branchName"
                        options={bankBranchDDL}
                        value={values?.branchName}
                        menuPosition="fixed"
                        onChange={(valueOption) => {
                          setFieldValue("routingNo", valueOption?.name);
                          setFieldValue("branchName", valueOption);
                        }}
                        placeholder=" "
                        styles={customStyles}
                        errors={errors}
                        touched={touched}
                        // isDisabled={!values?.bankName}
                      />
                    </div>
                  </div>
                </div>

                {/* routing no */}
                <div className="row">
                  <div className="col-lg-7">
                    <h2
                      style={{
                        fontWeight: "500",
                        fontSize: "14px",
                        lineHeight: "20px",
                        color: gray700,
                        position: "relative",
                        top: "-1px",
                      }}
                    >
                      Routing No
                    </h2>
                  </div>
                  <div className="col-md-5">
                    <DefaultInput
                      value={values?.routingNo}
                      disabled={true}
                      name="routingNo"
                      type="text"
                      className="form-control"
                      onChange={(e) => {
                        setFieldValue("routingNo", e.target.value);
                      }}
                      errors={errors}
                      touched={touched}
                      placeholder=" "
                      classes="input-sm"
                    />
                  </div>
                </div>

                {/* Swift Code */}
                <div className="row">
                  <div className="col-lg-7">
                    <h2
                      style={{
                        fontWeight: "500",
                        fontSize: "14px",
                        lineHeight: "20px",
                        color: gray700,
                        position: "relative",
                        top: "-1px",
                      }}
                    >
                      Swift Code
                    </h2>
                  </div>
                  <div className="col-md-5">
                    <DefaultInput
                      value={values?.swiftCode}
                      onChange={(e) => {
                        setFieldValue("swiftCode", e.target.value);
                      }}
                      name="swiftCode"
                      type="text"
                      className="form-control"
                      errors={errors}
                      touched={touched}
                      placeholder=" "
                      classes="input-sm"
                    />
                  </div>
                </div>

                {/* Account Name */}
                <div className="row">
                  <div className="col-lg-7">
                    <h2
                      style={{
                        fontWeight: "500",
                        fontSize: "14px",
                        lineHeight: "20px",
                        color: gray700,
                        position: "relative",
                        top: "-1px",
                      }}
                    >
                      Account Name
                    </h2>
                  </div>
                  <div className="col-lg-5">
                    <DefaultInput
                      value={values?.accName}
                      onChange={(e) => {
                        setFieldValue("accName", e.target.value);
                      }}
                      name="accName"
                      type="text"
                      className="form-control"
                      errors={errors}
                      touched={touched}
                      placeholder=" "
                      classes="input-sm"
                    />
                  </div>
                </div>

                {/* Account No */}
                <div className="row">
                  <div className="col-lg-7">
                    <h2
                      style={{
                        fontWeight: "500",
                        fontSize: "14px",
                        lineHeight: "20px",
                        color: gray700,
                        position: "relative",
                        top: "-1px",
                      }}
                    >
                      Account No
                    </h2>
                  </div>
                  <div className="col-md-5">
                    <DefaultInput
                      value={values?.accNo}
                      onChange={(e) => {
                        setFieldValue("accNo", e.target.value);
                      }}
                      name="accNo"
                      type="text"
                      className="form-control"
                      errors={errors}
                      touched={touched}
                      placeholder=" "
                      classes="input-sm"
                    />
                  </div>
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
        </div>

        {isBulk ? (
          <>
            {step === 1 ? (
              <>
                <div className="row">
                  <div className="col-12">
                    <div className="d-flex align-items-center justify-content-end">
                      <button
                        type="button"
                        className="btn btn-green btn-green-disable"
                        onClick={() => {
                          setStep(2);
                        }}
                        disabled={selectedEmployee?.length <= 0}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="row">
                  <div className="col-12">
                    <div className="d-flex align-items-center justify-content-end">
                      <button
                        type="button"
                        className="btn btn-cancel mr-2"
                        onClick={() => {
                          setStep(1);
                        }}
                      >
                        Back
                      </button>

                      <button
                        type="submit"
                        className="btn btn-green btn-green-disable"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        ) : values?.payrollElement?.isPerday ? (
          <>
            {values?.payrollElement?.isPerday > 0 && (
              <div className="row">
                <div className="col-12">
                  <div className="d-flex align-items-center justify-content-end">
                    {+values?.perDaySalary !==
                    +values?.bankPay + +values?.netPay + +values?.digitalPay ? (
                      <span
                        style={{
                          color: "red",
                          fontSize: "10px",
                          marginRight: "3rem",
                        }}
                      >
                        {" "}
                        {
                          "Bank Pay, Cash Pay and Digital pay must be equal to Per Day Salary Salary!!!"
                        }
                      </span>
                    ) : null}

                    <button
                      disabled={
                        +values?.perDaySalary !==
                        +values?.bankPay + +values?.netPay + +values?.digitalPay
                          ? true
                          : false
                      }
                      onClick={() => {
                        const payload = {
                          partId: 0,
                          intEmployeeBankDetailsId: 0,
                          intEmployeeBasicInfoId: +employeeId || 0,
                          isPrimarySalaryAccount: true,
                          isActive: true,
                          intWorkplaceId: wId || 0,
                          intBusinessUnitId: buId,
                          intAccountId: orgId,
                          dteCreatedAt: todayDate(),
                          intCreatedBy: employeeId,
                          dteUpdatedAt: todayDate(),
                          intUpdatedBy: employeeId,
                          intBankOrWalletType: 1,
                          intBankWalletId: 0,
                          strBankWalletName: "",
                          strDistrict: "",
                          intBankBranchId: values?.branchName?.value || 0,
                          strBranchName: values?.branchName?.label || "",
                          strRoutingNo: values?.routingNo || "",
                          strAccountName: values?.accName || "",
                          strAccountNo: values?.accNo || "",
                          strSwiftCode: values?.swiftCode || "",
                        };
                        console.log("payload", payload);
                        bankDetailsAction(payload, setLoading, getEmpData, "");
                      }}
                      type="submit"
                      className="btn btn-green btn-green-disable"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {breakDownList?.length > 0 && (
              <div className="row">
                <div className="col-12">
                  <div className="d-flex align-items-center justify-content-end">
                    {+values?.totalGrossSalary !==
                    +values?.bankPay + +values?.netPay + +values?.digitalPay ? (
                      <span
                        style={{
                          color: "red",
                          fontSize: "10px",
                          marginRight: "3rem",
                        }}
                      >
                        {" "}
                        {
                          "Bank Pay, Cash Pay and Digital pay must be equal to Gross Salary!!!"
                        }
                      </span>
                    ) : null}
                    {singleData[0]?.Status === "Assigned" &&
                      (values?.totalGrossSalary || values?.perDaySalary) && (
                        <button
                          type="button"
                          className="btn btn-cancel mr-2"
                          onClick={() => {
                            resetForm(defaultSalaryInitData);
                            if (singleData[0]?.intSalaryBreakdownHeaderId) {
                              getByIdBreakdownListDDL(
                                "ASSIGNED_BREAKDOWN_ELEMENT_BY_EMPLOYEE_ID",
                                orgId,
                                singleData[0]?.EmployeeId || 0,
                                singleData[0]?.intSalaryBreakdownHeaderId,
                                setBreakDownList,
                                singleData[0]?.numNetGrossSalary,
                                "",
                                wId
                              );
                            }
                            // else {
                            //   setBreakDownList([]);
                            // }
                          }}
                        >
                          Clear
                        </button>
                      )}
                    {console.log("emp", empBasic)}
                    <button
                      disabled={
                        +values?.totalGrossSalary !==
                        +values?.bankPay + +values?.netPay + +values?.digitalPay
                          ? true
                          : false
                      }
                      type="submit"
                      className="btn btn-green btn-green-disable"
                      onClick={() => {
                        console.log("values", values);
                        const payload = {
                          partId: 0,
                          intEmployeeBankDetailsId: 0,
                          intEmployeeBasicInfoId: +employeeId || 0,
                          isPrimarySalaryAccount: true,
                          isActive: true,
                          intWorkplaceId: wId || 0,
                          intBusinessUnitId: buId,
                          intAccountId: orgId,
                          dteCreatedAt: todayDate(),
                          intCreatedBy: employeeId,
                          dteUpdatedAt: todayDate(),
                          intUpdatedBy: employeeId,
                          intBankOrWalletType: 1,
                          intBankWalletId: 0,
                          strBankWalletName: "",
                          strDistrict: "",
                          intBankBranchId: values?.branchName?.value || 0,
                          strBranchName: values?.branchName?.label || "",
                          strRoutingNo: values?.routingNo || "",
                          strAccountName: values?.accName || "",
                          strAccountNo: values?.accNo || "",
                          strSwiftCode: values?.swiftCode || "",
                        };
                        console.log("payload", payload);
                        bankDetailsAction(payload, setLoading, getEmpData, "");
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default DefaultSalary;

/*
  grossSalary  =   Basic + Medical +  House + Conveyance Salary + 	Special Salary

  totalSalary = grossSalary - CBADeductionSalary ( TotalSalary )

  totalSalary  = grossSalary - CBADeductionSalary  + otherElementsCalculation

*/
