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
    const question = values?.questions?.map((ques, index) => {
      const relevantAnswers = values?.answers
        .filter((answer) => answer.queId === ques.id)
        .map((item, index) => {
          return {
            sortOrder: index + 1,
            optionName: item?.answerDescription,
          };
        });
      return {
        typeId: parseInt(ques?.questionType),
        title: ques?.questionTitle,
        sortOrder: index + 1,
        answer: ques?.expectedAns,
        answerTextLength: ques?.ansTextLength || 4000,
        isRequired: ques?.isRequired,
        saveAsTemplate: ques?.isDraft,
        options: relevantAnswers || [],
      };
    });

    const payload = {
      id: 0,
      typeId: parseInt(values?.survayType?.value),
      title: values?.survayTitle,
      description: values?.survayDescription,
      businessUnitId: profileData?.buId,
      workplaceGroupId: profileData?.wgId,
      workplaceId: profileData?.wId,
      questions: question,
    };

    const res = await axios.post(`/Questionnaire`, payload);
    cb();
    toast.success(res?.data?.Message || "Created Sucessfully", { toastId: 1 });
  } catch (error) {
    toast.warn(error?.response?.data?.Message, { toastId: 1 });
  } finally {
    setLoading(false);
  }
};
