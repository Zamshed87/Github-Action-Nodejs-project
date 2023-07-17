import axios from "axios";
import { toast } from "react-toastify";

const modifyPayload = (payload, employeeId, orgId, buId) => {
  return {
    intScheduleId: payload?.intScheduleId || 0,
    intTrainingId: payload?.trainingName?.value,
    strTrainingName: payload?.trainingName?.label,
    strTrainingCode: payload?.strTrainingCode || "",
    dteDate: payload?.dteDate || new Date(),
    numTotalDuration: +payload?.duration,
    strVenue: payload?.venue,
    strResourcePersonName: payload?.resourcePerson,
    intBatchSize: +payload?.batchSize,
    strBatchNo: payload?.batchNo,
    dteFromDate: payload?.fromDate,
    dteToDate: payload?.toDate,
    strRemarks: payload?.remarks,
    isApproved: false,
    isActive: true,
    intActionBy: employeeId,
    dteActionDate: payload?.dteActionDate || new Date(),
    isRequestedSchedule:
      payload?.isRequested !== undefined
        ? payload?.isRequested
        : payload?.isRequestedSchedule,
    intRequestedByEmp: +payload?.requestedBy?.value,
    intUpdatedBy: +employeeId,
    dteUpdatedDate: new Date(),
    monthYear: payload?.fromDate,
    totalRequisition: 0,
    IntAccountId: orgId,
    IntBusinessUnitId: buId,
  };
};

export const getTrainingNameAllDDL = async (buId, wgId, setter) => {
  try {
    const res = await axios.get(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=training&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}`
    );
    const newDDL = res?.data?.map((item) => {
      return {
        value: item?.Id,
        label: item?.TrainingName,
      };
    });
    setter([...newDDL]);
  } catch (error) {}
};

export const createTrainingNameDDL = async (payload, cb) => {
  try {
    const res = await axios.post(`/Training/CreateTrainingName`, payload);
    cb && cb();
    toast.success(res.data?.message || "Successfully");
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
  }
};

export const createSchedule = async (payload, employeeId, orgId, buId, cb) => {
  const modifiedPayload = payload?.map((item) =>
    modifyPayload(item, employeeId, orgId, buId)
  );
  try {
    const res = await axios.post(
      `/Training/CreateTrainingSchedule`,
      modifiedPayload
    );

    cb && cb();
    toast.success(
      res.data?.message ||
        `Successfully ${payload[0]?.intScheduleId ? "Edited" : "Added"}`
    );
  } catch (error) {}
};
export const editSchedule = async (payload, employeeId, orgId, buId, cb) => {
  const modifiedPayload = payload?.map((item) =>
    modifyPayload(item, employeeId, orgId, buId)
  );
  try {
    const res = await axios.post(
      `/Training/EditTrainingSchedule`,
      modifiedPayload[0]
    );

    cb && cb();
    toast.success(
      res.data?.message ||
        `Successfully ${payload[0]?.intScheduleId ? "Edited" : "Added"}`
    );
  } catch (error) {}
};

export const getScheduleLanding = async (
  setAllData,
  setter,
  setLoading,
  orgId,
  buId
) => {
  setLoading?.(true);
  try {
    const res = await axios.get(
      `/Training/GetTrainingScheduleLanding?intAccountId=${orgId}&intBusinessUnitId=${buId}`
    );

    setter?.(res?.data);
    setAllData?.(res?.data);
    setLoading?.(false);
  } catch (error) {
    setLoading?.(false);
  }
};

export const getSingleSchedule = async (
  setter,
  setLoading,
  orgId,
  buId,
  id,
  cb
) => {
  setLoading?.(true);
  try {
    const res = await axios.get(
      `/Training/GetTrainingScheduleLanding?intTrainingId=${id}&intAccountId=${orgId}&intBusinessUnitId=${buId}`
    );

    setter?.(res?.data[0]);
    cb?.(res?.data[0]);
    setLoading?.(false);
  } catch (error) {
    setLoading?.(false);
  }
};

export const deleteSchedule = async (scheduleId, setLoading, cb) => {
  setLoading?.(true);
  try {
    const res = await axios.put(
      `/Training/DeleteTrainingSchedule?id=${scheduleId}`
    );
    setLoading?.(false);

    cb?.();

    toast.success(res.data?.message || `Successfully Deleted!`);
  } catch (error) {
    setLoading?.(false);

    toast.error(`Something went wrong!`);
  }
};
