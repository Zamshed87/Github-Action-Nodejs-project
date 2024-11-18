/*
 * Title: Letter Generate Funcs
 * Author: Adel Md. Adnan
 * Date: 24-10-2024
 *
 */

import axios from "axios";
import { toast } from "react-toastify";
import { todayDate } from "utility/todayDate";

export const SaveRewardPunishmentAction = async (
  form,
  setLoading,
  recordId,
  cb
) => {
  try {
    // const { orgId, buId, wgId, wId, employeeId, userName } = profileData;
    const values = form.getFieldsValue(true);
    const payload = {
      actionId: values?.action?.value || 0,
      actionName: values?.action?.label || "",
      recordId: recordId || 0,
      actionRemarks: values?.explanation || "",
      isActive: true,
      createdAt: todayDate(),
    };

    setLoading(true);
    const res = await axios.post(
      `/RewardPunishment/SaveRewardPunishmentAction`,
      payload
    );
    setLoading(false);
    form.resetFields();
    toast.success(res?.data?.message, { toastId: 1 });
    cb && cb();
  } catch (error) {
    setLoading(false);
    toast.warn(error?.response?.data?.message, { toastId: 1 });
  }
};
