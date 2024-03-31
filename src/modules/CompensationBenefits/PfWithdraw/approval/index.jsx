/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import AntTable from "../../../../common/AntTable";
import BackButton from "../../../../common/BackButton";
import IConfirmModal from "../../../../common/IConfirmModal";
import Loading from "../../../../common/loading/Loading";
import NoResult from "../../../../common/NoResult";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import {
  getWithdrawalListDataForApproval,
  pfWithdrawApprovalLandingTableColumn,
  withdrawalApproveReject,
} from "./helper";

const initData = {
  search: "",
};

export default function PfWithdrawApproval() {
  const { employeeId, isOfficeAdmin, orgId, wId, wgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  // const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [applicationListData, setApplicationListData] = useState([]);
  const [applicationData, setApplicationData] = useState([]);
  const [allData, setAllData] = useState();

  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);

  const getLandingData = () => {
    getWithdrawalListDataForApproval(
      {
        applicationStatus: "Pending",
        isAdmin: isOfficeAdmin,
        isSupOrLineManager: 0,
        approverId: employeeId,
        workplaceGroupId: wgId,
        businessUnitId: buId,
        workplaceId: wId,
        departmentId: 0,
        designationId: 0,
        applicantId: 0,
        accountId: orgId,
        intId: 0,
      },

      setApplicationListData,
      setAllData,
      setLoading
    );
  };

  useEffect(() => {
    getLandingData();
  }, [employeeId]);

  useEffect(() => {
    const array = [];
    applicationListData?.listData?.forEach((data) => {
      if (data?.selectCheckbox) {
        array.push({
          applicationId: data?.application?.intPfwithdrawId,
          approverEmployeeId: employeeId,
          accountId: orgId,
          isAdmin: isOfficeAdmin,
        });
      }
      setApplicationData(array);
    });
  }, [applicationListData]);

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
      getWithdrawalListDataForApproval(
        {
          applicationStatus: "Pending",
          isAdmin: isOfficeAdmin,
          approverId: employeeId,
          workplaceGroupId: wgId,
          businessUnitId: buId,
          workplaceId: wId,
          departmentId: 0,
          designationId: 0,
          applicantId: 0,
          accountId: orgId,
          intId: 0,
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
          withdrawalApproveReject(newArray, callback);
        }
        newArray = [];
      },
      noAlertFunc: () => {
        newArray = [];
      },
    };
    IConfirmModal(confirmObject);
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30308) {
      permission = item;
    }
  });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Approval"));
    document.title = "PF Withdraw Approval";
  }, []);

  return (
    <>
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ handleSubmit, setFieldValue }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              <div className="all-candidate movement-wrapper">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="table-card">
                        <div className="table-card-heading">
                          <BackButton title={"PF Withdraw Approval"} />
                          <div>
                            {applicationListData?.listData?.filter(
                              (item) => item?.selectCheckbox
                            ).length > 0 && (
                              <div className="d-flex actionIcon">
                                <button
                                  className="btn-green mr-2"
                                  onClick={() => {
                                    demoPopup(
                                      "approve",
                                      "isApproved",
                                      applicationData
                                    );
                                  }}
                                >
                                  Approve
                                </button>
                                <button
                                  className="btn-red"
                                  onClick={() => {
                                    demoPopup(
                                      "reject",
                                      "isReject",
                                      applicationData
                                    );
                                  }}
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                            <ul className="d-flex flex-wrap">
                              {/* {isFilter && (
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
                                      // setAppliedStatus({
                                      //   value: 1,
                                      //   label: "Pending",
                                      // });
                                      getLandingData();
                                    }}
                                  />
                                </li>
                              )} */}
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
                                  />
                                </li>
                              )} */}
                            </ul>
                          </div>
                        </div>

                        {permission?.isCreate ? (
                          <>
                            {allData?.listData?.length > 0 ? (
                              <div className="table-card-body">
                                <div className="table-card-styled employee-table-card table-responsive ant-scrolling-Table">
                                  <AntTable
                                    data={allData?.listData}
                                    columnsData={pfWithdrawApprovalLandingTableColumn(
                                      {
                                        orgId,
                                        employeeId,
                                        isOfficeAdmin,
                                        setFieldValue,
                                        applicationListData,
                                        setApplicationListData,
                                        // appliedStatus,
                                        setAllData,
                                        setLoading,
                                        page,
                                        paginationSize,
                                        allData,
                                      }
                                    )}
                                    setColumnsData={(dataRow) => {
                                      if (
                                        dataRow?.length ===
                                        allData?.listData?.length
                                      ) {
                                        const temp = dataRow?.map((item) => {
                                          return {
                                            ...item,
                                            selectCheckbox: false,
                                          };
                                        });
                                        setApplicationListData({
                                          listData: [...temp],
                                        });
                                        setAllData({ listData: [...temp] });
                                      } else {
                                        setApplicationListData({
                                          listData: [...dataRow],
                                        });
                                      }
                                    }}
                                    setPage={setPage}
                                    setPaginationSize={setPaginationSize}
                                  />
                                </div>
                              </div>
                            ) : (
                              <NoResult />
                            )}
                          </>
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
}
