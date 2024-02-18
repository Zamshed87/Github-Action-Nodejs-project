import { InfoOutlined } from "@mui/icons-material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Tooltip } from "@mui/material";
import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";
import AvatarComponent from "../../../../common/AvatarComponent";

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

export const printDays = (item) => {
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

export const offDayAssignDtoCol = (
  pages,
  paginationSize,
  permission,
  updateSingleData,
  setCreateModal,
  setEmpId,
  setSingleData,
  setIsMulti,
  checkedList,
  setCheckedList,
  // isAlreadyPresent,
  // filterLanding,
  // setFilterLanding,
  setRowDto,
  rowDto,
  setSelectedSingleEmployee,
  setAnchorEl,
  setCalendarData,
  setLoading,
  loading,
  headerList,
  wgName
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
      title: "Off Day",
      dataIndex: "offDayList",
    },
    {
      title: "",
      dataIndex: "",

      className: "text-center",

      render: (record) => (
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
                    setEmpId(record?.employeeId);
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
              disabled={checkedList.length > 1}
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
  ].filter((item) => !item.hidden);
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
    wgId,
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
      workplaceGroupId: wgId, // question
      isActive: true,
      actionBy: employeeId,
    };

    let payload = [];

    if (isMulti) {
      offDayLanding?.forEach((item) => {
        if (item?.isSelected) {
          payload.push({
            ...values,
            employeeId: item?.employeeId,
            ...commonObj,
            employeeOffdayAssignId: item?.employeeOffdayAssignId,
          });
        }
      });
    } else {
      payload = [
        {
          ...values,
          employeeId: singleData?.employeeId,
          ...commonObj,
          employeeOffdayAssignId: singleData?.employeeOffdayAssignId || 0,
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

export const crudOffDayAssign = async (obj) => {
  const {
    values,
    orgId,
    buId,
    wgId,
    employeeId,
    offDayLanding,
    isMulti,
    singleData,
    setLoading,
    cb,
    isAssignAll,
    empIDString,
    wId,
  } = obj;

  try {
    if (!values?.effectiveDate) return toast.warn("Effective date is required");

    let commonObj = {
      ...values,
      accountId: orgId,
      workplaceId: wId,
      businessUnitId: buId,
      workplaceGroupId: wgId, // question
      isActive: true,
      actionBy: employeeId,
    };

    let payload = {};

    if (isMulti) {
      const empIds = offDayLanding.map((data) => {
        return data?.employeeId;
      });
      payload = {
        employeeList: isAssignAll ? empIDString : empIds.join(","),
        ...commonObj,
      };
    } else {
      payload = {
        employeeList: isAssignAll ? empIDString : `${singleData?.employeeId}`,
        ...commonObj,
      };
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
