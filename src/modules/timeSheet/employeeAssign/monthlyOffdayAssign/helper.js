import { InfoOutlined } from "@mui/icons-material";
import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";
import AvatarComponent from "../../../../common/AvatarComponent";
import FormikCheckBox from "../../../../common/FormikCheckbox";
import { gray900, greenColor } from "../../../../utility/customColor";

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
  checked
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
  paginationSize,
  permission,
  // filterLanding,
  // setFilterLanding,
  setLanding,
  resLanding,
  setShowModal,
  setSelectedSingleEmployee,
  setSingleAssign,
  setAnchorEl,
  checked,
  setChecked,
  setCalendarData,
  isAlreadyPresent,
  setLoading,
  loading
) => {
  return [
    {
      title: "SL",
      render: (text, record, index) => {
        return (
          <span>
            {pages?.current === 1
              ? index + 1
              : (pages.current - 1) * pages?.pageSize + (index + 1)}
          </span>
        );
      },
      sorter: false,
      filter: false,
      className: "text-center",
    },
    {
      width: "10px",
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
              resLanding?.length > 0
                ? resLanding?.every((item) => item?.selectCheckbox)
                : false
            }
            onChange={(e) => {
              let temp = [...checked];
              let data = resLanding?.map((item) => {
                const newItem = {
                  ...item,
                  selectCheckbox: e.target.checked,
                };

                if (!e.target.checked) {
                  const updatedChecked = temp.filter(
                    (ele) => ele.EmployeeId !== item.EmployeeId
                  );
                  temp = [...updatedChecked];
                  setChecked(updatedChecked);
                } else if (isAlreadyPresent(item) === -1) {
                  setChecked((prev) => [...prev, newItem]);
                }

                return newItem;
              });
              setLanding(data);
            }}
          />
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
            name="selectCheckbox"
            color={greenColor}
            checked={record?.selectCheckbox}
            onChange={(e) => {
              let data = resLanding?.map((item) => {
                if (item?.EmployeeId === record?.EmployeeId) {
                  const idx = isAlreadyPresent(item);
                  if (idx >= 0) {
                    let updatedChecked = [...checked];
                    updatedChecked.splice(idx, 1);
                    setChecked(updatedChecked);
                  } else {
                    setChecked((prev) => [
                      ...prev,
                      { ...item, selectCheckbox: true },
                    ]);
                  }
                  return { ...item, selectCheckbox: !item?.selectCheckbox };
                } else return item;
              });
              setLanding(data);
            }}
          />
        </div>
      ),
    },
    {
      title: () => (
        <div>
          <span style={{ marginLeft: "5px" }}>Employee ID</span>
        </div>
      ),
      dataIndex: "EmployeeCode",
      render: (_, record, index) => (
        <div>
          <span style={{ marginLeft: "5px" }}>{record?.EmployeeCode}</span>
        </div>
      ),
      sorter: true,
      filter: true,
      isNumber: true,
    },
    {
      title: "Employee",
      dataIndex: "EmployeeName",
      render: (EmployeeName, record) => (
        <div className="d-flex align-items-center">
          <AvatarComponent classess="" letterCount={1} label={EmployeeName} />
          <span className="ml-2">{EmployeeName}</span>
          <InfoOutlined
            className="ml-2"
            sx={{ cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation();
              getSingleCalendar(
                moment().format("MM"),
                moment().format("YYYY"),
                record?.EmployeeId,
                setCalendarData,
                setLoading
              );
              !loading && setAnchorEl(e.currentTarget);
              setSelectedSingleEmployee([record]);
            }}
          />
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
      onReset: (e) => {},
    },
    {
      title: "Workplace",
      dataIndex: "WorkplaceName",
      sorter: true,
      filter: true,
    },
    {
      title: "Supervisor",
      dataIndex: "SupervisorName",
      sorter: true,
      filter: true,
    },
    {
      className: "text-center",
      render: (_, record, index) => (
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
              disabled={checked?.length > 0}
              onClick={(e) => {
                if (!permission?.isCreate)
                  return toast.warn("You don't have permission");
                if (!permission?.isCreate)
                  return toast.warn("You don't have permission");
                !loading && setShowModal(true);
                getSingleCalendar(
                  moment().format("MM"),
                  moment().format("YYYY"),
                  record?.EmployeeId,
                  setCalendarData,
                  setLoading
                );
                setSelectedSingleEmployee([record]);
                setSingleAssign(true);
              }}
            >
              Assign
            </button>
          </div>
        </div>
      ),
    },
  ];
};
