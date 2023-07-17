/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SaveAlt, SettingsBackupRestoreOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import Loading from "../../../../common/loading/Loading";
import SortingIcon from "../../../../common/SortingIcon";
import OverTimeReportTableItem from "./component/OverTimeEntryTableItem";
import PopOverFilter from "./component/PopOverFilter";
import MasterFilter from "../../../../common/MasterFilter";
import ResetButton from "./../../../../common/ResetButton";
import { filterData, getOvertimeReportLanding } from "./helper";
import NoResult from "../../../../common/NoResult";
import { downloadFile } from "./../../../../utility/downloadFile";
import "./overTimeReport.css";
import { todayDate } from "../../../../utility/todayDate";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";

const initData = {
  search: "",
  workplace: "",
  department: "",
  designation: "",
  employee: "",
  fromDate: "",
  toDate: "",
};

export default function OverTimeReport() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
  }, []);

  const [loading, setLoading] = useState(false);

  // row data
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);
  const [isFilter, setIsFilter] = useState(false);

  // filter
  const [viewOrder, setViewOrder] = useState("desc");
  const [salaryOrder, setSalaryOrder] = useState("desc");

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

  const { buId, employeeId, fullname, designationId, designationName } = useSelector((state) => state?.auth?.profileData, shallowEqual);

  // date
  let date = new Date();
  const monthOfSatrtDate = `${date.getFullYear()}/${date.getMonth() + 1}/1`;
  const monthOfEndDate = todayDate();

  // ascending & descending
  const commonSortByFilter = (filterType, property) => {
    const newRowData = [...allData];
    let modifyRowData = [];

    if (filterType === "asc") {
      modifyRowData = newRowData?.sort((a, b) => {
        if (a[property] > b[property]) return -1;
        return 1;
      });
    } else {
      modifyRowData = newRowData?.sort((a, b) => {
        if (b[property] > a[property]) return -1;
        return 1;
      });
    }
    setRowDto(modifyRowData);
  };

  useEffect(() => {
    getOvertimeReportLanding("CalculatedHistoryReportForAllEmployee", buId, 0, 0, 0, 0, monthOfSatrtDate, monthOfEndDate, setAllData, setRowDto, setLoading, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId]);

  const saveHandler = (values) => {};

  // masterHandler
  const masterFilterHandler = (values, resetForm, initData) => {
    const callback = () => {
      resetForm(initData);
    };
    getOvertimeReportLanding(
      "CalculatedHistoryReportForAllEmployee",
      buId,
      values?.workplace?.value || 0,
      values?.department?.value || 0,
      values?.designation?.value || 0,
      values?.employee?.value || 0,
      values?.fromDate || monthOfSatrtDate,
      values?.toDate || monthOfEndDate,
      setAllData,
      setRowDto,
      setLoading,
      callback
    );
    setAnchorEl(null);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          employee: { value: employeeId, label: fullname },
          designation: { value: designationId, label: designationName },
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({ handleSubmit, resetForm, values, errors, touched, setFieldValue, isValid }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              <div className="table-card">
                <div className="table-card-heading">
                  <div>
                    <Tooltip title="Export CSV" arrow>
                      <button
                        type="button"
                        className="btn-save "
                        style={{
                          border: "transparent",
                          width: "30px",
                          height: "30px",
                          background: "#f2f2f7",
                          borderRadius: "100px",
                        }}
                        onClick={() => {
                          downloadFile(
                            `/emp/PdfAndExcelReport/OvertimeReportExportAsExcel?PartType=${"CalculatedHistoryReportForAllEmployee"}&BusinessUnitId=${buId}&WorkplaceGroupId=${
                              values?.workplace?.value || 0
                            }&WorkplaceId=0&DepartmentId=${values?.department?.value || 0}&DesignationId=${values?.designation?.value || 0}&EmployeeId=${
                              values?.employee?.value || 0
                            }&FromDate=${values?.fromDate || monthOfSatrtDate}&ToDate=${values?.toDate || monthOfEndDate}`,
                            "Overtime Report",
                            "xlsx",
                            setLoading
                          );
                        }}
                      >
                        <SaveAlt sx={{ color: "#637381", fontSize: "16px" }} />
                      </button>
                    </Tooltip>
                  </div>
                  <div className="table-card-head-right">
                    <ul>
                      {isFilter && (
                        <li>
                          <ResetButton
                            title="reset"
                            icon={<SettingsBackupRestoreOutlined sx={{ marginRight: "10px" }} />}
                            onClick={() => {
                              getOvertimeReportLanding(
                                "CalculatedHistoryReportForAllEmployee",
                                buId,
                                0,
                                0,
                                0,
                                0,
                                monthOfSatrtDate,
                                monthOfEndDate,
                                setAllData,
                                setRowDto,
                                setLoading,
                                resetForm(initData)
                              );
                              setRowDto(allData);
                              resetForm(initData);
                              setIsFilter(false);
                            }}
                          />
                        </li>
                      )}
                      <li>
                        <MasterFilter
                          width="200px"
                          inputWidth="200px"
                          value={values?.search}
                          setValue={(value) => {
                            filterData(value, allData, setRowDto);
                            setFieldValue("search", value);
                          }}
                          cancelHandler={() => {
                            getOvertimeReportLanding(
                              "CalculatedHistoryReportForAllEmployee",
                              buId,
                              0,
                              0,
                              0,
                              0,
                              monthOfSatrtDate,
                              monthOfEndDate,
                              setAllData,
                              setRowDto,
                              setLoading,
                              resetForm(initData)
                            );
                            resetForm(initData);
                          }}
                          handleClick={handleClick}
                        />
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="table-card-body">
                  <div className="table-card-styled tableOne">
                    {rowDto?.length > 0 ? (
                      <>
                        <table className="table">
                          <thead>
                            <tr>
                              <th>
                                <div
                                  className="sortable"
                                  onClick={() => {
                                    setViewOrder(viewOrder === "desc" ? "asc" : "desc");
                                    commonSortByFilter(viewOrder, "employee");
                                  }}
                                >
                                  <span>Employee</span>
                                  <div>
                                    <SortingIcon viewOrder={viewOrder}></SortingIcon>
                                  </div>
                                </div>
                              </th>
                              <th>
                                <div className="sortable">
                                  <span>Designation</span>
                                </div>
                              </th>
                              <th>
                                <div className="sortable">
                                  <span>Department</span>
                                </div>
                              </th>
                              <th>
                                <div className="sortable">
                                  <span>Employment Type</span>
                                </div>
                              </th>
                              <th>
                                <div
                                  className="sortable justify-content-center"
                                  onClick={() => {
                                    setSalaryOrder(salaryOrder === "desc" ? "asc" : "desc");
                                    commonSortByFilter(salaryOrder, "salary");
                                  }}
                                >
                                  <span>Salary</span>
                                  <div>
                                    <SortingIcon viewOrder={salaryOrder}></SortingIcon>
                                  </div>
                                </div>
                              </th>
                              <th>
                                <div className="sortable justify-content-center">
                                  <span>Basic</span>
                                </div>
                              </th>
                              <th>
                                <div className="sortable justify-content-center">
                                  <span>Hour</span>
                                </div>
                              </th>
                              <th>
                                <div className="sortable justify-content-center">
                                  <span>Hour Amount Rate</span>
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {rowDto?.map(
                              (item, index) =>
                                item?.employeeId === employeeId && (
                                  <tr key={index}>
                                    <OverTimeReportTableItem item={item} index={index} />
                                  </tr>
                                )
                            )}
                          </tbody>
                        </table>
                      </>
                    ) : (
                      <>{!loading && <NoResult title="No Result Found" para="" />}</>
                    )}
                  </div>
                </div>
              </div>

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
                  masterFilterHandler,
                  setIsFilter,
                  resetForm,
                  initData,
                }}
              />
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
