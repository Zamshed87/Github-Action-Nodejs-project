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
      }&letterName=${letterName?.value}&issuedEmployeeId=${
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

export const createNEditLetterGenerate = async (
  form,
  profileData,
  setLoading,
  letterData
) => {
  try {
    const { orgId, buId, wgId, wId, employeeId } = profileData;
    const values = form.getFieldsValue(true);

    const payload = {
      templateId: letterData?.letterGenerateId || 0,
      letterTypeId: values?.letterType?.value,
      letterName: values?.letterName?.value,
      generatedLetterBody: values?.letter,
      issuedEmployeeId: values?.employee?.value || "",
      accountId: letterData?.accountId || orgId,
      businessUnitId: letterData?.businessUnitId || buId,
      workplaceGroupId: letterData?.workplaceGroupId || wgId,
      workplaceId: letterData?.workplaceId || wId,
      createdBy: letterData?.createdBy || employeeId,
      createdAt: todayDate(),
    };
    setLoading(true);
    const res = await axios.post(`/LetterBuilder/LetterGenerate`, payload);
    setLoading(false);
    form.resetFields();
    toast.success(res?.data?.message, { toastId: 1 });
  } catch (error) {
    setLoading(false);
    toast.warn(error?.response?.data?.message, { toastId: 1 });
  }
};
