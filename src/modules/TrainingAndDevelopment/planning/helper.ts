import { id } from "date-fns/locale";
import { FormInstance } from "antd";
import axios from "axios";
import moment from "moment";
import { SetStateAction } from "react";
import { toast } from "react-toastify";
import { start } from "repl";

// export const trainingModeFixDDL: any[] = [
//   {
//     label: "Online",
//     value: "Online",
//   },
//   {
//     label: "Classroom",
//     value: "Classroom",
//   },
//   {
//     label: "Residential",
//     value: "Residential",
//   },
//   {
//     label: "Workshop",
//     value: "Workshop",
//   },
//   {
//     label: "Foreign",
//     value: "Foreign",
//   },
// ];

// export const trainingStatusFixDDL: any[] = [
//   {
//     label: "Upcoming",
//     value: "Upcoming",
//   },
//   {
//     label: "Ongoing",
//     value: "Ongoing",
//   },
//   {
//     label: "Completed",
//     value: "Completed",
//   },
//   {
//     label: "Cencaled",
//     value: "Cencaled",
//   },
// ];

export const setTrainingDuration = (form: FormInstance<any>) => {
  const {
    trainingStartDate,
    trainingStartTime,
    trainingEndTime,
    isMultipleDayTraining,
  } = form.getFieldsValue(true);

  if (trainingStartDate && trainingStartTime && trainingEndTime) {
    console.log(
      trainingStartDate,
      trainingStartTime,
      trainingEndTime,
      "date time"
    );
    // Combine date and time
    const trainingStartDateTime = moment(
      `${moment(trainingStartDate).format("YYYY-MM-DD")}T${moment(
        trainingStartTime,
        "hh:mm:ss A"
      ).format("HH:mm:ss")}Z`
    );
    const trainingEndDateTime = moment(
      `${moment(trainingStartDate).format("YYYY-MM-DD")}T${moment(
        trainingEndTime,
        "hh:mm:ss A"
      ).format("HH:mm:ss")}Z`
    );

    // Calculate duration
    if (trainingEndDateTime.isAfter(trainingStartDateTime)) {
      const duration = moment.duration(
        trainingEndDateTime.diff(trainingStartDateTime)
      );
      const hours = Math.floor(duration.asHours());
      const minutes = duration.minutes();
      form.setFieldsValue({
        trainingDuration: `${hours} hours ${minutes} minutes`,
      });

      if (!isMultipleDayTraining) {
        updateSingleDayTrainingStatus(
          form,
          trainingStartDateTime,
          trainingEndDateTime
        );
      }
    } else {
      form.setFieldsValue({
        trainingDuration: `End date-time must be after start date-time.`,
      });
    }
  }
};

const updateSingleDayTrainingStatus = (
  form: any,
  startDateTime: moment.Moment,
  endDateTime: moment.Moment
) => {
  const now = moment();
  let status = { label: "Upcoming", value: 1 };

  if (now.isBetween(startDateTime, endDateTime)) {
    status = { label: "Ongoing", value: 2 };
  } else if (now.isAfter(endDateTime)) {
    status = { label: "Completed", value: 3 };
  }

  form.setFieldsValue({ trainingStatus: status });
};

// validation

export const stepOneValidation = [
  "bUnit",
  "workplaceGroup",
  "workplace",
  "trainingType",
  "trainingTitle",
  "trainingMode",
  "trainingOrganizer",
  // "trainingStatus",
  "objectives",
  "trainingVanue",
  // "trainingStartDate",
  // "trainingStartTime",
  // "trainingEndDate",
  // "trainingEndTime",
  // "nameofTrainerOrganization",
];

