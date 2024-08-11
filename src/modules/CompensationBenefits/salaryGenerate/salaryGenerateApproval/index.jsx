/* eslint-disable react-hooks/exhaustive-deps */
import {
  Cancel,
  CheckCircle,
  InfoOutlined,
} from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import AntTable from "../../../../common/AntTable";
import AvatarComponent from "../../../../common/AvatarComponent";
import BackButton from "../../../../common/BackButton";
import Chips from "../../../../common/Chips";
import FilterBadgeComponent from "../../../../common/FilterBadgeComponent";
import FormikCheckBox from "../../../../common/FormikCheckbox";
import IConfirmModal from "../../../../common/IConfirmModal";
import { LightTooltip } from "../../../../common/LightTooltip";
import Loading from "../../../../common/loading/Loading";
import MuiIcon from "../../../../common/MuiIcon";
import NoResult from "../../../../common/NoResult";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import PopOverMasterFilter from "../../../../common/PopoverMasterFilter";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import {
  failColor,
  gray900,
  greenColor,
  successColor,
} from "../../../../utility/customColor";
import useDebounce from "../../../../utility/customHooks/useDebounce";
import { dateFormatter } from "../../../../utility/dateFormatter";
import { getMonthName } from "../../../../utility/monthUtility";
import {
  getAllSalaryGenerateListDataForApproval,
  salaryGenerateApproveReject,
} from "../helper";
import FilterModal from "./component/FilterModal";
import "./index.css";
import ApproveRejectComp from "common/ApproveRejectComp";
import { numberWithCommas } from "utility/numberWithCommas";

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

