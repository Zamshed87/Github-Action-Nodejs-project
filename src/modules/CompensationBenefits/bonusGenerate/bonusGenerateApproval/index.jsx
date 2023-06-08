import {
  Cancel,
  CheckCircle,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import BackButton from "../../../../common/BackButton";
import FilterBadgeComponent from "../../../../common/FilterBadgeComponent";
import IConfirmModal from "../../../../common/IConfirmModal";
import Loading from "../../../../common/loading/Loading";
// import MasterFilter from "../../../../common/MasterFilter";
import MuiIcon from "../../../../common/MuiIcon";
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
// import useDebounce from "../../../../utility/customHooks/useDebounce";
import {
  getAllBonusGenerateListDataForApproval,
  bonusGenerateApproveReject,
} from "../helper";
import FilterModal from "./component/FilterModal";
import "./index.css";
import AntTable from "../../../../common/AntTable";
import FormikCheckBox from "../../../../common/FormikCheckbox";
import AvatarComponent from "../../../../common/AvatarComponent";
import Chips from "../../../../common/Chips";
import { dateFormatter } from "../../../../utility/dateFormatter";
import NoResult from "../../../../common/NoResult";

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

export default function BonusGenerateApproval() {
  const dispatch = useDispatch();
  const { employeeId, isOfficeAdmin, orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);
  const [applicationListData, setApplicationListData] = useState([]);
  const [applicationData, setApplicationData] = useState([]);
  const [isFilter, setIsFilter] = useState(false);
  const [appliedStatus, setAppliedStatus] = useState({
    value: 1,
    label: "Pending",
  });

  const getLandingData = () => {
    getAllBonusGenerateListDataForApproval(
      {
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
      },
      setApplicationListData,
      setFilterData,
      setLoading
    );
  };

  useEffect(() => {
    getAllBonusGenerateListDataForApproval(
      {
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
      },
      setApplicationListData,
      setFilterData,
      setLoading
    );
  }, [employeeId, orgId, isOfficeAdmin, appliedStatus]);

  // const debounce = useDebounce();

  // advance filter
  const [filterAnchorEl, setfilterAnchorEl] = useState(null);
  const [filterBages, setFilterBages] = useState({});
  const [filterValues, setFilterValues] = useState({});
  const [filterData, setFilterData] = useState([]);
  const openFilter = Boolean(filterAnchorEl);
  const id = openFilter ? "simple-popover" : undefined;

  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);

  const handleSearch = (values) => {
    getAllBonusGenerateListDataForApproval(
      {
        approverId: employeeId,
        intId: values?.intId || 0,
        workplaceGroupId: values?.workplace?.id || 0,
        departmentId: values?.department?.id || 0,
        designationId: values?.designation?.id || 0,
        applicantId: values?.employee?.id || 0,
        applicationStatus:
          values?.appStatus?.label === "Rejected"
            ? "Reject"
            : values?.appStatus?.label || "Pending",
        isAdmin: isOfficeAdmin,
        isSupOrLineManager: 0,
        accountId: orgId,
      },
      setApplicationListData,
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

  useEffect(() => {
    const array = [];
    filterData?.listData?.forEach((data) => {
      if (data?.selectCheckbox) {
        array.push({
          applicationId: data?.intId,
          approverEmployeeId: employeeId,
          accountId: orgId,
          isAdmin: isOfficeAdmin,
        });
      }
      setApplicationData(array);
    });
  }, [filterData, employeeId, isOfficeAdmin, orgId]);

  const saveHandler = (values) => {};
  // const searchData = (keywords, allData, setRowDto) => {
  //   try {
  //     const regex = new RegExp(keywords?.toLowerCase());
  //     let newDta = allData?.listData?.filter(
  //       (item) =>
  //         regex.test(item?.strBusinessUnitName?.toLowerCase()) ||
  //         regex.test(item?.strBonusName?.toLowerCase())
  //     );
  //     setRowDto({ listData: newDta });
  //   } catch {
  //     setRowDto([]);
  //   }
  // };
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
      getAllBonusGenerateListDataForApproval(
        {
          approverId: employeeId,
          intId: filterValues?.applicationStatus || 0,
          workplaceGroupId: filterValues?.workplace?.id || 0,
          departmentId: filterValues?.department?.id || 0,
          designationId: filterValues?.designation?.id || 0,
          applicantId: filterValues?.employee?.id || 0,
          applicationStatus:
            filterValues?.appStatus?.label === "Rejected"
              ? "Reject"
              : filterValues?.appStatus?.label || "Pending",
          isAdmin: isOfficeAdmin,
          isSupOrLineManager: 0,
          accountId: orgId,
        },
        setApplicationListData,
        setFilterData,
        setLoading
      );
    };

    let confirmObject = {
      closeOnClickOutside: false,
      message: ` Do you want to  ${action} ? `,
      yesAlertFunc: () => {
        if (array.length) {
          bonusGenerateApproveReject(newArray, callback);
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
        applicationId: item?.intId,
        approverEmployeeId: employeeId,
        isReject: text === "Approve" ? false : true,
        accountId: orgId,
        isAdmin: isOfficeAdmin,
      },
    ];

    const callback = () => {
      getAllBonusGenerateListDataForApproval(
        {
          approverId: employeeId,
          intId: filterValues?.applicationStatus || 0,
          workplaceGroupId: filterValues?.workplace?.id || 0,
          departmentId: filterValues?.department?.id || 0,
          designationId: filterValues?.designation?.id || 0,
          applicantId: filterValues?.employee?.id || 0,
          applicationStatus:
            filterValues?.appStatus?.label === "Rejected"
              ? "Reject"
              : filterValues?.appStatus?.label || "Pending",
          isAdmin: isOfficeAdmin,
          isSupOrLineManager: 0,
          accountId: orgId,
        },
        setApplicationListData,
        setFilterData,
        setLoading
      );
    };

    let confirmObject = {
      closeOnClickOutside: false,
      message: `Do you want to ${action}? `,
      yesAlertFunc: () => {
        bonusGenerateApproveReject(payload, callback);
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

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Approval"));
  }, [dispatch]);

  // landing table
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
                  filterData?.listData?.every(
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
            <div>Business Unit</div>
          </div>
        ),
        dataIndex: "strBusinessUnitName",
        render: (strBusinessUnitName, record, index) => (
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
                  let bonusGenData = applicationListData?.listData?.map(
                    (item) => {
                      if (item?.intId === record?.intId) {
                      return {
                        ...item,
                        selectCheckbox: e.target.checked,
                      };
                    } else return item;
                    }
                  );
                  let data = filterData?.listData?.map((item) => {
                    if (item?.intId === record?.intId) {
                      return {
                        ...item,
                        selectCheckbox: e.target.checked,
                      };
                    } else return item;
                  });
                  setApplicationListData({ listData: [...bonusGenData] });
                  setFilterData({ listData: [...data] });

                  // let data = [...leaveApplicationData?.listData];
                  // data[index].selectCheckbox = e.target.checked;
                  // setAllLeaveApplicatonData({ listData: [...data] });
                }}
              />
            </div>
            <div className="d-flex align-items-center">
              <AvatarComponent letterCount={1} label={strBusinessUnitName} />
              <span className="ml-2">{strBusinessUnitName}</span>
            </div>
          </div>
        ),
        sorter: true,
        filter: true,
      },
      {
        title: "Bonus System Type",
        render: (_, record, index) => (
          <div>
            {record?.intArrearBonusReferenceId
              ? "Arrear Bonus Generate"
              : "Bonus Generate"}
          </div>
        ),
        sorter: true,
        filter: false,
      },
      {
        title: "Bonus Name",
        dataIndex: "strBonusName",
        render: (strBonusName, record, index) => <div>{strBonusName}</div>,
        sorter: true,
        filter: true,
      },
      {
        title: "Effective Date",
        render: (_, record) => (
          <div className="d-flex align-items-center">
            <div>{dateFormatter(record?.application?.dteEffectedDateTime)}</div>
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
        render: (_, record) => (
          <div className="action-chip" style={{ width: "70px" }}>
            {record?.application?.strStatus === "Approved" && (
              <Chips label="Approved" classess="success" />
            )}
            {record?.application?.strStatus === "Pending" && (
              <>
                <div className="actionChip">
                  <Chips label="Pending" classess=" warning" />
                </div>
                <div className="d-flex actionIcon">
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
            {record?.application?.strStatus === "Rejected" && (
              <Chips label="Rejected" classess="danger" />
            )}
          </div>
        ),
        filter: false,
        sorter: true,
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
              {loading && <Loading />}
              <div className="all-candidate movement-wrapper">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="table-card">
                        <div className="table-card-heading">
                          <BackButton title={"Bonus Generate Approval"} />
                          <div className="table-card-head-right">
                            {filterData?.listData?.filter(
                              (item) => item?.selectCheckbox
                            ).length > 0 && (
                              <div className="d-flex actionIcon mr-3">
                                <Tooltip title="Accept">
                                  <div
                                    className="muiIconHover success mr-2"
                                    onClick={(e) => {
                                      e.stopPropagation();
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
                                          }}
                                        />
                                      }
                                    />
                                  </div>
                                </Tooltip>
                                <Tooltip title="Reject">
                                  <div
                                    className="muiIconHover  danger"
                                    onClick={(e) => {
                                      e.stopPropagation();
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
                                {/* {permission?.isCreate && (
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
                          <div className="table-card-body">
                            <div className="table-card-styled table-responsive tableOne">
                              {applicationListData?.listData?.length > 0 ? (
                                <>
                                  <AntTable
                                    data={
                                      applicationListData?.listData?.length > 0
                                        ? applicationListData?.listData
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
                                      record?.application?.intBonusHeaderId
                                    }
                                  />
                                </>
                              ) : (
                                <>{!loading && <NoResult />}</>
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
