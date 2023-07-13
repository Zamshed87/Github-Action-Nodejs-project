import { toast } from "react-toastify";
import axios from "axios";
import AvatarComponent from "../../../../common/AvatarComponent";
import FormikCheckBox from "../../../../common/FormikCheckbox";
import { gray900, greenColor } from "../../../../utility/customColor";
import { dateFormatter } from "../../../../utility/dateFormatter";
import Chips from "../../../../common/Chips";

// search
export const filterData = (keywords, allData, setRowDto) => {
  try {
    const regex = new RegExp(keywords?.toLowerCase());
    let newDta = allData?.filter((item) =>
      regex.test(item?.strEmployeeName?.toLowerCase())
    );
    setRowDto(newDta);
  } catch {
    setRowDto([]);
  }
};

export const manualAttendanceAction = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/Employee/ManualAttendance`, payload);
    toast.success(res?.data?.message || "Submitted Successfully");
    setLoading && setLoading(false);
    cb && cb();
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading && setLoading(false);
  }
};

export const getAttendanceAdjustmentFilter = async (
  setAllData,
  setter,
  setIsLoading,
  payload,
  cb
) => {
  setIsLoading && setIsLoading(true);
  try {
    let res = await axios.post(`/Employee/AttendanceAdjustmentFilter`, payload);
    setIsLoading && setIsLoading(false);
    const newList = res?.data?.map((item) => ({
      ...item,
      presentStatus: false,
      actualAttendanceStatus:
        item?.isPresent && item?.isLate
          ? "Late"
          : item?.isPresent === true
          ? "Present"
          : item?.isHoliday === true
          ? "Holiday"
          : item?.isOffday === true
          ? "Offday"
          : item?.isLate === true
          ? "Late"
          : item?.isLeave === true
          ? "Leave"
          : item?.isMovement === true
          ? "Movement"
          : item?.isAbsent === true
          ? "Absent"
          : "-",
    }));
    setIsLoading && setAllData && setAllData(newList);
    setter(newList);
    cb && cb();
  } catch (err) {
    setIsLoading && setIsLoading(false);
  }
};

export const attendenceAdjustColumns = (
  setFieldValue,
  page,
  paginationSize,
  rowDto,
  allGridCheck,
  setRowDto,
  rowDtoHandler,
  isOfficeAdmin
) => [
  {
    title: "SL",
    render: (value, item, index) => (page - 1) * paginationSize + index + 1,
    sorter: false,
    filter: false,
    className: "text-center",
  },
  {
    title: () => (
      <div>
        <FormikCheckBox
          styleObj={{
            margin: "0 auto!important",
            padding: "0 !important",
            color: gray900,
            checkedColor: greenColor,
          }}
          name="allSelected"
          checked={
            rowDto?.length > 0 &&
            rowDto
              ?.filter((item) => item?.ApplicationStatus !== "Approved")
              ?.every((item) => item?.presentStatus)
          }
          onChange={(e) => {
            allGridCheck(e.target.checked);
            setRowDto(
              rowDto?.map((item) => ({
                ...item,
                presentStatus:
                  item?.ApplicationStatus === "Approved"
                    ? false
                    : e.target.checked,
              }))
            );
            setFieldValue("allSelected", e.target.checked);
          }}
        />

        <span style={{ marginLeft: "5px" }}>Employee Id</span>
      </div>
    ),
    dataIndex: "EmployeeCode",
    render: (_, record, index) => (
      <div>
        <FormikCheckBox
          styleObj={{
            margin: "0 auto!important",
            color: gray900,
            checkedColor: greenColor,
            padding: "0px",
          }}
          name="presentStatus"
          color={greenColor}
          checked={record?.presentStatus}
          onChange={(e) => {
            rowDtoHandler(index);
            // const copyRowDto = [...rowDto];
            const copyRowDto = rowDto?.map((item) => {
              if (item?.AutoId === record?.AutoId) {
                return {
                  ...item,
                  presentStatus: e.target.checked,
                };
              }
              return item;
            });

            // copyRowDto[index].presentStatus = !copyRowDto[index].presentStatus;
            setRowDto(copyRowDto);
          }}
          disabled={!isOfficeAdmin && record?.ApplicationStatus === "Approved"}
        />

        <span style={{ marginLeft: "5px" }}>{record?.EmployeeCode}</span>
      </div>
    ),
  },
  {
    title: "Employee",
    dataIndex: "EmployeeName",
    render: (EmployeeName) => (
      <div className="d-flex align-items-center">
        <AvatarComponent classess="" letterCount={1} label={EmployeeName} />
        <span className="ml-2">{EmployeeName}</span>
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
    title: "Attendance Date",
    dataIndex: "AttendanceDate",
    render: (date) => dateFormatter(date),
  },
  {
    title: "In-Time",
    dataIndex: "InTime",
  },
  {
    title: "Out-Time",
    dataIndex: "OutTime",
  },
  {
    title: "Total Working Hours",
    dataIndex: "WorkingHours",
  },
  {
    title: "Actual Attendance",
    dataIndex: "actualAttendanceStatus",
    render: (_, record) => (
      <div className="d-flex justify-content-center">
        {record?.isPresent && record?.isLate ? (
          <Chips label="Late" classess="warning" />
        ) : record?.isPresent === true ? (
          <Chips label="Present" classess="success" />
        ) : record?.isHoliday === true ? (
          <Chips label="Holiday" classess="secondary" />
        ) : record?.isOffday === true ? (
          <Chips label="Offday" classess="primary" />
        ) : record?.isLate === true ? (
          <Chips label="Late" classess="warning" />
        ) : record?.isLeave === true ? (
          <Chips label="Leave" classess="indigo" />
        ) : record?.isMovement === true ? (
          <Chips label="Movement" classess="movement" />
        ) : record?.isAbsent === true ? (
          <Chips label="Absent" classess="danger" />
        ) : (
          "-"
        )}
      </div>
    ),
    filter: true,
    sorter: false,
  },
  {
    title: "Request Attendance",
    dataIndex: "RequestStatus",
    filter: true,
    sorter: false,
  },
  {
    title: "Approval Status",
    dataIndex: "ApplicationStatus",
    render: (_, record) => (
      <div className="d-flex justify-content-center">
        {record?.ApplicationStatus === "Approved" && (
          <Chips label="Approved" classess="success p-2" />
        )}
        {record?.ApplicationStatus === "Pending" && (
          <Chips label="Pending" classess="warning p-2" />
        )}
        {record?.ApplicationStatus === "Process" && (
          <Chips label="Process" classess="primary p-2" />
        )}
        {record?.ApplicationStatus === "Rejected" && (
          <Chips label="Rejected" classess="danger p-2 mr-2" />
        )}
      </div>
    ),
    filter: true,
    sorter: false,
  },
];
