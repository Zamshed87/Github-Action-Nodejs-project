/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Cancel, CheckCircle } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import BackButton from "../../../../common/BackButton";
import IConfirmModal from "../../../../common/IConfirmModal";
import Loading from "../../../../common/loading/Loading";
import MuiIcon from "../../../../common/MuiIcon";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { failColor, successColor } from "../../../../utility/customColor";
import FilterModal from "./component/FilterModal";
import StyledTable from "./component/StyledTable";
import { approveAttendance, getAttendanceApprovalLanding } from "./helper";
import "./style.css";

const initData = {
  search: "",
};

export default function AttendanceApproval() {
  const { buId, orgId, employeeId, isSupNLMORManagement, isOfficeAdmin } =
    useSelector((state) => state?.auth?.profileData, shallowEqual);
  const [anchorEl, setAnchorEl] = useState(null);
  // const handleClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const saveHandler = (values) => {};

  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [applicationData, setApplicationData] = useState([]);
  // eslint-disable-next-line
  const [isFilter, setIsFilter] = useState(false);
  const [filterLanding, setFilterLanding] = useState([]);

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
    };
    getAttendanceApprovalLanding(
      payload,
      setGridData,
      setAllData,
      setLoading,
      setFilterLanding
    );
  };

  useEffect(() => {
    getLandingData();
  }, [orgId, buId]);

  useEffect(() => {
    const modifyData = allData?.map((item) => ({ ...item, isSelect: false }));
    setGridData(modifyData);
  }, [allData]);

  const demoPopup = (action, text, array) => {
    let newArray = [];
    const checkedList = filterLanding.filter((item) => item?.selectCheckbox);

    if (checkedList.length > 0) {
      checkedList.forEach((item) => {
        if (text === "isReject") {
          newArray.push({
            applicationId: item?.application?.intId,
            approverEmployeeId: employeeId,
            accountId: orgId,
            isAdmin: isOfficeAdmin,
            isReject: true,
          });
        } else {
          newArray.push({
            applicationId: item?.application?.intId,
            approverEmployeeId: employeeId,
            accountId: orgId,
            isAdmin: isOfficeAdmin,
            isReject: false,
          });
        }
      });
    }

    let confirmObject = {
      closeOnClickOutside: false,
      message: `Do you want to ${action} ?`,
      yesAlertFunc: () => {
        if (newArray.length) {
          approveAttendance(newArray, setLoading, () => getLandingData());
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
    const array = [];
    gridData?.forEach((data) => {
      if (data?.selectCheckbox) {
        array.push({
          applicationId: data?.application?.intId,
          approverEmployeeId: employeeId,
          accountId: orgId,
          isAdmin: isOfficeAdmin,
        });
      }
      setApplicationData(array);
    });
  }, [gridData]);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 105) {
      permission = item;
    }
  });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Approval"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Attendance Approval";
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
              <div className="all-candidate movement-wrapper">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="table-card">
                        <div className="table-card-heading">
                          <BackButton title={"Attendance Approval"} />
                          <div className="table-card-head-right">
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
                                        applicationData
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
                                        applicationData
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
                            {/*      <ul className="d-flex flex-wrap">
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
                                      filterData(value, allData, setGridData);
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
                                    handleClick={handleClick}
                                    isHiddenFilter
                                  />
                                </li>
                              )}
                            </ul> */}
                          </div>
                        </div>
                        {permission?.isCreate ? (
                          <div className="table-card-body">
                            <div className="table-card-styled table-responsive tableOne">
                              <StyledTable
                                gridData={gridData}
                                setGridData={setGridData}
                                values={values}
                                errors={errors}
                                touched={touched}
                                setFieldValue={setFieldValue}
                                setLoading={setLoading}
                                getLandingData={getLandingData}
                                allData={allData}
                                filterLanding={filterLanding}
                                setFilterLanding={setFilterLanding}
                              />
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
      <FilterModal
        propsObj={{
          id,
          open,
          anchorEl,
          handleClose,
          setAllData,
          setIsFilter,
          // setDateOpen,
          // dateOpen,
        }}
      />
    </>
  );
}
