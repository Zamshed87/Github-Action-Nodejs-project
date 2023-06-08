/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { SaveAlt, SettingsBackupRestoreOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import AntScrollTable from "../../../../common/AntScrollTable";
import FormikInput from "../../../../common/FormikInput";
import Loading from "../../../../common/loading/Loading";
import MasterFilter from "../../../../common/MasterFilter";
import NoResult from "../../../../common/NoResult";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import ResetButton from "../../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { monthFirstDate } from "../../../../utility/dateFormatter";
import { todayDate } from "../../../../utility/todayDate";
import PopOverFilter from "./component/PopOverFilter";
import { generateExcelAction } from "./excel/excelConvert";
import {
  empOverTimeDtoCol,
  filterData,
  getBuDetails,
  getOvertimeReportLanding,
} from "./helper";
import "./overTimeReport.css";

const initData = {
  search: "",
  workplace: "",
  department: "",
  designation: "",
  employee: "",
  fromDate: monthFirstDate(),
  toDate: todayDate(),
};

const customStyleObj = {
  root: {
    minWidth: "750px",
  },
};

export default function EmOverTimeReport() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
  }, []);
  const [loading, setLoading] = useState(false);
  const [buDetails, setBuDetails] = useState({});

  // row data
  const [rowDto, setRowDto] = useState([]);
  const [total, setTotal] = useState(0);
  const [allData, setAllData] = useState([]);
  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);
  // master filter
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const { buId, orgId, buName, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [tableRowDto, setTableRowDto] = useState([]);

  useEffect(() => {
    if (rowDto.length > 0) {
      setTotal(
        Number(
          rowDto?.reduce((acc, item) => acc + item?.payAmount, 0).toFixed(2)
        )
      );
    }
  }, [rowDto]);
  // date
  let date = new Date();
  const monthOfSatrtDate = `${date.getFullYear()}-${date.getMonth() + 1}-1`;
  const monthOfEndDate = todayDate();
  const getData = (fromDate, toDate) => {
    getOvertimeReportLanding(
      "CalculatedHistoryReportForAllEmployee",
      orgId,
      buId,
      wgId,
      0,
      0,
      0,
      fromDate ? fromDate : monthFirstDate(),
      toDate ? toDate : todayDate(),
      setAllData,
      setRowDto,
      setLoading,
      setTableRowDto
    );
  };
  useEffect(() => {
    getData();
    getBuDetails(buId, setBuDetails, setLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId]);

  const saveHandler = (values) => { };

  // masterHandler
  const masterFilterHandler = (values) => {
    getOvertimeReportLanding(
      "CalculatedHistoryReportForAllEmployee",
      orgId,
      buId,
      wgId || 0,
      values?.department?.value || 0,
      values?.designation?.value || 0,
      values?.employee?.value || 0,
      values?.fromDate || monthOfSatrtDate,
      values?.toDate || monthOfEndDate,
      setAllData,
      setRowDto,
      setLoading
    );
    setAnchorEl(null);
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 102) {
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
              {loading && <Loading />}
              {permission?.isView ? (
                <div className="overtime-report">
                  <div className="table-card">
                    <div className="table-card-heading">
                      <div>
                        <Tooltip title="Export CSV" arrow>
                          <button
                            type="button"
                            className="btn-save "
                            onClick={() => {
                              rowDto?.length &&
                                generateExcelAction(
                                  "Overtime  Report",
                                  "",
                                  "",
                                  buName,
                                  tableRowDto?.data,
                                  buDetails?.strBusinessUnitAddress,
                                  total
                                );
                            }}
                          >
                            <SaveAlt
                              sx={{ color: "#637381", fontSize: "16px" }}
                            />
                          </button>
                        </Tooltip>
                      </div>
                      <div className="table-card-head-right">
                        <ul>
                          {(values?.search ||
                            values?.workplace ||
                            values?.department ||
                            values?.designation ||
                            values?.employee ||
                            // values?.fromDate ||
                            // values?.toDate ||
                            values?.search) && (
                              <li>
                                <ResetButton
                                  classes="btn-filter-reset"
                                  title="Reset"
                                  icon={
                                    <SettingsBackupRestoreOutlined
                                      sx={{ marginRight: "10px" }}
                                    />
                                  }
                                  onClick={() => {
                                    getOvertimeReportLanding(
                                      "CalculatedHistoryReportForAllEmployee",
                                      orgId,
                                      buId,
                                      wgId,
                                      0,
                                      0,
                                      0,
                                      monthOfSatrtDate,
                                      monthOfEndDate,
                                      setAllData,
                                      setRowDto,
                                      setLoading
                                    );
                                    setRowDto(allData);
                                    setFieldValue("workplace", "");
                                    setFieldValue("department", "");
                                    setFieldValue("designation", "");
                                    setFieldValue("employee", "");
                                    setFieldValue("fromDate", "");
                                    setFieldValue("toDate", "");
                                    setFieldValue("search", "");
                                  }}
                                />
                              </li>
                            )}
                          <li>
                            <MasterFilter
                              isHiddenFilter
                              width="250px"
                              inputWidth="250px"
                              value={values?.search}
                              setValue={(value) => {
                                filterData(value, allData, setRowDto);
                                setFieldValue("search", value);
                              }}
                              cancelHandler={() => {
                                setFieldValue("search", "");
                              }}
                              handleClick={handleClick}
                            />
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="table-card-body">
                      <div className="card-style my-2">
                        <div className="row">
                          <div className="col-lg-3">
                            <div className="input-field-main">
                              <label>From Date</label>
                              <FormikInput
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
                              <FormikInput
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
                      </div>
                      <div className="table-card-styled employee-table-card ant-scrolling-Table  table-responsive mt-3">
                        {rowDto?.length > 0 ? (
                          <>
                            <AntScrollTable
                              data={rowDto}
                              removePagination
                              columnsData={empOverTimeDtoCol(page, paginationSize)}
                              setColumnsData={(newRow) =>
                                setTableRowDto((prev) => ({
                                  ...prev,
                                  data: newRow,
                                  totalCount: newRow?.length,
                                }))
                              }
                              setPage={setPage}
                              setPaginationSize={setPaginationSize}
                            />
                          </>
                        ) : (
                          <>
                            {!loading && (
                              <NoResult title="No Result Found" para="" />
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <NotPermittedPage />
              )}

              {/* master filter */}
              <PopOverFilter
                propsObj={{
                  id,
                  open,
                  anchorEl,
                  handleClose,
                  setFieldValue,
                  values,
                  errors,
                  touched,
                  customStyleObj,
                  masterFilterHandler,
                }}
              />
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
/*   <table className="table">
                              <thead>
                                <tr>
                                  <th
                                    style={{
                                      width: "30px",
                                    }}
                                  >
                                    SL
                                  </th>
                                  <th>Code</th>
                                  <th>
                                    <div
                                      className="sortable"
                                      onClick={() => {
                                        setViewOrder(
                                          viewOrder === "desc" ? "asc" : "desc"
                                        );
                                        commonSortByFilter(
                                          viewOrder,
                                          "employee"
                                        );
                                      }}
                                    >
                                      <div>Employee</div>
                                      <div>
                                        <SortingIcon
                                          viewOrder={viewOrder}
                                        ></SortingIcon>
                                      </div>
                                    </div>
                                  </th>
                                  <th>
                                    <div className="sortable">
                                      <div>Designation</div>
                                    </div>
                                  </th>
                                  <th>
                                    <div className="sortable">
                                      <div>Department</div>
                                    </div>
                                  </th>
                                  <th>
                                    <div className="sortable">
                                      <div>Employment Type</div>
                                    </div>
                                  </th>
                                  <th>
                                    <div
                                      className="sortable justify-content-right"
                                      onClick={() => {
                                        setSalaryOrder(
                                          salaryOrder === "desc"
                                            ? "asc"
                                            : "desc"
                                        );
                                        commonSortByFilter(
                                          salaryOrder,
                                          "salary"
                                        );
                                      }}
                                    >
                                      <div>Salary</div>
                                      <div>
                                        <SortingIcon
                                          viewOrder={salaryOrder}
                                        ></SortingIcon>
                                      </div>
                                    </div>
                                  </th>
                                  <th>
                                    <div className="justify-content-right">
                                      <div>Basic</div>
                                    </div>
                                  </th>
                                  <th>
                                    <div className="justify-content-center">
                                      <div>Hour</div>
                                    </div>
                                  </th>
                                  <th>
                                    <div className="justify-content-center text-right">
                                      <div>Hour Amount Rate</div>
                                    </div>
                                  </th>
                                  <th>
                                    <div className="justify-content-center text-right">
                                      <div>Total Amount</div>
                                    </div>
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {rowDto?.map((item, index) => (
                                  <tr key={index}>
                                    <OverTimeReportTableItem
                                      item={item}
                                      index={index}
                                    />
                                  </tr>
                                ))}
                              </tbody>
                            </table>  */
