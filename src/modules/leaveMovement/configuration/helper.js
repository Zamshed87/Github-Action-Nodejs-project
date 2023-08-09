import axios from "axios";
import { toast } from "react-toastify";

export const leaveMovementTypeCreateEdit = async (
  partId,
  isLeave,
  typeValue,
  typeCode,
  orgId,
  date,
  empId,
  cb,
  isActive = true,
  setLoading
) => {
  try {
    const payload = {
      intLeaveTypeId: partId,
      strLeaveType: isLeave ? typeValue : "",
      strLeaveTypeCode: isLeave ? typeCode : "",
      intAccountId: orgId,
      isActive: isActive,
      dteCreatedAt: date,
      intCreatedBy: empId,
      dteUpdatedAt: date,
      intUpdatedBy: empId,
    };
    setLoading(true);
    const res = await axios.post(`/SaasMasterData/SaveLveLeaveType`, payload);
    setLoading(false);
    cb && cb();
    toast.success(res?.data?.message);
  } catch (error) {
    setLoading(false);
    toast.warning(error?.response?.data?.message);
  }
};

export const getAllLveLeaveType = async (orgId, setter) => {
  try {
    const res = await axios.get(`/SaasMasterData/GetAllLveLeaveType`);
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getDeleteLveLeaveTypeById = async (leaveTypeId, cb) => {
  try {
    const res = await axios.get(
      `/SaasMasterData/DeleteLveLeaveTypeById?id=${leaveTypeId}`
    );
    cb && cb();
    toast.success(res.data?.message || "Successfully");
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
  }
};

export const saveLveMovementType = async (
  partId,
  isLeave,
  typeValue,
  typeCode,
  hour,
  frequency,
  orgId,
  date,
  empId,
  cb,
  isActive = true,
  setLoading
) => {
  try {
    const payload = {
      intMovementTypeId: partId,
      strMovementType: isLeave ? typeValue : "",
      strMovementTypeCode: isLeave ? typeCode : "",
      intQuotaHour: isLeave ? hour : 0,
      intQuotaFrequency: isLeave ? frequency : 0,
      isActive: isActive,
      intAccountId: orgId,
      dteCreatedAt: date,
      intCreatedBy: empId,
      dteUpdatedAt: date,
      intUpdatedBy: empId,
    };
    setLoading(true);
    const res = await axios.post(
      `/SaasMasterData/SaveLveMovementType`,
      payload
    );
    setLoading(false);
    cb && cb();
    toast.success(res?.data?.message);
  } catch (error) {
    setLoading(false);
    toast.warning(error?.response?.data?.message);
  }
};

export const getAllLveMovementType = async (orgId, setter, allData) => {
  try {
    const res = await axios.get(`/SaasMasterData/GetAllLveMovementType`);
    setter(res?.data);
    allData && allData(res.data);
  } catch (error) {
    setter([]);
  }
};

export const getDeleteLveMovementTypeById = async (movementTypeId, cb) => {
  try {
    const res = await axios.get(
      `/SaasMasterData/DeleteLveMovementTypeById?id=${movementTypeId}`
    );
    cb && cb();
    toast.success(res.data?.message || "Successfully");
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
  }
};

export const yearlyLeavePolicyAction = async (
  autoId,
  empTypeId,
  days,
  yearId,
  leaveTypeId,
  genderId,
  genderName,
  businessUnitPayload,
  workplaceGroupPayload,
  workplacePayload,
  orgId,
  empId,
  cb,
  buId,
  setLoading
) => {
  try {
    const payload = {
      autoId: autoId || 0,
      employmentTypeId: empTypeId,
      allocatedLeave: days,
      yearId: yearId,
      leaveTypeId: leaveTypeId,
      accountId: orgId,
      businessUnitId: buId,
      isActive: true,
      intCreatedBy: empId,
      intGenderId: genderId,
      strGender: genderName,
      businessUnitList: businessUnitPayload,
      workPlaceGroupList: workplaceGroupPayload,
      workPlaceList: workplacePayload,
    };
    console.log("-----", payload);
    setLoading(true);
    const res = await axios.post(
      `/SaasMasterData/CRUDEmploymentTypeWiseLeaveBalance`,
      payload
    );
    setLoading(false);
    cb && cb();
    toast.success(res?.data?.message);
  } catch (error) {
    setLoading(false);
    toast.warning(error?.response?.data?.message || "Something went wrong");
  }
};
