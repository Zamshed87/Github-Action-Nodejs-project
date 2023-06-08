import axios from "axios";
import { toast } from "react-toastify";
import AvatarComponent from "../../../common/AvatarComponent";
import { dateFormatter } from "../../../utility/dateFormatter";
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
export const getContractClosingInfo = async (
  tableName,
  accId,
  busId,
  id,
  setter,
  setAllData,
  setLoading,
  statusId,
  pages,
  srcText,
  setPages,
  WorkplaceGroupId
) => {
  setLoading && setLoading(true);

  let status = statusId ? `&intStatusId=${statusId}` : "";
  let search = srcText ? `&SearchTxt=${srcText}` : "";
  let intId = id ? `&intId=${id}` : "";
  try {
    const res = await axios.get(
      `/Employee/PeopleDeskAllLanding?TableName=${tableName}&AccountId=${accId}&BusinessUnitId=${busId}&WorkplaceGroupId=${WorkplaceGroupId}&PageNo=${pages.current}&PageSize=${pages.pageSize}${status}${search}${intId}`
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

export const extendContractEmpAction = async (
  values,
  singleData,
  setLoading,
  cb
) => {
  try {
    let payload = {
      employeeId: singleData?.EmployeeId,
      contractFromDate: values?.contractFromDate,
      contractToDate: values?.contractToDate,
    };
    setLoading(true);
    let res = await axios.post(
      `/Employee/UpdateEmpBasicInfoByEmployeeId`,
      payload
    );
    setLoading(false);
    cb && cb();
    toast.success(res?.data?.message);
  } catch (error) {
    setLoading(false);
    toast.warn(error?.response?.data?.message);
  }
};

export const contactClosingColumns = (
  permission,
  setAnchorEl,
  setSingleData,
  page,
  paginationSize
) => {
  return [
    {
      title: "SL",
      render: (_, record, index) => (page - 1) * paginationSize + index + 1,
      sorter: false,
      filter: false,
      className: "text-center",
    },
    {
      title: "Employee Id",
      dataIndex: "EmployeeCode",
      sorter: true,
      filter: true,
    },
    {
      title: "Employee Name",
      dataIndex: "EmployeeName",
      fixed: "left",
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
    },
    {
      title: "Department",
      dataIndex: "DepartmentName",
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
      title: "Contractual From Date",
      dataIndex: "dteContactFromDate",
      isDate: true,
      render: (_, record) => dateFormatter(record?.dteContactFromDate),
    },
    {
      title: "Contractual To Date",
      dataIndex: "dteContactToDate",
      isDate: true,
      render: (dteContactToDate) => dateFormatter(dteContactToDate),
    },
    {
      title: "Joining Date",
      dataIndex: "dteJoiningDate",
      isDate: true,
      render: (dteJoiningDate) => dateFormatter(dteJoiningDate),
    },
    {
      title: "",
      dataIndex: "action",
      width: 150,
      render: (_, item) => {
        return (
          <div className="d-flex justify-content-center">
            <button
              style={{
                height: "24px",
                fontSize: "12px",
                padding: "0px 12px 0px 12px",
              }}
              className="btn btn-default btn-assign"
              type="button"
              onClick={(e) => {
                if (!permission?.isCreate)
                  return toast.warn("You don't have permission");
                setAnchorEl(e.currentTarget);
                setSingleData(item);
              }}
            >
              Extend Contract
            </button>
          </div>
        );
      },
    },
  ];
};