export const createTrainingPlan = async (
  form: FormInstance<any>,
  profileData: { orgId: any; buId: any; wgId: any; wId: any; employeeId: any },
  setLoading: { (value: SetStateAction<boolean>): void; (arg0: boolean): void },
  cb: any
) => {
  setLoading(true);
  try {
    const { orgId, buId, wgId, wId, employeeId } = profileData;
    const values = form.getFieldsValue(true);
    console.log(values, "plan");
    const payload = {
      trainingTypeId: values?.trainingType?.value || "",
      trainingTitleId: values?.trainingTitle?.value || "",
      trainingModeStatus: values?.trainingMode?.value,
      trainingOrganizerType: values?.trainingOrganizer?.value,
      status: values?.trainingStatus?.value,
      venueAddress: values?.trainingVanue || "",
      objectives: values?.objectives || "",
      startDate: moment(values?.trainingStartDate).format("YYYY-MM-DD"),
      endDate: moment(values?.trainingEndDate).format("YYYY-MM-DD"),
      startTime: moment(values?.trainingStartTime).format("HH:mm:ss"),
      endTime: moment(values?.trainingEndTime).format("HH:mm:ss"),
    };
    const res = await axios.post(`/Training/Training`, payload);
    // form.resetFields();
    // toast.success("Created Successfully", { toastId: 1222 });
    cb && cb(res?.data);
    // setOpenTrainingTitleModal && setOpenTrainingTitleModal(false);
    setLoading(false);
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.Message || "Something went wrong";
    toast.warn(errorMessage);
  } finally {
    setLoading(false);
  }
};

export const editTrainingPlan = async (
  form: FormInstance<any>,
  profileData: { orgId: any; buId: any; wgId: any; wId: any; employeeId: any },
  setLoading: { (value: SetStateAction<boolean>): void; (arg0: boolean): void },
  cb: any
) => {
  setLoading(true);
  try {
    const { orgId, buId, wgId, wId, employeeId } = profileData;
    const values = form.getFieldsValue(true);
    console.log(values, "plan");
    const payload = {
      trainingTypeId: values?.trainingType?.value || "",
      trainingTitleId: values?.trainingTitle?.value || "",
      trainingModeStatus: values?.trainingMode?.value,
      trainingOrganizerType: values?.trainingOrganizer?.value,
      status: values?.trainingStatus?.value,
      venueAddress: values?.trainingVanue || "",
      objectives: values?.objectives || "",
      startDate: moment(values?.trainingStartDate).format("YYYY-MM-DD"),
      endDate: moment(values?.trainingEndDate).format("YYYY-MM-DD"),
      startTime: moment(values?.trainingStartTime).format("HH:mm:ss"),
      endTime: moment(values?.trainingEndTime).format("HH:mm:ss"),
    };
    const res = await axios.put(
      `/Training/EditTraining/${values?.idx}`,
      payload
    );
    // form.resetFields();
    // toast.success("Edited Successfully", { toastId: 12022 });
    cb && cb(res?.data);
    // setOpenTrainingTitleModal && setOpenTrainingTitleModal(false);
    setLoading(false);
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.Message || "Something went wrong";
    toast.warn(errorMessage);
  } finally {
    setLoading(false);
  }
};

export const createTrainingPlanDetails = async (
  planId: number,
  trainerOrgFieldList: any[],
  costFieldList: any[],
  perticipantFieldList: any[],
  setLoading: { (value: SetStateAction<boolean>): void; (arg0: boolean): void },
  cb: any
) => {
  setLoading(true);
  try {
    const payload = {
      trainingCostPayload: costFieldList.map((cost) => ({
        id: 0,
        trainingId: planId,
        trainingCostTypeId: cost?.costTypeId,
        amount: cost?.costValue,
      })),
      trainingParticipantPayload: perticipantFieldList.map((participant) => ({
        id: 0,
        trainingId: planId,
        hrPositionId: participant?.hrPositionId,
        departmentId: participant?.departmentId,
        employeeId: participant?.perticipantId,
      })),
      trainingTrainerPayload: trainerOrgFieldList.map((trainer) => ({
        id: 0,
        trainingId: planId,
        trainerId: trainer?.value,
      })),
      trainingSchedulePayload: [], // need to check
    };

    const res = await axios.put(`/Training/TrainingDetails/${planId}`, payload);
    // toast.success("Created Successfully", { toastId: 1222 });
    cb && cb();
    setLoading(false);
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.Message || "Something went wrong";
    toast.warn(errorMessage);
  } finally {
    setLoading(false);
  }
};

