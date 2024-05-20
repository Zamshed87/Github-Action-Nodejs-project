import axios from "axios";
import AvatarComponent from "../../../../common/AvatarComponent";

export const hasLeave = (data) => {
  if (
    data?.clTaken > 0 ||
    data?.slTaken > 0 ||
    data?.lwpTaken > 0 ||
    data?.elTaken > 0 ||
    data?.mlTaken > 0
  )
    return true;
  else return false;
};
export const getLeaveHistoryAction = async (
  wId,
  buId,
  wgId,
  yearId,
  setLoading,
  setter,
  srcTxt,
  isPaginated,
  pageNo,
  pageSize,
  setPages
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/Employee/LeaveBalanceHistoryForAllEmployee?BusinessUnitId=${buId}&yearId=${yearId}&WorkplaceGroupId=${wgId}&WorkplaceId=${wId}&SearchText=${srcTxt}&IsPaginated=${isPaginated}&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    setLoading(false);
    setter(res?.data);
    setPages({
      current: res?.data?.currentPage,
      pageSize: res?.data?.pageSize,
      total: res?.data?.totalCount,
    });
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};
export const leaveHistoryCol = (page, paginationSize) => {
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
      dataIndex: "workplaceGroup",
      sorter: false,
      filter: false,
    },
    {
      title: "Workplace/Concern",
      dataIndex: "workplace",
      sorter: false,
      filter: false,
    },
    {
      title: "Department",
      dataIndex: "department",
      sorter: false,
      filter: false,
    },
    {
      title: "Section",
      dataIndex: "section",
      sorter: false,
      filter: false,
    },
    {
      title: "Employee Id",
      dataIndex: "employeeCode",
      sorter: false,
      filter: false,
    },
    {
      title: "Employee",
      dataIndex: "employee",
      sort: true,
      filter: false,
      render: (item) => (
        <div className="d-flex align-items-center justify-content-start">
          <div className="emp-avatar">
            <AvatarComponent
              classess=""
              letterCount={1}
              label={item?.employee}
            />
          </div>
          <div className="ml-2">
            <span>{item?.employee}</span>
          </div>
        </div>
      ),
      fieldType: "string",
    },
    {
      title: "Designation",
      dataIndex: "designation",
      sorter: false,
      filter: false,
    },

    {
      title: "CL",
      dataIndex: "clTaken",
      render: (record) => {
        return (
          <span>
            {record?.clTaken || 0}/{record?.clBalance || 0}
          </span>
        );
      },
      sorter: false,
      filter: false,
    },
    {
      title: "SL",
      dataIndex: "slTaken",
      render: (data) => {
        return (
          <span>
            {data?.slTaken || 0}/{data?.slBalance || 0}
          </span>
        );
      },
      sorter: false,
      filter: false,
    },
    {
      title: "EL",
      dataIndex: "elTaken",
      render: (data) => {
        return (
          <span>
            {data?.elTaken || 0}/{data?.elBalance || 0}
          </span>
        );
      },
      sorter: false,
      filter: false,
    },
    {
      title: "LWP",
      dataIndex: "lwpTaken",
      render: (data) => {
        return (
          <span>
            {data?.lwpTaken || 0}/{data?.lwpBalance || 0}
          </span>
        );
      },
      sorter: false,
      filter: false,
    },
    {
      title: "ML",
      dataIndex: "CL",
      render: (data) => {
        return (
          <span>
            {data?.mlTaken || 0}/{data?.mlBalance || 0}
          </span>
        );
      },
      sorter: false,
      filter: false,
    },
  ];
};
export const column = {
  sl: "SL",
  workplaceGroup: "Workplace Group",
  workplace: "Workplace",
  employeeCode: "Employee Id",
  employee: "Employee Name",
  designation: "Designation",
  department: "Department",
  section: "Section",
  clTaken: "CL",
  slTaken: "SL",
  elTaken: "EL",
  LWP: "lwpTaken",
  ML: "mlTaken",
};
