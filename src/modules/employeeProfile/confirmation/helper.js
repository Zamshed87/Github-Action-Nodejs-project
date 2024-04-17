import axios from "axios";
import { toast } from "react-toastify";
import AvatarComponent from "../../../common/AvatarComponent";
import Chips from "../../../common/Chips";
import {
  dateFormatter,
  dateFormatterForInput,
} from "../../../utility/dateFormatter";
import { todayDate } from "../../../utility/todayDate";

export const confirmationEmpAction = async (
  values,
  singleData,
  setLoading,
  cb
) => {
  try {
    // requirement from fosu 🔥🔥
    // if (!values?.pinNo) {
    //   return toast.warning("PIN No. is reqired.");
    // }
    const payload = {
      employeeId: singleData?.employeeId,
      // designationId: singleData?.designationId,
      confirmationDate: values?.confirmDate,
      // pinNo: values?.pinNo,
    };
    setLoading(true);
    const res = await axios.post(`/Employee/ConfirmationEmployee`, payload);

    setLoading(false);
    cb && cb();
    toast.success(res?.data?.message);
  } catch (error) {
    setLoading(false);
    toast.warn(error?.response?.data?.message, { toastId: 1 });
  }
};

export const getPeopleDeskAllLandingForConfirmation = async (
  tableName,
  accId,
  busId,
  id,
  deptId,
  desId,
  empId,
  setter,
  setAllData,
  setLoading,
  statusId,
  joiningDate,
  confirmDate,
  setPages,
  wgId,
  pagination,
  searchText,
  intWorkplaceId
) => {
  setLoading && setLoading(true);
  const url = `/EmployeeAllLanding/EmployeeBasicForConfirmation?BusinessUnitId=${busId}&WorkplaceGroupId=${wgId}&FromDate=${joiningDate}&ToDate=${confirmDate}&PageNo=${
    pagination?.current
  }&PageSize=${pagination?.pageSize}&SearchTxt=${
    searchText || ""
  }&WorkplaceId=${intWorkplaceId}`;
  try {
    const res = await axios.get(url);
    if (res?.data?.data) {
      setter && setter(res?.data?.data);
      setAllData && setAllData(res?.data?.data);
      setLoading && setLoading(false);
      setPages({
        current: pagination?.current,
        pageSize: pagination?.pageSize,
        total: res?.data?.totalCount,
      });
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const getEmployeeSalaryInfo = async (setter, setIsLoading, payload) => {
  setIsLoading(true);
  try {
    const res = await axios.post(`/Payroll/EmployeeSalaryManagement`, payload);
    setIsLoading(false);
    setter(res?.data);
  } catch (err) {
    setIsLoading(false);
    setter("");
  }
};
export const empConfirmcolumns = (
  setAnchorEl,
  setSingleData,
  setIsEdit,
  permission,
  orgId,
  setValues,
  pages
) => {
  return [
    {
      title: "SL",
      render: (_, index) =>
        (+pages?.current - 1) * +pages?.pageSize + index + 1,
      sort: false,
      filter: false,
      className: "text-center",
    },
    {
      title: "Employee ID",
      dataIndex: "employeeCode",
      width: 130,
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      render: (record) => {
        return (
          <div className="d-flex align-items-center">
            <AvatarComponent
              classess=""
              letterCount={1}
              label={record?.employeeName}
            />
            <span className="ml-2">{record?.employeeName}</span>
          </div>
        );
      },
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Designation",
      dataIndex: "designationName",
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Department",
      dataIndex: "departmentName",
      sort: true,
      filter: false,
      fieldType: "string",
    },
    // {
    //   title: "Wing",
    //   dataIndex: "wingName",
    //   sort: true,
    //   filter: false,
    //   hidden: wgId !== 3 ? true : false,
    //   fieldType: "string",
    // },
    // {
    //   title: "Sole Depo",
    //   dataIndex: "soleDepoName",
    //   sort: true,
    //   filter: false,
    //   hidden: wgId !== 3 ? true : false,
    //   fieldType: "string",
    // },
    // {
    //   title: "Region",
    //   dataIndex: "regionName",
    //   sort: true,
    //   filter: false,
    //   hidden: wgId !== 3 ? true : false,
    //   fieldType: "string",
    // },
    // {
    //   title: "Area",
    //   dataIndex: "areaName",
    //   sort: true,
    //   filter: false,
    //   hidden: wgId !== 3 ? true : false,
    //   fieldType: "string",
    // },
    // {
    //   title: "Territory",
    //   dataIndex: "territoryName",
    //   sort: true,
    //   filter: false,
    //   hidden: wgId !== 3 ? true : false,
    //   fieldType: "string",
    // },
    {
      title: "Employment Type",
      dataIndex: "employmentType",
      sort: true,
      filter: false,
      width: 140,
      fieldType: "string",
    },
    // {
    //   title: "Pin No.",
    //   dataIndex: "pinNo",
    //   render: (record) => (record?.pinNo ? record?.pinNo : "-"),
    //   sort: true,
    //   filter: false,
    //   width: 100,
    //   fieldType: "string",
    // },
    {
      title: "Joining Date",
      dataIndex: "joiningDate",
      render: (record) => dateFormatter(record?.joiningDate),
      fieldType: "string",
      sort: true,
      width: 150,
    },
    {
      title: orgId === 10015 ? "Reporting Line" : "Supervisor",
      dataIndex: "supervisorName",
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Confirmation Date",
      width: 150,
      dataIndex: "confirmationDate",
      fieldType: "string",
      render: (record) => {
        return (
          <p>{record?.confirmationDate ? record?.confirmationDate : "-"}</p>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "confirmationStatus",
      sort: false,
      filter: false,
      width: 140,
      render: (record) => {
        return (
          <div className="d-flex">
            {record?.confirmationStatus === "Confirm" ? (
              <>
                <Chips label="Confirmed" classess="success" />
                {/* confirmation by fosu 🔥🔥 */}
                {/* <button
                  type="button"
                  className="iconButton mt-0 mt-md-2 mt-lg-0 ml-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAnchorEl(e.currentTarget);
                    setSingleData(record);
                    setIsEdit(true);
                    setValues((prev) => {
                      return {
                        ...prev,
                        designation: {
                          value: record?.designationId,
                          label: record?.designationName,
                        },
                        confirmDate: record?.confirmationDateRaw
                          ? dateFormatterForInput(record?.confirmationDateRaw)
                          : "",
                        pinNo: record?.pinNo,
                      };
                    });
                  }}
                >
                  <CreateOutlined />
                </button> */}
              </>
            ) : (
              <button
                style={{
                  height: "24px",
                  fontSize: "12px",
                  padding: "0px 12px 0px 12px",
                }}
                className="btn btn-default btn-assign ml-1"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!permission?.isCreate)
                    return toast.warn("You don't have permission");
                  setAnchorEl(e.currentTarget);
                  setSingleData(record);
                  setValues((prev) => {
                    return {
                      ...prev,
                      designation: {
                        value: record?.designationId,
                        label: record?.designationName,
                      },
                      confirmDate: record?.confirmationDate
                        ? dateFormatterForInput(record?.confirmationDate)
                        : todayDate(),
                    };
                  });
                }}
              >
                Confirm
              </button>
            )}
          </div>
        );
      },
    },
  ].filter((item) => !item.hidden);
};
export const columns = {
  sl: "SL",
  employeeCode: "Employee ID",
  employeeName: "Employee Name",
  designationName: "Designation",
  departmentName: "Department",
  employmentType: "Employment Type",
  joiningDate: "Joining Date",
  supervisorName: "Supervisor",
  confirmationDate: "Confirmation Date",
  confirmationStatus: "Status",
};
