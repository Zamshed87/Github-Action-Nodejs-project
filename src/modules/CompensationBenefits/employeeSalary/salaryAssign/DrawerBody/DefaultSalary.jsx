/* eslint-disable array-callback-return */
import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import FormikSelect from "../../../../../common/FormikSelect";
import { gray200, gray400, gray700 } from "../../../../../utility/customColor";
import { customStyles } from "../../../../../utility/selectCustomStyle";
import { getBreakdownListDDL, getByIdBreakdownListDDL } from "../helper";
import Loading from "../../../../../common/loading/Loading";
import AsyncFormikSelect from "../../../../../common/AsyncFormikSelect";
import axios from "axios";
import { DeleteOutline } from "@mui/icons-material";
import DefaultInput from "../../../../../common/DefaultInput";

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
  } = propsObj;

  const payrollGroupDDL = (positionId) => {
    return finalPayrollElement.filter(
      (itm) => itm?.intHrPositonId === positionId
    );
  };

  const loadEmployeeList = (v, pages) => {
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
      .catch((err) => []);
  };
  console.log({breakDownList})
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
                          <th>Code</th>
                          <th>Employee</th>
                          <th>Designation</th>
                          <th>Workplace Group</th>
                          {wgId === 3 ? (
                            <>
                              <th>Wing</th>
                              <th>Sole Depo</th>
                              <th>Region</th>
                              <th>Area</th>
                              <th>Territory</th>
                            </>
                          ) : null}

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
                              {wgId === 3 ? (
                                <>
                                  <td>
                                    <div className="content tableBody-title">
                                      {item?.wingName}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="content tableBody-title">
                                      {item?.soleDepoName}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="content tableBody-title">
                                      {item?.regionName}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="content tableBody-title">
                                      {item?.areaName}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="content tableBody-title">
                                      {item?.TerritoryName}
                                    </div>
                                  </td>
                                </>
                              ) : null}
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
                      }}
                      errors={errors}
                      touched={touched}
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
                                        itm?.strBasedOn === "Percentage"
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
                    <div className="row">
                      <div className="col-12">
                        <div
                          style={{
                            marginBottom: "10px",
                            borderBottom: `1px solid ${gray200}`,
                          }}
                        ></div>
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
        ) : (
          <>
            {breakDownList?.length > 0 && (
              <div className="row">
                <div className="col-12">
                  <div className="d-flex align-items-center justify-content-end">
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

                    <button
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
