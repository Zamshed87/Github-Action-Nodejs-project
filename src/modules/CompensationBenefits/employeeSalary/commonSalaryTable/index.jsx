import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { useHistory, useLocation } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import Loading from "../../../../common/loading/Loading";
import DashboardHead from "../../../../layout/dashboardHead/DashboardHead";
import SideMenu from "../../../../layout/menuComponent/SideMenu";
import companyLogo from "../../../../assets/images/company/logo.png";
import MasterFilter from "../../../../common/MasterFilter";
import { ArrowBack } from "@mui/icons-material";
import FilterModal from "../commonSalaryTable/components/FilterModal";
import ScrollableTable from "../../../../common/ScrollableTable";
import { getGenerateSalaryLandingAndFilter } from "./helper";
import { Tooltip } from "@mui/material";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import "./style.css";

const initData = {
  search: "",
};

let date = new Date();
let monthId = date.getMonth() + 1;
let yearId = date.getFullYear();

const CommonSalaryTable = () => {
  const { buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const saveHandler = (values) => {};
  const [loading, setLoading] = useState(false);

  const history = useHistory();
  const location = useLocation();

  const workPlaceGroupId = location.state.intWorkplaceGroupId;
  const workplaceGroup = location.state.strWorkplaceGroup;
  const payrollGroup = location.state.strPayrollGroup;
  const salaryGenerate = location.state.SalaryGenerateFor;

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const [rowDto, setRowDto] = useState(null);
  const [allData, setAllData] = useState(null);

  const getData = () => {
    getGenerateSalaryLandingAndFilter(
      buId,
      location?.state?.intMonthId || monthId,
      location?.state?.intYearId || yearId,
      workPlaceGroupId,
      0,
      0,
      0,
      0,
      0,
      setRowDto,
      setAllData,
      setLoading
    );
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId]);

  const masterFilterHandler = ({
    department,
    designation,
    employee,
    employmentType,
    supervisor,
  }) => {
    getGenerateSalaryLandingAndFilter(
      buId,
      location?.state?.intMonthId || monthId,
      location?.state?.intYearId || yearId,
      workPlaceGroupId,
      department?.value || 0,
      designation?.value || 0,
      supervisor?.value || 0,
      employmentType?.value || 0,
      employee?.value || 0,
      setRowDto,
      setAllData,
      setLoading
    );
  };

  const searchData = (keywords) => {
    try {
      setLoading(true);
      const regex = new RegExp(keywords?.toLowerCase());
      let newData = allData?.filter(
        (item) =>
          regex.test(item?.strEmployeeName?.toLowerCase()) ||
          regex.test(item?.strDesignation?.toLowerCase()) ||
          regex.test(item?.strDepartment?.toLowerCase())
      );
      setRowDto(newData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setRowDto([]);
    }
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 77) {
      permission = item;
    }
  });

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
              <DashboardHead
                companyLogo={companyLogo}
                moduleTitle={"Compensation & Benefits"}
              />
              <div className="common-salary-table">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-2">
                      <SideMenu />
                    </div>
                    {permission?.isView ? (
                      <div className="col-md-10">
                        <div className="table-card">
                          <div className="table-card-heading mt-1">
                            <Tooltip title="back">
                              <ArrowBack
                                sx={{
                                  color: "rgba(0, 0, 0, 0.6)",
                                  cursor: "pointer",
                                  fontSize: "16px",
                                }}
                                onClick={() => history.goBack()}
                              />
                            </Tooltip>

                            <div className="table-card-head-right">
                              <ul>
                                <li>
                                  <MasterFilter
                                    inputWidth="200px"
                                    width="200px"
                                    value={values?.search}
                                    setValue={(value) => {
                                      setFieldValue("search", value);
                                      searchData(value);
                                    }}
                                    cancelHandler={() => {
                                      setFieldValue("search", "");
                                      getData();
                                    }}
                                    handleClick={(event) =>
                                      setAnchorEl(event.currentTarget)
                                    }
                                  />
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="table-card-body">
                            <div className="pl-0 table-card-subHeader mb-2 d-flex align-items-center justify-content-start">
                              <h6 className="pr-4">
                                Payroll Group - <small>{workplaceGroup}</small>
                              </h6>
                              <h6 className="pr-4">
                                Workplace Group - <small>{payrollGroup}</small>
                              </h6>
                              <h6 className="pr-4">
                                Month/Year - <small>{salaryGenerate}</small>
                              </h6>
                            </div>
                            <ScrollableTable>
                              <thead>
                                <th>Employee</th>
                                <th>Designation</th>
                                <th>Department</th>
                                <th className="text-center">Employment Type</th>
                                <th className="text-right">Working Days</th>
                                <th className="text-right">Present</th>
                                <th className="text-right">Absent</th>
                                <th className="text-right">Late</th>
                                <th className="text-right">Movement</th>
                                <th className="text-right">Sick Leave</th>
                                <th className="text-right">Casual Leave</th>
                                <th className="text-right">Earned Leave</th>
                                <th className="text-right">
                                  Leave Without Pay
                                </th>
                                <th className="text-right">Off Day</th>
                                <th className="text-right">Holiday</th>
                                <th className="text-right">Basic</th>
                                <th className="text-right">House Allowance</th>
                                <th className="text-right">
                                  Medical Allowance
                                </th>
                                <th className="text-right">Provident Fund</th>
                                <th className="text-right">
                                  Conveyance Allowance
                                </th>
                                <th className="text-right">
                                  Net payable Amount
                                </th>
                              </thead>
                              <tbody>
                                {rowDto?.length > 0 &&
                                  rowDto?.map((data, index) => (
                                    <tr key={index}>
                                      <td>
                                        {data?.strEmployeeName} [
                                        {data?.strEmployeeCode}]
                                      </td>
                                      <td>{data?.strDesignation}</td>
                                      <td>{data?.strDepartment}</td>
                                      <td className="text-center">
                                        {data?.strEmploymentType}
                                      </td>
                                      <td className="text-right">
                                        {data?.intTotalWorkingDays}
                                      </td>
                                      <td className="text-right">
                                        {data?.intPresent}
                                      </td>
                                      <td className="text-right">
                                        {data?.intAbsent}
                                      </td>
                                      <td className="text-right">
                                        {data?.intLate}
                                      </td>
                                      <td className="text-right">
                                        {data?.intMovement}
                                      </td>
                                      <td className="text-right">
                                        {data?.intSL}
                                      </td>
                                      <td className="text-right">
                                        {data?.intCL}
                                      </td>
                                      <td className="text-right">
                                        {data?.intEL}
                                      </td>
                                      <td className="text-right">
                                        {data?.intLWP}
                                      </td>
                                      <td className="text-right">
                                        {data?.intOffday}
                                      </td>
                                      <td className="text-right">
                                        {data?.intHolyday}
                                      </td>
                                      <td className="text-right">
                                        {data?.numBasicSalary}
                                      </td>
                                      <td className="text-right">
                                        {data?.numHouseRentAllowance}
                                      </td>
                                      <td className="text-right">
                                        {data?.numMedicalAllowance}
                                      </td>
                                      <td className="text-right">
                                        {data?.numPFAmount}
                                      </td>
                                      <td className="text-right">
                                        {data?.numConveyanceAllowance}
                                      </td>
                                      <td className="text-right">
                                        {data?.numNetPayableAmountCal}
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </ScrollableTable>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <NotPermittedPage />
                    )}
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
          setAnchorEl,
        }}
        getData={getData}
        masterFilterHandler={masterFilterHandler}
      />
    </>
  );
};

export default CommonSalaryTable;
