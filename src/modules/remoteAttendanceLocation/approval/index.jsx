import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import BackButton from "../../../common/BackButton";
import FilterBadgeComponent from "../../../common/FilterBadgeComponent";
import IConfirmModal from "../../../common/IConfirmModal";
import Loading from "../../../common/loading/Loading";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import CardTable from "./component/CardTable";
import {
  getAllRemoteAttendanceListDataForApproval,
  RemoteAttendanceApproveReject,
} from "./helper";

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

export default function RemoteAttendanceApproval() {
  const { employeeId, isOfficeAdmin, orgId, wId, wgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  // const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [applicationListData, setApplicationListData] = useState([]);
  const [applicationData, setApplicationData] = useState([]);
  const [allData, setAllData] = useState();

  const getLandingData = () => {
    getAllRemoteAttendanceListDataForApproval(
      {
        applicationStatus: "Pending",
        isAdmin: isOfficeAdmin,
        isSupOrLineManager: 0,
        approverId: employeeId,
        workplaceGroupId: wgId,
        businessUnitId: buId,
        departmentId: 0,
        designationId: 0,
        applicantId: 0,
        accountId: orgId,
        intId: 0,
        workplaceId: wId,
      },

      setApplicationListData,
      setAllData,
      setLoading
    );
  };

  useEffect(() => {
    getLandingData(/* isSupOrLineManager?.value */);
  }, [employeeId]);

  // advance filter
  const [filterBages, setFilterBages] = useState({});
  const [filterValues, setFilterValues] = useState({});

  const handleSearch = (values) => {
    getAllRemoteAttendanceListDataForApproval(
      {
        applicationStatus: "Pending",
        isAdmin: isOfficeAdmin,
        approverId: employeeId,
        workplaceGroupId: wgId,
        businessUnitId: buId,
        departmentId: 0,
        designationId: 0,
        applicantId: 0,
        workplaceId: wId,
        accountId: orgId,
        intId: 0,
      },

      setApplicationListData,
      setAllData,
      setLoading
    );
    setFilterBages(values);
  };
  const clearFilter = () => {
    setFilterBages({});
    setFilterValues("");
    getLandingData();
  };
  const clearBadge = (values, name) => {
    const data = values;
    data[name] = "";
    setFilterBages(data);
    setFilterValues(data);
    handleSearch(data);
  };

  useEffect(() => {
    const array = [];
    applicationListData?.listData?.forEach((data) => {
      if (data?.selectCheckbox) {
        array.push({
          applicationId: data?.application?.intRemoteAttendanceId,
          approverEmployeeId: employeeId,
          accountId: orgId,
          isAdmin: isOfficeAdmin,
        });
      }
      setApplicationData(array);
    });
  }, [applicationListData]);

  const [appliedStatus] = useState({
    value: 1,
    label: "Pending",
  });

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
      getAllRemoteAttendanceListDataForApproval(
        {
          applicationStatus: "Pending",
          isAdmin: isOfficeAdmin,
          approverId: employeeId,
          workplaceId: wId,
          workplaceGroupId: wgId,
          businessUnitId: buId,
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
          RemoteAttendanceApproveReject(newArray, callback);
        }
        newArray = [];
      },
      noAlertFunc: () => {
        newArray = [];
      },
    };
    IConfirmModal(confirmObject);
  };

  //  For cheaps future nedded
  // const [filterDto, setFilterDto] = useState(...applicationListData);

  // const history = useHistory();

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30319) {
      permission = item;
    }
  });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Approval"));
    document.title = "Remote Attendance";
  }, []);

  return (
    <>
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ handleSubmit, resetForm, values, setFieldValue }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              <div className="all-candidate movement-wrapper">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="table-card">
                        <div className="table-card-heading">
                          <BackButton title={"Remote Attendance Approval"} />
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
                                      setAppliedStatus({
                                        value: 1,
                                        label: "Pending",
                                      });
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
                                    handleClick={(e) =>
                                      setfilterAnchorEl(e.currentTarget)
                                    }
                                  />
                                </li>
                              )} */}
                            </ul>
                          </div>
                        </div>
                        <FilterBadgeComponent
                          propsObj={{
                            filterBages,
                            setFieldValue,
                            clearBadge,
                            values: filterValues,
                            resetForm,
                            initData,
                            clearFilter,
                          }}
                        />
                        {permission?.isCreate ? (
                          <div className="table-card-body">
                            <div className="table-card-styled table-responsive tableOne">
                              <CardTable
                                propsObj={{
                                  setFieldValue,
                                  values,
                                  applicationListData,
                                  setApplicationListData,
                                  appliedStatus,
                                  setAllData,
                                  allData,
                                  filterValues,
                                  setFilterValues,
                                }}
                              ></CardTable>
                            </div>
                          </div>
                        ) : (
                          <NotPermittedPage />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* advance filter */}
                {/* <PopOverMasterFilter
                  propsObj={{
                    id,
                    open: openFilter,
                    anchorEl: filterAnchorEl,
                    handleClose: () => setfilterAnchorEl(null),
                    handleSearch,
                    values: filterValues,
                    dirty,
                    initData,
                    resetForm,
                    clearFilter,
                    sx: {},
                    size: "lg",
                  }}
                >
                  <FilterModal
                    propsObj={{
                      getFilterValues,
                      setFieldValue,
                      values,
                      errors,
                      touched,
                    }}
                  />
                </PopOverMasterFilter> */}
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
