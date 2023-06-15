import axios from "axios";
import { toast } from "react-toastify";
import AvatarComponent from "../../../common/AvatarComponent";
import { dateFormatter } from "../../../utility/dateFormatter";
import { numberWithCommas } from "../../../utility/numberWithCommas";
import { timeFormatter } from "../../../utility/timeFormatter";

export const getEmpOvertimeLandingData = async (
  org,
  employeeId,
  fromDate,
  toDate,
  setRowDto,
  setLoading,
  cb
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Payroll/GetOverTimeListData?PartType=AutomatedOverTimeEmployeeList&AccountId=${org}&EmployeeId=${employeeId}&FromDate=${fromDate}&ToDate=${toDate}`
    );
    cb && cb();
    setRowDto(res?.data);
    setLoading && setLoading(false);
  } catch (error) {
    setRowDto([]);
    setLoading && setLoading(false);
  }
};

export const updateOvertimeHour = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/Payroll/UpdateOverTimeHours`, payload);
    toast.success(res?.data?.message);
    setLoading && setLoading(false);
    cb && cb();
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const overTimeGeneratedDtoCol = (rowDtoHandler) => {
  return [
    {
      title: "SL",
      dataIndex: "sl",
      // render: (text, record, index) => index + 1,
      sorter: false,
      filter: false,
      className: "text-center",
      key: "sl",
    },
    {
      title: "Code",
      dataIndex: "strEmployeeCode",
      sorter: true,
      filter: true,
      key: "strEmployeeCode",
    },
    {
      title: "Employee Name",
      dataIndex: "strEmployeeName",
      render: (_, data) => (
        <div className="d-flex align-items-center">
          <AvatarComponent
            classess=""
            letterCount={1}
            label={data?.strEmployeeName}
          />
          <span className="ml-2">{data?.strEmployeeName}</span>
        </div>
      ),
      sorter: true,
      filter: true,
      key: "strEmployeeName",
    },
    {
      title: "Designation",
      dataIndex: "strDesignationName",
      sorter: true,
      filter: true,
      key: "strDesignationName",
    },
    {
      title: "Department",
      dataIndex: "strDepartmentName",
      sorter: true,
      filter: true,
      key: "strDepartmentName",
    },
    {
      title: "Date",
      dataIndex: "dteAttendanceDate",
      render: (data) => dateFormatter(data),
      isDate: true,
      key: "dteAttendanceDate",
      sorter: true,
      filter: true,
    },
    {
      title: "Start Time",
      dataIndex: "timeStartTime",
      filter: false,
      sorter: false,
      key: "timeStartTime",
      className: "text-center",
      render: (_, record) => {
        if (record?.timeStartTime !== record?.timeEndTime) {
          return <div>{timeFormatter(record?.timeStartTime)}</div>;
        }
        return <div>-</div>;
      },
    },
    {
      title: "End Time",
      dataIndex: "timeEndTime",
      className: "text-center",
      render: (_, data) => {
        if (data?.timeStartTime !== data?.timeEndTime) {
          return <div>{timeFormatter(data?.timeEndTime)}</div>;
        }
        return <div>-</div>;
      },
      filter: false,
      sorter: false,
      key: "timeEndTime",
    },
    {
      title: "Overtime Hour",
      key: "EndTime",
      dataIndex: "EndTime",
      render: (_, item, index) => (
        <div>
          <input
            style={{
              height: "25px",
              width: "100px",
              fontSize: "12px",
            }}
            className="form-control"
            value={item?.numHours}
            name={item?.numHours}
            type="number"
            onChange={(e) => {
              if (e.target.value < 0) {
                return toast.warning("ot hours should be positive");
              }
              rowDtoHandler("numHours", index, e.target.value);
            }}
          />
        </div>
      ),
      filter: false,
      sorter: false,
    },
    {
      title: "Per Min.Rate",
      dataIndex: "numPerMinunitRate",
      render: (_, item, index) => (
        <div className="pr-2">{item?.numPerMinunitRate}</div>
      ),
    },
    {
      title: "Amount",
      dataIndex: "numTotalAmount",
      render: (_, item, index) => (
        <div className="text-right pr-2">
          {numberWithCommas(item?.numTotalAmount)}
        </div>
      ),
      key: "numTotalAmount",
    },
  ];
};
