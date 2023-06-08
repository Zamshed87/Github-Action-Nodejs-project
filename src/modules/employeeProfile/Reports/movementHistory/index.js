import { SaveAlt, SettingsBackupRestoreOutlined } from "@mui/icons-material";
import PrintIcon from "@mui/icons-material/Print";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import AntTable from "../../../../common/AntTable";
import AvatarComponent from "../../../../common/AvatarComponent";
import FormikInput from "../../../../common/FormikInput";
import Loading from "../../../../common/loading/Loading";
import MasterFilter from "../../../../common/MasterFilter";
import NoResult from "../../../../common/NoResult";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import ResetButton from "../../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { monthFirstDate } from "../../../../utility/dateFormatter";
import { getPDFAction } from "../../../../utility/downloadFile";
import { todayDate } from "../../../../utility/todayDate";
// import { downloadFile } from "../../../../utility/downloadFile";
import FilterModal from "./component/FilterModal";
import { generateExcelAction } from "./excel/excelConvert";
import { getBuDetails, getMovementHistory } from "./helper";

let initStartData = monthFirstDate();
let initEndDate = todayDate();

const initData = {
  search: "",

  // master Filter
  workplace: "",
  department: "",
  designation: "",
  employee: "",
  movementType: "",
  dateRange: "",
  appStatus: "",
  fromDate: monthFirstDate(),
  toDate: todayDate(),
};

