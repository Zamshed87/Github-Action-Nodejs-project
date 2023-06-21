/* eslint-disable react-hooks/exhaustive-deps */
import { SaveAlt, SettingsBackupRestoreOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import FormikInput from "../../../../common/FormikInput";
import Loading from "../../../../common/loading/Loading";
import MasterFilter from "../../../../common/MasterFilter";
import NoResult from "../../../../common/NoResult";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import ResetButton from "../../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { monthFirstDate } from "../../../../utility/dateFormatter";
import { todayDate } from "../../../../utility/todayDate";
import { generateExcelAction } from "./excel/excelConvert";
import {
  empOverTimeDtoCol,
  getBuDetails,
  getOvertimeReportLanding,
} from "./helper";
import "./overTimeReport.css";
import PeopleDeskTable, {
  paginationSize,
} from "../../../../common/peopleDeskTable";
import useDebounce from "../../../../utility/customHooks/useDebounce";
import { toast } from "react-toastify";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";

const initData = {
  search: "",
  workplace: "",
  department: "",
  designation: "",
  employee: "",
  fromDate: monthFirstDate(),
  toDate: todayDate(),
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
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });
  const debounce = useDebounce();
  const [, getExcelData, apiLoading] = useAxiosGet();

  const { buId, buName, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

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
  const getData = (
    pagination = { current: 1, pageSize: paginationSize },
    srcTxt = "",
    fromDate,
    toDate,
    isPaginated = true
  ) => {
    getOvertimeReportLanding(
      "CalculatedHistoryReportForAllEmployee",
      buId,
      wgId,
      fromDate ? fromDate : monthFirstDate(),
      toDate ? toDate : todayDate(),
      setRowDto,
      setLoading,
      srcTxt,
      isPaginated,
      pagination?.current,
      pagination?.pageSize,
      setPages,
      pages
    );
  };
  useEffect(() => {
    getData();
    getBuDetails(buId, setBuDetails, setLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId]);

  const saveHandler = (values) => {};

  const handleChangePage = (_, newPage, searchText, fromDate, toDate) => {
    setPages((prev) => {
      return { ...prev, current: newPage };
    });

    getData(
      {
        current: newPage,
        pageSize: pages?.pageSize,
        total: pages?.total,
      },
      searchText,
      fromDate,
      toDate
    );
  };

  const handleChangeRowsPerPage = (event, searchText, fromDate, toDate) => {
    setPages((prev) => {
      return { current: 1, total: pages?.total, pageSize: +event.target.value };
    });
    getData(
      {
        current: 1,
        pageSize: +event.target.value,
        total: pages?.total,
      },
      searchText,
      fromDate,
      toDate
    );
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
              {(loading || apiLoading) && <Loading />}
              {permission?.isView ? (
                <div className="overtime-report">
                  <div className="table-card">
                    <div className="table-card-heading">
                      <div>
                        <Tooltip title="Export CSV" arrow>
                          <button
                            type="button"
                            className="btn-save"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (rowDto?.length <= 0) {
                                return toast.warning("Data is empty !!!!", {
                                  toastId: 1,
                                });
                              }

                              getExcelData(
                                `/Employee/OvertimeReportLanding?PartType=CalculatedHistoryReportForAllEmployee&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}&SearchText=${values?.search}&IsPaginated=false&PageNo=0&PageSize=0`,
                                (res) => {
                                  generateExcelAction(
                                    "Overtime Report",
                                    "",
                                    "",
                                    buName,
                                    res,
                                    buDetails?.strBusinessUnitAddress,
                                    total
                                  );
                                }
                              );
                              // rowDto?.length &&
                              //   generateExcelAction(
                              //     "Overtime Report",
                              //     "",
                              //     "",
                              //     buName,
                              //     tableRowDto?.data,
                              //     buDetails?.strBusinessUnitAddress,
                              //     total
                              //   );
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
                          {values?.search && (
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
                                  resetForm(initData);
                                  getData();
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
                                setFieldValue("search", value);
                                debounce(() => {
                                  getData(
                                    { current: 1, pageSize: paginationSize },
                                    value,
                                    values?.fromDate,
                                    values?.toDate
                                  );
                                }, 500);
                              }}
                              cancelHandler={() => {
                                setFieldValue("search", "");
                                getData(
                                  { current: 1, pageSize: paginationSize },
                                  "",
                                  values?.fromDate,
                                  values?.toDate
                                );
                              }}
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
                                getData(
                                  { current: 1, pageSize: paginationSize },
                                  values?.search,
                                  values?.fromDate,
                                  values?.toDate
                                );
                              }}
                            >
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="table-card-styled employee-table-card ant-scrolling-Table  table-responsive mt-3">
                        {rowDto?.length > 0 ? (
                          <PeopleDeskTable
                            columnData={empOverTimeDtoCol(
                              pages?.current,
                              pages?.pageSize
                            )}
                            pages={pages}
                            rowDto={rowDto}
                            setRowDto={setRowDto}
                            handleChangePage={(e, newPage) =>
                              handleChangePage(
                                e,
                                newPage,
                                values?.search,
                                values?.fromDate,
                                values?.toDate
                              )
                            }
                            handleChangeRowsPerPage={(e) =>
                              handleChangeRowsPerPage(
                                e,
                                values?.search,
                                values?.fromDate,
                                values?.toDate
                              )
                            }
                            uniqueKey="expenseId"
                            isCheckBox={false}
                            isScrollAble={false}
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

              {/* master filter */}
              {/* <PopOverFilter
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
              /> */}
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
