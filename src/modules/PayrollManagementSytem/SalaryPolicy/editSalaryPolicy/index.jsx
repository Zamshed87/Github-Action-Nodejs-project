import { useFormik } from "formik";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import BackButton from "../../../../common/BackButton";
import DefaultInput from "../../../../common/DefaultInput";
import FormikCheckBox from "../../../../common/FormikCheckbox";
import FormikRadio from "../../../../common/FormikRadio";
import FormikError from "../../../../common/login/FormikError";
import PrimaryButton from "../../../../common/PrimaryButton";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { greenColor } from "../../../../utility/customColor";
import useAxiosPost from "../../../../utility/customHooks/useAxiosPost";
import { todayDate } from "../../../../utility/todayDate";
import {
  errorHappend,
  getPolicyById,
  setErrorsToTheFields,
} from "../CreateSalaryPolicy/helper";
import Loading from "./../../../../common/loading/Loading";
const initialValues = {
  strPolicyName: "",

  isSalaryCalculationShouldBeActual: false,
  isGrossSalaryDividedByDays: false,
  intGrossSalaryDevidedByDays: "",

  isGrossSalaryRoundDigits: false,
  intGrossSalaryRoundDigits: "",
  isGrossSalaryRoundUp: false,
  isGrossSalaryRoundDown: false,

  isNetPayableSalaryRoundDigits: false,
  intNetPayableSalaryRoundDigits: "",
  isNetPayableSalaryRoundUp: false,
  isNetPayableSalaryRoundDown: false,

  isSalaryShouldBeFullMonth: false,
  isSalaryShouldNotBeFullMonth: false,
  intPreviousMonthStartDay: "",
  intNextMonthEndDay: "",
};

