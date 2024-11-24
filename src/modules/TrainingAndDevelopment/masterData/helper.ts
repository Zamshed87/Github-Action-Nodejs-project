import { FormInstance } from "antd";
import axios from "axios";
import { SetStateAction } from "react";
import { toast } from "react-toastify";
import { todayDate } from "utility/todayDate";

export const createTrainingType = async (
  form: FormInstance<any>,
  profileData: { orgId: any; buId: any; wgId: any; wId: any; employeeId: any },
  setLoading: { (value: SetStateAction<boolean>): void; (arg0: boolean): void },
  setOpenTraingTypeModal: (arg0: boolean) => void
) => {
  setLoading(true);
  try {
    const { orgId, buId, wgId, wId, employeeId } = profileData;
    const values = form.getFieldsValue(true);

    const payload = {
      strName: values?.trainingType,
      strRemarks: values?.remarks,
      intAccountId: orgId,
      dteCreatedAt: todayDate(),
      intCreatedBy: employeeId,
      dteUpdatedAt: "",
      intUpdatedBy: "",
      isActive: true,
    };
    const res = await axios.post(
      `/TrainingAndDevelopment/SaveTrainingType`,
      payload
    );
    form.resetFields();
    toast.success("Created Successfully", { toastId: 1222 });
    setOpenTraingTypeModal && setOpenTraingTypeModal(false);
    setLoading(false);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      toast.warn(error.response.data.message, { toastId: 1222 });
    } else {
      toast.warn("An unexpected error occurred", { toastId: 1222 });
    }
  } finally {
    setLoading(false);
  }
};

export const updateTrainingType = async (
  form: FormInstance<any>,
  profileData: { orgId: any; buId: any; wgId: any; wId: any; employeeId: any },
  setLoading: { (value: SetStateAction<boolean>): void; (arg0: boolean): void },
  data: any,
  isActive: boolean
) => {
  setLoading(true);
  try {
    const { orgId, buId, wgId, wId, employeeId } = profileData;
    const values = form.getFieldsValue(true);

    const payload = {
      intId: values?.id,
      strName: values?.trainingType,
      strRemarks: values?.remarks,
      intAccountId: orgId,
      dteCreatedAt: todayDate(),
      intCreatedBy: employeeId,
      dteUpdatedAt: "",
      intUpdatedBy: "",
      isActive: isActive ? !isActive : data?.isActive,
    };
    const res = await axios.post(
      `/TrainingAndDevelopment/SaveTrainingType`,
      payload
    );
    form.resetFields();
    toast.success("Updated Successfully", { toastId: 1222 });
    setLoading(false);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      toast.warn(error.response.data.message, { toastId: 1222 });
    } else {
      toast.warn("An unexpected error occurred", { toastId: 1222 });
    }
  } finally {
    setLoading(false);
  }
};

export const dataDemo: any[] = [
  {
    key: 1,
    strName: "Technical Training",
    strRemarks: "Basic programming skills development",
    intCreatedBy: "John Doe",
    createdDate: "2024-11-20T10:15:00.000Z",
    status: true,
    isActive: true,
  },
  {
    key: 2,
    strName: "Leadership Workshop",
    strRemarks: "Developing managerial skills",
    intCreatedBy: "Jane Smith",
    createdDate: "2024-11-18T14:30:00.000Z",
    status: false,
    isActive: false,
  },
  {
    key: 3,
    strName: "Compliance Training",
    strRemarks: "Mandatory compliance regulations",
    intCreatedBy: "Michael Johnson",
    createdDate: "2024-11-22T09:00:00.000Z",
    status: true,
    isActive: true,
  },
];
