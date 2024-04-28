/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Attachment,
  Cancel,
  CheckCircle,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { Tooltip, tooltipClasses } from "@mui/material";
import { styled } from "@mui/styles";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import AvatarComponent from "../../../../common/AvatarComponent";
import BackButton from "../../../../common/BackButton";
import Chips from "../../../../common/Chips";
import FilterBadgeComponent from "../../../../common/FilterBadgeComponent";
import FormikCheckBox from "../../../../common/FormikCheckbox";
import IConfirmModal from "../../../../common/IConfirmModal";
import Loading from "../../../../common/loading/Loading";
import MuiIcon from "../../../../common/MuiIcon";
import NoResult from "../../../../common/NoResult";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import PopOverMasterFilter from "../../../../common/PopoverMasterFilter";
import ResetButton from "../../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import {
  failColor,
  gray900,
  greenColor,
  successColor,
} from "../../../../utility/customColor";
import { dateFormatter } from "../../../../utility/dateFormatter";
import CreateModal from "../common/CreateModal";
import FilterModal from "./component/FilterModal";
import {
  getAllLoanApplicatonListDataForApproval,
  loanApproveReject,
} from "./helper";
import ViewFormComponent from "./view-form";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { getDownlloadFileView_Action } from "../../../../commonRedux/auth/actions";
import AntTable from "../../../../common/AntTable";
import ApproveRejectComp from "common/ApproveRejectComp";

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

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "#fff !important",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#fff",
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow:
      "0px 1px 5px rgba(0, 0, 0, 0.05), 0px 2px 10px rgba(0, 0, 0, 0.08), 0px 2px 10px rgba(0, 0, 0, 0.08), 0px 1px 5px rgba(0, 0, 0, 0.05)",
    fontSize: 11,
  },
}));

