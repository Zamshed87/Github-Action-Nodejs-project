/* eslint-disable react-hooks/exhaustive-deps */
import {
  SaveAlt,
  SearchOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AntTable, { paginationSize } from "../../../common/AntTable";
import FormikInput from "../../../common/FormikInput";
import NoResult from "../../../common/NoResult";
import ResetButton from "../../../common/ResetButton";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { gray600 } from "../../../utility/customColor";
import { getDateOfYear } from "../../../utility/dateFormatter";
import Loading from "./../../../common/loading/Loading";
import {
  activeEmployeeHandler,
  column,
  getBuDetails,
  getInactiveEmployeesInfo,
  getTableDataInactiveEmployees,
  inactiveEmpColumns,
} from "./helper";
import "./inactiveEmployees.css";
import IConfirmModal from "../../../common/IConfirmModal";
import { createCommonExcelFile } from "../../../utility/customExcel/generateExcelAction";

const initData = {
  search: "",
  filterFromDate: getDateOfYear("first"),
  filterToDate: getDateOfYear("last"),
};

export default function ActiveInactiveEmployeeReport() {
  const dispatch = useDispatch();

  // eslint-disable-next-line no-unused-vars
  const { orgId, buId, buName, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });
  // sorting
  const [buDetails, setBuDetails] = useState({});

  const getData = (fromDate, toDate, pages, srcText) => {
    getInactiveEmployeesInfo(
      "InactiveEmployees",
      orgId,
      buId,
      "",
      setRowDto,
      setAllData,
      setLoading,
      "",
      fromDate ? fromDate : getDateOfYear("first"),
      toDate ? toDate : getDateOfYear("last"),
      wgId,
      srcText,
      pages,
      setPages
    );
  };

  useEffect(() => {
    getInactiveEmployeesInfo(
      "InactiveEmployees",
      orgId,
      buId,
      "",
      setRowDto,
      setAllData,
      setLoading,
      "",
      getDateOfYear("first"),
      getDateOfYear("last"),
      wgId,
      "",
      pages,
      setPages
    );
    getBuDetails(buId, setBuDetails, setLoading);
  }, []);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
  }, []);

  const handleTableChange = (pagination, newRowDto, srcText) => {
    if (newRowDto?.action === "filter") {
      return;
    }
    if (
      pages?.current === pagination?.current &&
      pages?.pageSize !== pagination?.pageSize
    ) {
      return getInactiveEmployeesInfo(
        "InactiveEmployees",
        orgId,
        buId,
        "",
        setRowDto,
        setAllData,
        setLoading,
        "",
        getDateOfYear("first"),
        getDateOfYear("last"),
        wgId,
        srcText,
        pagination,
        setPages
      );
    }
    if (pages?.current !== pagination?.current) {
      return getInactiveEmployeesInfo(
        "InactiveEmployees",
        orgId,
        buId,
        "",
        setRowDto,
        setAllData,
        setLoading,
        "",
        getDateOfYear("first"),
        getDateOfYear("last"),
        wgId,
        srcText,
        pagination,
        setPages
      );
    }
  };
  const saveHandler = (values) => {};

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 95) {
      permission = item;
    }
  });

  const activeUserHandler = (item, values) => {
    const paylaod = {
      intEmployeeId: item?.EmployeeId,
    };

    const callback = () => {
      getData(
        values?.filterFromDate,
        values?.filterToDate,
        { current: 1, pageSize: paginationSize },
        ""
      );
    };

    let confirmObject = {
      closeOnClickOutside: false,
      message: "Are you want to sure you active this employee?",
      yesAlertFunc: () => {
        activeEmployeeHandler(paylaod, setLoading, callback);
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  // // excel column set up
  // const excelColumnFunc = () => {
  //   return contractualExcelColumn;
  // };

  // // excel data set up
  // const excelDataFunc = () => {
  //   return contractualExcelData(rowDto);
  // };

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
        {({ handleSubmit, values, errors, touched, setFieldValue }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              {permission?.isView ? (
                <>
                  <div className="table-card">
                    <div
                      className="table-card-heading"
                      // style={{ marginBottom: "10px" }}
                    >
                      <div className="d-flex justify-content-center align-items-center">
                        <Tooltip title="Export CSV" arrow>
                          <div
                            className="btn-save"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (rowDto?.length <= 0) {
                                return toast.warning("Data is empty !!!!", {
                                  toastId: 1,
                                });
                              }
                              const newData = rowDto?.map((item, index) => {
                                return {
                                  ...item,
                                  sl: index + 1,
                                };
                              });
                              const excelLanding = () => {
                                createCommonExcelFile({
                                  titleWithDate: `Inactive Employees Report`,
                                  fromDate: "",
                                  toDate: "",
                                  buAddress: buDetails?.strBusinessUnitAddress,
                                  businessUnit: buName,
                                  tableHeader: column,
                                  getTableData: () =>
                                    getTableDataInactiveEmployees(
                                      newData,
                                      Object.keys(column)
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
                                    H: 25,
                                    I: 25,
                                    K: 20,
                                  },
                                  commonCellRange: "A1:J1",
                                  CellAlignment: "left",
                                });
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
                        <div className="ml-2">
                          {rowDto?.length > 0 ? (
                            <>
                              <h6 className="count">
                                Total {rowDto?.length} employees
                              </h6>
                            </>
                          ) : (
                            <>
                              <h6 className="count">Total result 0</h6>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="table-card-head-right">
                        <ul className="d-flex">
                          {values?.search && (
                            <li>
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
                                  setRowDto(allData);
                                  setFieldValue("search", "");
                                }}
                              />
                            </li>
                          )}
                          <li>
                            <FormikInput
                              classes="search-input fixed-width mr-0"
                              inputClasses="search-inner-input"
                              placeholder="Search"
                              value={values?.search}
                              name="search"
                              type="text"
                              trailicon={
                                <SearchOutlined sx={{ color: "#323232" }} />
                              }
                              onChange={(e) => {
                                // filterData(e.target.value, allData, setRowDto);
                                setFieldValue("search", e.target.value);
                                if (e.target.value) {
                                  getData(
                                    values?.filterFromDate,
                                    values?.filterToDate,
                                    { current: 1, pageSize: paginationSize },
                                    e.target.value
                                  );
                                } else {
                                  getData(
                                    values?.filterFromDate,
                                    values?.filterToDate,
                                    { current: 1, pageSize: paginationSize },
                                    ""
                                  );
                                }
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="table-card-styled employee-table-card tableOne  table-responsive">
                      <div className="card-style my-2">
                        <div className="row mb-3">
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
                                  pages,
                                  values?.search
                                );
                              }}
                            >
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                      {rowDto?.length > 0 ? (
                        <div className="" style={{ maxHeight: "500px" }}>
                          <AntTable
                            data={rowDto}
                            columnsData={inactiveEmpColumns(
                              pages.current,
                              pages.pageSize,
                              activeUserHandler,
                              values
                            )}
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
                      ) : (
                        <>
                          {!loading && (
                            <NoResult title="No Result Found" para="" />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <NotPermittedPage />
              )}
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