const EmMovementHistory = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { orgId, buId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const saveHandler = (values) => {};
  const [loading, setLoading] = useState(false);

  const [allValues, setAllValues] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const [rowDto, setRowDto] = useState(null);
  const [allData, setAllData] = useState([]);
  const [buDetails, setBuDetails] = useState([]);

  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);

  useEffect(() => {
    getMovementHistory(
      buId,
      orgId,
      wgId,
      0,
      0,
      0,
      0,
      initStartData,
      initEndDate,
      "all",
      setRowDto,
      setLoading,
      setAllData
    );
    getBuDetails(buId, setBuDetails, setLoading);
  }, [orgId, buId, wgId]);

  const getData = (fromDate, toDate) => {
    getMovementHistory(
      buId,
      orgId,
      0,
      0,
      0,
      0,
      0,
      fromDate,
      toDate,
      "all",
      setRowDto,
      setLoading,
      setAllData
    );
  };

  const searchData = (keywords, allData, setRowDto) => {
    try {
      const regex = new RegExp(keywords?.toLowerCase());
      let newDta = allData?.filter((item) =>
        regex.test(item?.EmployeeName?.toLowerCase())
      );
      setRowDto(newDta);
    } catch {
      setRowDto([]);
    }
  };
  const masterFilterHandler = ({
    appStatus,
    department,
    designation,
    employee,
    movementType,
    workplace,
    fromDate,
    toDate,
  }) => {
    getMovementHistory(
      buId,
      orgId,
      workplace?.value || 0,
      department?.value || 0,
      designation?.value || 0,
      movementType?.value || 0,
      employee?.value || 0,
      fromDate || initStartData,
      toDate || initEndDate,
      appStatus?.label || "all",
      setRowDto,
      setLoading,
      setAllData
    );
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
  const { buName } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 101) {
      permission = item;
    }
  });

  const columns = (page, paginationSize) => {
    return [
      {
        title: "SL",
        render: (text, record, index) =>
          (page - 1) * paginationSize + index + 1,
        sorter: false,
        filter: false,
        className: "text-center",
      },
      {
        title: "Code",
        dataIndex: "employeeCode",
        sorter: true,
        filter: true,
      },
      {
        title: "Employee",
        dataIndex: "EmployeeName",
        render: (strEmployeeName) => (
          <div className="d-flex align-items-center">
            <AvatarComponent
              classess=""
              letterCount={1}
              label={strEmployeeName}
            />
            <span className="ml-2">{strEmployeeName}</span>
          </div>
        ),
        sorter: true,
        filter: true,
      },
      {
        title: "Designation",
        dataIndex: "DesignationName",
        sorter: true,
        filter: true,
      },
      {
        title: "Department",
        dataIndex: "DepartmentName",
        sorter: true,
        filter: true,
      },
      {
        title: "Duration (Day)",
        dataIndex: "Duration",
        sorter: true,
        filter: true,
        isNumber: true,
      },
    ];
  };

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
                <div className="loan-application">
                  <div className="table-card">
                    <div className="table-card-heading">
                      <div className="d-flex">
                        <Tooltip title="Export CSV" arrow>
                          <button
                            type="button"
                            className="btn-save "
                            onClick={() => {
                              // downloadFile(
                              //   `/PdfAndExcelReport/MovementReportExportAsExcel?AccountId=${orgId}&BusinessUnitId=${buId}&WorkplaceGroupId=${
                              //     allValues?.workplace?.value || 0
                              //   }&DeptId=${
                              //     allValues?.department?.value || 0
                              //   }&DesigId=${
                              //     allValues?.designation?.value || 0
                              //   }&MovementTypeId=${
                              //     allValues?.movementType?.value || 0
                              //   }&EmployeeId=${
                              //     allValues?.employee?.value || 0
                              //   }&FromDate=${
                              //     allValues?.fromDate || initStartData
                              //   }&ToDate=${
                              //     allValues?.toDate || initEndDate
                              //   }&applicationStatus=${
                              //     allValues?.appStatus?.label || "all"
                              //   }`,
                              //   "Movement History",
                              //   "xlsx",
                              //   setLoading
                              // );
                              generateExcelAction(
                                "Movement Report",
                                "",
                                "",
                                buName,
                                rowDto,
                                buDetails?.strBusinessUnitAddress
                              );
                            }}
                          >
                            <SaveAlt
                              sx={{ color: "#637381", fontSize: "16px" }}
                            />
                          </button>
                        </Tooltip>
                        <Tooltip title="Print" arrow>
                          <button
                            className="btn-save ml-3"
                            type="button"
                            onClick={(e) => {
                              getPDFAction(
                                `/PdfAndExcelReport/MovementReport?BusinessUnitId=${buId}&AccountId=${orgId}&WorkplaceGroupId=${
                                  allValues?.workplace?.value || 0
                                }&DeptId=${
                                  allValues?.department?.value || 0
                                }&DesigId=${
                                  allValues?.designation?.value || 0
                                }&MovementTypeId=${
                                  allValues?.movementType?.value || 0
                                }&EmployeeId=${
                                  allValues?.employee?.value || 0
                                }&FromDate=${
                                  allValues?.fromDate || initStartData
                                }&ToDate=${
                                  allValues?.toDate || initEndDate
                                }&applicationStatus=${
                                  allValues?.appStatus?.label || "all"
                                }`,
                                setLoading
                              );
                            }}
                          >
                            <PrintIcon
                              sx={{ color: "#637381", fontSize: "16px" }}
                            />
                          </button>
                        </Tooltip>
                      </div>
                      <ul className="d-flex flex-wrap">
                        {(values?.search ||
                          values?.workplace ||
                          values?.department ||
                          values?.designation ||
                          values?.employee ||
                          values?.movementType ||
                          values?.dateRange ||
                          values?.appStatus ||
                          values?.search) && (
                          <li className="mr-2">
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
                                setAllValues(null);
                                setFieldValue("workplace", "");
                                setFieldValue("department", "");
                                setFieldValue("designation", "");
                                setFieldValue("employee", "");
                                setFieldValue("movementType", "");
                                setFieldValue("dateRange", "");
                                setFieldValue("appStatus", "");
                                setFieldValue("search", "");
                                getMovementHistory(
                                  buId,
                                  orgId,
                                  0,
                                  0,
                                  0,
                                  0,
                                  0,
                                  initStartData,
                                  initEndDate,
                                  "all",
                                  setRowDto,
                                  setLoading,
                                  setAllData
                                );
                              }}
                            />
                          </li>
                        )}
                        <li>
                          <MasterFilter
                            isHiddenFilter={true}
                            width="200px"
                            inputWidth="200px"
                            value={values?.search}
                            setValue={(value) => {
                              searchData(value, allData, setRowDto);
                              setFieldValue("search", value);
                            }}
                            cancelHandler={() => {
                              setFieldValue("search", "");
                              getMovementHistory(
                                buId,
                                orgId,
                                0,
                                0,
                                0,
                                0,
                                0,
                                initStartData,
                                initEndDate,
                                "all",
                                setRowDto,
                                setLoading,
                                setAllData
                              );
                            }}
                            handleClick={handleClick}
                          />
                        </li>
                      </ul>
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

                      <div className="table-card-styled tableOne">
                        {rowDto?.length > 0 ? (
                          <AntTable
                            data={rowDto?.length > 0 && rowDto}
                            columnsData={columns(page, paginationSize)}
                            setPage={setPage}
                            setPaginationSize={setPaginationSize}
                          />
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
            </Form>
            <FilterModal
              propsObj={{
                id,
                open,
                anchorEl,
                setAnchorEl,
                handleClose,
                setFieldValue,
                values,
                errors,
                touched,
              }}
              setAllValues={setAllValues}
              masterFilterHandler={masterFilterHandler}
            />
          </>
        )}
      </Formik>
    </>
  );
};

export default EmMovementHistory;
