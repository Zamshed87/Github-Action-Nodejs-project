import axios from "axios";
import { toast } from "react-toastify";

export const createMovementApplication = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/LeaveMovement/CRUDMovementApplication`,
      payload
    );
    cb && cb();
    toast.success(res?.data?.Result?.Message || "Submitted Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading && setLoading(false);
  }
};

export const getAllMovementApplicatonListData = async (
  payload,
  setter,
  setAllData,
  setLoading,
  cb
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/LeaveMovement/MovementApplicationLanding`,
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
export const getAllMovementApplicatonListDataForApproval = async (
  payload,
  setter,
  setAllData,
  setLoading,
  cb
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/ApprovalPipeline/MovementApplicationLanding`,
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

export const movementApproveReject = async (payload, cb, setLoading) => {
  setLoading?.(true);
  try {
    const res = await axios.post(
      `/ApprovalPipeline/MovementApplicationApproval`,
      payload
    );
    if (res?.status === 200) {
      setLoading?.(false);
      cb?.();
    }
    toast.success(res?.data || "Submitted Successfully");
  } catch (error) {
    setLoading?.(false);
    toast.warn(error?.response?.data?.message || "Something went wrong");
  }
};
export const getMovementApplicationFilter = async (
  tableName,
  accId,
  buId,
  id,
  data,
  setter,
  setAllData,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/MasterData/PeopleDeskAllLanding?TableName=${tableName}&AccountId=${accId}&BusinessUnitId=${buId}&intId=${id}&FromDate=${data?.fromDate}&ToDate=${data?.toDate}&EmpId=${data?.empId}&MovementTypeId=${data?.movementTypeId}&ApplicationDate=${data?.applicationDate}&StatusId=${data?.statusId}`
    );
    if (res?.data) {
      setter && setter(res?.data);
      setAllData(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const inputHandler = (
  name,
  value,
  sl,
  landingApproval,
  setLandingApproval
) => {
  let data = [...landingApproval];
  let _sl = data[sl];
  _sl[name] = value;

  setLandingApproval(landingApproval);
};
