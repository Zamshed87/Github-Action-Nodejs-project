import * as Yup from "yup";

export const defaultSalaryInitData = {
  effectiveDate: "",
  effectiveMonth: "",
  effectiveYear: "",
  payrollElement: "",
  isPerdaySalary: false,
  totalGrossSalary: "",
  perDaySalary: "",
  amountSalary: "",
  finalGrossSalary: "",
};

export const DefaultSalaryValidationSchema = Yup.object().shape({
  // effectiveDate: Yup.string().required("Effective Date is required"),
  // effectiveMonth: Yup.number().required("Effective Month is required"),
  // effectiveYear: Yup.number().required("Effective Year is required"),
});

export const adjustPaymentFiledFun = (
  amount = 0,
  fieldName,
  totalGrossSalary = 0,
  values,
  setFieldValue
) => {
  const previousNetPay = values?.netPay || 0;
  const previousDigitalPay = values?.digitalPay || 0;
  const previousBankPay = values?.bankPay || 0;
  switch (fieldName) {
    case "netPay": {
      if (previousDigitalPay < 1) {
        setFieldValue("bankPay", totalGrossSalary - amount);
      }
      // setFieldValue("bankPay", ((totalGrossSalary - previousDigitalPay) - amount));
      setFieldValue(
        "digitalPay",
        totalGrossSalary - previousBankPay - amount < 0
          ? ""
          : totalGrossSalary - previousBankPay - amount
      );
      setFieldValue("netPay", amount);
      // Code for netPay
      break;
    }
    case "bankPay": {
      if (previousNetPay < 1) {
        setFieldValue("digitalPay", totalGrossSalary - amount);
      }
      setFieldValue("bankPay", amount);
      // setFieldValue("digitalPay", 0);
      setFieldValue(
        "netPay",
        totalGrossSalary - previousDigitalPay - amount < 0
          ? ""
          : totalGrossSalary - previousDigitalPay - amount
      );
      // Code for bankPay
      break;
    }
    case "digitalPay": {
      if (previousNetPay < 1) {
        setFieldValue("bankPay", totalGrossSalary - amount);
      }
      // setFieldValue("bankPay", (totalGrossSalary - amount));
      setFieldValue("digitalPay", amount);
      setFieldValue(
        "netPay",
        totalGrossSalary - previousBankPay - amount < 0
          ? ""
          : totalGrossSalary - previousBankPay - amount
      );
      // Code for digitalPay
      break;
    }

    default:
      // Code for other cases or no matching case
      break;
  }
};