export const editTrainingPlanDetails = async (
  planId: number,
  trainerOrgFieldList: any[],
  costFieldList: any[],
  perticipantFieldList: any[],
  setLoading: { (value: SetStateAction<boolean>): void; (arg0: boolean): void },
  cb: any
) => {
  setLoading(true);
  try {
    const payload = {
      trainingCostPayload: costFieldList.map((cost) => ({
        id: cost?.idx || 0,
        trainingId: planId,
        trainingCostTypeId: cost?.costTypeId,
        amount: cost?.costValue,
      })),
      trainingParticipantPayload: perticipantFieldList.map((participant) => ({
        id: participant?.idx || 0,
        trainingId: planId,
        hrPositionId: participant?.hrPositionId,
        departmentId: participant?.departmentId,
        employeeId: participant?.perticipantId,
      })),
      trainingTrainerPayload: trainerOrgFieldList.map((trainer) => ({
        id: trainer?.idx || 0,
        trainingId: planId,
        trainerId: trainer?.value,
      })),
    };

    const res = await axios.put(
      `/Training/EditTrainingDetails/${planId}`,
      payload
    );
    // toast.success("Edited Successfully", { toastId: 1222 });
    cb && cb();
    setLoading(false);
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.Message || "Something went wrong";
    toast.warn(errorMessage);
  } finally {
    setLoading(false);
  }
};

export const createTrainingSchedule = async (
  planId: number,
  trainingTime: any,
  form: FormInstance<any>,
  setLoading: { (value: SetStateAction<boolean>): void; (arg0: boolean): void },
  cb: any
) => {
  setLoading(true);
  try {
    const values = form.getFieldsValue(true);
    let payload = [];
    if (!values?.isMultipleDayTraining) {
      payload.push({
        id: 0,
        trainingId: planId,
        trainingDate: values?.trainingStartDate,
        startTime: moment(values?.trainingStartTime).format("HH:mm:ss"),
        endTime: (values?.trainingEndTime).format("HH:mm:ss"),
        trainingDuration: values?.trainingDuration,
      });
    } else {
      payload = trainingTime?.map((time: any) => ({
        id: 0,
        trainingId: planId,
        trainingDate: time?.trainingStartDate,
        startTime: moment(time?.trainingStartTime, "hh:mm:ss A").format(
          "HH:mm:ss"
        ),
        endTime: moment(time?.trainingEndTime, "hh:mm:ss A").format("HH:mm:ss"),
        trainingDuration: time?.trainingDuration,
      }));
    }

    const res = await axios.put(
      `/Training/TrainingScheduleDetails/${planId}`,
      payload
    );
    // toast.success("Created Successfully", { toastId: 1222 });
    cb && cb();
    setLoading(false);
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.Message || "Something went wrong";
    toast.warn(errorMessage);
  } finally {
    setLoading(false);
  }
};

