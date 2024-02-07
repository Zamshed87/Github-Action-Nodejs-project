import axios from "axios";
import { toast } from "react-toastify";

export const getEmployeeDocumentManagement = async (
  accId = 1,
  id =1,
  setter,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(`/Employee/GetAllEmployeeDocumentManagement?accountId=${accId}&employeeId=${id}`);
    if (res?.data) {
      setter && setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const saveEmployeeDocument = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/Employee/SaveEmployeeDocumentManagement`,
      payload
    );
    cb && cb();
    toast.success(res.data?.message || "Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.Message || "Something went wrong");
    setLoading && setLoading(false);
  }
};

export const deleteEmployeeDocumentManagement = async (id, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.put(
      `/Employee/DeleteEmpDocumentManagement?id=${id}`
    );
    if (res?.data) {
      setLoading && setLoading(false);
      cb && cb();
      toast.success( "Document Delete Successfully!!!" || res.data?.message);
    }
  } catch (error) {
    setLoading && setLoading(false);
    toast.warn(error?.response?.data?.Message || "Something went wrong");
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
  const formData = new FormData();
  formData.append("files", attachment[0]);
  try {
    const { data } = await axios.post(
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
