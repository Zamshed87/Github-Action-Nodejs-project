import axios from "axios";
import { toast } from "react-toastify";

export const getPolicyById = async (policyId, setValues) => {
  try {
    const { data } = await axios.get(
      `/Payroll/GetSalaryPolicyById?id=${policyId}`
    );
    const modifyData = {
      ...data,

      // stringyfy data..so that they can show and operate in input field..cause integer type data cant perform in text input
      intGrossSalaryDevidedByDays: `${data?.intGrossSalaryDevidedByDays || ""}`,
      intGrossSalaryRoundDigits: `${data?.intGrossSalaryRoundDigits || ""}`,
      intNetPayableSalaryRoundDigits: `${
        data?.intNetPayableSalaryRoundDigits || ""
      }`,
      intPreviousMonthStartDay: `${data?.intPreviousMonthStartDay || ""}`,
      intNextMonthEndDay: `${data?.intNextMonthEndDay || ""}`,
    };

    setValues((prev) => ({ ...prev, ...modifyData }));
  } catch (error) {
    toast.warn("Something went wrong!");
  }
};

export const errorHappend = (values) => {
  if (
    !values?.strPolicyName ||
    (!values?.isSalaryCalculationShouldBeActual &&
      !values?.intGrossSalaryDevidedByDays) ||
    (!values?.intGrossSalaryRoundDigits &&
      !values?.isGrossSalaryRoundUp &&
      !values?.isGrossSalaryRoundDown) ||
    (!values?.intNetPayableSalaryRoundDigits &&
      !values?.isNetPayableSalaryRoundUp &&
      !values?.isNetPayableSalaryRoundDown) ||
    (!values?.isSalaryShouldBeFullMonth &&
      values?.intPreviousMonthStartDay === "0")
  ) {
    return true;
  } else {
    return false;
  }
};

export const setErrorsToTheFields = (
  values,
  setFieldError,
  grossSalaryDevidedByDays,
  grossSalaryRoundDigits,
  netPayableRoundDigits,
  salaryShouldNotBeFullMonth
) => {
  if (!values?.strPolicyName) {
    setFieldError("strPolicyName", "Policy name is required");
  }

  //
  //
  if (
    !values?.isSalaryCalculationShouldBeActual &&
    values?.intGrossSalaryDevidedByDays === "0"
  ) {
    grossSalaryDevidedByDays
      ? setFieldError(
          "isSalaryCalculationShouldBeActual",
          "Please give per day salary calculation"
        )
      : setFieldError(
          "isSalaryCalculationShouldBeActual",
          "Please select per day salary calculation type"
        );
  }
  //
  //
  if (
    values?.intGrossSalaryRoundDigits === "0" &&
    !values?.isGrossSalaryRoundUp &&
    !values?.isGrossSalaryRoundDown
  ) {
    grossSalaryRoundDigits
      ? setFieldError(
          "intGrossSalaryRoundDigits",
          "Please give gross salary round digits"
        )
      : setFieldError(
          "intGrossSalaryRoundDigits",
          "Please select gross salary type"
        );
  }
  //
  //
  if (
    values?.intNetPayableSalaryRoundDigits === "0" &&
    !values?.isNetPayableSalaryRoundUp &&
    !values?.isNetPayableSalaryRoundDown
  ) {
    netPayableRoundDigits
      ? setFieldError(
          "intNetPayableSalaryRoundDigits",
          "Please give net payable salary round digits"
        )
      : setFieldError(
          "intNetPayableSalaryRoundDigits",
          "Please select net payable type"
        );
  }
  //
  //
  if (
    !values?.isSalaryShouldBeFullMonth &&
    values?.intPreviousMonthStartDay === "0"
  ) {
    salaryShouldNotBeFullMonth
      ? setFieldError(
          "intPreviousMonthStartDay",
          "Please give previous month day"
        )
      : setFieldError(
          "intPreviousMonthStartDay",
          "Please select salary period"
        );
  }
};
