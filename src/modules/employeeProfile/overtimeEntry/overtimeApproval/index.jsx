/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Cancel, CheckCircle } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import AvatarComponent from "../../../../common/AvatarComponent";
import BackButton from "../../../../common/BackButton";
import FilterBadgeComponent from "../../../../common/FilterBadgeComponent";
import FormikCheckBox from "../../../../common/FormikCheckbox";
import IConfirmModal from "../../../../common/IConfirmModal";
import Loading from "../../../../common/loading/Loading";
import MuiIcon from "../../../../common/MuiIcon";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import PopOverMasterFilter from "../../../../common/PopoverMasterFilter";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import {
  failColor,
  gray900,
  greenColor,
  successColor,
} from "../../../../utility/customColor";
import { dateFormatter } from "../../../../utility/dateFormatter";
import { timeFormatter } from "../../../../utility/timeFormatter";
import {
  getAllOvertimeApplicationListDataForApproval,
  overtimeApproveReject,
} from "../helper";
import FilterModal from "./component/FilterModal";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import "./index.css";
import Chips from "../../../../common/Chips";
import NoResult from "../../../../common/NoResult";
import AntTable from "../../../../common/AntTable";
import { LightTooltip } from "../../../../common/LightTooltip";
import useAxiosPost from "../../../../utility/customHooks/useAxiosPost";

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

