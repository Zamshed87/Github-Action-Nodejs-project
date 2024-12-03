import { FormInstance } from "antd";
import axios from "axios";
import { SetStateAction } from "react";
import { toast } from "react-toastify";

export const requisitionStatus: any[] = [
  {
    label: "Assigned",
    value: "Assigned",
  },
  {
    label: "Deferred",
    value: "Deferred",
  },
  {
    label: "Discarded",
    value: "Discarded",
  },
  {
    label: "Accomplished",
    value: "Accomplished",
  },
];

export const createTrainingRequisition = async (
  form: FormInstance<any>,
  profileData: { orgId: any; buId: any; wgId: any; wId: any; employeeId: any },
  setLoading: { (value: SetStateAction<boolean>): void; (arg0: boolean): void },
  cb: any
  // setOpenTrainingTitleModal: (arg0: boolean) => void
) => {
  setLoading(true);
  try {
    const { orgId, buId, wgId, wId, employeeId } = profileData;
    const values = form.getFieldsValue(true);

    const payload = {
      trainingTypeId: values?.trainingType?.value || "",
      employmentId: values?.employee?.value || "",
      reasonForRequisition: values?.reasonForRequisition || "",
      objectivesToAchieve: values?.objectivesToAchieve || "",
      remarks: values?.remarks || "",
    };
    const res = await axios.post(
      `/TrainingRequisition/Training/TrainingRequisition`,
      payload
    );
    form.resetFields();
    toast.success("Created Successfully", { toastId: 1222 });
    cb && cb();
    // setOpenTrainingTitleModal && setOpenTrainingTitleModal(false);
    setLoading(false);
  } catch (error: any) {
    toast.warn(error?.response?.data?.Message || "Something went wrong");
  } finally {
    setLoading(false);
  }
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
