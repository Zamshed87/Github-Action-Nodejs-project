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
  buId,
  wgId,
  setter,
  setLoading,
  search,
  pageNo,
  pageSize,
  setPages,
  IsPaginated = true
) => {
  setLoading && setLoading(true);

  try {
    let apiUrl = `/Employee/ContractualClosing?businessUnitId=${buId}&workplaceGroupId=${wgId}&IsPaginated=${IsPaginated}${search}&pageNo=${pageNo}&pageSize=${pageSize}`;

    search && (apiUrl += `&searchTxt=${search}`);

    const res = await axios.get(apiUrl);

    if (res?.data) {
      const modifiedData = res?.data?.data?.map((item, index) => ({
        ...item,
        initialSerialNumber: index + 1,
      }));
      setter && setter?.(modifiedData);

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
  page,
  paginationSize,
  permission,
  setAnchorEl,
  setSingleData
) => {
  return [
    {
      title: "SL",
      render: (_, index) => (page - 1) * paginationSize + index + 1,
      sort: false,
      filter: false,
      className: "text-center",
    },
    {
      title: "Employee Id",
      dataIndex: "EmployeeCode",
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Employee Name",
      dataIndex: "EmployeeName",
      render: (record) => {
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
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Employment Type",
      dataIndex: "strEmploymentType",
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Department",
      dataIndex: "DepartmentName",
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Designation",
      dataIndex: "DesignationName",
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Contractual From Date",
      dataIndex: "dteContactFromDate",
      render: (record) => dateFormatter(record?.dteContactFromDate),
      sort: true,
      filter: false,
      fieldType: "date",
    },
    {
      title: "Contractual To Date",
      dataIndex: "dteContactToDate",
      render: (record) => dateFormatter(record?.dteContactToDate),
      sort: true,
      filter: false,
      fieldType: "date",
    },
    {
      title: "Joining Date",
      dataIndex: "dteJoiningDate",
      render: (record) => dateFormatter(record?.dteJoiningDate),
      sort: true,
      filter: false,
      fieldType: "date",
    },
    {
      title: "",
      dataIndex: "",
      width: 150,
      render: (item) => {
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
      sort: false,
      filter: false,
      fieldType: "string",
    },
  ];
};
