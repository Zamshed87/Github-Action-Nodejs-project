export const saveQuestionnaire = (values, cb) => {
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
      typeId: ques?.questionType,
      title: ques?.questionTitle,
      sortOrder: index + 1,
      answer: ques?.expectedAns,
      answerTextLength: ques?.ansTextLength || 0,
      isRequired: ques?.isRequired,
      saveAsTemplate: ques?.isDraft,
      options: relevantAnswers || [],
    };
  });

  const payload = {
    id: 0,
    typeId: values?.survayType?.value,
    title: values?.survayTitle,
    description: values?.survayDescription,
    businessUnitId: values?.buDDL?.value,
    workplaceGroupId: values?.wgDDL?.value,
    workplaceId: values?.wDDL?.value,
    questions: question,
  };

  console.log(payload);
  //   cb();
};
