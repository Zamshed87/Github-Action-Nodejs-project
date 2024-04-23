import { SettingsBackupRestoreOutlined } from "@mui/icons-material";
import axios from "axios";
import FormikInput from "common/FormikInput";
import FormikSelect from "common/FormikSelect";
import MasterFilter from "common/MasterFilter";
import NoResult from "common/NoResult";
import ResetButton from "common/ResetButton";
import {
  getPeopleDeskWithoutAllDDL,
  getWorkplaceDetails,
} from "common/api";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import PeopleDeskTable from "common/peopleDeskTable";
import {
  createPayloadStructure,
  setHeaderListDataDynamically,
} from "common/peopleDeskTable/helper";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { Form, Formik } from "formik";
import { getDDLForAnnouncement } from "modules/announcement/helper";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { monthFirstDate } from "utility/dateFormatter";
import { customStyles } from "utility/selectCustomStyle";
import { empReportListColumns } from "./helper";

const initData = {
  searchString: "",
  attendenceDate: monthFirstDate(),
  department: "",
  section: "",
};

const initHeaderList = {
  strDesignationList: [],
  strDepartmentList: [],
  strSupervisorNameList: [],
  strEmploymentTypeList: [],
  strLinemanagerList: [],
  wingNameList: [],
  soleDepoNameList: [],
  regionNameList: [],
  areaNameList: [],
  territoryNameList: [],
  strWorkplaceGroupList: [],
  strWorkplaceList: [],
  strDivisionList: [],
  strSectionList: [],
  strHrPositionList: [],
  strDottedSupervisorNameList: [],
  strPayrollGroupList: [],
  strBankList: [],
};

