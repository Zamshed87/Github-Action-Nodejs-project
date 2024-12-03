import { FormInstance } from "antd";
import axios from "axios";
import { SetStateAction } from "react";
import { toast } from "react-toastify";
import { todayDate } from "utility/todayDate";

// Training Type
export const createTrainingType = async (
  form: FormInstance<any>,
  profileData: { orgId: any; buId: any; wgId: any; wId: any; employeeId: any },
  setLoading: { (value: SetStateAction<boolean>): void; (arg0: boolean): void },
  cb: any,
  setOpenTraingTypeModal: (arg0: boolean) => void
) => {
  setLoading(true);
  try {
    const { orgId, buId, wgId, wId, employeeId } = profileData;
    const values = form.getFieldsValue(true);

    const payload = {
      name: values?.trainingType,
      remarks: values?.remarks || "",
    };
    const res = await axios.post(`/TrainingType/Training/Type`, payload);
    form.resetFields();
    toast.success("Created Successfully", { toastId: 1222 });
    cb && cb();
    setOpenTraingTypeModal && setOpenTraingTypeModal(false);
    setLoading(false);
  } catch (error) {
    toast.warn("Created failed", { toastId: 1222 });
  } finally {
    setLoading(false);
  }
};

export const updateTrainingType = async (
  form: FormInstance<any>,
  profileData: { orgId: any; buId: any; wgId: any; wId: any; employeeId: any },
  setLoading: { (value: SetStateAction<boolean>): void; (arg0: boolean): void },
  data: any,
  onlyStatus: boolean,
  cb: any
) => {
  setLoading(true);
  try {
    const { orgId, buId, wgId, wId, employeeId } = profileData;
    const values = form.getFieldsValue(true);
    let payload = {};

    if (onlyStatus) {
      payload = {
        ...data,
        isActive: !data?.isActive,
      };
    } else {
      payload = {
        name: values?.trainingType || data?.name,
        remarks: values?.remarks || "",
        isActive: data?.isActive,
      };
    }

    const res = await axios.put(
      `/TrainingType/Training/Type/${data?.id}`,
      payload
    );
    form.resetFields();
    toast.success("Updated Successfully", { toastId: 12522 });
    cb && cb();
    setLoading(false);
  } catch (error) {
    toast.warn("An unexpected error occurred", { toastId: 12522 });
  } finally {
    setLoading(false);
  }
};

export const deleteTrainingType = async (
  data: any,
  setLoading: { (value: SetStateAction<boolean>): void; (arg0: boolean): void },
  cb: any
) => {
  setLoading(true);
  try {
    const res = await axios.delete(`/TrainingType/Training/Type/${data?.id}`);
    toast.success("Deleted Successfully", { toastId: 1222 });
    cb && cb();
    setLoading(false);
  } catch (error) {
    toast.warn("An unexpected error occurred", { toastId: 1222 });
  } finally {
    setLoading(false);
  }
};

// ....................................................................................
// Training Title
export const createTrainingTitle = async (
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
      name: values?.trainingTitle,
      description: values?.trainingDescription || "",
    };
    const res = await axios.post(`/TrainingTitle/Training/Title`, payload);
    form.resetFields();
    toast.success("Created Successfully", { toastId: 1222 });
    cb && cb();
    // setOpenTrainingTitleModal && setOpenTrainingTitleModal(false);
    setLoading(false);
  } catch (error) {
    toast.warn("Created failed", { toastId: 1222 });
  } finally {
    setLoading(false);
  }
};