export const editTrainingSchedule = async (
  planId: number,
  trainingTime: any,
  form: FormInstance<any>,
  setLoading: { (value: SetStateAction<boolean>): void; (arg0: boolean): void },
  cb: any
) => {
  setLoading(true);
  try {
    const values = form.getFieldsValue(true);
    let payload = [];
    console.log(trainingTime, "trainingTime");
    if (!values?.isMultipleDayTraining) {
      payload.push({
        id: 0,
        trainingId: planId,
        trainingDate: values?.trainingStartDate,
        startTime: moment(values?.trainingStartTime).format("HH:mm:ss"),
        endTime: (values?.trainingEndTime).format("HH:mm:ss"),
        trainingDuration: values?.trainingDuration,
      });
    } else {
      payload = trainingTime?.map((time: any) => ({
        id: time?.idx || 0,
        trainingId: planId,
        trainingDate: time?.trainingStartDate,
        startTime: moment(time?.trainingStartTime, "hh:mm:ss A").format(
          "HH:mm:ss"
        ),
        endTime: moment(time?.trainingEndTime, "hh:mm:ss A").format("HH:mm:ss"),
        trainingDuration: time?.trainingDuration,
      }));
    }

    const res = await axios.put(
      `/Training/EditTrainingScheduleDetails/${planId}`,
      payload
    );
    // toast.success("Created Successfully", { toastId: 1222 });
    cb && cb();
    setLoading(false);
  } catch (error: any) {
    console.log(error, "error");
    const errorMessage =
      error?.response?.data?.Message || "Something went wrong";
    toast.warn(errorMessage);
  } finally {
    setLoading(false);
  }
};

export const ViewTrainingPlan = async (
  recordId: any,
  setLoading: { (value: SetStateAction<boolean>): void; (arg0: boolean): void },
  cb: any,
  setSingleData?: { (value: any): void; (arg0: {}): void }
) => {
  try {
    setLoading(true);

    const res = await axios.get(`/Training/Training/${recordId}`);
    if (res?.data) {
      cb && cb(res?.data);
      setLoading(false);
      setSingleData && setSingleData(res?.data);
    }
    setLoading(false);
  } catch (error: any) {
    toast.warn(error?.response?.data?.Message || "Something went wrong");
    setSingleData && setSingleData({});
    setLoading(false);
  }
};

export const ViewTrainingPlanDetails = async (
  recordId: any,
  setLoading: { (value: SetStateAction<boolean>): void; (arg0: boolean): void },
  setSingleData: { (value: any): void; (arg0: {}): void },
  cb: any
) => {
  try {
    setLoading(true);

    const res = await axios.get(`/Training/TrainingDetails/${recordId}`);
    if (res?.data) {
      cb && cb(res?.data);
      setLoading(false);
      setSingleData(res?.data);
    }
    setLoading(false);
  } catch (error: any) {
    toast.warn(error?.response?.data?.Message || "Something went wrong");
    setSingleData({});
    setLoading(false);
  }
};

export const ViewTrainingSchedule = async (
  recordId: any,
  setLoading: { (value: SetStateAction<boolean>): void; (arg0: boolean): void },
  cb: any,
  setSingleData?: { (value: any): void; (arg0: {}): void }
) => {
  try {
    setLoading(true);

    const res = await axios.get(
      `/Training/TrainingScheduleDetails/${recordId}`
    );
    if (res?.data) {
      cb && cb(res?.data);
      setLoading(false);
      setSingleData && setSingleData(res?.data);
    }
    setLoading(false);
  } catch (error: any) {
    toast.warn(error?.response?.data?.Message || "Something went wrong");
    setSingleData && setSingleData({});
    setLoading(false);
  }
};

export const costMap = (data: any) => {
  const list: any[] = [];
  data.forEach((item: any) => {
    list.push({
      idx: item?.id,
      costTypeId: item?.trainingCostTypeId,
      costType: item?.trainingCostTypeName,
      costValue: item?.amount,
    });
  });
  return list;
};

export const trainerMap = (data: any) => {
  const list: { value: any; label: any }[] = [];
  data.forEach((item: any) => {
    list.push({
      ...item,
      idx: item?.id,
    });
  });
  return list;
};

export const perticipantMap = (data: any, d: any) => {
  const list: any[] = [];
  data.forEach((item: any) => {
    list.push({
      idx: item?.id,
      perticipant: `${item?.employeeName} - ${item?.employeeId}`,
      perticipantId: item?.employeeId,
      department: item?.departmentName,
      departmentId: item?.departmentId,
      hrPosition: item?.hrPositionName,
      hrPositionId: item?.hrPositionId,
      workplaceGroup: d?.workplaceGroupName,
      workplaceGroupId: d?.workplaceGroupId,
      workplace: d?.workplaceName,
      workplaceId: d?.workplaceId,
    });
  });
  return list;
};

