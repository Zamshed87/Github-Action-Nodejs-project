/*
 * Title: Exit interview functions
 * Author: Khurshida Meem
 * Date: 18-11-2024
 *
 */

import axios from "axios";
import { toast } from "react-toastify";

export const saveQuestionnaire = async (
  values,
  profileData,
  setLoading,
  cb
) => {
  setLoading(true);
  try {
    const formattedQuestions = values?.questions?.map((ques, index) => {
      const relevantAnswers = ques.answers
        ? ques.answers.map((answer, idx) => ({
            optionName: answer.answerDescription,
            sortOrder: idx + 1,
          }))
        : [];

      return {
        typeId: parseInt(ques.questionType),
        title: ques.questionTitle,
        sortOrder: index + 1,
        answer: ques.expectedAns,
        answerTextLength: ques.ansTextLength || 400,
        isRequired: ques.isRequired ? true : false,
        saveAsTemplate: ques?.isDraft ? true : false,
        options: relevantAnswers,
      };
    });

    if (values?.questions?.length === 0) {
      return toast.warning("Please add questions");
    }

    for (const obj of values?.questions || []) {
      if (
        !obj ||
        !obj?.questionType ||
        !obj?.questionTitle ||
        !obj?.expectedAns
      ) {
        toast.warning("Please fill question fields");
        return;
      }
    }

    const payload = {
      id: 0,
      typeId: parseInt(values?.survayType?.value),
      title: values?.survayTitle,
      description: values?.survayDescription,
      businessUnitId: profileData?.buId,
      workplaceGroupId: profileData?.wgId,
      workplaceId: profileData?.wId,
      questions: formattedQuestions,
    };

    const res = await axios.post(`/Questionnaire`, payload);
    cb();
    toast.success(res?.data?.Message || "Created Sucessfully", { toastId: 1 });
  } catch (error) {
    console.log(error);
    toast.warn(error?.response?.data?.Message, { toastId: 1 });
  } finally {
    setLoading(false);
  }
};

export const initDataForEdit = (data) => {
  return {
    survayType: { value: data?.typeId, label: data?.typeName },
    survayTitle: data?.title,
    survayDescription: data?.description,
    questions: data?.questions?.map((question) => ({
      questionType: question?.typeId.toString(),
      questionTitle: question?.title,
      expectedAns: question?.answer,
      ansTextLength: question?.answerTextLength,
      isRequired: question?.isRequired,
      isDraft: false,
      answers: question?.options?.map((option) => ({
        answerDescription: option.optionName,
      })),
    })),
  };
};
