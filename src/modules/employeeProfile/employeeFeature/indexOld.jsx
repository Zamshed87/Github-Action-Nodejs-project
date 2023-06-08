import { AddOutlined, SaveAlt } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import axios from "axios";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { getPeopleDeskAllDDL } from "../../../common/api";
import AvatarComponent from "../../../common/AvatarComponent";
import FilterBadgeComponent from "../../../common/FilterBadgeComponent";
import { generateExcelAction } from "../../../common/generateExcel";
import Loading from "../../../common/loading/Loading";
import MasterFilter from "../../../common/MasterFilter";
import NoResult from "../../../common/NoResult";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import PaginationHandlerUI from "../../../common/PaginationHandlerUI";
import PopOverMasterFilter from "../../../common/PopoverMasterFilter";
import PrimaryButton from "../../../common/PrimaryButton";
import SortingIcon from "../../../common/SortingIcon";
import ViewModal from "../../../common/ViewModal";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { gray900 } from "../../../utility/customColor";
import useDebounce from "../../../utility/customHooks/useDebounce";
import { dateFormatter } from "../../../utility/dateFormatter";
import AddEditForm from "./addEditFile";
import FilterModal from "./components/FilterModal";
import { employeeFilter, getEmployeeProfileLanding } from "./helper";
import "./styles.css";

const initData = {
  searchString: "",
  payrollGroup: "",
  supervisor: "",
  rosterGroup: "",
  department: "",
  designation: "",
  calendar: "",
  gender: "",
  religion: "",
  employementType: "",
  joiningFromDate: "",
  joiningToDate: "",
  contractualFromDate: "",
  contractualToDate: "",
  employmentStatus: "",
};

const validationSchema = Yup.object({});

const saveHandler = (values) => {};

const column = {
  sl: "SL",
  strEmployeeName: "Employee Name",
  intEmployeeId: "Employee Id",
  strEmployeeCode: "Code",
  JoiningDate: "Joining Date",
  ServiceLength: "Service Length",
  ConfirmationDate: "Confirmation Date",
  dteContactFromDate: "Contract From Date",
  dteContactToDate: "Contract To Date",
  strSupervisorName: "Supervisor",
  DottedSupervisor: "Dotted Supervisor",
  strLinemanager: "Line Manager",
  strDesignation: "Designation",
  strDepartment: "Department",
  strOfficeMail: "Office Mail",
  strPersonalMail: "Personal Mail",
  strOfficeMobile: "Office Mobile",
  strPersonalMobile: "Personal Mobile",
  strGender: "Gender",
  strReligion: "Religion",
  strPayrollGroupName: "Payroll Group",
  strBankWalletName: "Bank Or Wallet",
  strBranchName: "Branch Name",
  strAccountName_BankDetails: "Account Name",
  strAccountNo: "Account No",
  strRoutingNo: "Routing No",
  strWorkplace: "Workplace",
  strWorkplaceGroup: "Workplace Group",
  strBusinessUnit: "Business Unit",
  DateOfBirth: "Date Of Birth",
  strEmploymentType: "Employment Type",
  strEmployeeStatus: "Employee Status",
};

