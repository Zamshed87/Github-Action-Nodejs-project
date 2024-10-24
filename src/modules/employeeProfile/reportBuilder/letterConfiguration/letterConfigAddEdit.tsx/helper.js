/*
 * Title: Letter Config Landing
 * Author: Khurshida Meem
 * Date: 23-10-2024
 *
 */

import axios from "axios";
import { toast } from "react-toastify";
import { todayDate } from "utility/todayDate";

export const createLetterType = async (
  values,
  profileData,
  setLoading,
  setLetterTypeDDL
) => {
  try {
    const { orgId, buId, wgId, wId, employeeId } = profileData;

    const payload = [
      {
        letterTypeId: 0,
        letterType: values?.newLetterName,
        accountId: orgId,
        businessUnitId: buId,
        workplaceGroupId: wgId,
        workplaceId: wId,
        createdBy: employeeId,
      },
    ];
    setLoading(true);
    const res = await axios.post(`/LetterBuilder/CreateLetterType`, payload);
    setLetterTypeDDL(res?.data?.typeList);
    setLoading(false);
    toast.success(res?.data?.message, { toastId: 1 });
  } catch (error) {
    setLoading(false);
    toast.warn(error?.response?.data?.message, { toastId: 1 });
  }
};

export const getLetterTypeDDL = async (
  profileData,
  setLoading,
  setLetterTypeDDL
) => {
  try {
    setLoading(true);
    const { orgId, buId, wgId, wId } = profileData;

    const res = await axios.get(
      `/LetterBuilder/GetLetterTypeList?accountId=${orgId}&businessUnitId=${buId}&workplaceGroupId=${wgId}&workplaceId=${wId}`
    );

    setLetterTypeDDL(res?.data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
};

export const createNEditLetterTemplate = async (
  form,
  profileData,
  setLoading,
  letterData
) => {
  try {
    const { orgId, buId, wgId, wId, employeeId } = profileData;
    const values = form.getFieldsValue(true);

    const payload = {
      templateId: letterData?.templateId || 0,
      letterTypeId: values?.letterType?.value,
      letterType: values?.letterType?.label,
      letterName: values?.letterName,
      letterBody: values?.letter,
      accountId: letterData?.accountId || orgId,
      businessUnitId: letterData?.businessUnitId || buId,
      workplaceGroupId: letterData?.workplaceGroupId || wgId,
      workplaceId: letterData?.workplaceId || wId,
      createdBy: letterData?.createdBy || employeeId,
      createdAt: letterData?.createdAt || todayDate(),
    };
    setLoading(true);
    const res = await axios.post(
      `/LetterBuilder/CreateAndEditLetterTemplate`,
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
