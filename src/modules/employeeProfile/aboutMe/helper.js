import axios from "axios";
import { toast } from "react-toastify";

export const empProfilePicUpload = async (
  accountId,
  empId,
  tableReferrence,
  documentTypeId,
  buId,
  userId,
  setLoading,
  attachment,
  cb
) => {
  setLoading(true);
  let formData = new FormData();
  formData.append("files", attachment[0]);

  try {
    let { data } = await axios.post(
      `/Document/UploadProfilePicture?accountId=${accountId}&employeeId=${empId}&tableReferrence=${tableReferrence}&documentTypeId=${documentTypeId}&businessUnitId=${buId}&createdBy=${userId}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    cb(data);
    setLoading(false);
    toast.success("Successfully Updated Image", { toastId: "UPP" });
  } catch (error) {
    setLoading(false);
    toast.error("File Size is too large or inValid File!", { toastId: "UPP" });
  }
};

export const bankDetailsAction = async (
  payload,
  setLoading,
  getEmpData,
  setConfirmationMOdal
) => {
  try {
    setLoading(true);
    const res = await axios.post("/Employee/CRUDEmployeeBankDetails", payload);
    setLoading(false);
    setConfirmationMOdal(false);
    getEmpData && getEmpData();
    toast.success(res?.data?.message || "Saved Successful");
  } catch (error) {
    setLoading(false);
    toast.warn(error?.response?.data?.message || "Failed, try again");
  }
};

export const getBankBranchDDL = async (bankId, orgId, districtId, setter) => {
  try {
    const res = await axios.get(
      `/Employee/BankBranchDDL?BankId=${bankId}&AccountID=${orgId}&DistrictId=${districtId}`
    );
    if (res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const createBankBranch = async (payload, cb) => {
  try {
    const res = await axios.post(`/Employee/CreateBankBranch`, payload);
    cb && cb();
    toast.success(res.data?.message || "Successfully");
  } catch (error) {
    toast.warn(error?.response?.data?.Message || "Something went wrong");
  }
};
