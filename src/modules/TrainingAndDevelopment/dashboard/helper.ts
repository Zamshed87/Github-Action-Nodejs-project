import { getSerial } from "Utils";
import { formatDate } from "../requisition/helper";
import { dateFormatter } from "utility/dateFormatter";

const createPieConfig = (data: any, angleField: string) => {
  return {
    data: data,
    angleField: angleField,
    colorField: "name",
    label: {
      type: "inner",
      content: "{value}",
    },
    legend: false || undefined,
    interactions: [
      {
        type: "element-active",
      },
    ],
  };
};

export const createLineConfig = (data: any) => {
  return {
    data: data,
    xField: "month",
    yField: "numberOfTrainings",
    smooth: false,
    color: "#ff4d4f",
  };
};

// Usage
export const pieConfigNoOfTraining = (data: any) =>
  createPieConfig(data, "noOfTraining");
export const pieConfigParticipants = (data: any) =>
  createPieConfig(data, "numberOfParticipants");
export const pieConfigTotalCost = (data: any) =>
  createPieConfig(data, "totalCost");
export const pieConfigCostPerParticipants = (data: any) =>
  createPieConfig(data, "costPerParticipant");

export const formateFilterData = (data: any) => {
  let str = "?";

  // Add single value parameters
  str += `fromDate=${formatDate(data?.fromDate)}`;
  str += `&toDate=${formatDate(data?.toDate)}`;
  str += `&businessUnitIds=${data?.bUnit?.value}`;
  str += `&workplaceGroupIds=${data?.workplaceGroup?.value}`;
  str += `&workplaceIds=${data?.workplace?.value}`;

  if (data?.department?.length) {
    data?.department.forEach((item: any) => {
      str += `&departmentIds=${item}`;
    });
  }

  if (data?.hrPosition?.length) {
    data?.hrPosition.forEach((item: any) => {
      str += `&designationIds=${item}`;
    });
  }

  // Add repeated parameters for training types
  if (data?.trainingType?.length) {
    data.trainingType.forEach((item: any) => {
      str += `&TrainingTypeIds=${item}`;
    });
  }

  // Add repeated parameters for trainers
  if (data?.nameofTrainerOrganization?.length) {
    data.nameofTrainerOrganization.forEach((item: any) => {
      str += `&TrainerIds=${item}`;
    });
  }

  return str;
};

export const getRandomGradient = () => {
  const colors = [
    "#ff7e5f",
    "#feb47b",
    "#4facfe",
    "#00f2fe",
    "#a18cd1",
    "#fbc2eb",
    "#fad0c4",
    "#ff9a9e",
    "#ff6a88",
    "#c471ed",
  ];

  const randomColor1 = colors[Math.floor(Math.random() * colors.length)];
  const randomColor2 = colors[Math.floor(Math.random() * colors.length)];
  return `linear-gradient(135deg, ${randomColor1}, ${randomColor2})`;
};

export const tableColumns = [
  { title: "Training Mode", dataIndex: "name", key: "name", width: 40 },
  {
    title: "No. of Training",
    dataIndex: "noOfTraining",
    key: "noOfTraining",
    width: 30,
  },
];

export const tableColumns2 = [
  {
    title: "Participant",
    dataIndex: "numberOfParticipants",
    key: "numberOfParticipants",
    width: 10,
  },
];

export const tableColumns3 = [
  {
    title: "Total Cost",
    dataIndex: "totalCost",
    key: "totalCost",
    width: 10,
  },
];

export const tableColumns4 = [
  {
    title: "Cost Per Participant",
    dataIndex: "costPerParticipant",
    key: "costPerParticipant",
    width: 10,
  },
];

export const createTrainingModes = (options: any[]): any[] => {
  return options.map((option) => ({
    name: option.label,
    noOfTraining: 0,
    numberOfParticipants: 0,
    costPerParticipant: 0,
    totalCost: 0,
  }));
};
