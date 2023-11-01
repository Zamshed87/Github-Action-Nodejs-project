/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { MenuItem } from "@material-ui/core";
import {
  ArrowDropDown,
  CheckCircle,
  Info,
  SettingsBackupRestoreOutlined,
  Unpublished
} from "@mui/icons-material";
import { Select } from "@mui/material";
import { Form, Formik } from "formik";
import moment from "moment";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import companyLogo from "../../../assets/images/company/logo.png";
import AvatarComponent from "../../../common/AvatarComponent";
import Chips from "../../../common/Chips";
import FormikCheckBox from "../../../common/FormikCheckbox";
import FormikSelectWithIcon from "../../../common/FormikSelectWithIcon";
import IConfirmModal from "../../../common/IConfirmModal";
import Loading from "../../../common/loading/Loading";
import MasterFilter from "../../../common/MasterFilter";
import NoResult from "../../../common/NoResult";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import ResetButton from "../../../common/ResetButton";
import SortingIcon from "../../../common/SortingIcon";
import DashboardHead from "../../../layout/dashboardHead/DashboardHead";
import SideMenu from "../../../layout/menuComponent/SideMenu";
import { greenColor } from "../../../utility/customColor";
import {
  dateFormatter,
  dateFormatterForInput
} from "../../../utility/dateFormatter";
import { customStyles } from "../../../utility/selectCustomStyle";
import { timeFormatter } from "../../../utility/timeFormatter";
import { todayDate } from "../../../utility/todayDate";
import "./attendanceAdjust.css";
import FilterModal from "./component/FilterModal";
import {
  filterData,
  getAttendanceAdjustmentFilter,
  manualAttendanceAction
} from "./helper";

// status DDL
const statusDDL = [
  { value: "present", label: "Present" },
  { value: "late", label: "Late" },
  { value: "absent", label: "Absent" },
];

const initData = {
  search: "",
  status: "",
  attendedanceAdjustStatus: "",
  attendedanceStatus: "",
  allSelected: false,

  // master filter
  workplace: "",
  department: "",
  employee: "",
  attendenceDate: "",
  attendenceStatus: "",
  employmentType: "",
  monthYear: "",
};

