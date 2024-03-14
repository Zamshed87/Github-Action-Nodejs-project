/* eslint-disable react-hooks/exhaustive-deps */
import { SaveAlt, SettingsBackupRestoreOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
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
  getNewInactiveEmpInfo,
  getTableDataInactiveEmployees,
  inactiveEmpColumns,
} from "./helper";
import "./inactiveEmployees.css";
import IConfirmModal from "../../../common/IConfirmModal";
import { createCommonExcelFile } from "../../../utility/customExcel/generateExcelAction";
import PeopleDeskTable, {
  paginationSize,
} from "../../../common/peopleDeskTable";
import MasterFilter from "../../../common/MasterFilter";
import useDebounce from "../../../utility/customHooks/useDebounce";
import useAxiosGet from "../../../utility/customHooks/useAxiosGet";
import { currentYear } from "modules/CompensationBenefits/reports/salaryReport/helper";
import { getCurrentMonthName } from "utility/monthIdToMonthName";
import { getPeopleDeskAllDDL, getWorkplaceDetails } from "common/api";
import FormikSelect from "common/FormikSelect";
import { customStyles } from "utility/selectCustomStyle";

const initData = {
  search: "",
  filterFromDate: getDateOfYear("first"),
  filterToDate: getDateOfYear("last"),
  workplace: "",
  workplaceGroup: "",
};

