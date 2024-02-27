import { FormInstance } from "antd";
import { debounce } from "lodash";
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
  {
    value: 4,
    label: "Calendar Name",
  },
];

export const otDependsOn = [
  { value: 1, label: "Basic" },
  { value: 2, label: "Gross" },
  { value: 3, label: "Fixed Amount" },
];

export const otCountFrom = [
  { value: 1, label: "Assign Calendar" },
  {
    value: 2,
    label: "OT Start Delay (Minutes)",
  },
];
export const OTCountFrom = [
  { value: 1, label: "At Actual" },
  {
    value: 2,
    label: "Round Down",
  },
  {
    value: 3,
    label: "Round Up",
  },
];
// Payload Generation for SaveNUpdateOverTimeConfig => Line 16 - 111
type TOTPolicyGenerate = {
  values: any;
  commonData: any;
  matchingData: any;
  state: any;
};
export const OTPolicyGenerate = ({
  commonData,
  values,
}: // matchingData,
TOTPolicyGenerate) => {
  const {
    policyType,
    hrPosition,
    employmentType,
    calendarName,
    intOtconfigId,
    fromSalary,
    toSalary,
  } = values;
  const policyConditions = [
    { condition: hrPosition?.length > 0, value: 1, label: "HR Position" },
    {
      condition: employmentType?.length > 0,
      value: 2,
      label: "Employment Type",
    },
    { condition: calendarName?.length > 0, value: 4, label: "Calendar Name" },
    { condition: fromSalary && toSalary, value: 3, label: "Salary Range" },
  ];

  const policy = policyConditions
    .filter((condition) => condition.condition)
    .map(({ value, label }) => ({ value, label }));
  // console.log({ policy });

  const policyInfo = {
    intOtconfigId: intOtconfigId || 0,
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
    isOvertimeAutoCalculate: values?.isOvertimeAutoCalculate || false,
    intDevidedWorkingDays: values?.workingDays || 0,
    numFixedAmount: values?.fixedAmount || 0,
    numFromSalary: values?.fromSalary || 0,
    numToSalary: values?.toSalary || 0,
    strPolicyName: values?.policyName,
    numDevidedFixedHours: values?.fixedBenefitHours || 0,
    isCalendarTimeHours: values?.benefitHours === 1,
    // isHolidayCountAsFullDayOt: values?.count === 1 ? true : false,
    // isOffdayCountAsFullDayOt: values?.count === 2 ? true : false,
    isHolidayCountAsFullDayOt: values?.isHolidayCountAsFullDayOt ? true : false,
    isOffdayCountAsFullDayOt: values?.isOffdayCountAsFullDayOt ? true : false,
    intCalenderId: 0,
    intOTHourShouldBeAboveInMin: values?.intOTHourShouldBeAboveInMin || 0,
    // numOTRateForBasedOnSalaryRange: values?.otRatePerMin || 0,
    numOTRateForBasedOnSalaryRange: Math.round((values?.otRatePerMin || 0) * 60), // convert hours to min (user input as hours but we need to save as min)
  };
  const payload: any = generateRows(
    policy, // policyType
    hrPosition,
    employmentType,
    calendarName,
    intOtconfigId,
    {
      commonData,
      policyInfo,
    }
  );
  return payload;
};

