export const policyType = [
  {
    value: 1,
    label: "HR Position",
  },
  {
    value: 2,
    label: "Employment Type",
  },
  {
    value: 3,
    label: "Salary Range",
  },
];

type TOTPolicyGenerate = {
  values: any;
  commonData: any;
};
export const OTPolicyGenerate = ({ commonData, values }: TOTPolicyGenerate) => {
  const { policyType, hrPosition, employmentType } = values;

  const policyInfo = {
    intMaxOverTimeDaily: values?.maxOverTimeDaily || 0,
    intMaxOverTimeMonthly: values?.maxOverTimeMonthly || 0,
    intOtAmountShouldBe: values?.overtimeAmount,
    intOtbenefitsPercentHoliday: values?.benifitPercentageHoliDays || 0,
    intOtbenefitsPercentOffday: values?.benifitPercentageOffDays || 0,
    intOtbenefitsPercentWorkingDay: values?.benifitPercentageWorkingDays || 0,
    intOtcalculationShouldBe: values?.overtimeCount,
    intOtdependOn: values?.overtimeDependsOn,
    intOverTimeCountFrom: values?.otStartDelay || 0,
    intWorkplaceId: values?.workplace?.value,
    isOvertimeAutoCalculate: values?.calculateAutoAttendance || false,
    intDevidedWorkingDays: values?.workingDays || 0,
    numFixedAmount: values?.fixedAmount || 0,
    numFromSalary: values?.fromSalary || 0,
    numToSalary: values?.toSalary || 0,
    strPolicyName: values?.policyName,
    numDevidedFixedHours: values?.fixedBenefitHours || 0,
    isCalendarTimeHours: values?.benefitHours === 1,
  };
  const payload: any = generateRows(policyType, hrPosition, employmentType, {
    commonData,
    policyInfo,
  });

  return payload;
};

type Option = { label: string; value: number };

function generateRows(
  policyType: Option[],
  hrPosition: Option[],
  employmentType: Option[],
  common: { commonData: any; policyInfo: any }
): Option[][] {
  const { commonData, policyInfo } = common;

  const rows: Option[][] = [];

  const policyLabels = policyType.map((pt) => pt.label);

  if (
    policyLabels.includes("HR Position") &&
    policyLabels.includes("Employment Type")
  ) {
    for (const hr of hrPosition) {
      for (const emp of employmentType) {
        rows.push({
          ...commonData,
          ...policyInfo,
          intEmploymentTypeId: emp?.value,
          intHrPositionId: hr?.value,
          intOtconfigId: 0,
        });
      }
    }
  } else if (policyLabels.includes("HR Position")) {
    for (const hr of hrPosition) {
      rows.push({
        ...commonData,
        ...policyInfo,
        intEmploymentTypeId: 0,
        intHrPositionId: hr?.value,
        intOtconfigId: 0,
      });
    }
  } else if (policyLabels.includes("Employment Type")) {
    for (const emp of employmentType) {
      rows.push({
        ...commonData,
        ...policyInfo,
        intEmploymentTypeId: emp?.value,
        intHrPositionId: 0,
        intOtconfigId: 0,
      });
    }
  } else {
    rows.push({
      ...commonData,
      ...policyInfo,
      intEmploymentTypeId: 0,
      intHrPositionId: 0,
      intOtconfigId: 0,
    });
  }

  return rows;
}
