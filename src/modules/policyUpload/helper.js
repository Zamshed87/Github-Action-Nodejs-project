import axios from "axios";
import { toast } from "react-toastify";

// policy category DDL
export const createPolicyCategory = async (payload, cb) => {
  try {
    const res = await axios.post(`/SaasMasterData/CRUDPolicyCategory`, payload);
    cb && cb();
    toast.success(res.data?.message || "Successfully");
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
  }
};

export const getPolicyCategoryDDL = async (accId, setter) => {
  try {
    const res = await axios.get(
      `/SaasMasterData/GetPolicyCategoryDDL?AccountId=${accId}`
    );
    if (res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};

export const createPolicy = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/SaasMasterData/CreatePolicy`, payload);
    cb && cb();
    toast.success(res.data?.message || "Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading && setLoading(false);
  }
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

export const getPolicyLanding = async (
  accountId,
  buId,
  categoryId,
  setter,
  searchValue
) => {
  let serach = searchValue ? `&Search=${searchValue}` : "";
  try {
    const res = await axios.get(
      `/SaasMasterData/GetPolicyLanding?BusinessUnitId=${buId}&CategoryId=${categoryId}&accountId=${accountId}${serach}`
    );
    if (res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};

export const deletePolicy = async (policyId, cb) => {
  try {
    const res = await axios.put(
      `/SaasMasterData/DeletePolicy?PolicyId=${policyId}`
    );
    cb && cb();
    toast.success(res.data?.message || "Successfully");
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
  }
};

export const getPolicyOnEmployeeInbox = async (employeeId, setter) => {
  try {
    const res = await axios.get(`/SaasMasterData/GetPolicyOnEmployeeInbox`);
    if (res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};

export const policyAcknowledge = async (policyId, employeeId, cb) => {
  try {
    const res = await axios.get(
      `/emp/HCMService/PolicyAcknowledge?PolicyId=${policyId}&EmployeeId=${employeeId}`
    );
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

export const attachment_delete_action = async (id, cb) => {
  try {
    const res = await axios.get(`/Document/DeleteUploadedFile?id=${id}`);
    cb && cb();
    toast.success(res.data?.message || "Successfully");
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
  }
};
