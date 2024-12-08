import { FormInstance } from "antd";
import moment from "moment";

export const trainingModeFixDDL: any[] = [
  {
    label: "Online",
    value: "Online",
  },
  {
    label: "Classroom",
    value: "Classroom",
  },
  {
    label: "Residential",
    value: "Residential",
  },
  {
    label: "Workshop",
    value: "Workshop",
  },
  {
    label: "Foreign",
    value: "Foreign",
  },
];

export const trainingStatusFixDDL: any[] = [
  {
    label: "Upcoming",
    value: "Upcoming",
  },
  {
    label: "Ongoing",
    value: "Ongoing",
  },
  {
    label: "Completed",
    value: "Completed",
  },
  {
    label: "Cencaled",
    value: "Cencaled",
  },
];

export const setTrainingDuration = (form: FormInstance<any>) => {
  const {
    trainingStartDate,
    trainingStartTime,
    trainingEndDate,
    trainingEndTime,
  } = form.getFieldsValue(true);

  if (
    trainingStartDate &&
    trainingStartTime &&
    trainingEndDate &&
    trainingEndTime
  ) {
    // Combine date and time
    const trainingStartDateTime = moment(
      `${moment(trainingStartDate).format("YYYY-MM-DD")}T${moment(
        trainingStartTime
      ).format("HH:mm:ss.SSS")}Z`
    );
    const trainingEndDateTime = moment(
      `${moment(trainingEndDate).format("YYYY-MM-DD")}T${moment(
        trainingEndTime
      ).format("HH:mm:ss.SSS")}Z`
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
