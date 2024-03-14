/* eslint-disable react-hooks/exhaustive-deps */
import {
  SaveAlt,
  SearchOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AntScrollTable from "../../../common/AntScrollTable";
import { paginationSize } from "../../../common/AntTable";
import FormikInput from "../../../common/FormikInput";
import NoResult from "../../../common/NoResult";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import ResetButton from "../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { gray600 } from "../../../utility/customColor";
import Loading from "./../../../common/loading/Loading";

import {
  column,
  getBuDetails,
  getJobConfirmationInfo,
  getTableDataConfirmation,
  jobConfirmColumns,
} from "./helper";
import "./jobConfirmation.css";
import { createCommonExcelFile } from "../../../utility/customExcel/generateExcelAction";
import DefaultInput from "common/DefaultInput";
import { monthFirstDate, monthLastDate } from "utility/dateFormatter";
import { getPeopleDeskAllDDL, getWorkplaceDetails } from "common/api";
import FormikSelect from "common/FormikSelect";
import { customStyles } from "utility/selectCustomStyle";

const initData = {
  search: "",
  monthYear: moment().format("YYYY-MM"),
  // monthId: new Date().getMonth() + 1,
  // yearId: new Date().getFullYear(),
  fromDate: monthFirstDate(),
  toDate: monthLastDate(),
  workplace: "",
  workplaceGroup: "",
};

export default function JobConfirmationReport() {
  // redux

  const dispatch = useDispatch();
  // eslint-disable-next-line no-unused-vars
  const {
    intAccountId,
    intBusinessUnitId,
    buName,
    buId,
    wgId,
    wId,
    employeeId,
  } = useSelector((state) => state?.auth?.profileData, shallowEqual);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
  // hooks
  const [loading, setLoading] = useState(false);
  const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState([]);
  const [workplaceDDL, setWorkplaceDDL] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);
  const [buDetails, setBuDetails] = useState({});
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  useEffect(() => {
    getBuDetails(intBusinessUnitId, setBuDetails);
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplaceGroup&BusinessUnitId=${intBusinessUnitId}&WorkplaceGroupId=${wgId}&intId=${employeeId}`,
      "intWorkplaceGroupId",
      "strWorkplaceGroup",
      setWorkplaceGroupDDL
    );
  }, [intBusinessUnitId, wgId]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Need Confirmation";
  }, []);

  useEffect(() => {
    getJobConfirmationInfo(
      "EmployeeBasicForJobConfirmationReport",
      intAccountId,
      intBusinessUnitId,
      "",
      monthFirstDate(),
      monthLastDate(),
      setRowDto,
      setAllData,
      setLoading,
      2,
      wgId,
      "",
      pages,
      setPages,
      wId
    );
  }, [wgId, wId]);

  const handleTableChange = (pagination, newRowDto, srcText, values) => {
    if (newRowDto?.action === "filter") {
      return;
    }
    if (
      pages?.current === pagination?.current &&
      pages?.pageSize !== pagination?.pageSize
    ) {
      return getJobConfirmationInfo(
        "EmployeeBasicForJobConfirmationReport",
        intAccountId,
        intBusinessUnitId,
        "",
        monthFirstDate(),
        monthLastDate(),
        setRowDto,
        setAllData,
        setLoading,
        2,
        values?.workplaceGroup?.value || wgId,
        srcText,
        pagination,
        setPages,
        values?.workplace?.value || wId
      );
    }
    if (pages?.current !== pagination?.current) {
      return getJobConfirmationInfo(
        "EmployeeBasicForJobConfirmationReport",
        intAccountId,
        intBusinessUnitId,
        "",
        monthFirstDate(),
        monthLastDate(),
        setRowDto,
        setAllData,
        setLoading,
        2,
        values?.workplaceGroup?.value || wgId,
        srcText,
        pagination,
        setPages,
        values?.workplace?.value || wId
      );
    }
  };

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 94) {
      permission = item;
    }
  });

  // // excel column set up
  // const excelColumnFunc = () => {
  //   return jobConfirmationExcelColumn;
  // };

  // // excel data set up
  // const excelDataFunc = () => {
  //   return jobConfirmationExcelData(rowDto);
  // };

  return (
    <>
      <Formik enableReinitialize={true} initialValues={initData}>
        {({
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
          setValues,
        }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              {permission?.isView ? (
                <div className="table-card">
                  <div
                    className="table-card-heading"
                    style={{ marginBottom: "10px" }}
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
                                titleWithDate: `Job Confirmation`,
                                fromDate: "",
                                toDate: "",
                                buAddress: buDetails?.strBusinessUnitAddress,
                                businessUnit: buName,
                                tableHeader: column,
                                getTableData: () =>
                                  getTableDataConfirmation(
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
                                  H: 15,
                                  I: 15,
                                  J: 20,
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
                          <SaveAlt sx={{ color: gray600, fontSize: "16px" }} />
                        </div>
                      </Tooltip>

                      {/* <div className="input-field-main pt-1">
                        <FormikInput
                          classes="input-sm month-picker"
                          value={values?.monthYear}
                          name="monthYear"
                          type="month"
                          className="form-control"
                          onChange={(e) => {
                            setValues((prev) => ({
                              ...prev,
                              yearId: +e.target.value
                                .split("")
                                .slice(0, 4)
                                .join(""),
                              monthId: +e.target.value
                                .split("")
                                .slice(-2)
                                .join(""),
                              monthYear: e.target.value,
                              adviceName: "",
                            }));
                            getJobConfirmationInfo(
                              "EmployeeBasicForJobConfirmationReport",
                              intAccountId,
                              intBusinessUnitId,
                              "",
                              +e.target.value.split("").slice(-2).join(""),
                              +e.target.value.split("").slice(0, 4).join(""),
                              setRowDto,
                              setAllData,
                              setLoading,
                              2,
                              wgId,
                              "",
                              pages,
                              setPages,
                              wId
                            );
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div> */}
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
                                  sx={{ marginRight: "10px", fontSize: "16px" }}
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
                                getJobConfirmationInfo(
                                  "EmployeeBasicForJobConfirmationReport",
                                  intAccountId,
                                  intBusinessUnitId,
                                  "",
                                  values?.fromDate,
                                  values?.toDate,
                                  setRowDto,
                                  setAllData,
                                  setLoading,
                                  2,
                                  values?.workplaceGroup?.value || wgId,
                                  e.target.value,
                                  { current: 1, pageSize: paginationSize },
                                  setPages,
                                  values?.workplace?.value || wId
                                );
                              } else {
                                getJobConfirmationInfo(
                                  "EmployeeBasicForJobConfirmationReport",
                                  intAccountId,
                                  intBusinessUnitId,
                                  "",
                                  values?.fromDate,
                                  values?.toDate,
                                  setRowDto,
                                  setAllData,
                                  setLoading,
                                  2,
                                  values?.workplaceGroup?.value || wgId,
                                  "",
                                  { current: 1, pageSize: paginationSize },
                                  setPages,
                                  values?.workplace?.value || wId
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
                  <div
                    className="card-style "
                    style={{ margin: "14px 0px 12px 0px" }}
                  >
                    <div className="row">
                      {/* bu */}
                      <div className="col-lg-2">
                        <div className="input-field-main">
                          <label>From Date</label>
                          <DefaultInput
                            classes="input-sm"
                            placeholder=""
                            value={values?.fromDate}
                            name="fromDate"
                            type="date"
                            onChange={(e) => {
                              setFieldValue("fromDate", e.target.value);
                            }}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                      <div className="col-lg-2">
                        <div className="input-field-main">
                          <label>To Date</label>
                          <DefaultInput
                            classes="input-sm"
                            placeholder=""
                            value={values?.toDate}
                            name="toDate"
                            type="date"
                            onChange={(e) => {
                              setFieldValue("toDate", e.target.value);
                            }}
                            errors={errors}
                            touched={touched}
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
                          style={{ marginTop: "21px" }}
                          className="btn btn-green"
                          onClick={() => {
                            getJobConfirmationInfo(
                              "EmployeeBasicForJobConfirmationReport",
                              intAccountId,
                              intBusinessUnitId,
                              "",
                              values?.fromDate,
                              values?.toDate,
                              setRowDto,
                              setAllData,
                              setLoading,
                              2,
                              values?.workplaceGroup?.value || wgId,
                              "",
                              pages,
                              setPages,
                              values?.workplace?.value || wId
                            );
                          }}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                  {rowDto?.length > 0 ? (
                    <div className="table-card-styled employee-table-card table-responsive ant-scrolling-Table">
                      <AntScrollTable
                        data={rowDto}
                        columnsData={jobConfirmColumns(
                          pages.current,
                          pages.pageSize
                        )}
                        handleTableChange={({ pagination, newRowDto }) =>
                          handleTableChange(
                            pagination,
                            newRowDto,
                            values?.search || "",
                            values
                          )
                        }
                        pages={pages?.pageSize}
                        pagination={pages}
                      />
                    </div>
                  ) : (
                    <>
                      {!loading && <NoResult title="No Result Found" para="" />}
                    </>
                  )}
                </div>
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

// prev table code
/*      <ScrollableTable
                        classes="salary-process-table"
                        secondClasses="table-card-styled tableOne scroll-table-height"
                      >
                        <thead>
                          <tr>
                            <th style={{ width: "30px" }}>
                              <div>SL</div>
                            </th>
                            <th>
                              <div>Code</div>
                            </th>
                            <th 
                             className="fixed-column"
                             style={{ left: "125px" }}>
                              <div
                                className="d-flex align-items-center pointer"
                                onClick={() => {
                                  setEmployeeOrder(
                                    employeeOrder === "desc" ? "asc" : "desc"
                                  );
                                  commonSortByFilter(
                                    employeeOrder,
                                    "EmployeeName"
                                  );
                                }}
                              >
                                Employee Name
                                <div>
                                  <SortingIcon
                                    viewOrder={employeeOrder}
                                  ></SortingIcon>
                                </div>
                              </div>
                            </th>
                            <th>Employment Type</th>
                            <th>
                              <div
                                className="d-flex align-items-center pointer"
                                onClick={() => {
                                  setDepartment(
                                    department === "desc" ? "asc" : "desc"
                                  );
                                  commonSortByFilter(
                                    department,
                                    "DepartmentName"
                                  );
                                }}
                              >
                                Department
                                <div>
                                  <SortingIcon
                                    viewOrder={department}
                                  ></SortingIcon>
                                </div>
                              </div>
                            </th>
                            <th>
                              <div
                                className="d-flex align-items-center pointer"
                                onClick={() => {
                                  setDesignation(
                                    designation === "desc" ? "asc" : "desc"
                                  );
                                  commonSortByFilter(
                                    designation,
                                    "DesignationName"
                                  );
                                }}
                              >
                                Designation
                                <div>
                                  <SortingIcon
                                    viewOrder={designation}
                                  ></SortingIcon>
                                </div>
                              </div>
                            </th>
                            <th>Supervisor Name</th>
                            <th>Joining date</th>
                            <th>Service Length</th>
                            <th>Confirmation Date</th>
                            <th>Probation Close Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowDto?.map((item, i) => (
                            <tr key={i}>
                              <td>
                                <div className="tableBody-title">{i + 1}</div>
                              </td>
                              <td>
                                <div className="tableBody-title">
                                  {item?.EmployeeCode}
                                </div>
                              </td>
                              <td
                               className="fixed-column"
                               style={{ left: "125px",verticalAlign: "middle" }}
                              >
                                <div className="employeeInfo d-flex align-items-center">
                                  <div className="pr-2">
                                    <AvatarComponent
                                      letterCount={1}
                                      label={item?.EmployeeName}
                                    />
                                  </div>

                                  <div className="tableBody-title">
                                    {item?.EmployeeName}
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="tableBody-title">
                                  {item?.strEmploymentType}
                                </div>
                              </td>
                              <td style={{ verticalAlign: "middle" }}>
                                <div className="tableBody-title">
                                  {item?.DepartmentName}
                                </div>
                              </td>
                              <td style={{ verticalAlign: "middle" }}>
                                <div className="tableBody-title">
                                  {item?.DesignationName}
                                </div>
                              </td>
                              <td style={{ verticalAlign: "middle" }}>
                                <div className="tableBody-title">
                                  {item?.SupervisorName}
                                </div>
                              </td>
                              <td style={{ verticalAlign: "middle" }}>
                                <div className="tableBody-title">
                                  {dateFormatter(item?.JoiningDate)}
                                </div>
                              </td>
                              <td style={{ verticalAlign: "middle" }}>
                                <div className="tableBody-title">
                                  {item?.ServiceLength}
                                </div>
                              </td>
                              <td style={{ verticalAlign: "middle" }}>
                                <div className="tableBody-title">
                                  {dateFormatter(item?.ConfirmationDate) || "-"}
                                </div>
                              </td>
                              <td style={{ verticalAlign: "middle" }}>
                                <div className="tableBody-title">
                                  {dateFormatter(
                                    item?.dteProbationaryCloseDate
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
 </ScrollableTable>  */
