/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Cancel,
  CheckCircle,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import AntTable from "../../../../common/AntTable";
import AvatarComponent from "../../../../common/AvatarComponent";
import BackButton from "../../../../common/BackButton";
import Chips from "../../../../common/Chips";
import FormikCheckBox from "../../../../common/FormikCheckbox";
import IConfirmModal from "../../../../common/IConfirmModal";
import { LightTooltip } from "../../../../common/LightTooltip";
import MasterFilter from "../../../../common/MasterFilter";
import MuiIcon from "../../../../common/MuiIcon";
import NoResult from "../../../../common/NoResult";
import ResetButton from "../../../../common/ResetButton";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { gray900, greenColor } from "../../../../utility/customColor";
import useDebounce from "../../../../utility/customHooks/useDebounce";
import { dateFormatter } from "../../../../utility/dateFormatter";
import {
  AdditionNDeductionApproveReject,
  getAllAdditionNDeductionListDataForApproval,
} from "../helper";
import "./index.css";
import ApproveRejectComp from "common/ApproveRejectComp";

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

export default function AllowanceNDeductionApproval() {
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
  const [filterData, setFilterData] = useState({});

  // const [isSupOrLineManager, setIsSupOrLineManager] = useState({
  //   value: 1,
  //   label: "Supervisor",
  // });

  const getLandingData = (/* isSupOrLineManager = 1 */) => {
    getAllAdditionNDeductionListDataForApproval(
      {
        applicationStatus: "Pending",
        isAdmin: isOfficeAdmin,
        isSupOrLineManager: 0,
        approverId: employeeId,
        workplaceGroupId: wgId,
        businessUnitId: buId,
        departmentId: 0,
        designationId: 0,
        applicantId: 0,
        accountId: orgId,
        intId: 0,
        workplaceId: wId,
      },

      setApplicationListData,
      setAllData,
      setFilterData,
      setLoading
    );
  };

  useEffect(() => {
    getLandingData(/* isSupOrLineManager?.value */);
  }, [employeeId]);

  const debounce = useDebounce();

  // advance filter
  // const [filterAnchorEl, setfilterAnchorEl] = useState(null);
  // const [filterBages, setFilterBages] = useState({});
  // const [filterValues, setFilterValues] = useState({});
  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);
  // const openFilter = Boolean(filterAnchorEl);
  // const id = openFilter ? "simple-popover" : undefined;

  useEffect(() => {
    const array = [];
    filterData?.listData?.forEach((data) => {
      if (data?.selectCheckbox) {
        array.push({
          applicationId: data?.application?.intSalaryAdditionAndDeductionId,
          approverEmployeeId: employeeId,
          accountId: orgId,
          isAdmin: isOfficeAdmin,
        });
      }
      setApplicationData(array);
    });
  }, [filterData]);

  const [appliedStatus, setAppliedStatus] = useState({
    value: 1,
    label: "Pending",
  });

  const saveHandler = (values) => {};
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
    let payload = [];
    if (array.length > 1) {
      array.forEach((item) => {
        if (item?.selectCheckbox) {
          payload.push({
            applicationId: item?.application?.intSalaryAdditionAndDeductionId,
            fromDate: item?.application?.dteCreatedAt || null,
            toDate: item?.application?.dteUpdatedAt || null,
            approverEmployeeId: employeeId,
            isReject: text === "Approved" ? false : true,
            accountId: orgId,
            isAdmin: isOfficeAdmin,
          });
        }
      });
    } else {
      payload.push({
        applicationId: array[0]?.application?.intSalaryAdditionAndDeductionId,
        fromDate: array[0]?.application?.dteCreatedAt || null,
        toDate: array[0]?.application?.dteUpdatedAt || null,
        approverEmployeeId: employeeId,
        isReject: text === "Approved" ? false : true,
        accountId: orgId,
        isAdmin: isOfficeAdmin,
      });
    }

    const callback = () => {
      getAllAdditionNDeductionListDataForApproval(
        {
          applicationStatus: "Pending",
          isAdmin: isOfficeAdmin,
          approverId: employeeId,
          workplaceGroupId: wgId,
          businessUnitId: buId,
          departmentId: 0,
          designationId: 0,
          applicantId: 0,
          accountId: orgId,
          intId: 0,
          workplaceId: wId,
        },
        setApplicationListData,
        setAllData,
        setFilterData,
        setLoading
      );
    };

    const confirmObject = {
      closeOnClickOutside: false,
      message: ` Do you want to  ${action} ? `,
      yesAlertFunc: () => {
        AdditionNDeductionApproveReject(payload, callback);
        payload = [];
      },
      noAlertFunc: () => {
        payload = [];
      },
    };
    IConfirmModal(confirmObject);
  };

  //  For cheaps future nedded
  // const [filterDto, setFilterDto] = useState(...applicationListData);

  // const history = useHistory();

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30310) {
      permission = item;
    }
  });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Approval"));
    document.title = "Allowance & Deduction Approval";
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
        width: "10px",
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
              filterData?.listData?.length > 0 &&
              filterData?.listData?.every((item) => item?.selectCheckbox)
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
                  const data = applicationListData?.listData?.map((item) => {
                    if (
                      item?.application?.intSalaryAdditionAndDeductionId ===
                      record?.application?.intSalaryAdditionAndDeductionId
                    ) {
                      return {
                        ...item,
                        selectCheckbox: e.target.checked,
                      };
                    } else return item;
                  });
                  const data2 = filterData?.listData?.map((item) => {
                    if (
                      item?.application?.intSalaryAdditionAndDeductionId ===
                      record?.application?.intSalaryAdditionAndDeductionId
                    ) {
                      return {
                        ...item,
                        selectCheckbox: e.target.checked,
                      };
                    } else return item;
                  });
                  // console.log({data2})
                  setFilterData({ listData: [...data2] });
                  setApplicationListData({ listData: [...data] });
                }}
              />
            </div>
          </div>
        ),
      },
      {
        title: () => (
          <div className="">
            <div>Code</div>
          </div>
        ),
        dataIndex: "employeeCode",
        render: (employeeCode, record, index) => (
          <div className="">
            <div className="">
              <span className="">{employeeCode}</span>
            </div>
          </div>
        ),
        sorter: true,
        filter: true,
        isNumber: true,
      },
      {
        title: "Employee",
        dataIndex: "employeeName",
        render: (data) => {
          return (
            <div className="d-flex align-items-center">
              <AvatarComponent classess="" letterCount={1} label={data} />
              <span className="ml-2">{data}</span>
            </div>
          );
        },
        sorter: true,
        filter: true,
      },
      {
        title: "Designation",
        dataIndex: "designation",
        render: (_, record) => (
          <div>
            {" "}
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
        title: "Application Date",
        dataIndex: "",
        render: (_, record) => (
          <div>{dateFormatter(record?.application?.dteCreatedAt)}</div>
        ),
        filter: false,
        sorter: false,
      },
      {
        title: "Addition/Deduction",
        // dataIndex: "dateRange",
        render: (_, record) => (
          <div>{record?.application?.strAdditionNdeduction}</div>
        ),
        filter: false,
        sorter: false,
      },
      {
        title: "Type",
        // dataIndex: "dateRange",
        render: (_, record) => (
          <div>
            {record?.application?.isAddition ? "Addition" : "Deduction"}
          </div>
        ),
        filter: false,
        sorter: false,
      },
      {
        title: "Dimention",
        dataIndex: "currentStage",
        render: (_, data) => (
          <div className="d-flex align-items-center justify-content-start">
            <LightTooltip
              title={
                <div className="p-1">
                  <div className="border-bottom mb-1">
                    <p
                      className="tooltip-title"
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      Amount
                    </p>
                    <p
                      className="tooltip-subTitle"
                      style={{
                        fontSize: "12px",
                        fontWeight: "500",
                      }}
                    >
                      {data?.application?.numAmount}
                    </p>
                  </div>
                  <div className="border-bottom mb-1">
                    <p
                      className="tooltip-title mt-1"
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      Date
                    </p>
                    <p
                      className="tooltip-subTitle mb-0"
                      style={{
                        fontSize: "12px",
                        fontWeight: "500",
                      }}
                    >
                      {data?.application?.strMonth},{data?.application?.intYear}{" "}
                      -{" "}
                      {data?.application?.strToMonth &&
                        data?.application?.strToMonth + ","}
                      {data?.application?.intToYear}
                      {!data?.application?.intToYear && "Continue"}
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
                      Auto Renewal
                    </p>
                    <p
                      className="tooltip-subTitle mb-0"
                      style={{
                        fontSize: "12px",
                        fontWeight: "500",
                      }}
                    >
                      {data?.application?.isAutoRenew ? "Yes" : "No" || "N/A"}
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
            <div className="ml-2"> {data?.application?.strAmountWillBe}</div>
          </div>
        ),
        filter: false,
        sorter: false,
      },
      {
        title: "Waiting Stage",
        dataIndex: "waitingStage",
        render: (waitingStage, record) => (
          <div className="d-flex align-items-center">
            <div>{waitingStage}</div>
          </div>
        ),
        filter: false,
        sorter: false,
        hidden: isOfficeAdmin ? false : true,
      },
      {
        title: "Status",
        dataIndex: "status",
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
                        demoPopup("approve", "Approved", [data]);
                      }}
                    >
                      <MuiIcon
                        icon={
                          <CheckCircle sx={{ color: "var(--primary-color)" }} />
                        }
                      />
                    </div>
                  </Tooltip>
                  <Tooltip title="Reject">
                    <div
                      className="muiIconHover danger"
                      onClick={() => {
                        demoPopup("reject", "Reject", [data]);
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
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({ handleSubmit, values, setFieldValue, setValues }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              <div className="leave-approved">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="table-card">
                        <div className="table-card-heading">
                          <div className="d-flex align-items-center">
                            <BackButton
                              title={"Allowance & Deduction Approval"}
                            />
                            {filterData?.listData?.filter(
                              (item) => item?.selectCheckbox
                            ).length > 0 ? (
                              <ApproveRejectComp
                                props={{
                                  className: "ml-3",
                                  onApprove: () => {
                                    demoPopup(
                                      "approve",
                                      "Approved",
                                      // applicationData
                                      filterData?.listData
                                    );
                                  },
                                  onReject: () => {
                                    demoPopup(
                                      "reject",
                                      "Reject",
                                      // applicationData
                                      filterData?.listData
                                    );
                                  },
                                }}
                              />
                            ) : null}
                          </div>
                        </div>
                        {permission?.isCreate ? (
                          <div className="table-card-body">
                            <div className="table-card-styled tableOne">
                              {applicationListData?.listData?.length > 0 ? (
                                <AntTable
                                  data={applicationListData?.listData}
                                  columnsData={columns(
                                    setValues,
                                    page,
                                    paginationSize
                                  )}
                                  setColumnsData={(dataRow) => {
                                    setFilterData({ listData: dataRow });
                                  }}
                                  setPage={setPage}
                                  setPaginationSize={setPaginationSize}
                                  // handleTableChange={({pagination, filters, sorter, newRowDto}) => {
                                  //     console.log({pagination, filters, sorter, newRowDto})
                                  // }}
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
                {/* <PopOverMasterFilter
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
                </PopOverMasterFilter> */}
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