function EmployeeFeature() {
  const debounce = useDebounce();
  const dispatch = useDispatch();
  const history = useHistory();

  const { orgId, buId, buName, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const { supervisor } = useSelector(
    (state) => state?.auth?.keywords,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState({});

  // page
  const [pageSize, setPageSize] = useState(15);
  const [pageNo, setPageNo] = useState(0);

  const getData = () => {
    getEmployeeProfileLanding(
      orgId,
      buId,
      pageNo,
      pageSize,
      setRowDto,
      setLoading
    );
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId]);

  const [isAddEditForm, setIsAddEditForm] = useState(false);

  const [payrollGroupDDL, setPayrollGroupDDL] = useState([]);
  const [departmentDDL, setDepartmentDDL] = useState([]);
  const [designationDDL, setDesignationDDL] = useState([]);
  const [empStatusDDL, setEmpStatusDDL] = useState([]);
  const [supervisorDDL, setSupervisorDDL] = useState("");
  const [rosterGroupDDL, setRosterGroupDDL] = useState([]);
  const [calendarDDL, setCalendarDDL] = useState([]);
  const [genderDDL, setGenderDDL] = useState([]);
  const [religionDDL, setReligionDDL] = useState([]);
  const [employementTypeDDL, setEmployementTypeDDL] = useState([]);

  // ascending & descending state
  const [employeeOrder, setEmployeeOrder] = useState("desc");
  const [employeeCodeOrder, setEmployeeCodeOrder] = useState("desc");
  const [designationOrder, setDesignationOrder] = useState("desc");
  const [departmentOrder, setDepartmentOrder] = useState("desc");
  const [supervisorOrder, setSupervisorOrder] = useState("desc");
  const [lineManagerOrder, setLineManagerOrder] = useState("desc");
  const [employeementTypeOrder, setEmployeementTypeOrder] = useState("desc");
  const [referenceIdOrder, setReferenceIdOrder] = useState("desc");
  const [joiningOrder, setJoiningOrder] = useState("desc");

  // ascending & descending
  const commonSortByFilter = (filterType, property) => {
    const newRowData = [...rowDto?.data];
    let modifyRowData = [];

    if (filterType === "asc") {
      modifyRowData = newRowData?.sort((a, b) => {
        if (a[property] > b[property]) return -1;
        return 1;
      });
    } else {
      // eslint-disable-next-line no-unused-vars
      modifyRowData = newRowData?.sort((a, b) => {
        if (b[property] > a[property]) return -1;
        return 1;
      });
    }
    setRowDto({ ...rowDto, data: newRowData });
  };

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmpDepartment&AccountId=${orgId}&BusinessUnitId=${buId}&intId=0`,
      "DepartmentId",
      "DepartmentName",
      setDepartmentDDL
    );
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Religion&AccountId=${orgId}&BusinessUnitId=${buId}&intId=0`,
      "ReligionId",
      "ReligionName",
      setReligionDDL
    );
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmploymentType&AccountId=${orgId}&BusinessUnitId=${buId}&intId=0`,
      "Id",
      "EmploymentType",
      setEmployementTypeDDL
    );
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Gender&AccountId=${orgId}&BusinessUnitId=${buId}&intId=0`,
      "GenderId",
      "GenderName",
      setGenderDDL
    );
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmpDesignation&AccountId=${orgId}&BusinessUnitId=${buId}&intId=0`,
      "DesignationId",
      "DesignationName",
      setDesignationDDL
    );
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmployeeBasicInfo&AccountId=${orgId}&BusinessUnitId=${buId}&intId=${employeeId}`,
      "EmployeeId",
      "EmployeeName",
      setSupervisorDDL
    );

    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmployeeStatus&AccountId=${orgId}&BusinessUnitId=${buId}&intId=0`,
      "EmployeeStatusId",
      "EmployeeStatus",
      setEmpStatusDDL
    );
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=PayrollGroup&AccountId=${orgId}&BusinessUnitId=${buId}&intId=0`,
      "PayrollGroupId",
      "PayrollGroupName",
      setPayrollGroupDDL
    );
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Calender&AccountId=${orgId}&BusinessUnitId=${buId}&intId=0`,
      "CalenderId",
      "CalenderName",
      setCalendarDDL
    );
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=RosterGroup&AccountId=${orgId}&BusinessUnitId=${buId}&intId=0`,
      "RosterGroupId",
      "RosterGroupName",
      setRosterGroupDDL
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId]);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let employeeFeature = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 8) {
      employeeFeature = item;
    }
  });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setPaginationHandler = (pageNo, pageSize) => {
    getEmployeeProfileLanding(
      orgId,
      buId,
      pageNo,
      pageSize,
      setRowDto,
      setLoading
    );
  };

  // Advanced Filter
  const [filterAnchorEl, setfilterAnchorEl] = useState(null);
  const [filterBages, setFilterBages] = useState({});
  const [filterValues, setFilterValues] = useState({});
  const openFilter = Boolean(filterAnchorEl);
  const id = openFilter ? "simple-popover" : undefined;

  const handleSearch = (values) => {
    employeeFilter({ orgId, buId, values, setRowDto, setLoading });
    setFilterBages(values);
    setfilterAnchorEl(null);
  };

  const clearFilter = () => {
    setFilterBages({});
    setFilterValues("");
    getData();
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

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
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
            {loading && <Loading />}
            <Form onSubmit={handleSubmit} className="employeeProfile-form-main">
              <div className="employee-profile-main">
                {/* box-employee-profile  */}
                {employeeFeature?.isView ? (
                  <div className="table-card">
                    {/* header-employee-profile  */}
                    <div className="table-card-heading">
                      <div className="d-flex justify-content-center align-items-center">
                        <Tooltip title="Export CSV" arrow>
                          <button
                            className="btn-save"
                            onClick={(e) => {
                              const excelLanding = async () => {
                                try {
                                  const res = await axios.get(
                                    `/Employee/EmployeeDetailsList?AccountId=${orgId}&BusinessUnitId=${buId}`
                                  );
                                  if (res?.data) {
                                    let newData = res?.data?.map(
                                      (item, index) => ({
                                        ...item,
                                        sl: index + 1,
                                        strEmployeeName:
                                          item?.strEmployeeName || " ",
                                        intEmployeeId:
                                          item?.intEmployeeId || " ",
                                        strEmployeeCode:
                                          item?.strEmployeeCode || " ",
                                        JoiningDate: item?.JoiningDate || " ",
                                        ServiceLength:
                                          item?.ServiceLength || " ",
                                        ConfirmationDate:
                                          item?.ConfirmationDate || " ",
                                        strSupervisorName:
                                          item?.strSupervisorName || " ",
                                        DottedSupervisor:
                                          item?.DottedSupervisor || " ",
                                        strLinemanager:
                                          item?.strLinemanager || " ",
                                        strDesignation:
                                          item?.strDesignation || " ",
                                        strDepartment:
                                          item?.strDepartment || " ",
                                        strOfficeMail:
                                          item?.strOfficeMail || " ",
                                        strPersonalMail:
                                          item?.strPersonalMail || " ",
                                        strOfficeMobile:
                                          item?.strOfficeMobile || " ",
                                        strPersonalMobile:
                                          item?.strPersonalMobile || " ",
                                        strGender: item?.strGender || " ",
                                        strReligion: item?.strReligion || " ",
                                        strPayrollGroupName:
                                          item?.strPayrollGroupName || " ",
                                        strBankWalletName:
                                          item?.strBankWalletName || " ",
                                        strBranchName:
                                          item?.strBranchName || " ",
                                        strAccountName_BankDetails:
                                          item?.strAccountName_BankDetails ||
                                          " ",
                                        strAccountNo: item?.strAccountNo || " ",
                                        strRoutingNo: item?.strRoutingNo || " ",
                                        strWorkplace: item?.strWorkplace || " ",
                                        strWorkplaceGroup:
                                          item?.strWorkplaceGroup || " ",
                                        strBusinessUnit:
                                          item?.strBusinessUnit || " ",
                                        DateOfBirth: item?.DateOfBirth || " ",
                                        strEmploymentType:
                                          item?.strEmploymentType || " ",
                                        strEmployeeStatus:
                                          item?.strEmployeeStatus || " ",
                                        contractualFromDate:
                                          item?.dteContactFromDate || "",
                                        contractualToDate:
                                          item?.dteContactToDate || "",
                                      })
                                    );
                                    generateExcelAction(
                                      "Employee List",
                                      "",
                                      "",
                                      column,
                                      newData,
                                      buName
                                    );
                                    setLoading && setLoading(false);
                                  }
                                } catch (error) {
                                  setLoading && setLoading(false);
                                }
                              };
                              excelLanding();
                            }}
                            disabled={rowDto?.data?.length <= 0}
                          >
                            <SaveAlt
                              sx={{
                                color: gray900,
                                fontSize: "14px",
                              }}
                            />
                          </button>
                        </Tooltip>
                        <div className="ml-2">
                          {rowDto?.data?.length > 0 ? (
                            <>
                              <h6 className="count">
                                Total {rowDto?.totalCount} employees
                              </h6>
                            </>
                          ) : (
                            <>
                              <h6 className="count">Total result 0</h6>
                            </>
                          )}
                        </div>
                      </div>

                      <ul className="d-flex flex-wrap">
                        <li>
                          <MasterFilter
                            inputWidth="250px"
                            width="250px"
                            isHiddenFilter
                            value={values?.searchString}
                            setValue={(value) => {
                              setFieldValue("searchString", value);
                              debounce(() => {
                                getEmployeeProfileLanding(
                                  orgId,
                                  buId,
                                  pageNo,
                                  pageSize,
                                  setRowDto,
                                  setLoading,
                                  value
                                );
                              }, 500);
                            }}
                            cancelHandler={() => {
                              setFieldValue("searchString", "");
                              getEmployeeProfileLanding(
                                orgId,
                                buId,
                                pageNo,
                                pageSize,
                                setRowDto,
                                setLoading
                              );
                            }}
                            handleClick={(e) =>
                              setfilterAnchorEl(e.currentTarget)
                            }
                          />
                        </li>
                        <li>
                          <PrimaryButton
                            type="button"
                            className="btn btn-default flex-center"
                            label="New Employee"
                            icon={
                              <AddOutlined
                                sx={{
                                  marginRight: "0px",
                                  fontSize: "15px",
                                }}
                              />
                            }
                            onClick={() => {
                              if (employeeFeature?.isCreate) {
                                setIsAddEditForm(true);
                              } else {
                                toast.warn("You don't have permission");
                              }
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
                    <div className="table-card-body">
                      {rowDto?.data?.length > 0 ? (
                        <div className="table-card-styled employee-table-card tableOne">
                          <table className="table">
                            <thead>
                              <tr>
                                <th style={{ width: "30px" }}>SL</th>
                                <th>
                                  <div
                                    onClick={(e) => {
                                      setEmployeeOrder(
                                        employeeOrder === "desc"
                                          ? "asc"
                                          : "desc"
                                      );
                                      commonSortByFilter(
                                        employeeOrder,
                                        "strEmployeeName"
                                      );
                                    }}
                                    className="sortable"
                                  >
                                    <span>Employee Name</span>
                                    <SortingIcon viewOrder={employeeOrder} />
                                  </div>
                                </th>
                                <th>
                                  <div
                                    onClick={(e) => {
                                      setEmployeeCodeOrder(
                                        employeeCodeOrder === "desc"
                                          ? "asc"
                                          : "desc"
                                      );
                                      commonSortByFilter(
                                        employeeCodeOrder,
                                        "strEmployeeCode"
                                      );
                                    }}
                                    className="sortable"
                                  >
                                    <span>Code</span>
                                    <SortingIcon viewOrder={referenceIdOrder} />
                                  </div>
                                </th>
                                <th>
                                  <div
                                    onClick={(e) => {
                                      setReferenceIdOrder(
                                        referenceIdOrder === "desc"
                                          ? "asc"
                                          : "desc"
                                      );
                                      commonSortByFilter(
                                        referenceIdOrder,
                                        "strReferenceId"
                                      );
                                    }}
                                    className="sortable"
                                  >
                                    <span>Reference Id</span>
                                    <SortingIcon viewOrder={referenceIdOrder} />
                                  </div>
                                </th>
                                <th>
                                  <div
                                    onClick={(e) => {
                                      setDesignationOrder(
                                        designationOrder === "desc"
                                          ? "asc"
                                          : "desc"
                                      );
                                      commonSortByFilter(
                                        designationOrder,
                                        "strDesignation"
                                      );
                                    }}
                                    className="sortable"
                                  >
                                    <span>Designation</span>
                                    <SortingIcon viewOrder={designationOrder} />
                                  </div>
                                </th>
                                <th>
                                  <div
                                    onClick={(e) => {
                                      setDepartmentOrder(
                                        departmentOrder === "desc"
                                          ? "asc"
                                          : "desc"
                                      );
                                      commonSortByFilter(
                                        departmentOrder,
                                        "strDepartment"
                                      );
                                    }}
                                    className="sortable"
                                  >
                                    <span>Department</span>
                                    <SortingIcon viewOrder={departmentOrder} />
                                  </div>
                                </th>
                                <th>
                                  <div
                                    onClick={(e) => {
                                      setSupervisorOrder(
                                        supervisorOrder === "desc"
                                          ? "asc"
                                          : "desc"
                                      );
                                      commonSortByFilter(
                                        supervisorOrder,
                                        "strSupervisorName"
                                      );
                                    }}
                                    className="sortable"
                                  >
                                    <span>
                                      {orgId === 10015
                                        ? "Reporting Line"
                                        : supervisor || "Supervisor"}
                                    </span>
                                    <SortingIcon viewOrder={supervisorOrder} />
                                  </div>
                                </th>
                                <th>
                                  <div
                                    onClick={(e) => {
                                      setLineManagerOrder(
                                        lineManagerOrder === "desc"
                                          ? "asc"
                                          : "desc"
                                      );
                                      commonSortByFilter(
                                        lineManagerOrder,
                                        "strLinemanager"
                                      );
                                    }}
                                    className="sortable"
                                  >
                                    <span>
                                      {orgId === 10015
                                        ? "Team Leader"
                                        : "Line Manager"}
                                    </span>
                                    <SortingIcon viewOrder={lineManagerOrder} />
                                  </div>
                                </th>
                                <th style={{ width: "142px" }}>
                                  <div
                                    onClick={(e) => {
                                      setEmployeementTypeOrder(
                                        employeementTypeOrder === "desc"
                                          ? "asc"
                                          : "desc"
                                      );
                                      commonSortByFilter(
                                        employeementTypeOrder,
                                        "strEmploymentType"
                                      );
                                    }}
                                    className="sortable"
                                  >
                                    <span>Employment Type</span>
                                    <SortingIcon
                                      viewOrder={employeementTypeOrder}
                                    />
                                  </div>
                                </th>
                                <th style={{ width: "110px" }}>
                                  <div
                                    onClick={(e) => {
                                      setJoiningOrder(
                                        joiningOrder === "desc" ? "asc" : "desc"
                                      );
                                      commonSortByFilter(
                                        joiningOrder,
                                        "dteJoiningDate"
                                      );
                                    }}
                                    className="sortable"
                                  >
                                    <span>Joining Date</span>
                                    <SortingIcon viewOrder={joiningOrder} />
                                  </div>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {rowDto?.data?.map((item, index) => {
                                return (
                                  <tr
                                    key={index}
                                    className="hasEvent"
                                    onClick={(e) =>
                                      history.push({
                                        pathname: `/profile/employee/${item?.intEmployeeBasicInfoId}`,
                                      })
                                    }
                                  >
                                    <td>
                                      <div className="pl-1">{index + 1}</div>
                                    </td>
                                    <td>
                                      <div className="d-flex align-items-center">
                                        <div className="emp-avatar">
                                          <AvatarComponent
                                            classess=""
                                            letterCount={1}
                                            label={item?.strEmployeeName}
                                          />
                                        </div>
                                        <div className="ml-2">
                                          <span className="tableBody-title">
                                            {item?.strEmployeeName}
                                          </span>
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="tableBody-title">
                                        {item?.strEmployeeCode}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="tableBody-title">
                                        {item?.strReferenceId}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="tableBody-title">
                                        {item?.strDesignation}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="tableBody-title">
                                        {item?.strDepartment}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="tableBody-title">
                                        {item?.strSupervisorName}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="tableBody-title">
                                        {item?.strLinemanager}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="tableBody-title">
                                        {item?.strEmploymentType}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="tableBody-title">
                                        {dateFormatter(item?.dteJoiningDate)}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                          <div>
                            <PaginationHandlerUI
                              count={rowDto?.totalCount}
                              setPaginationHandler={setPaginationHandler}
                              pageNo={pageNo}
                              setPageNo={setPageNo}
                              pageSize={pageSize}
                              setPageSize={setPageSize}
                              isPaginatable={true}
                            />
                          </div>
                        </div>
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
                  </div>
                ) : (
                  <NotPermittedPage />
                )}
              </div>
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
                    payrollGroupDDL,
                    departmentDDL,
                    designationDDL,
                    empStatusDDL,
                    supervisorDDL,
                    rosterGroupDDL,
                    calendarDDL,
                    genderDDL,
                    religionDDL,
                    employementTypeDDL,
                  }}
                />
              </PopOverMasterFilter>
            </Form>
          </>
        )}
      </Formik>

      <ViewModal
        show={isAddEditForm}
        title="Create New Employee"
        onHide={() => setIsAddEditForm(false)}
        size="lg"
        backdrop="static"
        classes="default-modal form-modal"
      >
        <AddEditForm getData={getData} setIsAddEditForm={setIsAddEditForm} />
      </ViewModal>
    </>
  );
}

export default EmployeeFeature;
