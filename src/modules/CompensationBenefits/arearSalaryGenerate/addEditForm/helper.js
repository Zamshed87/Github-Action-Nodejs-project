import * as Yup from "yup";
import { todayDate } from "../../../../utility/todayDate";

export const initialValues = {
  businessUnit: "",
  fromDate: todayDate(),
  toDate: "",
  description: "",
  percentOfGross: "",
  payrollPolicy: "",
  search: "",
};

export const validationSchema = Yup.object().shape({
  businessUnit: Yup.object()
    .shape({
      value: Yup.string().required("Business Unit is required"),
      label: Yup.string().required("Business Unit is required"),
    })
    .typeError("Business Unit is required"),
  payrollPolicy: Yup.object()
    .shape({
      value: Yup.string().required("Payroll Policy is required"),
      label: Yup.string().required("Payroll Policy is required"),
    })
    .typeError("Payroll Policy is required"),
  fromDate: Yup.date().required("From date is required"),
  toDate: Yup.date().required("From date is required"),
  percentOfGross: Yup.number()
    .min(1, "Must be greater than zero")
    .required("Percent of gross is required"),
});
