/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import BackButton from "../../../../common/BackButton";
import IConfirmModal from "../../../../common/IConfirmModal";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import FilterModal from "./component/FilterModal";
import StyledTable from "./component/StyledTable";
import { approveAttendance, getAttendanceApprovalLanding } from "./helper";
import "./style.css";

const initData = {
  search: "",
};

export default function AttendanceApproval() {
  const {
    buId,
    orgId,
    employeeId,
    isSupNLMORManagement,
    isOfficeAdmin,
    wId,
    wgId,
  } = useSelector((state) => state?.auth?.profileData, shallowEqual);
  const [anchorEl, setAnchorEl] = useState(null);
  // const handleClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

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
      businessUnitId: buId,
      departmentId: 0,
      designationId: 0,
      applicantId: 0,
      accountId: orgId,
      intId: 0,
      workplaceId: wId,
      workplaceGroupId: wgId,
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
  }, [orgId, buId, wId]);

  useEffect(() => {
    const modifyData = allData?.map((item) => ({ ...item, isSelect: false }));
    setGridData(modifyData);
  }, [allData]);

  const demoPopup = (action, text) => {
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

    const confirmObject = {
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
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ handleSubmit, values, errors, touched, setFieldValue }) => (
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
                          <div>
                            {filterLanding?.filter(
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
