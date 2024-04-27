import axios from "axios";
import { toast } from "react-toastify";

// search
export const filterData = (keywords, allData, setRowDto) => {
  try {
    const regex = new RegExp(keywords?.toLowerCase());
    let newDta = allData?.filter((item) =>
      regex.test(item?.strPayrollGroup?.toLowerCase())
    );
    setRowDto(newDta);
  } catch (error) {
    setRowDto([]);
  }
};

export const getBonusGenerateRequestReport = async (
  payload,
  setter,
  setAllData,
  setLoading,
  cb
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/ApprovalPipeline/BonusGenerateHeaderLandingEngine`,
      payload
    );
    if (res?.data?.listData) {
      setAllData && setAllData(res?.data?.listData);
      setter(res?.data?.listData);
      setLoading && setLoading(false);
      cb && cb();
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const bonusApproveRejectRequest = async (payload, cb) => {
  try {
    const res = await axios.post(
      `/ApprovalPipeline/BonusGenerateHeaderApprovalEngine`,
      payload
    );
    toast.success(res?.data?.message || "Successfully submitted");
    cb && cb();
  } catch (error) {
    toast.error(error?.response?.data?.message || "Something went wrong");
  }
};
