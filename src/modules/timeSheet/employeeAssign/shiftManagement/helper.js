import { InfoOutlined } from "@mui/icons-material";
import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";
import { dateFormatter } from "../../../../utility/dateFormatter";

export const getShiftAssignFilter = async (
  setAllData,
  setter,
  setIsLoading,
  rowDto,
  payload,
  cb
) => {
  setIsLoading(true);
  try {
    const res = await axios.post(`/Employee/CalendarAssignFilter`, payload);
    setIsLoading(false);
    const newList = res?.data?.map((item) => ({
      ...item,
      selectCheckbox: false,
    }));
    setAllData && setAllData(newList);
    setter?.(newList);
    res?.data?.length > 0 && cb?.(res?.data);
    /* 
    if (!rowDto?.length > 0) {
      setter(newList);
    } else {
      let temp = [];
      res?.data?.forEach((item) => {
        rowDto.forEach((filterd) => {
          if (item?.EmployeeId === filterd?.EmployeeId) {
            temp.push({
              ...item,
              selectCheckbox: false,
            });
          }
        });
      });
      setter(temp);
    } */
  } catch (err) {
    setIsLoading(false);
    setter("");
  }
};

export const getEmployeeProfileViewData = async (id, setter, setLoading) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Employee/EmployeeProfileView?employeeId=${id}`
    );
    if (res?.data) {
      setter && setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const getShiftInfo = async (id, setter, setLoading) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `Employee/GetEmployeeShiftInfo?intEmployeeId=${id}&intYear=${moment().format(
        "YYYY"
      )}&intMonth=${moment().format("M")}`
    );
    if (res?.data) {
      setter && setter(res?.data);
      setLoading && setLoading(false);
    }
    res?.data?.length === 0 && toast.warn("no data found");
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const createShiftManagement = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`Employee/PostCalendarAssign`, payload);
    cb && cb();
    toast.success(res?.data?.message || "Submitted Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    console.log(error);
    setLoading && setLoading(false);
    toast.warn("Something went wrong");
  }
};

export const getCalenderDDL = async (
  apiUrl,
  value,
  label,
  setter
  // setterFastValue
) => {
  try {
    const res = await axios.get(apiUrl);
    const newDDL = res?.data?.map((itm) => ({
      ...itm,
      value: itm[value],
      label: itm[label],
    }));
    setter(newDDL);

    // let fistItem = newDDL[0];
    // setterFastValue && setterFastValue([fistItem]);
  } catch (error) {
    console.log(error.message);
  }
};

export const getChipStyle = (status) => ({
  color:
    status === "A"
      ? "#6927DA"
      : status === "B"
      ? "#B42318"
      : status === "C"
      ? "#299647"
      : status === "D"
      ? " #B54708"
      : status === "General"
      ? " #722F37"
      : status === "E"
      ? "#3538CD"
      : "#667085",
  backgroundColor:
    status === "A"
      ? "#ECE9FE"
      : status === "B"
      ? "#FEE4E2"
      : status === "C"
      ? "#E6F9E9"
      : status === "D"
      ? "#FEF0C7"
      : status === "General"
      ? "#FEF0D7"
      : status === "E"
      ? "#E0EAFF"
      : "#F2F4F7",
  borderRadius: "50%",
  fontSize: "15px",
  // padding: "2px 5px",
  paddingTop: "7px",
  fontWeight: 500,
  textAlign: "center",
  width: "30px",
  height: "30px",
});

export const getChipStyleShift = (status) => ({
  color:
    status === "A"
      ? "#6927DA"
      : status === "B"
      ? "#B42318"
      : status === "C"
      ? "#299647"
      : status === "D"
      ? " #B54708"
      : status === "General"
      ? " #722F37"
      : status === "E"
      ? "#3538CD"
      : "#667085",
  backgroundColor:
    status === "A"
      ? "#ECE9FE"
      : status === "B"
      ? "#FEE4E2"
      : status === "C"
      ? "#E6F9E9"
      : status === "D"
      ? "#FEF0C7"
      : status === "General"
      ? "#FEF0D7"
      : status === "E"
      ? "#E0EAFF"
      : "#F2F4F7",
  borderRadius: "99px",
  fontSize: "14px",
  padding: "2px 5px",
  fontWeight: 500,
});

export const columns = (
  pages,
  permission,
  rowDto,
  setRowDto,
  checkedList,
  setCheckedList,
  // isAlreadyPresent,
  setCreateModal,
  // rowDtoHandler,
  setSingleShiftData,
  setAnchorEl2,
  headerList
) =>
  [
    {
      title: "SL",
      render: (_, index) => (pages?.current - 1) * pages?.pageSize + index + 1,
      sort: false,
      filter: false,
      className: "text-center",
    },
    {
      title: "Employee Id",
      dataIndex: "employeeCode",
      sort: true,
      filter: false,
      fieldType: "string",
      width: 150,
    },
    {
      title: "Employee Name",
      dataIndex: "",
      render: (record) => {
        return (
          <div className="d-flex align-items-center">
            <span className="ml-2">{record?.employeeName}</span>
            <InfoOutlined
              style={{ cursor: "pointer" }}
              className="ml-2"
              onClick={(e) => {
                e.stopPropagation();
                setSingleShiftData([]);
                getShiftInfo(record?.employeeId, setSingleShiftData);
                setAnchorEl2(e.currentTarget);
              }}
            />
          </div>
        );
      },
      sort: true,
      filter: false,
      fieldType: "string",
    },

    {
      title: "Department",
      dataIndex: "department",
      sort: true,
      filter: true,
      filterDropDownList: headerList[`departmentList`],
      fieldType: "string",
    },
    {
      title: "Section",
      dataIndex: "section",
      sort: true,
      filter: true,
      filterDropDownList: headerList[`sectionList`],
      fieldType: "string",
    },
    {
      title: "Designation",
      dataIndex: "designation",
      sort: true,
      filter: true,
      filterDropDownList: headerList[`designationList`],
      fieldType: "string",
    },
    {
      title: "Supervisor",
      dataIndex: "supervisorName",
      sort: true,
      filter: true,
      filterDropDownList: headerList[`supervisorNameList`],
      fieldType: "string",
    },
    {
      title: "Generate Date",
      dataIndex: "generateDate",
      render: (record) => dateFormatter(record?.generateDate),
    },
    // {
    //   title: () => <span style={{ color: gray600 }}>Generate Date</span>,
    //   dataIndex: "GenerateDate",
    //   render: (GenerateDate) => dateFormatter(GenerateDate),
    //   sorter: true,
    //   filter: true,
    //   isDate: true,
    // },
    {
      title: "Joining Date",
      dataIndex: "joiningDate",
      render: (record) => dateFormatter(record?.joiningDate),
    },
    // {
    //   title: () => <span style={{ color: gray600 }}>Joining Date</span>,
    //   dataIndex: "JoiningDate",
    //   render: (JoiningDate) => dateFormatter(JoiningDate),
    //   sorter: true,
    //   filter: true,
    //   isDate: true,
    // },
    {
      title: "Roster Name",
      dataIndex: "rosterGroupName",
      sort: true,
      fieldType: "string",
    },
    {
      title: "Calender Name",
      dataIndex: "calendarName",
      render: (record) => (
        <>
          {record?.calendarName ? (
            <div className="d-flex align-items-center">
              {/* <RoasterInfo item={record} /> */}
              <div className="pl-2">{record?.calendarName} </div>
            </div>
          ) : (
            ""
          )}
        </>
      ),
    },
    {
      title: "Action",
      className: "text-center",
      dataIndex: "",
      render: (record) => (
        <div>
          {!(record?.calendarAssignId || record?.isSelected) && (
            <div className="assign-btn">
              <button
                style={{
                  marginRight: "25px",
                  height: "24px",
                  fontSize: "12px",
                  padding: "0px 12px 0px 12px",
                }}
                type="button"
                className="btn btn-default"
                onClick={() => {
                  if (!permission?.isCreate)
                    return toast.warn("You don't have permission");
                  if (!permission?.isCreate)
                    return toast.warn("You don't have permission");
                  setCreateModal(true);
                  // rowDtoHandler(record);
                }}
                disabled={checkedList.length > 1}
              >
                Assign
              </button>
            </div>
          )}
        </div>
      ),
    },
  ].filter((item) => item.hidden !== true);
