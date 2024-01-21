/* eslint-disable react-hooks/exhaustive-deps */
import { SettingsBackupRestoreOutlined } from "@mui/icons-material";
import DownloadIcon from "@mui/icons-material/Download";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { IconButton, Tooltip, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import DefaultInput from "../../../../common/DefaultInput";
import NoResult from "../../../../common/NoResult";
import ResetButton from "../../../../common/ResetButton";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { gray500 } from "../../../../utility/customColor";

import axios from "axios";
import { getWorkplaceDetails } from "common/api";
import {
  createPayloadStructure,
  setHeaderListDataDynamically,
} from "common/peopleDeskTable/helper";
import { toast } from "react-toastify";
import { createCommonExcelFile } from "utility/customExcel/generateExcelAction";
import { getPDFAction } from "utility/downloadFile";
import MasterFilter from "../../../../common/MasterFilter";
import PeopleDeskTable, {
  paginationSize,
} from "../../../../common/peopleDeskTable";
import useDebounce from "../../../../utility/customHooks/useDebounce";
import { todayDate } from "../../../../utility/todayDate";
import {
  column,
  dailyAttendenceDtoCol,
  getTableDataDailyAttendance,
  getTableDataSummaryHeadData,
  subHeaderColumn,
} from "./helper";

const initialValues = {
  businessUnit: "",
  date: todayDate(),
  workplaceGroup: "",
  workplace: "",
  search: "",
};

const validationSchema = Yup.object().shape({
  date: Yup.date().required("Date is required").typeError("Date is required"),
});
const initHeaderList = {
  calenderList: [],
  designationList: [],
  departmentList: [],
};

const MgmtDailyAttendance = () => {
  // redux
  const dispatch = useDispatch();

  const { buId, wgId, wId, orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  // states
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [buDetails, setBuDetails] = useState({});
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
  const debounce = useDebounce();

  //  menu permission
  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30327) {
      permission = item;
    }
  });

  const getDataApiCall = async (
    modifiedPayload,
    pagination,
    searchText,
    currentFilterSelection = -1,
    checkedHeaderList,
    IsForXl,
    date
  ) => {
    try {
      const payload = {
        intBusinessUnitId: buId,
        intWorkplaceGroupId: wgId,
        intWorkplaceId: wId,
        pageNo: pagination.current,
        pageSize: pagination.pageSize,
        isPaginated: true,
        isHeaderNeed: true,
        searchTxt: searchText || "",
        isXls: IsForXl || false,
        attendanceDate: date,
      };

      const res = await axios.post(`/Employee/GetDateWiseAttendanceReport`, {
        ...payload,
        ...modifiedPayload,
      });

      if (res?.data?.data) {
        setHeaderListDataDynamically({
          currentFilterSelection,
          checkedHeaderList,
          headerListKey: "dailyAttendanceHeader",
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
        setRowDto(res?.data);
        setLandingLoading(false);
      }
    } catch (error) {
      setLandingLoading(false);
    }
  };

  const getData = async (
    pagination,
    IsForXl = false,
    searchText = "",
    currentFilterSelection = -1,
    filterOrderList = [],
    checkedHeaderList = { ...initHeaderList },
    date = todayDate()
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
      IsForXl,
      date
    );
  };

  useEffect(() => {
    getWorkplaceDetails(wId, setBuDetails);
    getData(pages);
  }, [wId]);

  // formik
  const { setFieldValue, values, errors, touched, handleSubmit } = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues,
    onSubmit: () => {
      getData(
        { current: 1, pageSize: paginationSize },
        false,
        "",
        -1,
        filterOrderList,
        checkedHeaderList,
        values?.date
      );
      setFieldValue("search", "");
    },
  });

  //set to module
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Daily Attendance Report";
  }, []);

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
      checkedHeaderList,
      values?.date
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
      checkedHeaderList,
      values?.date
    );
  };
  return (
    <form onSubmit={handleSubmit}>
      {landingLoading && <Loading />}
      {permission?.isView ? (
        <div className="table-card">
          <div className="table-card-heading mt-2 pt-1">
            <div className="d-flex align-items-center">
              <h2 className="ml-1">Daily Attendance Report</h2>
            </div>
            <div className="table-header-right">
              <ul className="d-flex flex-wrap"></ul>
            </div>
          </div>
          <div className="table-card-body" style={{ marginTop: "12px" }}>
            <div className="card-style" style={{ margin: "14px 0px 12px 0px" }}>
              <div className="row">
                {/* bu */}
                <div className="col-lg-2">
                  <div className="input-field-main">
                    <label>Date</label>
                    <DefaultInput
                      classes="input-sm"
                      placeholder=""
                      value={values?.date}
                      name="date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("date", e.target.value);
                      }}
                      // min={values?.date}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-lg-3 mt-3 pt-2">
                  <button
                    className="btn btn-green btn-green-disable"
                    type="submit"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>

            {resEmpLanding?.length > 0 ? (
              <div>
                <div className="d-flex justify-content-between">
                  <div>
                    <h2
                      style={{
                        color: gray500,
                        fontSize: "14px",
                        margin: "12px 0px 10px 0px",
                      }}
                    >
                      Daily Attendance Report
                    </h2>
                  </div>

                  <div>
                    <ul className="d-flex flex-wrap">
                      {resEmpLanding?.length > 0 && (
                        <>
                          <li className="pr-2">
                            <Tooltip title="Export CSV" arrow>
                              <IconButton
                                style={{ color: "#101828" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const excelLanding = async () => {
                                    try {
                                      const res = await axios.post(
                                        `/Employee/GetDateWiseAttendanceReport`,
                                        {
                                          intBusinessUnitId: buId,
                                          intWorkplaceGroupId: wgId,
                                          intWorkplaceId: wId,
                                          pageNo: pages.current,
                                          pageSize: pages.pageSize,
                                          isPaginated: true,
                                          isHeaderNeed: false,
                                          searchTxt: "",
                                          isXls: true,
                                          attendanceDate: values?.date,
                                        }
                                      );

                                      if (res?.data?.data?.length > 0) {
                                        const newData = res?.data?.data?.map(
                                          (item, index) => {
                                            return {
                                              ...item,
                                              sl: index + 1,
                                            };
                                          }
                                        );
                                        // const date = todayDate();

                                        createCommonExcelFile({
                                          titleWithDate: `Daily Attendance ${values?.date} `,
                                          fromDate: "",
                                          toDate: "",
                                          buAddress: buDetails?.strAddress,
                                          businessUnit: buDetails?.strWorkplace,
                                          tableHeader: column,
                                          getTableData: () =>
                                            getTableDataDailyAttendance(
                                              newData,
                                              Object.keys(column),
                                              res?.data?.data
                                            ),
                                          getSubTableData: () =>
                                            getTableDataSummaryHeadData(
                                              res?.data
                                            ),
                                          subHeaderInfoArr: [
                                            res?.data?.workplaceGroup
                                              ? `Workplace Group-${res?.data?.data?.workplaceGroup}`
                                              : "",
                                            res?.data?.workplace
                                              ? `Workplace-${res?.data?.data?.workplace}`
                                              : "",
                                          ],
                                          subHeaderColumn,
                                          tableFooter: [],
                                          extraInfo: {},
                                          tableHeadFontSize: 10,
                                          widthList: {
                                            B: 30,
                                            C: 30,
                                            D: 15,
                                            E: 25,
                                            F: 20,
                                            G: 25,
                                            H: 15,
                                            I: 15,
                                            J: 20,
                                            K: 20,
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
                              >
                                <DownloadIcon />
                              </IconButton>
                            </Tooltip>
                          </li>
                          <li className="pr-2 ">
                            <Tooltip title="Print" arrow>
                              <IconButton
                                style={{ color: "#101828" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const list = rowDto?.data?.map(
                                    (item) => item?.employeeId
                                  );
                                  getPDFAction(
                                    `/PdfAndExcelReport/DailyAttendanceReportPDF?IntAccountId=${orgId}&AttendanceDate=${
                                      values?.date
                                    }${
                                      buId ? `&IntBusinessUnitId=${buId}` : ""
                                    }${
                                      wgId ? `&IntWorkplaceGroupId=${wgId}` : ""
                                    }${
                                      rowDto?.data?.length !==
                                      rowDto?.totalCount
                                        ? `&EmployeeIdList=${list}`
                                        : ""
                                    }${wId ? `&IntWorkplaceId=${wId}` : ""}`,
                                    setLoading
                                  );
                                }}
                              >
                                <LocalPrintshopIcon />
                              </IconButton>
                            </Tooltip>
                          </li>
                        </>
                      )}
                      {values?.search && (
                        <li className="pt-1">
                          <ResetButton
                            classes="btn-filter-reset"
                            title="Reset"
                            icon={<SettingsBackupRestoreOutlined />}
                            onClick={() => {
                              getData(
                                { current: 1, pageSize: paginationSize },
                                false,
                                "",
                                -1,
                                filterOrderList,
                                checkedHeaderList,
                                values?.date
                              );
                              setFieldValue("search", "");
                            }}
                          />
                        </li>
                      )}
                      <li>
                        <MasterFilter
                          isHiddenFilter
                          styles={{
                            marginRight: "10px",
                          }}
                          inputWidth="200px"
                          width="200px"
                          value={values?.search}
                          setValue={(value) => {
                            setFieldValue("search", value);
                            debounce(() => {
                              getData(
                                { current: 1, pageSize: paginationSize },
                                false,
                                value,
                                -1,
                                filterOrderList,
                                checkedHeaderList,
                                values?.date
                              );
                            }, 500);
                          }}
                          cancelHandler={() => {
                            setFieldValue("search", "");
                            getData(
                              { current: 1, pageSize: paginationSize },
                              "false",
                              "",
                              -1,
                              filterOrderList,
                              checkedHeaderList,
                              values?.date
                            );
                          }}
                        />
                      </li>
                    </ul>
                  </div>
                </div>
                <div
                  style={{ marginLeft: "-7px" }}
                  className=" d-flex justify-content-between align-items-center my-2"
                >
                  <div className="d-flex align-items-center">
                    <Typography
                      fontWeight={500}
                      className="ml-2"
                      fontSize={"12px"}
                    >
                      Total Employee:
                    </Typography>
                    <Typography
                      fontWeight={500}
                      className="ml-2"
                      fontSize={"12px"}
                    >
                      {rowDto?.totalEmployee || 0}
                    </Typography>
                  </div>
                  <div className="d-flex align-items-center">
                    <Typography
                      fontWeight={500}
                      className="ml-3"
                      fontSize={"12px"}
                    >
                      Present:
                    </Typography>
                    <Typography
                      fontWeight={500}
                      className="ml-2"
                      fontSize={"12px"}
                    >
                      {rowDto?.presentCount || 0}
                    </Typography>
                  </div>
                  <div className="d-flex align-items-center">
                    <Typography
                      fontWeight={500}
                      className="ml-3"
                      fontSize={"12px"}
                    >
                      Absent:
                    </Typography>
                    <Typography
                      fontWeight={500}
                      className="ml-2"
                      fontSize={"12px"}
                    >
                      {rowDto?.absentCount || 0}
                    </Typography>
                  </div>
                  <div className="d-flex align-items-center ">
                    <Typography
                      fontWeight={500}
                      className="ml-3"
                      fontSize={"12px"}
                    >
                      Late:
                    </Typography>
                    <Typography
                      fontWeight={500}
                      className="ml-2"
                      fontSize={"12px"}
                    >
                      {rowDto?.lateCount || 0}
                    </Typography>
                  </div>
                  <div className="d-flex align-items-center ">
                    <Typography
                      fontWeight={500}
                      className="ml-3"
                      fontSize={"12px"}
                    >
                      Leave:
                    </Typography>
                    <Typography
                      fontWeight={500}
                      className="ml-2"
                      fontSize={"12px"}
                    >
                      {rowDto?.leaveCount || 0}
                    </Typography>
                  </div>
                  <div className="d-flex align-items-center ">
                    <Typography
                      fontWeight={500}
                      className="ml-3"
                      fontSize={"12px"}
                    >
                      Movement:
                    </Typography>
                    <Typography
                      fontWeight={500}
                      className="ml-2"
                      fontSize={"12px"}
                    >
                      {rowDto?.movementCount || 0}
                    </Typography>
                  </div>
                  <div className="d-flex align-items-center ">
                    <Typography
                      fontWeight={500}
                      className="ml-3"
                      fontSize={"12px"}
                    >
                      Weekend:
                    </Typography>
                    <Typography
                      fontWeight={500}
                      className="ml-2"
                      fontSize={"12px"}
                    >
                      {rowDto?.weekendCount || 0}
                    </Typography>
                  </div>
                  <div className="d-flex align-items-center ">
                    <Typography
                      fontWeight={500}
                      className="ml-3"
                      fontSize={"12px"}
                    >
                      Holiday:
                    </Typography>
                    <Typography
                      fontWeight={500}
                      className="ml-2"
                      fontSize={"12px"}
                    >
                      {rowDto?.holidayCount || 0}
                    </Typography>
                  </div>
                </div>

                <PeopleDeskTable
                  columnData={dailyAttendenceDtoCol(
                    pages?.current,
                    pages?.pageSize,
                    headerList
                  )}
                  pages={pages}
                  rowDto={resEmpLanding}
                  setRowDto={setEmpLanding}
                  checkedHeaderList={checkedHeaderList}
                  setCheckedHeaderList={setCheckedHeaderList}
                  handleChangePage={(e, newPage) =>
                    handleChangePage(e, newPage, values?.search)
                  }
                  handleChangeRowsPerPage={(e) =>
                    handleChangeRowsPerPage(e, values?.search)
                  }
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
                      false,
                      "",
                      currentFilterSelection,
                      updatedFilterData,
                      updatedCheckedHeaderData,
                      values?.date
                    );
                  }}
                  filterOrderList={filterOrderList}
                  setFilterOrderList={setFilterOrderList}
                  uniqueKey="employeeId"
                  isCheckBox={false}
                  isScrollAble={true}
                />
              </div>
            ) : (
              !loading && <NoResult />
            )}
          </div>
        </div>
      ) : (
        <NotPermittedPage />
      )}
    </form>
  );
};

export default MgmtDailyAttendance;
