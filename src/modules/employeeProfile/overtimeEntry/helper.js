import { DeleteOutline, EditOutlined, InfoOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";
import AvatarComponent from "../../../common/AvatarComponent";
import Chips from "../../../common/Chips";
import { LightTooltip } from "../../../common/LightTooltip";
import {
  dateFormatter,
  dateFormatterForInput,
} from "../../../utility/dateFormatter";
import { formatMoney } from "../../../utility/formatMoney";
import { todayDate } from "../../../utility/todayDate";

export const getEmployeeProfileViewData = async (
  id,
  setter,
  setLoading,
  buId,
  wgId
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Employee/EmployeeProfileView?employeeId=${id}&businessUnitId=${buId}&workplaceGroupId=${wgId}`
    );
    if (res?.data) {
      setter && setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const getOvertimeLandingData = async (
  payload,
  setter,
  setLoading,
  cb,
  setAlldata
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/Employee/OverTimeFilter`, payload);
    cb && cb();
    setter(res?.data);
    setAlldata && setAlldata(res?.data);
    setLoading && setLoading(false);
  } catch (error) {
    setter([]);
    setLoading && setLoading(false);
  }
};

export const overtimeEntry_API = async (paylaod, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(`/TimeSheet/TimeSheetCRUD`, paylaod);
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

// overtime manual entry
export const saveOvertime = async (paylaod, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(`/Employee/InsertAllOvertime`, paylaod);
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

// overtime bulk entry
export const saveBulkUploadOvertimeAction = async (setLoading, data, cb) => {

  // told me maruf bhai to make optional overtime hour
  try {
    let modifiedData = data.map((item) => {
      if (
        !item?.employeeCode ||
        !item?.strDailyOrMonthly 
      ) {
        return toast.error("There are some missing or invalid fields");
      }
      return item;
    });

    setLoading(true);
    const res = await axios.post(
      `/Employee/InsertAllOvertimeBulk`,
      modifiedData
    );
    setLoading(false);
    toast.success(res?.data?.message || "Successful");
    cb && cb();
  } catch (error) {
    setLoading(false);
    toast.error(error?.response?.data?.message || "Something went wrong");
  }
};

// overtime bulk process
export const processBulkUploadOvertimeAction = async (
  data,
  setter,
  setLoading,
  buId,
  accId,
  empId,
  wgId
) => {
  try {
    setLoading(true);
    let modifiedData = data.map((item) => ({
      employeeCode: `${item["Employee Id"]}`,
      dteOverTimeDate: dateFormatterForInput(item["Date(mm/dd/yyyy)"]),
      numOverTimeHour: item["Overtime Hour"] || 0,
      strReason: item["Reason"] || "",
      numOverTimeRate: item["OT Rate"] || 0,
      numOverTimeAmount: item["OT Amount"] || 0,
      intYear: +dateFormatterForInput(item["Date(mm/dd/yyyy)"]).split("-")[0],
      intMonth: +dateFormatterForInput(item["Date(mm/dd/yyyy)"]).split("-")[1],
      strDailyOrMonthly:
        item["Daily/Monthly"]?.trim().charAt(0).toLowerCase() === "m"
          ? "Monthly"
          : item["Daily/Monthly"]?.trim().charAt(0).toLowerCase() === "d"
          ? "Daily"
          : "",
      intAccountId: accId,
      intWorkplaceGroupId: wgId,
      intBusinessUnitId: buId,
      isActive: true,
      intCreatedBy: empId,
      dteCreatedAt: todayDate(),
      intUpdatedBy: empId,
      dteUpdatedAt: todayDate(),
    }));
    setter(modifiedData);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
    toast.error(error?.response?.data?.message || "Something went wrong");
  }
};

export const getOvertimeById = async (payload, setter, setLoading) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/Employee/OverTimeFilter`, payload);
    if (res?.data?.length > 0) {
      const modifyData = {
        employee: {
          value: res?.data[0]?.EmployeeId,
          label: res?.data[0]?.strEmployeeCode,
        },
        workPlace: {
          value: res?.data[0]?.WorkplaceId,
          label: res?.data[0]?.WorkplaceName,
        },
        date: dateFormatterForInput(res?.data[0]?.OvertimeDate),
        overTimeHour: res?.data[0]?.OvertimeHour,
        reason: res?.data[0]?.Reason,
        strDailyOrMonthly: res?.data[0]?.strDailyOrMonthly,
      };
      setter(modifyData);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setter([]);
    setLoading && setLoading(false);
  }
};

// Overtime approval API
export const getAllOvertimeApplicationListDataForApproval = async (
  payload,
  setter,
  setAllData,
  setLoading,
  cb
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/ApprovalPipeline/OverTimeLanding`, payload);
    if (res?.data) {
      setAllData && setAllData(res?.data);
      setter(res?.data);
    }
    cb && cb();
    setLoading && setLoading(false);
  } catch (error) {
    setter([]);
    setLoading && setLoading(false);
  }
};

