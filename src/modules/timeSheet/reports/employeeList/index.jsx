import { SaveAlt, SettingsBackupRestoreOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import axios from "axios";
import { getPeopleDeskAllDDL, getWorkplaceDetails } from "common/api";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import MasterFilter from "../../../../common/MasterFilter";
import NoResult from "../../../../common/NoResult";
import ResetButton from "../../../../common/ResetButton";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import PeopleDeskTable from "../../../../common/peopleDeskTable";
import {
  createPayloadStructure,
  setHeaderListDataDynamically,
} from "../../../../common/peopleDeskTable/helper";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { gray900 } from "../../../../utility/customColor";
import { downloadEmployeeCardFile } from "../employeeIDCard/helper";
import { empReportListColumns } from "./helper";
import FormikInput from "common/FormikInput";
import { todayDate } from "utility/todayDate";
import FormikSelect from "common/FormikSelect";
import { customStyles } from "utility/selectCustomStyle";
import { monthFirstDate } from "utility/dateFormatter";

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

  fromDate: monthFirstDate(),
  toDate: todayDate(),
  workplace: "",
  workplaceGroup: "",
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

export default function EmployeeList() {
  // redux
  const dispatch = useDispatch();
  const { buId, wgId, wId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  // states
  const [loading, setLoading] = useState(false);
  const [buDetails, setBuDetails] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [status, setStatus] = useState("");

  const [pages, setPages] = useState({
    current: 1,
    pageSize: 100,
    total: 0,
  });
  const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState([]);
  const [workplaceDDL, setWorkplaceDDL] = useState([]);
  const [resEmpLanding, setEmpLanding] = useState([]);
  const [headerList, setHeaderList] = useState({});
  const [filterOrderList, setFilterOrderList] = useState([]);
  const [initialHeaderListData, setInitialHeaderListData] = useState({});
  const [landingLoading, setLandingLoading] = useState(false);
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
  
  useEffect(() => {
    setHeaderList({});
    setEmpLanding([]);
    getData(pages);
    // getPeopleDeskAllDDL(
    //   `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&intId=${employeeId}`,
    //   "intWorkplaceId",
    //   "strWorkplace",
    //   setWorkplaceDDL
    // );
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplaceGroup&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&intId=${employeeId}`,
      "intWorkplaceGroupId",
      "strWorkplaceGroup",
      setWorkplaceGroupDDL
    );
    // getBuDetails(buId, setBuDetails, setLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId, wId]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Report-Employee List";
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
        businessUnitId: buId,
        workplaceGroupId: values?.workplaceGroup?.value || 0,
        workplaceId: values?.workplace?.value || 0,
        pageNo: pagination.current,
        pageSize: pagination.pageSize,
        isPaginated: true,
        isHeaderNeed: true,
        searchTxt: searchText || "",
        fromDate: values?.fromDate || null,
        toDate: values?.toDate || null,
      };

      const res = await axios.post(`/Employee/EmployeeReportWithFilter`, {
        ...payload,
        ...modifiedPayload,
      });

      if (res?.data?.data) {
        setHeaderListDataDynamically({
          currentFilterSelection,
          checkedHeaderList,
          headerListKey: "employeeHeader",
          headerList,
          setHeaderList,
          response: res?.data,
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
    if (item?.menuReferenceId === 131) {
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
                      <Tooltip title="Export CSV" arrow>
                        <button
                          type="button"
                          className="btn-save"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLoading(true);
                            // const excelLanding = async () => {
                            //   try {
                            //     const res = await axios.post(
                            //       `/Employee/EmployeeReportWithFilter`,
                            //       {
                            //         businessUnitId: 1,
                            //         workplaceGroupId: wgId,
                            //         workplaceId: wId,
                            //         pageNo: 1,
                            //         pageSize: 1000000,
                            //         isPaginated: false,
                            //         isHeaderNeed: true,
                            //         searchTxt: "",
                            //         strDesignationList: [],
                            //         strDepartmentList: [],
                            //         strSupervisorNameList: [],
                            //         strEmploymentTypeList: [],
                            //         strLinemanagerList: [],
                            //         wingNameList: [],
                            //         soleDepoNameList: [],
                            //         regionNameList: [],
                            //         areaNameList: [],
                            //         territoryNameList: [],
                            //         strWorkplaceGroupList: [],
                            //         strWorkplaceList: [],
                            //         strDivisionList: [],
                            //         strSectionList: [],
                            //         strHrPositionList: [],
                            //         strDottedSupervisorNameList: [],
                            //         strPayrollGroupList: [],
                            //         strBankList: [],
                            //       }
                            //     );
                            //     if (res?.data?.data?.length > 0) {
                            //       const newData = res?.data?.data?.map(
                            //         (item, index) => {
                            //           return {
                            //             ...item,
                            //             sl: index + 1,
                            //             dateOfJoining: dateFormatter(
                            //               item?.dateOfJoining
                            //             ),
                            //             dateOfConfirmation: dateFormatter(
                            //               item?.dateOfConfirmation
                            //             ),
                            //             dateOfBirth: dateFormatter(
                            //               item?.dateOfBirth
                            //             ),
                            //           };
                            //         }
                            //       );
                            //       const date = todayDate();

                            //       createCommonExcelFile({
                            //         titleWithDate: `Employee List -${dateFormatter(
                            //           date
                            //         )}`,
                            //         fromDate: "",
                            //         toDate: "",
                            //         buAddress: buDetails?.strAddress,
                            //         businessUnit: buDetails?.strWorkplace,
                            //         tableHeader: columnForExcel,
                            //         getTableData: () =>
                            //           getTableDataEmployeeReports(
                            //             newData,
                            //             Object.keys(columnForExcel)
                            //           ),
                            //         tableFooter: [],
                            //         extraInfo: {},
                            //         tableHeadFontSize: 10,
                            //         widthList: {
                            //           B: 30,
                            //           C: 30,
                            //           D: 30,
                            //           E: 30,
                            //           G: 20,
                            //           H: 30,
                            //           T: 20,
                            //           J: 30,
                            //           K: 15,
                            //           M: 25,
                            //           N: 25,
                            //           O: 20,
                            //           P: 20,
                            //           Q: 15,
                            //           Y: 15,
                            //           AF: 35,
                            //         },
                            //         commonCellRange: "A1:J1",
                            //         CellAlignment: "left",
                            //       });
                            //       setLoading && setLoading(false);
                            //     } else {
                            //       setLoading && setLoading(false);
                            //       toast.warn("Empty Employee Data");
                            //     }
                            //   } catch (error) {
                            //     toast.warn("Failed to download excel");
                            //     setLoading && setLoading(false);
                            //   }
                            // };
                            // excelLanding();
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
                      </Tooltip>
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
                            <label>From Joining Date</label>
                            <FormikInput
                              classes="input-sm"
                              value={values?.fromDate}
                              placeholder="From Joining Date"
                              name="fromDate"
                              type="date"
                              className="form-control"
                              onChange={(e) => {
                                setFieldValue("fromDate", e.target.value);
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-lg-2">
                          <div className="input-field-main">
                            <label>To Joining Date</label>
                            <FormikInput
                              classes="input-sm"
                              value={values?.toDate}
                              placeholder="To Joining Date"
                              name="toDate"
                              type="date"
                              className="form-control"
                              onChange={(e) => {
                                setFieldValue("toDate", e.target.value);
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div className="input-field-main">
                            <label>Workplace Group</label>
                            <FormikSelect
                              name="workplaceGroup"
                              options={[...workplaceGroupDDL] || []}
                              value={values?.workplaceGroup}
                              onChange={(valueOption) => {
                                setWorkplaceDDL([]);
                                setFieldValue("workplaceGroup", valueOption);
                                setFieldValue("workplace", "");
                                if (valueOption?.value) {
                                  getPeopleDeskAllDDL(
                                    `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&BusinessUnitId=${buId}&WorkplaceGroupId=${valueOption?.value}&intId=${employeeId}`,
                                    "intWorkplaceId",
                                    "strWorkplace",
                                    setWorkplaceDDL
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
                            <label>Workplace</label>
                            <FormikSelect
                              name="workplace"
                              options={[...workplaceDDL] || []}
                              value={values?.workplace}
                              onChange={(valueOption) => {
                                setFieldValue("workplace", valueOption);
                                getWorkplaceDetails(
                                  valueOption?.value,
                                  setBuDetails
                                );
                              }}
                              placeholder=""
                              styles={customStyles}
                            />
                          </div>
                        </div>
                        <div className="col-lg-1">
                          <button
                            disabled={!values?.fromDate || !values?.toDate}
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
