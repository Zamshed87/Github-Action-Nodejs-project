import React from "react";
import { gray200, gray400, gray700 } from './../../../../../../../utility/customColor';
import FormikInput from './../../../../../../../common/FormikInput';
import FormikSelect from './../../../../../../../common/FormikSelect';
import { getBreakdownListDDL, getByIdBreakdownListDDL } from './../../../helper';
import { customStyles } from "../../../../../../../utility/selectCustomStyle";

const DefaultSalary = ({ propsObj }) => {
  const {
    singleData,
    orgId,
    defaultPayrollElement,
    finalPayrollElement,
    breakDownList,
    setBreakDownList,
    defaultSalaryInitData,
    netGross,
    totalAmount,
    finalTotalAmount,
    // formik
    rowDtoHandler,
    resetForm,
    setFieldValue,
    values,
    errors,
    touched
  } = propsObj;

  return (
    <>
      <div className="pl-2 salary-info-wrapper" style={{ overflow: "scroll !important" }}>
        {/* effective month */}

        <div className="row d-none">
          <div className="col-lg-9">
            <h2
              style={{
                fontWeight: "500",
                fontSize: "14px",
                lineHeight: "20px",
                color: gray700
              }}
            >
              Effective Month
            </h2>
          </div>
          <div className="col-lg-3">
            <FormikInput
              classes="input-sm"
              value={values?.effectiveDate}
              name="effectiveDate"
              type="month"
              className="form-control"
              onChange={(e) => {
                setFieldValue("effectiveYear", +e.target.value.split("").slice(0, 4).join(""));
                setFieldValue("effectiveMonth", +e.target.value.split("").slice(-2).join(""));
                setFieldValue("effectiveDate", e.target.value);
              }}
              errors={errors}
              touched={touched}
            />
          </div>
        </div>

        {/* payroll element */}
        <div className="row mb-less" style={{ alignItems: 'center', marginBottom: "12px" }}>
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
                options={finalPayrollElement || []}
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
                options={finalPayrollElement || []}
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
            <div className="row mb-less" style={{ alignItems: 'center', marginBottom: "12px" }}>
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
                <FormikInput
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
            <div className="row mb-less" style={{ alignItems: 'center', marginBottom: "12px" }}>
              <div className="col-12">
                <div
                  style={{
                    marginBottom: "10px",
                    borderBottom: `1px solid ${gray200}`
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
                  {values?.payrollElement?.strDependOn === "Basic" ? "Total Gross Salary" : "Total Gross Salary"}
                </h2>
              </div>
              <div className="col-lg-5">
                <FormikInput
                  classes="input-sm"
                  value={values?.totalGrossSalary}
                  name="totalGrossSalary"
                  type="number"
                  className="form-control"
                  onChange={(e) => {
                    if (singleData[0]?.intSalaryBreakdownHeaderId === values?.payrollElement?.value) {
                      getByIdBreakdownListDDL(
                        "ASSIGNED_BREAKDOWN_ELEMENT_BY_EMPLOYEE_ID",
                        orgId,
                        singleData[0]?.EmployeeId || 0,
                        values?.payrollElement?.value,
                        setBreakDownList,
                        +e.target.value
                      );
                    } else {
                      getBreakdownListDDL(
                        "BREAKDOWN ELEMENT BY ID",
                        orgId,
                        values?.payrollElement?.value,
                        +e.target.value,
                        setBreakDownList
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
                        borderBottom: `1px solid ${gray200}`
                      }}
                    ></div>
                  </div>
                  <div className="col-lg-7">
                    <h2
                      style={{
                        fontWeight: "400",
                        fontSize: "12px",
                        lineHeight: "18px",
                        color: gray400
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
                        textAlign: "right"
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
                        borderBottom: `1px solid ${gray200}`
                      }}
                    ></div>
                  </div>
                </div>

                {breakDownList?.length > 0 && breakDownList?.map((itm, index) => {
                  return (
                    <div className="row" key={index} style={{ alignItems: 'baseline', marginBottom: "12px" }}>
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
                          {itm?.strBasedOn === "Amount" ? "" : `( ${itm?.showPercentage || 0} %)`}

                        </h2>
                      </div>
                      <div className="col-lg-5">
                        <div className="input-field-main breakdownlist">
                          <div className="form-container">
                            <div className="form-group login-input input-xl input-sm">
                              <input
                                className='form-control'
                                value={itm[itm?.levelVariable]}
                                name={itm?.levelVariable}
                                placeholder=" "
                                type='number'
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
                                errors={errors}
                                touched={touched}
                                disabled
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </>
            )}


            {values?.payrollElement?.value && (
              <>
                <div className="row">
                  <div className="col-12">
                    <div
                      style={{
                        marginBottom: "10px",
                        borderBottom: `1px solid ${gray200}`
                      }}
                    ></div>
                  </div>
                </div>
                <div className="row" style={{ alignItems: 'center', marginBottom: "8px" }}>
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
                        textAlign: "right"
                      }}
                    >
                      {netGross()}
                    </h2>
                  </div>
                </div>
                <div className="row" style={{ alignItems: 'center', marginBottom: "8px" }}>
                  <div className="col-lg-7">
                    <h2
                      style={{
                        fontWeight: "500",
                        fontSize: "14px",
                        lineHeight: "20px",
                        color: gray700
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
                        textAlign: "right"
                      }}
                    >
                      {totalAmount}
                    </h2>
                  </div>
                </div>
                <div className="row" style={{ alignItems: 'center' }}>
                  <div className="col-lg-7">
                    <h2
                      style={{
                        fontWeight: "500",
                        fontSize: "14px",
                        lineHeight: "20px",
                        color: gray700
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
                        textAlign: "right"
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

        {/* footer */}
        <div
          style={{
            marginTop: "12px",
            marginBottom: "12px",
            borderBottom: `1px solid ${gray200}`
          }}
        ></div>
        <div className="row">
          <div className="col-12">
            <div className="d-flex align-items-center justify-content-end">
              {(singleData[0]?.Status === "Assigned" && (values?.totalGrossSalary || values?.perDaySalary)) && (
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
                        singleData[0]?.numNetGrossSalary
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
      </div>
    </>
  );
};

export default DefaultSalary;
