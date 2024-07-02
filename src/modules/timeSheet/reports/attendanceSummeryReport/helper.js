import { Cell } from "utility/customExcel/createExcelHelper";

const renderConditionalColumnData = (fieldName) => (_, record) => {
  if (!record?.StrDepartmantName && !record?.StrWorkplaceName) {
    return (
      <span>
        <b>{record[fieldName]}</b>
      </span>
    );
  } else if (record.StrDepartmantName && !record?.StrWorkplaceName) {
    return <span>{record[fieldName]}</span>;
  }
};

const dynamicExcelTD = (record) => {
  if (!record.StrDepartmantName && record?.StrWorkplaceName) {
    return record.StrWorkplaceName;
  } else if (!record?.StrDepartmantName && !record?.StrWorkplaceName) {
    return "Sub Total: ";
  } else if (record.StrDepartmantName) {
    return record.StrDepartmantName;
  } else return " ";
};
const conditionalTD = (record, fieldName) => {
  if (
    (!record?.StrDepartmantName && !record?.StrWorkplaceName) ||
    (record.StrDepartmantName && !record?.StrWorkplaceName)
  ) {
    return record[fieldName];
  } else return "-";
};

export const summaryHeaders = () => {
  return [
    {
      title: "Concern",
      dataIndex: "strWorkplace",
      render: (text, record) => {
        if (!record?.strWorkplace) {
          return (
            <span>
              <b>Total: </b>
            </span>
          );
        } else {
          return <span>{record.strWorkplace}</span>;
        }
      },
    },
    {
      title: "Total Emp",
      dataIndex: "TotapEmp",
    },
    {
      title: "Present",
      dataIndex: "IntPresent",
    },
    {
      title: "Absent",
      dataIndex: "IntAbsent",
    },
    {
      title: "Abs (%)",
      dataIndex: "IntAbsentPercentage",
      render: (text, record) => {
        if (!record?.strWorkplace) {
          return (
            <span>
              {parseInt((record?.IntAbsent / record?.TotapEmp) * 100) || 0}
            </span>
          );
        } else {
          return <span>{record.IntAbsentPercentage}</span>;
        }
      },
    },
  ];
};
export const calculateSummaryObj = (arryOfData) => {
  // ( ab / toEmp ) * 100
  const object = arryOfData.reduce(
    (acc, currObj) => {
      acc.TotapEmp += +currObj.TotapEmp;
      acc.IntPresent += +currObj.IntPresent;
      acc.IntAbsent += +currObj.IntAbsent;
      return acc;
    },
    {
      strWorkplace: "",
      total: "Total",
      TotapEmp: 0,
      IntPresent: 0,
      IntAbsent: 0,
      IntAbsentPercentage: 0,
    }
  );
  return object;
};

export const attendanceSummaryReportColumn = [
  {
    title: "Department",
    dataIndex: "StrDepartmantName",
    render: (text, record) => {
      if (!record.StrDepartmantName && record?.StrWorkplaceName) {
        return (
          <span>
            <b>{record.StrWorkplaceName}</b>
          </span>
        );
      } else if (!record?.StrDepartmantName && !record?.StrWorkplaceName) {
        return (
          <span>
            <b>Sub Total: </b>
          </span>
        );
      } else if (record.StrDepartmantName) {
        return <span>{record.StrDepartmantName}</span>;
      }
    },
  },
  {
    title: "Total Emp",
    dataIndex: "IntTotalEmp",
    render: renderConditionalColumnData("IntTotalEmp"),
  },
  {
    title: "Leave",
    dataIndex: "IntLeave",
    render: renderConditionalColumnData("IntLeave"),
  },
  {
    title: "Holiday",
    dataIndex: "IntHoliday",
    render: renderConditionalColumnData("IntHoliday"),
  },
  {
    title: "Weekend",
    dataIndex: "IntWeekend",
    render: renderConditionalColumnData("IntWeekend"),
  },
  {
    title: "Absent",
    dataIndex: "IntAbsent",
    render: renderConditionalColumnData("IntAbsent"),
  },
  {
    title: "Present",
    dataIndex: "IntPresent",
    render: renderConditionalColumnData("IntPresent"),
  },
  {
    title: "Present (%)",
    dataIndex: "NumPresentPercentage",
    render: renderConditionalColumnData("NumPresentPercentage"),
  },
  {
    title: "Absent (%)",
    dataIndex: "NumAbsentPercentage",
    render: renderConditionalColumnData("NumAbsentPercentage"),
  },
];

