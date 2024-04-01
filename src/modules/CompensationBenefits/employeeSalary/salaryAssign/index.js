/* eslint-disable react-hooks/exhaustive-deps */
import { AddOutlined } from "@mui/icons-material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import FilterBadgeComponent from "../../../../common/FilterBadgeComponent";
import FormikSelect from "../../../../common/FormikSelect";
import MasterFilter from "../../../../common/MasterFilter";
import PopOverMasterFilter from "../../../../common/PopoverMasterFilter";
import PrimaryButton from "../../../../common/PrimaryButton";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import PeopleDeskTable, {
  paginationSize,
} from "../../../../common/peopleDeskTable";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import useAxiosPost from "../../../../utility/customHooks/useAxiosPost";
import { customStyles } from "../../../../utility/selectCustomStyle";
import NoResult from "./../../../../common/NoResult";
import BankDetails from "./DrawerBody/bankDetails";
import IncrementHistoryComponent from "./DrawerBody/incrementHistoryView";
import { defaultSalaryInitData } from "./DrawerBody/utils";
import ClientSalaryAssignModule from "./clientSalaryAssign";
import FilterModal from "./component/FilterModal";
import {
  getBreakdownListDDL,
  getBreakdownPolicyDDL,
  getByIdBreakdownListDDL,
  getEmployeeSalaryInfo,
  getSalaryAssignLanding,
  salaryAssignLandingColumn,
} from "./helper";

const initData = {
  search: "",
  status: "",
  srcText: "",
  salaryStatus: { value: "NotAssigned", label: "Not Assigned" },
  // master filter
  workplace: "",
  department: "",
  designation: "",
  supervisor: "",
  employee: "",
};

