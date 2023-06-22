/* eslint-disable react-hooks/exhaustive-deps */
import { SettingsBackupRestoreOutlined } from "@mui/icons-material";
import DownloadIcon from "@mui/icons-material/Download";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { IconButton, Tooltip, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import DefaultInput from "../../../../common/DefaultInput";
import FormikSelect from "../../../../common/FormikSelect";
import Loading from "../../../../common/loading/Loading";
import NoResult from "../../../../common/NoResult";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import ResetButton from "../../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { gray500 } from "../../../../utility/customColor";
import { customStyles } from "../../../../utility/selectCustomStyle";
import axios from "axios";
import moment from "moment";

import {
  column,
  dailyAttendenceDtoCol,
  getDailyAttendanceData,
  getTableDataDailyAttendance,
  getTableDataSummaryHeadData,
  subHeaderColumn,
} from "./helper";
import { createCommonExcelFile } from "../../../../utility/customExcel/generateExcelAction";
import { dateFormatter } from "../../../../utility/dateFormatter";
import PeopleDeskTable, {
  paginationSize,
} from "../../../../common/peopleDeskTable";
import { todayDate } from "../../../../utility/todayDate";
import MasterFilter from "../../../../common/MasterFilter";
import useDebounce from "../../../../utility/customHooks/useDebounce";
import { getBuDetails } from "../helper";

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

const MgmtDailyAttendance = () => {
  // redux
  const dispatch = useDispatch();

  const { orgId, buId, wgId } = useSelector(
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

  const debounce = useDebounce();

  //  menu permission
  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30327) {
      permission = item;
    }
  });

  const getData = (
    pagination = { current: 1, pageSize: paginationSize },
    srcTxt = "",
    date = todayDate(),
    isExcel = false
  ) => {
    getDailyAttendanceData(
      buId,
      date,
      setRowDto,
      setLoading,
      srcTxt,
      pagination?.current,
      pagination?.pageSize,
      isExcel,
      wgId,
      setPages
    );
  };

  useEffect(() => {
    getBuDetails(buId, setBuDetails);
    getData();
  }, [wgId]);

  // formik
  const { setFieldValue, values, errors, touched, setValues, handleSubmit } =
    useFormik({
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
      searchText
    );
  };

  const handleChangeRowsPerPage = (event, searchText) => {
    setPages((prev) => {
      return { current: 1, total: pages?.total, pageSize: +event.target.value };
    });
    getData(
      {
        current: 1,
        pageSize: +event.target.value,
        total: pages?.total,
      },
      searchText
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      {loading && <Loading />}
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
                <div className="col-lg-4 d-none">
                  <div className="input-field-main">
                    <label>Business Unit</label>
                    <FormikSelect
                      name="businessUnit"
                      // options={businessUnitDDL || []}
                      value={values?.businessUnit}
                      onChange={(valueOption) => {
                        // getPeopleDeskAllDDL(
                        //   `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplaceGroup&BusinessUnitId=${valueOption?.value}&intId=${employeeId}&WorkplaceGroupId=${wgId}`,
                        //   "intWorkplaceGroupId",
                        //   "strWorkplaceGroup",
                        //   setWorkplaceGroupDDL
                        // );
                        setValues((prev) => ({
                          ...prev,
                          businessUnit: valueOption,
                        }));
                      }}
                      placeholder=""
                      styles={customStyles}
                      isClearable={false}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
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
                {/* wg */}
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
                        // getPeopleDeskAllDDL(
                        //   `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&BusinessUnitId=${values?.businessUnit?.value}&WorkplaceGroupId=${valueOption?.value}&intId=${employeeId}`,
                        //   "intWorkplaceId",
                        //   "strWorkplace",
                        //   setWorkplaceDDL
                        // );
                        // setAllData([]);
                        // setRowDto([]);
                        // setWorkplaceDDL([]);
                      }}
                      placeholder=""
                      styles={customStyles}
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
                        margin: "12px 0px 10px 0px",
                      }}
                    >
                      Daily Attendance Report
                    </h2>
                  </div>

                  <div>
                    <ul className="d-flex flex-wrap">
                      {rowDto?.length > 0 && (
                        <>
                          <li className="pr-2">
                            <Tooltip title="Export CSV" arrow>
                              <IconButton
                                style={{ color: "#101828" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const excelLanding = async () => {
                                    setLoading && setLoading(true);
                                    try {
                                      const res = await axios.get(
                                        `/Employee/DailyAttendanceReport?IntAccountId=${orgId}&AttendanceDate=${
                                          values?.date
                                        }&IntBusinessUnitId=${buId}&IntWorkplaceGroupId=${wgId}&IntWorkplaceId=${
                                          values?.workplace?.intWorkplaceId || 0
                                        }&PageNo=1&PageSize=1000000&IntDepartmentId=${0}&IsPaginated=false`
                                      );
                                      if (res?.data) {
                                        if (
                                          res?.data
                                            ?.employeeAttendanceSummaryVM < 1
                                        ) {
                                          setLoading(false);
                                          return toast.error(
                                            "No Employee Data Found"
                                          );
                                        }
                                        const newData =
                                          res?.data?.employeeAttendanceSummaryVM?.map(
                                            (item, index) => {
                                              return {
                                                ...item,
                                                sl: index + 1,
                                              };
                                            }
                                          );
                                        // generateExcelAction(
                                        //   `Daily Attendance`,
                                        //   "",
                                        //   "",
                                        //   values?.businessUnit?.label,
                                        //   res?.data?.employeeAttendanceSummaryVM,
                                        //   res?.data,
                                        //   values?.date,
                                        //   buDetails?.strBusinessUnitAddress
                                        // );
                                        createCommonExcelFile({
                                          titleWithDate: `Daily Attendance ${
                                            moment().format("ll") ||
                                            dateFormatter(values?.date)
                                          } `,
                                          fromDate: "",
                                          toDate: "",
                                          buAddress:
                                            buDetails?.strBusinessUnitAddress,
                                          businessUnit:
                                            values?.businessUnit?.label,
                                          tableHeader: column,
                                          getTableData: () =>
                                            getTableDataDailyAttendance(
                                              newData,
                                              Object.keys(column),
                                              res?.data
                                            ),
                                          getSubTableData: () =>
                                            getTableDataSummaryHeadData(
                                              res?.data
                                            ),
                                          subHeaderInfoArr: [
                                            res?.data?.workplaceGroup
                                              ? `Workplace Group-${res?.data?.workplaceGroup}`
                                              : "",
                                            res?.data?.workplace
                                              ? `Workplace-${res?.data?.workplace}`
                                              : "",
                                          ],
                                          subHeaderColumn,
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
                                      setLoading && setLoading(false);
                                    } catch (error) {
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
                          <li className="pr-2">
                            <Tooltip title="Print" arrow>
                              <IconButton
                                disabled={
                                  !values?.businessUnit || !values?.date
                                }
                                style={{ color: "#101828" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // getPDFAction(
                                  //   `/PdfAndExcelReport/DailyAttendanceReportPDF?IntAccountId=${orgId}&AttendanceDate=${
                                  //     values?.date
                                  //   }${
                                  //     values?.businessUnit?.value
                                  //       ? `&IntBusinessUnitId=${values?.businessUnit?.value}`
                                  //       : ""
                                  //   }${
                                  //     values?.workplaceGroup?.value
                                  //       ? `&IntWorkplaceGroupId=${values?.workplaceGroup?.value}`
                                  //       : ""
                                  //   }${
                                  //     tableRowDto?.length > 0
                                  //       ? `&EmployeeIdList=${null}`
                                  //       : ""
                                  //   }${
                                  //     values?.workplace?.value
                                  //       ? `&IntWorkplaceId=${values?.workplace?.value}`
                                  //       : ""
                                  //   }`,
                                  //   setLoading
                                  // );
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
                                "",
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

export default MgmtDailyAttendance;

/*      <table className="table">
                  <thead>
                    <tr>
                      <th style={{ width: "30px" }}>
                        <div>SL</div>
                      </th>
                      <th>
                        <div>Code</div>
                      </th>
                      <th>
                        <div>Employee Name</div>
                      </th>
                      <th>
                        <div>Department</div>
                      </th>
                      <th>
                        <div>Designation</div>
                      </th>
                      <th>
                        <div>Employement Type</div>
                      </th>
                      <th>
                        <div>In Time</div>
                      </th>
                      <th>
                        <div>Out Time</div>
                      </th>
                      <th>
                        <div>Status</div>
                      </th>
                      <th>
                        <div>Address</div>
                      </th>
                      <th>
                        <div>Remarks</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowDto?.map((item, index) => (
                      <tr key={index}>
                        <td style={{ width: "30px" }}>
                          <div className="tableBody-title">{index + 1}</div>
                        </td>
                        <td>
                          <div className="tableBody-title">
                            {item?.employeeCode || "N/A"}
                          </div>
                        </td>
                        <td>
                          <div className="tableBody-title">
                            {item?.employeeName || "N/A"}
                          </div>
                        </td>
                        <td>
                          <div className="tableBody-title">
                            {item?.department || "N/A"}
                          </div>
                        </td>
                        <td>
                          <div className="tableBody-title">
                            {item?.designation || "N/A"}
                          </div>
                        </td>
                        <td>
                          <div className="tableBody-title">
                            {item?.employmentType || "N/A"}
                          </div>
                        </td>
                        <td>
                          <div className="tableBody-title">
                            {item?.inTime || "N/A"}
                          </div>
                        </td>
                        <td>
                          <div className="tableBody-title">
                            {item?.outTime || "N/A"}
                          </div>
                        </td>
                        <td>
                          <div className="tableBody-title ">
                            {item?.status || "N/A"}
                          </div>
                        </td>
                        <td>
                          <div className="tableBody-title">
                            {item?.location || "N/A"}
                          </div>
                        </td>
                        <td>
                          <div className="tableBody-title text-center">
                            {item?.remarks || "N/A"}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>  */
