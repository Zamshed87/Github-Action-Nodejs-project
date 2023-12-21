/* eslint-disable react-hooks/exhaustive-deps */
import { SettingsBackupRestoreOutlined } from "@mui/icons-material";
import DownloadIcon from "@mui/icons-material/Download";
import { IconButton, Tooltip } from "@mui/material";
import AntScrollTable from "common/AntScrollTable";
import ResetButton from "common/ResetButton";
import { getWorkplaceDetails } from "common/api";
import { useFormik } from "formik";
import moment from "moment";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { createCommonExcelFile } from "utility/customExcel/generateExcelAction";
import { dateFormatter } from "utility/dateFormatter";
import * as Yup from "yup";
import DefaultInput from "../../../../common/DefaultInput";
import NoResult from "../../../../common/NoResult";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { paginationSize } from "../../../../common/peopleDeskTable";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import useDebounce from "../../../../utility/customHooks/useDebounce";
import { todayDate } from "../../../../utility/todayDate";
import {
  column,
  getJoineeAttendanceData,
  getTableDataMonthlyAttendance,
  joineeAttendanceReportColumns,
} from "./helper";

const initialValues = {
  businessUnit: "",
  date: todayDate(),
  todate: todayDate(),
  fromdate: todayDate(),
  workplaceGroup: "",
  workplace: "",
  search: "",
  monthYear: moment().format("YYYY-MM"),
  monthId: new Date().getMonth() + 1,
  yearId: new Date().getFullYear(),
};

const validationSchema = Yup.object().shape({
  date: Yup.date().required("Date is required").typeError("Date is required"),
});