const SalaryAssign = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    document.title = "Salary Assign";
  }, []);

  const { orgId, buId, employeeId, wgId, wgName, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 76) {
      permission = item;
    }
  });

  // state
  const [loading, setLoading] = useState(false);
  const [, setRowDto] = useState([]);
  const [, setAllData] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [salaryInfoId, setSalaryInfoId] = useState("");
  const [sideDrawer, setSideDrawer] = useState(false);
  const [payrollElementDDL, setPayrollElementDDL] = useState([]);
  const [breakDownList, setBreakDownList] = useState([]);
  const [policyData] = useState([]);
  const [isBulk, setIsBulk] = useState(false);
  const [step, setStep] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState([]);

  // for increment history
  const [openIncrement, setOpenIncrement] = useState(false);
  const [openBank, setOpenBank] = useState(false);

  // for increment modal
  const handleIncrementClose = () => {
    setOpenIncrement(false);
    setOpenBank(false)
    setSideDrawer(true);
  };

  // filter state
  const [status, setStatus] = useState("");

  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });
  useEffect(() => {
    getBreakdownPolicyDDL(
      "BREAKDOWN DDL",
      orgId,
      buId,
      0,
      0,
      setPayrollElementDDL,
      wgId,
      wId
    );
  }, [orgId, buId, wId]);

  const defaultPayrollElement = payrollElementDDL?.filter(
    (itm) => itm?.isDefault === true
  );
  const noDefaultPayrollElement = payrollElementDDL?.filter(
    (itm) => itm?.isDefault === false
  );

  const finalPayrollElement = [
    ...defaultPayrollElement,
    ...noDefaultPayrollElement,
  ];

  // initial Data
  const getAllData = (values) => {
    getEmployeeSalaryInfo(
      setAllData,
      setRowDto,
      {
        partType: "SalaryAssignLanding",
        businessUnitId: buId,
        workplaceGroupId: values?.workplace?.value || wgId || 0,
        departmentId: values?.department?.value || 0,
        workplaceId: wId,
        designationId: values?.designation?.value || 0,
        supervisorId: values?.supervisor?.value || 0,
        employeeId: values?.employee?.value || 0,
        strStatus: status || "NotAssigned",
        strSearchTxt: values?.search || "",
        pageNo: 1,
        pageSize: 25,
        isPaginated: true,
      },
      status || "NotAssigned",
      setLoading,
      "",
      { current: 1, pageSize: 25, total: pages?.total },
      setPages
    );
  };

  useEffect(() => {
    getAllData();
  }, [buId, wgId, wId]);

  // filter
  const [filterBages, setFilterBages] = useState({});
  const [filterValues, setFilterValues] = useState({});
  const [filterAnchorEl, setfilterAnchorEl] = useState(null);
  const openFilter = Boolean(filterAnchorEl);
  const id = openFilter ? "simple-popover" : undefined;
  const handleSearch = (values) => {
    getAllData(values);
    setFilterBages(values);
    setfilterAnchorEl(null);
  };
  const clearBadge = (values, name) => {
    const data = values;
    data[name] = "";
    setFilterBages(data);
    setFilterValues(data);
    handleSearch(data);
  };
  const clearFilter = () => {
    setFilterBages({});
    setFilterValues("");
    getEmployeeSalaryInfo(
      setAllData,
      setRowDto,
      {
        partType: "SalaryAssignLanding",
        businessUnitId: buId,
        workplaceGroupId: wgId || 0,

        departmentId: 0,
        workplaceId: wId,

        designationId: 0,
        supervisorId: 0,
        employeeId: 0,
        strStatus: status || "NotAssigned",
        strSearchTxt: "",
        pageNo: pages?.current,
        pageSize: pages?.pageSize,
        isPaginated: true,
      },
      status || "NotAssigned",
      setLoading,
      "",
      pages,
      setPages
    );
  };
  const getFilterValues = (name, value) => {
    setFilterValues((prev) => ({ ...prev, [name]: value }));
  };

  // location
  useEffect(() => {
    if (location?.state?.EmployeeName && location?.state?.EmployeeId) {
      setSideDrawer(true);
      setSalaryInfoId(location?.state?.EmployeeId);
    }
  }, [location]);

  // update peopledesk table implementation ------------  //
  // status DDL
  const statusDDL = [
    { value: "Assigned", label: "Assigned" },
    { value: "NotAssigned", label: "Not Assigned" },
  ];
  const {
    setFieldValue,
    values,
    errors,
    touched,
    handleSubmit,
    dirty,
    resetForm,
  } = useFormik({
    enableReinitialize: true,
    initialValues: initData,
    onSubmit: () => {
      //
    },
  });

  const [resEmpLanding, getEmployeeLanding, loadingLanding, setEmpLanding] =
    useAxiosPost([]);

  const handleChangePages = (_, newPage, searchText) => {
    setPages((prev) => {
      return { ...prev, current: newPage };
    });
    getLanding(searchText, values?.salaryStatus?.value, {
      current: newPage,
      pageSize: pages?.pageSize,
      total: pages?.total,
    });
  };

  const handleChangeRowsPerPages = (event, searchText) => {
    setPages(() => {
      return { current: 1, total: pages?.total, pageSize: +event.target.value };
    });
    getLanding(searchText, values?.salaryStatus?.value, {
      current: 1,
      pageSize: +event.target.value,
      total: pages?.total,
    });
  };
  const getLanding = (srcText = "", type, pages) => {
    getSalaryAssignLanding({
      reqApiHooks: getEmployeeLanding,
      pages,
      setPages,
      buId,
      wgId,
      setter: setEmpLanding,
      srcText,
      type: type,
      wId,
    });
  };

  useEffect(() => {
    setEmpLanding([]);
    setPages({
      current: 1,
      pageSize: paginationSize,
      total: 0,
    });
    getLanding(
      "",
      values?.salaryStatus?.value ? values?.salaryStatus?.value : "NotAssigned",
      {
        current: 1,
        pageSize: paginationSize,
        total: 0,
      }
    );
    setStatus(values?.salaryStatus?.value);
  }, [buId, wgId, wId]);

  // const [updateCount, setUpdateCount] = useState(0);

  // useEffect(() => {
  //   // This effect runs every time yourState changes
  //   // console.log({ resEmpLanding });
  //   setUpdateCount((prevCount) => prevCount + 1);
  // }, [resEmpLanding]);
  // console.log({ updateCount });

  return (
    <>
      <form onSubmit={handleSubmit}>
        {(loading || loadingLanding) && <Loading />}
        {permission?.isView ? (
          <div className="table-card">
            <div className="table-card-heading">
              <div className="d-flex align-items-center">
                {resEmpLanding?.length > 0 ? (
                  <>
                    <h6 className="count">
                      Total {resEmpLanding?.[0]?.totalCount || 0} employees
                    </h6>
                  </>
                ) : (
                  <>
                    <h6 className="count">Total result 0</h6>
                  </>
                )}
              </div>
              <ul className="d-flex flex-wrap">
                <li className="mr-3" style={{ width: "150px" }}>
                  <FormikSelect
                    name="salaryStatus"
                    options={statusDDL}
                    value={values?.salaryStatus}
                    onChange={(valueOption) => {
                      setFieldValue("salaryStatus", valueOption);
                      setFieldValue("srcText", "");
                      setSingleData("");
                      getLanding("", valueOption?.value, pages);
                      setStatus(valueOption?.value);
                    }}
                    styles={customStyles}
                    isClearable={false}
                  />
                </li>
                <li>
                  <MasterFilter
                    isHiddenFilter
                    inputWidth="200px"
                    width="200px"
                    styles={{ marginRight: "4px" }}
                    value={values?.srcText}
                    setValue={(value) => {
                      setFieldValue("srcText", value);
                      if (value) {
                        getLanding(value, values?.salaryStatus?.value, pages);
                      } else {
                        getLanding("", values?.salaryStatus?.value, pages);
                      }
                    }}
                    cancelHandler={() => {
                      setFieldValue("srcText", "");
                      getLanding("", values?.salaryStatus?.value, pages);
                    }}
                    handleClick={(e) => setfilterAnchorEl(e.currentTarget)}
                  />
                </li>
                <li>
                  <PrimaryButton
                    type="button"
                    className="btn btn-default flex-center"
                    label="Bulk Assign"
                    icon={
                      <AddOutlined
                        sx={{
                          marginRight: "0px",
                          fontSize: "15px",
                        }}
                      />
                    }
                    onClick={() => {
                      if (!permission?.isEdit) {
                        return toast.warn("You don't have permission");
                      }
                      setSingleData("");
                      setSalaryInfoId("");
                      setSideDrawer(true);
                      setIsBulk(true);
                      setStep(1);
                      setSelectedEmployee([]);
                    }}
                  />
                </li>
              </ul>
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
            {/* update peopledesk table  */}
            {resEmpLanding.length > 0 ? (
              <PeopleDeskTable
                columnData={salaryAssignLandingColumn(
                  pages?.current,
                  pages?.pageSize,
                  wgName
                )}
                pages={pages}
                rowDto={resEmpLanding}
                setRowDto={setEmpLanding}
                handleChangePage={(e, newPage) =>
                  handleChangePages(e, newPage, values?.srcText)
                }
                handleChangeRowsPerPage={(e) =>
                  handleChangeRowsPerPages(e, values?.srcText)
                }
                uniqueKey="EmployeeCode"
                isCheckBox={false}
                onRowClick={(data) => {
                  if (!permission?.isEdit) {
                    return toast.warn("You don't have permission");
                  }

                  setSingleData(data);
                  setSideDrawer(true);
                  setIsBulk(false);
                  setStep(1);
                  setSelectedEmployee([]);
                  setSalaryInfoId(data?.EmployeeId);
                  if (data?.intSalaryBreakdownHeaderId) {
                    if (data?.Status === "Assigned") {
                      getByIdBreakdownListDDL(
                        "ASSIGNED_BREAKDOWN_ELEMENT_BY_EMPLOYEE_ID",
                        orgId,
                        data?.EmployeeId || 0,
                        data?.intSalaryBreakdownHeaderId,
                        setBreakDownList,
                        data?.numNetGrossSalary,
                        setLoading,
                        wId
                      );
                    }
                  } else {
                    if (defaultPayrollElement?.length > 0) {
                      getBreakdownListDDL(
                        "BREAKDOWN ELEMENT BY ID",
                        orgId,
                        defaultPayrollElement[0]?.value,
                        0,
                        setBreakDownList,
                        "",
                        wId
                      );
                    }
                  }
                }}
              />
            ) : (
              <>
                {!loading && (
                  <div className="col-12">
                    <NoResult title={"No Data Found"} para={""} />
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <NotPermittedPage />
        )}

        {/* master filter */}
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
              buId,
              employeeId,
              orgId,
            }}
          />
        </PopOverMasterFilter>

        {/* salary info */}
        <ClientSalaryAssignModule
          styles={{
            width: "50%",
          }}
          setIsOpen={setSideDrawer}
          isOpen={sideDrawer}
          setAllData={setAllData}
          setRowDto={setEmpLanding}
          loading={loading}
          setLoading={setLoading}
          defaultPayrollElement={defaultPayrollElement}
          setBreakDownList={setBreakDownList}
          orgId={orgId}
          status={status}
          defaultSalaryInitData={defaultSalaryInitData}
          salaryInfoId={salaryInfoId}
          setSingleData={setSingleData}
          singleData={singleData}
          employeeId={employeeId}
          payrollElementDDL={payrollElementDDL}
          finalPayrollElement={finalPayrollElement}
          breakDownList={breakDownList}
          policyData={policyData}
          accId={orgId}
          setOpenIncrement={setOpenIncrement}
          setOpenBank={setOpenBank}
          pages={pages}
          setPages={setPages}
          isBulk={isBulk}
          setIsBulk={setIsBulk}
          step={step}
          setStep={setStep}
          setSelectedEmployee={setSelectedEmployee}
          selectedEmployee={selectedEmployee}
          cbLanding={() => {
            getLanding(values?.srcText, values?.salaryStatus?.value, pages);
          }}
        />

        {/* increment history Modal */}
        <IncrementHistoryComponent
          show={openIncrement}
          title={"Increment History"}
          onHide={handleIncrementClose}
          size="lg"
          backdrop="static"
          classes="default-modal"
          orgId={orgId}
          buId={buId}
          singleData={singleData[0]}
          loading={loading}
          setLoading={setLoading}
        />
        {/* increment history Modal */}
        <BankDetails
          show={openBank}
          title={"Bank History"}
          onHide={handleIncrementClose}
          size="lg"
          backdrop="static"
          classes="default-modal"setFieldValue
          orgId={orgId}
          buId={buId}
          singleData={singleData[0]}
          loading={loading}
          setLoading={setLoading}
        />
      </form>
    </>
  );
};

export default SalaryAssign;
