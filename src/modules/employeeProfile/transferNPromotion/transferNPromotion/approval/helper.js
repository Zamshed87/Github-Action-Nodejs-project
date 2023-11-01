import axios from "axios";
import { toast } from "react-toastify";

export const getAllTransferAndPromotionListDataForApproval = async (
  payload,
  setter,
  setFilterData,
  setLoading,
  cb
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/ApprovalPipeline/TransferNPromotionLandingEngine`,
      payload
    );
    if (res?.data) {
      setter(res?.data);
      setFilterData(res?.data);
    }
    cb && cb();
    setLoading && setLoading(false);
  } catch (error) {
    setter([]);
    setFilterData([]);
    setLoading && setLoading(false);
  }
};

export const transferNPromotionApproveReject = async (payload, cb) => {
  try {
    const res = await axios.post(
      `/ApprovalPipeline/TransferNPromotionApprovalEngine`,
      payload
    );
    cb && cb();
    toast.success(res?.data || "Submitted Successfully");
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
  }
};


