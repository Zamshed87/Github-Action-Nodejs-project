/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Cancel, CheckCircle } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
// import { inputHandler, movementApproveReject } from "../helper";
import ApproveRejectComp from "common/ApproveRejectComp";
import FormikInput from "common/FormikInput";
import useAxiosPost from "utility/customHooks/useAxiosPost";
import IConfirmModal from "common/IConfirmModal";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import Loading from "common/loading/Loading";
import BackButton from "common/BackButton";
import AntTable from "common/AntTable";
import NoResult from "common/NoResult";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import FormikCheckBox from "common/FormikCheckbox";
import { gray900, greenColor } from "utility/customColor";
import AvatarComponent from "common/AvatarComponent";
import { dateFormatter } from "utility/dateFormatter";
import Chips from "common/Chips";
import MuiIcon from "common/MuiIcon";

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

export default function IncrementProposalApproval() {
  const { employeeId, isOfficeAdmin, orgId, wId, wgId, buId, userName } =
    useSelector((state) => state?.auth?.profileData, shallowEqual);
  // const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [applicationListData, setApplicationListData] = useState([]);
  const [allData, setAllData] = useState();
  const [
    landingApproval,
    getLandingApproval,
    loadingApproval,
    setLandingApproval,
  ] = useAxiosPost();
  const [, approveIncrement, load, ,] = useAxiosPost();
  const [filterLanding, setFilterLanding] = useState([]);

  const getLandingData = () => {
    const payload = {
      // ---------
      approverId: employeeId,
      movementTypeId: 0,
      workplaceGroupId: wgId,
      businessUnitId: buId,
      departmentId: 0,
      designationId: 0,
      applicantId: 0,
      intId: 0,
      fromDate: "",
      toDate: "",
      applicationStatus: "Pending", // appliedStatus?.label,
      isAdmin: isOfficeAdmin,
      isSupOrLineManager: 0,
      accountId: orgId,
      workplaceId: wId,
    };
    getLandingApproval(
      `/ApprovalPipeline/IncrementProposalApplicationLanding`,
      payload,
      (res) => {
        const temp = res?.listData?.map((item) => {
          return {
            ...item,
            selectCheckbox: false,
            newAmount: 0,
            newPercent: 0,
          };
        });
        setLandingApproval(temp);
        setFilterLanding(temp);
      }
    );
  };

  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);

  const inputHandler = (
    name,
    value,
    sl,
    landingApproval,
    setLandingApproval
  ) => {
    let data = [...landingApproval];
    let _sl = data[sl];
    _sl[name] = value;

    if (name === "newPercent") {
      _sl.newAmount =
        (_sl?.incrementProposal?.numRecentGrossSalary * value) / 100;
    }
    if (name === "newAmount") {
      _sl.newPercent =
        (value * 100) / _sl?.incrementProposal?.numRecentGrossSalary;
    }

    setLandingApproval(data);
  };
  const saveHandler = (values) => {};
  // for multiple approval
  const demoPopup = (action, text, array) => {
    let newArray = [];
    const checkedList = array?.filter((item) => item?.selectCheckbox);
    if (checkedList.length > 0) {
      checkedList?.forEach((item) => {
        if (text === "isReject") {
          newArray.push({
            isReject: true,
            applicationId: item?.incrementProposal?.intId,
            approverEmployeeId: employeeId,
            accountId: orgId,
            incrementProposalPercentage: item?.newPercent
              ? item?.newPercent
              : item?.incrementProposal?.numIncrementProposalPercentage,
            incrementProposalAmount: item?.newAmount
              ? item?.newAmount
              : item?.incrementProposal?.numIncrementProposalAmount,

            isAdmin: isOfficeAdmin,
            approverEmployeeName: userName || "",
            comments: item?.remarks || "",
            //
          });
        } else {
          newArray.push({
            isReject: false,
            applicationId: item?.incrementProposal?.intId,
            approverEmployeeId: employeeId,
            accountId: orgId,
            incrementProposalPercentage: item?.newPercent
              ? item?.newPercent
              : item?.incrementProposal?.numIncrementProposalPercentage,
            incrementProposalAmount: item?.newAmount
              ? item?.newAmount
              : item?.incrementProposal?.numIncrementProposalAmount,

            isAdmin: isOfficeAdmin,
            approverEmployeeName: userName || "",
            comments: item?.remarks || "",
          });
        }
      });
    }
    let confirmObject = {
      closeOnClickOutside: false,
      message: ` Do you want to  ${action} ? `,
      yesAlertFunc: () => {
        if (array.length) {
          //   movementApproveReject(newArray, getLandingData, setLoading);
          approveIncrement(
            `/ApprovalPipeline/IncrementProposalApplicationApproval`,
            newArray,
            () => {
              getLandingData();
            },
            true
          );
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
        // ------
        applicationId: data?.incrementProposal?.intId,
        approverEmployeeId: employeeId,
        // approverEmployeeId: item?.movementApplication?.intEmployeeId,
        isReject: text === "Reject" ? true : false,
        incrementProposalPercentage: data?.newPercent
          ? data?.newPercent
          : data?.incrementProposal?.numIncrementProposalPercentage,
        incrementProposalAmount: data?.newAmount
          ? data?.newAmount
          : data?.incrementProposal?.numIncrementProposalAmount,
        accountId: orgId,
        isAdmin: isOfficeAdmin,
        approverEmployeeName: userName || "",
        comments: data?.remarks || "",
      },
    ];
    let confirmObject = {
      closeOnClickOutside: false,
      message: ` Do you want to ${action}? `,
      yesAlertFunc: () => {
        // movementApproveReject(payload, getLandingData, setLoading);
        approveIncrement(
          `/ApprovalPipeline/IncrementProposalApplicationApproval`,
          payload,
          () => {
            getLandingData();
          },
          true
        );
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30506) {
      permission = item;
    }
  });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Approval"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Increment Proposal Approval";
  }, []);

  useEffect(() => {
    getLandingData(/* isSupOrLineManager?.value */);
  }, [employeeId, wId]);

  const columns = (setFieldValue, page, paginationSize, values) => {
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
                      item?.incrementProposal?.intId ===
                      record?.incrementProposal?.intId
                    ) {
                      return {
                        ...item,
                        selectCheckbox: e.target.checked,
                      };
                    } else return item;
                  });
                  let data2 = landingApproval?.map((item) => {
                    if (
                      item?.incrementProposal?.intId ===
                      record?.incrementProposal?.intId
                    ) {
                      return {
                        ...item,
                        selectCheckbox: e.target.checked,
                      };
                    } else return item;
                  });
                  setFilterLanding(data);
                  setLandingApproval(data2);
                  setApplicationListData(data);
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
        // sorter: true,
        filter: true,
      },
      {
        title: "Department",
        dataIndex: "department",
        // sorter: true,
        filter: true,
      },

      {
        title: "Last Increment Date",
        // dataIndex: "StartTime",
        render: (_, data) => (
          <div>
            {data?.incrementProposal?.dteLastIncrementDate &&
              dateFormatter(data?.incrementProposal?.dteLastIncrementDate)}
          </div>
        ),
        filter: false,
        sorter: false,
      },
      {
        title: "Last Increment Amount",
        // dataIndex: "StartTime",
        render: (_, data) => (
          <div>
            {data?.incrementProposal?.numLastIncrementAmount &&
              data?.incrementProposal?.numLastIncrementAmount}
          </div>
        ),
        filter: false,
        sorter: false,
      },
      {
        title: "Recent Gross Salary",
        // dataIndex: "StartTime",
        render: (_, data) => (
          <div>
            {data?.incrementProposal?.numRecentGrossSalary &&
              data?.incrementProposal?.numRecentGrossSalary}
          </div>
        ),
        filter: false,
        sorter: false,
      },
      {
        title: "Proposed Increment Percentage",
        // dataIndex: "StartTime",
        render: (_, data) => (
          <div>
            {data?.incrementProposal?.numIncrementProposalPercentage &&
              data?.incrementProposal?.numIncrementProposalPercentage}
          </div>
        ),
        filter: false,
        sorter: false,
      },
      {
        title: "Proposed Increment Amount",
        // dataIndex: "StartTime",
        render: (_, data) => (
          <div>
            {data?.incrementProposal?.numIncrementProposalAmount &&
              data?.incrementProposal?.numIncrementProposalAmount}
          </div>
        ),
        filter: false,
        sorter: false,
      },

      {
        title: "Application Date",
        render: (_, data) => (
          <div>
            {data?.incrementProposal?.dteCreatedAt &&
              dateFormatter(data?.incrementProposal?.dteCreatedAt)}
          </div>
        ),
        filter: false,
        sorter: false,
        isDate: true,
      },
      {
        title: "Adjust Increment Percentage",
        render: (_, data, index) => (
          <div className="d-flex align-items-center">
            {console.log({ data })}
            <div>
              <FormikInput
                classes="input-sm"
                value={data?.newPercent}
                name="newPercent"
                type="number"
                min="0"
                className="form-control"
                // placeholder="newPercent"
                onChange={(e) => {
                  inputHandler(
                    "newPercent",
                    +e.target.value || 0,
                    index,
                    landingApproval,
                    setLandingApproval
                  );
                }}
              />
            </div>
          </div>
        ),
        filter: false,
        sorter: false,
        width: "130px",
      },
      {
        title: "Adjust Increment Amount",
        render: (_, data, index) => (
          <div className="d-flex align-items-center">
            <div>
              <FormikInput
                classes="input-sm"
                value={data?.newAmount}
                name="newAmount"
                type="number"
                min="0"
                className="form-control"
                // placeholder="newPercent"
                onChange={(e) => {
                  inputHandler(
                    "newAmount",
                    +e.target.value || 0,
                    index,
                    landingApproval,
                    setLandingApproval
                  );
                }}
              />
            </div>
          </div>
        ),
        filter: false,
        sorter: false,
        width: "130px",
      },
      {
        title: "Current Stage",
        dataIndex: "currentStage",
        filter: false,
        sorter: false,
      },
      // {
      //   title: "Waiting Stage",
      //   dataIndex: "waitingStage",
      //   filter: false,
      //   sorter: false,
      // },

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
  console.log("kjsdf", landingApproval);
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
              {(loading || loadingApproval || load) && <Loading />}
              <div className="all-candidate movement-wrapper">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="table-card">
                        <div className="table-card-heading">
                          <div className="d-flex align-items-center">
                            <BackButton title={"Increment Proposal Approval"} />
                            {filterLanding?.filter(
                              (item) => item?.selectCheckbox
                            ).length > 0 ? (
                              <ApproveRejectComp
                                props={{
                                  className: "ml-3",
                                  onApprove: () => {
                                    demoPopup(
                                      "approve",
                                      "isApproved",
                                      filterLanding
                                    );
                                  },
                                  onReject: () => {
                                    demoPopup(
                                      "reject",
                                      "isReject",
                                      filterLanding
                                    );
                                  },
                                }}
                              />
                            ) : null}
                          </div>
                        </div>
                        {/* <FilterBadgeComponent
                          propsObj={{
                            filterBages,
                            setFieldValue,
                            clearBadge,
                            values: filterValues,
                            resetForm,
                            initData,
                            clearFilter,
                          }}
                        /> */}
                        {permission?.isCreate ? (
                          <div className="table-card-body">
                            <div className="table-card-styled table-responsive tableOne">
                              {landingApproval?.length > 0 ? (
                                <AntTable
                                  data={landingApproval}
                                  columnsData={columns(
                                    setFieldValue,
                                    page,
                                    paginationSize,
                                    values
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
                                    item?.incrementProposal?.intId
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
