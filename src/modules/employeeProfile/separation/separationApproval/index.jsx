import {
  Cancel,
  CheckCircle,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import useDebounce from "../../../../utility/customHooks/useDebounce";
import CardTable from "./component/CardTable";
import FilterModal from "./component/FilterModal";
import {
  getAllSeparationListDataForApproval,
  separationApproveReject,
} from "./helper";
import "./index.css";
import ViewFormComponent from "./view-form";
import IConfirmModal from "./../../../../common/IConfirmModal";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import Loading from "../../../../common/loading/Loading";
import BackButton from "../../../../common/BackButton";
import MuiIcon from "../../../../common/MuiIcon";
import { failColor, successColor } from "../../../../utility/customColor";
import ResetButton from "../../../../common/ResetButton";
import MasterFilter from "../../../../common/MasterFilter";
import FilterBadgeComponent from "../../../../common/FilterBadgeComponent";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import PopOverMasterFilter from "../../../../common/PopoverMasterFilter";
import { useMemo } from "react";

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

export default function SeparationApproval() {
  const { employeeId, isOfficeAdmin, orgId, buId, wId, strDisplayName } =
    useSelector((state) => state?.auth?.profileData, shallowEqual);
  // const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [applicationListData, setApplicationListData] = useState([]);
  const [applicationData, setApplicationData] = useState([]);
  const [allData, setAllData] = useState();
  const [isFilter, setIsFilter] = useState(false);
  // const [isSupOrLineManager, setIsSupOrLineManager] = useState({
  //   value: 1,
  //   label: "Supervisor",
  // });

  //View Modal
  const [viewModal, setViewModal] = useState(false);
  const [imageFile] = useState("");
  const [, setCreateModal] = useState(false);
  const [singleData, setSingleData] = useState("");

  const handleOpen = () => {
    setViewModal(false);
  };

  // for view Modal
  const handleViewClose = () => setViewModal(false);

  const getLandingData = () => {
    getAllSeparationListDataForApproval(
      {
        applicationStatus: "Pending",
        isAdmin: isOfficeAdmin,
        isSupOrLineManager: 0,
        approverId: employeeId,
        businessUnitId: buId,
        workplaceGroupId: 0,
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
    getAllSeparationListDataForApproval(
      {
        applicationStatus: "Pending",
        isAdmin: isOfficeAdmin,
        isSupOrLineManager: 0,
        approverId: employeeId,
        workplaceId: wId,
        businessUnitId: buId,
        workplaceGroupId: 0,
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
  }, [employeeId, orgId, buId, isOfficeAdmin]);

  const debounce = useDebounce();

  // advance filter
  const [filterAnchorEl, setfilterAnchorEl] = useState(null);
  const [filterBages, setFilterBages] = useState({});
  const [filterValues, setFilterValues] = useState({});
  const openFilter = Boolean(filterAnchorEl);
  const id = openFilter ? "simple-popover" : undefined;

  const handleSearch = (values) => {
    getAllSeparationListDataForApproval(
      {
        applicationStatus: "Pending",
        isAdmin: isOfficeAdmin,
        isSupOrLineManager: 0,
        approverId: employeeId,
        workplaceId: wId,
        businessUnitId: buId,
        workplaceGroupId: 0,
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
    setFilterBages(values);
    setfilterAnchorEl(null);
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
  const getFilterValues = (name, value) => {
    setFilterValues((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const array = [];
    applicationListData?.listData?.forEach((data) => {
      if (data?.selectCheckbox) {
        array.push({
          applicationId: data?.application?.intSeparationId,
          approverEmployeeId: employeeId,
          accountId: orgId,
          isAdmin: isOfficeAdmin,
          approverEmployeeName: strDisplayName,
          comments: "All ok",
        });
      }
      setApplicationData(array);
    });
  }, [applicationListData, orgId, employeeId, isOfficeAdmin]);

  const [appliedStatus, setAppliedStatus] = useState({
    value: 1,
    label: "Pending",
  });

  const saveHandler = (values) => {};
  const searchData = (keywords, allData, setRowDto) => {
    try {
      const regex = new RegExp(keywords?.toLowerCase());
      const newDta = allData?.listData?.filter(
        (item) =>
          regex.test(item?.strEmployeeName?.toLowerCase()) ||
          regex.test(item?.strDesignation?.toLowerCase()) ||
          regex.test(item?.strDepartment?.toLowerCase()) ||
          regex.test(item?.strSeparationTypeName?.toLowerCase())
      );
      setRowDto({ listData: newDta });
    } catch {
      setRowDto([]);
    }
  };
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
      getAllSeparationListDataForApproval(
        {
          applicationStatus: "Pending",
          isAdmin: isOfficeAdmin,
          isSupOrLineManager: 0,
          approverId: employeeId,
          workplaceId: wId,
          businessUnitId: buId,
          workplaceGroupId: 0,
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
          separationApproveReject(newArray, setLoading, callback);
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

  const permission = useMemo(
    () => permissionList.find((item) => item?.menuReferenceId === 109),
    [permissionList]
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Approval"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Separation Approval";
  }, []);

  return (
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
        dirty,
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
                        <BackButton title={"Separation Approval"} />
                        <div className="table-card-head-right">
                          {applicationListData?.listData?.filter(
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
                                    setAppliedStatus({
                                      value: 1,
                                      label: "Pending",
                                    });
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
                                    getLandingData(/* isSupOrLineManager?.value */);
                                  }}
                                  handleClick={(e) =>
                                    setfilterAnchorEl(e.currentTarget)
                                  }
                                />
                              </li>
                            )}
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
                                setSingleData,
                                filterValues,
                                setFilterValues,
                                setViewModal,
                                setLoading,
                                loading
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
              <PopOverMasterFilter
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
              </PopOverMasterFilter>
              {/* View Form Modal */}
              <ViewFormComponent
                objProps={{
                  show: viewModal,
                  title: "Separation Details",
                  onHide: handleViewClose,
                  size: "lg",
                  backdrop: "static",
                  classes: "default-modal",
                  handleOpen,
                  singleData,
                  setSingleData,
                  setCreateModal,
                  appliedStatus,
                  setApplicationListData,
                  imageFile,
                  filterValues,
                  setAllData,
                  setLoading,
                }}
              />
            </div>
          </Form>
        </>
      )}
    </Formik>
  );
}
