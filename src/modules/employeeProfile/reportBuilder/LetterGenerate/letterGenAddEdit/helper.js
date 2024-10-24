/*
 * Title: Letter Generate Funcs
 * Author: Khurshida Meem
 * Date: 24-10-2024
 *
 */

import axios from "axios";
import { toast } from "react-toastify";

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

export const createNEditLetterGenerate = async (
  form,
  profileData,
  setLoading
) => {
  try {
    const { orgId, buId, wgId, wId, employeeId } = profileData;
    const values = form.getFieldsValue(true);

    const payload = {
      templateId: 0,
      letterTypeId: values?.letterType?.value,
      letterName: values?.letterName?.value,
      generatedLetterBody: values?.letter,
      issuedEmployeeId: values?.employee?.value,
      accountId: orgId,
      businessUnitId: buId,
      workplaceGroupId: wgId,
      workplaceId: wId,
      createdBy: employeeId,
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