export const overtimeApproveReject = async (payload, cb) => {
  try {
    const res = await axios.post(`/ApprovalPipeline/OverTimeApproval`, payload);
    cb && cb();
    toast.success(res?.data || "Submitted Successfully");
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
  }
};

export const columns = (values, permission, history, deleteHandler) => {
  return [
    {
      title: "SL",
      render: (text, record, index) => index + 1,
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
      render: (_, data) => (
        <div className="d-flex align-items-center">
          <AvatarComponent
            classess=""
            letterCount={1}
            label={data?.EmployeeName}
          />
          <span className="ml-2">{data?.EmployeeName}</span>
        </div>
      ),
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
      title: "Overtime Date",
      dataIndex: "OvertimeDate",
      render: (data, record) => (
        <div>
          {record?.strDailyOrMonthly === "Monthly"
            ? moment(data).format("MMM, YYYY")
            : dateFormatter(data)}
        </div>
      ),
      sorter: false,
      filter: false,
      isDate: true,
    },
    {
      title: "Hours",
      // dataIndex: "OvertimeHour",
      render: (_, record) => (
        <div className="d-flex align-items-center">
          <LightTooltip
            title={
              <div className="movement-tooltip p-2">
                <div>
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                    className="tooltip-title"
                  >
                    Reason
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: "500",
                    }}
                    className="tooltip-subTitle"
                  >
                    {record?.Reason}
                  </p>
                </div>
              </div>
            }
            arrow
          >
            <InfoOutlined
              sx={{ marginRight: "12px", color: "rgba(0, 0, 0, 0.6)" }}
            />
          </LightTooltip>
          <div>{record?.OvertimeHour}</div>
        </div>
      ),
      filter: false,
      sorter: false,
      isDate: true,
    },
    {
      title: "Amount",
      dataIndex: "TotalAmount",
      render: (data, record) => (
        <div>{formatMoney(record?.perMinutes * record?.OvertimeHour * 60)}</div>
      ),
      sorter: true,
      filter: true,
    },
    {
      title: "Status",
      dataIndex: "ApprovalStatus",
      render: (_, record) => (
        <>
          {record?.ApprovalStatus === "Approve" && (
            <Chips label="Approved" classess="success" />
          )}
          {record?.ApprovalStatus === "Pending" && (
            <Chips label="Pending" classess="warning" />
          )}
          {record?.ApprovalStatus === "Reject" && (
            <Chips label="Rejected" classess="danger" />
          )}
        </>
      ),
      filter: false,
      sorter: true,
    },
    {
      // title: "",
      dataIndex: "ApprovalStatus",
      render: (_, record) => (
        <>
          {" "}
          {record?.ApprovalStatus === "Pending" && (
            <div className="d-flex">
              <Tooltip title="Edit" arrow>
                <button type="button" className="iconButton">
                  <EditOutlined
                    sx={{ fontSize: "20px" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!permission?.isEdit)
                        return toast.warn("You don't have permission");
                      history.push({
                        pathname: `/profile/overTime/manualEntry/edit/${record?.OvertimeId}`,
                        state: {
                          ...record,
                          fromDate: values.filterFromDate,
                          toDate: values.filterToDate,
                        },
                      });
                    }}
                  />
                </button>
              </Tooltip>
              <Tooltip title="Delete" arrow>
                <button className="iconButton">
                  <DeleteOutline
                    sx={{ fontSize: "20px" }}
                    onClick={(e) => {
                      if (!permission?.isClose)
                        return toast.warn("You don't have permission");
                      deleteHandler({
                        ...record,
                        fromDate: values?.filterFromDate,
                        toDate: values?.filterToDate,
                      });
                    }}
                  />
                </button>
              </Tooltip>
            </div>
          )}
        </>
      ),
      filter: false,
      sorter: false,
    },
  ];
};
