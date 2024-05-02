/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  SettingsBackupRestoreOutlined
} from "@mui/icons-material";
import AntTable from "common/AntTable";
import ApproveRejectComp from "common/ApproveRejectComp";
import BackButton from "common/BackButton";
import { Form, Formik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
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