const EditSalaryPolicy = () => {
  const { employeeId } = useSelector(
    (state) => state?.auth?.profileData
  );
  const history = useHistory();
  const dispatch = useDispatch();
  const { policyId } = useParams();
  const {
    values,
    setFieldValue,
    setValues,
    errors,
    touched,
    handleSubmit,
    setFieldError,
    resetForm,
  } = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: (formValues) => {
      if (errorHappend(formValues)) {
        setErrorsToTheFields(
          formValues,
          setFieldError,
          formValues?.isGrossSalaryDividedByDays,
          formValues?.isGrossSalaryRoundDigits,
          formValues?.isNetPayableSalaryRoundDigits,
          formValues?.isSalaryShouldNotBeFullMonth
        );
      } else {
        const payload = {
          ...formValues,
          intPolicyId: formValues?.intPolicyId,
          intGrossSalaryDevidedByDays: +formValues?.intGrossSalaryDevidedByDays,
          intGrossSalaryRoundDigits: +formValues?.intGrossSalaryRoundDigits,
          intNetPayableSalaryRoundDigits:
            +formValues?.intNetPayableSalaryRoundDigits,
          intPreviousMonthStartDay: +formValues?.intPreviousMonthStartDay,
          intNextMonthEndDay: +formValues?.intPreviousMonthStartDay - 1,
          isActive: true,
          dteUpdatedAt: todayDate(),
          intUpdatedBy: +employeeId,
        };
        editSalaryPolicy(
          "/Payroll/SaveSalaryPolicy",
          payload,
          (something) => {
            history.push("/administration/payrollConfiguration/salaryPolicy");
            resetForm();
          },
          true,
          "Policy Edited Successfully"
        );
      }
    },
  });

  useEffect(() => {
    getPolicyById(policyId, setValues);
  }, [policyId, setValues]);

  const [, editSalaryPolicy, loadingOnEditSalaryPolicy] = useAxiosPost();

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
  }, [dispatch]);
  return (
    <>
      {loadingOnEditSalaryPolicy && <Loading />}
      <form onSubmit={handleSubmit}>
        <div className="table-card">
          <div className="table-card-heading" style={{ marginBottom: "12px" }}>
            <div>
              <BackButton title="Edit Salary Policy" />
            </div>
            <div>
              <PrimaryButton
                type="submit"
                className="btn btn-default"
                label="Save Changes"
              />
            </div>
          </div>
          <div className="card-style">
            <div className="row">
              <div className="col-md-3">
                <div className="input-field-main">
                  <label className="main-label">Enter policy name</label>
                  <DefaultInput
                    name="strPolicyName"
                    classes="input-sm"
                    value={values?.strPolicyName}
                    onChange={(e) => {
                      setFieldValue("strPolicyName", e.target.value);
                    }}
                    type="text"
                    className="form-control"
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>
            </div>
            {/*  */}
            {/*  */}
            {/*  */}
            <div className="" style={{ marginTop: "12px" }}>
              <label className="main-label">Per day salary calculation</label>
              <div className="d-flex">
                <div>
                  <div
                    className="d-flex align-items-center mr-4"
                    style={{ minWidth: "250px" }}
                  >
                    <FormikCheckBox
                      height="15px"
                      styleObj={{
                        checkedColor: greenColor,
                        margin: "0 -20px 0 0",
                      }}
                      checked={values?.isSalaryCalculationShouldBeActual}
                      name="perday_salary_type_check"
                      onChange={() => {
                        setFieldValue(
                          "isSalaryCalculationShouldBeActual",
                          !values?.isSalaryCalculationShouldBeActual
                        );
                        setFieldValue("isGrossSalaryDividedByDays", false);
                        setFieldValue("intGrossSalaryDevidedByDays", "");
                      }}
                    />
                    <label
                      style={{
                        color:
                          values?.isSalaryCalculationShouldBeActual &&
                          greenColor,
                      }}
                    >
                      Gross Salary/Actual Month Days
                    </label>
                  </div>
                </div>
                <div
                  className="d-flex align-items-center"
                  style={{ minWidth: "220px" }}
                >
                  <FormikCheckBox
                    height="15px"
                    styleObj={{
                      checkedColor: greenColor,
                      margin: "0 -20px 0 0",
                    }}
                    checked={
                      values?.isGrossSalaryDividedByDays ||
                        +values?.intGrossSalaryDevidedByDays > 0
                        ? true
                        : false
                    }
                    name="perday_salary_type_check"
                    onChange={() => {
                      setValues((prev) => ({
                        ...prev,
                        isSalaryCalculationShouldBeActual: false,
                        intGrossSalaryDevidedByDays: "",
                        isGrossSalaryDividedByDays:
                          !prev?.isGrossSalaryDividedByDays,
                      }));
                    }}
                  />
                  <label
                    style={{
                      color: values?.isGrossSalaryDividedByDays && greenColor,
                      marginRight: "1em",
                    }}
                  >
                    Gross Salary/Days
                  </label>
                  <div className="pt-1">
                    <DefaultInput
                      name=""
                      value={values?.intGrossSalaryDevidedByDays}
                      onChange={(e) =>
                        setFieldValue(
                          "intGrossSalaryDevidedByDays",
                          e.target.value
                        )
                      }
                      disabled={!values?.isGrossSalaryDividedByDays}
                      type="text"
                      className="form-control"
                      classes="input-sm"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
              </div>
              <FormikError
                errors={errors}
                touched={touched}
                name="isSalaryCalculationShouldBeActual"
              />
            </div>
            {/*  */}
            {/*  */}
            {/*  */}
            <div className="">
              <label className="main-label">Gross will be</label>
              <div className="row">
                <div className="col-md-10 d-flex align-items-center">
                  <div className="d-flex align-items-center mr-2">
                    <FormikCheckBox
                      height="15px"
                      styleObj={{
                        checkedColor: greenColor,
                        margin: "0 -20px 0 0",
                      }}
                      checked={
                        values?.isGrossSalaryRoundDigits ||
                          +values?.intGrossSalaryRoundDigits > 0
                          ? true
                          : false
                      }
                      name="gross_salary_type_check"
                      onChange={() => {
                        setValues((prev) => ({
                          ...prev,
                          isGrossSalaryRoundDigits:
                            !prev?.isGrossSalaryRoundDigits,
                          isGrossSalaryRoundUp: false,
                          isGrossSalaryRoundDown: false,
                          intGrossSalaryRoundDigits: "",
                        }));
                      }}
                    />
                    <label
                      className="mr-2"
                      style={{
                        color: values?.isGrossSalaryRoundDigits && greenColor,
                      }}
                    >
                      Round Salary {"(Decimal)"}
                    </label>
                    <div className="pt-1">
                      <DefaultInput
                        name="grossSalaryRoundDigits"
                        disabled={!values?.isGrossSalaryRoundDigits}
                        classes="input-sm"
                        value={values?.intGrossSalaryRoundDigits}
                        onChange={(e) => {
                          e.target.value !== "00" &&
                            setFieldValue(
                              "intGrossSalaryRoundDigits",
                              e.target.value
                            );
                        }}
                        type="text"
                        className="form-control"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>

                  <div className="d-flex align-items-center mx-3">
                    <FormikCheckBox
                      height="15px"
                      styleObj={{
                        checkedColor: greenColor,
                        margin: "0 -20px 0 0",
                      }}
                      checked={values?.isGrossSalaryRoundUp}
                      name="gross_salary_type_check"
                      onChange={() => {
                        setValues((prev) => ({
                          ...prev,
                          isGrossSalaryRoundUp: !prev?.isGrossSalaryRoundUp,
                          isGrossSalaryRoundDigits: false,
                          intGrossSalaryRoundDigits: "",
                          isGrossSalaryRoundDown: false,
                        }));
                      }}
                    />
                    <label
                      style={{
                        color: values?.isGrossSalaryRoundUp && greenColor,
                      }}
                    >
                      Round Up
                    </label>
                  </div>

                  <div className="d-flex align-items-center mx-3">
                    <FormikCheckBox
                      height="15px"
                      styleObj={{
                        checkedColor: greenColor,
                        margin: "0 -20px 0 0",
                      }}
                      checked={values?.isGrossSalaryRoundDown}
                      name="gross_salary_type_check"
                      onChange={() => {
                        setValues((prev) => ({
                          ...prev,
                          isGrossSalaryRoundDown: !prev?.isGrossSalaryRoundDown,
                          isGrossSalaryRoundDigits: false,
                          intGrossSalaryRoundDigits: "",
                          isGrossSalaryRoundUp: false,
                        }));
                      }}
                    />
                    <label
                      style={{
                        color: values?.isGrossSalaryRoundDown && greenColor,
                      }}
                    >
                      Round Down
                    </label>
                  </div>
                </div>
              </div>
              <FormikError
                errors={errors}
                touched={touched}
                name="intGrossSalaryRoundDigits"
              />
            </div>
            {/*  */}
            {/*  */}
            {/*  */}
            <div className="">
              <label className="main-label">Net payable will be</label>
              <div className="row">
                <div className="col-md-10 d-flex align-items-center">
                  <div className="d-flex align-items-center mr-2">
                    <FormikCheckBox
                      height="15px"
                      styleObj={{
                        checkedColor: greenColor,
                        margin: "0 -20px 0 0",
                      }}
                      checked={
                        values?.isNetPayableSalaryRoundDigits ||
                          +values?.intNetPayableSalaryRoundDigits > 0
                          ? true
                          : false
                      }
                      name="net_payable_type_check"
                      onChange={() => {
                        setValues((prev) => ({
                          ...prev,
                          isNetPayableSalaryRoundDigits:
                            !prev?.isNetPayableSalaryRoundDigits,
                          isNetPayableSalaryRoundUp: false,
                          isNetPayableSalaryRoundDown: false,
                          intNetPayableSalaryRoundDigits: "",
                        }));
                      }}
                    />
                    <label
                      className="mr-2"
                      style={{
                        color:
                          values?.isNetPayableSalaryRoundDigits && greenColor,
                      }}
                    >
                      Round Salary {"(Decimal)"}
                    </label>
                    <DefaultInput
                      name="netPayableRoundDigits"
                      disabled={!values?.isNetPayableSalaryRoundDigits}
                      classes="input-sm"
                      value={values?.intNetPayableSalaryRoundDigits}
                      onChange={(e) =>
                        e.target.value !== "00" &&
                        setFieldValue(
                          "intNetPayableSalaryRoundDigits",
                          e.target.value
                        )
                      }
                      type="text"
                      className="form-control"
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="d-flex align-items-center mx-3">
                    <FormikCheckBox
                      height="15px"
                      styleObj={{
                        checkedColor: greenColor,
                        margin: "0 -20px 0 0",
                      }}
                      checked={values?.isNetPayableSalaryRoundUp}
                      name="net_payable_type_check"
                      onChange={() => {
                        setValues((prev) => ({
                          ...prev,
                          isNetPayableSalaryRoundUp:
                            !prev?.isNetPayableSalaryRoundUp,
                          isNetPayableSalaryRoundDigits: false,
                          intNetPayableSalaryRoundDigits: "",
                          isNetPayableSalaryRoundDown: false,
                        }));
                      }}
                    />
                    <label
                      style={{
                        color: values?.isNetPayableSalaryRoundUp && greenColor,
                      }}
                    >
                      Round Up
                    </label>
                  </div>

                  <div className="d-flex align-items-center mx-3">
                    <FormikCheckBox
                      height="15px"
                      styleObj={{
                        checkedColor: greenColor,
                        margin: "0 -20px 0 0",
                      }}
                      checked={values?.isNetPayableSalaryRoundDown}
                      name="net_payable_type_check"
                      onChange={() => {
                        setValues((prev) => ({
                          ...prev,
                          isNetPayableSalaryRoundDown:
                            !prev?.isNetPayableSalaryRoundDown,
                          isNetPayableSalaryRoundDigits: false,
                          intNetPayableSalaryRoundDigits: "",
                          isNetPayableSalaryRoundUp: false,
                        }));
                      }}
                    />
                    <label
                      style={{
                        color:
                          values?.isNetPayableSalaryRoundDown && greenColor,
                      }}
                    >
                      Round Down
                    </label>
                  </div>
                </div>
              </div>
              <FormikError
                errors={errors}
                touched={touched}
                name="intNetPayableSalaryRoundDigits"
              />
            </div>
            {/*  */}
            {/*  */}
            {/*  */}
            <div className="">
              <label className="main-label">Salary period</label>

              <div className="">
                <FormikRadio
                  labelColor={
                    values?.isSalaryShouldBeFullMonth &&
                    `${greenColor} !important`
                  }
                  styleObj={{
                    iconWidth: "15px",
                    icoHeight: "15px",
                    padding: "0px 8px 0px 10px",
                  }}
                  name="salaryPeriod"
                  label="1 to end of the month"
                  value="Salary Should Be Full Month"
                  color={greenColor}
                  onChange={() => {
                    setValues((prev) => ({
                      ...prev,
                      isSalaryShouldBeFullMonth:
                        !prev?.isSalaryShouldBeFullMonth,
                      isSalaryShouldNotBeFullMonth: false,
                      intPreviousMonthStartDay: "",
                      intNextMonthEndDay: "",
                    }));
                  }}
                  checked={values?.isSalaryShouldBeFullMonth}
                />
              </div>

              <div className="d-flex align-items-center">
                <FormikRadio
                  labelColor={
                    values?.isSalaryShouldNotBeFullMonth &&
                    `${greenColor} !important`
                  }
                  styleObj={{
                    iconWidth: "15px",
                    icoHeight: "15px",
                    padding: "0px 8px 0px 10px",
                  }}
                  name="salaryPeriod"
                  label="previous month"
                  value="Salary Should Not Be Full Month"
                  color={greenColor}
                  onChange={() => {
                    setValues((prev) => ({
                      ...prev,
                      isSalaryShouldNotBeFullMonth:
                        !prev?.isSalaryShouldNotBeFullMonth,
                      isSalaryShouldBeFullMonth: false,
                    }));
                  }}
                  checked={
                    values?.isSalaryShouldNotBeFullMonth ||
                      +values?.intPreviousMonthStartDay > 0
                      ? true
                      : false
                  }
                />
                <div style={{ width: "60px" }} className="pt-1">
                  <DefaultInput
                    value={values?.intPreviousMonthStartDay}
                    onChange={(e) => {
                      if (e.target.value > 28 || e.target.value <= 0) {
                        return;
                      } else {
                        setFieldValue(
                          "intPreviousMonthStartDay",
                          e.target.value
                        );
                      }
                    }}
                    disabled={!values?.isSalaryShouldNotBeFullMonth}
                    type="number"
                    className="form-control"
                    classes="input-sm"
                    errors={errors}
                    touched={touched}
                    max={28}
                  />
                </div>
                <label
                  className="mx-2"
                  style={{
                    color: values?.isSalaryShouldNotBeFullMonth && greenColor,
                  }}
                >
                  to salary month
                </label>
                <div
                  style={{
                    textAlign: "center",
                    backgroundColor: "#F2F4F7",
                    paddingTop: "3px",
                    marginBottom: "5px",
                    height: "30px",
                    width: "60px",
                    borderRadius: "5px",
                    border: "1px solid #D0D5DD",
                  }}
                >
                  {values?.intPreviousMonthStartDay &&
                    JSON.parse(values?.intPreviousMonthStartDay) > 1 &&
                    JSON.parse(values?.intPreviousMonthStartDay) - 1}
                </div>
              </div>
              <FormikError
                errors={errors}
                touched={touched}
                name="intPreviousMonthStartDay"
              />
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default EditSalaryPolicy;
