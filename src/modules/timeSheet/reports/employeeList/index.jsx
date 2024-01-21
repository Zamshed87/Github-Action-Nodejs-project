import { SaveAlt, SettingsBackupRestoreOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Loading from "../../../../common/loading/Loading";
import MasterFilter from "../../../../common/MasterFilter";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import ResetButton from "../../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import {
  columnForExcel,
  empReportListColumns,
  getBuDetails,
  getTableDataEmployeeReports,
} from "./helper";
import axios from "axios";
import { gray900 } from "../../../../utility/customColor";
// import { generateExcelAction } from "./excel/generateExcelList";
import NoResult from "../../../../common/NoResult";
import { todayDate } from "../../../../utility/todayDate";
import { dateFormatter } from "../../../../utility/dateFormatter";
import { paginationSize } from "../../../../common/AntTable";
import { createCommonExcelFile } from "../../../../utility/customExcel/generateExcelAction";
import PeopleDeskTable from "../../../../common/peopleDeskTable";
import {
  createPayloadStructure,
  setHeaderListDataDynamically,
} from "../../../../common/peopleDeskTable/helper";
import { toast } from "react-toastify";
import { getWorkplaceDetails } from "common/api";

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
};

export default function EmployeeList() {
  // redux
  const dispatch = useDispatch();
  const { buId, buName, wgId, wId } = useSelector(
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
    pageSize: paginationSize,
    total: 0,
  });
  const [resEmpLanding, setEmpLanding] = useState([]);
  const [headerList, setHeaderList] = useState({});
  const [filterOrderList, setFilterOrderList] = useState([]);
  const [initialHeaderListData, setInitialHeaderListData] = useState({});
  const [landingLoading, setLandingLoading] = useState(false);
  const [checkedHeaderList, setCheckedHeaderList] = useState({
    ...initHeaderList,
  });

  useEffect(() => {
    setHeaderList({});
    setEmpLanding([]);
    getData(pages);
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
    checkedHeaderList
  ) => {
    try {
      const payload = {
        businessUnitId: buId,
        workplaceGroupId: wgId,
        workplaceId: wId,
        pageNo: pagination.current,
        pageSize: pagination.pageSize,
        isPaginated: true,
        isHeaderNeed: true,
        searchTxt: searchText || "",
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

  const getData = async (
    pagination,
    IsForXl = "false",
    searchText = "",
    currentFilterSelection = -1,
    filterOrderList = [],
    checkedHeaderList = { ...initHeaderList }
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
      checkedHeaderList
    );
  };

  const handleChangePage = (_, newPage, searchText) => {
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
      checkedHeaderList
    );
  };

  const handleChangeRowsPerPage = (event, searchText) => {
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
      checkedHeaderList
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
                            const excelLanding = async () => {
                              try {
                                const res = await axios.post(
                                  `/Employee/EmployeeReportWithFilter`,
                                  {
                                    businessUnitId: 1,
                                    workplaceGroupId: 4,
                                    workplaceId: 11,
                                    pageNo: 1,
                                    pageSize: 1000000,
                                    isPaginated: false,
                                    isHeaderNeed: true,
                                    searchTxt: "",
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
                                  }
                                );
                                if (res?.data?.data?.length > 0) {
                                  const newData = res?.data?.data?.map(
                                    (item, index) => {
                                      return {
                                        ...item,
                                        sl: index + 1,
                                        dateOfJoining: dateFormatter(
                                          item?.dateOfJoining
                                        ),
                                        dateOfConfirmation: dateFormatter(
                                          item?.dateOfConfirmation
                                        ),
                                        dateOfBirth: dateFormatter(
                                          item?.dateOfBirth
                                        ),
                                      };
                                    }
                                  );
                                  const date = todayDate();

                                  createCommonExcelFile({
                                    titleWithDate: `Employee List -${dateFormatter(
                                      date
                                    )}`,
                                    fromDate: "",
                                    toDate: "",
                                    buAddress: buDetails?.strAddress,
                                    businessUnit: buDetails?.strWorkplace,
                                    tableHeader: columnForExcel,
                                    getTableData: () =>
                                      getTableDataEmployeeReports(
                                        newData,
                                        Object.keys(columnForExcel)
                                      ),
                                    tableFooter: [],
                                    extraInfo: {},
                                    tableHeadFontSize: 10,
                                    widthList: {
                                      B: 30,
                                      C: 30,
                                      D: 30,
                                      E: 30,
                                      G: 20,
                                      H: 30,
                                      T: 20,
                                      J: 30,
                                      K: 15,
                                      M: 25,
                                      N: 25,
                                      O: 20,
                                      P: 20,
                                      Q: 15,
                                      Y: 15,
                                      AF: 35,
                                    },
                                    commonCellRange: "A1:J1",
                                    CellAlignment: "left",
                                  });
                                  setLoading && setLoading(false);
                                } else {
                                  setLoading && setLoading(false);
                                  toast.warn("Empty Employee Data");
                                }
                              } catch (error) {
                                toast.warn("Failed to download excel");
                                setLoading && setLoading(false);
                              }
                            };
                            excelLanding();
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
                                { current: 1, pageSize: paginationSize },
                                "false",
                                "",
                                -1,
                                filterOrderList,
                                checkedHeaderList
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
                                { current: 1, pageSize: paginationSize },
                                "false",
                                value,
                                -1,
                                filterOrderList,
                                checkedHeaderList
                              );
                            } else {
                              getData(
                                { current: 1, pageSize: paginationSize },
                                "false",
                                "",
                                -1,
                                filterOrderList,
                                checkedHeaderList
                              );
                            }
                          }}
                          cancelHandler={() => {
                            setFieldValue("searchString", "");
                            getData(
                              { current: 1, pageSize: paginationSize },
                              "false",
                              "",
                              -1,
                              filterOrderList,
                              checkedHeaderList
                            );
                          }}
                        />
                      </li>
                    </ul>
                  </div>
                  <div className="table-card-body">
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
                          handleChangePage(e, newPage, values?.searchString)
                        }
                        handleChangeRowsPerPage={(e) =>
                          handleChangeRowsPerPage(e, values?.searchString)
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
                              pageSize: paginationSize,
                              total: 0,
                            },
                            "false",
                            "",
                            currentFilterSelection,
                            updatedFilterData,
                            updatedCheckedHeaderData
                          );
                        }}
                        isCheckBox={false}
                        isScrollAble={true}
                        scrollCustomClass="emp-report-landing-table"
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