export default function SalaryGenerateApproval() {
  const { employeeId, isOfficeAdmin, orgId, wId, wgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);
  const [applicationListData, setApplicationListData] = useState([]);
  const [applicationData, setApplicationData] = useState([]);
  const [allData, setAllData] = useState();
  const [filterLanding, setFilterLanding] = useState([]);

  const getLandingData = () => {
    getAllSalaryGenerateListDataForApproval(
      {
        approverId: employeeId,
        intId: 0,
        workplaceGroupId: wgId,
        businessUnitId: buId,
        departmentId: 0,
        designationId: 0,
        applicantId: 0,
        fromDate: "",
        toDate: "",
        applicationStatus: appliedStatus?.label,
        isAdmin: isOfficeAdmin,
        isSupOrLineManager: 0,
        accountId: orgId,
        workplaceId: wId,
      },
      setApplicationListData,
      setAllData,
      setLoading,
      () => {},
      setFilterLanding
    );
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
    getAllSalaryGenerateListDataForApproval(
      {
        approverId: employeeId,
        intId: values?.intSalaryGenerateRequestId || 0,
        workplaceGroupId: values?.workplace?.id || wgId,
        businessUnitId: buId,
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
          applicationId: data?.intSalaryGenerateRequestId,
          approverEmployeeId: employeeId,
          accountId: orgId,
          isAdmin: isOfficeAdmin,
        });
      }
      setApplicationData(array);
    });
  }, [applicationListData]);

  const [appliedStatus, setAppliedStatus] = useState({
    value: 1,
    label: "Pending",
  });

  const saveHandler = (values) => {};
  const searchData = (keywords, allData, setRowDto) => {
    try {
      const regex = new RegExp(keywords?.toLowerCase());
      const newDta = allData?.listData?.filter(
        (item) =>
          regex.test(item?.strBusinessUnit?.toLowerCase()) ||
          regex.test(item?.strSalaryCode?.toLowerCase())
      );
      setRowDto({ listData: newDta });
    } catch {
      setRowDto([]);
    }
  };

  const demoPopup = (action, text, array) => {
    let newArray = [];
    const selected = filterLanding?.filter((item) => item?.selectCheckbox);
    if (selected.length > 0) {
      selected.forEach((item) => {
        if (text === "isReject") {
          newArray.push({
            applicationId: item?.intSalaryGenerateRequestId,
            approverEmployeeId: employeeId,
            accountId: orgId,
            isAdmin: isOfficeAdmin,
            isReject: true,
          });
        } else {
          newArray.push({
            applicationId: item?.intSalaryGenerateRequestId,
            approverEmployeeId: employeeId,
            accountId: orgId,
            isAdmin: isOfficeAdmin,
            isReject: false,
          });
        }
      });
    }

    const callback = () => {
      getAllSalaryGenerateListDataForApproval(
        {
          approverId: employeeId,
          intId: filterValues?.applicationStatus || 0,
          workplaceGroupId: filterValues?.workplace?.id || wgId,
          businessUnitId: buId,
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
        setAllData,
        setLoading
      );
    };
    const confirmObject = {
      closeOnClickOutside: false,
      message: ` Do you want to  ${action} ? `,
      yesAlertFunc: () => {
        if (array.length) {
          salaryGenerateApproveReject(newArray, callback);
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
        applicationId: item?.intSalaryGenerateRequestId,
        approverEmployeeId: employeeId,
        isReject: text === "Approve" ? false : true,
        accountId: orgId,
        isAdmin: isOfficeAdmin,
      },
    ];

    const callback = () => {
      getAllSalaryGenerateListDataForApproval(
        {
          approverId: employeeId,
          intId: filterValues?.applicationStatus || 0,
          workplaceGroupId: filterValues?.workplace?.id || wgId,
          businessUnitId: buId,
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
        setAllData,
        setLoading
      );
    };

    const confirmObject = {
      closeOnClickOutside: false,
      message: `Do you want to ${action}? `,
      yesAlertFunc: () => {
        salaryGenerateApproveReject(payload, callback);
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 107) {
      permission = item;
      return;
    }
  });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Approval"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Salary Approval";
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
                  filterLanding?.length > 0
                    ? filterLanding?.every((item) => item?.selectCheckbox)
                    : false
                }
                onChange={(e) => {
                  const data = filterLanding.map((item) => ({
                    ...item,
                    selectCheckbox: e.target.checked,
                  }));
                  setFilterLanding(data);
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
            <div>Business Unit</div>
          </div>
        ),
        dataIndex: "strBusinessUnit",
        render: (strBusinessUnit, record) => (
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
                  const data2 = filterLanding?.map((item) => {
                    if (
                      item?.intSalaryGenerateRequestId ===
                      record?.intSalaryGenerateRequestId
                    ) {
                      return {
                        ...item,
                        selectCheckbox: e.target.checked,
                      };
                    } else return item;
                  });
                  setFilterLanding(data2);
                  const data = applicationListData?.listData?.map((item) => {
                    if (
                      item?.intSalaryGenerateRequestId ===
                      record?.intSalaryGenerateRequestId
                    ) {
                      return {
                        ...item,
                        selectCheckbox: e.target.checked,
                      };
                    } else return item;
                  });
                  setApplicationListData({ listData: [...data] });
                }}
              />
            </div>
            <div className="d-flex align-items-center">
              <AvatarComponent letterCount={1} label={strBusinessUnit} />
              <span className="ml-2">{strBusinessUnit}</span>
            </div>
          </div>
        ),
        sorter: true,
        filter: true,
      },
      {
        title: "Salary Code",
        dataIndex: "strSalaryCode",
        sorter: true,
        filter: true,
      },
      {
        title: "Workplaces",
        render: (text) =>
          text ? (
            <LightTooltip title={<div>{text}</div>}>
              {text.substring(0, 15) + "...."}
            </LightTooltip>
          ) : (
            "-"
          ),
        dataIndex: "strWorkplace",
        width: 150,
      },
      {
        title: "Month",
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
                      {record?.application?.strDescription}
                    </p>
                  </div>
                </div>
              }
              arrow
            >
              <InfoOutlined sx={{ color: gray900 }} />
            </LightTooltip>
            <div className="ml-2">
              {getMonthName(record?.application?.intMonth)},
              {record?.application?.intYear}
            </div>
          </div>
        ),
        filter: false,
        sorter: false,
      },
      {
        title: "Application Date",
        render: (_, record) => (
          <div className="d-flex align-items-center">
            <div>{dateFormatter(record?.application?.dteUpdatedAt)}</div>
          </div>
        ),
        filter: false,
        sorter: false,
      },
      {
        title: "Net Amount",
        dataIndex: "numNetPayableSalary",
        sorter: true,
        filter: true,
        render: (_, record) => (
          <>
            {record?.application?.numNetPayableSalary
              ? numberWithCommas(record?.application?.numNetPayableSalary)
              : "0"}
          </>
        ),
        width: 120,
        className: "text-center",
      },
      {
        title: "Waiting Stage",
        dataIndex: "waitingStage",
        render: (waitingStage) => (
          <div className="d-flex align-items-center">
            <div>{waitingStage}</div>
          </div>
        ),
        filter: true,
        sorter: true,
      },
      {
        title: "Status",
        dataIndex: "status",
        render: (status, record) => (
          <div className="action-chip" style={{ width: "70px" }}>
            {status === "Approved" && (
              <Chips label="Approved" classess="success" />
            )}
            {status === "Pending" && (
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
            {status === "Rejected" && (
              <Chips label="Rejected" classess="danger" />
            )}
          </div>
        ),
      },
    ];
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { resetForm }) => {
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
                          <div className="d-flex align-items-center">
                            <BackButton title={"Salary Generate Approval"} />
                            {applicationListData?.listData?.filter(
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
                                    setPage={setPage}
                                    setPaginationSize={setPaginationSize}
                                    rowKey={(item) =>
                                      item?.intSalaryGenerateRequestId
                                    }
                                    // setColumnsData={(allData) => {
                                    //   setFilterLanding(allData);
                                    // }}
                                    setColumnsData={(allData) => {
                                      if (
                                        allData?.length ===
                                        applicationListData?.listData?.length
                                      ) {
                                        const temp = allData?.map((item) => {
                                          return {
                                            ...item,
                                            selectCheckbox: false,
                                          };
                                        });
                                        setFilterLanding(temp);
                                        setApplicationListData((prev) => ({
                                          ...prev,
                                          listData: temp,
                                        }));
                                        return;
                                      }
                                      setFilterLanding(allData);
                                    }}
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