const JoineeAttendanceReport = () => {
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
  const [, getExcelData, apiLoading] = useAxiosGet();

  const debounce = useDebounce();

  //  menu permission
  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30379) {
      permission = item;
    }
  });

  const getData = (
    pagination = { current: 1, pageSize: paginationSize },
    srcTxt = "",
    fromdate = todayDate(),
    todate = todayDate(),
    values,
    isExcel = false
  ) => {
    getJoineeAttendanceData(
      orgId,
      buId,
      fromdate,
      todate,
      setRowDto,
      setLoading,
      srcTxt,
      pagination?.current,
      pagination?.pageSize,
      isExcel,
      wgId,
      setPages,
      wId,
      values
    );
  };

  useEffect(() => {
    getWorkplaceDetails(wId, setBuDetails);
    getData(
      { current: 1, pageSize: paginationSize },
      "",
      values?.fromdate,
      values?.todate,
      values
    );
  }, [wId, wgId]);

  // formik
  const { setFieldValue, values, errors, touched, handleSubmit } = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues,
    onSubmit: () => {
      getData(
        { current: 1, pageSize: paginationSize },
        "",
        values?.fromdate,
        values?.todate,
        values
      );
      setFieldValue("search", "");
    },
  });

  //set to module
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Joinee Attendance Report";
  }, [dispatch]);

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
      searchText,
      values?.fromdate,
      values?.todate,
      values
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
      searchText,
      values?.fromdate,
      values?.todate,
      values
    );
  };
  // page handling function
  const handleTableChange = (pagination, newRowDto, srcText) => {
    if (newRowDto?.action === "filter") {
      return;
    }
    if (
      pages?.current === pagination?.current &&
      pages?.pageSize !== pagination?.pageSize
    ) {
      return getData(
        {
          current: pagination?.current,
          pageSize: pagination?.pageSize,
          total: pages?.total,
        },
        srcText,
        values?.fromdate,
        values?.todate,
        values
      );
    }
    if (pages?.current !== pagination?.current) {
      return getData(
        {
          current: pagination?.current,
          pageSize: pagination?.pageSize,
          total: pages?.total,
        },
        srcText,
        values?.fromdate,
        values?.todate,
        values
      );
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      {(loading || apiLoading) && <Loading />}
      {permission?.isView ? (
        <div className="table-card">
          <div className="table-card-heading mt-2 pt-1">
            <div className="d-flex align-items-center">
              <h2 className="ml-1">Joinee Attendance Report</h2>
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
                    <label>Attendance-Month</label>
                    <DefaultInput
                      classes="input-sm"
                      placeholder=" "
                      value={values?.monthYear}
                      name="monthYear"
                      type="month"
                      onChange={(e) => {
                        console.log(
                          e.target.value.split("").slice(-2).join(""),
                          e.target.value.split("").slice(0, 4).join("")
                        );
                        setFieldValue(
                          "monthId",
                          +e.target.value.split("").slice(-2).join("")
                        );
                        setFieldValue(
                          "yearId",
                          +e.target.value.split("").slice(0, 4).join("")
                        );

                        setFieldValue("monthYear", e.target.value);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-lg-2">
                  <div className="input-field-main">
                    <label>Joining From Date</label>
                    <DefaultInput
                      classes="input-sm"
                      placeholder=""
                      value={values?.fromdate}
                      name="fromdate"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("fromdate", e.target.value);
                      }}
                      // min={values?.date}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-lg-2">
                  <div className="input-field-main">
                    <label>Joining To Date</label>
                    <DefaultInput
                      classes="input-sm"
                      placeholder=""
                      value={values?.todate}
                      name="todate"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("todate", e.target.value);
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

            {rowDto?.length > 0 ? (
              <>
                <div className="d-flex justify-content-between">
                  <div></div>

                  <div>
                    <ul className="d-flex flex-wrap">
                      {rowDto?.data?.length > 0 && (
                        <>
                          <li className="pr-2">
                            <Tooltip title="Export CSV" arrow>
                              <IconButton
                                style={{ color: "#101828" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  getExcelData(
                                    `/TimeSheetReport/TimeManagementDynamicPIVOTReport?ReportType=new_joinee_in_out_attendance_report_for_all_employee&AccountId=${orgId}&DteFromDate=${values?.fromdate}&DteToDate=${values?.todate}&EmployeeId=0&WorkplaceGroupId=${wgId}&WorkplaceId=${wId}&PageNo=1&PageSize=10000000&IsPaginated=false&intYearId=${values?.yearId}&intMonthId=${values?.monthId}`,
                                    (res) => {
                                      console.log(res);
                                      const newData = res?.data?.map(
                                        (item, index) => {
                                          return {
                                            ...item,
                                            sl: index + 1,
                                          };
                                        }
                                      );
                                      createCommonExcelFile({
                                        titleWithDate: `Joinee Attendance Report - ${dateFormatter(
                                          values?.fromdate
                                        )} to ${dateFormatter(values?.todate)}`,
                                        fromDate: "",
                                        toDate: "",
                                        buAddress: buDetails?.strAddress,
                                        businessUnit: buDetails?.strWorkplace,
                                        tableHeader: column(
                                          values?.fromdate,
                                          values?.todate
                                        ),
                                        getTableData: () =>
                                          getTableDataMonthlyAttendance(
                                            newData,
                                            Object.keys(
                                              column(
                                                values?.fromdate,
                                                values?.todate
                                              )
                                            )
                                          ),
                                        tableFooter: [],
                                        extraInfo: {},
                                        tableHeadFontSize: 10,
                                        widthList: {
                                          C: 30,
                                          B: 30,
                                          D: 30,
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
                                    }
                                  );
                                }}
                              >
                                <DownloadIcon />
                              </IconButton>
                            </Tooltip>
                          </li>
                          {/* <li className="pr-2 d-none">
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
                          </li> */}
                        </>
                      )}
                      {values?.search && (
                        <li className="pt-1 d-none">
                          <ResetButton
                            classes="btn-filter-reset"
                            title="Reset"
                            icon={<SettingsBackupRestoreOutlined />}
                            onClick={() => {
                              getData(
                                { current: 1, pageSize: paginationSize },
                                "",
                                values?.date
                              );
                              setFieldValue("search", "");
                            }}
                          />
                        </li>
                      )}
                      {/* <li>
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
                                value,
                                values?.date
                              );
                            }, 500);
                          }}
                          cancelHandler={() => {
                            setFieldValue("search", "");
                            getData(
                              { current: 1, pageSize: paginationSize },
                              "",
                              values?.date
                            );
                          }}
                        />
                      </li> */}
                    </ul>
                  </div>
                </div>

                <div className="table-card-styled employee-table-card table-responsive ant-scrolling-Table">
                  <AntScrollTable
                    data={rowDto || []}
                    columnsData={joineeAttendanceReportColumns(
                      values?.fromdate,
                      values?.todate,
                      pages?.current,
                      pages?.pageSize
                    )}
                    handleTableChange={({ pagination, newRowDto }) =>
                      handleTableChange(
                        pagination,
                        newRowDto,
                        values?.search || ""
                      )
                    }
                    pages={pages?.pageSize}
                    pagination={pages}
                  />
                </div>
              </>
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

export default JoineeAttendanceReport;
