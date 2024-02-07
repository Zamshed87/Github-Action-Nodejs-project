/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Cancel, CheckCircle } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import AvatarComponent from "../../../../common/AvatarComponent";
import BackButton from "../../../../common/BackButton";
import Chips from "../../../../common/Chips";
import FilterBadgeComponent from "../../../../common/FilterBadgeComponent";
import FormikCheckBox from "../../../../common/FormikCheckbox";
import IConfirmModal from "../../../../common/IConfirmModal";
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
  getAllMovementApplicatonListDataForApproval,
  movementApproveReject,
} from "../helper";
import Loading from "./../../../../common/loading/Loading";
import FilterModal from "./component/FilterModal";
import "./index.css";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
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

export default function MovementApproval() {
  const { employeeId, isOfficeAdmin, orgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  // const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [applicationListData, setApplicationListData] = useState([]);
  const [allData, setAllData] = useState();

  // const [isSupOrLineManager, setIsSupOrLineManager] = useState({
  //   value: 1,
  //   label: "Supervisor",
  // });
  const [
    landingApproval,
    getLandingApproval,
    loadingApproval,
    setLandingApproval,
  ] = useAxiosPost();
  const [filterLanding, setFilterLanding] = useState([]);

  const getLandingData = () => {
    const payload = {
      approverId: employeeId,
      movementTypeId: 0,
      workplaceGroupId: 0,
      departmentId: 0,
      designationId: 0,
      applicantId: 0,
      fromDate: "",
      toDate: "",
      applicationStatus: "Pending", // appliedStatus?.label,
      isAdmin: isOfficeAdmin,
      isSupOrLineManager: 0,
      accountId: orgId,
      workplaceId: wId,
    };
    getLandingApproval(
      `/ApprovalPipeline/MovementApplicationLanding`,
      payload,
      (res) => {
        let temp = res?.listData?.map((item) => {
          return {
            ...item,
            selectCheckbox: false,
          };
        });
        setLandingApproval(temp);
        setFilterLanding(temp);
      }
    );
  };
  // advance filter
  const [filterAnchorEl, setfilterAnchorEl] = useState(null);
  const [filterBages, setFilterBages] = useState({});
  const [filterValues, setFilterValues] = useState({});

  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);

  const openFilter = Boolean(filterAnchorEl);
  const id = openFilter ? "simple-popover" : undefined;

  const handleSearch = (values) => {
    getAllMovementApplicatonListDataForApproval(
      {
        approverId: employeeId,
        movementTypeId: values?.movementType?.MovementTypeId || 0,
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
        // isSupOrLineManager: isSupOrLineManager?.value,
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
    handleSearch(data);
  };
  const getFilterValues = (name, value) => {
    setFilterValues((prev) => ({ ...prev, [name]: value }));
  };

  const saveHandler = (values) => {};
  // const searchData = (keywords, allData, setRowDto) => {
  //   try {
  //     const regex = new RegExp(keywords?.toLowerCase());
  //     let newDta = allData?.listData?.filter((item) =>
  //       regex.test(item?.employeeName?.toLowerCase())
  //     );
  //     setRowDto({ listData: newDta });
  //   } catch {
  //     setRowDto([]);
  //   }
  // };

  // for multiple approval
  const demoPopup = (action, text, array) => {
    let newArray = [];
    const checkedList = array?.filter((item) => item?.selectCheckbox);
    if (checkedList.length > 0) {
      checkedList?.forEach((item) => {
        if (text === "isReject") {
          newArray.push({
            isReject: true,
            applicationId: item?.movementApplication?.intApplicationId,
            approverEmployeeId: employeeId,
            accountId: orgId,
            fromDate: item?.movementApplication?.dteFromDate,
            toDate: item?.movementApplication?.dteToDate,
            isAdmin: isOfficeAdmin,
          });
        } else {
          newArray.push({
            isReject: false,
            applicationId: item?.movementApplication?.intApplicationId,
            approverEmployeeId: employeeId,
            accountId: orgId,
            fromDate: item?.movementApplication?.dteFromDate,
            toDate: item?.movementApplication?.dteToDate,
            isAdmin: isOfficeAdmin,
          });
        }
      });
    }
    let confirmObject = {
      closeOnClickOutside: false,
      message: ` Do you want to  ${action} ? `,
      yesAlertFunc: () => {
        if (array.length) {
          movementApproveReject(newArray, getLandingData, setLoading);
        }
        newArray = [];
      },
      noAlertFunc: () => {
        newArray = [];
      },
    };
    IConfirmModal(confirmObject);
  };
  // for single row data approval
  const demoPopupForTable = (action, text, data) => {
    let payload = [
      {
        applicationId: data?.movementApplication?.intApplicationId,
        approverEmployeeId: employeeId,
        // approverEmployeeId: item?.movementApplication?.intEmployeeId,
        isReject: text === "Reject" ? true : false,
        fromDate: data?.movementApplication?.dteFromDate,
        toDate: data?.movementApplication?.dteToDate,
        accountId: orgId,
        isAdmin: isOfficeAdmin,
      },
    ];
    let confirmObject = {
      closeOnClickOutside: false,
      message: ` Do you want to ${action}? `,
      yesAlertFunc: () => {
        movementApproveReject(payload, getLandingData, setLoading);
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

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
    document.title = "Movement Approval";
  }, []);

  useEffect(() => {
    getLandingData(/* isSupOrLineManager?.value */);
  }, [employeeId]);

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
                  filterLanding?.length > 0 &&
                  filterLanding?.every((item) => item?.selectCheckbox)
                }
                onChange={(e) => {
                  let data = filterLanding.map((item) => ({
                    ...item,
                    selectCheckbox: e.target.checked,
                  }));
                  let data2 = landingApproval.map((item) => ({
                    ...item,
                    selectCheckbox: e.target.checked,
                  }));
                  setFilterLanding(data);
                  setLandingApproval(data2);
                  setFieldValue("allSelected", e.target.checked);
                }}
              />
            </div>
            <div>Employee Id</div>
          </div>
        ),
        dataIndex: "employeeCode",
        render: (_, record, index) => (
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
                  let data = filterLanding?.map((item) => {
                    if (
                      item?.movementApplication?.intApplicationId ===
                      record?.movementApplication?.intApplicationId
                    ) {
                      return {
                        ...item,
                        selectCheckbox: e.target.checked,
                      };
                    } else return item;
                  });
                  let data2 = landingApproval?.map((item) => {
                    if (
                      item?.movementApplication?.intApplicationId ===
                      record?.movementApplication?.intApplicationId
                    ) {
                      return {
                        ...item,
                        selectCheckbox: e.target.checked,
                      };
                    } else return item;
                  });
                  setFilterLanding(data);
                  setLandingApproval(data2);
                  // setApplicationListData({ listData: [...data] });
                }}
              />
            </div>
            <div className="d-flex align-items-center">
              <span className="ml-2">{record?.employeeCode}</span>
            </div>
          </div>
        ),
        sorter: true,
        filter: true,
      },
      {
        title: "Employee",
        dataIndex: "employeeName",
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
        dataIndex: "designation",
        render: (_, record) => (
          <div>
            {record?.designation}, {record?.employmentType}
          </div>
        ),
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
        title: "Movement Type",
        dataIndex: "OvertimeDate",
        render: (_, data) => (
          <div className="d-flex align-items-center justify-content-start">
            <LightTooltip
              title={
                <div className="movement-tooltip p-1">
                  <div className="border-bottom">
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
                      {data?.movementApplication?.strReason}
                    </p>
                  </div>
                  <div>
                    <p
                      className="tooltip-title mt-1"
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      Location
                    </p>
                    <p
                      className="tooltip-subTitle mb-0"
                      style={{
                        fontSize: "12px",
                        fontWeight: "500",
                      }}
                    >
                      {data?.movementApplication?.strLocation}
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
            <div className="ml-2">{data?.movementType}</div>
          </div>
        ),
        sorter: false,
        filter: false,
      },
      {
        title: "Date Range",
        dataIndex: "StartTime",
        render: (_, data) => (
          <div>
            {dateFormatter(data?.movementApplication?.dteFromDate)}-{" "}
            {dateFormatter(data?.movementApplication?.dteToDate)}
          </div>
        ),
        filter: false,
        sorter: false,
      },
      {
        title: "Time Range",
        dataIndex: "EndTime",
        render: (_, data) => (
          <div>
            {data?.movementApplication?.tmeFromTime &&
              timeFormatter(data?.movementApplication?.tmeFromTime)}
            -
            {data?.movementApplication?.tmeToTime &&
              timeFormatter(data?.movementApplication?.tmeToTime)}
          </div>
        ),
        filter: false,
        sorter: false,
      },
      {
        title: "Application Date",
        render: (_, data) => (
          <div>{dateFormatter(data?.movementApplication?.dteCreatedAt)}</div>
        ),
        filter: false,
        sorter: false,
        isDate: true,
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
            {data?.status === "Approved" && (
              <Chips label="Approved" classess="success" />
            )}
            {data?.status === "Pending" && (
              <>
                <div className="actionChip">
                  <Chips label="Pending" classess=" warning" />
                </div>
                <div className="d-flex actionIcon justify-content-center">
                  <Tooltip title="Accept">
                    <div
                      className="mx-2 muiIconHover success "
                      onClick={() => {
                        demoPopupForTable("approve", "Approve", data);
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
                        demoPopupForTable("reject", "Reject", data);
                      }}
                    >
                      <MuiIcon icon={<Cancel sx={{ color: "#FF696C" }} />} />
                    </div>
                  </Tooltip>
                </div>
              </>
            )}
            {data?.status === "Rejected" && (
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
              {(loading || loadingApproval) && <Loading />}
              <div className="all-candidate movement-wrapper">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="table-card">
                        <div className="table-card-heading">
                          <BackButton title={"Movement Approval"} />
                          <div className="table-card-head-right">
                            {filterLanding?.filter(
                              (item) => item?.selectCheckbox
                            ).length > 0 && (
                              <div className="d-flex actionIcon mr-3">
                                <Tooltip title="Accept">
                                  <div
                                    className="muiIconHover success mr-2"
                                    onClick={() => {
                                      demoPopup(
                                        "approve",
                                        "isApproved",
                                        filterLanding
                                      );
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
                                      demoPopup(
                                        "reject",
                                        "isReject",
                                        filterLanding
                                      );
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
                                      getLandingData(); // isSupOrLineManager?.value 
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
                              {landingApproval?.length > 0 ? (
                                <AntTable
                                  data={landingApproval}
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
                                      landingApproval?.length
                                    ) {
                                      let temp = dataRow?.map((item) => {
                                        return {
                                          ...item,
                                          selectCheckbox: false,
                                        };
                                      });
                                      setFilterLanding(temp);
                                      setLandingApproval(temp);
                                      return;
                                    }
                                    setFilterLanding(dataRow);
                                  }}
                                  rowKey={(item) =>
                                    item?.movementApplication?.intApplicationId
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
