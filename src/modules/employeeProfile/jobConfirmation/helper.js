import axios from "axios";
import AvatarComponent from "../../../common/AvatarComponent";
import { Cell } from "../../../utility/customExcel/createExcelHelper";
import { dateFormatter } from "../../../utility/dateFormatter";

export const getJobConfirmationInfo = async (
  tableName,
  accId,
  busId,
  id,
  fromDate,
  toDate,
  setter,
  setAllData,
  setLoading,
  statusId,
  WorkplaceGroupId,
  srcTxt,
  pages,
  setPages,
  wId
) => {
  setLoading && setLoading(true);

  const status = statusId ? `&intStatusId=${statusId}` : "";
  const search = srcTxt ? `&SearchTxt=${srcTxt}` : "";
  const intId = id ? `&intId=${id}` : "";

  try {
    const res = await axios.get(
      `/Employee/PeopleDeskAllLanding?TableName=${tableName}&AccountId=${accId}&BusinessUnitId=${busId}&WorkplaceGroupId=${WorkplaceGroupId}&PageNo=${pages.current}&PageSize=${pages.pageSize}${intId}${status}&FromDate=${fromDate}&ToDate =${toDate}&WorkplaceId=${wId}${search}`
    );
    if (res?.data) {
      setter && setter(res?.data);
      setAllData && setAllData(res?.data);
      setLoading && setLoading(false);
      setPages({
        ...pages,
        current: pages.current,
        pageSize: pages.pageSize,
        total: res?.data[0]?.totalCount,
      });
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};
export const jobConfirmColumns = (page, paginationSize) => {
  return [
    {
      title: "SL",
      render: (text, record, index) => (page - 1) * paginationSize + index + 1,
      sorter: false,
      filter: false,
      className: "text-center",
      width: 60,
      fixed: "left",
    },
    {
      title: "Employee Id",
      dataIndex: "EmployeeCode",
      sorter: true,
      filter: true,
      width: 120,
      fixed: "left",
    },
    {
      title: "Employee Name",
      dataIndex: "EmployeeName",
      fixed: "left",
      width: 200,
      render: (_, record) => {
        return (
          <div className="d-flex align-items-center">
            <AvatarComponent
              classess=""
              letterCount={1}
              label={record?.EmployeeName}
            />
            <span className="ml-2">{record?.EmployeeName}</span>
          </div>
        );
      },
      sorter: true,
      filter: true,
    },
    {
      title: "Employment Type",
      dataIndex: "strEmploymentType",
      sorter: true,
      filter: true,
      width: 200,
    },
    {
      title: "Department",
      dataIndex: "DepartmentName",
      sorter: true,
      filter: true,
      width: 200,
    },
    {
      title: "Designation",
      dataIndex: "DesignationName",
      sorter: true,
      filter: true,
      width: 200,
    },
    {
      title: "Supervisor Name	",
      dataIndex: "SupervisorName",
      sorter: true,
      filter: true,
      width: 200,
    },
    {
      title: "Joining date",
      dataIndex: "JoiningDate",
      isDate: true,
      width: 100,
      render: (JoiningDate) => {
        return <p>{JoiningDate ? dateFormatter(JoiningDate) : "-"}</p>;
      },
    },
    {
      title: "Service Length",
      dataIndex: "ServiceLength",
      sorter: true,
      filter: true,
      width: 200,
    },
    {
      title: "Confirmation Date	",
      dataIndex: "ConfirmationDate",
      isDate: true,
      width: 100,
      render: (ConfirmationDate) => {
        return (
          <p>{ConfirmationDate ? dateFormatter(ConfirmationDate) : "-"}</p>
        );
      },
    },
    {
      title: "Probation Close Date",
      dataIndex: "dteProbationaryCloseDate",
      isDate: true,
      width: 100,
      render: (dteProbationaryCloseDate) => {
        return (
          <p>
            {dteProbationaryCloseDate
              ? dateFormatter(dteProbationaryCloseDate)
              : "-"}
          </p>
        );
      },
    },
  ];
};

// for excel
export const getTableDataConfirmation = (row, keys) => {
  const data = row?.map((item) => {
    return keys?.map((key) => {
      return new Cell(
        key === "dteProbationaryCloseDate"
          ? dateFormatter(item[key])
          : key === "ConfirmationDate"
          ? dateFormatter(item[key])
          : key === "JoiningDate"
          ? dateFormatter(item[key])
          : item[key],
        "center",
        "text"
      ).getCell();
    });
  });
  return data;
};

// excel columns
export const column = {
  sl: "SL",
  EmployeeCode: "Code",
  EmployeeName: "Employee Name",
  strEmploymentType: "Employment Type",
  DepartmentName: "Department",
  DesignationName: "Designation",
  SupervisorName: "Supervisor",
  JoiningDate: "Joining Date",
  ServiceLength: "Service Length",
  ConfirmationDate: "Confirmation Date",
  dteProbationaryCloseDate: "Probation Close Date",
};