type Option = { label: string; value: number };
function generateRows(
  policyType: Option[],
  hrPosition: Option[],
  employmentType: Option[],
  calendarName: Option[],
  intOtconfigId: any,
  common: { commonData: any; policyInfo: any }
): Option[][] {
  const { commonData, policyInfo } = common;

  const rows: Option[][] = [];

  const policyLabels = policyType.map((pt) => pt.label);
  if (
    policyLabels.includes("HR Position") &&
    policyLabels.includes("Employment Type") &&
    policyLabels.includes("Calendar Name")
  ) {
    for (const hr of hrPosition) {
      for (const emp of employmentType) {
        for (const cl of calendarName) {
          rows.push({
            ...commonData,
            ...policyInfo,
            intEmploymentTypeId: emp?.value,
            intHrPositionId: hr?.value,
            intCalenderId: cl?.value,
          });
        }
      }
    }
  } else if (
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
          // intOtconfigId: 0,
        });
      }
    }
  } else if (
    policyLabels.includes("HR Position") &&
    policyLabels.includes("Calendar Name")
  ) {
    for (const hr of hrPosition) {
      for (const cl of calendarName) {
        rows.push({
          ...commonData,
          ...policyInfo,
          intCalenderId: cl?.value,
          intHrPositionId: hr?.value,
          // intOtconfigId: 0,
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
        // intOtconfigId: 0,
      });
    }
  } else if (policyLabels.includes("Employment Type")) {
    for (const emp of employmentType) {
      rows.push({
        ...commonData,
        ...policyInfo,
        intEmploymentTypeId: emp?.value,
        intHrPositionId: 0,
        intOtconfigId: intOtconfigId || 0,
      });
    }
  } else if (policyLabels.includes("Calendar Name")) {
    for (const emp of calendarName) {
      rows.push({
        ...commonData,
        ...policyInfo,
        intCalenderId: emp?.value,
        intHrPositionId: 0,
        intOtconfigId: intOtconfigId || 0,
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

// Checking policy existance
export const checkPolicyExistance = debounce(
  async (form: FormInstance, allData: any, setMatchingData: any) => {
    const values = form.getFieldsValue();
    const matchingPolicy = await getMatchingPolicy(values, allData);
    setMatchingData(matchingPolicy);
  },
  100
);

const getMatchingPolicy = (values: any, allData: any) => {
  return new Promise((resolve) => {
    const { workplace, hrPosition, employmentType, fromSalary, toSalary } =
      values;

    // If hrPosition, employmentType, fromSalary, and toSalary have no value, return an empty array
    if (
      // !workplace &&
      (!hrPosition || hrPosition.length === 0) &&
      (!employmentType || employmentType.length === 0) &&
      (fromSalary === null || fromSalary === undefined) &&
      (toSalary === null || toSalary === undefined)
    ) {
      resolve([]);
    }

    const matchingPolicy: any = [];
    allData?.forEach((policy: any) => {
      let isMatch = true;
      if (workplace?.value) {
        isMatch = isMatch && policy.intWorkplaceId === workplace?.value;
      }
      if (hrPosition?.length) {
        isMatch =
          isMatch &&
          hrPosition.some((pos: any) => pos.value === policy.intHrPositionId);
      }
      if (employmentType?.length) {
        isMatch =
          isMatch &&
          employmentType.some(
            (type: any) => type.value === policy.intEmploymentTypeId
          );
      }
      if (fromSalary && toSalary) {
        if (
          (policy.numFromSalary <= fromSalary &&
            policy.numToSalary >= fromSalary) ||
          (policy.numFromSalary <= toSalary && policy.numToSalary >= toSalary)
        ) {
          isMatch = isMatch && true;
        } else {
          isMatch = false;
        }
      }
      if (isMatch) {
        matchingPolicy.push(policy);
      }
    });

    resolve(matchingPolicy);
  });
};

// OT Policy Initial Data Generate by GetOverTimeConfigById
export const initDataGenerate = (data: any) => {
  const policyTypeInfo: any = [];

  if (data?.intHrPositionId) {
    policyTypeInfo.push({
      value: 1,
      label: "HR Position",
    });
  }
  if (data?.intEmploymentTypeId) {
    policyTypeInfo.push({
      value: 2,
      label: "Employment Type",
    });
  }
  if (data?.numFromSalary && data?.numToSalary) {
    policyTypeInfo.push({
      value: 3,
      label: "Salary Range",
    });
  }
  if (data?.intCalenderId) {
    policyTypeInfo.push({
      value: 4,
      label: "Calendar Name",
    });
  }
  const formData = {
    policyType: policyTypeInfo,
    policyName: data?.strPolicyName,
    workplace: data?.intWorkplaceId && {
      value: data?.intWorkplaceId,
      label: data?.strWorkplaceName,
    },
    hrPosition: data?.intHrPositionId && [
      {
        value: data?.intHrPositionId,
        label: data?.strHrPositionName,
      },
    ],
    employmentType: data?.intEmploymentTypeId && [
      {
        value: data?.intEmploymentTypeId,
        label: data?.employmentType,
      },
    ],
    calendarName: data?.intCalenderId ? [
      {
        value: data?.intCalenderId,
        label: data?.strCalenderName,
      },
    ] : undefined,
    fromSalary: data?.numFromSalary,
    toSalary: data?.numToSalary,
    overtimeDependsOn: otDependsOn?.find(
      (ot) => ot.value === data?.intOtdependOn
    )?.value,
    fixedAmount: data?.numFixedAmount,

    overtimeCountFrom: data?.intOverTimeCountFrom ? 2 : 1,
    otStartDelay: data?.intOverTimeCountFrom,

    benefitHours: data?.isCalendarTimeHours ? 1 : 2,
    fixedBenefitHours: data?.numDevidedFixedHours,
    workingDays: data?.intDevidedWorkingDays,
    benifitPercentageWorkingDays: data?.intOtbenefitsPercentWorkingDay,
    benifitPercentageHoliDays: data?.intOtbenefitsPercentHoliday,
    benifitPercentageOffDays: data?.intOtbenefitsPercentOffday,
    maxOverTimeDaily: data?.intMaxOverTimeDaily,
    maxOverTimeMonthly: data?.intMaxOverTimeMonthly,
    overtimeCount: data?.intOtcalculationShouldBe,
    overtimeAmount: OTCountFrom?.find(
      (ot) => ot.value === data?.intOtAmountShouldBe
    )?.value,
    calculateAutoAttendance: data?.isOvertimeAutoCalculate,
    intOTHourShouldBeAboveInMin: data?.intOTHourShouldBeAboveInMin,
    intOtconfigId: data?.intOtconfigId,
    isOvertimeAutoCalculate: data?.isOvertimeAutoCalculate,
    isHolidayCountAsFullDayOt: data?.isHolidayCountAsFullDayOt,
    isOffdayCountAsFullDayOt: data?.isOffdayCountAsFullDayOt,
    count:
      data?.isHolidayCountAsFullDayOt === true
        ? 1
        : data?.isOffdayCountAsFullDayOt === 2
        ? true
        : 2,
    otRatePerMin: Math.round((data?.numOTRateForBasedOnSalaryRange ?? 0) / 60),
  };
  return formData;
};