export const excelHeadAttandanceSummaryDataForExcel = {
  StrDepartmantName: "Department",
  IntTotalEmp: "Total Employee",
  IntLeave: "Leave",
  IntHoliday: "Holiday",
  IntWeekend: "Weekend",
  IntAbsent: "Absent",
  IntPresent: "Present",
  NumPresentPercentage: "Present (%)",
  NumAbsentPercentage: "Absent (%)",
};
export const generateAttandanceSummaryDataForExcel = (arryData) => {
  return arryData?.map((item) => {
    return [
      new Cell(
        dynamicExcelTD(item),
        "center",
        "text",
        (!item.StrDepartmantName && item?.StrWorkplaceName) ||
        (!item?.StrDepartmantName && !item?.StrWorkplaceName)
          ? true
          : false,
        (!item.StrDepartmantName && item?.StrWorkplaceName) ||
        (!item?.StrDepartmantName && !item?.StrWorkplaceName)
          ? 11
          : 9
      ).getCell(),
      new Cell(
        conditionalTD(item, "IntTotalEmp") || 0,
        "center",
        "text"
      ).getCell(),
      new Cell(
        conditionalTD(item, "IntLeave") || 0,
        "center",
        "text"
      ).getCell(),
      new Cell(
        conditionalTD(item, "IntHoliday") || 0,
        "center",
        "text"
      ).getCell(),
      new Cell(
        conditionalTD(item, "IntWeekend") || 0,
        "center",
        "text"
      ).getCell(),
      new Cell(
        conditionalTD(item, "IntAbsent") || 0,
        "center",
        "text"
      ).getCell(),
      new Cell(
        conditionalTD(item, "IntPresent") || 0,
        "center",
        "text"
      ).getCell(),
      new Cell(
        conditionalTD(item, "NumPresentPercentage") || 0,
        "center",
        "text"
      ).getCell(),
      new Cell(
        conditionalTD(item, "NumAbsentPercentage") || 0,
        "center",
        "text"
      ).getCell(),
    ];
  });
};

export const generateSubTableDataForExcel = (arryData = []) => {
  const lastObject = calculateSummaryObj(arryData);

  const res = arryData
    ?.concat(lastObject)
    .map((item) => [
      new Cell(
        !item?.strWorkplace ? "Total: " : item?.strWorkplace,
        "center",
        "text",
        !item?.strWorkplace ? true : false,
        !item?.strWorkplace ? 11 : 9
      ).getCell(),
      new Cell(
        item?.TotapEmp,
        "center",
        "text",
        !item?.strWorkplace ? true : false,
        !item?.strWorkplace ? 11 : 9
      ).getCell(),
      new Cell(
        item?.IntPresent,
        "center",
        "text",
        !item?.strWorkplace ? true : false,
        !item?.strWorkplace ? 11 : 9
      ).getCell(),
      new Cell(
        item?.IntAbsent,
        "center",
        "text",
        !item?.strWorkplace ? true : false,
        !item?.strWorkplace ? 11 : 9
      ).getCell(),
      new Cell(
        !item?.strWorkplace ? parseInt((item?.IntAbsent / item?.TotapEmp) * 100) || 0 : item?.IntAbsentPercentage,
        "center",
        "text",
        !item?.strWorkplace ? true : false,
        !item?.strWorkplace ? 11 : 9
      ).getCell(),
    ]);
  return res;
};