export default function EmOverTimeDailyReport() {
  // redux
  const dispatch = useDispatch();
  const { buId, wgId, wId, employeeId, orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  // states
  const [loading, setLoading] = useState(false);
  const [buDetails, setBuDetails] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [status, setStatus] = useState("");
  const [sectionDDL, setSectionDDL] = useState([]);


  const [resEmpLanding, setEmpLanding] = useState([]);
  const [headerList, setHeaderList] = useState({});
  const [filterOrderList, setFilterOrderList] = useState([]);
  const [initialHeaderListData, setInitialHeaderListData] = useState({});
  const [landingLoading, setLandingLoading] = useState(false);
  const [departmentDDL, setDepartmentDDL] = useState([]);
  const [checkedHeaderList, setCheckedHeaderList] = useState({
    ...initHeaderList,
  });

  const getData = async (
    pagination,
    IsForXl = "false",
    searchText = "",
    currentFilterSelection = -1,
    filterOrderList = [],
    checkedHeaderList = { ...initHeaderList },
    values
  ) => {
    console.log("pagination",pagination)
    setLandingLoading(true);

    const modifiedPayload = createPayloadStructure({
      initHeaderList,
      currentFilterSelection,
      checkedHeaderList,
      filterOrderList,
    });

    getDataApiCall(
      modifiedPayload,
      pagination,
      searchText,
      currentFilterSelection,
      checkedHeaderList,
      values
    );
  };
  const [pages, setPages] = useState({
    current: 1,
    pageSize: 100,
    total: 0,
  });

  console.log("pages",pages)
  useEffect(() => {
    setHeaderList({});
    setEmpLanding([]);
    getData(pages);
    getDDLForAnnouncement(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmpDepartment&WorkplaceGroupId=${wgId}&BusinessUnitId=${buId}&intId=0&IntWorkplaceId=${wId}`,
      "DepartmentId",
      "DepartmentName",
      setDepartmentDDL
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId, wId]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Overtime Daily Report";
  }, [dispatch]);

  const getDataApiCall = async (
    modifiedPayload,
    pagination,
    searchText,
    currentFilterSelection = -1,
    checkedHeaderList,
    values
  ) => {
    try {
      const payload = {
        accountId: employeeId || 0,
        workplaceGroupId: wgId || 0,
        departmentId: values?.department?.value || 0,
        sectionId: values?.section?.value || 0,
        attendanceDate: values?.attendenceDate || null,
        searchText: searchText || "",
        pageNumber: pagination.current,
        pageSize: pagination.pageSize,
        isPaginated: true,
        isHeaderNeed: true,
        intOTtype: 3,
      };

      const res = await axios.post(`/Payroll/GetDailyOvertimeEmployeeList`, {
        ...payload,
        ...modifiedPayload,
      });
      if (res?.data) {
        setHeaderListDataDynamically({
          currentFilterSelection,
          checkedHeaderList,
          headerListKey: "employeeHeader",
          headerList,
          setHeaderList,
          response: res,
          filterOrderList,
          setFilterOrderList,
          initialHeaderListData,
          setInitialHeaderListData,
          setEmpLanding,
          setPages,
        });

        setLandingLoading(false);
      }
    } catch (error) {
      setLandingLoading(false);
    }
  };

  // menu permission
  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30418) {
      permission = item;
    }
  });

  const handleChangePage = (_, newPage, searchText, values) => {
    setPages((prev) => {
      return { ...prev, current: newPage };
    });

    getData(
      {
        current: newPage,
        pageSize: pages?.pageSize,
        total: pages?.total,
      },
      "false",
      searchText,
      -1,
      filterOrderList,
      checkedHeaderList,
      values
    );
  };

  const handleChangeRowsPerPage = (event, searchText, values) => {
    setPages({
      current: 1,
      total: pages?.total,
      pageSize: +event.target.value,
    });
    getData(
      {
        current: 1,
        pageSize: +event.target.value,
        total: pages?.total,
      },
      "false",
      searchText,
      -1,
      filterOrderList,
      checkedHeaderList,
      values
    );
  };
  useEffect(() => {
    getWorkplaceDetails(wId, setBuDetails);
  }, [wId]);
  return (
    <>
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ handleSubmit, values, setFieldValue }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {(loading || landingLoading) && <Loading />}
              {permission?.isView ? (
                <div className="table-card">
                  <div className="table-card-heading pb-2">
                    <div className="d-flex justify-content-center align-items-center">
                      {/* <Tooltip title="Export CSV" arrow>
                        <button
                          type="button"
                          className="btn-save"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLoading(true);
                           
                            const paylaod = {
                              businessUnitId: 1,
                              workplaceGroupId:
                                values?.workplaceGroup?.value || 0,
                              workplaceId: values?.workplace?.value || 0,
                              pageNo: 1,
                              pageSize: 25,
                              isPaginated: true,
                              isHeaderNeed: true,
                              searchTxt: "",
                              fromDate: values?.fromDate || null,
                              toDate: values?.toDate || null,
                              ...checkedHeaderList,
                            };
                            const url =
                              "/PdfAndExcelReport/EmployeeReportWithFilter_RDLC";
                            downloadEmployeeCardFile(
                              url,
                              paylaod,
                              `Employee List - ${todayDate()}`,
                              "xlsx",
                              setLoading
                            );
                          }}
                          disabled={resEmpLanding?.data?.length <= 0}
                        >
                          <SaveAlt
                            sx={{
                              color: gray900,
                              fontSize: "14px",
                            }}
                          />
                        </button>
                      </Tooltip> */}
                      <div className="ml-2">
                        {resEmpLanding?.length > 0 ? (
                          <>
                            <h6 className="count">
                              Total {pages?.total} employees
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
                      {(isFilter || status || values?.searchString) && (
                        <li>
                          <ResetButton
                            classes="btn-filter-reset"
                            title="reset"
                            icon={
                              <SettingsBackupRestoreOutlined
                                sx={{
                                  marginRight: "10px",
                                  fontSize: "16px",
                                }}
                              />
                            }
                            onClick={() => {
                              setIsFilter(false);
                              setStatus("");
                              setFieldValue("searchString", "");
                              getData(
                                { current: 1, pageSize: 100 },
                                "false",
                                "",
                                -1,
                                filterOrderList,
                                checkedHeaderList,
                                values
                              );
                            }}
                          />
                        </li>
                      )}
                      <li>
                        <MasterFilter
                          inputWidth="250px"
                          width="250px"
                          isHiddenFilter
                          value={values?.searchString}
                          setValue={(value) => {
                            setFieldValue("searchString", value);
                            if (value) {
                              getData(
                                { current: 1, pageSize: 100 },
                                "false",
                                value,
                                -1,
                                filterOrderList,
                                checkedHeaderList,
                                values
                              );
                            } else {
                              getData(
                                { current: 1, pageSize: 100 },
                                "false",
                                "",
                                -1,
                                filterOrderList,
                                checkedHeaderList,
                                values
                              );
                            }
                          }}
                          cancelHandler={() => {
                            setFieldValue("searchString", "");
                            getData(
                              { current: 1, pageSize: 100 },
                              "false",
                              "",
                              -1,
                              filterOrderList,
                              checkedHeaderList,
                              values
                            );
                          }}
                        />
                      </li>
                    </ul>
                  </div>
                  <div className="table-card-body">
                    <div
                      className="card-style mb-3"
                      // style={{ marginTop: "13px" }}
                    >
                      <div className="row">
                        <div className="col-lg-2">
                          <div className="input-field-main">
                            <label>Attendence Date</label>
                            <FormikInput
                              classes="input-sm"
                              value={values?.attendenceDate}
                              placeholder="Attendence Date"
                              name="attendenceDate"
                              type="date"
                              className="form-control"
                              onChange={(e) => {
                                setFieldValue("attendenceDate", e.target.value);
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div className="input-field-main">
                            <label>Department</label>
                            <FormikSelect
                              name="department"
                              options={[...departmentDDL] || []}
                              value={values?.department}
                              onChange={(valueOption) => {
                                setFieldValue("department", valueOption);
                                setFieldValue("workplace", "");
                                if (valueOption?.value) {
                                  getPeopleDeskWithoutAllDDL(
                                    `/SaasMasterData/SectionDDL?AccountId=${orgId}&BusinessUnitId=${buId}&WorkplaceId=${
                                      wId || 0
                                    }&DepartmentId=${valueOption?.value}`,
                                    "value",
                                    "label",
                                    setSectionDDL
                                  );
                                }
                              }}
                              placeholder=""
                              styles={customStyles}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div className="input-field-main">
                            <label>Section</label>
                            <FormikSelect
                              name="section"
                              options={[...sectionDDL] || []}
                              value={values?.section}
                              onChange={(valueOption) => {
                                setFieldValue("section", valueOption);
                              }}
                              placeholder=""
                              styles={customStyles}
                            />
                          </div>
                        </div>
                        <div className="col-lg-1">
                          <button
                            // disabled={!values?.fromDate || !values?.toDate}
                            style={{ marginTop: "21px" }}
                            className="btn btn-green"
                            onClick={() => {
                              getData(
                                { current: 1, pageSize: 100 },
                                "false",
                                "",
                                -1,
                                filterOrderList,
                                checkedHeaderList,
                                values
                              );
                            }}
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                    {resEmpLanding.length > 0 ? (
                      <PeopleDeskTable
                        columnData={empReportListColumns(
                          pages?.current,
                          pages?.pageSize,
                          wgId,
                          headerList
                        )}
                        pages={pages}
                        rowDto={resEmpLanding}
                        setRowDto={setEmpLanding}
                        checkedHeaderList={checkedHeaderList}
                        setCheckedHeaderList={setCheckedHeaderList}
                        handleChangePage={(e, newPage) =>
                          handleChangePage(
                            e,
                            newPage,
                            values?.searchString,
                            values
                          )
                        }
                        handleChangeRowsPerPage={(e) =>
                          handleChangeRowsPerPage(
                            e,
                            values?.searchString,
                            values
                          )
                        }
                        filterOrderList={filterOrderList}
                        setFilterOrderList={setFilterOrderList}
                        uniqueKey="strEmployeeCode"
                        getFilteredData={(
                          currentFilterSelection,
                          updatedFilterData,
                          updatedCheckedHeaderData
                        ) => {
                          getData(
                            {
                              current: 1,
                              pageSize: 100,
                              total: 0,
                            },
                            "false",
                            "",
                            currentFilterSelection,
                            updatedFilterData,
                            updatedCheckedHeaderData,
                            values
                          );
                        }}
                        isCheckBox={false}
                        isScrollAble={true}
                        scrollCustomClass="emp-report-landing-table"
                        handleSortingData={(obj) => {
                          console.log(obj);
                        }}
                      />
                    ) : (
                      <>
                        {!landingLoading && (
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
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