export default function EmAttendenceAdjust() {
  const [loading, setLoading] = useState(false);

  // row data
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);
  const [isFilter, setIsFilter] = useState(false);

  // filter
  const [status, setStatus] = useState("");
  const [viewOrder, setViewOrder] = useState("desc");
  const [designationOrder, setDesignationOrder] = useState("desc");
  const [deptOrder, setDeptOrder] = useState("desc");
  const [dateOrder, setDateOrder] = useState("desc");

  // master filter
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const { userId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const getData = (values, initData) => {
    const payload = {
      employeeId:
        values?.employee?.value >= 0 ? values?.employee?.value : employeeId,
      workplaceGroupId: values?.workplace?.value || 0,
      departmentId: values?.department?.value || 0,
      attendanceStatus: values?.attendenceStatus?.code || "all",
      punchStatus: "all",
      jobTypeId: values?.employmentType?.value || 0,
      businessUnitId: buId,
      yearId: values?.yearId || new Date().getFullYear(),
      monthId: values?.monthId || new Date().getMonth() + 1,
      applicationDate: values?.attendenceDate || null,
    };

    // if (values?.attendenceDate) {
    //   getAttendanceAdjustmentFilter(setAllData, setRowDto, setLoading, {
    //     ...payload,
    //     applicationDate: values?.attendenceDate,
    //   });
    // }
    // if (values?.monthYear) {
    //   getAttendanceAdjustmentFilter(setAllData, setRowDto, setLoading, {
    //     ...payload,
    //     yearId: values?.yearId,
    //     monthId: values?.monthId,
    //   });
    // }
    // if (!values?.attendenceDate && !values?.monthYear) {
    getAttendanceAdjustmentFilter(setAllData, setRowDto, setLoading, payload);
    // }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId, buId]);

  //  adjustStatushandler
  const adjustStatushandler = (values, setFieldValue, valueOption) => {
    let confirmObject = {
      closeOnClickOutside: false,
      message: ` Are you sure?`,
      yesAlertFunc: () => {
        const modifyFilterRowDto = rowDto.filter(
          (itm) => itm.presentStatus === true
        );
        const payload = modifyFilterRowDto.map((item) => {
          return {
            id: item?.ManualAttendanceId || 0,
            attendanceSummaryId: item?.AutoId,
            employeeId: item?.EmployeeId,
            attendanceDate: item?.AttendanceDate,
            inTime: item?.StartTime,
            outTime: item?.EndTime,
            status: item?.isPresent
              ? "present"
              : item?.isLeave
              ? "leave"
              : "absent",
            requestStatus: valueOption?.code,
            remarks: "By HR",
            isApproved: true,
            isActive: true,
            insertUserId: userId,
            insertDateTime: todayDate(),
          };
        });
        const callBack = () => {
          getAttendanceAdjustmentFilter(setAllData, setRowDto, setLoading, {
            employeeId: employeeId || 0,
            workplaceGroupId: 0,
            departmentId: 0,
            applicationDate: todayDate(),
            attendanceStatus: "all",
            punchStatus: "all",
            jobTypeId: 0,
            businessUnitId: buId,
          });
          setFieldValue("attendedanceStatus", "");
        };
        manualAttendanceAction(payload, setLoading, callBack);
      },
      noAlertFunc: () => {
        setFieldValue("attendedanceStatus", "");
      },
    };
    IConfirmModal(confirmObject);
  };

  // active & inactive filter
  const statusTypeFilter = (statusType) => {
    const newRowData = [...allData];
    let modifyRowData = [];
    if (statusType === "Present") {
      modifyRowData = newRowData?.filter((item) => item?.isPresent === true);
    } else if (statusType === "Late") {
      modifyRowData = newRowData?.filter((item) => item?.isLate === true);
    } else if (statusType === "Absent") {
      modifyRowData = newRowData?.filter((item) => item?.isAbsent === true);
    }
    setRowDto(modifyRowData);
  };

  // ascending & descending
  const commonSortByFilter = (filterType, property) => {
    const newRowData = [...allData];
    let modifyRowData = [];

    if (filterType === "asc") {
      modifyRowData = newRowData?.sort((a, b) => {
        if (a[property] > b[property]) return -1;
        return 1;
      });
    } else {
      modifyRowData = newRowData?.sort((a, b) => {
        if (b[property] > a[property]) return -1;
        return 1;
      });
    }
    setRowDto(modifyRowData);
  };

  //  all Grid Check
  const allGridCheck = (value) => {
    const modifyRowData = rowDto?.map((item) => ({
      ...item,
      presentStatus: value,
    }));
    setRowDto(modifyRowData);
  };

  // single grid check
  const rowDtoHandler = (index) => {
    const copyRowDto = [...rowDto];
    copyRowDto[index].presentStatus = !copyRowDto[index].presentStatus;
    setRowDto(copyRowDto);
  };

  const masterFilterHandler = (values, initData) => {
    getData(values, initData);
    setAnchorEl(null);
  };

  const saveHandler = (values) => {};

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 57) {
      permission = item;
    }
  });

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              <DashboardHead
                companyLogo={companyLogo}
                moduleTitle={"Employee Management"}
              />
              <div className="all-candidate">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-2">
                      <SideMenu />
                    </div>
                    {permission?.isView ? (
                      <div className="col-md-10">
                        <div className="table-card">
                          <div className="table-card-heading ">
                            <div className="d-flex align-items-center"></div>
                            <div className="table-card-head-right">
                              <ul>
                                {isFilter && (
                                  <li>
                                    <ResetButton
                                      title="reset"
                                      icon={
                                        <SettingsBackupRestoreOutlined
                                          sx={{ marginRight: "10px" }}
                                        />
                                      }
                                      onClick={() => {
                                        setIsFilter(false);
                                        getData();
                                        // getAttendanceAdjustmentFilter(
                                        //   setAllData,
                                        //   setRowDto,
                                        //   setLoading,
                                        //   {
                                        //     employeeId: employeeId || 0,
                                        //     workplaceGroupId: 0,
                                        //     departmentId: 0,
                                        //     applicationDate: todayDate(),
                                        //     attendanceStatus: "all",
                                        //     punchStatus: "all",
                                        //     jobTypeId: 0,
                                        //     businessUnitId: buId,
                                        //   }
                                        // );
                                        setRowDto(allData);
                                        setFieldValue("allSelected", false);
                                        setFieldValue("attendedanceStatus", "");
                                        setFieldValue(
                                          "attendedanceAdjustStatus",
                                          ""
                                        );
                                        setFieldValue("search", "");
                                        setStatus("");
                                      }}
                                    />
                                  </li>
                                )}
                                <li>
                                  {rowDto?.length > 0 &&
                                    rowDto?.filter(
                                      (item) => item?.presentStatus
                                    ).length > 0 && (
                                      <div
                                        style={{
                                          width: "300px",
                                          marginRight: "15px",
                                        }}
                                      >
                                        <FormikSelectWithIcon
                                          name="attendedanceAdjustStatus"
                                          options={[
                                            {
                                              value: 1,
                                              label: "Present",
                                              code: "present",
                                              icon: <CheckCircle />,
                                            },
                                            {
                                              value: 2,
                                              label: "Absent",
                                              code: "absent",
                                              icon: <Unpublished />,
                                            },
                                            {
                                              value: 3,
                                              label: "Late",
                                              code: "late",
                                              icon: <Info />,
                                            },
                                          ]}
                                          value={
                                            values?.attendedanceAdjustStatus
                                          }
                                          onChange={(valueOption) => {
                                            if (!permission?.isCreate)
                                              return toast.warn(
                                                "You don't have permission"
                                              );

                                            if (valueOption) {
                                              adjustStatushandler(
                                                values,
                                                setFieldValue,
                                                valueOption
                                              );
                                            }

                                            setFieldValue(
                                              "attendedanceAdjustStatus",
                                              valueOption
                                            );
                                          }}
                                          placeholder="Change Attendance"
                                          styles={customStyles}
                                          errors={errors}
                                          touched={touched}
                                          isDisabled={false}
                                        />
                                      </div>
                                    )}
                                </li>
                                <li>
                                  <MasterFilter
                                    value={values?.search}
                                    setValue={(value) => {
                                      setIsFilter(true);
                                      filterData(value, allData, setRowDto);
                                      setFieldValue("search", value);
                                    }}
                                    cancelHandler={() => {
                                      setIsFilter(false);
                                      setFieldValue("search", "");
                                      getData();
                                    }}
                                    handleClick={handleClick}
                                    width="200px"
                                    inputWidth="200px"
                                  />
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="table-card-body">
                            <div className="table-card-styled tableOne">
                              {rowDto?.length > 0 ? (
                                <>
                                  <table className="table">
                                    <thead>
                                      <tr>
                                        <th
                                          scope="col"
                                          className="checkBoxCol p-0 m-0"
                                        >
                                          <FormikCheckBox
                                            styleObj={{
                                              margin: "0 auto!important",
                                              color: greenColor,
                                            }}
                                            name="allSelected"
                                            checked={
                                              rowDto?.length > 0 &&
                                              rowDto?.every(
                                                (item) => item?.presentStatus
                                              )
                                            }
                                            onChange={(e) => {
                                              allGridCheck(e.target.checked);
                                              setRowDto(
                                                rowDto?.map((item) => ({
                                                  ...item,
                                                  presentStatus:
                                                    e.target.checked,
                                                }))
                                              );
                                              setFieldValue(
                                                "allSelected",
                                                e.target.checked
                                              );
                                            }}
                                          />
                                        </th>
                                        <th>
                                          <div
                                            className="d-flex align-items-center pointer"
                                            onClick={() => {
                                              setViewOrder(
                                                viewOrder === "desc"
                                                  ? "asc"
                                                  : "desc"
                                              );
                                              commonSortByFilter(
                                                viewOrder,
                                                "EmployeeName"
                                              );
                                            }}
                                          >
                                            Employee
                                            <div>
                                              <SortingIcon
                                                viewOrder={viewOrder}
                                              ></SortingIcon>
                                            </div>
                                          </div>
                                        </th>

                                        <th>
                                          <div
                                            className="d-flex align-items-center pointer"
                                            onClick={() => {
                                              setDesignationOrder(
                                                designationOrder === "desc"
                                                  ? "asc"
                                                  : "desc"
                                              );
                                              commonSortByFilter(
                                                designationOrder,
                                                "DesignationName"
                                              );
                                            }}
                                          >
                                            Designation
                                            <div>
                                              <SortingIcon
                                                viewOrder={designationOrder}
                                              ></SortingIcon>
                                            </div>
                                          </div>
                                        </th>
                                        <th>
                                          <div
                                            className="d-flex align-items-center pointer"
                                            onClick={() => {
                                              setDeptOrder(
                                                deptOrder === "desc"
                                                  ? "asc"
                                                  : "desc"
                                              );
                                              commonSortByFilter(
                                                deptOrder,
                                                "DepartmentName"
                                              );
                                            }}
                                          >
                                            Department
                                            <div>
                                              <SortingIcon
                                                viewOrder={deptOrder}
                                              ></SortingIcon>
                                            </div>
                                          </div>
                                        </th>
                                        <th>
                                          <div
                                            className="d-flex align-items-center justify-content-end pointer "
                                            onClick={() => {
                                              setDateOrder(
                                                dateOrder === "desc"
                                                  ? "asc"
                                                  : "desc"
                                              );
                                              commonSortByFilter(
                                                dateOrder,
                                                "AttendanceDate"
                                              );
                                            }}
                                          >
                                            Attendance Date
                                            <div>
                                              <SortingIcon
                                                viewOrder={dateOrder}
                                              ></SortingIcon>
                                            </div>
                                          </div>
                                        </th>
                                        <th>
                                          <div className="d-flex align-items-center justify-content-center">
                                            In-Time
                                          </div>
                                        </th>
                                        <th>
                                          <div className="d-flex align-items-center justify-content-center">
                                            Out-Time
                                          </div>
                                        </th>
                                        <th>
                                          <div className="d-flex align-items-center text-center  ">
                                            Request Status
                                          </div>
                                        </th>
                                        <th>
                                          <div className="table-th d-flex align-items-center justify-content-center">
                                            Status
                                            <span>
                                              <Select
                                                sx={{
                                                  "& .MuiOutlinedInput-notchedOutline":
                                                    {
                                                      border: "none !important",
                                                    },
                                                  "& .MuiSelect-select": {
                                                    paddingRight:
                                                      "22px !important",
                                                    marginTop: "-15px",
                                                  },
                                                }}
                                                className="selectBtn"
                                                name="status"
                                                IconComponent={ArrowDropDown}
                                                value={values?.status}
                                                onChange={(e) => {
                                                  setFieldValue("status", "");
                                                  setIsFilter(true);
                                                  setStatus(
                                                    e.target.value?.label
                                                  );
                                                  statusTypeFilter(
                                                    e.target.value?.label
                                                  );
                                                }}
                                              >
                                                {statusDDL?.length > 0 &&
                                                  statusDDL?.map(
                                                    (item, index) => {
                                                      return (
                                                        <MenuItem
                                                          key={index}
                                                          value={item}
                                                        >
                                                          {item?.label}
                                                        </MenuItem>
                                                      );
                                                    }
                                                  )}
                                              </Select>
                                            </span>
                                          </div>
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {rowDto?.map((item, index) => {
                                        return (
                                          <>
                                            <tr key={index}>
                                              <td className="checkBoxCol p-0 m-0">
                                                <div
                                                  onClick={(e) =>
                                                    e.stopPropagation()
                                                  }
                                                >
                                                  <FormikCheckBox
                                                    styleObj={{
                                                      margin:
                                                        "0 auto!important",
                                                      color: greenColor,
                                                    }}
                                                    name="presentStatus"
                                                    color={greenColor}
                                                    checked={
                                                      item?.presentStatus
                                                    }
                                                    onChange={() => {
                                                      rowDtoHandler(index);
                                                    }}
                                                  />
                                                </div>
                                              </td>
                                              <td>
                                                <div className="employeeInfo d-flex align-items-center">
                                                  <AvatarComponent
                                                    letterCount={1}
                                                    label={item?.EmployeeName}
                                                  />
                                                  <div className="employeeTitle ml-3">
                                                    <p className="employeeName">
                                                      {item?.EmployeeName} [
                                                      {item?.EmployeeCode}]
                                                    </p>
                                                  </div>
                                                </div>
                                              </td>

                                              <td>
                                                <div className="content tableBody-title">
                                                  {item?.DesignationName}
                                                </div>
                                              </td>
                                              <td>
                                                <div className="content tableBody-title">
                                                  {item?.DepartmentName}
                                                </div>
                                              </td>
                                              <td className="text-right">
                                                {dateFormatter(
                                                  item?.AttendanceDate
                                                )}
                                                (
                                                {moment(
                                                  dateFormatterForInput(
                                                    item?.AttendanceDate
                                                  )
                                                )
                                                  .format("dddd")
                                                  .slice(0, 3)}
                                                )
                                              </td>
                                              <td className="text-center">
                                                {item?.InTime === null
                                                  ? "-"
                                                  : timeFormatter(
                                                      `${item?.InTime}`
                                                    )}
                                              </td>
                                              <td className="text-center">
                                                {item?.OutTime === null
                                                  ? "-"
                                                  : timeFormatter(
                                                      `${item?.OutTime}`
                                                    )}
                                              </td>
                                              <td className="text-center">
                                                {item?.RequestStatus ===
                                                  "Present" && (
                                                  <Chips
                                                    label="Present"
                                                    classess="success p-2"
                                                  />
                                                )}
                                                {item?.RequestStatus ===
                                                  "Late" && (
                                                  <Chips
                                                    label="Late"
                                                    classess="warning p-2"
                                                  />
                                                )}
                                                {item?.RequestStatus ===
                                                  "Absent" && (
                                                  <Chips
                                                    label="Absent"
                                                    classess="danger p-2"
                                                  />
                                                )}
                                                {item?.RequestStatus ===
                                                  "Leave" && (
                                                  <Chips
                                                    label="Leave"
                                                    classess="indigo p-2"
                                                  />
                                                )}
                                                {item?.RequestStatus ===
                                                  "Movement" && (
                                                  <Chips
                                                    label="Movement"
                                                    classess="movement p-2"
                                                  />
                                                )}
                                              </td>
                                              <td className="text-center">
                                                {/* {item?.isPresent && (
                                                <Chips
                                                  label="Present"
                                                  classess="success p-2"
                                                />
                                              )}
                                              {item?.isLate && (
                                                <Chips
                                                  label="Late"
                                                  classess="warning p-2"
                                                />
                                              )}
                                              {item?.isAbsent && (
                                                <Chips
                                                  label="Absent"
                                                  classess="danger p-2"
                                                />
                                              )} */}
                                                {item?.isLate ? (
                                                  <Chips
                                                    label="Late"
                                                    classess="warning p-2"
                                                  />
                                                ) : item?.isAbsent ? (
                                                  <Chips
                                                    label="Absent"
                                                    classess="danger p-2"
                                                  />
                                                ) : (
                                                  item?.isPresent && (
                                                    <Chips
                                                      label="Present"
                                                      classess="success p-2"
                                                    />
                                                  )
                                                )}
                                              </td>
                                            </tr>
                                          </>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </>
                              ) : (
                                <>
                                  {!loading && (
                                    <NoResult title="No Result Found" para="" />
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <NotPermittedPage />
                    )}
                  </div>
                </div>

                <FilterModal
                  propsObj={{
                    id,
                    open,
                    anchorEl,
                    handleClose,
                    setFieldValue,
                    values,
                    errors,
                    touched,
                    setIsFilter,
                    initData,
                    resetForm,
                  }}
                  masterFilterHandler={masterFilterHandler}
                ></FilterModal>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
