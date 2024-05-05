/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Cancel,
  CheckCircle,
  SettingsBackupRestoreOutlined
} from "@mui/icons-material";
import AntTable from "common/AntTable";
import ApproveRejectComp from "common/ApproveRejectComp";
import BackButton from "common/BackButton";
import Chips from "common/Chips";
import FormikCheckBox from "common/FormikCheckbox";
import MuiIcon from "common/MuiIcon";
import { Form, Formik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { Tooltip } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { gray900, greenColor } from "utility/customColor";
import { dateFormatter } from "utility/dateFormatter";
import { formatMoney } from "utility/formatMoney";
import IConfirmModal from "../../../../common/IConfirmModal";
import NoResult from "../../../../common/NoResult";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import ResetButton from "./../../../../common/ResetButton";
import {
  bonusApprovalTableColumn,
  bonusApproveRejectRequest,
  getBonusGenerateRequestReport,
} from "./helper";

const initData = {
  search: "",
};

const BonusApproval = () => {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);
  const [applicationData, setApplicationData] = useState([]);
  
  // rowDto
  const [rowDto, setRowDto] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [allData, setAllData] = useState([]);

  // filter
  const [status, setStatus] = useState("");

  const { orgId, buId, wId, wgId, employeeId, isOfficeAdmin } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

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
      setAllData,
      setLoading,
      (res) => {
        setFilterData(res);
      }
    );
  };
  useEffect(() => {
    getData();
  }, [orgId, buId, wgId, wId]);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  const permission = useMemo(() => {
    return permissionList.find((item) => item?.menuReferenceId === 110) || {};
  }, [permissionList]);

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
  const demoPopup = (action, text, filterData) => {
    let newArray = [];
    const checkedList = filterData?.filter((item) => item?.selectCheckbox);
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
    const confirmObject = {
      closeOnClickOutside: false,
      message: ` Do you want to  ${action} ? `,
      yesAlertFunc: () => {
        if (filterData.length) {
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
    const payload = [
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
    const confirmObject = {
      closeOnClickOutside: false,
      message: ` Do you want to ${action}? `,
      yesAlertFunc: () => {
        bonusApproveRejectRequest(payload, getData);
      },
      noAlertFunc: () => {
        //
      },
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
        onSubmit={() => {
          //
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
                          <div className="d-flex align-items-center">
                            <BackButton title={"Bonus Approval"} />
                            {filterData?.filter((item) => item?.selectCheckbox)
                              .length > 0 ? (
                              <ApproveRejectComp
                                props={{
                                  onApprove: () => {
                                    demoPopup(
                                      "approve",
                                      "isApproved",
                                      filterData
                                    );
                                  },
                                  onReject: () => {
                                    demoPopup("reject", "isReject", filterData);
                                  },
                                }}
                              />
                            ) : null}
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
                                    data={rowDto || []}
                                    columnsData={bonusApprovalTableColumn({
                                      setFieldValue,
                                      setFilterData,
                                      rowData: rowDto,
                                      filterData,
                                      setRowData: setRowDto,
                                      demoPopupForTable,
                                    })}
                                    setColumnsData={(dataRow) => {
                                      setFilterData(dataRow);
                                    }}
                                    rowKey={(record) =>
                                      record?.leaveApplication?.intApplicationId
                                    }
                                    removePagination={true}
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
