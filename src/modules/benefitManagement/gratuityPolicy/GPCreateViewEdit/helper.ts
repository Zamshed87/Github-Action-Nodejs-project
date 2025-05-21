import { toast } from "react-toastify";
import { DataState } from "../type";
import { FormInstance } from "antd";
import { SetStateAction } from "react";
import axios from "axios";

const isOverlapping = (
  newStart: number,
  newEnd: number,
  existingStart: number,
  existingEnd: number
): boolean => {
  return Math.max(newStart, existingStart) <= Math.min(newEnd, existingEnd);
};

export const addHandler = (setData: any, data: DataState, form: any) => {
  const values = form.getFieldsValue(true);

  if (
    values?.intServiceLengthStartInMonth > values?.intServiceLengthEndInMonth
  ) {
    return toast.error(
      "Service Length end should be bigger than Service Length Start"
    );
  }

  const { serviceLengthStart: newStart, serviceLengthEnd: newEnd } = values;

  const isConflict = data.some(
    ({ intServiceLengthStartInMonth, intServiceLengthEndInMonth }) =>
      isOverlapping(
        newStart,
        newEnd,
        intServiceLengthStartInMonth,
        intServiceLengthEndInMonth
      )
  );

  if (isConflict) {
    return toast.error("Service length range overlaps with an existing entry!");
  }

  setData([
    ...data,
    {
      idx: crypto.randomUUID(),
      intServiceLengthStartInMonth: values?.intServiceLengthStartInMonth,
      intServiceLengthEndInMonth: values?.intServiceLengthEndInMonth,
      intServiceLengthInMonth:
        values?.intServiceLengthEndInMonth -
        values?.intServiceLengthStartInMonth,
      intDisbursementDependOnId: values?.disbursementDependOn?.value,
      disbursementDependOnName: values?.disbursementDependOn?.label,
      numPercentageOrFixedAmount: values?.numPercentageOrFixedAmount,
    },
  ]);
  form.resetFields(fieldsToReset);
};

const fieldsToReset = [
  "intServiceLengthStartInMonth",
  "intServiceLengthEndInMonth",
  "disbursementDependOn",
  "numPercentageOrFixedAmount",
]; // dynamically computed array

export const createEditGratuityPolicy = async (
  type: string | undefined,
  profileData: any,
  form: FormInstance<any>,
  data: DataState,
  //   leaveDeductionData: LeaveDeductionDataState,
  setLoading: { (value: SetStateAction<boolean>): void; (arg0: boolean): void },
  cb: any
) => {
  setLoading(true);
  try {
    const values = form.getFieldsValue(true);
    console.log(values, "values");
    console.log(data, "data");
    const payload = mapGratuityPolicy(values, data);
    const url =
      type === "edit"
        ? "/GratuityPolicy" + values?.intPolicyId
        : "/GratuityPolicy";
    const res = await axios.post(url, payload); // change
    form.resetFields();
    toast.success("Created Successfully", { toastId: 1222 });
    cb && cb();
    setLoading(false);
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.Message || "Something went wrong";
    toast.warn(errorMessage);
  } finally {
    setLoading(false);
  }
};

const mapGratuityPolicy = (values: any, data: DataState) => {
  return {
    strPolicyName: values.strPolicyName,
    intWorkplaceId: values.workplace?.intWorkplaceId ?? values.workplace?.value,
    intEmploymentTypeId:
      values.employmentType?.Id ?? values.employmentType?.value,
    intEligibilityDependOn: values.eligibilityDependOn?.value,
    isActive: true,
    gratuityPolicyDetails: data.map((item) => ({
      intPolicyDetailsId: item?.intPolicyDetailsId || 0,
      intServiceLengthStartInMonth: item.intServiceLengthStartInMonth,
      intServiceLengthEndInMonth: item.intServiceLengthEndInMonth,
      intDisbursementDependOnId: item.intDisbursementDependOnId,
      numPercentageOrFixedAmount: item.numPercentageOrFixedAmount, // or item.numFixedAmount if needed
    })),
  };
};
