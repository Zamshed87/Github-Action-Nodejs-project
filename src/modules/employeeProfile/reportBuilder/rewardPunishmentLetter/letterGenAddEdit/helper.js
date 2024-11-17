/*
 * Title: Letter Generate Funcs
 * Author: Khurshida Meem
 * Date: 24-10-2024
 *
 */

import axios from "axios";
import { toast } from "react-toastify";
import { todayDate } from "utility/todayDate";

export const getLetterNameDDL = async (
  profileData,
  setLoading,
  setLetterNameDDL,
  letterTypeId
) => {
  try {
    setLoading(true);
    const { orgId, buId, wgId, wId } = profileData;

    const res = await axios.get(
      `/LetterBuilder/GetLetterNameListByLetterType?accountId=${orgId}&businessUnitId=${buId}&workplaceGroupId=${wgId}&workplaceId=${wId}&letterTypeId=${letterTypeId}`
    );

    setLetterNameDDL(res?.data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
};

export const getLetterPreview = async (profileData, setLoading, form) => {
  try {
    setLoading(true);
    const { orgId, buId, wgId, wId } = profileData;
    const { letterType, letterName, employee } = form.getFieldsValue(true);

    const res = await axios.get(
      `/LetterBuilder/GetGeneratedLetterPreview?accountId=${orgId}&businessUnitId=${buId}&workplaceGroupId=${wgId}&workplaceId=${wId}&letterTypeId=${
        letterType?.value
      }&letterName=${letterName?.label}&issuedEmployeeId=${
        employee?.value || 0
      }`
    );

    form.setFieldValue("letter", res?.data?.generatedLetterBody);
    form.setFieldValue("letterId", res?.data?.templateId);
    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
};

export const CreateRewardPunishmentRecord = async (
  form,
  profileData,
  setLoading,
  letterData,
  attachmentList,
  isSaveNsent
) => {
  try {
    const { orgId, buId, wgId, wId, employeeId, userName } = profileData;
    const values = form.getFieldsValue(true);

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
      issueAttachment:
        attachmentList[0]?.response[0]?.globalFileUrlId?.toString() || "",
      isPrinted: letterData?.isPrinted || true,
      isMailSend: isSaveNsent,
      actionId: letterData?.actionId || 1, // need to check again
      actionName: userName || "",
      actionRemarks: letterData?.actionRemarks || "",
      isExplanation: false,
      explanation: letterData?.explanation || "",
      explanationAttachment: letterData?.explanationAttachment || "",
      actionBy: employeeId || 0,
      createdAt: todayDate(),
      serverDateTime: new Date().toISOString(),
      lastActionDateTime:
        letterData?.lastActionDateTime || new Date().toISOString(),
      isActive: true,
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

export const editRewardPunishmentRecord = async (
  form,
  profileData,
  setLoading,
  recordData,
  attachmentList,
  cb,
  isSaveNsent
) => {
  try {
    const { orgId, buId, wgId, wId, employeeId, userName } = profileData;
    const values = form.getFieldsValue(true);

    const payload = {
      recordId: recordData?.recordId, // default value as per structure
      accountId: orgId,
      branchId: buId,
      workplaceId: wId,
      workplaceGroupId: wgId,
      issueTypeId: isSaveNsent
        ? recordData?.issueTypeId
        : values?.issuedType?.value || 0,
      issueTypeName: isSaveNsent
        ? recordData?.issueTypeName
        : values?.issuedType?.label || "",
      issueForEmployeeId: isSaveNsent
        ? recordData?.issueForEmployeeId
        : values?.employee?.value || 0,
      issueForEmployeeName: isSaveNsent
        ? recordData?.issueForEmployeeName
        : values?.employee?.label || "",
      letterTypeId: isSaveNsent
        ? recordData?.letterTypeId
        : values?.letterType?.value || 0,
      letterType: isSaveNsent
        ? recordData?.letterType
        : values?.letterType?.label || "",
      letterNameId: isSaveNsent
        ? recordData?.letterNameId
        : values?.letterName?.value, // need to check again
      letterName: isSaveNsent
        ? recordData?.letterName
        : values?.letterName?.label || "",
      letterBody: isSaveNsent ? recordData?.letterBody : values?.letter,
      issueByEmployeeId: employeeId,
      issueByEmployeeName: userName || "",
      issueDate: todayDate(),
      issueAttachment: isSaveNsent
        ? attachmentList
        : attachmentList[0]?.response[0]?.globalFileUrlId?.toString() || "",
      isPrinted: recordData?.isPrinted || true,
      isMailSend: isSaveNsent || false,
      actionId: recordData?.actionId || 1, // need to check again
      actionName: userName || "",
      actionRemarks: recordData?.actionRemarks || "",
      isExplanation: recordData?.isExplanation || true,
      explanation: recordData?.explanation || "",
      explanationAttachment: recordData?.explanationAttachment || "",
      actionBy: employeeId || 0,
      createdAt: todayDate(),
      serverDateTime: new Date().toISOString(),
      lastActionDateTime:
        recordData?.lastActionDateTime || new Date().toISOString(),
      isActive: recordData?.isActive || true,
    };

    setLoading(true);
    const res = await axios.put(
      `/RewardPunishment/EditRewardPunishmentRecord`,
      payload
    );
    setLoading(false);
    toast.success(res?.data?.message, { toastId: "Edit" });
    cb && cb();
  } catch (error) {
    setLoading(false);
    toast.warn(error?.response?.data?.message, { toastId: "Edit" });
  }
};

export const ViewRewardPunishmentRecord = async (
  recordId,
  setLoading,
  setSingleData,
  cb
) => {
  try {
    setLoading(true);

    const res = await axios.get(
      `/RewardPunishment/ViewRewardPunishmentRecord?recordId=${recordId}`
    );
    if (res?.data) {
      cb && cb(res?.data);
      setLoading(false);
      setSingleData(res?.data);
    }
    setLoading(false);
  } catch (error) {
    setSingleData({});
    setLoading(false);
  }
};
