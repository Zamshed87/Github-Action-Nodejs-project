/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import * as yup from "yup";
import { getPeopleDeskAllDDL } from "../../../../common/api";
import BackButton from "../../../../common/BackButton";
import FormikCheckBox from "../../../../common/FormikCheckbox";
import FormikInput from "../../../../common/FormikInput";
import FormikRadio from "../../../../common/FormikRadio";
import FormikSelect from "../../../../common/FormikSelect";
import FormikError from "../../../../common/login/FormikError";
import PrimaryButton from "../../../../common/PrimaryButton";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { greenColor } from "../../../../utility/customColor";
import useAxiosPost from "../../../../utility/customHooks/useAxiosPost";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { todayDate } from "../../../../utility/todayDate";
import { errorHappend, getPolicyById, setErrorsToTheFields } from "./helper";
import "./styles.css";
// validation for initial_values
const validationSchema = yup.object().shape({
  strPolicyName: yup
    .string()
    .min(3, "Name must be longer than 3 characters")
    .max(100)
    .required("Policy name is required!"),
});
// initial values for form
const initData = {
  strPolicyName: "",

  isSalaryCalculationShouldBeActual: false,
  intGrossSalaryDevidedByDays: "",

  intGrossSalaryRoundDigits: "",
  isGrossSalaryRoundUp: false,
  isGrossSalaryRoundDown: false,

  intNetPayableSalaryRoundDigits: "",
  isNetPayableSalaryRoundUp: false,
  isNetPayableSalaryRoundDown: false,

  isSalaryShouldBeFullMonth: false,
  intPreviousMonthStartDay: "",
  intNextMonthEndDay: "",
};
const CreateSalaryPolicy = () => {
  const { orgId, employeeId } = useSelector(
    (state) => state?.auth?.profileData
  );
  const history = useHistory();
  const dispatch = useDispatch();
  const [res, postPolicy] = useAxiosPost();
  //
  // set to administration module
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
  }, []);

  //
  // to handle checkboxes
  const [grossSalaryDevidedByDays, setGrossSalaryDevidedByDays] =
    useState(false);
  const [grossSalaryRoundDigits, setGrossSalaryRoundDigits] = useState(false);
  const [netPayableRoundDigits, setNetPayableRoundDigits] = useState(false);
  const [salaryShouldNotBeFullMonth, setSalaryShouldNotBeFullMonth] =
    useState(false);
  //
  // on form submit
  const saveHandler = (values, cb) => {
    const payload = {
      ...values,
      intGrossSalaryDevidedByDays: +values?.intGrossSalaryDevidedByDays,
      intGrossSalaryRoundDigits: +values?.intGrossSalaryRoundDigits,
      intNetPayableSalaryRoundDigits: +values?.intNetPayableSalaryRoundDigits,
      intPreviousMonthStartDay: +values?.intPreviousMonthStartDay,
      intNextMonthEndDay: +values?.intPreviousMonthStartDay - 1,
      intPolicyId: 0,
      intAccountId: +orgId,
      isActive: true,
      dteCreatedAt: todayDate(),
      intCreatedBy: +employeeId,
      dteUpdatedAt: null,
      intUpdatedBy: 0,
    };
    cb && cb();
    setSalaryShouldNotBeFullMonth(false);
    postPolicy(
      "/Payroll/SaveSalaryPolicy",
      payload,
      (something) =>
        history.push("/administration/payrollConfiguration/salaryPolicy"),
      true,
      "Policy Created Successfully"
    );
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={(values, { resetForm, setFieldError }) => {
        if (errorHappend(values)) {
          setErrorsToTheFields(
            values,
            setFieldError,
            grossSalaryDevidedByDays,
            grossSalaryRoundDigits,
            netPayableRoundDigits,
            salaryShouldNotBeFullMonth
          );
        } else {
          saveHandler(values, () => resetForm());
        }
      }}
    >
      {({ values, setFieldValue, errors, touched, handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <div className="table-card">
            <div
              className="table-card-heading"
              style={{ marginBottom: "12px" }}
            >
              <div>
                <BackButton title="Create Salary Policy" />
              </div>
              <div style={{ width: "140px" }}>
                <PrimaryButton
                  type="submit"
                  className={`float-right btn btn-green btn-green-disabled`}
                  label="Save"
                />
              </div>
            </div>
            <div className="card-style">
              <>
                <div className="row">
                  <div className="col-md-3">
                    <div className="input-field-main">
                      <label className="main-label">Enter policy name</label>
                      <FormikInput
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

                <div className="" style={{ marginTop: "12px" }}>
                  <label className="main-label">
                    Per day salary calculation
                  </label>
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
                            setGrossSalaryDevidedByDays(false);
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
                          grossSalaryDevidedByDays ||
                          values?.intGrossSalaryDevidedByDays
                            ? true
                            : false
                        }
                        name="perday_salary_type_check"
                        onChange={() => {
                          setGrossSalaryDevidedByDays((prev) => !prev);
                          setFieldValue(
                            "isSalaryCalculationShouldBeActual",
                            false
                          );
                          setFieldValue("intGrossSalaryDevidedByDays", "");
                        }}
                      />
                      <label
                        style={{
                          color: grossSalaryDevidedByDays && greenColor,
                          marginRight: "1em",
                        }}
                      >
                        Gross Salary/Days
                      </label>
                      <div className="pt-1">
                        <FormikInput
                          name=""
                          value={values?.intGrossSalaryDevidedByDays}
                          onChange={(e) =>
                            setFieldValue(
                              "intGrossSalaryDevidedByDays",
                              e.target.value
                            )
                          }
                          disabled={!grossSalaryDevidedByDays}
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
                            grossSalaryRoundDigits ||
                            values?.intGrossSalaryRoundDigits
                              ? true
                              : false
                          }
                          name="gross_salary_type_check"
                          onChange={() => {
                            setGrossSalaryRoundDigits((prev) => !prev);
                            setFieldValue("isGrossSalaryRoundUp", false);
                            setFieldValue("isGrossSalaryRoundDown", false);
                            setFieldValue("intGrossSalaryRoundDigits", "");
                          }}
                        />
                        <label
                          className="mr-2"
                          style={{
                            color: grossSalaryRoundDigits && greenColor,
                          }}
                        >
                          Round Salary {"(Decimal)"}
                        </label>
                        <div className="pt-1">
                          <FormikInput
                            name="grossSalaryRoundDigits"
                            disabled={!grossSalaryRoundDigits}
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
                            setFieldValue(
                              "isGrossSalaryRoundUp",
                              !values?.isGrossSalaryRoundUp
                            );
                            setGrossSalaryRoundDigits(false);
                            setFieldValue("intGrossSalaryRoundDigits", "");
                            setFieldValue("isGrossSalaryRoundDown", false);
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
                            setFieldValue(
                              "isGrossSalaryRoundDown",
                              !values?.isGrossSalaryRoundDown
                            );
                            setGrossSalaryRoundDigits(false);
                            setFieldValue("intGrossSalaryRoundDigits", "");
                            setFieldValue("isGrossSalaryRoundUp", false);
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
                            netPayableRoundDigits ||
                            values?.intNetPayableSalaryRoundDigits
                              ? true
                              : false
                          }
                          name="net_payable_type_check"
                          onChange={() => {
                            setNetPayableRoundDigits((prev) => !prev);
                            setFieldValue("isNetPayableSalaryRoundUp", false);
                            setFieldValue("isNetPayableSalaryRoundDown", false);
                            setFieldValue("intNetPayableSalaryRoundDigits", "");
                          }}
                        />
                        <label
                          className="mr-2"
                          style={{
                            color: netPayableRoundDigits && greenColor,
                          }}
                        >
                          Round Salary {"(Decimal)"}
                        </label>
                        <FormikInput
                          name="netPayableRoundDigits"
                          disabled={!netPayableRoundDigits}
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
                            setFieldValue(
                              "isNetPayableSalaryRoundUp",
                              !values?.isNetPayableSalaryRoundUp
                            );
                            setNetPayableRoundDigits(false);
                            setFieldValue("intNetPayableSalaryRoundDigits", "");

                            setFieldValue("isNetPayableSalaryRoundDown", false);
                          }}
                        />
                        <label
                          style={{
                            color:
                              values?.isNetPayableSalaryRoundUp && greenColor,
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
                            setFieldValue(
                              "isNetPayableSalaryRoundDown",
                              !values?.isNetPayableSalaryRoundDown
                            );
                            setNetPayableRoundDigits(false);
                            setFieldValue("intNetPayableSalaryRoundDigits", "");
                            setFieldValue("isNetPayableSalaryRoundUp", false);
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
                        setFieldValue(
                          "isSalaryShouldBeFullMonth",
                          !values?.isSalaryShouldBeFullMonth
                        );
                        setSalaryShouldNotBeFullMonth(false);
                        setFieldValue("intPreviousMonthStartDay", "");
                        setFieldValue("intNextMonthEndDay", "");
                      }}
                      checked={values?.isSalaryShouldBeFullMonth ? true : false}
                    />
                  </div>

                  <div className="d-flex align-items-center">
                    <FormikRadio
                      labelColor={
                        salaryShouldNotBeFullMonth && `${greenColor} !important`
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
                        setSalaryShouldNotBeFullMonth((prev) => !prev);
                        setFieldValue("isSalaryShouldBeFullMonth", false);
                      }}
                      checked={
                        salaryShouldNotBeFullMonth ||
                        values?.intPreviousMonthStartDay
                          ? true
                          : false
                      }
                    />
                    <div style={{ width: "60px" }} className="pt-1">
                      <FormikInput
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
                        disabled={!salaryShouldNotBeFullMonth}
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
                        color: salaryShouldNotBeFullMonth && greenColor,
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
              </>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CreateSalaryPolicy;
