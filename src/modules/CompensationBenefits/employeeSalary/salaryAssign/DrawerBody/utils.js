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