export default function ActiveInactiveEmployeeReport() {
  const dispatch = useDispatch();

  // eslint-disable-next-line no-unused-vars
  const { buId, buName, wgId, wId, wName, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
  const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState([]);
  const [workplaceDDL, setWorkplaceDDL] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });
  // sorting
  const [buDetails, setBuDetails] = useState({});
  const debounce = useDebounce();
  const [, getExcelData, apiLoading] = useAxiosGet();

  const getData = (
    wgId,
    wId,
    fromDate = getDateOfYear("first"),
    toDate = getDateOfYear("last"),
    pagination = { current: 1, pageSize: paginationSize },
    srcTxt = "",
    isExcel = false
  ) => {
    getNewInactiveEmpInfo({
      buId,
      wgId,
      isExcel,
      pageNo: pagination?.current,
      pageSize: pagination?.pageSize,
      srcTxt,
      setLoading,
      setter: setRowDto,
      setPages,
      fromDate,
      toDate,
      wId,
    });
  };

  useEffect(() => {
    getData(wgId, wId);
    getWorkplaceDetails(wId, setBuDetails);
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplaceGroup&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&intId=${employeeId}`,
      "intWorkplaceGroupId",
      "strWorkplaceGroup",
      setWorkplaceGroupDDL
    );
  }, [wId, wgId]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Inactive Employees";
  }, []);

  const saveHandler = (values) => {};

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 95) {
      permission = item;
    }
  });

  const activeUserHandler = (item, values) => {
    const paylaod = {
      intEmployeeId: item?.intEmployeeId,
    };

    const callback = () => {
      getData(
        values?.workplaceGroup?.value || wgId,
        values?.workplace?.value || wId,
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

  const handleChangePage = (
    _,
    newPage,
    searchText,
    fromDate,
    toDate,
    values
  ) => {
    setPages((prev) => {
      return { ...prev, current: newPage };
    });

    getData(
      values?.workplaceGroup?.value || wgId,
      values?.workplace?.value || wId,
      fromDate,
      toDate,
      {
        current: newPage,
        pageSize: pages?.pageSize,
        total: pages?.total,
      },
      searchText
    );
  };

  const handleChangeRowsPerPage = (
    event,
    searchText,
    fromDate,
    toDate,
    values
  ) => {
    setPages((prev) => {
      return { current: 1, total: pages?.total, pageSize: +event.target.value };
    });
    getData(
      values?.workplaceGroup?.value || wgId,
      values?.workplace?.value || wId,
      fromDate,
      toDate,
      {
        current: 1,
        pageSize: +event.target.value,
        total: pages?.total,
      },
      searchText
    );
  };

  return (
    <>
      {(loading || apiLoading) && <Loading />}
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
                              getExcelData(
                                `/Employee/GetInactiveEmployeeList?BusinessUnitId=${buId}&WorkplaceGroupId=${
                                  values?.workplaceGroup?.value || wgId
                                }&WorkplaceId=${
                                  values?.workplace?.value || wId
                                }&IsXls=true&PageNo=1&PageSize=10000&searchTxt=${
                                  values?.search
                                }&FromDate=${values?.filterFromDate}&ToDate=${
                                  values?.filterToDate
                                }`,
                                (res) => {
                                  const newData = res?.data?.map(
                                    (item, index) => {
                                      return {
                                        ...item,
                                        sl: index + 1,
                                      };
                                    }
                                  );
                                  const excelLanding = () => {
                                    createCommonExcelFile({
                                      titleWithDate: `Inactive Employee list for the month of ${getCurrentMonthName()}-${currentYear()}`,
                                      fromDate: values?.filterFromDate,
                                      toDate: values?.filterToDate,
                                      buAddress: buDetails?.strWorkplace,
                                      businessUnit: buDetails?.strAddress,
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
                                }
                              );
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            <SaveAlt
                              sx={{ color: gray600, fontSize: "16px" }}
                            />
                          </div>
                        </Tooltip>
                        <div className="ml-2">
                          {rowDto?.totalCount > 0 ? (
                            <>
                              <h6 className="count">
                                Total {rowDto?.totalCount} employees
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
                                  setFieldValue("search", "");
                                  getData();
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
                                    values?.filterFromDate,
                                    values?.filterToDate,
                                    { current: 1, pageSize: paginationSize },
                                    value
                                  );
                                }, 500);
                              }}
                              cancelHandler={() => {
                                setFieldValue("search", "");
                                getData(
                                  values?.filterFromDate,
                                  values?.filterToDate,
                                  { current: 1, pageSize: paginationSize }
                                );
                              }}
                            />
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="card-style my-2">
                      <div className="row mb-3">
                        <div className="col-lg-2">
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
                                setFieldValue("filterFromDate", e.target.value);
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-lg-2">
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
                        <div className="col-lg-3">
                          <div className="input-field-main">
                            <label>Workplace Group</label>
                            <FormikSelect
                              name="workplaceGroup"
                              options={[...workplaceGroupDDL] || []}
                              value={values?.workplaceGroup}
                              onChange={(valueOption) => {
                                setWorkplaceDDL([]);
                                setFieldValue("workplaceGroup", valueOption);
                                setFieldValue("workplace", "");
                                if (valueOption?.value) {
                                  getPeopleDeskAllDDL(
                                    `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&BusinessUnitId=${buId}&WorkplaceGroupId=${valueOption?.value}&intId=${employeeId}`,
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
                              options={[...workplaceDDL] || []}
                              value={values?.workplace}
                              onChange={(valueOption) => {
                                setFieldValue("workplace", valueOption);
                                getWorkplaceDetails(
                                  valueOption?.value,
                                  setBuDetails
                                );
                              }}
                              placeholder=""
                              styles={customStyles}
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
                                values?.workplaceGroup?.value || wgId,
                                values?.workplace?.value || wId,
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
                    {rowDto?.data?.length > 0 ? (
                      <PeopleDeskTable
                        columnData={inactiveEmpColumns(
                          pages?.current,
                          pages?.pageSize,
                          activeUserHandler,
                          values
                        )}
                        pages={pages}
                        rowDto={rowDto?.data}
                        setRowDto={setRowDto}
                        handleChangePage={(e, newPage) =>
                          handleChangePage(
                            e,
                            newPage,
                            values?.search,
                            values.filterFromDate,
                            values.filterToDate,
                            values
                          )
                        }
                        handleChangeRowsPerPage={(e) =>
                          handleChangeRowsPerPage(
                            e,
                            values?.search,
                            values.filterFromDate,
                            values.filterToDate,
                            values
                          )
                        }
                        uniqueKey="strEmployeeCode"
                        isCheckBox={false}
                        isScrollAble={true}
                      />
                    ) : (
                      <>
                        {!loading && (
                          <NoResult title="No Result Found" para="" />
                        )}
                      </>
                    )}
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
