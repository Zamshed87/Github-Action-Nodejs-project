import axios from "axios";
import AvatarComponent from "../../../../common/AvatarComponent";
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
  setAllData,
  buId,
  orgId,
  wgId,
  yearId,
  setLoading,
  setter,
  setTableRowDto,
  workplaceGroupId,
  departmentId,
  designationId,
  empId
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/Employee/LeaveBalanceHistoryForAllEmployee?BusinessUnitId=${buId}&yearId=${yearId}&accountId=${
        orgId || 0
      }&DeptId=${departmentId || 0}&DesigId=${
        designationId || 0
      }&WorkplaceGroupId=${wgId}&EmployeeId=${empId || 0}`
    );
    setLoading(false);
    setter(res?.data);
    setTableRowDto((prev) => ({
      ...prev,
      data: res?.data,
      totalCount: res?.data?.length,
    }));
    setAllData(res?.data);
  } catch (error) {
    setLoading(false);
    setter([]);
    setAllData([]);
  }
};
export const leaveHistoryCol = (page, paginationSize) => {
  return [
    {
      title: "SL",
      render: (text, record, index) => (page - 1) * paginationSize + index + 1,
      sorter: false,
      filter: false,
      className: "text-center",
      width: 60,
    },
    {
      title: "Employee Id",
      dataIndex: "employeeCode",
      sorter: true,
      filter: true,
    },
    {
      title: "Employee Name",
      dataIndex: "employee",
      render: (_, record) => {
        return (
          <div className="d-flex align-items-center">
            <AvatarComponent
              classess=""
              letterCount={1}
              label={record?.employee}
            />
            <span className="ml-2">{record?.employee}</span>
          </div>
        );
      },
      sorter: true,
      filter: true,
    },
    {
      title: "Designation",
      dataIndex: "designation",
      sorter: true,
      filter: true,
    },
    {
      title: "Department",
      dataIndex: "department",
      sorter: true,
      filter: true,
    },
    {
      title: "CL",
      dataIndex: "clTaken",
      render: (_, record) => {
        return (
          <span>
            {record?.clTaken || 0}/{record?.clBalance || 0}
          </span>
        );
      },
    },
    {
      title: "SL",
      dataIndex: "slTaken",
      render: (_, data) => {
        return (
          <span>
            {data?.slTaken || 0}/{data?.slBalance || 0}
          </span>
        );
      },
    },
    {
      title: "EL",
      dataIndex: "elTaken",
      render: (_, data) => {
        return (
          <span>
            {data?.elTaken || 0}/{data?.elBalance || 0}
          </span>
        );
      },
    },
    {
      title: "LWP",
      dataIndex: "lwpTaken",
      render: (_, data) => {
        return (
          <span>
            {data?.lwpTaken || 0}/{data?.lwpBalance || 0}
          </span>
        );
      },
    },
    {
      title: "ML",
      dataIndex: "CL",
      render: (_, data) => {
        return (
          <span>
            {data?.mlTaken || 0}/{data?.mlBalance || 0}
          </span>
        );
      },
    },
  ];
};
