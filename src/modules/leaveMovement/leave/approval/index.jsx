/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Attachment,
  Cancel,
  CheckCircle,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { Tooltip, tooltipClasses } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { styled } from "@mui/styles";
import { InfoOutlined } from "@mui/icons-material";
import AntTable from "../../../../common/AntTable";
import AvatarComponent from "../../../../common/AvatarComponent";
import BackButton from "../../../../common/BackButton";
import FilterBadgeComponent from "../../../../common/FilterBadgeComponent";
import FormikCheckBox from "../../../../common/FormikCheckbox";
import IConfirmModal from "../../../../common/IConfirmModal";
import MasterFilter from "../../../../common/MasterFilter";
import MuiIcon from "../../../../common/MuiIcon";
import NoResult from "../../../../common/NoResult";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import PopOverMasterFilter from "../../../../common/PopoverMasterFilter";
import ResetButton from "../../../../common/ResetButton";
import SortingIcon from "../../../../common/SortingIcon";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import {
  failColor,
  gray900,
  greenColor,
  successColor,
} from "../../../../utility/customColor";
import useDebounce from "../../../../utility/customHooks/useDebounce";
import {
  getAllLeaveApplicatonListDataForApproval,
  leaveApproveReject,
} from "../helper";
import Loading from "./../../../../common/loading/Loading";
import FilterModal from "./component/FilterModal";
import LeaveApprovalTable from "./component/LeaveApprovalTable";
import CreateModal from "./CreateFormModal/CreateModal";
import "./leaveApproval.css";
import ViewFormComponent from "./view-form";
import { getDownlloadFileView_Action } from "../../../../commonRedux/auth/actions";
import { dateFormatter } from "../../../../utility/dateFormatter";
import Chips from "../../../../common/Chips";
import { LightTooltip } from "../../../../common/LightTooltip";

const initData = {
  searchString: "",
  workplace: "",
  department: "",
  designation: "",
  employee: "",
  leaveType: "",
  fromDate: "",
  toDate: "",
  appStatus: "",
  type: { value: 1, label: "Supervisor" },
};

