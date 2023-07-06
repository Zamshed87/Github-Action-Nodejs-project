import { toast } from "react-toastify";
import moment from "moment";
import axios from "axios";
import { gray600 } from "../../../../utility/customColor";
import { dateFormatter } from "../../../../utility/dateFormatter";
import RoasterInfo from "./component/RosterInfo";
import { InfoOutlined } from "@mui/icons-material";
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
export const getCalendarAssignFilter = async (
  setter,
  setIsLoading,
  payload,
  cb
) => {
  setIsLoading(true);
  try {
    let res = await axios.post(`/Employee/CalendarAssignFilter`, payload);
    setIsLoading(false);
    // const newList = res?.data?.map((item) => ({
    //   ...item,
    //   isAssigned: false,
    // }));
    res?.data?.length > 0 && cb?.(res?.data);
    // setAllData && setAllData(newList);
    // setter?.(newList);
  } catch (err) {
    setIsLoading(false);
    setter([]);
  }
};

export const rosterGenerateAction = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/Employee/RosterGenerateList`, payload);
    cb && cb();
    toast.success(res?.data?.Result?.Message || "Submitted Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading && setLoading(false);
  }
};

export const columns = (
  pages,
  permission,
  rowDto,
  setRowDto,
  checkedList,
  setCheckedList,
  // isAlreadyPresent,
  setSingleData,
  setCreateModal,
  // rowDtoHandler,
  setSingleShiftData,
  setLoading,
  setAnchorEl2,
  headerList,
  wgName
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
                getShiftInfo(
                  record?.employeeId,
                  setSingleShiftData,
                  setLoading
                );
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
      title: "Designation",
      dataIndex: "designation",
      sort: true,
      filter: true,
      filterDropDownList: headerList[`designationList`],
      fieldType: "string",
    },
    {
      title: "Wing",
      dataIndex: "wingName",
      sort: true,
      filter: true,
      filterDropDownList: headerList[`wingNameList`],
      hidden: wgName === "Marketing" ? false : true,
      fieldType: "string",
    },
    {
      title: "Sole Depo",
      dataIndex: "soleDepoName",
      sort: true,
      filter: true,
      filterDropDownList: headerList[`soleDepoNameList`],
      hidden: wgName === "Marketing" ? false : true,
      fieldType: "string",
    },
    {
      title: "Region",
      dataIndex: "regionName",
      sort: true,
      filter: true,
      filterDropDownList: headerList[`regionNameList`],
      hidden: wgName === "Marketing" ? false : true,
      fieldType: "string",
    },
    {
      title: "Area",
      dataIndex: "areaName",
      sort: true,
      filter: true,
      filterDropDownList: headerList[`areaNameList`],
      hidden: wgName === "Marketing" ? false : true,
      fieldType: "string",
    },
    {
      title: "Territory",
      dataIndex: "territoryName",
      sort: true,
      filter: true,
      filterDropDownList: headerList[`territoryNameList`],
      hidden: wgName === "Marketing" ? false : true,
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
    // {
    //   title: () => <span style={{ color: gray600 }}>Roster Name</span>,
    //   dataIndex: "RosterGroupName",
    //   sorter: true,
    //   filter: true,
    // },

    {
      title: () => <span style={{ color: gray600 }}>Calender Name</span>,
      dataIndex: "calendarName",
      render: (record) => (
        <>
          {record?.calendarName ? (
            <div className="d-flex align-items-center">
              <RoasterInfo item={record} />
              <div className="pl-2">{record?.calendarName} </div>
            </div>
          ) : (
            ""
          )}
        </>
      ),
    },
    {
      title: "",
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
                onClick={(e) => {
                  if (!permission?.isCreate)
                    return toast.warn("You don't have permission");
                  if (!permission?.isCreate)
                    return toast.warn("You don't have permission");
                  setSingleData([record]);
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
