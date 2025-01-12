import { FormInstance } from "antd";
import axios from "axios";
import { SetStateAction } from "react";
import { toast } from "react-toastify";

export const createAttendanceTracker = async (
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
      employmentTypeId: values?.employee?.value || "",
      reasonForRequisition: values?.reasonForRequisition || "",
      objectivesToAchieve: values?.objectivesToAchieve || "",
      remarks: values?.remarks || "",
      statusId: 1,
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
    const errorMessage =
      error?.response?.data?.Message || "Something went wrong";
    toast.warn(errorMessage);
  } finally {
    setLoading(false);
  }
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

export const saveAssessment = async (
  form: FormInstance<any>,
  data: any,
  rowData: any,
  setLoading: { (value: SetStateAction<boolean>): void; (arg0: boolean): void },
  cb: any
) => {
  setLoading(true);
  const filteredRowData = rowData.filter((item: any) => item?.isAssessmentDone);
  try {
    const payload = filteredRowData.map((item: any) => ({
      trainingId: data?.id,
      employeeId: item?.employeeId,
    }));
    const res = await axios.post(
      `/TrainingAssessment/BulkTrainingAssessment?questionnaireHeaderId=${form.getFieldValue(
        "assessmentform"
      )}`,
      payload
    );
    form.resetFields();
    toast.success("Assessment Saved Successfully", { toastId: 1222 });
    cb && cb();
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.Message || "Something went wrong";
    toast.warn(errorMessage);
  } finally {
    setLoading(false);
  }
};
