import { SaveAlt, SettingsBackupRestoreOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import AntScrollTable from "../../../../common/AntScrollTable";
import FormikInput from "../../../../common/FormikInput";
import Loading from "../../../../common/loading/Loading";
import MasterFilter from "../../../../common/MasterFilter";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import ResetButton from "../../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { gray600 } from "../../../../utility/customColor";
import { getDateOfYear } from "../../../../utility/dateFormatter";
import { getPDFAction } from "../../../../utility/downloadFile";
import {
  getBuDetails,
  getEmployeeSeparationLanding,
  searchData,
} from "../helper";
import FilterModal from "./component/FilterModal";
import { generateExcelAction } from "./excel/excelConvert";
import { empSeparationCol } from "./helper";
import { paginationSize } from "../../../../common/AntTable";
import NoResult from "../../../../common/NoResult";

const initData = {
  search: "",
  separationType: "",
  department: "",
  employee: "",
  movementFromDate: "",
  movementToDate: "",
  workplace: "",
  designation: "",
  appStatus: "",
  filterFromDate: getDateOfYear("first"),
  filterToDate: getDateOfYear("last"),
};

const SeparationReport = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { buId, orgId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const saveHandler = (values) => {};
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [rowDto, setRowDto] = useState([]);
  const [buDetails, setBuDetails] = useState({});
  const [allData, setAllData] = useState([]);
  const [isFilter, setIsFilter] = useState(false);
  const [tableRowDto, setTableRowDto] = useState([]);
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

  const handleTableChange = (
    fromDate,
    toDate,
    pagination,
    newRowDto,
    srcText
  ) => {
    if (newRowDto?.action === "filter") {
      return;
    }
    if (
      pages?.current === pagination?.current &&
      pages?.pageSize !== pagination?.pageSize
    ) {
      return getData(fromDate, toDate, srcText, pagination);
    }
    if (pages?.current !== pagination?.current) {
      return getData(fromDate, toDate, srcText, pagination);
    }
  };

  const getData = (
    fromDate,
    toDate,
    srcText = "",
    pages = { current: 1, pageSize: paginationSize }
  ) => {
    getEmployeeSeparationLanding({
      status: null,
      depId: null,
      desId: null,
      supId: null,
      emTypId: null,
      empId: null,
      workId: wgId,
      buId,
      orgId,
      setter: setRowDto,
      setLoading,
      separationTypeId: null,
      setAllData,
      tableName: "EmployeeSeparationListForReport",
      setTableRowDto,
      fromDate: fromDate || getDateOfYear("first"),
      toDate: toDate || getDateOfYear("last"),
      searchTxt: srcText,
      pages,
      setPages,
    });
    getBuDetails(buId, setBuDetails, setLoading);
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
  const { buName } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 96) {
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
              <div className="separation-approval-wrapper">
                {permission?.isView ? (
                  <div className="table-card">
                    <div className="table-card-heading">
                      <div className="d-flex">
                        <Tooltip title="Export CSV" arrow>
                          <div
                            type="button"
                            className="btn-save "
                            onClick={(e) => {
                              e.stopPropagation();
                              generateExcelAction(
                                "Separation Report",
                                "",
                                "",
                                buName,
                                tableRowDto?.data,
                                buDetails?.strBusinessUnitAddress
                              );
                            }}
                            style={{ cursor: "pointer" }}
                            disabled={tableRowDto?.data?.length <= 0}
                          >
                            <SaveAlt
                              sx={{ color: gray600, fontSize: "16px" }}
                            />
                          </div>
                        </Tooltip>
                      </div>
                      <div className="table-card-head-right">
                        <ul className="d-flex flex-wrap">
                          {isFilter && (
                            <li>
                              <ResetButton
                                title="reset"
                                icon={
                                  <SettingsBackupRestoreOutlined
                                    sx={{ marginRight: "10px" }}
                                  />
                                }
                                onClick={() => {
                                  setIsFilter(false);
                                  getData();
                                }}
                              />
                            </li>
                          )}
                          <li>
                            <MasterFilter
                              width="200px"
                              inputWidth="200px"
                              value={values?.search}
                              isHiddenFilter
                              styles={{ marginRight: "0px !important" }}
                              setValue={(value) => {
                                setFieldValue("search", value);
                                searchData(
                                  value,
                                  allData,
                                  setRowDto,
                                  setLoading
                                );
                              }}
                              cancelHandler={() => {
                                setFieldValue("search", "");
                                getData();
                              }}
                              handleClick={handleClick}
                            />
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="table-card-body">
                      {/* <CardTable
                        propsObj={{
                          setFieldValue,
                          values,
                          setLoading,
                          rowDto,
                          setRowDto,
                        }}
                      /> */}
                      <div className="card-style my-2">
                        <div className="row">
                          <div className="col-lg-3">
                            <div className="input-field-main">
                              <label>From Date</label>
                              <FormikInput
                                classes="input-sm"
                                value={values?.filterFromDate}
                                placeholder=""
                                name="filterFromDate"
                                type="date"
                                className="form-control"
                                onChange={(e) => {
                                  setFieldValue(
                                    "filterFromDate",
                                    e.target.value
                                  );
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-lg-3">
                            <div className="input-field-main">
                              <label>To Date</label>
                              <FormikInput
                                classes="input-sm"
                                value={values?.filterToDate}
                                placeholder="Month"
                                name="filterToDate"
                                type="date"
                                className="form-control"
                                onChange={(e) => {
                                  setFieldValue("filterToDate", e.target.value);
                                }}
                              />
                            </div>
                          </div>

                          <div className="col-lg-1">
                            <button
                              disabled={
                                !values?.filterToDate || !values?.filterFromDate
                              }
                              style={{ marginTop: "21px" }}
                              className="btn btn-green"
                              onClick={() => {
                                getData(
                                  values?.filterFromDate,
                                  values?.filterToDate,
                                  values?.search,
                                  pages
                                );
                              }}
                            >
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="table-card-styled employee-table-card table-responsive ant-scrolling-Table">
                        {rowDto?.length > 0 ? (
                          <AntScrollTable
                            data={rowDto}
                            columnsData={empSeparationCol(pages)}
                            onRowClick={(data) => {
                              getPDFAction(
                                `/PdfAndExcelReport/SeparationReportByEmployee?EmployeeId=${data?.EmployeeId}`,
                                setLoading
                              );
                            }}
                            setColumnsData={(newRow) =>
                              setTableRowDto((prev) => ({
                                ...prev,
                                data: newRow,
                                totalCount: newRow?.length,
                              }))
                            }
                            handleTableChange={({ pagination, newRowDto }) =>
                              handleTableChange(
                                values.filterFromDate,
                                values.filterToDate,
                                pagination,
                                newRowDto,
                                values?.search || ""
                              )
                            }
                            pages={pages?.pageSize}
                            pagination={pages}
                          />
                        ) : (
                          !loading && <NoResult />
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <NotPermittedPage />
                )}
              </div>
              <FilterModal
                propsObj={{
                  id,
                  open,
                  anchorEl,
                  handleClose,
                  setRowDto,
                  setIsFilter,
                  initData,
                  values,
                  resetForm,
                  errors,
                  touched,
                  setFieldValue,
                }}
              ></FilterModal>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default SeparationReport;
