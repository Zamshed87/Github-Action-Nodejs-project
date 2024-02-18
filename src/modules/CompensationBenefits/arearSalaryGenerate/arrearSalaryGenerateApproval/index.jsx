import {
  Cancel,
  CheckCircle,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import BackButton from "../../../../common/BackButton";
import FilterBadgeComponent from "../../../../common/FilterBadgeComponent";
import IConfirmModal from "../../../../common/IConfirmModal";
import Loading from "../../../../common/loading/Loading";
import MasterFilter from "../../../../common/MasterFilter";
import MuiIcon from "../../../../common/MuiIcon";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import PopOverMasterFilter from "../../../../common/PopoverMasterFilter";
import ResetButton from "../../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { failColor, successColor } from "../../../../utility/customColor";
import useDebounce from "../../../../utility/customHooks/useDebounce";
import {
  getAllSalaryGenerateListDataForApproval,
  salaryGenerateApproveReject,
} from "../helper";
import CardTable from "./component/CardTable";
import FilterModal from "./component/FilterModal";
import "./index.css";

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

export default function ArrearSalaryGenerateApproval() {
  const { employeeId, isOfficeAdmin, orgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);
  const [applicationListData, setApplicationListData] = useState([]);
  const [applicationData, setApplicationData] = useState([]);
  const [allData, setAllData] = useState();
  const [isFilter, setIsFilter] = useState(false);

  const getLandingData = () => {
    getAllSalaryGenerateListDataForApproval(
      {
        approverId: employeeId,
        intId: 0,
        workplaceGroupId: 0,
        workplaceId: wId,
        departmentId: 0,
        designationId: 0,
        applicantId: 0,
        fromDate: "",
        toDate: "",
        applicationStatus: appliedStatus?.label,
        isAdmin: isOfficeAdmin,
        isSupOrLineManager: 0,
        accountId: orgId,
      },
      setApplicationListData,
      setAllData,
      setLoading
    );
  };

  useEffect(() => {
    getAllSalaryGenerateListDataForApproval(
      {
        approverId: employeeId,
        workplaceId: wId,
        intId: 0,
        workplaceGroupId: 0,
        departmentId: 0,
        designationId: 0,
        applicantId: 0,
        fromDate: "",
        toDate: "",
        applicationStatus: appliedStatus?.label,
        isAdmin: isOfficeAdmin,
        isSupOrLineManager: 0,
        accountId: orgId,
      },
      setApplicationListData,
      setAllData,
      setLoading
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId, isOfficeAdmin, orgId]);

  const debounce = useDebounce();

  // advance filter
  const [filterAnchorEl, setfilterAnchorEl] = useState(null);
  const [filterBages, setFilterBages] = useState({});
  const [filterValues, setFilterValues] = useState({});
  const openFilter = Boolean(filterAnchorEl);
  const id = openFilter ? "simple-popover" : undefined;

  const handleSearch = (values) => {
    getAllSalaryGenerateListDataForApproval(
      {
        approverId: employeeId,
        intId: values?.intId || 0,
        workplaceGroupId: values?.workplace?.id || 0,
        departmentId: values?.department?.id || 0,
        designationId: values?.designation?.id || 0,
        applicantId: values?.employee?.id || 0,
        applicationStatus:
          values?.appStatus?.label === "Rejected"
            ? "Reject"
            : values?.appStatus?.label || "Pending",
        isAdmin: isOfficeAdmin,
        isSupOrLineManager: 0,
        accountId: orgId,
        workplaceId: wId,
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
          applicationId: data?.intId,
          approverEmployeeId: employeeId,
          accountId: orgId,
          isAdmin: isOfficeAdmin,
          fromDate: data?.dteEffectiveFrom,
          toDate: data?.dteEffectiveTo,
        });
      }
      setApplicationData(array);
    });
  }, [applicationListData, orgId, isOfficeAdmin, employeeId]);

  const [appliedStatus, setAppliedStatus] = useState({
    value: 1,
    label: "Pending",
  });

  const saveHandler = (values) => {};
  const searchData = (keywords, allData, setRowDto) => {
    try {
      const regex = new RegExp(keywords?.toLowerCase());
      let newDta = allData?.listData?.filter(
        (item) =>
          regex.test(item?.strBusinessUnit?.toLowerCase()) ||
          regex.test(item?.strArearSalaryCode?.toLowerCase())
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
      getAllSalaryGenerateListDataForApproval(
        {
          approverId: employeeId,
          intId: filterValues?.applicationStatus || 0,
          workplaceGroupId: filterValues?.workplace?.id || 0,
          departmentId: filterValues?.department?.id || 0,
          designationId: filterValues?.designation?.id || 0,
          applicantId: filterValues?.employee?.id || 0,
          applicationStatus:
            filterValues?.appStatus?.label === "Rejected"
              ? "Reject"
              : filterValues?.appStatus?.label || "Pending",
          isAdmin: isOfficeAdmin,
          isSupOrLineManager: 0,
          accountId: orgId,
          workplaceId: wId,
        },
        setApplicationListData,
        setAllData,
        setLoading
      );
    };

    let confirmObject = {
      closeOnClickOutside: false,
      message: ` Do you want to  ${action} ? `,
      yesAlertFunc: () => {
        if (array.length) {
          salaryGenerateApproveReject(newArray, callback);
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
    if (item?.menuReferenceId === 30314) {
      permission = item;
    }
  });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Approval"));
    document.title = "Arrear Salary Generate Approval";
  }, [dispatch]);

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
                          <BackButton
                            title={"Arrear Salary Generate Approval"}
                          />
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
                                      getLandingData();
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
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
