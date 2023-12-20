/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { SaveAlt, SettingsBackupRestoreOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AntScrollTable from "../../../../common/AntScrollTable";
import { paginationSize } from "../../../../common/AntTable";
import {
  getPeopleDeskAllDDL,
  getWorkplaceDetails,
} from "../../../../common/api";
import DefaultInput from "../../../../common/DefaultInput";
import FormikSelect from "../../../../common/FormikSelect";
import Loading from "../../../../common/loading/Loading";
import MasterFilter from "../../../../common/MasterFilter";
import NoResult from "../../../../common/NoResult";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import ResetButton from "../../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { generateExcelActionBeta } from "../../../../utility/createExcel";
import {
  dateFormatter,
  monthFirstDate,
} from "../../../../utility/dateFormatter";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { todayDate } from "../../../../utility/todayDate";
import axios from "axios";
import {
  fromToDateList,
  getBuDetails,
  getRosterReport,
  rosterReportDtoCol,
} from "../helper";
import { generateExcelAction } from "../rosterReport/excel/excelConvert";
import PopOverFilter from "../rosterReport/PopOverFilter";
import "../rosterReport/rosterDetails.css";
import { getTableDataMonthlyInOut, montlyInOutXlCol } from "./helper";
import { createCommonExcelFile } from "../../../../utility/customExcel/generateExcelAction";

const initData = {
  search: "",

  //  master filter
  businessUnit: "",
  workplace: "",
  workplaceGroup: "",

  date: "",
  fromDate: monthFirstDate(),
  toDate: todayDate(),
};

const customStyleObj = {
  root: {
    minWidth: "750px",
  },
};

export default function MonthlyInOutReport() {
  // redux
  const dispatch = useDispatch();

  const { orgId, buId, buName, employeeId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  // hooks
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [rowDto, setRowDto] = useState(null);
  const [buDetails, setBuDetails] = useState({});
  const [pdfData, setPdfData] = useState(null);
  // const [businessUnitDDL, setBusinessUnitDDL] = useState([]);
  // const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState([]);
  const [workplaceDDL, setWorkplaceDDL] = useState([]);
  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);
  const [isFilter, setIsFilter] = useState({
    workplace: "",
    workplaceGroup: "",
    department: "",
    designation: "",
    calendarType: "",
    rosterGroupName: "",
    date: "",
  });
  const [tableRowDto, setTableRowDto] = useState([]);
  const [columnList, setColumnList] = useState([]);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const saveHandler = (values) => {};

  const getData = (fromDate, toDate) => {
    getRosterReport(
      orgId,
      values?.businessUnit?.value || buId,
      values?.workplace?.value || 0,
      values?.workplaceGroup?.value || wgId || 0,
      0,
      0,
      0,
      todayDate(),
      0,
      0,
      setRowDto,
      setLoading,
      setTableRowDto,
      fromDate ? fromDate : monthFirstDate(),
      toDate ? toDate : todayDate(),
      "",
      pages,
      setPages
    );
    setColumnList(
      fromToDateList(fromDate || initData?.fromDate, toDate || initData?.toDate)
    );
    getWorkplaceDetails(wId, setBuDetails);

    // getRosterReport(orgId, buId, 0, 0, todayDate(), 0, setRowDto, setLoading);
  };

  useEffect(() => {
    getData();
  }, [buId, wgId]);

  useEffect(() => {
    // getPeopleDeskAllDDL(
    //   `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=BusinessUnit&BusinessUnitId=${buId}&WorkplaceGroupId=0&intId=${employeeId}`,
    //   "intBusinessUnitId",
    //   "strBusinessUnit",
    //   setBusinessUnitDDL
    // );
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&intId=${employeeId}`,
      "intWorkplaceId",
      "strWorkplace",
      setWorkplaceDDL
    );
  }, [orgId, buId, employeeId]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Monthly IN-OUT Report";
  }, []);

  const masterFilterHandler = ({
    workplace,
    workplaceGroup,
    calendarType,
    department,
    designation,
    rosterGroupName,
    date,
  }) => {
    getRosterReport(
      orgId,
      buId,
      workplace?.value || 0,
      wgId || 0,
      calendarType?.value || 0,
      department?.value || 0,
      designation?.value || 0,
      date || todayDate(),
      0,
      rosterGroupName?.value || 0,
      setRowDto,
      setLoading
    );
    // getRosterReport(orgId, buId, workplace?.value || 0, calendarType?.value || 0, date, rosterGroupName?.value || 0, setRowDto, setLoading);
    setAnchorEl(null);
  };

  // search
  const filterData = (keywords) => {
    try {
      const regex = new RegExp(keywords?.toLowerCase());
      let newDta = rowDto?.filter(
        (item) =>
          regex.test(item?.strEmployeeName?.toLowerCase()) ||
          regex.test(item?.strDepartment?.toLowerCase()) ||
          regex.test(item?.strDesignation?.toLowerCase())
      );
      setTableRowDto(newDta);
    } catch (error) {
      setRowDto([]);
    }
  };
  // page
  const handleTableChange = (pagination, newRowDto, srcText) => {
    if (newRowDto?.action === "filter") {
      return;
    }
    if (
      pages?.current === pagination?.current &&
      pages?.pageSize !== pagination?.pageSize
    ) {
      return getRosterReport(
        orgId,
        values?.businessUnit?.value || buId,
        values?.workplace?.value || 0,
        values?.workplaceGroup?.value || wgId || 0,
        0,
        0,
        0,
        todayDate(),
        0,
        0,
        setRowDto,
        setLoading,
        setTableRowDto,
        values?.fromDate ? values?.fromDate : monthFirstDate(),
        values?.toDate ? values?.toDate : todayDate(),
        srcText,
        pagination,
        setPages
      );
    }
    if (pages?.current !== pagination?.current) {
      return getRosterReport(
        orgId,
        values?.businessUnit?.value || buId,
        values?.workplace?.value || 0,
        values?.workplaceGroup?.value || wgId || 0,
        0,
        0,
        0,
        todayDate(),
        0,
        0,
        setRowDto,
        setLoading,
        setTableRowDto,
        values?.fromDate ? values?.fromDate : monthFirstDate(),
        values?.toDate ? values?.toDate : todayDate(),
        srcText,
        pagination,
        setPages
      );
    }
  };
  // manage permission
  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30316) {
      permission = item;
    }
  });
  // formik
  const {
    resetForm,
    values,
    errors,
    touched,
    setFieldValue,

    setValues,
  } = useFormik({
    enableReinitialize: true,
    initialValues: initData,
    onSubmit: (values, { resetForm }) => {
      saveHandler(values, () => {
        resetForm(initData);
      });
    },
  });
  return (
    <>
      <>
        {loading && <Loading />}

        <div className="attendence-report">
          {permission?.isView ? (
            <div className="table-card">
              <div className="table-card-heading pb-2">
                <div className="d-flex">
                  <Tooltip title="Export CSV" arrow>
                    <button
                      className="btn-save "
                      onClick={(e) => {
                        e.preventDefault();
                        setLoading(true);
                        const excelLanding = async () => {
                          try {
                            const res = await axios.get(
                              `/TimeSheetReport/TimeManagementDynamicPIVOTReport?ReportType=monthly_in_out_attendance_report_for_all_employee&AccountId=${orgId}&DteFromDate=${
                                values?.fromDate
                              }&DteToDate=${
                                values?.toDate
                              }&EmployeeId=0&WorkplaceGroupId=${
                                wgId || 0
                              }&WorkplaceId=${
                                values?.workplace?.value || 0
                              }&PageNo=1&PageSize=100000&IsPaginated=false`
                            );
                            if (res?.data) {
                              if (res?.data < 1) {
                                setLoading(false);
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
                                buAddress: buDetails?.strAddress,
                                businessUnit: buDetails?.strWorkplace,
                                tableHeader: montlyInOutXlCol(
                                  values?.fromDate,
                                  values?.toDate
                                ),
                                getTableData: () =>
                                  getTableDataMonthlyInOut(
                                    newData,
                                    Object.keys(
                                      montlyInOutXlCol(
                                        values?.fromDate,
                                        values?.toDate
                                      )
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
                      }}
                    >
                      <SaveAlt sx={{ color: "#637381", fontSize: "16px" }} />
                    </button>
                  </Tooltip>
                </div>
                <div className="table-card-head-right">
                  {(values?.workplace ||
                    values?.calendarType ||
                    values?.rosterGroupName ||
                    // values?.workplaceGroup ||
                    values?.department ||
                    values?.designation ||
                    values?.date ||
                    values?.search) && (
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
                          getData();
                          setIsFilter({
                            rosterGroupName: "",
                            calendarType: "",
                            workplace: "",
                            workplaceGroup: "",
                            department: "",
                            designation: "",
                            date: "",
                          });
                          resetForm(initData);
                          setFieldValue("search", "");
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
                      // filterData(value, setRowDto);
                      setFieldValue("search", value);
                      if (value) {
                        getRosterReport(
                          orgId,
                          values?.businessUnit?.value || buId,
                          values?.workplace?.value || 0,
                          values?.workplaceGroup?.value || wgId || 0,
                          0,
                          0,
                          0,
                          todayDate(),
                          0,
                          0,
                          setRowDto,
                          setLoading,
                          setTableRowDto,
                          values?.fromDate
                            ? values?.fromDate
                            : monthFirstDate(),
                          values?.toDate ? values?.toDate : todayDate(),
                          value,
                          { current: 1, pageSize: paginationSize },
                          setPages
                        );
                      } else {
                        getRosterReport(
                          orgId,
                          values?.businessUnit?.value || buId,
                          values?.workplace?.value || 0,
                          values?.workplaceGroup?.value || wgId || 0,
                          0,
                          0,
                          0,
                          todayDate(),
                          0,
                          0,
                          setRowDto,
                          setLoading,
                          setTableRowDto,
                          values?.fromDate
                            ? values?.fromDate
                            : monthFirstDate(),
                          values?.toDate ? values?.toDate : todayDate(),
                          "",
                          { current: 1, pageSize: paginationSize },
                          setPages
                        );
                      }
                    }}
                    cancelHandler={() => {
                      setFieldValue("search", "");
                      getData();
                      setIsFilter({
                        rosterGroupName: "",
                        calendarType: "",
                        workplace: "",
                        workplaceGroup: "",
                        department: "",
                        designation: "",
                      });
                    }}
                    handleClick={handleClick}
                  />
                </div>
              </div>
              <div className="table-card-body">
                <div className="card-style mb-2 row px-0 pb-0">
                  <div className="col-lg-3 d-none">
                    <div className="input-field-main">
                      <label>Business Unit</label>
                      <FormikSelect
                        name="businessUnit"
                        // options={businessUnitDDL || []}
                        value={values?.businessUnit}
                        onChange={(valueOption) => {
                          if (valueOption?.value) {
                            // getPeopleDeskAllDDL(
                            //   `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplaceGroup&BusinessUnitId=${valueOption?.value}&intId=${employeeId}`,
                            //   "intWorkplaceGroupId",
                            //   "strWorkplaceGroup",
                            //   setWorkplaceGroupDDL
                            // );
                            setValues((prev) => ({
                              ...prev,
                              businessUnit: valueOption,
                            }));
                            getBuDetails(
                              valueOption.intBusinessUnitId,
                              setBuDetails,
                              setLoading
                            );
                          }
                          setTableRowDto([]);
                          setRowDto([]);
                        }}
                        placeholder=""
                        styles={customStyles}
                        isClearable={false}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 d-none">
                    <div className="input-field-main">
                      <label>Workplace Group</label>
                      <FormikSelect
                        name="workplaceGroup"
                        // options={[...workplaceGroupDDL] || []}
                        value={values?.workplaceGroup}
                        onChange={(valueOption) => {
                          setValues((prev) => ({
                            ...prev,
                            workplace: "",
                            workplaceGroup: valueOption,
                          }));
                          if (valueOption?.value) {
                            getWorkplaceDetails(
                              valueOption?.value,
                              setBuDetails
                            );

                            // getPeopleDeskAllDDL(
                            //   `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&BusinessUnitId=${values?.businessUnit?.value}&WorkplaceGroupId=${valueOption?.value}&intId=${employeeId}`,
                            //   "intWorkplaceId",
                            //   "strWorkplace",
                            //   setWorkplaceDDL
                            // );
                          }
                          setTableRowDto([]);
                          setRowDto([]);
                          setWorkplaceDDL([]);
                        }}
                        placeholder=""
                        styles={customStyles}
                        errors={errors}
                        touched={touched}
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
                          setValues((prev) => ({
                            ...prev,
                            workplace: valueOption,
                          }));
                          setTableRowDto([]);
                          setRowDto([]);
                        }}
                        placeholder=""
                        styles={customStyles}
                        errors={errors}
                        touched={touched}
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
                      disabled={!values?.toDate || !values?.fromDate}
                      style={{ marginTop: "21px" }}
                      className="btn btn-green"
                      onClick={() => {
                        getData(values?.fromDate, values?.toDate);
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
                {rowDto?.length > 0 ? (
                  <>
                    <div className="table-card-styled employee-table-card table-responsive ant-scrolling-Table">
                      <AntScrollTable
                        data={values?.search ? tableRowDto : rowDto}
                        columnsData={rosterReportDtoCol(
                          page,
                          paginationSize,
                          columnList
                        )}
                        setColumnsData={(newRow) => setTableRowDto(newRow)}
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
                  <>
                    {!loading && <NoResult title="No Result Found" para="" />}
                  </>
                )}
              </div>
            </div>
          ) : (
            <NotPermittedPage />
          )}
        </div>
        <PopOverFilter
          propsObj={{
            customStyleObj,
            id,
            open,
            anchorEl,
            setAnchorEl,
            handleClose,
            setFieldValue,
            values,
            errors,
            touched,
            initData,
            resetForm,
          }}
          masterFilterHandler={masterFilterHandler}
          setIsFilter={setIsFilter}
          isFilter={isFilter}
          setPdfData={setPdfData}
        />
      </>
    </>
  );
}
