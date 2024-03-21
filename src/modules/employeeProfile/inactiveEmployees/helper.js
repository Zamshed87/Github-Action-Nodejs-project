import { GroupAddOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import AvatarComponent from "../../../common/AvatarComponent";
import Chips from "../../../common/Chips";
import { Cell } from "../../../utility/customExcel/createExcelHelper";
import { dateFormatter } from "../../../utility/dateFormatter";

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

export const getNewInactiveEmpInfo = async ({
  buId,
  wgId,
  isExcel,
  pageNo,
  pageSize,
  srcTxt,
  setLoading,
  setter,
  setPages,
  fromDate,
  toDate,
  wId,
}) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Employee/GetInactiveEmployeeList?BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&WorkplaceId=${wId}&IsXls=${isExcel}&PageNo=${pageNo}&PageSize=${pageSize}&searchTxt=${srcTxt}&FromDate=${fromDate}&ToDate=${toDate}`
    );
    if (res?.data) {
      setter(res?.data);

      setPages({
        current: res?.data?.currentPage,
        pageSize: res?.data?.pageSize,
        total: res?.data?.totalCount,
      });

      setLoading && setLoading(false);
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
      render: (_, index) => (page - 1) * paginationSize + index + 1,
      sort: false,
      filter: false,
      className: "text-center",
      width: 50,
    },
    {
      title: "Work. Group/Location",
      dataIndex: "strWorkplaceGroup",
      sort: false,
      filter: false,
      width: 200,
    },
    {
      title: "Workplace/Concern",
      dataIndex: "strWorkplace",
      sort: false,
      filter: false,
      width: 200,
    },
    {
      title: "Department",
      dataIndex: "strDepartment",
      sort: false,
      filter: false,
    },
    {
      title: "Section",
      dataIndex: "strSection",
      sort: false,
      filter: false,
    },
    {
      title: "Employee Id",
      dataIndex: "strEmployeeCode",
      sort: false,
      filter: false,
      width: 100,
    },
    {
      title: "Employee Name",
      dataIndex: "strEmployeeName",
      sort: true,
      filter: false,
      render: (item) => (
        <div className="d-flex align-items-center justify-content-start">
          <div className="emp-avatar">
            <AvatarComponent
              classess=""
              letterCount={1}
              label={item?.strEmployeeName}
            />
          </div>
          <div className="ml-2">
            <span>{item?.strEmployeeName}</span>
          </div>
        </div>
      ),
      fieldType: "string",
    },
    {
      title: "Designation",
      dataIndex: "strDesignation",
      sort: false,
      filter: false,
    },

    {
      title: "Joining Date",
      dataIndex: "dteJoiningDate",
      isDate: true,
      sort: false,
      filter: false,
    },
    {
      title: "Inactive Date",
      dataIndex: "dteLastInactivateDate",
      isDate: true,
      sort: false,
      filter: false,
    },
    {
      title: "Last Present date      ",
      dataIndex: "dteLastPresentDate",
      isDate: true,
      sort: false,
      filter: false,
    },
    {
      title: "Reason",
      dataIndex: "reason",
      sort: false,
      filter: false,
    },
    {
      title: "Mobile Number      ",
      dataIndex: "strPersonalNumber",
      sort: false,
      filter: false,
    },
    {
      title: "Status",
      dataIndex: "strStatus",
      sort: false,
      filter: false,
      width: "150px",
      render: (item) => {
        return (
          <div className="d-flex align-items-center justify-content-center">
            <div>
              {item?.strStatus === "Inactive" && (
                <Chips label={item?.strStatus} classess="danger" />
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
  strWorkplaceGroup: "Workplace Group",
  strWorkplace: "Workplace",
  strDepartment: "Department",
  strSection: "Section",
  strEmployeeCode: "Employee Id",
  strEmployeeName: "Employee Name",
  strDesignation: "Designation",
  dteJoiningDate: "Joining Date",
  dteLastInactivateDate: "Inactive Date",
  dteLastPresentDate: "Last Present date",
  reason: "Reason",
  strPersonalNumber: "Mobile Number",
  strStatus: "Status",
};
