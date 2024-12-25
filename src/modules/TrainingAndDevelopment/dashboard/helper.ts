import { getSerial } from "Utils";
import { formatDate } from "../requisition/helper";

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
  str += `&departmentIds=${data?.department?.value}`;
  str += `&designationIds=${data?.designation?.value || 0}`;

  // Add repeated parameters for training types
  if (data?.trainingType?.length) {
    data.trainingType.forEach((item: any) => {
      str += `&TrainingTypeIds=${item?.value}`;
    });
  }

  // Add repeated parameters for trainers
  if (data?.nameofTrainerOrganization?.length) {
    data.nameofTrainerOrganization.forEach((item: any) => {
      str += `&TrainerIds=${item?.value}`;
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
    title: "Total Cost (BDT)",
    dataIndex: "totalCost",
    key: "totalCost",
    width: 10,
  },
];

export const tableColumns4 = [
  {
    title: "Cost Per Participant (BDT)",
    dataIndex: "costPerParticipant",
    key: "costPerParticipant",
    width: 10,
  },
];

export const upcommingTableheader: any = [
  {
    title: "SL",
    render: (_: any, rec: any, index: number) =>
      getSerial({
        // currentPage: landingApi?.data?.currentPage,
        // pageSize: landingApi?.data?.pageSize,
        currentPage: 1,
        pageSize: 1000, // need to change
        index,
      }),
    fixed: "left",
    align: "center",
    width: 40,
  },
  {
    title: "Organization",
    dataIndex: "organizationName",
    filter: true,
    filterKey: "organizationList",
    filterSearch: true,
    width: 150,
    fixed: "left",
  },
  {
    title: "Training Date",
    dataIndex: "trainingDate",
    filter: true,
    filterKey: "trainingDateList",
    filterSearch: true,
    width: 150,
    fixed: "left",
  },
  {
    title: "Training Type",
    dataIndex: "trainingTypeName",
    filter: true,
    filterKey: "trainingTypeList",
    filterSearch: true,
    width: 150,
    fixed: "left",
  },
  {
    title: "Training Title",
    dataIndex: "trainingTitleName",
    filter: true,
    filterKey: "trainingTitleList",
    filterSearch: true,
    width: 150,
    fixed: "left",
  },
  {
    title: "Training Organizer",
    dataIndex: "trainingOrganizerName",
    filter: true,
    filterKey: "trainingOrganizerList",
    filterSearch: true,
    width: 150,
  },
  {
    title: "Training Venue",
    dataIndex: "trainingVenue",
    filter: true,
    filterKey: "trainingVenueList",
    filterSearch: true,
    width: 150,
  },
  {
    title: "Training Mode",
    dataIndex: "trainingMode",
    width: 100,
    render: (_: any, rec: any) => rec?.trainingModeStatus?.label,
  },
  {
    title: "Training Duration",
    dataIndex: "trainingDuration",
    filter: true,
    filterKey: "trainingDurationList",
    filterSearch: true,
    width: 150,
  },
  {
    title: "Total Participants",
    dataIndex: "totalParticipants",
    filter: true,
    filterKey: "totalParticipantsList",
    filterSearch: true,
    width: 150,
  },
  {
    title: "Trainer Details",
    dataIndex: "trainerDetails",
    filter: true,
    filterKey: "trainerDetailsList",
    filterSearch: true,
    width: 150,
  },
];
