/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Cancel,
  CheckCircle,
  SettingsBackupRestoreOutlined
} from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import AntTable from "common/AntTable";
import ApproveRejectComp from "common/ApproveRejectComp";
import BackButton from "common/BackButton";
import FormikCheckBox from "common/FormikCheckbox";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { gray900, greenColor } from "utility/customColor";
import { dateFormatter } from "utility/dateFormatter";
import { formatMoney } from "utility/formatMoney";
import Chips from "../../../../common/Chips";
import IConfirmModal from "../../../../common/IConfirmModal";
import MuiIcon from "../../../../common/MuiIcon";
import NoResult from "../../../../common/NoResult";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import ResetButton from "./../../../../common/ResetButton";
import {
  bonusApproveRejectRequest,
  getBonusGenerateRequestReport,
} from "./helper";

const initData = {
  search: "",
};

const BonusApproval = () => {
  const [loading, setLoading] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const [show, setShow] = useState(false);

  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);
  const [applicationData, setApplicationData] = useState([]);
  
  // rowDto
  const [rowDto, setRowDto] = useState([]);
  // const [allData, setAllData] = useState([]);
  // filter
  const [status, setStatus] = useState("");

  const { userId, orgId, buId, wId, wgId, employeeId, isOfficeAdmin } =
    useSelector((state) => state?.auth?.profileData, shallowEqual);

  const getData = () => {
    const payload = {
      approverId: employeeId,
      movementTypeId: 0,
      workplaceGroupId: wgId,
      businessUnitId: buId,
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
    getBonusGenerateRequestReport(
      payload,
      setRowDto,
      setFilterData,
      setLoading
    );
  };
  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId]);

  // Approve Handler
  const approveHandler = (message, item) => {
    const payload = {
      strPartName: "BonusApproval",
      jsonObj: {
        autoId: item?.intBonusHeaderId,
        approveStatusId: 1,
        approveBy: userId,
      },
    };
    const confirmObject = {
      closeOnClickOutside: false,
      message: `Are your sure for ${message}?`,
      yesAlertFunc: () => {
        bonusApproveRejectRequest(payload, getData);
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };
  // Reject Handler
  const rejectHandler = (message, item) => {
    const payload = {
      strPartName: "BonusApproval",
      jsonObj: {
        autoId: item?.intBonusHeaderId,
        approveStatusId: 2,
        approveBy: userId,
      },
    };
    const confirmObject = {
      closeOnClickOutside: false,
      message: `Are your sure for ${message}`,
      yesAlertFunc: () => {
        bonusApproveRejectRequest(payload, getData);
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  const saveHandler = (values) => {};

  const history = useHistory();

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 110) {
      permission = item;
    }
  });

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

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Approval"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Bonus Approval";
  }, []);

  // for multipel
  const demoPopup = (action, text, array) => {
    let newArray = [];
    const checkedList = array?.filter((item) => item?.selectCheckbox);
    if (checkedList.length > 0) {
      checkedList?.forEach((item) => {
        if (text === "isReject") {
          newArray.push({
            isReject: true,
            applicationId: item?.application?.intBonusHeaderId,
            approverEmployeeId: employeeId,
            accountId: orgId,
            fromDate: item?.application?.dteCreatedAt,
            toDate: item?.application?.dteCreatedAt,
            isAdmin: isOfficeAdmin,
          });
        } else {
          newArray.push({
            isReject: false,
            applicationId: item?.application?.intBonusHeaderId,
            approverEmployeeId: employeeId,
            accountId: orgId,
            fromDate: item?.application?.dteCreatedAt,
            toDate: item?.application?.dteCreatedAt,
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
          bonusApproveRejectRequest(newArray, getData);
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
        isReject: text === "Reject" ? true : false,
        applicationId: data?.application?.intBonusHeaderId,
        approverEmployeeId: employeeId,
        accountId: orgId,
        fromDate: data?.application?.dteCreatedAt,
        toDate: data?.application?.dteCreatedAt,
        isAdmin: isOfficeAdmin,
      },
    ];
    let confirmObject = {
      closeOnClickOutside: false,
      message: ` Do you want to ${action}? `,
      yesAlertFunc: () => {
        bonusApproveRejectRequest(payload, getData);
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  const getLandingTableForBonus = (setFieldValue, page, paginationSize) => {
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
                  setRowDto({
                    listData: filterData?.listData?.map((item) => ({
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
            <div>Bonus Name</div>
          </div>
        ),
        dataIndex: "strBonusName",
        render: (strBonusName, record) => (
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
                  const BonusData = filterData?.listData?.map((item) => {
                    console.log("record",record)
                    if (
                      item?.application?.intBonusId ===
                      record?.application?.intBonusId
                    ) {
                      return {
                        ...item,
                        selectCheckbox: e.target.checked,
                      };
                    } else return item;
                  });
                  const data = filterData?.listData?.map((item) => {
                    if (
                      item?.record?.application?.intBonusId ===
                      record?.record?.application?.intBonusId
                    ) {
                      return {
                        ...item,
                        selectCheckbox: e.target.checked,
                      };
                    } else return item;
                  });
                  setFilterData({ listData: [...BonusData] });
                  setFilterData({ listData: [...data] });
                }}
              />
            </div>
            <div className="d-flex align-items-center">
              <span className="ml-2">{strBonusName}</span>
            </div>
          </div>
        ),
        sorter: true,
        filter: true,
      },

      {
        title: "Effective Date",
        dataIndex: "dteEffectedDateTime",
        render: (_, record) => (
          <div className="d-flex align-items-center">
            <div>
              {dateFormatter(record?.application?.dteEffectedDateTime)}
            </div>
          </div>
        ),
        sorter: false,
        filter: false,
      },
      {
        title: "Bonus Amount",
        dataIndex: "numBonusAmount",
        render: (_, record) => (
          <div className="d-flex align-items-center">
            <div>
              {formatMoney(record?.application?.numBonusAmount)}
            </div>
          </div>
        ),
        sorter: false,
        filter: false,
      },


      {
        title: "Status",
        dataIndex: "strStatus",
        render: (_, record) => (
          <div className="text-center action-chip">
            {record?.application?.strStatus === "Approved" && (
              <Chips label="Approved" classess="success" />
            )}

            {record?.application?.strStatus === "Pending" && (
              <>
                <div className="actionChip">
                  <Chips label="Pending" classess=" warning" />
                </div>
                <div className="d-flex actionIcon justify-content-right">
                  <Tooltip title="Accept">
                    <div
                      className="mx-2 muiIconHover success "
                      onClick={() => {
                        demoPopupForTable("approve", "Approve", record);
                      }}
                    >
                      <MuiIcon
                        icon={
                          <CheckCircle
                            sx={{
                              color: "#34A853",
                            }}
                          />
                        }
                      />
                    </div>
                  </Tooltip>
                  <Tooltip title="Reject">
                    <div
                      className="muiIconHover danger"
                      onClick={() => {
                        demoPopupForTable("reject", "Reject", record);
                      }}
                    >
                      <MuiIcon
                        icon={
                          <Cancel
                            sx={{
                              color: "#FF696C",
                            }}
                          />
                        }
                      />
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
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({ handleSubmit, values, setFieldValue }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              <div className="loan-application">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="table-card">
                        <div className="table-card-heading">
                          <div style={{ color: "rgba(0, 0, 0, 0.7)" }}>
                            <div className="d-flex align-items-center">
                            {/* <Tooltip title="Back">
                              <ArrowBack
                                onClick={() => history.goBack()}
                                sx={{
                                  fontSize: "16px",
                                  marginRight: "10px",
                                  cursor: "pointer",
                                }}
                              />
                            </Tooltip> */}
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
                            {/* <h3
                              style={{
                                display: "inline-block",
                                fontSize: "13px",
                              }}
                            >
                              Bonus Approval
                            </h3> */}
                          </div>
                          <div className="table-card-head-right">
                            <ul>
                              {(values?.search || status) && (
                                <li>
                                  <ResetButton
                                    title="reset"
                                    icon={
                                      <SettingsBackupRestoreOutlined
                                        sx={{ marginRight: "10px" }}
                                      />
                                    }
                                    onClick={() => {
                                      setRowDto(filterData);
                                      setFieldValue("search", "");
                                      setStatus("");
                                    }}
                                  />
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>
                        {permission?.isCreate ? (
                          <div className="table-card-body">
                            <div className="table-card-styled tableOne">
                              {rowDto?.listData?.length > 0 ? (
                                <>
                                  <AntTable
                                    data={rowDto?.listData?.length > 0 ? rowDto?.listData : []}
                                    columnsData={getLandingTableForBonus(
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
                                      // setViewModalRow(true);
                                    }}
                                  />
                                </>
                              ) : (
                                <>
                                  {!loading && (
                                    <NoResult title="No Result Found" para="" />
                                  )}
                                </>
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
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default BonusApproval;
