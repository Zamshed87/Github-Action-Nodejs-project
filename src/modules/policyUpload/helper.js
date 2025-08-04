import axios from "axios";
import { toast } from "react-toastify";
export const getMultipleWorkplace = async (setLoading, wg, cb) => {
  setLoading?.(true);

  try {
    let url = `/SaasMasterData/GetWorkplacesByMultipleWorkplaceGroup?`;

    if (wg?.length) {
      url += wg
        .map(
          (item, idx) => `${idx === 0 ? "" : "&"}workplaceGroups=${item?.value}`
        )
        .join("");
    }
    const res = await axios.get(`${url}`);
    if (res?.data) {
      cb?.(res?.data);
      setLoading?.(false);
    } else {
      toast.warn("No data received !");
      setLoading?.(false);
    }
  } catch (error) {
    setLoading?.(false);
    toast.warn(error?.response?.data?.message || "Something went wrong");
  }
};
export const getMultipleDepartment = async (setLoading, wg, cb) => {
  setLoading?.(true);

  try {
    let url = `/SaasMasterData/GetDepartmentsByMultipleWorkplacePolicy
?`;

    if (wg?.length) {
      url += wg
        .map((item, idx) => `${idx === 0 ? "" : "&"}workplaces=${item?.value}`)
        .join("");
    }
    const res = await axios.get(`${url}`);
    if (res?.data) {
      cb?.(res?.data);
      setLoading?.(false);
    } else {
      toast.warn("No data received !");
      setLoading?.(false);
    }
  } catch (error) {
    setLoading?.(false);
    toast.warn(error?.response?.data?.message || "Something went wrong");
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
    toast.error("File Size is too Large minimum of 1MB or inValid File!");
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
