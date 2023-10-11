import axios from "axios";
import { toast } from "react-toastify";

/*
DDL Type
 * BusinessUnit > BusinessUnitById
 * * SBU
 * * * Currency
 * * * * Position
 * * * * * PositionGroup
 * * * * * * Workplace
 * * * * * * * WorkplaceGroup
 * * * * * * * * DocumentType
 * * * * * * * * * Country
 * * * * * * * * * * EmpDepartment
 * * * * * * * * * * * EmpDesignation
 * * * * * * * * * * * * EmployeeBasic > EmployeeBasicById
 * * * * * * * * * * * * * BloodGroupName
 * * * * * * * * * * * * * * LoanType
 * * * * * * * * * * * * * * * LeaveType
 * * * * * * * * * * * * * * * * EmploymentType
 */

export const getAllGlobalDocumentType = async (
  setter,
  setAllData,
  setLoading
) => {
  setLoading && setLoading(true);

  // let status = statusId ? `&intStatusId=${statusId}` : "";
  try {
    const res = await axios.get(`/SaasMasterData/GetAllGlobalDocumentType`);
    if (res?.data) {
      const modified = res?.data?.map((item) => ({
        ...item,
        statusValue: item?.isActive ? "Active" : "Inactive",
      }));
      modified?.length > 0 && setter && setter(modified);
      setAllData && setAllData(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const getAllGlobalEmploymentType = async (
  setter,
  setAllData,
  setLoading,
  orgId
) => {
  setLoading && setLoading(true);

  // let status = statusId ? `&intStatusId=${statusId}` : "";
  try {
    const res = await axios.get(
      `/SaasMasterData/GetAllEmploymentType?accountId=${orgId}`
    );
    if (res?.data) {
      const modified = res?.data?.map((item) => ({
        ...item,
        statusValue: item?.isActive ? "Active" : "Inactive",
      }));

      setter(modified);
      setAllData && setAllData(modified);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const getAllGlobalLoanType = async (setter, setAllData, setLoading) => {
  setLoading && setLoading(true);

  // let status = statusId ? `&intStatusId=${statusId}` : "";
  try {
    const res = await axios.get(`/SaasMasterData/GetAllEmpLoanType`);
    if (res?.data) {
      const modified = res?.data?.map((item) => ({
        ...item,
        statusValue: item?.isActive ? "Active" : "Inactive",
      }));
      modified?.length > 0 && setter && setter(modified);
      setAllData && setAllData(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const getAllGlobalUserRole = async (
  setter,
  setAllData,
  setLoading,
  orgId
) => {
  setLoading && setLoading(true);

  // let status = statusId ? `&intStatusId=${statusId}` : "";
  try {
    const res = await axios.get(`/SaasMasterData/GetAllUserRole`);
    if (res?.data) {
      // setter && setter(res?.data);
      const newList = res?.data?.map((item) => ({
        ...item,
        isActiveStatus: item?.isActive ? "Active" : "Inactive",
      }));
      setAllData && setAllData(newList);
      setter && setter(newList);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};
export const getAllGlobalLeaveType = async (
  setter,
  setAllData,
  setLoading,
  orgId
) => {
  setLoading && setLoading(true);

  // let status = statusId ? `&intStatusId=${statusId}` : "";
  try {
    const res = await axios.get(`/SaasMasterData/GetAllLveLeaveType`);

    if (res?.data) {
      const modified = res?.data?.map((item) => ({
        ...item,
        statusValue: item?.isActive ? "Active" : "Inactive",
      }));
      modified?.length > 0 && setter && setter(modified);
      modified?.length > 0 && setAllData && setAllData(modified);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const getPeopleDeskAllDDL = async (apiUrl, value, label, setter, cb) => {
  try {
    const res = await axios.get(apiUrl);
    const newDDL = res?.data?.map((itm) => ({
      ...itm,
      value: itm[value],
      label: itm[label],
    }));
    setter(newDDL);
    cb && cb();
  } catch (error) {}
};

export const getPeopleDeskAllDDLWithoutAllItem = async (
  apiUrl,
  value,
  label,
  setter
) => {
  try {
    const res = await axios.get(apiUrl);
    const newDDL = res?.data
      ?.filter((itm) => itm?.intBusinessUnitId !== 0)
      ?.map((itm) => ({
        ...itm,
        value: itm[value],
        label: itm[label],
      }));
    setter(newDDL);
  } catch (error) {}
};

export const getPeopleDeskAllLanding = async (
  tableName,
  accId,
  busId,
  id,
  setter,
  setAllData,
  setLoading,
  statusId,
  year,
  wgId
) => {
  setLoading && setLoading(true);

  let status = statusId ? `&intStatusId=${statusId}` : "";
  let yearFilter = year ? `&YearId=${year}` : "";
  try {
    const res = await axios.get(
      `/Employee/PeopleDeskAllLanding?TableName=${tableName}&BusinessUnitId=${busId}${yearFilter}${status}&WorkplaceGroupId=${wgId}&intId=${id}`
    );
    if (res?.data) {
      setter && setter(res?.data);
      setAllData && setAllData(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const getFilterDDLNewAction = async (
  buId,
  workplaceGroupId,
  deptId,
  desigId,
  supervisorId,
  empType,
  setter
) => {
  try {
    const res = await axios.get(
      `/Employee/CombineDataSetByWorkplaceGDeptDesigSupEmpType?BusinessUnitId=${buId}&WorkplaceGroupId=${workplaceGroupId}&DeptId=${deptId}&DesigId=${desigId}&SupervisorId=${supervisorId}&EmpType=${empType}`
    );
    const departmentList = res?.data?.departmentList?.map((item) => ({
      ...item,
      value: item?.id,
      label: item?.name,
    }));
    const designationList = res?.data?.designationList?.map((item) => ({
      ...item,
      value: item?.id,
      label: item?.name,
    }));
    const employeeList = res?.data?.employeeList?.map((item) => ({
      ...item,
      value: item?.id,
      label: item?.name,
    }));
    const employmentTypeList = res?.data?.employmentTypeList?.map((item) => ({
      ...item,
      value: item?.id,
      label: item?.name,
    }));
    const supervisorList = res?.data?.supervisorList?.map((item) => ({
      ...item,
      value: item?.id,
      label: item?.name,
    }));
    const workplaceGroupList = res?.data?.workplaceGroupList?.map((item) => ({
      ...item,
      value: item?.id,
      label: item?.name,
    }));
    setter({
      departmentList,
      designationList,
      employeeList,
      employmentTypeList,
      supervisorList,
      workplaceGroupList,
    });
  } catch (error) {
    setter([]);
  }
};

// don't use this, use new function above
export const getFilterDDL = async (
  buId,
  workplaceGroupId,
  deptId,
  desigId,
  supervisorId,
  empType,
  setter
) => {
  try {
    const res = await axios.get(
      `/Employee/CombineDataSetByWorkplaceGDeptDesigSupEmpType?BusinessUnitId=${buId}&WorkplaceGroupId=${workplaceGroupId}&DeptId=${deptId}&DesigId=${desigId}&SupervisorId=${supervisorId}&EmpType=${empType}`
    );
    if (res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};

export const makeAddress = (addressArray) => {
  let result = "";
  for (let i = 0; i < addressArray.length; i++) {
    if (addressArray[i]) {
      result = result + addressArray[i] + ", ";
    }
  }

  return result.slice(0, result.length - 2);
};

export const attachment_action = async (
  accountId,
  tableReferrence,
  documentTypeId,
  buId,
  userId,
  attachment,
  setLoading
) => {
  setLoading && setLoading(true);
  let formData = new FormData();
  formData.append("files", attachment[0]);
  try {
    let { data } = await axios.post(
      `/Document/UploadFile?accountId=${accountId}&tableReferrence=${tableReferrence}&documentTypeId=${documentTypeId}&businessUnitId=${buId}&createdBy=${userId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    setLoading && setLoading(false);
    toast.success("Upload  successfully");
    return data;
  } catch (error) {
    setLoading && setLoading(false);
    toast.error("File Size is too large or inValid File!");
  }
};

export const PeopleDeskSaasDDL = async (
  ddlType,
  wgId = 0,
  busId,
  setter,
  value,
  label,
  id
) => {
  try {
    const res = await axios.get(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=${ddlType}&WorkplaceGroupId=${wgId}&BusinessUnitId=${busId}&intId=${
        id || 0
      }`
    );
    if (res?.data) {
      const newDDL = res?.data?.map((itm) => {
        return {
          ...itm,
          value: itm[value],
          label: itm[label],
        };
      });
      setter(newDDL);
    }
  } catch (error) {}
};

export const getCombineAllDDL = async (
  accId,
  buId,
  workplaceGroupId,
  workplaceId,
  deptId,
  desigId,
  empType,
  setter
) => {
  try {
    const res = await axios.get(
      `/QueryData/CombineDataSetByWorkplaceGDeptDesigSupEmpTypeByAccountId?AccountId=${accId}&BusinessUnitId=${buId}&WorkplaceGroupId=${workplaceGroupId}&WorkplaceId=${workplaceId}&DeptId=${deptId}&DesigId=${desigId}&EmpType=${empType}`
    );
    if (res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};

export const getCombineAllWithSupDDL = async (
  buId,
  workplaceGroupId,
  workplaceId,
  deptId,
  desigId,
  empType,
  supervisorId,
  setter
) => {
  try {
    const res = await axios.get(
      `/Employee/CombineDataSetByWorkplaceGDeptDesigSupEmpType?BusinessUnitId=${buId}&WorkplaceGroupId=${workplaceGroupId}&DeptId=${deptId}&DesigId=${desigId}&SupervisorId=${supervisorId}&EmpType=${empType}&WorkplaceId=${workplaceId}`
    );
    if (res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};

export const PeopleDeskSaasDDLWithFilter = async (
  ddlType,
  wgId = 0,
  busId,
  setter,
  value,
  label,
  id,
  isFilter,
  filterProperty,
  filterValue
) => {
  try {
    const res = await axios.get(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=${ddlType}&WorkplaceGroupId=${wgId}&BusinessUnitId=${busId}&intId=${
        id || 0
      }`
    );
    if (res?.data) {
      let newDDL = res?.data?.map((itm) => {
        return {
          ...itm,
          value: itm[value],
          label: itm[label],
        };
      });
      if (isFilter) {
        newDDL = newDDL.filter((itm) => itm[filterProperty] !== filterValue);
      }
      setter(newDDL);
    }
  } catch (error) {}
};

// Multiple attachment action
export const multiple_attachment_actions = async (
  accountId,
  tableReferrence,
  documentTypeId,
  buId,
  userId,
  attachment,
  setLoading
) => {
  setLoading && setLoading(true);
  let formData = new FormData();
  if (attachment?.[0]) {
    for (let i = 0; i < attachment.length; i++) {
      formData.append("files", attachment[i]);
    }
  }
  try {
    let { data } = await axios.post(
      `/Document/UploadFile?accountId=${accountId}&tableReferrence=${tableReferrence}&documentTypeId=${documentTypeId}&businessUnitId=${buId}&createdBy=${userId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    setLoading && setLoading(false);
    toast.success("Upload  successfully");
    return data;
  } catch (error) {
    setLoading && setLoading(false);
    toast.error("File Size is too large or inValid File!");
  }
};

export const attachment_delete_action = async (id, cb) => {
  try {
    const res = await axios.get(`/Document/DeleteUploadedFile?id=${id}`);
    cb && cb();
    toast.success(res.data?.message || "Successfully");
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
  }
};

// Multiple attachment action
export const multiple_attachment_action = async (
  accountId,
  tableReferrence,
  documentTypeId,
  buId,
  userId,
  attachment,
  setLoading
) => {
  setLoading && setLoading(true);
  let formData = new FormData();
  if (attachment?.[0]) {
    for (let i = 0; i < attachment.length; i++) {
      formData.append("files", attachment[i]);
    }
  }
  try {
    let { data } = await axios.post(
      `/Document/UploadFile?accountId=${accountId}&tableReferrence=${tableReferrence}&documentTypeId=${documentTypeId}&businessUnitId=${buId}&createdBy=${userId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    setLoading && setLoading(false);
    toast.success("Upload  successfully");
    return data;
  } catch (error) {
    setLoading && setLoading(false);
    toast.error("File Size is too large or inValid File!");
  }
};

export const getPeopleDeskWithoutAllDDL = async (
  apiUrl,
  value,
  label,
  setter
) => {
  try {
    const res = await axios.get(apiUrl);
    const newDDL = res?.data
      ?.filter((itm) => itm[value] !== 0)
      ?.map((itm) => ({
        ...itm,
        value: itm[value],
        label: itm[label],
      }));
    setter(newDDL);
  } catch (error) {}
};

export const getSearchEmployeeList = (buId, wgId, v) => {
  if (v?.length < 2) return [];
  return axios
    .get(
      `/Employee/CommonEmployeeDDL?businessUnitId=${buId}&workplaceGroupId=${wgId}&searchText=${v}`
      // `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmployeeBasicInfoForEmpMgmt&AccountId=${intAccountId}&BusinessUnitId=${buId}&intId=${employeeId}&workplaceGroupId=${wgId}&SearchTxt=${v}`
    )
    .then((res) => {
      const modifiedData = res?.data?.map((item) => {
        return {
          ...item,
          value: item?.EmployeeId,
          label: item?.EmployeeOnlyName,
        };
      });
      return modifiedData;
    })
    .catch((err) => []);
};
export const getSearchEmployeeListForEmp = (buId, wgId,intAccountId,employeeId, v) => {
  if (v?.length < 2) return [];
  return axios
    .get(
      // `/Employee/CommonEmployeeDDL?businessUnitId=${buId}&workplaceGroupId=${wgId}&searchText=${v}`
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmployeeBasicInfoForEmpMgmt&AccountId=${intAccountId}&BusinessUnitId=${buId}&intId=${employeeId}&workplaceGroupId=${wgId}&SearchTxt=${v}`
    )
    .then((res) => {
      const modifiedData = res?.data?.map((item) => {
        return {
          ...item,
          value: item?.EmployeeId,
          label: item?.EmployeeOnlyName,
        };
      });
      return modifiedData;
    })
    .catch((err) => []);
};

export const addressDataWriteFromJson = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/Employee/AddressDataWriteFromJson`, payload);
    cb && cb();
    toast.success(res.data?.message || "Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading && setLoading(false);
  }
};

export const testApi = async (setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(`/Auth/JWTData`);
    cb && cb();
    toast.success(res.data?.message || "Successfully");
    setLoading && setLoading(false);

    console.log("res", res?.data);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading && setLoading(false);
  }
};