export default function LeaveApproval() {
  const { orgId, employeeId, isOfficeAdmin } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // Don't delete this state if you delete you should changes every place in leave folder
  const [appliedStatus, setAppliedStatus] = useState({
    value: 1,
    label: "Pending",
  });
  const [isSupOrLineManager, setIsSupOrLineManager] = useState({
    value: 1,
    label: "Supervisor",
  });
  const [leaveApplicationData, setAllLeaveApplicatonData] = useState([]);
  const [applicationData, setApplicationData] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [viewModal, setViewModal] = useState(false);
  const [imageFile, setImageFile] = useState("");
  const [createModal, setCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [allData, setAllData] = useState();
  const [filterData, setFilterData] = useState([]);
  // filter
  const [empOrder, setEmpOrder] = useState("desc");
  const [designationOrder, setDesignationOrder] = useState("desc");
  const [deptOrder, setDeptOrder] = useState("desc");
  const [dateRangeOrder, setDateRangeOrder] = useState("desc");

  const debounce = useDebounce();
  const dispatch = useDispatch();

  const handleOpen = () => {
    setViewModal(false);
  };

  // for view Modal
  const handleViewClose = () => setViewModal(false);

  // ascending & descending
  const commonSortByFilter = (filterType, property) => {
    const newRowData = [...allData?.listData];
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
    setAllLeaveApplicatonData({ listData: modifyRowData });
  };

  useEffect(() => {
    const array = [];
    filterData?.listData?.forEach((data) => {
      if (data?.selectCheckbox) {
        array.push({
          applicationId: data?.leaveApplication?.intApplicationId,
          fromDate: data?.leaveApplication?.dteFromDate,
          toDate: data?.leaveApplication?.dteToDate,
          approverEmployeeId: employeeId,
          accountId: orgId,
          isAdmin: isOfficeAdmin,
        });
      }
      setApplicationData(array);
    });
  }, [filterData]);

  const searchData = (keywords, allData, setRowDto) => {
    try {
      const regex = new RegExp(keywords?.toLowerCase());
      let newDta = allData?.listData?.filter((item) =>
        regex.test(item?.employeeName?.toLowerCase())
      );
      setRowDto({ listData: newDta });
    } catch {
      setRowDto([]);
    }
  };

  const getLandingData = (/* isSupOrLineManager = 1 */) => {
    getAllLeaveApplicatonListDataForApproval(
      {
        approverId: employeeId,
        workplaceGroupId: 0,
        departmentId: 0,
        designationId: 0,
        applicantId: 0,
        leaveTypeId: 0,
        fromDate: "",
        toDate: "",
        applicationStatus: appliedStatus?.label,
        isAdmin: isOfficeAdmin,
        isSupOrLineManager: 0,
        accountId: orgId,
      },
      setAllLeaveApplicatonData,
      setAllData,
      setFilterData,
      setLoading
    );
  };

  useEffect(() => {
    getLandingData();
  }, [employeeId]);

  // advance filter
  const [filterAnchorEl, setfilterAnchorEl] = useState(null);
  const [filterBages, setFilterBages] = useState({});
  const [filterValues, setFilterValues] = useState({});
  const openFilter = Boolean(filterAnchorEl);
  const id = openFilter ? "simple-popover" : undefined;

  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);

  const handleSearch = (values) => {
    getAllLeaveApplicatonListDataForApproval(
      {
        approverId: employeeId,
        workplaceGroupId: values?.workplace?.id || 0,
        departmentId: values?.department?.id || 0,
        designationId: values?.designation?.id || 0,
        applicantId: values?.employee?.id || 0,
        leaveTypeId: values?.leaveType?.LeaveTypeId || 0,
        fromDate: values?.fromDate || "",
        toDate: values?.toDate || "",
        applicationStatus:
          values?.appStatus?.label === "Rejected"
            ? "Reject"
            : values?.appStatus?.label || "Pending",
        isAdmin: isOfficeAdmin,
        isSupOrLineManager: 0,
        accountId: orgId,
      },
      setAllLeaveApplicatonData,
      setAllData,
      setFilterData,
      setLoading
    );
    setFilterBages(values);
    setfilterAnchorEl(null);
  };
  const clearFilter = () => {
    setFilterBages({});
    setFilterValues("");
    getLandingData();
  };
  const clearBadge = (values, name) => {
    const data = values;
    data[name] = "";
    setFilterBages(data);
    setFilterValues(data);
    handleSearch(data);
  };
  const getFilterValues = (name, value) => {
    setFilterValues((prev) => ({ ...prev, [name]: value }));
  };

  const demoPopup = (action, text, array) => {
    let newArray = [];

    if (array.length > 0) {
      array.forEach((item) => {
        if (text === "isReject") {
          item.isReject = true;
          newArray.push(item);
        } else {
          item.isReject = false;
          newArray.push(item);
        }
      });
    }

    const callback = () => {
      getAllLeaveApplicatonListDataForApproval(
        {
          approverId: employeeId,
          workplaceGroupId: filterValues?.workplace?.id || 0,
          departmentId: filterValues?.department?.id || 0,
          designationId: filterValues?.designation?.id || 0,
          applicantId: filterValues?.employee?.id || 0,
          leaveTypeId: filterValues?.leaveType?.LeaveTypeId || 0,
          fromDate: filterValues?.fromDate || "",
          toDate: filterValues?.toDate || "",
          applicationStatus:
            filterValues?.appStatus?.label === "Rejected"
              ? "Reject"
              : filterValues?.appStatus?.label || "Pending",
          isAdmin: isOfficeAdmin,
          isSupOrLineManager: 0,
          accountId: orgId,
        },
        setAllLeaveApplicatonData,
        setAllData,
        setFilterData,
        setLoading
      );
    };

    let confirmObject = {
      closeOnClickOutside: false,
      message: `Do you want to ${action}? `,
      yesAlertFunc: () => {
        if (array.length) {
          leaveApproveReject(newArray, callback);
        }
        newArray = [];
      },
      noAlertFunc: () => {
        newArray = [];
      },
    };
    IConfirmModal(confirmObject);
  };

  const singlePopup = (action, text, item) => {
    let payload = [
      {
        applicationId: item?.leaveApplication?.intApplicationId,
        fromDate: item?.leaveApplication?.dteFromDate,
        toDate: item?.leaveApplication?.dteToDate,
        approverEmployeeId: employeeId,
        isReject: text === "Approve" ? false : true,
        accountId: orgId,
        isAdmin: isOfficeAdmin,
      },
    ];

    const callback = () => {
      getAllLeaveApplicatonListDataForApproval(
        {
          approverId: employeeId,
          workplaceGroupId: filterValues?.workplace?.id || 0,
          departmentId: filterValues?.department?.id || 0,
          designationId: filterValues?.designation?.id || 0,
          applicantId: filterValues?.employee?.id || 0,
          leaveTypeId: filterValues?.leaveType?.LeaveTypeId || 0,
          fromDate: filterValues?.fromDate || "",
          toDate: filterValues?.toDate || "",
          applicationStatus:
            filterValues?.appStatus?.label === "Rejected"
              ? "Reject"
              : filterValues?.appStatus?.label || "Pending",
          isAdmin: isOfficeAdmin,
          isSupOrLineManager: 0,
          accountId: orgId,
        },

        setAllLeaveApplicatonData,
        setAllData,
        setFilterData,
        setLoading
      );
    };
    let confirmObject = {
      closeOnClickOutside: false,
      message: `Do you want to ${action}? `,
      yesAlertFunc: () => {
        leaveApproveReject(payload, callback);
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);

  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 98) {
      permission = item;
      return;
    }
  });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Approval"));
  }, []);

  const getLandingTable = (setFieldValue, page, paginationSize) => {
    return [
      {
        title: "SL",
        render: (text, record, index) =>
          (page - 1) * paginationSize + index + 1,
        sorter: false,
        filter: false,
        className: "text-center",
      },
      {
        title: () => (
          <div className="d-flex align-items-center">
            <div className="mr-2">
              <FormikCheckBox
                styleObj={{
                  margin: "0 auto!important",
                  padding: "0 !important",
                  color: gray900,
                  checkedColor: greenColor,
                }}
                name="allSelected"
                checked={
                  filterData?.listData?.length > 0 &&
                  filterData?.listData?.every((item) => item?.selectCheckbox)
                }
                onChange={(e) => {
                  setAllLeaveApplicatonData({
                    listData: leaveApplicationData?.listData?.map((item) => ({
                      ...item,
                      selectCheckbox: e.target.checked,
                    })),
                  });
                  setFilterData({
                    listData: filterData?.listData?.map((item) => ({
                      ...item,
                      selectCheckbox: e.target.checked,
                    })),
                  });
                  setFieldValue("allSelected", e.target.checked);
                }}
              />
            </div>
            <div>Employee Id</div>
          </div>
        ),
        dataIndex: "employeeCode",
        render: (employeeCode, record, index) => (
          <div className="d-flex align-items-center">
            <div className="mr-2" onClick={(e) => e.stopPropagation()}>
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
                  e.stopPropagation();
                  let leaveAppData = leaveApplicationData?.listData?.map(
                    (item) => {
                      if (
                        item?.leaveApplication?.intApplicationId ===
                        record?.leaveApplication?.intApplicationId
                      ) {
                        return {
                          ...item,
                          selectCheckbox: e.target.checked,
                        };
                      } else return item;
                    }
                  );
                  let data = filterData?.listData?.map((item) => {
                    if (
                      item?.leaveApplication?.intApplicationId ===
                      record?.leaveApplication?.intApplicationId
                    ) {
                      return {
                        ...item,
                        selectCheckbox: e.target.checked,
                      };
                    } else return item;
                  });
                  setAllLeaveApplicatonData({ listData: [...leaveAppData] });
                  setFilterData({ listData: [...data] });

                  // let data = [...leaveApplicationData?.listData];
                  // data[index].selectCheckbox = e.target.checked;
                  // setAllLeaveApplicatonData({ listData: [...data] });
                }}
              />
            </div>
            <div className="d-flex align-items-center">
              <span className="ml-2">{employeeCode}</span>
            </div>
          </div>
        ),
        sorter: true,
        filter: true,
      },
      {
        title: "Employee",
        dataIndex: "employeeName",
        render: (_, record) => {
          return (
            <div className="d-flex align-items-center">
              <AvatarComponent
                classess=""
                letterCount={1}
                label={record?.employeeName}
              />
              <span className="ml-2">{record?.employeeName}</span>
            </div>
          );
        },
        sorter: true,
        filter: true,
      },
      {
        title: "Designation",
        dataIndex: "designation",
        sorter: true,
        filter: true,
      },
      {
        title: "Department",
        dataIndex: "department",
        sorter: true,
        filter: true,
      },
      {
        title: "Leave Type",
        dataIndex: "leaveType",
        render: (leaveType, record) => (
          <div className="d-flex align-items-center">
            <LightTooltip
              title={
                <div className="movement-tooltip p-1">
                  <div className="border-bottom">
                    <p
                      className="tooltip-title"
                      style={{ fontSize: "12px", fontWeight: "600" }}
                    >
                      Reason
                    </p>
                    <p
                      className="tooltip-subTitle"
                      style={{ fontSize: "12px", fontWeight: "500" }}
                    >
                      {record?.leaveApplication?.strReason}
                    </p>
                  </div>
                  <div>
                    <p
                      className="tooltip-title mt-1"
                      style={{ fontSize: "12px", fontWeight: "600" }}
                    >
                      Location
                    </p>
                    <p
                      className="tooltip-subTitle mb-0"
                      style={{ fontSize: "12px", fontWeight: "500" }}
                    >
                      {record?.leaveApplication?.strAddressDuetoLeave}
                    </p>
                  </div>
                </div>
              }
              arrow
            >
              <InfoOutlined sx={{ color: gray900 }} />
            </LightTooltip>
            <div className="ml-2">{leaveType}</div>

            {record?.intDocumentFileId && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(
                    getDownlloadFileView_Action(record?.intDocumentFileId)
                  );
                }}
              >
                <div className="text-decoration-none file text-primary">
                  <Attachment /> attachment
                </div>
              </div>
            )}
          </div>
        ),
        filter: true,
        sorter: true,
      },
      {
        title: "Date Range",
        dataIndex: "dateRange",
        render: (dateRange, record) => (
          <div className="d-flex align-items-center">
            <div>{dateRange}</div>
          </div>
        ),
        filter: false,
        sorter: false,
      },
      {
        title: "Application Date",
        // dataIndex: "dateRange",
        render: (_, record) => (
          <div className="d-flex align-items-center">
            <div>
              {dateFormatter(record?.leaveApplication?.dteApplicationDate)}
            </div>
          </div>
        ),
        filter: false,
        sorter: false,
      },
      {
        title: "Waiting Stage",
        dataIndex: "currentStage",
        render: (currentStage, record) => (
          <div className="d-flex align-items-center">
            <div>{currentStage}</div>
          </div>
        ),
        filter: true,
        sorter: true,
      },
      {
        title: "Status",
        dataIndex: "status",
        render: (status, record) => (
          <div className="text-center action-chip">
            {status === "Approved" && (
              <Chips label="Approved" classess="success" />
            )}
            {status === "Pending" && (
              <>
                <div className="actionChip">
                  <Chips label="Pending" classess=" warning" />
                </div>
                <div className="d-flex actionIcon justify-content-center">
                  <Tooltip title="Approve">
                    <div
                      className="mx-2 muiIconHover success "
                      onClick={(e) => {
                        e.stopPropagation();
                        singlePopup("approve", "Approve", record);
                      }}
                    >
                      <MuiIcon
                        icon={<CheckCircle sx={{ color: successColor }} />}
                      />
                    </div>
                  </Tooltip>
                  <Tooltip title="Reject">
                    <div
                      className="muiIconHover  danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        singlePopup("reject", "Reject", record);
                      }}
                    >
                      <MuiIcon icon={<Cancel sx={{ color: failColor }} />} />
                    </div>
                  </Tooltip>
                </div>
              </>
            )}
            {status === "Rejected" && (
              <Chips label="Rejected" classess="danger" />
            )}
          </div>
        ),
        filter: true,
        sorter: true,
      },
    ];
  };


  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
          dirty,
        }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              <div className="leave-approved">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="row my-3">
                        <div className="col-md-12">
                          <div className="heading mt-2">
                            <div className="d-flex align-items-center">
                              <BackButton title={"Leave Approval"} />
                              {/* <div className="ml-3">
                                <Tooltip title="Print">
                                  <button
                                    className="btn-save"
                                    type="button"
                                    style={{
                                      border: "transparent",
                                      width: "30px",
                                      height: "30px",
                                      background: "#f2f2f7",
                                      borderRadius: "100px",
                                    }}
                                    onClick={() => {
                                      // getPDFAction(
                                      //   `/emp/PdfAndExcelReport/PdfAllLeaveApplicatonListForApprove?ViewType=${viewType}&EmployeeId=${employeeId}&WorkplaceGroupId=${workplaceGroupId}&DepartmentId=${departmentId}&DesignationId=${designationId}&ApplicantId=${
                                      //     applicantId || 0
                                      //   }&LeaveTypeId=${leaveTypeId}&FromDate=${fromDate}&ToDate=${toDate}&ApplicationId=${0}`,
                                      //   setLoading
                                      // );
                                    }}
                                  >
                                    <PrintIcon
                                      sx={{
                                        color: "#637381",
                                        fontSize: "16px",
                                      }}
                                    />
                                  </button>
                                </Tooltip>
                              </div> */}
                            </div>

                            <div className="table-card-head-right">
                              {filterData?.listData?.filter(
                                (item) => item?.selectCheckbox
                              ).length > 0 && (
                                <div className="d-flex actionIcon mr-3">
                                  <Tooltip title="Approve">
                                    <div
                                      className="muiIconHover success mr-2"
                                      onClick={() => {
                                        demoPopup(
                                          "approve",
                                          "isApproved",
                                          applicationData
                                        );
                                      }}
                                    >
                                      <MuiIcon
                                        icon={
                                          <CheckCircle
                                            sx={{
                                              color: successColor,
                                              width: "16px",
                                              height: "16px",
                                            }}
                                          />
                                        }
                                      />
                                    </div>
                                  </Tooltip>
                                  <Tooltip title="Reject">
                                    <div
                                      className="muiIconHover  danger"
                                      onClick={() => {
                                        demoPopup(
                                          "reject",
                                          "isReject",
                                          applicationData
                                        );
                                      }}
                                    >
                                      <MuiIcon
                                        icon={
                                          <Cancel
                                            sx={{
                                              color: failColor,
                                              width: "16px",
                                              height: "16px",
                                            }}
                                          />
                                        }
                                      />
                                    </div>
                                  </Tooltip>
                                </div>
                              )}
                              <ul className="d-flex flex-wrap">
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
                                        setAppliedStatus({
                                          value: 1,
                                          label: "Pending",
                                        });
                                        setFieldValue("searchString", "");
                                        getLandingData();
                                      }}
                                    />
                                  </li>
                                )}
                                {/* {permission?.isCreate && (
                                  <li>
                                    <MasterFilter
                                      styles={{
                                        marginRight: "0px",
                                      }}
                                      width="200px"
                                      inputWidth="200px"
                                      value={values?.searchString}
                                      setValue={(value) => {
                                        debounce(() => {
                                          searchData(
                                            value,
                                            allData,
                                            setAllLeaveApplicatonData
                                          );
                                        }, 500);
                                        setFieldValue("searchString", value);
                                      }}
                                      cancelHandler={() => {
                                        setFieldValue("searchString", "");
                                        getLandingData();
                                      }}
                                      isHiddenFilter
                                      handleClick={(e) =>
                                        setfilterAnchorEl(e.currentTarget)
                                      }
                                    />
                                  </li>
                                )} */}
                              </ul>
                            </div>
                          </div>
                          <FilterBadgeComponent
                            propsObj={{
                              filterBages,
                              setFieldValue,
                              clearBadge,
                              values: filterValues,
                              resetForm,
                              initData,
                              clearFilter,
                            }}
                          />
                          {permission?.isCreate ? (
                            <div className="table-card-styled table-responsive tableOne">
                              {leaveApplicationData?.listData?.length > 0 ? (
                                <>
                                  <AntTable
                                    data={
                                      leaveApplicationData?.listData?.length > 0
                                        ? leaveApplicationData?.listData
                                        : []
                                    }
                                    columnsData={getLandingTable(
                                      setFieldValue,
                                      page,
                                      paginationSize
                                    )}
                                    setColumnsData={(dataRow) => {
                                      setFilterData({ listData: dataRow });
                                    }}
                                    setPage={setPage}
                                    setPaginationSize={setPaginationSize}
                                    rowKey={(record) =>
                                      record?.leaveApplication?.intApplicationId
                                    }
                                  />
                                </>
                              ) : (
                                <>{!loading && <NoResult title="" para="" />}</>
                              )}
                            </div>
                          ) : (
                            <NotPermittedPage />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* advance filter */}
                <PopOverMasterFilter
                  propsObj={{
                    id,
                    open: openFilter,
                    anchorEl: filterAnchorEl,
                    handleClose: () => setfilterAnchorEl(null),
                    handleSearch,
                    values: filterValues,
                    dirty,
                    initData,
                    resetForm,
                    clearFilter,
                    sx: {},
                    size: "lg",
                  }}
                >
                  <FilterModal
                    propsObj={{
                      getFilterValues,
                      setFieldValue,
                      values,
                      errors,
                      touched,
                    }}
                  />
                </PopOverMasterFilter>

                {/* View Form Modal */}
                <ViewFormComponent
                  objProps={{
                    show: viewModal,
                    title: "Leave Details",
                    onHide: handleViewClose,
                    size: "lg",
                    backdrop: "static",
                    classes: "default-modal",
                    handleOpen,
                    singleData,
                    setSingleData,
                    setCreateModal,
                    appliedStatus,
                    setAllLeaveApplicatonData,
                    imageFile,
                    filterValues,
                    setAllData,
                    isSupOrLineManager,
                  }}
                />
              </div>
            </Form>
          </>
        )}
      </Formik>
      <CreateModal
        objProps={{
          show: createModal,
          size: "lg",
          backdrop: "static",
          classes: "default-modal",
          title: "Leave Reschedule",
          onHide: setCreateModal,
          singleData,
          setSingleData,
          setAllLeaveApplicatonData,
          filterValues,
          setAllData,
          isSupOrLineManager,
        }}
      />
    </>
  );
}
