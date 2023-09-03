import axios from "axios";
import { toast } from "react-toastify";

const modifiedInitialValues = (values) => {
  let questions = [];
  let answers = [];

  values.forEach((value) => {
    questions.push({
      queId: value?.intQuestionId,
      title: value?.strQuestion,
      isRequired: value?.isRequired,
    });
    value?.options?.forEach((option) => {
      answers.push({
        optionId: option?.intOptionId,
        queId: option?.intQuestionId,
        ansTitle: option?.strOption,
        mark: option?.numPoints,
      });
    });
  });

  if (questions?.length && answers?.length) {
    return {
      questions: questions,
      answers: answers,
    };
  }
};

export const createAssessment = async (payload, setLoading, cb) => {
  setLoading?.(true);
  try {
    const res = await axios.post(
      `/Training/CreateTrainingAssesmentQuestion`,
      payload
    );

    setLoading?.(false);
    cb?.();
    toast.success(res.data?.message || `Successfully Created!`);
  } catch (err) {
    setLoading?.(false);
    toast.error(`Something went wrong!`);
  }
};
export const editAssessment = async (payload, setLoading, cb) => {
  setLoading?.(true);
  try {
    const res = await axios.post(
      `/Training/EditTrainingAssesmentQuestion`,
      payload
    );

    setLoading?.(false);
    cb?.();
    toast.success(res.data?.message || `Successfully Edited!`);
  } catch (err) {
    setLoading?.(false);
    toast.error(`Something went wrong!`);
  }
};

export const getAssessmentQuestions = async (
  scheduleId,
  status,
  setLoading,
  setter
) => {
  setLoading?.(true);

  try {
    const res = await axios?.get(
      `/Training/GetTrainingAssesmentQuestionByScheduleId?intScheduleId=${scheduleId}&isPreAssessment=${
        status === "pre" ? true : false
      }`
    );
    if (res?.data) {
      setter?.(modifiedInitialValues(res?.data));
    }
    setLoading?.(false);
  } catch (error) {
    setLoading?.(false);
    toast.error(`Something went wrong!`);
  }
};

export const getSingleSchedule = async (
  setter,
  setLoading,
  orgId,
  buId,
  id,
  cb
) => {
  setLoading?.(true);
  try {
    const res = await axios.get(
      `/Training/GetTrainingScheduleLanding?intTrainingId=${id}&intAccountId=${orgId}&intBusinessUnitId=${buId}`
    );

    setter?.(res?.data[0]);
    cb?.(res?.data[0]);
    setLoading?.(false);
  } catch (error) {
    setLoading?.(false);
    toast.error(`Something went wrong!`);
  }
};
