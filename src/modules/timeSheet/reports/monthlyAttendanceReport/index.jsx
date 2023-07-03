/* eslint-disable react-hooks/exhaustive-deps */
import { SaveAlt, SettingsBackupRestoreOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AntScrollTable from "../../../../common/AntScrollTable";
import { paginationSize } from "../../../../common/AntTable";
import { getPeopleDeskAllDDL } from "../../../../common/api";
import DefaultInput from "../../../../common/DefaultInput";
import FormikSelect from "../../../../common/FormikSelect";
import Loading from "../../../../common/loading/Loading";
import MasterFilter from "../../../../common/MasterFilter";
import NoResult from "../../../../common/NoResult";
import ResetButton from "../../../../common/ResetButton";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import {
  dateFormatter,
  monthFirstDate,
} from "../../../../utility/dateFormatter";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { todayDate } from "../../../../utility/todayDate";
import { getBuDetails } from "../helper";
import axios from "axios";

import {
  column,
  getTableDataMonthlyAttendance,
  monthlyAttendanceReportColumns,
  // onFilterMonthlyAttendance,
  onGetMonthlyAttendanceReport,
} from "./helper";
import { createCommonExcelFile } from "../../../../utility/customExcel/generateExcelAction";

const initialValues = {
  search: "",
  businessUnit: "",
  workplaceGroup: "",
  workplace: "",
  fromDate: monthFirstDate(),
  toDate: todayDate(),
};
const MonthlyAttendanceReport = () => {
  // redux
  const {
    permissionList,
    profileData: { orgId, buId, employeeId, buName, wgId },
  } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30339) {
      permission = item;
    }
  });

  // hooks
  const [buDetails, setBuDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rowData, setRowDto] = useState([]);
  const [businessUnitDDL, setBusinessUnitDDL] = useState([]);
  const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState([]);
  const [workplaceDDL, setWorkplaceDDL] = useState([]);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  const [
    monthlyAttendanceInformation,
    getMonthlyAttendanceInformation,
    loadingOnGetMonthlyAttendance,
  ] = useAxiosGet();

  useEffect(() => {
    onGetMonthlyAttendanceReport(
      getMonthlyAttendanceInformation,
      orgId,
      values,
      setRowDto,
      pages,
      ""
    );
  }, [wgId]);

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=BusinessUnit&BusinessUnitId=${buId}&intId=${employeeId}&WorkplaceGroupId=${wgId}`,
      "intBusinessUnitId",
      "strBusinessUnit",
      setBusinessUnitDDL
    );
  }, [orgId, buId, employeeId]);

  useEffect(() => {
    getBuDetails(buId, setBuDetails);
  }, [orgId, buId]);

  //  formik
  const { values, setFieldValue, setValues, handleSubmit } = useFormik({
    initialValues,
    onSubmit: (formValues) => {
      onGetMonthlyAttendanceReport(
        getMonthlyAttendanceInformation,
        orgId,
        formValues,
        setRowDto,
        pages,
        setPages,
        values?.search
      );
    },
  });
  // page handling function
  const handleTableChange = (pagination, newRowDto, srcText) => {
    if (newRowDto?.action === "filter") {
      return;
    }
    if (
      pages?.current === pagination?.current &&
      pages?.pageSize !== pagination?.pageSize
    ) {
      return onGetMonthlyAttendanceReport(
        getMonthlyAttendanceInformation,
        orgId,
        values,
        setRowDto,
        pagination,
        setPages,
        srcText
      );
    }
    if (pages?.current !== pagination?.current) {
      return onGetMonthlyAttendanceReport(
        getMonthlyAttendanceInformation,
        orgId,
        values,
        setRowDto,
        pagination,
        setPages,
        srcText
      );
    }
  };

  return (
    <>
      {(loadingOnGetMonthlyAttendance || loading) && <Loading />}
      {permission?.isView && (
        <div className="table-card">
          <div className="table-card-heading pb-2">
            <div className="d-flex">
              <Tooltip title="Export CSV" arrow>
                <button
                  className="btn-save "
                  onClick={(e) => {
                    setLoading(true);
                    const excelLanding = async () => {
                      try {
                        const res = await axios.get(
                          `/TimeSheetReport/TimeManagementDynamicPIVOTReport?ReportType=monthly_attendance_report_for_all_employee&DteFromDate=${
                            values?.fromDate
                          }&DteToDate=${
                            values?.toDate
                          }&EmployeeId=0&WorkplaceGroupId=${
                            values?.workplaceGroup?.value || 0
                          }&WorkplaceId=${
                            values?.workplace?.value || 0
                          }&AccountId=${orgId}&PageNo=1&PageSize=1000000&IsPaginated=false`
                        );
                        if (res?.data) {
                          setLoading(false);
                          if (res?.data < 1) {
                            return toast.error("No Attendance Data Found");
                          }

                          const newData = res?.data?.map((item, index) => {
                            return {
                              ...item,
                              sl: index + 1,
                            };
                          });

                          createCommonExcelFile({
                            titleWithDate: `Monthly Attendance Report - ${dateFormatter(
                              values?.fromDate
                            )} to ${dateFormatter(values?.toDate)}`,
                            fromDate: "",
                            toDate: "",
                            buAddress: buDetails?.strBusinessUnitAddress,
                            businessUnit: buName,
                            tableHeader: column(
                              values?.fromDate,
                              values?.toDate
                            ),
                            getTableData: () =>
                              getTableDataMonthlyAttendance(
                                newData,
                                Object.keys(
                                  column(values?.fromDate, values?.toDate)
                                )
                              ),
                            tableFooter: [],
                            extraInfo: {},
                            tableHeadFontSize: 10,
                            widthList: {
                              C: 30,
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
                        setLoading(false);
                      } catch (error) {
                        setLoading(false);
                        toast.error(error?.response?.data?.message);
                      }
                    };
                    excelLanding();
                    // onGetMonthlyAttendanceReport(
                    //   getMonthlyAttendanceInformation,
                    //   orgId,
                    //   values,
                    //   setRowDto,
                    //   pages,
                    //   setPages,
                    //   '',
                    //   false
                    // )
                    // if (!rowData?.length > 0) {
                    //   return toast.warn("No Attendance Report Found");
                    // }
                    // generateExcelActionBeta(
                    //   `Monthly Attendance Report - ${dateFormatter(
                    //     values?.fromDate
                    //   )} to ${dateFormatter(values?.toDate)}`,
                    //   "",
                    //   "",
                    //   attendeceReportExlCol(values?.fromDate, values?.toDate),
                    //   rowData,
                    //   buName,
                    //   buDetails?.strBusinessUnitAddress,
                    //   widthList
                    //   // true
                    // );
                  }}
                >
                  <SaveAlt sx={{ color: "#637381", fontSize: "16px" }} />
                </button>
              </Tooltip>
              {/* <Tooltip title="Print" arrow>
                              <button
                                className="btn-save ml-3"
                                style={{
                                  border: "transparent",
                                  width: "40px",
                                  height: "40px",
                                  background: "#f2f2f7",
                                  borderRadius: "100px",
                                }}
                                onClick={() => {
                                  getPDFAction(
                                    `/emp/PdfAndExcelReport/RosterReport?AccountId=${orgId}&BusinessUnitId=${buId}&WorkplaceId=${pdfData?.workplace?.value || 0
                                    }&WorkPalceGroupId=0&CalendarId=${pdfData?.calendarType?.value || 0}&UserDate=${pdfData?.date || todayDate()}&CalendarTypeId=${pdfData?.rosterGroupName?.value || 0
                                    }`,
                                    setLoading
                                  );
                                }}
                              >
                                <PrintIcon sx={{ color: "#637381" }} />
                              </button>
                            </Tooltip> */}
            </div>
            <div className="table-card-head-right">
              {values?.search && (
                <div className="pr-2">
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
                      setFieldValue("search", "");
                      setRowDto(monthlyAttendanceInformation);
                    }}
                  />
                </div>
              )}
              <MasterFilter
                styles={{ marginRight: "0px" }}
                width="200px"
                inputWidth="200px"
                isHiddenFilter
                value={values?.search}
                setValue={(value) => {
                  setFieldValue("search", value);
                  if (value) {
                    onGetMonthlyAttendanceReport(
                      getMonthlyAttendanceInformation,
                      orgId,
                      values,
                      setRowDto,
                      pages,
                      setPages,
                      value,
                      false
                    );
                  } else {
                    onGetMonthlyAttendanceReport(
                      getMonthlyAttendanceInformation,
                      orgId,
                      values,
                      setRowDto,
                      pages,
                      setPages,
                      "",
                      false
                    );
                  }
                  // onFilterMonthlyAttendance(
                  //   value,
                  //   monthlyAttendanceInformation,
                  //   setRowDto
                  // );
                }}
                cancelHandler={() => {
                  setFieldValue("search", "");
                  setRowDto(monthlyAttendanceInformation);
                }}
              />
            </div>
          </div>
          <div className="table-card-body">
            <div className="card-style mb-2 row px-0 pb-0">
              <div className="col-lg-3">
                <div className="input-field-main">
                  <label>Business Unit</label>
                  <FormikSelect
                    name="businessUnit"
                    options={businessUnitDDL || []}
                    value={values?.businessUnit}
                    onChange={(valueOption) => {
                      setFieldValue("businessUnit", valueOption);
                      if (valueOption?.value) {
                        getPeopleDeskAllDDL(
                          `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplaceGroup&BusinessUnitId=${valueOption?.value}&intId=${employeeId}&WorkplaceGroupId=${wgId}`,
                          "intWorkplaceGroupId",
                          "strWorkplaceGroup",
                          setWorkplaceGroupDDL
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
                  <label>Workplace Group</label>
                  <FormikSelect
                    name="workplaceGroup"
                    options={workplaceGroupDDL || []}
                    value={values?.workplaceGroup}
                    onChange={(valueOption) => {
                      setValues((prev) => ({
                        ...prev,
                        workplace: "",
                        workplaceGroup: valueOption,
                      }));
                      if (valueOption?.value) {
                        getPeopleDeskAllDDL(
                          `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&BusinessUnitId=${values?.businessUnit?.value}&WorkplaceGroupId=${valueOption?.value}&intId=${employeeId}`,
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
                    options={workplaceDDL || []}
                    value={values?.workplace}
                    onChange={(valueOption) => {
                      setFieldValue("workplace", valueOption);
                    }}
                    placeholder=""
                    styles={customStyles}
                  />
                </div>
              </div>
              <div className="col-lg-3">
                <div className="input-field-main">
                  <label>From Date</label>
                  <DefaultInput
                    classes="input-sm"
                    value={values?.fromDate}
                    placeholder=""
                    name="fromDate"
                    type="date"
                    className="form-control"
                    onChange={(e) => {
                      setFieldValue("fromDate", e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="col-lg-3">
                <div className="input-field-main">
                  <label>To Date</label>
                  <DefaultInput
                    classes="input-sm"
                    value={values?.toDate}
                    placeholder="Month"
                    name="toDate"
                    type="date"
                    className="form-control"
                    onChange={(e) => {
                      setFieldValue("toDate", e.target.value);
                    }}
                  />
                </div>
              </div>

              <div className="col-lg-1">
                <button
                  type="button"
                  disabled={!values?.toDate || !values?.fromDate}
                  style={{ marginTop: "21px" }}
                  className="btn btn-green"
                  onClick={handleSubmit}
                >
                  View
                </button>
              </div>
            </div>
          </div>
          {rowData?.length > 0 ? (
            <div className="table-card-styled employee-table-card table-responsive ant-scrolling-Table">
              <AntScrollTable
                data={rowData}
                columnsData={monthlyAttendanceReportColumns(
                  values?.fromDate,
                  values?.toDate,
                  pages?.current,
                  pages?.pageSize
                )}
                handleTableChange={({ pagination, newRowDto }) =>
                  handleTableChange(pagination, newRowDto, values?.search || "")
                }
                pages={pages?.pageSize}
                pagination={pages}
              />
            </div>
          ) : (
            <>
              <NoResult />
            </>
          )}
        </div>
      )}
    </>
  );
};

export default MonthlyAttendanceReport;
