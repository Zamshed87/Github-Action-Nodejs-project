import { SaveAlt, SettingsBackupRestoreOutlined } from "@mui/icons-material";
import { Tooltip, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import AvatarComponent from "../../../../common/AvatarComponent";
import FormikInput from "../../../../common/FormikInput";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import PrimaryButton from "../../../../common/PrimaryButton";
import ScrollableTable from "../../../../common/ScrollableTable";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { gray600 } from "../../../../utility/customColor";
import { dateFormatterForInput } from "../../../../utility/dateFormatter";
import { getPDFAction } from "../../../../utility/downloadFile";
import axios from "axios";

import {
  getAllLveLeaveType,
  getAttendenceReport,
  getBuDetails,
} from "../helper";
import { TablePagination } from "@mui/material";

import ResetButton from "./../../../../common/ResetButton";
import "./attendanceReport.css";
import { generateExcelAction } from "./excel/excelConvert";
import PopOverFilter from "./PopOverFilter";
import { toast } from "react-toastify";

const todayDate = dateFormatterForInput(new Date());
const initData = {
  search: "",
  fromDate: todayDate,
  toDate: todayDate,
};

export default function AttendanceReport() {
  // dispatch
  const dispatch = useDispatch();
  const { buId, orgId, wgId } = useSelector(
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
  const [leaveTypeList, setLeaveTypeList] = useState([]);
  const [tempLoading, setTempLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [buDetails, setBuDetails] = useState({});
  const [pages, setPages] = useState({
    current: 1,
    pageSize: 25,
    total: 0,
  });

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  useEffect(() => {
    getAttendenceReport(
      orgId,
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
    getAllLveLeaveType(orgId, setLeaveTypeList, setTempLoading);
    getBuDetails(buId, setBuDetails, setTempLoading);
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
  const handleChangePage = (event, newPage) => {
    setPages((prev) => {
      return { ...prev, current: newPage };
    });
    getAttendenceReport(
      orgId,
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
    getAttendenceReport(
      orgId,
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
    getAttendenceReport(
      orgId,
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
    getAllLveLeaveType(orgId, setLeaveTypeList, setTempLoading);
  };

  const activity_day_total = (fieldName) => {
    let total = 0;
    rowDto.map((row) => (total += row[fieldName]));
    return total;
  };

  //  permission
  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 91) {
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
                                    `/TimeSheetReport/GetAttendanceReport?FromDate=${
                                      values?.fromDate
                                    }&ToDate=${
                                      values?.toDate
                                    }&BusinessUnitId=${buId}&AccountId=${orgId}&IntWorkplaceGroupId=${wgId}&PageNo=1&PageSize=1000000&IsPaginated=${false}`
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
                                      buName,
                                      res?.data,
                                      buDetails?.strBusinessUnitAddress,
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
                              {activity_day_total("present")}
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
                              {activity_day_total("absent")}
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
                              {activity_day_total("late")}
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
                    <div className="table-card-body">
                      <ScrollableTable
                        classes="salary-process-table"
                        secondClasses="table-card-styled tableOne scroll-table-height"
                      >
                        <thead>
                          <tr>
                            <th style={{ width: "30px" }}>
                              <div className="text-center">SL</div>
                            </th>
                            <th style={{ minWidth: "80px" }}>
                              <div>Code</div>
                            </th>
                            <th
                              className="fixed-column"
                              style={{ left: "125px" }}
                            >
                              <div>Employee</div>
                            </th>
                            <th>
                              <div>Designation</div>
                            </th>
                            <th>Department</th>
                            <th>Employment Type</th>
                            <th
                              className="text-center"
                              style={{ minWidth: "100px" }}
                            >
                              Days
                            </th>
                            <th
                              className="text-center"
                              style={{ minWidth: "100px" }}
                            >
                              Present
                            </th>
                            <th
                              className="text-center"
                              style={{ minWidth: "100px" }}
                            >
                              Absent
                            </th>
                            <th
                              className="text-center"
                              style={{ minWidth: "100px" }}
                            >
                              Late
                            </th>
                            <th
                              className="text-center"
                              style={{ minWidth: "100px" }}
                            >
                              Movement
                            </th>
                            {leaveTypeList?.length > 0 &&
                              leaveTypeList?.map((itm, i) => {
                                return (
                                  <th
                                    className="text-center"
                                    style={{ minWidth: "100px" }}
                                    key={i}
                                  >
                                    {itm?.strLeaveType}
                                  </th>
                                );
                              })}
                            <th
                              className="text-center"
                              style={{ minWidth: "100px" }}
                            >
                              Off Day
                            </th>
                            <th
                              className="text-center"
                              style={{ minWidth: "100px" }}
                            >
                              Holiday
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* {rowDto?.length === 0 && <Loading />} */}
                          {rowDto?.length > 0 &&
                            rowDto.map((data, index) => (
                              <tr
                                className="hasEvent"
                                key={data?.employeeId}
                                onClick={() => {
                                  getPDFAction(
                                    `/PdfAndExcelReport/DailyAttendanceReportByEmployee?TypeId=0&EmployeeId=${data?.employeeId}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}`,
                                    setLoading
                                  );
                                }}
                              >
                                <td>
                                  <div className="tableBody-title text-center">
                                    {index + 1}
                                  </div>
                                </td>
                                <td>
                                  <div className="tableBody-title">
                                    {data?.employeeCode}
                                  </div>
                                </td>
                                <td
                                  className="fixed-column"
                                  style={{ left: "125px" }}
                                >
                                  <div className="d-flex align-items-center">
                                    <div className="emp-avatar">
                                      <AvatarComponent
                                        classess=""
                                        letterCount={1}
                                        label={data?.employeeName}
                                      />
                                    </div>
                                    <div className="ml-2">
                                      <div className="tableBody-title">
                                        {data?.employeeName}{" "}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="tableBody-title">
                                    {data?.designationName}
                                  </div>
                                </td>
                                <td>
                                  <div className="tableBody-title">
                                    {data?.departmentName}
                                  </div>
                                </td>
                                <td>
                                  <div className="tableBody-title">
                                    {data?.employmentTypeName}
                                  </div>
                                </td>
                                <td className="text-center">
                                  <div className="tableBody-title">
                                    {data?.workingDays}
                                  </div>
                                </td>
                                <td className="text-center">
                                  <div className="tableBody-title">
                                    {data?.present}
                                  </div>
                                </td>
                                <td className="text-center">
                                  <div className="tableBody-title">
                                    {data?.absent}
                                  </div>
                                </td>
                                <td className="text-center">
                                  <div className="tableBody-title">
                                    {data?.late}
                                  </div>
                                </td>
                                <td className="text-center">
                                  <div className="tableBody-title">
                                    {data?.movement}
                                  </div>
                                </td>
                                {data?.leaveTypeWiseList?.length > 0 &&
                                  data?.leaveTypeWiseList.map((itm, i) => {
                                    return (
                                      <td className="text-center" key={i}>
                                        <div className="tableBody-title">
                                          {itm?.totalLeave}
                                        </div>
                                      </td>
                                    );
                                  })}
                                <td className="text-center">
                                  <div className="tableBody-title">
                                    {data?.offDay}
                                  </div>
                                </td>
                                <td className="text-center">
                                  <div className="tableBody-title">
                                    {data?.holiday}
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </ScrollableTable>
                      {rowDto?.length > 0 ? (
                        <TablePagination
                          rowsPerPageOptions={[5, 10, 15, 25, 100]}
                          component="div"
                          count={pages?.total || 50}
                          rowsPerPage={pages?.pageSize}
                          page={pages.current}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                      ) : null}
                      {/*    <div className="table-card-styled employee-table-card table-responsive ant-scrolling-Table">
                        <AntScrollTable
                          data={rowDto}
                          columnsData={attendenceReportDtoCol(rowDto)}
                        />
                      </div> */}
                    </div>
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
