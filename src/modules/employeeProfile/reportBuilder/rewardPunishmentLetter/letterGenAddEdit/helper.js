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

    console.log(form.getFieldsValue(true));

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
  attachmentList
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
      issueAttachment: attachmentList[0]?.response[0]?.globalFileUrlId || "",
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

export const editRewardPunishmentRecord = async (
  form,
  profileData,
  setLoading,
  letterData,
  cb
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
    const res = await axios.put(
      `/RewardPunishment/EditRewardPunishmentRecord`,
      payload
    );
    setLoading(false);
    cb && cb();
    toast.success(res?.data?.message, { toastId: "Edit" });
  } catch (error) {
    setLoading(false);
    toast.warn(error?.response?.data?.message, { toastId: "Edit" });
  }
};

export const ViewRewardPunishmentRecord = async (
  recordId,
  setLoading,
  setSingleData
) => {
  try {
    setLoading(true);

    const res = await axios.get(
      `/RewardPunishment/ViewRewardPunishmentRecord?recordId=${recordId}`
    );
    if (res?.data) {
      setLoading(false);
      setSingleData(res?.data);
    }
    setLoading(false);
  } catch (error) {
    setSingleData({});
    setLoading(false);
  }
};

export let dymmyLanding = {
  currentPage: 1,
  totalCount: 3,
  pageSize: 100,
  data: [
    {
      sl: 1,
      recordId: 101,
      accountId: 5001,
      branchId: 3001,
      workplaceId: 2001,
      workplaceGroupId: 1001,
      issueTypeId: 1,
      issueTypeName: "Disciplinary Action",
      issueForEmployeeId: 10001,
      issueForEmployeeName: "John Doe",
      letterTypeId: 1,
      letterType: "Warning",
      letterNameId: 10,
      letterName: "Late Attendance",
      letterBody:
        "This letter serves as a formal warning for repeated late attendance.",
      issueByEmployeeId: 10002,
      issueByEmployeeName: "Jane Smith",
      issueDate: "2024-11-06T09:00:00.000",
      issueAttachment: "attachment1.pdf",
      isPrinted: true,
      isMailSend: true,
      actionId: 1,
      actionName: "Acknowledged",
      actionRemarks: "Employee acknowledged receipt of the warning.",
      isExplanation: true,
      explanation: "I was delayed due to traffic.",
      explanationAttachment: "explanation1.pdf",
      actionBy: 10002,
      createdAt: "2024-11-06T09:00:00.000",
      serverDateTime: "2024-11-06T09:05:00.000",
      lastActionDateTime: "2024-11-06T10:00:00.000",
      isActive: true,
    },
    {
      sl: 2,
      recordId: 102,
      accountId: 5002,
      branchId: 3002,
      workplaceId: 2002,
      workplaceGroupId: 1002,
      issueTypeId: 2,
      issueTypeName: "Reward",
      issueForEmployeeId: 10003,
      issueForEmployeeName: "Alice Johnson",
      letterTypeId: 2,
      letterType: "Appreciation",
      letterNameId: 20,
      letterName: "Excellent Performance",
      letterBody:
        "Congratulations on your outstanding performance this quarter.",
      issueByEmployeeId: 10004,
      issueByEmployeeName: "Bob Brown",
      issueDate: "2024-11-05T08:00:00.000",
      issueAttachment: "attachment2.pdf",
      isPrinted: true,
      isMailSend: true,
      actionId: 2,
      actionName: "Accepted",
      actionRemarks: "Employee accepted the letter of appreciation.",
      isExplanation: false,
      explanation: null,
      explanationAttachment: null,
      actionBy: 10004,
      createdAt: "2024-11-05T08:00:00.000",
      serverDateTime: "2024-11-05T08:05:00.000",
      lastActionDateTime: "2024-11-05T09:00:00.000",
      isActive: true,
    },
    {
      sl: 3,
      recordId: 103,
      accountId: 5003,
      branchId: 3003,
      workplaceId: 2003,
      workplaceGroupId: 1003,
      issueTypeId: 1,
      issueTypeName: "Disciplinary Action",
      issueForEmployeeId: 10005,
      issueForEmployeeName: "Michael Lee",
      letterTypeId: 1,
      letterType: "Suspension",
      letterNameId: 30,
      letterName: "Unauthorized Absence",
      letterBody: "You are suspended due to unauthorized absence.",
      issueByEmployeeId: 10006,
      issueByEmployeeName: "Sarah White",
      issueDate: "2024-11-04T07:00:00.000",
      issueAttachment: "attachment3.pdf",
      isPrinted: false,
      isMailSend: false,
      actionId: 3,
      actionName: "Pending",
      actionRemarks: "Awaiting employee's response.",
      isExplanation: true,
      explanation: "I was unwell and couldn't inform.",
      explanationAttachment: "explanation2.pdf",
      actionBy: 10006,
      createdAt: "2024-11-04T07:00:00.000",
      serverDateTime: "2024-11-04T07:05:00.000",
      lastActionDateTime: "2024-11-04T10:00:00.000",
      isActive: false,
    },
  ],
};
