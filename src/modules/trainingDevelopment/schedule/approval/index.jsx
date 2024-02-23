/* eslint-disable react-hooks/exhaustive-deps */
import { Cancel, CheckCircle } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import AntTable from "../../../../common/AntTable";
import BackButton from "../../../../common/BackButton";
import IConfirmModal from "../../../../common/IConfirmModal";
import Loading from "../../../../common/loading/Loading";
import MuiIcon from "../../../../common/MuiIcon";
import NoResult from "../../../../common/NoResult";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { failColor, successColor } from "../../../../utility/customColor";
import useAxiosPost from "../../../../utility/customHooks/useAxiosPost";
import { scheduleApprovalColumn } from "./helper";

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

export default function TrainingScheduleApproval() {
  const { employeeId, isOfficeAdmin, orgId, buId, wId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  // update sate using custom hooks
  const [
    landingApproval,
    getLandingApproval,
    loadingApproval,
    setLandingApproval,
  ] = useAxiosPost();
  const [, scheduleRejectApprove, actionLoading] = useAxiosPost();
  const [filterLanding, setFilterLanding] = useState([]);
  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);

  const getLandingData = () => {
    getLandingApproval(
      `/ApprovalPipeline/TrainingScheduleLandingEngine`,
      {
        applicationStatus: "Pending",
        isAdmin: isOfficeAdmin,
        isSupOrLineManager: 0,
        isSupervisor: true,
        isLineManager: true,
        isUserGroup: true,
        approverId: employeeId,
        workplaceId: wId,
        businessUnitId: buId,
        workplaceGroupId: wgId,
        departmentId: 0,
        designationId: 0,
        applicantId: 0,
        accountId: orgId,
        intTrainingScheduleId: 0,
      },
      (res) => {
        let temp = res?.listData?.map((item) => {
          return {
            ...item,
            selectCheckbox: false,
          };
        });
        setLandingApproval(temp);
        setFilterLanding(temp);
      }
    );
  };

  // approval handeler
  const handleApprovalAction = (payload, cb) => {
    scheduleRejectApprove(
      "/ApprovalPipeline/TrainingScheduleApprovalEngine",
      payload,
      () => {
        cb?.();
      },
      true
    );
  };
  useEffect(() => {
    getLandingData();
  }, [employeeId, wId]);

  // const searchData = (keywords, allData, setRowDto) => {
  //   try {
  //     const regex = new RegExp(keywords?.toLowerCase());
  //     let newDta = allData?.listData?.filter((item) =>
  //       regex.test(item?.employeeName?.toLowerCase())
  //     );
  //     setRowDto({ listData: newDta });
  //   } catch {
  //     setRowDto([]);
  //   }
  // };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30359) {
      permission = item;
    }
  });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Approval"));
    document.title = "Training Schedule Approval";
  }, []);

  const demoPopupForTable = (action, text, data) => {
    let payload = [
      {
        applicationId: data?.application?.intScheduleId,
        approverEmployeeId: employeeId,
        isReject: text === "Reject" ? true : false,
        fromDate: data?.application?.dteFromDate,
        toDate: data?.application?.dteToDate,
        accountId: orgId,
        isAdmin: isOfficeAdmin,
      },
    ];
    let confirmObject = {
      closeOnClickOutside: false,
      message: ` Do you want to ${action}? `,
      yesAlertFunc: () => {
        handleApprovalAction(payload, getLandingData);
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };
  // for multiple approval
  const demoPopup = (action, text, array) => {
    let newArray = [];
    const checkedList = array?.filter((item) => item?.selectCheckbox);
    if (checkedList.length > 0) {
      checkedList?.forEach((item) => {
        if (text === "isReject") {
          newArray.push({
            isReject: true,
            applicationId: item?.application?.intScheduleId,
            approverEmployeeId: employeeId,
            accountId: orgId,
            fromDate: item?.application?.dteFromDate,
            toDate: item?.application?.dteToDate,
            isAdmin: isOfficeAdmin,
          });
        } else {
          newArray.push({
            isReject: false,
            applicationId: item?.application?.intScheduleId,
            approverEmployeeId: employeeId,
            accountId: orgId,
            fromDate: item?.application?.dteFromDate,
            toDate: item?.application?.dteToDate,
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
          handleApprovalAction(newArray, getLandingData);
        }
        newArray = [];
      },
      noAlertFunc: () => {
        newArray = [];
      },
    };
    IConfirmModal(confirmObject);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ handleSubmit, setFieldValue }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {(actionLoading || loadingApproval) && <Loading />}
              <div className="all-candidate movement-wrapper">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="table-card">
                        <div className="table-card-heading">
                          <BackButton title={"Training Schedule Approval"} />
                          <div>
                            {filterLanding?.filter(
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
                                        filterLanding
                                      );
                                    }}
                                  >
                                    <MuiIcon
                                      icon={
                                        <CheckCircle
                                          sx={{
                                            color: successColor,
                                            width: "25px !important",
                                            height: "35px !important",
                                            fontSize: "20px !important",
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
                                        filterLanding
                                      );
                                    }}
                                  >
                                    <MuiIcon
                                      icon={
                                        <Cancel
                                          sx={{
                                            color: failColor,
                                            width: "25px !important",
                                            height: "35px !important",
                                            fontSize: "20px !important",
                                          }}
                                        />
                                      }
                                    />
                                  </div>
                                </Tooltip>
                              </div>
                            )}
                          </div>
                        </div>
                        {permission?.isCreate ? (
                          <div className="table-card-body">
                            <div className="table-card-styled table-responsive tableOne">
                              {landingApproval?.length > 0 ? (
                                <AntTable
                                  data={landingApproval}
                                  columnsData={scheduleApprovalColumn(
                                    setFieldValue,
                                    page,
                                    paginationSize,
                                    demoPopupForTable,
                                    filterLanding,
                                    landingApproval,
                                    setFilterLanding,
                                    setLandingApproval
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
                                    item?.application?.intScheduleId
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
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
