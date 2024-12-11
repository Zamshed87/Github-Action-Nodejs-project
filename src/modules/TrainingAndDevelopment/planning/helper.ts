import { FormInstance } from "antd";
import axios from "axios";
import moment from "moment";
import { SetStateAction } from "react";
import { toast } from "react-toastify";

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
  const { trainingStartDate, trainingStartTime, trainingEndTime } =
    form.getFieldsValue(true);

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
    } else {
      form.setFieldsValue({
        trainingDuration: `End date-time must be after start date-time.`,
      });
    }
  }
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
  "trainingStatus",
  "objectives",
  "trainingVanue",
  "trainingStartDate",
  "trainingStartTime",
  "trainingEndDate",
  "trainingEndTime",
  "nameofTrainerOrganization",
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
    const res = await axios.post(`/Training/Training/Training`, payload);
    form.resetFields();
    toast.success("Created Successfully", { toastId: 1222 });
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
      `/Training/Training/EditTraining/${values?.idx}`,
      payload
    );
    form.resetFields();
    toast.success("Edited Successfully", { toastId: 12022 });
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
    };

    const res = await axios.put(
      `/Training/Training/TrainingDetails/${planId}`,
      payload
    );
    toast.success("Created Successfully", { toastId: 1222 });
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
      `/Training/Training/EditTrainingDetails/${planId}`,
      payload
    );
    toast.success("Edited Successfully", { toastId: 1222 });
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

export const ViewTrainingPlan = async (
  recordId: any,
  setLoading: { (value: SetStateAction<boolean>): void; (arg0: boolean): void },
  setSingleData: { (value: any): void; (arg0: {}): void },
  cb: any
) => {
  try {
    setLoading(true);

    const res = await axios.get(`/Training/Training/Training/${recordId}`);
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

export const ViewTrainingPlanDetails = async (
  recordId: any,
  setLoading: { (value: SetStateAction<boolean>): void; (arg0: boolean): void },
  setSingleData: { (value: any): void; (arg0: {}): void },
  cb: any
) => {
  try {
    setLoading(true);

    const res = await axios.get(
      `/Training/Training/TrainingDetails/${recordId}`
    );
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

export const data: any[] = [
  {
    requestor: "John Doe",
    trainingType: "Leadership",
    createdBy: "Admin",
    createdDate: "2023-11-20T10:00:00Z",
    trainingStatus: "Pending",
    letterGenerateId: 101,
  },
  {
    requestor: "Jane Smith",
    trainingType: "Technical",
    createdBy: "Manager",
    createdDate: "2023-11-18T15:30:00Z",
    trainingStatus: "Completed",
    letterGenerateId: 102,
  },
  {
    requestor: "Alice Johnson",
    trainingType: "Soft Skills",
    createdBy: "Coordinator",
    createdDate: "2023-11-19T08:45:00Z",
    trainingStatus: "In Progress",
    letterGenerateId: 103,
  },
  {
    requestor: "Bob Brown",
    trainingType: "Compliance",
    createdBy: "Admin",
    createdDate: "2023-11-17T12:00:00Z",
    trainingStatus: "Pending",
    letterGenerateId: 104,
  },
  {
    requestor: "Charlie Davis",
    trainingType: "Leadership",
    createdBy: "HR",
    createdDate: "2023-11-21T09:20:00Z",
    trainingStatus: "Approved",
    letterGenerateId: 105,
  },
];
