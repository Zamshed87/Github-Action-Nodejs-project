import axios from "axios";
import { toast } from "react-toastify";

export const getFirstLabelMenuListAction = async (empId, setter) => {
  try {
    const res = await axios.get(
      `/Auth/GetFirstLevelMenuList?employeeId=${empId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getFeatureListAction = async (id, empId, setter) => {
  try {
    const res = await axios.get(
      `/Auth/GetMenuFeatureList?firstLevelMenuId=${id}&employeeId=${empId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getAlreadyAddedFeature = async (buId, wgId, id, type, setter) => {
  try {
    const res = await axios.get(
      `/Auth/GetMenuUserPermission?businessUnitId=${buId}&workplaceGroupId=${wgId}&EmployeeId=${id}&isFor=${type}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

// save feature assign to user
export const saveUserRoleManager = async (
  buId,
  wgId,
  userId,
  employeeId,
  strDisplayName,
  rowDto,
  setLoading,
  cb
) => {
  try {
    if (rowDto.length < 1) return toast.warn("Please add atleast one data");
    setLoading(true);
    const payload = {
      intCreatedBy: userId,
      IntBusinessunitId: buId,
      IntWorkplaceGroupId: wgId,
      userInfo: {
        intEmployeeId: employeeId,
        strEmployeeName: strDisplayName,
      },
      menuList: rowDto,
    };
    const res = await axios.post(`/Auth/MenuPermissionAssignToUser`, payload);
    setLoading(false);
    toast.success(res?.data?.message || "Successful");
    cb();
  } catch (error) {
    setLoading(false);
    toast.warn(error?.response?.data?.message || "Failed, try again");
  }
};

// save feature assign to role
export const saveFeatureAssignToRole = async (
  buId,
  wgId,
  userId,
  employeeId,
  strDisplayName,
  rowDto,
  setLoading,
  cb
) => {
  try {
    if (rowDto.length < 1) return toast.warn("Please add atleast one data");
    setLoading(true);
    const payload = {
      intCreatedBy: userId,
      IntBusinessunitId: buId,
      IntWorkplaceGroupId: wgId,
      userInfo: {
        intEmployeeId: employeeId,
        strEmployeeName: strDisplayName,
      },
      menuList: rowDto,
    };
    const res = await axios.post(`/Auth/MenuPermissionAssignToRole`, payload);
    setLoading(false);
    toast.success(res?.data?.message || "Successful");
    cb();
  } catch (error) {
    setLoading(false);
    toast.warn(error?.response?.data?.message || "Failed, try again");
  }
};

//User Group & Feature
export const getUserGroupNameListAction = async (buId, setter) => {
  try {
    const res = await axios.get(
      `/emp/MenuAndFeature/GetRoleGroupList?BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const saveUserGroupAndFeature = async (
  employeeId,
  groupId,
  rowDto,
  setLoading,
  cb
) => {
  try {
    if (rowDto.length < 1) return toast.warn("Please add atleast one data");
    setLoading(true);
    const payload = {
      intCreatedBy: employeeId,
      userGroupId: groupId,
      menuList: rowDto,
    };
    const res = await axios.post(
      `/Auth/CreateMenuUserPermissionForUserGroupFeature`,
      payload
    );
    setLoading(false);
    toast.success(res?.data?.message || "Successful");
    cb();
  } catch (error) {
    setLoading(false);
    toast.warn(error?.response?.data?.message || "Failed, try again");
  }
};
