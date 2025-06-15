/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { useMemo } from "react";
import { Tooltip } from "@mui/material";
import {
  Cancel,
  CheckCircle,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { useState } from "react";
import useAxiosPost from "../../../../utility/customHooks/useAxiosPost";
import { todayDate } from "../../../../utility/todayDate";
import IConfirmModal from "../../../../common/IConfirmModal";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import Loading from "../../../../common/loading/Loading";
import BackButton from "../../../../common/BackButton";
import MuiIcon from "../../../../common/MuiIcon";
import { failColor, successColor } from "../../../../utility/customColor";
import ResetButton from "../../../../common/ResetButton";
import MasterFilter from "../../../../common/MasterFilter";
import { approvedNOCHandler, filterData, nocApprovalDtoColumn } from "./utils";
import AntTable from "../../../../common/AntTable";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import NoResult from "../../../../common/NoResult";

const NOCApprovalLandng = () => {
  const dispatch = useDispatch();
  const {
    profileData: {
      buId,
      orgId,
      employeeId,
      isSupNLMORManagement,
      isOfficeAdmin,
    },
    permissionList,
  } = useSelector((state) => state?.auth, shallowEqual);
  const [gridData, getApplicationData, loadingLandinig, setGridData] =
    useAxiosPost([]);
  const [updateApplicationData, setUpdateApplicationData] = useState([]);
  const [, approvedAPIAction, loadingApproval] = useAxiosPost([]);
  const [isFilter, setIsFilter] = useState(false);
  const permission = useMemo(
    () => permissionList.find((menu) => menu.menuReferenceId === 30349),
    [permissionList]
  );

  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(50);

  const { values, setFieldValue } = useFormik({
    enableReinitialize: true,
    initialValues: {
      search: "",
    },
    onSubmit: (values, { setSubmitting, resetForm }) => {},
  });

  const getLandingData = () => {
    const payload = {
      applicationStatus: "Pending",
      isAdmin: isOfficeAdmin,
      isSupOrLineManager: isSupNLMORManagement,
      approverId: employeeId,
      workplaceId: 0,
      businessUnitId: buId,
      workplaceGroupId: 0,
      departmentId: 0,
      designationId: 0,
      applicantId: 0,
      accountId: orgId,
      intId: 0,

      // isSupervisor: true,
      // isLineManager: true,
      // isUserGroup: true,

      fromDate: todayDate(),
      toDate: todayDate(),
    };
    getApplicationData(
      "/ApprovalPipeline/NOCApplicationLanding",
      payload,
      (res) => {
        setGridData(res?.listData);
        setUpdateApplicationData(res?.listData);
      }
    );
  };
  const singlePopup = (action, text, item) => {
    let payload = [
      {
        applicationId: item?.application?.intNocApplicationId,
        approverEmployeeId: employeeId,
        isReject: text === "Approve" ? false : true,
        accountId: orgId,
        isAdmin: isOfficeAdmin,
        fromDate: todayDate(),
        toDate: todayDate(),
      },
    ];

    const callback = () => {
      getLandingData();
    };
    let confirmObject = {
      closeOnClickOutside: false,
      message: `Do you want to ${action}? `,
      yesAlertFunc: () => {
        approvedNOCHandler(approvedAPIAction, payload, callback);
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  const demoPopup = (action, text, updateApplicationData) => {
    let newArray = [];
    updateApplicationData?.length > 0 &&
      updateApplicationData?.forEach((data) => {
        if (data?.selectCheckbox) {
          newArray.push({
            applicationId: data?.application?.intNocApplicationId,
            approverEmployeeId: employeeId,
            accountId: orgId,
            isAdmin: isOfficeAdmin,
            fromDate: todayDate(),
            toDate: todayDate(),
            isReject: text === "isReject" ? true : false,
          });
        }
      });

    let confirmObject = {
      closeOnClickOutside: false,
      message: `Do you want to ${action} ?`,
      yesAlertFunc: () => {
        if (newArray.length) {
          approvedNOCHandler(approvedAPIAction, newArray, getLandingData);
        }
        newArray = [];
      },
      noAlertFunc: () => {
        newArray = [];
      },
    };
    IConfirmModal(confirmObject);
  };

  useEffect(() => {
    getLandingData();
  }, [orgId, buId]);
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Approval"));
  }, []);

  return (
    <>
      {(loadingLandinig || loadingApproval) && <Loading />}
      <div className="all-candidate movement-wrapper">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="table-card">
                <div className="table-card-heading">
                  <BackButton title={"NOC Approval"} />
                  <div className="table-card-head-right">
                    {updateApplicationData?.length > 0 &&
                      updateApplicationData?.filter(
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
                                  updateApplicationData
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
                                  updateApplicationData
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
                            width="200px"
                            inputWidth="200px"
                            value={values?.search}
                            setValue={(value) => {
                              filterData(
                                value,
                                gridData,
                                setGridData,
                                setUpdateApplicationData
                              );
                              setFieldValue("search", value);
                              if (value) {
                                setIsFilter(true);
                              } else {
                                setIsFilter(false);
                              }
                            }}
                            cancelHandler={() => {
                              setIsFilter(false);
                              setFieldValue("search", "");
                              getLandingData();
                            }}
                            // handleClick={handleClick}
                            isHiddenFilter
                          />
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
                {permission?.isCreate ? (
                  <div className="table-card-body">
                    <div className="table-card-styled table-responsive tableOne">
                      <div
                        className="table-card-styled tableOne"
                        style={{ overflowX: "hidden" }}
                      >
                        {gridData?.length > 0 ? (
                          <AntTable
                            rowSelection={{
                              type: "checkbox",
                            }}
                            data={gridData}
                            columnsData={nocApprovalDtoColumn(
                              updateApplicationData,
                              setUpdateApplicationData,
                              page,
                              paginationSize,
                              gridData,
                              setGridData,
                              setFieldValue,
                              isOfficeAdmin,
                              singlePopup
                            )}
                            rowKey={(row) => row?.intShiftChangeId}
                            setPage={setPage}
                            setPaginationSize={setPaginationSize}
                            setColumnsData={(newData) => {
                              setUpdateApplicationData(newData);
                            }}
                          />
                        ) : (
                          <NoResult title="No Application Found" para="" />
                        )}
                      </div>
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
    </>
  );
};

export default NOCApprovalLandng;
