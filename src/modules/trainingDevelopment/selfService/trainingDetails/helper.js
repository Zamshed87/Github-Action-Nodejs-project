import axios from "axios";
import { toast } from "react-toastify";

export const getAssesmentQuestions = async (
  scheduleID,
  employeeId,
  isPreAssessment,
  setLoading,
  setter,
  setAllData
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Training/GetTrainingAssesmentQuestionByScheduleId?employeeId=${employeeId}&intScheduleId=${scheduleID}&isPreAssessment=${isPreAssessment}`
    );
    setter && setter(res?.data);
    setAllData && setAllData(res?.data);
    setLoading && setLoading(false);
  } catch (error) {
    setLoading && setLoading(false);
    setter([]);
    setAllData([]);
  }
};

export const createTrainingAssesmentAnswer = async (
  state,
  payload,
  employeeId,
  setLoading,
  cb
) => {
  setLoading && setLoading(true);
  const modify = payload.map((item, index) => {
    return {
      intAnswerId: 0,
      intQuestionId: item?.intQuestionId,
      intOptionId: item?.options[0]?.intOptionId,
      strOption: item?.options[0]?.strOption,
      numMarks: item?.options[0]?.numPoints,
      intActionBy: employeeId,
      intRequisitionId: state?.intRequisitionId,
    };
  });
  try {
    const res = await axios.post(
      `/Training/CreateTrainingAssesmentAnswer`,
      modify
    );
    // setter && setter(res?.data);
    // setAllData && setAllData(res?.data);
    cb && cb();
    setLoading && setLoading(false);
    toast.success(res?.data?.message || "Submitted Successfully");
  } catch (error) {
    setLoading && setLoading(false);
    toast.warn(error?.response?.data?.message || "Something went wrong");

    // setter([]);
    // setAllData([]);
  }
};
