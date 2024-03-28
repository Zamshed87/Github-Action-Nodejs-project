import {
  Cancel,
  CheckCircle,
  InfoOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { Tooltip, tooltipClasses } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { styled } from "@mui/styles";
import { toast } from "react-toastify";
import BackButton from "../../../common/BackButton";
import FilterBadgeComponent from "../../../common/FilterBadgeComponent";
import IConfirmModal from "../../../common/IConfirmModal";
import Loading from "../../../common/loading/Loading";
import MasterFilter from "../../../common/MasterFilter";
import MuiIcon from "../../../common/MuiIcon";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import PopOverMasterFilter from "../../../common/PopoverMasterFilter";
import ResetButton from "../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import {
  failColor,
  gray900,
  greenColor,
  successColor,
} from "../../../utility/customColor";
import useDebounce from "../../../utility/customHooks/useDebounce";
import FilterModal from "./component/FilterModal";
import { getAllIOUListDataForApproval, IOUApproveReject } from "./helper";

import "./index.css";
import ViewFormComponent from "./view-form";
import FormikCheckBox from "../../../common/FormikCheckbox";
import AvatarComponent from "../../../common/AvatarComponent";
import { dateFormatter } from "../../../utility/dateFormatter";
import Chips from "../../../common/Chips";
import AntTable from "../../../common/AntTable";

const initData = {
  search: "",
  movementType: "",
  department: "",
  employee: "",
  movementFromDate: "",
  movementToDate: "",
  workplace: "",
  designation: "",
  appStatus: "",
  type: { value: 1, label: "Supervisor" },
};

