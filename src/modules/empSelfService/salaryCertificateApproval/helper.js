import axios from "axios";
import { toast } from "react-toastify";

export const getAllSalaryCertificateListDataForApproval = async (
  payload,
  setter,
  setAllData,
  setLoading,
  cb
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/ApprovalPipeline/SalaryCertificateRequestLandingEngine`,
      payload
    );
    if (res?.data) {
      setAllData && setAllData(res?.data);
      setter(res?.data);
    }
    cb && cb();
    setLoading && setLoading(false);
  } catch (error) {
    setter([]);
    setLoading && setLoading(false);
  }
};

export const salaryCertificateApproveReject = async (payload, cb) => {
  try {
    const res = await axios.post(
      `/ApprovalPipeline/SalaryCertificateRequestApprovalEngine`,
      payload
    );
    cb && cb();
    toast.success(res?.data || "Submitted Successfully");
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
  }
};