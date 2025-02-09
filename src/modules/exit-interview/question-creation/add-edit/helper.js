/*
 * Title: Exit interview functions
 * Author: Khurshida Meem
 * Date: 18-11-2024
 *
 */

import axios from "axios";
import { toast } from "react-toastify";

export const saveQuestionnaire = async (
  quesId,
  values,
  profileData,
  setLoading,
  cb
) => {
  setLoading(true);
  try {
    const formattedQuestions = values?.questions?.map((ques, index) => {
      const relevantAnswers = ques?.answers
        ? ques?.answers.map((answer, idx) => ({
            optionName: answer?.answerDescription,
            sortOrder: idx + 1,
          }))
        : [];

      return {
        typeId: parseInt(ques?.questionType),
        title: ques?.questionTitle,
        sortOrder: index + 1,
        answer: ques?.expectedAns,
        answerTextLength: ques?.ansTextLength || 400,
        isRequired: ques?.isRequired ? true : false,
        saveAsTemplate: ques?.isDraft ? true : false,
        options: ["0", "1", "2"].includes(ques?.questionType)
          ? relevantAnswers
          : [],
      };
    });

    if (values?.questions?.length === 0) {
      return toast.warning("Please add questions");
    }

    for (const obj of values?.questions || []) {
      if (
        !obj ||
        !obj?.questionType ||
        !obj?.questionTitle
        // || !obj?.expectedAns
      ) {
        toast.warning("Please fill question fields");
        return;
      }
      if (
        (obj?.questionType === "0" ||
          obj?.questionType === "1" ||
          obj?.questionType === "2") &&
        (!obj?.answers || obj?.answers?.length === 0)
      ) {
        toast.warning("Please add answers");
        return;
      }
      if (
        (obj?.questionType === "3" || obj?.questionType === "4") &&
        !obj?.ansTextLength
      ) {
        toast.warning("Please add text length");
        return;
      }
      if (
        (obj?.questionType === "0" ||
          obj?.questionType === "1" ||
          obj?.questionType === "2") &&
        (obj?.answers || obj?.answers?.length > 0)
      ) {
        for (const ans of obj?.answers) {
          if (!ans || !ans.answerDescription) {
            toast.warning("Please add answer");
            return;
          }
        }
      }
    }

    const payload = {
      id: quesId || 0,
      typeId: parseInt(values?.survayType?.value),
      title: values?.survayTitle,
      description: values?.survayDescription,
      businessUnitId: profileData?.buId,
      workplaceGroupId: profileData?.wgId,
      workplaceId: profileData?.wId,
      questions: formattedQuestions,
    };

    const method = quesId ? axios.put : axios.post;

    const res = await method(`/Questionnaire`, payload);
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