export default function AdjustmentIOUApproval() {
  const { employeeId, isOfficeAdmin, orgId, wId, wgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  // const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [applicationListData, setApplicationListData] = useState([]);
  const [applicationData, setApplicationData] = useState([]);
  const [allData, setAllData] = useState();
  const [isFilter, setIsFilter] = useState(false);
  // const [isSupOrLineManager, setIsSupOrLineManager] = useState({
  //   value: 1,
  //   label: "Supervisor",
  // });

  //View Modal
  const [viewModal, setViewModal] = useState(false);
  // const [imageFile, setImageFile] = useState("");
  // const [createModal, setCreateModal] = useState(false);
  const [singleData, setSingleData] = useState("");

  const handleOpen = () => {
    setViewModal(false);
  };

  // for view Modal
  const handleViewClose = () => setViewModal(false);

  const getLandingData = () => {
    getAllIOUListDataForApproval(
      {
        applicationStatus: "Pending",
        isAdmin: isOfficeAdmin,
        isSupOrLineManager: 0,
        isSupervisor: false,
        isLineManager: false,
        isUserGroup: false,
        approverId: employeeId,
        workplaceGroupId: wgId,
        businessUnitId: buId,
        workplaceId: wId,
        departmentId: 0,
        designationId: 0,
        applicantId: 0,
        accountId: orgId,
        intId: 0,
      },
      setApplicationListData,
      setAllData,
      setLoading
    );
  };

  useEffect(() => {
    getAllIOUListDataForApproval(
      {
        applicationStatus: "Pending",
        isAdmin: isOfficeAdmin,
        isSupOrLineManager: 0,
        isSupervisor: false,
        isLineManager: false,
        isUserGroup: false,
        approverId: employeeId,
        workplaceGroupId: 0,
        departmentId: 0,
        workplaceId: wId,
        designationId: 0,
        applicantId: 0,
        accountId: orgId,
        intId: 0,
      },
      setApplicationListData,
      setAllData,
      setLoading
    );
  }, [employeeId, orgId, isOfficeAdmin]);

  const debounce = useDebounce();

  // advance filter
  const [filterAnchorEl, setfilterAnchorEl] = useState(null);
  const [filterBages, setFilterBages] = useState({});
  const [filterValues, setFilterValues] = useState({});
  const openFilter = Boolean(filterAnchorEl);
  const id = openFilter ? "simple-popover" : undefined;

  const handleSearch = (values) => {
    getAllIOUListDataForApproval(
      {
        applicationStatus: "Pending",
        isAdmin: isOfficeAdmin,
        isSupOrLineManager: 0,
        isSupervisor: false,
        isLineManager: false,
        isUserGroup: false,
        workplaceId: wId,
        approverId: employeeId,
        workplaceGroupId: 0,
        departmentId: 0,
        designationId: 0,
        applicantId: 0,
        accountId: orgId,
        intId: 0,
      },

      setApplicationListData,
      setAllData,
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

  useEffect(() => {
    const array = [];
    applicationListData?.listData?.forEach((data) => {
      if (data?.selectCheckbox) {
        array.push({
          applicationId: data?.application?.intIouadjustmentId,
          approverEmployeeId: employeeId,
          accountId: orgId,
          isAdmin: isOfficeAdmin,
        });
      }
      setApplicationData(array);
    });
  }, [applicationListData, employeeId, orgId, isOfficeAdmin]);

  const [appliedStatus, setAppliedStatus] = useState({
    value: 1,
    label: "Pending",
  });

  const searchData = (keywords, allData, setRowDto) => {
    try {
      const regex = new RegExp(keywords?.toLowerCase());
      const newDta = allData?.listData?.filter((item) =>
        regex.test(item?.employeeName?.toLowerCase())
      );
      setRowDto({ listData: newDta });
    } catch {
      setRowDto([]);
    }
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
      getAllIOUListDataForApproval(
        {
          applicationStatus: "Pending",
          isAdmin: isOfficeAdmin,
          workplaceId: wId,
          isSupOrLineManager: 0,
          isSupervisor: false,
          isLineManager: false,
          isUserGroup: false,
          approverId: employeeId,
          workplaceGroupId: 0,
          departmentId: 0,
          designationId: 0,
          applicantId: 0,
          accountId: orgId,
          intId: 0,
        },
        setApplicationListData,
        setAllData,
        setLoading
      );
    };

    const confirmObject = {
      closeOnClickOutside: false,
      message: ` Do you want to  ${action} ? `,
      yesAlertFunc: () => {
        console.log("applicationListData", applicationListData);
        const isReceivableArr = applicationListData?.listData.filter(
          (itm) => itm?.application?.numReceivableAmount !== 0
        );
        if (isReceivableArr?.length > 0) {
          return toast.warning(
            "Every Receivable amount must be equal zero!!!",
            {
              toastId: "111",
            }
          );
        }
        if (array.length) {
          IOUApproveReject(newArray, callback);
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
        applicationId: item?.application?.intIouadjustmentId,
        approverEmployeeId: employeeId,
        isReject: text === "Approve" ? false : true,
        accountId: orgId,
        isAdmin: isOfficeAdmin,
      },
    ];

    const callback = () => {
      getAllIOUListDataForApproval(
        {
          applicationStatus: "Pending",
          isAdmin: isOfficeAdmin,
          isSupOrLineManager: 0,
          workplaceId: wId,
          isSupervisor: false,
          isLineManager: false,
          isUserGroup: false,
          approverId: employeeId,
          workplaceGroupId: 0,
          departmentId: 0,
          designationId: 0,
          applicantId: 0,
          accountId: orgId,
          intId: 0,
        },
        setApplicationListData,
        setAllData,
        setLoading
      );
    };
    const confirmObject = {
      closeOnClickOutside: false,
      message: `Do you want to ${action}? `,
      yesAlertFunc: () => {
        IOUApproveReject(payload, callback);
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  //  For cheaps future nedded
  // const [filterDto, setFilterDto] = useState(...applicationListData);

  // const history = useHistory();

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30312) {
      permission = item;
    }
  });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Approval"));
    document.title = "Adjustment IOU Approval";
  }, [dispatch]);

  // landing table
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

  const getLandingTable = (setFieldValue) => {
    return [
      {
        title: "SL",
        render: (text, record, index) => index + 1,
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
                  applicationListData?.listData?.length > 0 &&
                  applicationListData?.listData?.every(
                    (item) => item?.selectCheckbox
                  )
                }
                onChange={(e) => {
                  setApplicationListData({
                    listData: applicationListData?.listData?.map((item) => ({
                      ...item,
                      selectCheckbox: e.target.checked,
                    })),
                  });
                  setFieldValue("allSelected", e.target.checked);
                }}
              />
            </div>
            <div>Code</div>
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
                  const data = applicationListData?.listData?.map((item) => {
                    if (
                      item?.application?.intIouid ===
                      record?.application?.intIouid
                    ) {
                      return {
                        ...item,
                        selectCheckbox: e.target.checked,
                      };
                    } else return item;
                  });
                  setApplicationListData({ listData: [...data] });

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
        dataIndex: "strEmployeeName",
        render: (_, record) => {
          return (
            <div className="d-flex align-items-center">
              <AvatarComponent
                classess=""
                letterCount={1}
                label={record?.strEmployeeName}
              />
              <span className="ml-2">{record?.strEmployeeName}</span>
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
      // {
      //   title: "Type",
      //   dataIndex: "employmentType",
      //   sorter: true,
      //   filter: true,
      // },
      {
        title: "Application Date",
        render: (_, record) => (
          <div className="d-flex align-items-center">
            <div>{dateFormatter(record?.application?.dteCreatedAt)}</div>
          </div>
        ),
        filter: false,
        sorter: false,
      },
      {
        title: "Date Range",
        render: (_, record) => (
          <div className="d-flex align-items-center">
            <div>
              {dateFormatter(record?.dteFromDate)}-
              {dateFormatter(record?.dteToDate)}
            </div>
          </div>
        ),
        filter: false,
        sorter: false,
      },
      {
        title: "IOU Amount",
        render: (_, record) => (
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
                      {record?.description}
                    </p>
                  </div>
                </div>
              }
              arrow
            >
              <InfoOutlined sx={{ color: gray900 }} />
            </LightTooltip>
            <div className="ml-2">{record?.iouAmount}</div>
          </div>
        ),
        filter: false,
        sorter: false,
      },
      {
        title: "Total Adjusted",
        render: (_, record) => (
          <div className="d-flex align-items-center">
            <div>
              {record?.numAdjustmentAmount +
                (+record?.accountsAdjustmentAmount || 0)}
            </div>
          </div>
        ),
        filter: false,
        sorter: false,
      },
      {
        title: "Payable",
        render: (_, record) => (
          <div className="d-flex align-items-center">
            <div>{record?.numPayableAmount}</div>
          </div>
        ),
        filter: false,
        sorter: false,
      },
      {
        title: "Receivable",
        render: (_, record) => (
          <div className="d-flex align-items-center">
            <div>{record?.numReceivableAmount}</div>
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
              <div className="all-candidate movement-wrapper">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="table-card">
                        <div className="table-card-heading">
                          <BackButton title={"Adjustment IOU Approval"} />
                          <div>
                            {applicationListData?.listData?.filter(
                              (item) => item?.selectCheckbox
                            ).length > 0 && (
                              <div className="d-flex actionIcon">
                                <button
                                  className="btn-green mr-2"
                                  onClick={() => {
                                    demoPopup(
                                      "approve",
                                      "isApproved",
                                      applicationData
                                    );
                                  }}
                                >
                                  Approve
                                </button>
                                <button
                                  className="btn-red"
                                  onClick={() => {
                                    demoPopup(
                                      "reject",
                                      "isReject",
                                      applicationData
                                    );
                                  }}
                                >
                                  Reject
                                </button>
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
                                      setFieldValue("search", "");
                                      setAppliedStatus({
                                        value: 1,
                                        label: "Pending",
                                      });
                                      getLandingData(/* isSupOrLineManager?.value */);
                                    }}
                                  />
                                </li>
                              )}

                              {permission?.isCreate && (
                                <li className="d-none">
                                  <MasterFilter
                                    styles={{
                                      marginRight: "0px",
                                    }}
                                    isHiddenFilter
                                    width="200px"
                                    inputWidth="200px"
                                    value={values?.search}
                                    setValue={(value) => {
                                      debounce(() => {
                                        searchData(
                                          value,
                                          allData,
                                          setApplicationListData
                                        );
                                      }, 500);
                                      setFieldValue("search", value);
                                    }}
                                    cancelHandler={() => {
                                      setFieldValue("search", "");
                                      getLandingData(/* isSupOrLineManager?.value */);
                                    }}
                                    handleClick={(e) =>
                                      setfilterAnchorEl(e.currentTarget)
                                    }
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
                          <div className="table-card-body">
                            <div className="table-card-styled table-responsive tableOne">
                              <AntTable
                                data={
                                  applicationListData?.listData?.length > 0
                                    ? applicationListData?.listData
                                    : []
                                }
                                columnsData={getLandingTable(setFieldValue)}
                              />
                            </div>
                          </div>
                        ) : (
                          <NotPermittedPage />
                        )}
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
                    title: "Adjustment IOU Details",
                    onHide: handleViewClose,
                    size: "lg",
                    backdrop: "static",
                    classes: "default-modal",
                    handleOpen,
                    singleData,
                    setSingleData,
                    // setCreateModal,
                    appliedStatus,
                    setApplicationListData,
                    // imageFile,
                    filterValues,
                    setAllData,
                  }}
                />
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
