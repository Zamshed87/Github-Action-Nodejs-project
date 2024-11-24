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
    toast.success(res?.data?.message, { toastId: 1222 });
    setOpenTraingTypeModal(false);
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
