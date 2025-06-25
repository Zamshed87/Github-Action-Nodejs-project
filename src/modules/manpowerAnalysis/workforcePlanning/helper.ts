import { FormInstance } from "antd";
import axios from "axios";
import moment from "moment";
import { SetStateAction } from "react";
import { toast } from "react-toastify";

export const createTrainingRequisition = async (
  form: FormInstance<any>,
  profileData: { orgId: any; buId: any; wgId: any; wId: any; employeeId: any },
  setLoading: { (value: SetStateAction<boolean>): void; (arg0: boolean): void },
  cb: any
  // setOpenTrainingTitleModal: (arg0: boolean) => void
) => {
  setLoading(true);
  try {
    const values = form.getFieldsValue(true);

    const payload = {
      trainingTypeId: values?.trainingType?.value || "",
      employmentTypeId: values?.employee?.value || "",
      reasonForRequisition: values?.reasonForRequisition || "",
      objectivesToAchieve: values?.objectivesToAchieve || "",
      remarks: values?.remarks || "",
      statusId: "0",
    };
    const res = await axios.post(
      `/TrainingRequisition/Training/TrainingRequisition`,
      payload
    );
    form.resetFields();
    toast.success("Created Successfully", { toastId: 1222 });
    cb && cb();
    // setOpenTrainingTitleModal && setOpenTrainingTitleModal(false);
    setLoading(false);
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.Message || "Something went wrong";
    toast.warn(errorMessage);
  } finally {
    setLoading(false);
  }
};

export const ViewTrainingRequistion = async (
  recordId: any,
  setLoading: { (value: SetStateAction<boolean>): void; (arg0: boolean): void },
  setSingleData: { (value: any): void; (arg0: {}): void },
  cb: any
) => {
  try {
    setLoading(true);

    const res = await axios.get(
      `/TrainingRequisition/Training/TrainingRequisition/${recordId}`
    );
    if (res?.data) {
      cb && cb(res?.data);
      setLoading(false);
      setSingleData(res?.data);
    }
    setLoading(false);
  } catch (error: any) {
    toast.warn(error?.response?.data?.Message || "Something went wrong");
    setSingleData({});
    setLoading(false);
  }
};

export const onUpdateTrainingRequisition = async (
  form: FormInstance<any>,
  profileData: { orgId: any; buId: any; wgId: any; wId: any; employeeId: any },
  setLoading: { (value: SetStateAction<boolean>): void; (arg0: boolean): void },
  cb: any
  // setOpenTrainingTitleModal: (arg0: boolean) => void
) => {
  setLoading(true);
  try {
    const values = form.getFieldsValue(true);

    const payload = {
      trainingTypeId: values?.trainingType?.value || "",
      employmentTypeId: values?.employee?.value || "",
      reasonForRequisition: values?.reasonForRequisition || "",
      objectivesToAchieve: values?.objectivesToAchieve || "",
      remarks: values?.remarks || "",
      statusId: values?.requisitionStatus?.value || "",
      isActive: true,
      upcommingTrainingId: values?.upcommingTraining?.value || 1, // need to check
      comments: values?.comments || "",
    };
    const res = await axios.put(
      `/TrainingRequisition/Training/TrainingRequisition/${values?.reqId}`,
      payload
    );
    form.resetFields();
    toast.success("Updated Successfully", { toastId: 1222 });
    cb && cb();
    // setOpenTrainingTitleModal && setOpenTrainingTitleModal(false);
    setLoading(false);
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.Message || "Something went wrong";
    toast.warn(errorMessage);
  } finally {
    setLoading(false);
  }
};

export const formatDate = (date: string) => {
  return moment(date).format("YYYY-MM-DD");
};

export function getAdjustedDates() {
  const today = new Date();

  // Set fromDate to one month back
  const fromDate = new Date(today);
  fromDate.setMonth(today.getMonth() - 1);

  // Set toDate to one month forward
  const toDate = new Date(today);
  toDate.setMonth(today.getMonth() + 1);

  // Format dates to YYYY-MM-DD
  const formatDate = (date: any) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return {
    fromDate: formatDate(fromDate),
    toDate: formatDate(toDate),
  };
}

export const setCustomFieldsValue = (
  form: FormInstance<any>,
  field: any,
  value: any
) => {
  const lastValue = value[value.length - 1];
  if (lastValue === "") {
    // If the last value is 0, set the field to only 0
    form.setFieldsValue({
      [field]: [""],
      [`${field}Id`]: [""],
    });
    return;
  } else if (value.includes("")) {
    // If 0 is present but it's not the last value, remove it
    const filteredValues = value.filter((v: any) => v !== "");
    form.setFieldsValue({
      [field]: filteredValues,
      [`${field}Id`]: filteredValues,
    });
    return;
  }

  if (lastValue === 0) {
    // If the last value is 0, set the field to only 0
    form.setFieldsValue({
      [field]: [0],
      [`${field}Id`]: [0],
    });
  } else if (value.includes(0)) {
    // If 0 is present but it's not the last value, remove it
    const filteredValues = value.filter((v: any) => v !== 0);
    form.setFieldsValue({
      [field]: filteredValues,
      [`${field}Id`]: filteredValues,
    });
  } else {
    // Otherwise, set the field to the given value
    form.setFieldsValue({
      [field]: value,
      [`${field}Id`]: value,
    });
  }
};

/**
 * Fetch workforce planning data by type.
 * @param params { yearType, fromDate, workplaceId, planningTypeId }
 * @returns Promise<{statusCode: number, data: any[]>}
 */
export const fetchWorkforceTypeWiseData = async ({
  yearType,
  fromDate,
  toDate = "",
  workplaceId,
  planningTypeId,
}: {
  yearType: number;
  fromDate: string | number;
  toDate?: string | number; 
  workplaceId: number | string;
  planningTypeId: number;
}) => {
  const res = await axios.get(
    `/WorkforcePlanning/TypeWiseData`,
    {
      params: {
        YearType: yearType,
        FromDate: fromDate,
        ToDate: toDate,
        WorkplaceId: workplaceId,
        PlanningTypeId: planningTypeId,
      },
    }
  );
  return res.data;
};
