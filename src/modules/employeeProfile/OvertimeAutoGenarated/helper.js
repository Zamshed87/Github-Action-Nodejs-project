import axios from "axios";
import { toast } from "react-toastify";
import AvatarComponent from "../../../common/AvatarComponent";
import { dateFormatter } from "../../../utility/dateFormatter";
import { numberWithCommas } from "../../../utility/numberWithCommas";

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
      width: "50px",
      fixed: "left",
    },
    {
      title: "Workplace",
      dataIndex: "strWorkplace",
      sorter: true,
      filter: true,
      key: "strWorkplace",
      width: "180px",
      fixed: "left",
    },
    {
      title: "Emp ID",
      dataIndex: "strEmployeeCode",
      sorter: true,
      filter: true,
      key: "strEmployeeCode",
      width: "90px",
      fixed: "left",
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
      width: "200px",
      fixed: "left",
    },
    {
      title: "Designation",
      dataIndex: "strDesignation",
      sorter: true,
      filter: true,
      key: "strDesignation",
      width: "120px",
      fixed: "left",
    },
    {
      title: "Department",
      dataIndex: "strDepartment",
      sorter: true,
      filter: true,
      key: "strDepartment",
      width: "120px",
    },
    {
      title: "Basic Salary",
      dataIndex: "intBasicSalary",
      sorter: true,
      width: "100px",
    },
    {
      title: "Gross Salary",
      dataIndex: "intGrossSalary",
      sorter: true,
      width: "100px",
    },
    // {
    //   title: "Workplace Group",
    //   dataIndex: "strWorkplaceGroup",
    //   sorter: true,
    //   filter: true,
    //   key: "strWorkplaceGroup",
    //   width: "180px",
    // },

    {
      title: "Date",
      dataIndex: "dteAttendanceDate",
      render: (data) => dateFormatter(data),
      isDate: true,
      key: "dteAttendanceDate",
      sorter: true,
      filter: true,
      width: "100px",
    },
    {
      title: "Calendar Name",
      dataIndex: "strCalendarName",
      // render: (data) => dateFormatter(data),
      // isDate: true,
      key: "strCalendarName",
      sorter: true,
      filter: true,
      width: "150px",
    },
    {
      title: "Policy Name",
      dataIndex: "strPolicyName",
      // render: (data) => dateFormatter(data),
      // isDate: true,
      key: "strPolicyName",
      sorter: true,
      filter: true,
      width: "120px",
    },
    // {
    //   title: "Start Time",
    //   dataIndex: "timeStartTime",
    //   filter: false,
    //   sorter: false,
    //   key: "timeStartTime",
    //   className: "text-center",
    //   render: (_, record) => {
    //     if (record?.timeStartTime !== record?.timeEndTime) {
    //       return <div>{timeFormatter(record?.timeStartTime)}</div>;
    //     }
    //     return <div>-</div>;
    //   },
    //   width: "100px",
    // },
    // {
    //   title: "End Time",
    //   dataIndex: "timeEndTime",
    //   className: "text-center",
    //   render: (_, data) => {
    //     if (data?.timeStartTime !== data?.timeEndTime) {
    //       return <div>{timeFormatter(data?.timeEndTime)}</div>;
    //     }
    //     return <div>-</div>;
    //   },
    //   filter: false,
    //   sorter: false,
    //   key: "timeEndTime",
    //   width: "100px",
    // },
    {
      title: "Overtime Hours",
      key: "numMinutes",
      dataIndex: "numMinutes",
      render: (_, item, index) => {
        // console.log("per minutes")
        return (
          <div>
            <input
              style={{
                height: "25px",
                width: "100px",
                fontSize: "12px",
              }}
              className="form-control"
              value={item?.numMinutes}
              name={item?.numMinutes}
              type="number"
              onChange={(e) => {
                // console.log({ e })
                if (e.target.value) {
                  rowDtoHandler("numMinutes", index, e.target.value);
                } else {
                  rowDtoHandler("numMinutes", index, "");
                }
                // if(e.target.value){
                // rowDtoHandler("numMinutes", index, e.target.value);
              }}
            />
          </div>
        );
      },
      filter: false,
      sorter: false,
      width: "120px",
    },
    {
      title: "Per Hours.Rate",
      dataIndex: "numPerMinunitRate",
      render: (_, item) => (
        // <div className="pr-2">{item?.numPerMinunitRate}</div>
        <div className="pr-2">{(item?.numPerMinunitRate * 60).toFixed(2)}</div>
        // <div className="pr-2">{Math.round((item?.numPerMinunitRate / 60) * 1000) / 1000}</div>
      ),
      width: "120px",
    },
    {
      title: "Amount (BDT)",
      dataIndex: "numTotalAmount",
      render: (_, item) => (
        <div className="text-right pr-2">
          {numberWithCommas(Math.round(item?.numTotalAmount)) || ""}
        </div>
      ),
      key: "numTotalAmount",
      width: "80px",
    },
  ];
};
export const columns = {
  sl: "SL",
  strWorkplace: "Workplace",
  strEmployeeCode: "Emp ID",
  strEmployeeName: "Employee Name",
  strDesignation: "Designation",
  strDepartment: "Department",
  intBasicSalary: "Basic Salary",
  intGrossSalary: "Gross Salary",
  dteAttendanceDate: "Date",
  strCalendarName: "Calendar Name",
  strPolicyName: "Policy Name",
  numMinutes: "Overtime Hours",
  numPerMinunitRate: "Per Hours.Rate",
  numTotalAmount: "Amount (BDT)",
};
