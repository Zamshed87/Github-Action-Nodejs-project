import { DefaultOptionType } from "antd/lib/select";

export const EmpFilterType = [
  {
    label: "Monthly Basis",
    value: 1,
  },
  {
    label: "Daily Basis",
    value: 2,
  },
];
export const AttendanceType = (intAccountId: number): DefaultOptionType[] => [
  {
    value: 1,
    label: "Present",
    code: "present",
  },
  {
    value: 2,
    label: "Absent",
    code: "absent",
  },
  {
    value: 3,
    label: "Late",
    code: "late",
  },
  ...(intAccountId !== 5
    ? [
        {
          value: 4,
          label: "Changed In/Out Time",
          code: "Changed In/Out Time",
        },
      ]
    : []),
];
