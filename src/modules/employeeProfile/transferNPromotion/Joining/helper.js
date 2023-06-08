import axios from "axios";
import { toast } from "react-toastify";

/* export const getAllTransferAndPromotionLanding = async (
  orgId,
  buId,
  landingType,
  setter,
  setAllData,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Employee/GetAllEmpTransferNpromotion?accountId=${orgId}&businessUnitId=${buId}&landingType=${landingType}`
    );
    if (res?.data) {
      setter && setter(res?.data);
      setAllData && setAllData(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
}; */


export const joinTransfer = async (
  singleData,
  orgId,
  employeeId,
  setLoading,
  cb
) => {
  try {
    setLoading(true);
    let res = await axios.put(
      `/Employee/JoiningAcknowledgeEmpTransferNpromotion?accountId=${orgId}&employeeId=${singleData?.intEmployeeId}&transferNPromotionId=${singleData?.intTransferNpromotionId}&isJoined=true&actionBy=${employeeId}`
    );

    setLoading(false);
    cb && cb();
    toast.success(res?.data?.message);
  } catch (error) {
    setLoading(false);
    toast.warn(error?.response?.data?.message);
  }
};
