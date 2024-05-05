/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Attachment,
  Cancel,
  CheckCircle,
  EditOutlined,
  InfoOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import AntTable from "../../../../common/AntTable";
import AvatarComponent from "../../../../common/AvatarComponent";
import BackButton from "../../../../common/BackButton";
import Chips from "../../../../common/Chips";
import FilterBadgeComponent from "../../../../common/FilterBadgeComponent";
import FormikCheckBox from "../../../../common/FormikCheckbox";
import IConfirmModal from "../../../../common/IConfirmModal";
import { LightTooltip } from "../../../../common/LightTooltip";
import MuiIcon from "../../../../common/MuiIcon";
import NoResult from "../../../../common/NoResult";
import PopOverMasterFilter from "../../../../common/PopoverMasterFilter";
import ResetButton from "../../../../common/ResetButton";
import ViewModal from "../../../../common/ViewModal";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { getDownlloadFileView_Action } from "../../../../commonRedux/auth/actions";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import {
  blackColor90,
  failColor,
  gray900,
  greenColor,
  successColor,
} from "../../../../utility/customColor";
import { dateFormatter } from "../../../../utility/dateFormatter";
import {
  getAllAnnouncement,
  getAllLeaveApplicatonListDataForApproval,
  leaveApproveReject,
} from "../helper";
import Loading from "./../../../../common/loading/Loading";
import CreateModal from "./CreateFormModal/CreateModal";
import FilterModal from "./component/FilterModal";
import SingleNotice from "./component/SingleNotice";
import LeaveApprovalEditForm from "./component/editForm";
import "./leaveApproval.css";
import ViewFormComponent from "./view-form";
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

