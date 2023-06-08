import { InfoOutlined } from "@mui/icons-material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Tooltip } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import AvatarComponent from "../../../../common/AvatarComponent";
import FormikCheckBox from "../../../../common/FormikCheckbox";
import { gray900, greenColor } from "../../../../utility/customColor";
import { todayDate } from "../../../../utility/todayDate";
import moment from "moment";

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

export const offDayAssignDtoCol = (
  pages,
  paginationSize,
  permission,
  updateSingleData,
  setCreateModal,
  setEmpId,
  setSingleData,
  setIsMulti,
  checked,
  setChecked,
  isAlreadyPresent,
  setLanding,
  resLanding,
  setSelectedSingleEmployee,
  setAnchorEl,
  setCalendarData,
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
            // let data = filterLanding.map((item) => ({
            //   // 10
            //   ...item,
            //   selectCheckbox: e.target.checked,
            // }));
            // let data2 = resLanding.map((item) => ({
            //   // 100
            //   ...item,
            //   selectCheckbox: e.target.checked,
            // }));
            // setFilterLanding(data);
            // setLanding(data2);
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
              // let data = filterLanding?.map((item) => {
              //   if (item?.EmployeeId === record?.EmployeeId) {
              //     return {
              //       ...item,
              //       selectCheckbox: e.target.checked,
              //     };
              //   } else return item;
              // });
              // let data2 = resLanding?.map((item) => {
              //   if (item?.EmployeeId === record?.EmployeeId) {
              //     return {
              //       ...item,
              //       selectCheckbox: e.target.checked,
              //     };
              //   } else return item;
              // });
              // setFilterLanding(data);
              // setLanding(data2);
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
          <span style={{ marginLeft: "5px" }}>Code</span>
        </div>
      ),
      dataIndex: "EmployeeCode",
      render: (_, record, index) => (
        <div>
          <span style={{ marginLeft: "5px" }}>{record?.EmployeeCode}</span>
        </div>
      ),
      filter: true,
      sorter: true,
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
      title: "Off Day",
      dataIndex: "offDayList",
    },
    {
      className: "text-center",
      render: (_, record) => (
        <>
          {record?.offDay ? (
            <Tooltip title="Edit" arrow>
              <button type="button" className="iconButton">
                <EditOutlinedIcon
                  sx={{ fontSize: "20px" }}
                  onClick={(e) => {
                    if (!permission?.isEdit)
                      return toast.warn("You don't have permission");
                    updateSingleData(record);
                    setEmpId(record?.EmployeeId);
                    setCreateModal(true);
                  }}
                />
              </button>
            </Tooltip>
          ) : (
            <button
              className="btn btn-default"
              style={{
                height: "24px",
                fontSize: "12px",
                padding: "0px 12px",
              }}
              onClick={(e) => {
                if (!permission?.isCreate)
                  return toast.warn("You don't have permission");
                setIsMulti(false);
                setSingleData({
                  ...record,
                  isEdit: false,
                });
                setCreateModal(true);
              }}
            >
              Assign
            </button>
          )}
        </>
      ),
    },
  ];
};

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
  wgId,
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
    workplaceGroupId: wgId,
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

export const offDayAssignCrud = async (obj) => {
  const {
    values,
    orgId,
    buId,
    employeeId,
    offDayLanding,
    isMulti,
    singleData,
    setLoading,
    cb,
  } = obj;

  try {
    if (!values?.effectiveDate) return toast.warn("Effective date is required");

    let commonObj = {
      accountId: orgId,
      businessUnitId: buId,
      workplaceGroupId: 0, // question
      isActive: true,
      IntCreatedBy: employeeId,
      insertDateTime: todayDate(),
      updateByUserId: "",
      updateDateTime: todayDate(),
    };

    let payload = [];

    if (isMulti) {
      offDayLanding?.forEach((item) => {
        if (item?.selectCheckbox) {
          payload.push({
            ...values,
            employeeId: item?.EmployeeId,
            ...commonObj,
            employeeOffdayAssignId: item?.intEmployeeOffdayAssignId,
          });
        }
      });
    } else {
      payload = [
        {
          ...values,
          employeeId: singleData?.EmployeeId,
          ...commonObj,
          employeeOffdayAssignId: singleData?.intEmployeeOffdayAssignId || 0,
        },
      ];
    }
    setLoading(true);
    await axios.post("/Employee/OffdayAssign", payload);
    setLoading(false);
    cb();
    toast.success("Submitted Successfully");
  } catch (error) {
    setLoading(false);
    toast.warn(error?.response?.data?.message || "Failed, try again");
  }
};
