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

import { getWorkplaceDetails } from "common/api";
import { getPDFAction } from "utility/downloadFile";
import MasterFilter from "../../../../common/MasterFilter";
import PeopleDeskTable, {
  paginationSize,
} from "../../../../common/peopleDeskTable";
import { createCommonExcelFile } from "../../../../utility/customExcel/generateExcelAction";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import useDebounce from "../../../../utility/customHooks/useDebounce";
import { todayDate } from "../../../../utility/todayDate";
import {
  absentDtoCol,
  column,
  getAbsentData,
  getTableDataDailyAttendance,
} from "./helper";

const initialValues = {
  businessUnit: "",
  date: todayDate(),
  todate: todayDate(),
  workplaceGroup: "",
  workplace: "",
  search: "",
};

const validationSchema = Yup.object().shape({
  date: Yup.date().required("Date is required").typeError("Date is required"),
});

const AbsentReport = () => {
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
    if (item?.menuReferenceId === 30381) {
      permission = item;
    }
  });

  const getData = (
    pagination = { current: 1, pageSize: paginationSize },
    srcTxt = "",
    date = todayDate(),
    todate = todayDate(),
    isExcel = false
  ) => {
    getAbsentData(
      buId,
      date,
      setRowDto,
      setLoading,
      srcTxt,
      pagination?.current,
      pagination?.pageSize,
      isExcel,
      wgId,
      setPages,
      wId,
      todate
    );
  };

  useEffect(() => {
    getWorkplaceDetails(wId, setBuDetails);
    getData(
      { current: 1, pageSize: paginationSize },
      "",
      values?.date,
      values?.todate
    );
  }, [wId, wgId, buId]);

  // formik
  const { setFieldValue, values, errors, touched, handleSubmit } = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues,
    onSubmit: () => {
      getData({ current: 1, pageSize: paginationSize }, "", values?.date);
      setFieldValue("search", "");
    },
  });

  //set to module
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Absent Report";
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
      searchText,
      values?.date
    );
  };
  console.log({ loading, apiLoading });
  return (
    <form onSubmit={handleSubmit}>
      {(loading || apiLoading) && <Loading />}
      {permission?.isView ? (
        <div className="table-card">
          <div className="table-card-heading mt-2 pt-1 ">
            <div className="d-flex align-items-center">
              <h2 className="ml-1">Absent Report</h2>
            </div>
            <div className="table-header-right">
              <ul className="d-flex flex-wrap"></ul>
            </div>
          </div>
          <div className="table-card-body" style={{ marginTop: "12px" }}>
            {/* d-none */}
            <div
              className="card-style "
              style={{ margin: "14px 0px 12px 0px" }}
            >
              <div className="row">
                {/* bu */}
                <div className="col-lg-2">
                  <div className="input-field-main">
                    <label>From Date</label>
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
                <div className="col-lg-2">
                  <div className="input-field-main">
                    <label>To Date</label>
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

            {rowDto?.data?.length > 0 ? (
              <div>
                <div className="d-flex justify-content-between">
                  <div>
                    <h2
                      style={{
                        color: gray500,
                        fontSize: "14px",
                        margin: "7px 0px 10px 10px",
                      }}
                    >
                      Absent Report
                    </h2>
                  </div>

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
                                    `/TimeSheetReport/GetAbsentReport?IntBusinessUnitId=${buId}&IntWorkplaceGroupId=${wgId}&IntWorkplaceId=${wId}&FromDate=${values?.date}&ToDate=${values?.todate}&IsXls=false&PageNo=1&PageSize=10000`,
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
                                        titleWithDate: `Absent Report ${values?.todate} `,
                                        fromDate: "",
                                        toDate: "",
                                        buAddress: buDetails?.strAddress,
                                        businessUnit: buDetails?.strWorkplace,
                                        tableHeader: column,
                                        getTableData: () =>
                                          getTableDataDailyAttendance(
                                            newData,
                                            Object.keys(column),
                                            res?.data
                                          ),
                                        // getSubTableData: () =>
                                        //   getTableDataSummaryHeadData(res),
                                        // subHeaderInfoArr: [
                                        //   res?.data?.workplaceGroup
                                        //     ? `Workplace Group-${res?.data?.workplaceGroup}`
                                        //     : "",
                                        //   res?.data?.workplace
                                        //     ? `Workplace-${res?.data?.workplace}`
                                        //     : "",
                                        // ],
                                        // subHeaderColumn,
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
                                    }
                                  );
                                }}
                              >
                                <DownloadIcon />
                              </IconButton>
                            </Tooltip>
                          </li>
                          <li className="pr-2 d-none">
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
                      <li className="d-none">
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
                      </li>
                    </ul>
                  </div>
                </div>

                <PeopleDeskTable
                  columnData={absentDtoCol(pages?.current, pages?.pageSize)}
                  pages={pages}
                  rowDto={rowDto?.data}
                  setRowDto={setRowDto}
                  handleChangePage={(e, newPage) =>
                    handleChangePage(e, newPage, values?.search)
                  }
                  handleChangeRowsPerPage={(e) =>
                    handleChangeRowsPerPage(e, values?.search)
                  }
                  uniqueKey="expenseId"
                  isCheckBox={false}
                  isScrollAble={false}
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

export default AbsentReport;
