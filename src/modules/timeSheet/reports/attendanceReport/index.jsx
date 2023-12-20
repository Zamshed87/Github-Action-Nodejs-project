import { SaveAlt, SettingsBackupRestoreOutlined } from "@mui/icons-material";
import { Tooltip, Typography } from "@mui/material";
import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import FormikInput from "../../../../common/FormikInput";
import PrimaryButton from "../../../../common/PrimaryButton";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { gray600 } from "../../../../utility/customColor";
import { dateFormatterForInput } from "../../../../utility/dateFormatter";
import { getPDFAction } from "../../../../utility/downloadFile";

import { getBuDetails } from "../helper";

import { toast } from "react-toastify";
import PeopleDeskTable, {
  paginationSize,
} from "../../../../common/peopleDeskTable";
import ResetButton from "./../../../../common/ResetButton";
import PopOverFilter from "./PopOverFilter";
import "./attendanceReport.css";
import { generateExcelAction } from "./excel/excelConvert";
import { attendanceReportColumn, getAttendanceReport } from "./helper";
import { getWorkplaceDetails } from "common/api";

const todayDate = dateFormatterForInput(new Date());
const initData = {
  search: "",
  fromDate: todayDate,
  toDate: todayDate,
};

export default function AttendanceReport() {
  // dispatch
  const dispatch = useDispatch();
  const { buId, orgId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  const { buName } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  // hooks
  const [rowDto, setRowDto] = useState([]);
  const [tempLoading, setTempLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [buDetails, setBuDetails] = useState({});
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  useEffect(() => {
    getAttendanceReport(
      wId,
      buId,
      todayDate,
      todayDate,
      setRowDto,
      setLoading,
      wgId,
      pages,
      setPages,
      ""
    );
    // eslint-disable-next-line
  }, [buId, orgId, wgId]);
  useEffect(() => {
    getWorkplaceDetails(wId, setBuDetails);
  }, [buId, orgId]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  // handleChangePage
  const handleChangePage = (_, newPage) => {
    setPages((prev) => {
      return { ...prev, current: newPage };
    });
    getAttendanceReport(
      wId,
      buId,
      todayDate,
      todayDate,
      setRowDto,
      setLoading,
      wgId,
      {
        current: newPage === 0 ? 1 : newPage,
        pageSize: pages?.pageSize,
        total: pages?.total,
      },
      setPages,
      ""
    );
  };
  //handleChangeRowsPerPage
  const handleChangeRowsPerPage = (event) => {
    setPages((prev) => {
      return { ...prev, pageSize: +event.target.value };
    });
    getAttendanceReport(
      wId,
      buId,
      todayDate,
      todayDate,
      setRowDto,
      setLoading,
      wgId,
      {
        current: pages?.current,
        pageSize: +event.target.value,
        total: pages?.total,
      },
      setPages,
      ""
    );
  };

  const saveHandler = (values) => {
    getAttendanceReport(
      wId,
      buId,
      values?.fromDate,
      values?.toDate,
      setRowDto,
      setLoading,
      wgId,
      pages,
      setPages,
      ""
    );
  };

  // const activity_day_total = (fieldName) => {
  //   let total = 0;
  //   rowDto?.data?.map((row) => (total += row[fieldName]));
  //   return total;
  // };

  //  permission
  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30315) {
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
              {(loading || tempLoading) && <Loading />}
              <div>
                {permission?.isView ? (
                  <div className="table-card">
                    <div className="table-card-heading">
                      <div className="d-flex">
                        <Tooltip title="Export CSV" arrow>
                          <div
                            className="btn-save"
                            onClick={(e) => {
                              e.preventDefault();
                              const excelLanding = async () => {
                                setLoading && setLoading(true);
                                try {
                                  const res = await axios.get(
                                    `/TimeSheetReport/GetEmpAttendanceReport?FromDate=${
                                      values?.fromDate
                                    }&ToDate=${
                                      values?.toDate
                                    }&IntBusinessUnitId=${buId}&IntWorkplaceId=${wId}&IntWorkplaceGroupId=${wgId}&PageNo=1&PageSize=100000&IsPaginated=false&SearchTxt=${
                                      values?.search || ""
                                    }&IsXls=true`
                                    // `/TimeSheetReport/GetAttendanceReport?FromDate=${
                                    //   values?.fromDate
                                    // }&ToDate=${
                                    //   values?.toDate
                                    // }&BusinessUnitId=${buId}&AccountId=${orgId}&IntWorkplaceGroupId=${wgId}&PageNo=1&PageSize=1000000&IsPaginated=${false}`
                                  );
                                  if (res?.data) {
                                    if (res?.data < 1) {
                                      setLoading(false);
                                      return toast.error("No Data Found");
                                    }
                                    generateExcelAction(
                                      "Employees Attendance Report",
                                      "",
                                      "",
                                      buDetails?.strWorkplace,
                                      res?.data?.data,
                                      buDetails?.strAddress,
                                      values?.fromDate,
                                      values?.toDate
                                    );
                                  }
                                  setLoading && setLoading(false);
                                } catch (error) {
                                  setLoading && setLoading(false);
                                }
                              };
                              excelLanding();
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            <SaveAlt
                              sx={{ color: gray600, fontSize: "16px" }}
                            />
                          </div>
                        </Tooltip>
                        <div className="ml-3 d-flex align-items-center">
                          <div className="d-flex align-items-center">
                            <Typography
                              fontWeight={500}
                              className="ml-2"
                              fontSize={"12px"}
                            >
                              Present:
                            </Typography>
                            <Typography
                              fontWeight={500}
                              className="ml-2"
                              fontSize={"12px"}
                            >
                              {rowDto?.presentCount}
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
                              {rowDto?.absentCount}
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
                              {rowDto?.lateCount}
                            </Typography>
                          </div>
                        </div>
                      </div>
                      <div className="table-card-head-right">
                        <ul>
                          {(values?.search || values?.dateRange) && (
                            <li>
                              <ResetButton
                                title="reset"
                                icon={
                                  <SettingsBackupRestoreOutlined
                                    sx={{ marginRight: "10px" }}
                                  />
                                }
                                onClick={() => {
                                  setFieldValue("dateRange", "");
                                  setFieldValue("search", "");
                                }}
                              />
                            </li>
                          )}
                          <li>
                            <div
                              className="d-flex align-items-end"
                              style={{ paddingBottom: "7px" }}
                            >
                              <div className="mr-3 d-flex align-items-center">
                                <label className="mr-2">From Date</label>
                                <FormikInput
                                  classes="input-sm"
                                  type="date"
                                  value={values?.fromDate}
                                  name="fromDate"
                                  onChange={(e) => {
                                    setFieldValue("fromDate", e.target.value);
                                  }}
                                  errors={errors}
                                  touched={touched}
                                />
                              </div>
                              <div className="mr-3 d-flex align-items-center">
                                <label className="mr-2">To Date</label>
                                <FormikInput
                                  classes="input-sm"
                                  type="date"
                                  value={values?.toDate}
                                  name="toDate"
                                  min={values?.fromDate}
                                  onChange={(e) => {
                                    setFieldValue("toDate", e.target.value);
                                  }}
                                  errors={errors}
                                  touched={touched}
                                />
                              </div>
                              <div>
                                <PrimaryButton
                                  type="submit"
                                  className="btn btn-default flex-center"
                                  label={"Apply"}
                                  onClick={() => {}}
                                  onSubmit={() => handleSubmit()}
                                />
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <PeopleDeskTable
                      columnData={attendanceReportColumn(
                        pages?.current,
                        pages?.pageSize
                      )}
                      pages={pages}
                      rowDto={rowDto?.data}
                      setRowDto={setRowDto}
                      handleChangePage={(e, newPage) =>
                        handleChangePage(e, newPage, values?.search)
                      }
                      handleChangeRowsPerPage={(e) =>
                        handleChangeRowsPerPage(e, values?.search)
                      }
                      onRowClick={(record) => {
                        getPDFAction(
                          `/PdfAndExcelReport/DailyAttendanceReportByEmployee?TypeId=0&EmployeeId=${record?.employeeId}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}`,
                          setLoading
                        );
                      }}
                      uniqueKey="employeeCode"
                      isScrollAble={true}
                    />
                  </div>
                ) : (
                  <NotPermittedPage />
                )}
              </div>
            </Form>
          </>
        )}
      </Formik>
      <PopOverFilter
        propsObj={{
          id,
          open,
          anchorEl,
          setAnchorEl,
          handleClose,
        }}
        masterFilterHandler={handleClick}
      />
    </>
  );
}