export default function OvertimeApproval() {
  const { employeeId, isOfficeAdmin, orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  // const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [applicationListData, setApplicationListData] = useState([]);
  const [allData, setAllData] = useState();
  const [filterLanding, setFilterLanding] = useState([]);
  const [
    resOvertimeApproval,
    getOvertimeApproval,
    loadingRes,
    setOvertimeApproval,
  ] = useAxiosPost();

  const getLandingData = () => {
    const payload = {
      approverId: employeeId,
      intId: 0,
      workplaceGroupId: 0,
      departmentId: 0,
      designationId: 0,
      applicantId: 0,
      fromDate: "",
      toDate: "",
      applicationStatus: appliedStatus?.label,
      isAdmin: isOfficeAdmin,
      isSupOrLineManager: 0,
      accountId: orgId,
    };
    // getAllOvertimeApplicationListDataForApproval(
    //   payload,
    //   setApplicationListData,
    //   setAllData,
    //   setLoading
    // );
    getOvertimeApproval("/ApprovalPipeline/OverTimeLanding", payload, (res) => {
      setOvertimeApproval(res?.listData);
      setFilterLanding(res?.listData);
    });
  };

  useEffect(() => {
    getLandingData();
  }, [employeeId]);

  // advance filter
  const [filterAnchorEl, setfilterAnchorEl] = useState(null);
  const [filterBages, setFilterBages] = useState({});
  const [filterValues, setFilterValues] = useState({});

  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);

  const openFilter = Boolean(filterAnchorEl);
  const id = openFilter ? "simple-popover" : undefined;

  const handleSearch = (values) => {
    getAllOvertimeApplicationListDataForApproval(
      {
        approverId: employeeId,
        intId: values?.intOverTimeId || 0,
        workplaceGroupId: values?.workplace?.id || 0,
        departmentId: values?.department?.id || 0,
        designationId: values?.designation?.id || 0,
        applicantId: values?.employee?.id || 0,
        fromDate: values?.movementFromDate || "",
        toDate: values?.movementToDate || "",
        applicationStatus:
          values?.appStatus?.label === "Rejected"
            ? "Reject"
            : values?.appStatus?.label || "Pending",
        isAdmin: isOfficeAdmin,
        isSupOrLineManager: 0,
        accountId: orgId,
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
    // handleSearch(data);
  };
  const getFilterValues = (name, value) => {
    setFilterValues((prev) => ({ ...prev, [name]: value }));
  };

  const [appliedStatus, setAppliedStatus] = useState({
    value: 1,
    label: "Pending",
  });

  const saveHandler = (values) => {};
  // const searchData = (keywords, allData, setRowDto) => {
  //   try {
  //     const regex = new RegExp(keywords?.toLowerCase());
  //     let newDta = allData?.listData?.filter((item) =>
  //       regex.test(item?.strEmployeeName?.toLowerCase())
  //     );
  //     setRowDto({ listData: newDta });
  //   } catch {
  //     setRowDto([]);
  //   }
  // };
  const demoPopup = (action, text) => {
    let newArray = [];
    const checkedList = filterLanding?.filter((item) => item?.selectCheckbox);

    if (checkedList.length > 0) {
      checkedList.forEach((item) => {
        if (text === "isReject") {
          newArray.push({
            applicationId: item?.intOverTimeId,
            approverEmployeeId: employeeId,
            accountId: orgId,
            fromDate: item?.movementApplication?.dteFromDate,
            toDate: item?.movementApplication?.dteToDate,
            isAdmin: isOfficeAdmin,
            isReject: true,
          });
        } else {
          newArray.push({
            applicationId: item?.intOverTimeId,
            approverEmployeeId: employeeId,
            accountId: orgId,
            fromDate: item?.movementApplication?.dteFromDate,
            toDate: item?.movementApplication?.dteToDate,
            isAdmin: isOfficeAdmin,
            isReject: false,
          });
        }
      });
    }

    const callback = () => {
      /*   getAllOvertimeApplicationListDataForApproval(
        {
          approverId: employeeId,
          intId: filterValues?.intOverTimeId || 0,
          workplaceGroupId: filterValues?.workplace?.id || 0,
          departmentId: filterValues?.department?.id || 0,
          designationId: filterValues?.designation?.id || 0,
          applicantId: filterValues?.employee?.id || 0,
          fromDate: filterValues?.movementFromDate || "",
          toDate: filterValues?.movementToDate || "",
          applicationStatus:
            filterValues?.appStatus?.label === "Rejected"
              ? "Reject"
              : filterValues?.appStatus?.label || "Pending",
          isAdmin: isOfficeAdmin,
          isSupOrLineManager: 0,
          accountId: orgId,
        },
        setApplicationListData,
        setAllData,
        setLoading
      ); */
      getLandingData();
    };
    let confirmObject = {
      closeOnClickOutside: false,
      message: ` Do you want to  ${action} ? `,
      yesAlertFunc: () => {
        if (newArray.length) {
          overtimeApproveReject(newArray, callback);
        }
        newArray = [];
      },
      noAlertFunc: () => {
        newArray = [];
      },
    };
    IConfirmModal(confirmObject);
  };

  const singlePopup = (action, text, data) => {
    let payload = [
      {
        applicationId: data?.intOverTimeId,
        approverEmployeeId: employeeId,
        isReject: text === "Reject" ? true : false,
        fromDate: data?.movementApplication?.dteFromDate,
        toDate: data?.movementApplication?.dteToDate,
        accountId: orgId,
        isAdmin: isOfficeAdmin,
      },
    ];

    const callback = () => {
      /*    getAllOvertimeApplicationListDataForApproval(
        {
          approverId: employeeId,
          intId: filterValues?.intOverTimeId || 0,
          workplaceGroupId: filterValues?.workplace?.id || 0,
          departmentId: filterValues?.department?.id || 0,
          designationId: filterValues?.designation?.id || 0,
          applicantId: filterValues?.employee?.id || 0,
          fromDate: filterValues?.movementFromDate || "",
          toDate: filterValues?.movementToDate || "",
          applicationStatus:
            filterValues?.appStatus?.label === "Rejected"
              ? "Reject"
              : filterValues?.appStatus?.label || "Pending",
          isAdmin: isOfficeAdmin,
          isSupOrLineManager: 0,
          accountId: orgId,
        },
        setApplicationListData,
        setAllData,
        setLoading
      ); */
      getLandingData();
    };
    let confirmObject = {
      closeOnClickOutside: false,
      message: ` Do you want to ${action}? `,
      yesAlertFunc: () => {
        overtimeApproveReject(payload, callback);
      },
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
    if (item?.menuReferenceId === 104) {
      permission = item;
    }
  });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Approval"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Overtime Approval";
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
          <FormikCheckBox
            styleObj={{
              margin: "0 auto!important",
              padding: "0 !important",
              color: gray900,
              checkedColor: greenColor,
            }}
            name="allSelected"
            checked={
              filterLanding?.length > 0 &&
              filterLanding?.every((item) => item?.selectCheckbox)
            }
            onChange={(e) => {
              // setApplicationListData({
              //   listData: applicationListData?.listData?.map((item) => ({
              //     ...item,
              //     selectCheckbox: e.target.checked,
              //   })),
              // });
              let data = filterLanding.map((item) => ({
                ...item,
                selectCheckbox: e.target.checked,
              }));
              let data2 = resOvertimeApproval.map((item) => ({
                ...item,
                selectCheckbox: e.target.checked,
              }));
              setFilterLanding(data);
              setOvertimeApproval(data2);
              setFieldValue("allSelected", e.target.checked);
            }}
          />
        ),
        dataIndex: "",
        render: (_, record, index) => (
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
              // let data = applicationListData?.listData?.map((item) => {
              //   if (
              //     item?.application?.intOverTimeId ===
              //     record?.application?.intOverTimeId
              //   ) {
              //     return {
              //       ...item,
              //       selectCheckbox: e.target.checked,
              //     };
              //   } else return item;
              // });
              // setApplicationListData({ listData: [...data] });
              let data = filterLanding?.map((item) => {
                if (
                  item?.application?.intOverTimeId ===
                  record?.application?.intOverTimeId
                ) {
                  return {
                    ...item,
                    selectCheckbox: e.target.checked,
                  };
                } else return item;
              });
              let data2 = resOvertimeApproval?.map((item) => {
                if (
                  item?.application?.intOverTimeId ===
                  record?.application?.intOverTimeId
                ) {
                  return {
                    ...item,
                    selectCheckbox: e.target.checked,
                  };
                } else return item;
              });
              setFilterLanding(data);
              setOvertimeApproval(data2);
            }}
          />
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
            <div className="ml-2">
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
        render: (_, record) => (
          <div>
            {record?.strDesignation}, {record?.strEmploymentType}
          </div>
        ),
        sorter: true,
        filter: true,
      },
      {
        title: "Department",
        dataIndex: "strDepartment",
        sorter: true,
        filter: true,
      },
      {
        title: "Date",
        dataIndex: "dteOverTimeDate",
        render: (data) => <div>{dateFormatter(data)}</div>,
        filter: false,
        sorter: false,
      },
      {
        title: "Start Time",
        dataIndex: "tmeStartTime",
        render: (data) => <div>{data ? timeFormatter(data) : "-"}</div>,
        filter: false,
        sorter: false,
      },
      {
        title: "End Time",
        dataIndex: "tmeEndTime",
        render: (data) => <div>{data ? timeFormatter(data) : "-"}</div>,
        filter: false,
        sorter: false,
      },
      {
        title: "Hours",
        dataIndex: "currentStage",
        render: (_, data) => (
          <div className="d-flex align-items-center justify-content-start">
            <LightTooltip
              title={
                <div className="movement-tooltip p-1">
                  <div>
                    <p
                      className="tooltip-title"
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      Reason
                    </p>
                    <p
                      className="tooltip-subTitle"
                      style={{
                        fontSize: "12px",
                        fontWeight: "500",
                      }}
                    >
                      {data?.strReason}
                    </p>
                  </div>
                </div>
              }
              arrow
            >
              <InfoOutlinedIcon
                sx={{
                  color: gray900,
                }}
              />
            </LightTooltip>
            <div className="ml-2">{data?.numOverTimeHour}</div>
          </div>
        ),
        filter: false,
        sorter: false,
      },
      {
        title: "Waiting Stage",
        dataIndex: "currentStage",
        filter: false,
        sorter: false,
      },
      {
        title: "Status",
        dataIndex: "ApprovalStatus",
        render: (_, data) => (
          <div className="text-center action-chip" style={{ width: "70px" }}>
            {data?.application?.strStatus === "Approved" && (
              <Chips label="Approved" classess="success" />
            )}
            {data?.application?.strStatus === "Pending" && (
              <>
                <div className="actionChip">
                  <Chips label="Pending" classess=" warning" />
                </div>
                <div className="d-flex actionIcon justify-content-center">
                  <Tooltip title="Accept">
                    <div
                      className="mx-2 muiIconHover success "
                      onClick={() => {
                        singlePopup("approve", "Approve", data);
                      }}
                    >
                      <MuiIcon
                        icon={<CheckCircle sx={{ color: "#34A853" }} />}
                      />
                    </div>
                  </Tooltip>
                  <Tooltip title="Reject">
                    <div
                      className="muiIconHover danger"
                      onClick={() => {
                        singlePopup("reject", "Reject", data);
                      }}
                    >
                      <MuiIcon icon={<Cancel sx={{ color: "#FF696C" }} />} />
                    </div>
                  </Tooltip>
                </div>
              </>
            )}
            {data?.application?.strStatus === "Rejected" && (
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
          dirty,
        }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {(loading || loadingRes) && <Loading />}
              <div className="all-candidate movement-wrapper">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="table-card">
                        <div className="table-card-heading">
                          <BackButton title={"Overtime Approval"} />
                          <div className="table-card-head-right">
                            {filterLanding?.filter(
                              (item) => item?.selectCheckbox
                            ).length > 0 && (
                              <div className="d-flex actionIcon mr-3">
                                <Tooltip title="Accept">
                                  <div
                                    className="muiIconHover success mr-2"
                                    onClick={() => {
                                      demoPopup("approve", "isApproved");
                                    }}
                                  >
                                    <MuiIcon
                                      icon={
                                        <CheckCircle
                                          sx={{
                                            color: successColor,
                                            width: "16px",
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
                                      demoPopup("reject", "isReject");
                                    }}
                                  >
                                    <MuiIcon
                                      icon={
                                        <Cancel
                                          sx={{
                                            color: failColor,
                                            width: "16px",
                                          }}
                                        />
                                      }
                                    />
                                  </div>
                                </Tooltip>
                              </div>
                            )}
                            {/*   <ul className="d-flex flex-wrap">
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
                                      getLandingData();
                                    }}
                                  />
                                </li>
                              )}
                              {permission?.isCreate && (
                                <li>
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
                                      getLandingData();
                                    }}
                                    handleClick={(e) =>
                                      setfilterAnchorEl(e.currentTarget)
                                    }
                                  />
                                </li>
                              )}
                            </ul> */}
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
                              {resOvertimeApproval?.length > 0 ? (
                                <AntTable
                                  data={resOvertimeApproval}
                                  columnsData={columns(
                                    setFieldValue,
                                    page,
                                    paginationSize
                                  )}
                                  setPage={setPage}
                                  setPaginationSize={setPaginationSize}
                                  setColumnsData={(dataRow) => {
                                    if (
                                      dataRow?.length ===
                                      resOvertimeApproval?.length
                                    ) {
                                      let temp = dataRow?.map((item) => {
                                        return {
                                          ...item,
                                          selectCheckbox: false,
                                        };
                                      });
                                      setFilterLanding(temp);
                                      return;
                                    }
                                    setFilterLanding(dataRow);
                                  }}
                                  rowKey={(record) =>
                                    record?.application?.intOverTimeId
                                  }
                                />
                              ) : (
                                <NoResult />
                              )}
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
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
