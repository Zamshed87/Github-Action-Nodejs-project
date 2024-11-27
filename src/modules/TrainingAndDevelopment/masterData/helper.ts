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
      strName: values?.trainingType,
      strRemarks: values?.remarks,
      intAccountId: orgId,
      dteCreatedAt: todayDate(),
      intCreatedBy: employeeId,
      isActive: true,
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
        dteUpdatedAt: todayDate(),
        intUpdatedBy: employeeId,
      };
    } else {
      payload = {
        intId: data?.intId,
        strName: values?.trainingType || data?.strName,
        strRemarks: values?.remarks || data?.strRemarks,
        intAccountId: orgId,
        dteUpdatedAt: todayDate(),
        intUpdatedBy: employeeId,
        isActive: data?.isActive,
      };
    }

    const res = await axios.put(
      `/TrainingType/Training/Type/${data?.intId}`,
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
    const res = await axios.delete(
      `/TrainingType/Training/Type/${data?.intId}`
    );
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
      strName: values?.trainingTitle,
      strDescription: values?.trainingDescription,
      intCreatedBy: employeeId,
      isActive: true,
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
        dteUpdatedAt: todayDate(),
        intUpdatedBy: employeeId,
      };
    } else {
      payload = {
        intId: data?.intId,
        strName: values?.trainingTitle || data?.strName,
        strDescription: values?.remarks || data?.strDescription,
        intAccountId: orgId,
        dteUpdatedAt: todayDate(),
        intUpdatedBy: employeeId,
        isActive: data?.isActive,
      };
    }

    const res = await axios.put(
      `/TrainingTitle/Training/Title/${data?.intId}`,
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

    const payload = {
      strName: values?.trainingType,
      strRemarks: values?.remarks,
      intAccountId: orgId,
      dteCreatedAt: todayDate(),
      intCreatedBy: employeeId,
      isActive: true,
    };
    const res = await axios.post(`/TrainingType/Training/Type`, payload);
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
        dteUpdatedAt: todayDate(),
        intUpdatedBy: employeeId,
      };
    } else {
      payload = {
        intId: data?.intId,
        strName: values?.trainingType || data?.strName,
        strRemarks: values?.remarks || data?.strRemarks,
        intAccountId: orgId,
        dteUpdatedAt: todayDate(),
        intUpdatedBy: employeeId,
        isActive: data?.isActive,
      };
    }

    const res = await axios.put(
      `/TrainingType/Training/Type/${data?.intId}`,
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
      strName: values?.trainingType,
      strRemarks: values?.remarks,
      intAccountId: orgId,
      dteCreatedAt: todayDate(),
      intCreatedBy: employeeId,
      isActive: true,
    };
    const res = await axios.post(`/TrainingType/Training/Type`, payload);
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
        dteUpdatedAt: todayDate(),
        intUpdatedBy: employeeId,
      };
    } else {
      payload = {
        intId: data?.intId,
        strName: values?.trainingType || data?.strName,
        strRemarks: values?.remarks || data?.strRemarks,
        intAccountId: orgId,
        dteUpdatedAt: todayDate(),
        intUpdatedBy: employeeId,
        isActive: data?.isActive,
      };
    }

    const res = await axios.put(
      `/TrainingType/Training/Type/${data?.intId}`,
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
