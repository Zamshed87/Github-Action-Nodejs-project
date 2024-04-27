import { SettingsBackupRestoreOutlined } from "@mui/icons-material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import BackButton from "../../../../common/BackButton";
import FilterBadgeComponent from "../../../../common/FilterBadgeComponent";
import IConfirmModal from "../../../../common/IConfirmModal";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import PopOverMasterFilter from "../../../../common/PopoverMasterFilter";
import ResetButton from "../../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import {
  getAllSalaryGenerateListDataForApproval,
  salaryGenerateApproveReject,
} from "../helper";
import CardTable from "./component/CardTable";
import FilterModal from "./component/FilterModal";
import "./index.css";
import ApproveRejectComp from "common/ApproveRejectComp";

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
  const { employeeId, isOfficeAdmin, orgId, wId, wgId, buId } = useSelector(
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
        workplaceGroupId: wgId,
        businessUnitId: buId,
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
        workplaceGroupId: wgId,
        businessUnitId: buId,
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
        workplaceGroupId: values?.workplace?.id || wgId,
        businessUnitId: buId,
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
          workplaceGroupId: filterValues?.workplace?.id || wgId,
          businessUnitId: buId,
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

    const confirmObject = {
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
      <Formik enableReinitialize={true} initialValues={initData}>
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
                          <div className="d-flex align-items-center">
                            <BackButton
                              title={"Arrear Salary Generate Approval"}
                            />
                            {applicationListData?.listData?.filter(
                              (item) => item?.selectCheckbox
                            ).length > 0 ? (
                              <ApproveRejectComp
                                props={{
                                  className: "ml-3",
                                  onApprove: () => {
                                    demoPopup(
                                      "approve",
                                      "isApproved",
                                      applicationData
                                    );
                                  },
                                  onReject: () => {
                                    demoPopup(
                                      "reject",
                                      "isReject",
                                      applicationData
                                    );
                                  },
                                }}
                              />
                            ) : null}
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
