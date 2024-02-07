import axios from "axios";
import { toast } from "react-toastify";

export const updateEmployeeProfile = async (payload, setLoading, cb, toastMessage = "") => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/Employee/UpdateEmployeeProfile`, payload);
    cb && cb();
    console.log("payload", payload)
    toast.success(toastMessage || res.data?.message || "Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.Message || "Something went wrong");
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
