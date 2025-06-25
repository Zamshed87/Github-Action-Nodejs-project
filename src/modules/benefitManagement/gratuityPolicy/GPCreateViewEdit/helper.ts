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

  if (values?.serviceLengthStart > values?.serviceLengthEnd) {
    return toast.error(
      "Service Length end should be bigger than Service Length Start"
    );
  }

  const { serviceLengthStart: newStart, serviceLengthEnd: newEnd } = values;

  const isConflict = data.some(({ serviceLengthStart, serviceLengthEnd }) =>
    isOverlapping(newStart, newEnd, serviceLengthStart, serviceLengthEnd)
  );

  if (isConflict) {
    return toast.error("Service length range overlaps with an existing entry!");
  }

  setData([
    ...data,
    {
      idx: crypto.randomUUID(),
      serviceLengthStart: values?.serviceLengthStart,
      serviceLengthEnd: values?.serviceLengthEnd,
      intServiceLengthInMonth:
        values?.serviceLengthEnd - values?.serviceLengthStart,
      intDisbursementDependOnId: values?.disbursementDependOn?.value,
      disbursementDependOnName: values?.disbursementDependOn?.label,
      numPercentage: values?.numPercentage,
    },
  ]);
  form.resetFields(fieldsToReset);
};

const fieldsToReset = [
  "serviceLengthStart",
  "serviceLengthEnd",
  "disbursementDependOn",
  "numPercentage",
]; // dynamically computed array

export const createEditLatePunishmentConfig = async (
  profileData: any,
  form: FormInstance<any>,
  data: DataState,
  //   leaveDeductionData: LeaveDeductionDataState,
  setLoading: { (value: SetStateAction<boolean>): void; (arg0: boolean): void },
  cb: any
) => {
  setLoading(true);
  try {
    const { orgId, buId, wgId, wId, employeeId, intAccountId } = profileData;
    const values = form.getFieldsValue(true);

    // const payload = mapLatePunishmentPayload(
    //   values,
    //   data,
    //   "",
    //   orgId,
    //   buId,
    //   wgId,
    //   wId,
    //   intAccountId
    // );
    const res = await axios.post(`/LatePunishmentpolicy`, {}); // change
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
