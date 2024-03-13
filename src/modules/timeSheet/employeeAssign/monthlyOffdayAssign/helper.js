import { InfoOutlined } from "@mui/icons-material";
import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";
import AvatarComponent from "../../../../common/AvatarComponent";

const printDays = (item) => {
  let data = [];
  item?.isFriday && data.push("Friday");
  item?.isSaturday && data.push("Saturday");
  item?.isSunday && data.push("Sunday");
  item?.isMonday && data.push("Monday");
  item?.isTuesday && data.push("Tuesday");
  item?.isWednesday && data.push("Wednesday");
  item?.isThursday && data.push("Thursday");
  let str = "";
  data.forEach((item, index) => {
    str = str + `${index > 0 ? ", " : ""}` + item;
  });
  return str;
};

export const getOffDayLandingHandler = (
  buId,
  orgId,
  getLanding,
  setLanding,
  pagination,
  setPages,
  srcText,
  status,
  isAlreadyPresent,
  checked,
  setFilterLanding,
  setDataForAntTable
) => {
  const payload = {
    departmentId: 0,
    designationId: 0,
    supervisorId: 0,
    employmentTypeId: 0,
    employeeId: 0,
    workplaceGroupId: 0,
    isAssigned: false,
    businessUnitId: buId,
    accountId: orgId,
    pageNo: pagination.current,
    pageSize: pagination.pageSize,
    searchText: srcText || "",
  };
  getLanding(`/Employee/OffdayLandingFilter`, payload, (res) => {
    let newData =
      res?.length > 0
        ? res?.map((item) => {
            return {
              ...item,
              selectCheckbox:
                status !== "saved" &&
                checked.length > 0 &&
                isAlreadyPresent(item) >= 0,
              offDayList:
                !item?.isFriday &&
                !item?.isSaturday &&
                !item?.isSunday &&
                !item?.isMonday &&
                !item?.isThursday &&
                !item?.isTuesday &&
                !item?.isWednesday
                  ? "N/A"
                  : printDays(item),
              offDay:
                item?.isFriday ||
                item?.isSaturday ||
                item?.isSunday ||
                item?.isMonday ||
                item?.isThursday ||
                item?.isTuesday ||
                item?.isWednesday,
            };
          })
        : [];
    setLanding(newData);
    setFilterLanding?.(newData);
    setDataForAntTable?.(newData);
    res?.length > 0 &&
      setPages({
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: res?.[0]?.totalCount,
      });
  });
};

export const getSingleCalendar = async (
  monthId,
  yearId,
  empId,
  setCalendarData,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/Employee/GetEmployeeOffDayReassignLanding?IntMonthId=${monthId}&IntYearId=${yearId}&EmployeeId=${empId}`
    );
    if (res?.data) {
      setCalendarData(res?.data);
      setLoading(false);
    }
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setCalendarData([]);
    setLoading(false);
  }
};

export const createMonthlyOffdayAssign = async (payload, setLoading, cb) => {
  try {
    setLoading(true);
    const res = await axios.post(`/Employee/EmployeeOffDayReassign`, payload);
    cb && cb();
    toast.success(res.data?.message || "Successful");
    setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading(false);
  }
};

export const offDayAssignDtoCol = (
  pages,
  permission,
  setShowModal,
  setIsAssignAll,
  checkedList,
  setCheckedList,
  setSelectedSingleEmployee,
  setAnchorEl,
  setCalendarData,
  setLoading,
  loading,
  headerList,
  setSingleAssign
) => {
  return [
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
      title: "Employee",
      dataIndex: "",
      render: (record) => (
        <div className="d-flex align-items-center">
          <AvatarComponent
            classess=""
            letterCount={1}
            label={record?.employeeName}
          />
          <span className="ml-2">{record?.employeeName}</span>
          <InfoOutlined
            className="ml-2"
            sx={{ cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation();
              getSingleCalendar(
                moment().format("MM"),
                moment().format("YYYY"),
                record?.employeeId,
                setCalendarData,
                setLoading
              );
              !loading && setAnchorEl(e.currentTarget);
              setSelectedSingleEmployee([record]);
            }}
          />
        </div>
      ),
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
      title: "Section",
      dataIndex: "section",
      sort: true,
      filter: true,
      filterDropDownList: headerList[`sectionList`],
      fieldType: "string",
    },
    {
      title: "Work. Group/Location",
      dataIndex: "workplaceGroupName",
      sort: true,
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
      className: "text-center",
      render: (record) => (
        <div className="d-flex align-items-center">
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
              disabled={checkedList.length > 1}
              onClick={(e) => {
                if (!permission?.isCreate)
                  return toast.warn("You don't have permission");
                if (!permission?.isCreate)
                  return toast.warn("You don't have permission");
                !loading && setShowModal(true);
                getSingleCalendar(
                  moment().format("MM"),
                  moment().format("YYYY"),
                  record?.employeeId,
                  setCalendarData,
                  setLoading
                );
                setSelectedSingleEmployee([record]);
                setSingleAssign(true);
                setIsAssignAll(false);
              }}
            >
              Re-assign
            </button>
          </div>
        </div>
      ),
    },
  ];
};
