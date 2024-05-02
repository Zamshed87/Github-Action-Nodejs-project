/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Cancel,
  CheckCircle,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import AntTable from "common/AntTable";
import ApproveRejectComp from "common/ApproveRejectComp";
import BackButton from "common/BackButton";
import { Form, Formik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { dateFormatter } from "utility/dateFormatter";
import Chips from "../../../../common/Chips";
import IConfirmModal from "../../../../common/IConfirmModal";
import MuiIcon from "../../../../common/MuiIcon";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId]);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  const permission = useMemo(() => {
    return permissionList.find((item) => item?.menuReferenceId === 110) || {};
  }, [permissionList]);

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
                                      setRowDto(allData);
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
                              {rowDto?.length > 0 ? (
                                <>
                                  <table className="table d-none">
                                    <thead>
                                      <tr>
                                        <th>SL</th>
                                        <th>
                                          <div>Bonus Name</div>
                                        </th>
                                        <th>
                                          <div>Effective Date</div>
                                        </th>

                                        <th>
                                          <div className="text-left">
                                            Bonus Amount
                                          </div>
                                        </th>
                                        <th width="20%">
                                          <div className="text-left">
                                            Status
                                          </div>
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {rowDto?.map((data, index) => (
                                        <>
                                          <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>
                                              {data?.application?.strBonusName}
                                            </td>
                                            <td>
                                              {dateFormatter(
                                                data?.application
                                                  ?.dteEffectedDateTime
                                              )}
                                            </td>
                                            <td className="text-left">
                                              {
                                                data?.application
                                                  ?.numBonusAmount
                                              }
                                            </td>

                                            <td className="action-col text-right">
                                              <div
                                                className="text-right action-chip"
                                                style={{ width: "70px" }}
                                              >
                                                {data?.application
                                                  ?.strStatus ===
                                                  "Approved" && (
                                                  <Chips
                                                    label="Approved"
                                                    classess="success"
                                                  />
                                                )}
                                                {data?.application
                                                  ?.strStatus === "Pending" && (
                                                  <>
                                                    <div className="actionChip">
                                                      <Chips
                                                        label="Pending"
                                                        classess=" warning"
                                                      />
                                                    </div>
                                                    <div className="d-flex actionIcon justify-content-right">
                                                      <Tooltip title="Accept">
                                                        <div
                                                          className="mx-2 muiIconHover success "
                                                          onClick={() => {
                                                            demoPopupForTable(
                                                              "approve",
                                                              "Approve",
                                                              data
                                                            );
                                                          }}
                                                        >
                                                          <MuiIcon
                                                            icon={
                                                              <CheckCircle
                                                                sx={{
                                                                  color:
                                                                    "#34A853",
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
                                                            demoPopupForTable(
                                                              "reject",
                                                              "Reject",
                                                              data
                                                            );
                                                          }}
                                                        >
                                                          <MuiIcon
                                                            icon={
                                                              <Cancel
                                                                sx={{
                                                                  color:
                                                                    "#FF696C",
                                                                }}
                                                              />
                                                            }
                                                          />
                                                        </div>
                                                      </Tooltip>
                                                    </div>
                                                  </>
                                                )}
                                                {data?.application
                                                  ?.strStatus ===
                                                  "Rejected" && (
                                                  <Chips
                                                    label="Rejected"
                                                    classess="danger"
                                                  />
                                                )}
                                              </div>
                                            </td>
                                          </tr>
                                        </>
                                      ))}
                                    </tbody>
                                  </table>
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
                                    // setPage={setPage}
                                    // setPaginationSize={setPaginationSize}
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
