import axios from "axios";
import { toast } from "react-toastify";

export const getSubmissionDetails = async (
  scheduleId,
  orgId,
  requisitionId,
  employeeId,
  status,
  buId,
  setter,
  setLoading
) => {
  setLoading?.(true);
  try {
    const res = await axios.get(
      `/Training/GetTrainingAssesmentQuestionAnswerByRequisitionId?intScheduleId=${scheduleId}&intEmployeeId=${employeeId}&intRequisitionId=${requisitionId}&isPreAssessment=${status}&IntAccountId=${orgId}&intBusinessUnitId=${buId}`
    );

    setter?.({
      ...res?.data?.requisitionForAssesment,
      question: res?.data?.question,
    });
    setLoading?.(false);
  } catch (err) {
    setLoading?.(false);
    toast.error(`Something went wrong!`);
  }
};
