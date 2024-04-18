import axios from "axios";
import { toast } from "react-toastify";
import AvatarComponent from "../../../../common/AvatarComponent";
import FormikToggle from "../../../../common/FormikToggle";
import {
  blackColor40,
  gray600,
  greenColor,
} from "../../../../utility/customColor";

export const employeeListColumn = (
  history,
  rowDto,
  setRowDto,
  page,
  paginationSize,
  setFieldValue
) => {
  return [
    {
      title: "SL",
      render: (text, record, index) => (page - 1) * paginationSize + index + 1,
      className: "text-center",
      width: 30,
    },
    {
      title: "Employee",
      dataIndex: "strEmployeeName",
      render: (_, record) => {
        return (
          <div className="d-flex align-items-center">
            <AvatarComponent
              classess=""
              letterCount={1}
              label={record?.strEmployeeName}
            />
            <span className="ml-2">
              {" "}
              {`${record?.strEmployeeName} [${record?.designationId}]`}
            </span>
          </div>
        );
      },
      className: "text-left",
    },
    {
      title: () => <span style={{ color: gray600 }}>Designation</span>,
      dataIndex: "designation",
      sorter: true,
    },
    {
      title: () => <span style={{ color: gray600 }}>Department</span>,
      dataIndex: "departmentName",
    },
    {
      title: () => <span style={{ color: gray600 }}>Email</span>,
      dataIndex: "email",
    },
    {
      title: () => <span style={{ color: gray600 }}>Phone</span>,
      dataIndex: "phone",
      className: "text-left",
    },
    {
      title: "Attendance",
      dataIndex: "strAttendance",
      className: "text-left",
      render: (_, record) => {
        return (
          <FormikToggle
            name="isActive"
            color={record?.strAttendanceStatus ? greenColor : blackColor40}
            checked={record?.strAttendanceStatus}
            onChange={(e) => {
              const data = rowDto?.map((item) =>
                item?.intEmployeeId === record?.intEmployeeId
                  ? {
                      ...item,
                      strAttendanceStatus: !item?.strAttendanceStatus,
                      isModified: true,
                    }
                  : item
              );
              setRowDto(data);
              setFieldValue("isActive", e.target.checked);
            }}
          />
        );
      },
    },
  ];
};
export const trainingAttendanceList = async (
  accId,
  buId,
  ScheduleId,
  setLoading,
  setter,
  setAllData,
  date
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Training/GetScheduleEmployeeListForTrainingAttendance?scheduleId=${ScheduleId}&attendanceDate=${date}&intAccountId=${accId}&intBusinessUnitId=${buId}`
    );
    setter(res?.data?.data);
    setAllData(res?.data);
    setLoading && setLoading(false);
  } catch (error) {
    setLoading && setLoading(false);
    setter([]);
    setAllData([]);
  }
};
export const trainingAbsentPresent = async (
  orgId,
  buId,
  payload,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    // eslint-disable-next-line
    const res = await axios.post(`/Training/CreateTrainingAttendance`, payload);
    setLoading && setLoading(false);
    if (res?.data?.statusCode === 500) {
      toast.warn(res?.data?.message);
    } else {
      toast.success("Submitted Successfully");
    }
    // setter(allData)
  } catch (error) {
    setLoading && setLoading(false);
    toast.warn(error?.response?.data || "Something went wrong");
    // setter([]);
    // setAllData([]);
  }
};
