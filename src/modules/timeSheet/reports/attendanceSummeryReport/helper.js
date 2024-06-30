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
