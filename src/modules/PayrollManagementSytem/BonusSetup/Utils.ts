export const serviceLengthTypeList = [
  {
    label: "Day",
    value: 1,
  },
  {
    label: "Month",
    value: 2,
  },
];

export const bounusDependsOnList = [
  { value: 1, label: "Gross" },
  { value: 2, label: "Basic" },
];

export const payloadGenerate = (values: any, wgId: number, wgName: string) => {
  const data = {
    intBonusSetupId: 0,
    strPartName: "BonusSetupCreate",
    intBonusId: values?.bonusName?.value,
    strBonusName: values?.bonusName?.label,
    strBonusDescription: "",

    intReligion: values?.religion?.value,
    strReligionName: values?.religion?.label,
    isServiceLengthInDays: values?.serviceLengthType?.value === 1,
    workPlaceId: values?.workplace?.value,
    workPlaceName: values?.workplace?.label,
    workPlaceGroupId: wgId,
    workPlaceGroupName: wgName,
    employmentTypeList: values?.employmentType?.map((type: any) => ({
      intEmploymentTypeId: type?.value,
      strEmploymentType: type?.label,
    })),
    intMinimumServiceLengthMonth: values?.minServiceLengthMonth || 0,
    intMaximumServiceLengthMonth: values?.maxServiceLengthMonth || 0,
    intMinimumServiceLengthDays: values?.minServiceLengthDay || 0,
    intMaximumServiceLengthDays: values?.maxServiceLengthDay || 0,
    strBonusPercentageOn:
      values?.bounsDependOn?.value === 1 ? "Gross" : "Basic",
    numBonusPercentage: values?.bonusPercentage || 0,
    hrPositionId: values?.hrPosition?.value || 0,
    hrPositionName: values?.hrPosition?.label || "",
    isDividedbyServiceLength: values?.isDividedByLength || false
  };
  return data;
};
