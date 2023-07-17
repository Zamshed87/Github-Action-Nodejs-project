import axios from "axios";
import { toast } from "react-toastify";

export const getAssessmentQuestions = async (
  setLoading,
  setter,
  scheduleId,
  isPreAssessment = false
) => {
  setLoading?.(true);
  try {
    const res = await axios.get(
      `/Training/GetTrainingAssesmentQuestionByScheduleId?intScheduleId=${scheduleId}&isPreAssessment=${isPreAssessment}`
    );

    setLoading?.(false);
    setter?.(res?.data);
  } catch (error) {
    setLoading?.(false);
    toast.error(error?.response?.data?.message || "Something went wrong");
  }
};

export const deleteAssessment = async (scheduleId, status, setLoading, cb) => {
  setLoading?.(true);
  try {
    const res = await axios.put(
      `/Training/AssessmentQuestionDelete?isPreassesment=${status}&ScheduleId=${scheduleId}`
    );

    setLoading?.(false);
    toast.success(res?.data?.message || "Successfully Deleted!");
  } catch (error) {
    setLoading?.(false);
    toast.error(error?.response?.data?.message || "Something went wrong");
  }
};