export default function LoanApproval() {
  const { orgId, employeeId, isOfficeAdmin, buId, wId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // Don't delete this state if you delete you should changes every place in leave folder
  const [appliedStatus, setAppliedStatus] = useState({
    value: 1,
    label: "Pending",
  });
  const [isSupOrLineManager] = useState({
    value: 1,
    label: "Supervisor",
  });
  const [loanApplicationData, setAllLoanApplicatonData] = useState([]);
  const [applicationData, setApplicationData] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [viewModal, setViewModal] = useState(false);
  const [imageFile] = useState("");
  const [createModal, setCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [, setAllData] = useState();
  const [filterData, setFilterData] = useState([]);

  const dispatch = useDispatch();

  const handleOpen = () => {
    setViewModal(false);
  };

  // for view Modal
  const handleViewClose = () => setViewModal(false);

  useEffect(() => {
    const array = [];
    filterData?.listData?.forEach((data) => {
      if (data?.selectCheckbox) {
        array.push({
          applicationId: data?.intLoanApplicationId,
          fromDate: data?.application?.dteFromDate || "",
          toDate: data?.application?.dteToDate || "",
          approverEmployeeId: employeeId,
          accountId: orgId,
          isAdmin: isOfficeAdmin,
        });
      }
      setApplicationData(array);
    });
  }, [filterData]);

  const getLandingData = () => {
    getAllLoanApplicatonListDataForApproval(
      {
        approverId: employeeId,
        workplaceGroupId: wgId,
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
        businessUnitId: buId,
        workplaceId: wId,
      },
      setAllLoanApplicatonData,
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
    getAllLoanApplicatonListDataForApproval(
      {
        approverId: employeeId,
        workplaceGroupId: values?.workplace?.id || wgId,
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
        businessUnitId: buId,
        workplaceId: wId,
      },

      setAllLoanApplicatonData,
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
      getAllLoanApplicatonListDataForApproval(
        {
          approverId: employeeId,
          workplaceGroupId: filterValues?.workplace?.id || wgId,
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
          businessUnitId: buId,
          workplaceId: wId,
        },
        setAllLoanApplicatonData,
        setAllData,
        setFilterData,
        setLoading
      );
    };

    const confirmObject = {
      closeOnClickOutside: false,
      message: `Do you want to ${action}? `,
      yesAlertFunc: () => {
        if (array.length) {
          loanApproveReject(newArray, callback);
        }
        newArray = [];
      },
      noAlertFunc: () => {
        newArray = [];
      },
    };
    IConfirmModal(confirmObject);
  };

  const demoPopupForTable = (action, text, item) => {
    const payload = [
      {
        applicationId: item?.intLoanApplicationId,
        fromDate: item?.application?.dteEffectiveDate || null,
        toDate: item?.application?.dteToDate || null,
        approverEmployeeId: employeeId,
        isReject: text === "Approve" ? false : true,
        accountId: orgId,
        isAdmin: isOfficeAdmin,
      },
    ];

    const callback = () => {
      getAllLoanApplicatonListDataForApproval(
        {
          approverId: employeeId,
          workplaceGroupId: filterValues?.workplace?.id || wgId,
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
          businessUnitId: buId,
          workplaceId: wId,
        },

        setAllLoanApplicatonData,
        setAllData,
        setFilterData,
        setLoading
      );
    };
    const confirmObject = {
      closeOnClickOutside: false,
      message: `Do you want to ${action}? `,
      yesAlertFunc: () => {
        loanApproveReject(payload, callback);
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 108) {
      return (permission = item);
    }
  });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Approval"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Loan Approval";
  }, []);

  const columns = (setFieldValue, page, paginationSize) => {
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
                  loanApplicationData?.listData?.length > 0 &&
                  loanApplicationData?.listData?.every(
                    (item) => item?.selectCheckbox
                  )
                }
                onChange={(e) => {
                  setAllLoanApplicatonData({
                    listData: loanApplicationData?.listData?.map((item) => ({
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
          </div>
        ),
        dataIndex: "",
        render: (_, record) => (
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
                  const loanAppData = loanApplicationData?.listData?.map(
                    (item) => {
                      if (
                        item?.application?.intLoanApplicationId ===
                        record?.application?.intLoanApplicationId
                      ) {
                        return {
                          ...item,
                          selectCheckbox: e.target.checked,
                        };
                      } else return item;
                    }
                  );
                  const data = filterData?.listData?.map((item) => {
                    if (
                      item?.application?.intLoanApplicationId ===
                      record?.application?.intLoanApplicationId
                    ) {
                      return {
                        ...item,
                        selectCheckbox: e.target.checked,
                      };
                    } else return item;
                  });
                  setAllLoanApplicatonData({ listData: [...loanAppData] });
                  setFilterData({ listData: [...data] });
                }}
              />
            </div>
          </div>
        ),
        sorter: false,
        filter: false,
      },
      {
        title: "Employee",
        dataIndex: "strEmployeeName",
        render: (data) => (
          <div className="employeeInfo d-flex align-items-center">
            <AvatarComponent letterCount={1} label={data} />
            <div className=" ml-2">
              <div>{data}</div>
            </div>
          </div>
        ),
        sorter: true,
        filter: true,
      },
      {
        title: "Designation",
        dataIndex: "strDesignation",
        sorter: true,
        filter: true,
      },
      {
        title: "Department",
        dataIndex: "strDepartment",
        render: (data) => <div>{data ? data : "-"}</div>,
        sorter: true,
        filter: true,
      },
      {
        title: "Loan Type",
        dataIndex: "application",
        render: (_, item) => (
          <div className="d-flex align-items-center justify-content-start">
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
                      {item?.application?.strDescription}
                    </p>
                  </div>
                  <div>
                    <p
                      className="tooltip-title mt-1"
                      style={{ fontSize: "12px", fontWeight: "600" }}
                    >
                      Attachment
                    </p>
                    <p
                      className="tooltip-subTitle mb-0"
                      style={{ fontSize: "12px", fontWeight: "500" }}
                    >
                      {item?.application?.intFileUrlId ? (
                        <div
                          style={{ cursor: "pointer" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(
                              getDownlloadFileView_Action(
                                item?.application?.intFileUrlId
                              )
                            );
                          }}
                        >
                          <div className="text-decoration-none file text-primary">
                            <Attachment /> attachment
                          </div>
                        </div>
                      ) : (
                        "N/A"
                      )}
                    </p>
                  </div>
                </div>
              }
              arrow
            >
              <InfoOutlinedIcon sx={{ color: gray900 }} />
            </LightTooltip>
            <div className="ml-2"> {item?.strLoanType}</div>
          </div>
        ),
        sorter: false,
        filter: false,
      },
      {
        title: "Loan Amount",
        render: (_, record) => <div>{record?.application?.intLoanAmount}</div>,
        filter: false,
        sorter: false,
      },
      {
        title: "Ins. Amount",
        render: (_, record) => (
          <div>{record?.application?.intNumberOfInstallmentAmount}</div>
        ),
        filter: false,
        sorter: false,
      },
      {
        title: "Ins. Number",
        render: (_, record) => (
          <div>{record?.application?.intNumberOfInstallment}</div>
        ),
        filter: false,
        sorter: false,
      },
      {
        title: "Effective Date",
        render: (_, record) => (
          <div>{dateFormatter(record?.application?.dteEffectiveDate)}</div>
        ),
        filter: false,
        sorter: false,
      },
      {
        title: "Application Date",
        render: (_, record) => (
          <div>{dateFormatter(record?.application?.dteApplicationDate)}</div>
        ),
        filter: false,
        sorter: false,
      },
      {
        title: "Waiting Stage",
        dataIndex: "currentStage",
        filter: false,
        sorter: false,
        hidden: isOfficeAdmin ? false : true,
      },
      {
        title: "Status",
        dataIndex: "ApprovalStatus",
        render: (_, record) => (
          <div className="text-center action-chip" style={{ width: "70px" }}>
            {record?.application?.strStatus === "Approved" && (
              <Chips label="Approved" classess="success" />
            )}
            {record?.application?.strStatus === "Pending" && (
              <>
                <div className="actionChip">
                  <Chips label="Pending" classess=" warning" />
                </div>
                <div className="d-flex actionIcon justify-content-center">
                  {/* <Tooltip title="Edit">
                <div
                  className="mr-0 muiIconHover success "
                  onClick={(e) => {
                    e.stopPropagation();
                    setCreateModal(true);
                    setSingleData(item);
                  }}
                >
                  <MuiIcon
                    icon={
                      <EditOutlinedIcon sx={{ color: "rgba(0, 0, 0, 0.6)" }} />
                    }
                  />
                </div>
              </Tooltip> */}
                  <Tooltip title="Approve">
                    <div
                      className="mx-2 muiIconHover success "
                      onClick={(e) => {
                        e.stopPropagation();
                        demoPopupForTable("approve", "Approve", record);
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
                        demoPopupForTable("reject", "Reject", record);
                      }}
                    >
                      <MuiIcon icon={<Cancel sx={{ color: failColor }} />} />
                    </div>
                  </Tooltip>
                </div>
              </>
            )}
            {record?.status === "Rejected" && (
              <Chips label="Rejected" classess="danger" />
            )}
          </div>
        ),
        filter: false,
        sorter: false,
      },
    ];
  };

  return (
    <>
      <Formik enableReinitialize={true} initialValues={initData}>
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          dirty,
        }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              <div className=" leave-approved">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="row my-3">
                        <div className="col-md-12">
                          <div className="heading mt-2">
                            <div className="d-flex align-items-center">
                              <BackButton title={"Loan Approval"} />
                              {filterData?.listData?.filter(
                                (item) => item?.selectCheckbox
                              ).length > 0 ? (
                                <ApproveRejectComp
                                  props={{
                                    className: "ml-3",
                                    onApprove: () => {
                                      demoPopup(
                                        "approve",
                                        "isApproved",
                                        applicationData
                                      );
                                    },
                                    onReject: () => {
                                      demoPopup(
                                        "reject",
                                        "isReject",
                                        applicationData
                                      );
                                    },
                                  }}
                                />
                              ) : null}
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
                              {loanApplicationData?.listData?.length > 0 ? (
                                <AntTable
                                  data={loanApplicationData?.listData}
                                  columnsData={columns(
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
                                    record?.application?.intLoanApplicationId
                                  }
                                />
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
                    setAllLoanApplicatonData,
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
          setAllLeaveApplicatonData: setAllLoanApplicatonData,
          filterValues,
          setAllData,
          isSupOrLineManager,
        }}
      />
    </>
  );
}
