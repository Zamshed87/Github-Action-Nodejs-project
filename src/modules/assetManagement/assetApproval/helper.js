import axios from "axios";
import { toast } from "react-toastify";

export const getAssetListDataForApproval = async (
  payload,
  setter,
  setAllData,
  setLoading,
  cb
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/ApprovalPipeline/AssetRequisitionLandingEngine`,
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

export const AssetApproveReject = async (payload, cb) => {
  try {
    const res = await axios.post(
      `/ApprovalPipeline/AssetRequisitionApprovalEngine`,
      payload
    );
    cb && cb();
    toast.success(res?.data || "Submitted Successfully");
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
  }
};

