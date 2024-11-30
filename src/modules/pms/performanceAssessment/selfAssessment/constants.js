export const assessmentTypes = [
  { value: "self", label: "Self", id: 1 },
  { value: "subordinate", label: "Subordinate", id: 2 },
  { value: "colleague", label: "Colleague", id: 3 },
];

export const getAssessmentTypeDDL = () => {
  return assessmentTypes.map((assT) => {
    return {
        value: assT.value,
        label: assT.label
    }
  });
};

export const getAssessmentTypeId = (assessmentType) => {
  console.log("assessmentType", assessmentType)
  return assessmentTypes?.find(
    (ass) => ass?.value?.toLowerCase() === assessmentType
  )?.id;
};
