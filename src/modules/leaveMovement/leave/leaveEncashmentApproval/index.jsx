/* eslint-disable react-hooks/exhaustive-deps */
import { ArrowBack, Cancel, CheckCircle } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import IConfirmModal from "../../../../common/IConfirmModal";
import Loading from "../../../../common/loading/Loading";
import MasterFilter from "../../../../common/MasterFilter";
import MuiIcon from "../../../../common/MuiIcon";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import CardTable from "./component/CardTable";
import FilterModal from "./component/FilterModal";
import {
  getLeaveEncashmentApprovalData,
  leaveEncashmenApproveReject
} from "./helper";
import "./index.css";

const initData = {
  search: "",
};

export default function LeaveEncashmentApproval() {
  const { orgId, buId, employeeId, userId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const saveHandler = (values) => {};
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);
  const getLandingData = () => {
    getLeaveEncashmentApprovalData(
      {
        viewType: 1,
        employeeId: employeeId,
        workplaceGroupId: 0,
        departmentId: 0,
        designationId: 0,
        fromDate: "",
        toDate: "",
        leaveNencashmentApplicationId: 0,
      },
      setRowDto,
      setAllData,
      setLoading
    );
  };

  useEffect(() => {
    getLandingData();
  }, [orgId, buId]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const demoPopup = (action, isAction) => {
    const payload = [];
    rowDto?.forEach((data) => {
      data?.selectCheckbox &&
        payload.push({
          leaveNencashmentApplicationId: data?.intLeaveNEncashmentApplicationId,
          employeeId: data?.employeeId,
          requestDays: data?.intRequestDays,
          isEncash: data?.isEncash,
          insertUserId: userId,
          updateUserId: "",
          approverEmployeeId: employeeId,
          isReject: isAction,
        });
    });
    let confirmObject = {
      closeOnClickOutside: false,
      message: `Do you want to ${action} ?`,
      yesAlertFunc: () => {
        leaveEncashmenApproveReject(payload, getLandingData);
      },
      noAlertFunc: () => {
      },
    };
    IConfirmModal(confirmObject);
  };

  const history = useHistory();

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 103) {
      permission = item;
    }
  });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Approval"));
  }, []);

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
        }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              <div className="all-candidate">
                <div className="container-fluid encashment-wrapper">
                  <div className="row">
                    {/* <div className="col-md-2">
                      <SideMenu />
                    </div> */}
                    <div className="col-md-12">
                      <div className="table-card">
                        <div className="table-card-heading mt-2">
                          <div style={{ color: "rgba(0, 0, 0, 0.7)" }}>
                            <Tooltip title="Back">
                              <ArrowBack
                                onClick={() => history.goBack()}
                                sx={{
                                  fontSize: "16px",
                                  marginRight: "10px",
                                  cursor: "pointer",
                                }}
                              />
                            </Tooltip>
                            <h3
                              style={{
                                display: "inline-block",
                                fontSize: "13px",
                              }}
                            >
                              Leave Encashment Approval
                            </h3>
                          </div>
                          <div className="table-card-head-right">
                            {rowDto?.filter((item) => item?.selectCheckbox)
                              .length > 0 && (
                              <div className="d-flex actionIcon mr-3">
                                <Tooltip title="Accept">
                                  <div
                                    className="muiIconHover success "
                                    onClick={() => {
                                      demoPopup("Approve", false);
                                    }}
                                  >
                                    <MuiIcon
                                      icon={
                                        <CheckCircle
                                          sx={{
                                            color: "#34A853",
                                            width: "16px",
                                            height: "16px",
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
                                      demoPopup("Reject", true);
                                    }}
                                  >
                                    <MuiIcon
                                      icon={
                                        <Cancel
                                          sx={{
                                            color: "#FF4842",
                                            width: "16px",
                                            height: "16px",
                                          }}
                                        />
                                      }
                                    />
                                  </div>
                                </Tooltip>
                              </div>
                            )}
                            {permission?.isCreate && (
                              <MasterFilter
                                width="200px"
                                inputWidth="200px"
                                value={values?.search}
                                setValue={(value) => {
                                  setFieldValue("search", value);
                                }}
                                cancelHandler={() => {
                                  setFieldValue("search", "");
                                }}
                                handleClick={handleClick}
                              />
                            )}
                          </div>
                        </div>
                        {permission?.isCreate ? (
                          <div className="table-card-body">
                            <CardTable
                              propsObj={{
                                rowDto,
                                setRowDto,
                                getLandingData,
                                allData,
                              }}
                            ></CardTable>
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
            <FilterModal
              propsObj={{
                id,
                open,
                anchorEl,
                handleClose,
                // filterDto,
                // setFilterDto,
                // setDateOpen,
                // dateOpen,
              }}
            ></FilterModal>
          </>
        )}
      </Formik>
    </>
  );
}