export const addHandlerTriningTimes = (
  values: any,
  trainingTime: any,
  setTrainingTime: any
) => {
  if (
    !values?.trainingStartTime ||
    !values?.trainingEndTime ||
    !values?.trainingStartDate
  ) {
    toast.error("Training date and Time is required");
    return;
  }
  console.log(values, "values");
  console.log(trainingTime, "trainingTime");
  const nextId =
    trainingTime.length > 0 ? trainingTime[trainingTime.length - 1].id + 1 : 1;
  const newTrainingTime = [
    ...trainingTime,
    {
      id: nextId,
      trainingStartTime: moment(values?.trainingStartTime).format("hh:mm:ss A"),
      trainingEndTime: moment(values?.trainingEndTime).format("hh:mm:ss A"),
      trainingStartDate: moment(values?.trainingStartDate).format("YYYY-MM-DD"),
      trainingDuration: values?.trainingDuration,
    },
  ];

  newTrainingTime.sort((a, b) => {
    const dateA = moment(a.trainingStartDate).format("YYYY-MM-DD");
    const dateB = moment(b.trainingStartDate).format("YYYY-MM-DD");
    if (dateA < dateB) return -1;
    if (dateA > dateB) return 1;

    const startTimeA = moment(a.trainingStartTime, "hh:mm:ss A").format(
      "HH:mm:ss"
    );
    const startTimeB = moment(b.trainingStartTime, "hh:mm:ss A").format(
      "HH:mm:ss"
    );
    if (startTimeA < startTimeB) return -1;
    if (startTimeA > startTimeB) return 1;

    const endTimeA = moment(a.trainingEndTime, "hh:mm:ss A").format("HH:mm:ss");
    const endTimeB = moment(b.trainingEndTime, "hh:mm:ss A").format("HH:mm:ss");
    if (endTimeA < endTimeB) return -1;
    if (endTimeA > endTimeB) return 1;

    return 0;
  });

  setTrainingTime(newTrainingTime);
};

export const changeTrainingStatus = (form: any, trainingTime: any) => {
  const now = moment();
  let status = { label: "Upcoming", value: 1 };

  if (trainingTime.length > 0) {
    const firstItem = trainingTime[0];
    const lastItem = trainingTime[trainingTime.length - 1];

    const firstStartDateTime = moment(
      `${firstItem.trainingStartDate}T${firstItem.trainingStartTime}`,
      "YYYY-MM-DDThh:mm:ss A"
    );
    const lastEndDateTime = moment(
      `${lastItem.trainingStartDate}T${lastItem.trainingEndTime}`,
      "YYYY-MM-DDThh:mm:ss A"
    );

    console.log(firstStartDateTime, lastEndDateTime, "start end");

    if (now.isBetween(firstStartDateTime, lastEndDateTime)) {
      status = { label: "Ongoing", value: 2 };
    } else if (now.isAfter(lastEndDateTime)) {
      status = { label: "Completed", value: 3 };
    }
  }

  form.setFieldsValue({ trainingStatus: status });
  return status;
};

export const cancelTrainingPlan = async (
  recordId: any,
  setLoading: { (value: SetStateAction<boolean>): void; (arg0: boolean): void },
  cb: any
) => {
  try {
    setLoading(true);

    const res = await axios.put(`/Training/TrainingStatus?id=${recordId}`);
    if (res?.data) {
      cb && cb(res?.data);
      setLoading(false);
    }
    setLoading(false);
  } catch (error: any) {
    toast.warn(error?.response?.data?.Message || "Something went wrong");
    setLoading(false);
  }
};