export const updateTrainingTitle = async (
  form: FormInstance<any>,
  profileData: { orgId: any; buId: any; wgId: any; wId: any; employeeId: any },
  setLoading: { (value: SetStateAction<boolean>): void; (arg0: boolean): void },
  data: any,
  onlyStatus: boolean,
  cb: any
) => {
  setLoading(true);
  try {
    const { orgId, buId, wgId, wId, employeeId } = profileData;
    const values = form.getFieldsValue(true);
    let payload = {};

    if (onlyStatus) {
      payload = {
        ...data,
        isActive: !data?.isActive,
      };
    } else {
      payload = {
        name: values?.trainingTitle || data?.name,
        description: values?.trainingDescription || "",
        isActive: data?.isActive,
      };
    }

    const res = await axios.put(
      `/TrainingTitle/Training/Title/${data?.id}`,
      payload
    );
    form.resetFields();
    toast.success("Updated Successfully", { toastId: 12522 });
    cb && cb();
    setLoading(false);
  } catch (error) {
    toast.warn("An unexpected error occurred", { toastId: 12522 });
  } finally {
    setLoading(false);
  }
};
// .......................................................................................
// Trainer Info
export const createTrainerInfo = async (
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
    console.log(values, "values");

    const payload = {
      name: values?.nameofTrainer || "",
      organization: values?.nameofOrganization || "",
      contactNo: values?.contactNo || "",
      email: values?.trainerEmail || "",
      isInHouseTrainer: values?.inhouseTrainer || false,
    };
    const res = await axios.post(
      `/TrainerInformation/Training/TrainerInformation`,
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

export const updateTrainerInfo = async (
  form: FormInstance<any>,
  profileData: { orgId: any; buId: any; wgId: any; wId: any; employeeId: any },
  setLoading: { (value: SetStateAction<boolean>): void; (arg0: boolean): void },
  data: any,
  onlyStatus: boolean,
  cb: any
) => {
  setLoading(true);
  try {
    const { orgId, buId, wgId, wId, employeeId } = profileData;
    const values = form.getFieldsValue(true);
    let payload = {};

    if (onlyStatus) {
      payload = {
        ...data,
        isActive: !data?.isActive,
      };
    } else {
      payload = {
        name: values?.nameofTrainer || data?.name,
        organization: values?.nameofOrganization || "",
        contactNo: values?.contactNo || data?.contactNo,
        email: values?.trainerEmail || "",
        isInHouseTrainer: values?.inhouseTrainer || data?.isInHouseTrainer,
        isActive: data?.isActive,
      };
    }

    const res = await axios.put(
      `/TrainerInformation/Training/TrainerInformation/${data?.id}`,
      payload
    );
    form.resetFields();
    toast.success("Updated Successfully", { toastId: 12522 });
    cb && cb();
    setLoading(false);
  } catch (error) {
    toast.warn("An unexpected error occurred", { toastId: 12522 });
  } finally {
    setLoading(false);
  }
};

// ..................................................................................

// Training Cost
export const createTrainingCost = async (
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
      name: values?.costType,
      description: values?.costDescription || "",
    };
    const res = await axios.post(
      `/TrainingCostType/Training/CostType`,
      payload
    );
    form.resetFields();
    toast.success("Created Successfully", { toastId: 1222 });
    cb && cb();
    // setOpenTrainingTitleModal && setOpenTrainingTitleModal(false);
    setLoading(false);
  } catch (error) {
    toast.warn("Created failed", { toastId: 1222 });
  } finally {
    setLoading(false);
  }
};

export const updateTrainingCost = async (
  form: FormInstance<any>,
  profileData: { orgId: any; buId: any; wgId: any; wId: any; employeeId: any },
  setLoading: { (value: SetStateAction<boolean>): void; (arg0: boolean): void },
  data: any,
  onlyStatus: boolean,
  cb: any
) => {
  setLoading(true);
  try {
    const { orgId, buId, wgId, wId, employeeId } = profileData;
    const values = form.getFieldsValue(true);
    let payload = {};

    if (onlyStatus) {
      payload = {
        ...data,
        isActive: !data?.isActive,
      };
    } else {
      payload = {
        name: values?.costType || data?.name,
        description: values?.costDescription || "",
        isActive: data?.isActive,
      };
    }

    const res = await axios.put(
      `/TrainingCostType/Training/CostType/${data?.id}`,
      payload
    );
    form.resetFields();
    toast.success("Updated Successfully", { toastId: 12522 });
    cb && cb();
    setLoading(false);
  } catch (error) {
    toast.warn("An unexpected error occurred", { toastId: 12522 });
  } finally {
    setLoading(false);
  }
};

export const dataDemo: any[] = [
  {
    key: 1,
    strName: "Technical Training",
    strRemarks: "Basic programming skills development",
    intCreatedBy: "John Doe",
    createdDate: "2024-11-20T10:15:00.000Z",
    status: true,
    isActive: true,
  },
  {
    key: 2,
    strName: "Leadership Workshop",
    strRemarks: "Developing managerial skills",
    intCreatedBy: "Jane Smith",
    createdDate: "2024-11-18T14:30:00.000Z",
    status: false,
    isActive: false,
  },
  {
    key: 3,
    strName: "Compliance Training",
    strRemarks: "Mandatory compliance regulations",
    intCreatedBy: "Michael Johnson",
    createdDate: "2024-11-22T09:00:00.000Z",
    status: true,
    isActive: true,
  },
];
