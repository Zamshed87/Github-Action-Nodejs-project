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
import { getPeopleDeskAllDDL, getWorkplaceDetails } from "common/api";
import FormikSelect from "common/FormikSelect";
import { customStyles } from "utility/selectCustomStyle";

const todayDate = dateFormatterForInput(new Date());
const initData = {
  search: "",
  fromDate: todayDate,
  toDate: todayDate,
  workplace: "",
  workplaceGroup: "",
};

export default function AttendanceReport() {
  // dispatch
  const dispatch = useDispatch();
  const { buId, orgId, wgId, wId, employeeId } = useSelector(
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
  const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState([]);
  const [workplaceDDL, setWorkplaceDDL] = useState([]);
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
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplaceGroup&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&intId=${employeeId}`,
      "intWorkplaceGroupId",
      "strWorkplaceGroup",
      setWorkplaceGroupDDL
    );
  }, [buId, orgId]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Attendance Report";
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  // handleChangePage
  const handleChangePage = (_, newPage, values) => {
    setPages((prev) => {
      return { ...prev, current: newPage };
    });
    getAttendanceReport(
      values?.workplace?.value || wId,
      buId,
      todayDate,
      todayDate,
      setRowDto,
      setLoading,
      values?.workplaceGroup?.value || wgId,
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
  const handleChangeRowsPerPage = (event, values) => {
    setPages((prev) => {
      return { ...prev, pageSize: +event.target.value };
    });
    getAttendanceReport(
      values?.workplace?.value || wId,
      buId,
      todayDate,
      todayDate,
      setRowDto,
      setLoading,
      values?.workplaceGroup?.value || wgId,
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
      values?.workplace?.value || wId,
      buId,
      values?.fromDate,
      values?.toDate,
      setRowDto,
      setLoading,
      values?.workplaceGroup?.value || wgId,
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
                                    }&IntBusinessUnitId=${buId}&IntWorkplaceId=${
                                      values?.workplace?.value || wId
                                    }&IntWorkplaceGroupId=${
                                      values?.workplaceGroup?.value || wgId
                                    }&PageNo=1&PageSize=100000&IsPaginated=false&SearchTxt=${
                                      values?.search || ""
                                    }&IsXls=true`
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
                        </ul>
                      </div>
                    </div>
                    <div className="table-card-body">
                      <div className="card-style my-3">
                        <div className="row">
                          <div className="col-lg-2">
                            <div className="input-field-main">
                              <label>From Date</label>
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
                              <label>To Date</label>
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
                              // disabled={!values?.fromDate || !values?.toDate}
                              style={{ marginTop: "21px" }}
                              className="btn btn-green"
                              onClick={() => {
                                handleSubmit();
                              }}
                            >
                              View
                            </button>
                          </div>
                        </div>
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
                        handleChangeRowsPerPage(e, values)
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