export const calculateDuration = (startTime: string, endTime: string) => {
  const start = moment(startTime, "HH:mm:ss");
  const end = moment(endTime, "HH:mm:ss");
  const duration = moment.duration(end.diff(start));
  const hours = Math.floor(duration.asHours());
  const minutes = duration.minutes();
  return `${hours} hours ${minutes} minutes`;
};

export const calculateTotalDuration = (trainingTime: any) => {
  if (trainingTime?.length < 1) return "0 hours 0 minutes";
  let totalMinutes = 0;

  trainingTime?.forEach((item: any) => {
    const [hoursStr, minutesStr] = item?.trainingDuration
      .split(" ")
      .filter((_: any, index: number) => index % 2 === 0);
    const hours = parseInt(hoursStr);
    const minutes = parseInt(minutesStr);
    totalMinutes += hours * 60 + minutes;
  });

  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  return `${totalHours} hours ${remainingMinutes} minutes`;
};

export const doCheckDuplicateTrainingTime = (
  values: any,
  trainingTime: any[]
) => {
  // Store the original values before formatting them for comparison
  const originalStartTime = values.trainingStartTime;
  const originalEndTime = values.trainingEndTime;
  const originalStartDate = values.trainingStartDate;

  // Format the times for comparison (using 24-hour format for comparison)
  const startTime = moment(values.trainingStartTime, "hh:mm:ss A").format(
    "HH:mm:ss"
  );
  const endTime = moment(values.trainingEndTime, "hh:mm:ss A").format(
    "HH:mm:ss"
  );
  const trainingDate = moment(values.trainingStartDate).format("YYYY-MM-DD"); // Extract date part for comparison

  // Iterate over the trainingTime list and compare with each schedule
  for (const schedule of trainingTime) {
    const scheduleDate = moment(schedule.trainingStartDate).format(
      "YYYY-MM-DD"
    );

    // Compare only if the dates are the same
    if (trainingDate === scheduleDate) {
      // Format the schedule start and end times for comparison (using 24-hour format for comparison)
      const scheduleStartTime = moment(
        `${schedule.trainingStartDate} ${schedule.trainingStartTime}`,
        "YYYY-MM-DD hh:mm:ss A"
      ).format("HH:mm:ss");
      const scheduleEndTime = moment(
        `${schedule.trainingStartDate} ${schedule.trainingEndTime}`,
        "YYYY-MM-DD hh:mm:ss A"
      ).format("HH:mm:ss");

      // If either start or end time falls within the schedule's start and end times, or completely spans it, return overlap
      if (
        moment(startTime, "HH:mm:ss").isBetween(
          moment(scheduleStartTime, "HH:mm:ss"),
          moment(scheduleEndTime, "HH:mm:ss"),
          null,
          "[)"
        ) || // start overlaps
        moment(endTime, "HH:mm:ss").isBetween(
          moment(scheduleStartTime, "HH:mm:ss"),
          moment(scheduleEndTime, "HH:mm:ss"),
          null,
          "(]"
        ) || // end overlaps
        (moment(startTime, "HH:mm:ss").isSameOrBefore(
          moment(scheduleStartTime, "HH:mm:ss")
        ) &&
          moment(endTime, "HH:mm:ss").isSameOrAfter(
            moment(scheduleEndTime, "HH:mm:ss")
          )) // fully spans
      ) {
        toast.error(
          `Training time overlaps with existing schedule on ${schedule.trainingStartDate} from ${schedule.trainingStartTime} to ${schedule.trainingEndTime}`,
          {
            autoClose: false,
            closeButton: true, // Show close button
          }
        );
        return {
          overlap: true,
          conflictingSchedule: {
            ...schedule,
          },
        };
      }
    }
  }

  // No overlap found, return false with the original format
  return { overlap: false };
};
// Helper function to convert 12-hour format to 24-hour format
const convertTo24Hour = (timeStr: any) => {
  if (typeof timeStr !== "string") {
    throw new Error(`Invalid time format: ${timeStr}`);
  }

  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes, seconds] = time.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
};
