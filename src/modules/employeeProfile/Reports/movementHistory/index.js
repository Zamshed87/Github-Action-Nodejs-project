import { SaveAlt, SettingsBackupRestoreOutlined } from "@mui/icons-material";
import PrintIcon from "@mui/icons-material/Print";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
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
import FilterModal from "./component/FilterModal";
import { generateExcelAction } from "./excel/excelConvert";
import { getBuDetails, getMovementHistory } from "./helper";
import PeopleDeskTable, {
  paginationSize,
} from "./../../../../common/peopleDeskTable/index";

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
  // hook
  const dispatch = useDispatch();

  // redux
  const { buId, wgId, buName } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 101) {
      permission = item;
    }
  });

  // state
  const [loading, setLoading] = useState(false);
  const [buDetails, setBuDetails] = useState([]);
  const [allValues, setAllValues] = useState(null);

  // modal
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  // landing data
  const [rowDto, setRowDto] = useState([]);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  const getData = (pagination, searchText) => {
    getMovementHistory(
      buId,
      wgId,
      initStartData,
      initEndDate,
      "",
      setRowDto,
      setLoading,
      pagination?.current,
      pagination?.pageSize,
      setPages,
      true
    );
  };

  const handleChangePage = (_, newPage, searchText) => {
    setPages((prev) => {
      return { ...prev, current: newPage };
    });

    getData({
      current: newPage,
      pageSize: pages?.pageSize,
      total: pages?.total,
    });
  };

  const handleChangeRowsPerPage = (event, searchText) => {
    setPages((prev) => {
      return { current: 1, total: pages?.total, pageSize: +event.target.value };
    });
    getData({
      current: 1,
      pageSize: +event.target.value,
      total: pages?.total,
    });
  };

  // initial
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getBuDetails(buId, setBuDetails, setLoading);
  }, [buId]);

  useEffect(() => {
    getMovementHistory(
      buId,
      wgId,
      initStartData,
      initEndDate,
      "",
      setRowDto,
      setLoading,
      1,
      paginationSize,
      setPages,
      true
    );
  }, [buId, wgId]);

  const columns = (page, paginationSize) => {
    return [
      {
        title: "SL",
        render: (_, index) => (page - 1) * paginationSize + index + 1,
        sort: false,
        filter: false,
        className: "text-center",
        width: 60,
      },
      {
        title: "Employee Id",
        dataIndex: "employeeCode",
        sort: true,
        filter: false,
        fieldType: "string",
      },
      {
        title: "Employee",
        dataIndex: "employeeName",
        render: (item) => (
          <div className="d-flex align-items-center">
            <AvatarComponent
              classess=""
              letterCount={1}
              label={item?.employeeName}
            />
            <span className="ml-2">{item?.employeeName}</span>
          </div>
        ),
        sort: true,
        filter: false,
        fieldType: "string",
      },
      {
        title: "Designation",
        dataIndex: "designationName",
        sort: true,
        filter: false,
        fieldType: "string",
      },
      {
        title: "Department",
        dataIndex: "departmentName",
        sort: true,
        filter: false,
        fieldType: "string",
      },
      {
        title: "Duration (Day)",
        dataIndex: "rawDuration",
        sort: true,
        filter: false,
        fieldType: "number",
      },
    ];
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
                                `/PdfAndExcelReport/MovementReport?BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&FromDate=${
                                  allValues?.fromDate || initStartData
                                }&ToDate=${
                                  allValues?.toDate || initEndDate
                                }&SearchText=${values?.search}`,
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
                        {values?.search && (
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
                                setFieldValue("search", "");
                                getMovementHistory(
                                  buId,
                                  wgId,
                                  values?.fromDate,
                                  values?.toDate,
                                  "",
                                  setRowDto,
                                  setLoading,
                                  1,
                                  paginationSize,
                                  setPages,
                                  true
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
                              setFieldValue("search", value);
                              getMovementHistory(
                                buId,
                                wgId,
                                values?.fromDate || "",
                                values?.toDate || "",
                                value || "",
                                setRowDto,
                                setLoading,
                                1,
                                paginationSize,
                                setPages,
                                true
                              );
                            }}
                            cancelHandler={() => {
                              setFieldValue("search", "");
                              getMovementHistory(
                                buId,
                                wgId,
                                values?.fromDate || "",
                                values?.toDate || "",
                                "",
                                setRowDto,
                                setLoading,
                                1,
                                paginationSize,
                                setPages,
                                true
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
                                getMovementHistory(
                                  buId,
                                  wgId,
                                  values?.fromDate || "",
                                  values?.toDate || "",
                                  "",
                                  setRowDto,
                                  setLoading,
                                  1,
                                  paginationSize,
                                  setPages,
                                  true
                                );
                              }}
                            >
                              View
                            </button>
                          </div>
                        </div>
                      </div>

                      {rowDto?.length > 0 ? (
                        <PeopleDeskTable
                          customClass="iouManagementTable"
                          columnData={columns(pages?.current, pages?.pageSize)}
                          pages={pages}
                          rowDto={rowDto}
                          setRowDto={setRowDto}
                          handleChangePage={(e, newPage) =>
                            handleChangePage(e, newPage, values?.search)
                          }
                          handleChangeRowsPerPage={(e) =>
                            handleChangeRowsPerPage(e, values?.search)
                          }
                          uniqueKey="employeeCode"
                          isCheckBox={false}
                          isScrollAble={false}
                        />
                      ) : (
                        <>
                          <NoResult />
                        </>
                      )}
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
              // masterFilterHandler={masterFilterHandler}
            />
          </>
        )}
      </Formik>
    </>
  );
};

export default EmMovementHistory;