export default function LeaveApproval() {
  const { orgId, employeeId, isOfficeAdmin, wgId, wId, buId } = useSelector(
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
  const [leaveApplicationData, setAllLeaveApplicatonData] = useState([]);
  const [applicationData, setApplicationData] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [viewModal, setViewModal] = useState(false);
  const [imageFile] = useState("");
  const [createModal, setCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [, setAllData] = useState();
  const [filterData, setFilterData] = useState([]);
  const [viewModalRow, setViewModalRow] = useState(false);
  const [, setSingleNoticeData] = useState("");
  const [ApplicationId, setApplicationId] = useState(0);
  const [allNoticeData, setAllNoticeData] = useState([]);
  // filter
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

  const getLandingData = (/* isSupOrLineManager = 1 */) => {
    getAllAnnouncement(ApplicationId, setAllNoticeData);
    getAllLeaveApplicatonListDataForApproval(
      {
        approverId: employeeId,
        workplaceGroupId: wgId,
        businessUnitId: buId,
        // workplaceGroupId: 0,
        workplaceId: wId,
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
  }, [employeeId, orgId, wgId, ApplicationId, wId]);

  // advance filter
  const [filterAnchorEl, setfilterAnchorEl] = useState(null);
  const [filterBages, setFilterBages] = useState({});
  const [filterValues, setFilterValues] = useState({});
  const openFilter = Boolean(filterAnchorEl);
  const id = openFilter ? "simple-popover" : undefined;
  const [show, setShow] = useState(false);
  const [singleApplication, setSingleApplication] = useState({});

  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);

  const handleSearch = (values) => {
    getAllLeaveApplicatonListDataForApproval(
      {
        approverId: employeeId,
        workplaceGroupId: wgId || 0,
        businessUnitId: buId,
        workplaceId: wId,
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
          workplaceGroupId: wgId || 0,
          businessUnitId: buId,
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
          workplaceId: wId,
        },
        setAllLeaveApplicatonData,
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
    const payload = [
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
          workplaceGroupId: wgId || 0,
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
          workplaceId: wId,
          businessUnitId: buId,
        },

        setAllLeaveApplicatonData,
        setAllData,
        setFilterData,
        setLoading
      );
    };
    const confirmObject = {
      closeOnClickOutside: false,
      message: `Do you want to ${action}? `,
      yesAlertFunc: () => {
        leaveApproveReject(payload, callback);
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Leave Approval";
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
            <div>Emp Id</div>
          </div>
        ),
        dataIndex: "employeeCode",
        render: (employeeCode, record) => (
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
                  const leaveAppData = leaveApplicationData?.listData?.map(
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
                  const data = filterData?.listData?.map((item) => {
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
            <div className="ml-2">
              {leaveType}{" "}
              {record?.leaveApplication?.isHalfDay ? "(Half Day)" : ""}
            </div>

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
        render: (dateRange) => (
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
        render: (currentStage) => (
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
                  {isOfficeAdmin ? (
                    <Tooltip title="Edit" arrow>
                      <div
                        className="muiIconHover success "
                        onClick={(e) => {
                          e.stopPropagation();
                          setShow(true);
                          setSingleApplication([]);
                          setSingleApplication(record);
                        }}
                      >
                        <MuiIcon
                          icon={<EditOutlined sx={{ color: blackColor90 }} />}
                        />
                      </div>
                    </Tooltip>
                  ) : null}
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
        width: 120,
      },
    ];
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {
          //
        }}
      >
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
              <div className="leave-approved">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="row my-3">
                        <div className="col-md-12">
                          <div className="heading mt-2">
                            <div className="d-flex align-items-center">
                              <BackButton title={"Leave Approval"} />
                              {filterData?.listData?.filter(
                                (item) => item?.selectCheckbox
                              ).length > 0 ? (
                                <ApproveRejectComp
                                  props={{
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

                            <div>
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
                                    onRowClick={(record) => {
                                      setApplicationId(
                                        record?.leaveApplication
                                          ?.intApplicationId
                                      );
                                      setViewModalRow(true);
                                    }}
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
      <ViewModal
        size="lg"
        title="Details Modification"
        backdrop="static"
        classes="default-modal preview-modal"
        show={viewModalRow}
        onHide={() => {
          setViewModalRow(false);
          setSingleNoticeData("");
        }}
      >
        <SingleNotice
          setViewModalRow={setViewModalRow}
          allNoticeData={allNoticeData}
        />
      </ViewModal>

      <ViewModal
        size="lg"
        title="Edit Leave Application"
        backdrop="static"
        classes="default-modal preview-modal asset-requision-modal"
        show={show}
        onHide={() => {
          setShow(false);
          setSingleApplication([]);
        }}
      >
        <LeaveApprovalEditForm
          objProps={{
            singleApplication,
            setSingleApplication,
            setShow,
            getLandingData,
          }}
        />
      </ViewModal>
    </>
  );
}

// old bulk approve and reject
// <div className="d-flex actionIcon mr-3">
//                                   <Tooltip title="Approve">
//                                     <div
//                                       className="muiIconHover success mr-3"
//                                       onClick={() => {
//                                         demoPopup(
//                                           "approve",
//                                           "isApproved",
//                                           applicationData
//                                         );
//                                       }}
//                                     >
//                                       <MuiIcon
//                                         icon={
//                                           <CheckCircle
//                                             sx={{
//                                               color: successColor,
//                                               width: "25px !important",
//                                               height: "35px !important",
//                                               fontSize: "20px !important",
//                                             }}
//                                           />
//                                         }
//                                       />
//                                     </div>
//                                   </Tooltip>
//                                   <Tooltip title="Reject">
//                                     <div
//                                       className="muiIconHover  danger"
//                                       onClick={() => {
//                                         demoPopup(
//                                           "reject",
//                                           "isReject",
//                                           applicationData
//                                         );
//                                       }}
//                                     >
//                                       <MuiIcon
//                                         icon={
//                                           <Cancel
//                                             sx={{
//                                               color: failColor,
//                                               width: "25px !important",
//                                               height: "35px !important",
//                                               fontSize: "20px !important",
//                                             }}
//                                           />
//                                         }
//                                       />
//                                     </div>
//                                   </Tooltip>
//                                 </div>
