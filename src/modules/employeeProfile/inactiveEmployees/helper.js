import axios from "axios";
import { toast } from "react-toastify";
import AvatarComponent from "../../../common/AvatarComponent";
import Chips from "../../../common/Chips";
import { dateFormatter } from "../../../utility/dateFormatter";
import { GroupAddOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Cell } from "../../../utility/customExcel/createExcelHelper";

export const getBuDetails = async (buId, setter, setLoading) => {
  try {
    const res = await axios.get(
      `/SaasMasterData/GetBusinessDetailsByBusinessUnitId?businessUnitId=${buId}`
    );
    if (res?.data) {
      setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
    setter([]);
  }
};

export const getInactiveEmployeesInfo = async (
  tableName,
  accId,
  busId,
  id,
  setter,
  setAllData,
  setLoading,
  statusId,
  fromDate,
  toDate,
  WorkplaceGroupId,
  srcTxt,
  pages,
  setPages
) => {
  setLoading && setLoading(true);
  let search = srcTxt ? `&SearchTxt=${srcTxt}` : "";
  let status = statusId ? `&intStatusId=${statusId}` : "";
  let intId = id ? `&intId=${id}` : "";
  const filterDate = `fromDate=${fromDate}&toDate=${toDate}`;
  try {
    const res = await axios.get(
      `/Employee/PeopleDeskAllLanding?TableName=${tableName}&AccountId=${accId}&BusinessUnitId=${busId}&WorkplaceGroupId=${WorkplaceGroupId}&PageNo=${pages.current}&PageSize=${pages.pageSize}${intId}&${filterDate}${status}${search}`
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

export const activeInactiveEmployee = async (values, setLoading, cb) => {
  try {
    setLoading(true);
    let res = await axios.post(
      `/Employee/ActiveORInactiveEmployeeBasicInfo?accountId=${values?.intAccountId}&employeeId=${values?.EmployeeId}`
    );
    setLoading(false);
    cb && cb();
    toast.success(res?.data?.message);
  } catch (error) {
    setLoading(false);
    toast.warn(error?.response?.data?.message);
  }
};

export const activeEmployeeHandler = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    let res = await axios.post(
      `/Employee/PostAcitveCurrentInactiveEmployee`,
      payload
    );
    setLoading && setLoading(false);
    cb && cb();
    toast.success(res?.data?.message);
  } catch (error) {
    setLoading && setLoading(false);
    toast.warn(error?.response?.data?.message);
  }
};

export const inactiveEmpColumns = (
  page,
  paginationSize,
  activeUserHandler,
  values
) => {
  return [
    {
      title: "SL",
      render: (_, record, idx) => (page - 1) * paginationSize + idx + 1,
      className: "text-center",
    },
    {
      title: "Code",
      dataIndex: "EmployeeCode",
      sorter: true,
      filter: true,
      width: 100,
    },
    {
      title: "Employee Name",
      dataIndex: "EmployeeName",
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
      title: "Designation",
      dataIndex: "DesignationName",
      sorter: true,
      filter: true,
    },
    {
      title: "Department",
      dataIndex: "DepartmentName",
      sorter: true,
      filter: true,
    },
    {
      title: "Joining Date",
      dataIndex: "dteJoiningDate",
      isDate: true,
      render: (dteJoiningDate) => dateFormatter(dteJoiningDate),
    },
    {
      title: "Service Length",
      dataIndex: "serviceLength",
      key: "serviceLength",
      sorter: true,
      filter: true,
    },
    {
      title: "Status",
      dataIndex: "strEmployeeStatus",
      key: "strEmployeeStatus",
      sorter: true,
      filter: true,
      width: "150px",
      render: (_, item) => {
        return (
          <div className="d-flex align-items-center justify-content-center">
            <div>
              {item?.strEmployeeStatus === "Inactive" && (
                <Chips label={item?.strEmployeeStatus} classess="danger" />
              )}
            </div>

            <Tooltip title="Active" arrow>
              <button
                type="button"
                className="iconButton mt-0 mt-md-2 mt-lg-0 ml-2"
                onClick={(e) => {
                  e.stopPropagation();
                  activeUserHandler(item, values);
                }}
              >
                <GroupAddOutlined />
              </button>
            </Tooltip>
          </div>
        );
      },
    },
  ];
};

// for excel
export const getTableDataInactiveEmployees = (row, keys, totalKey) => {
  const data = row?.map((item, index) => {
    return keys?.map((key) => {
      return new Cell(
        key === "dteJoiningDate" ? dateFormatter(item[key]) : item[key],
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
  DesignationName: "Designation",
  DepartmentName: "Department",
  dteJoiningDate: "Joining Date",
  serviceLength: "Service Length",
  strEmployeeStatus: "Status",
};
