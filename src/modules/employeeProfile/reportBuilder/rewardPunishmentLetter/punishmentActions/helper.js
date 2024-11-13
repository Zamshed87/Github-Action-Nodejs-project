/*
 * Title: Letter Generate Funcs
 * Author: Khurshida Meem
 * Date: 24-10-2024
 *
 */

import axios from "axios";
import { toast } from "react-toastify";
import { todayDate } from "utility/todayDate";

export const CreateRewardPunishmentRecord = async (
  form,
  profileData,
  setLoading,
  letterData
) => {
  try {
    const { orgId, buId, wgId, wId, employeeId, userName } = profileData;
    const values = form.getFieldsValue(true);
    console.log(values, "values");
    console.log(profileData, "profileData");
    console.log(letterData, "letterData");
    const payload = {
      // recordId: 0, // default value as per structure
      accountId: orgId,
      branchId: buId,
      workplaceId: wId,
      workplaceGroupId: wgId,
      issueTypeId: values?.issuedType?.value || 0,
      issueTypeName: values?.issuedType?.label || "",
      issueForEmployeeId: values?.employee?.value || 0,
      issueForEmployeeName: values?.employee?.label || "",
      letterTypeId: values?.letterType?.value || 0,
      letterType: values?.letterType?.label || "",
      letterNameId: values?.letterName?.value, // need to check again
      letterName: values?.letterName?.label || "",
      letterBody: values?.letter,
      issueByEmployeeId: employeeId,
      issueByEmployeeName: userName || "",
      issueDate: todayDate(),
      issueAttachment: letterData?.issueAttachment || "",
      isPrinted: letterData?.isPrinted || true,
      isMailSend: letterData?.isMailSend || true,
      actionId: letterData?.actionId || 1, // need to check again
      actionName: userName || "",
      actionRemarks: letterData?.actionRemarks || "",
      isExplanation: letterData?.isExplanation || true,
      explanation: letterData?.explanation || "",
      explanationAttachment: letterData?.explanationAttachment || "",
      actionBy: employeeId || 0,
      createdAt: todayDate(),
      serverDateTime: new Date().toISOString(),
      lastActionDateTime:
        letterData?.lastActionDateTime || new Date().toISOString(),
      isActive: letterData?.isActive || true,
    };

    setLoading(true);
    const res = await axios.post(
      `/RewardPunishment/CreateRewardPunishmentRecord`,
      payload
    );
    setLoading(false);
    form.resetFields();
    toast.success(res?.data?.message, { toastId: 1 });
  } catch (error) {
    setLoading(false);
    toast.warn(error?.response?.data?.message, { toastId: 1 });
  }
};
