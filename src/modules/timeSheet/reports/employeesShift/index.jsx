import { SaveAlt } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { paginationSize } from "../../../../common/AntTable";
import AsyncFormikSelect from "../../../../common/AsyncFormikSelect";
import DefaultInput from "../../../../common/DefaultInput";
import NoResult from "../../../../common/NoResult";
import {
  getSearchEmployeeList,
  getWorkplaceDetails,
} from "../../../../common/api";
import Loading from "../../../../common/loading/Loading";
import PeopleDeskTable from "../../../../common/peopleDeskTable";
import { gray600 } from "../../../../utility/customColor";
import { monthFirstDate } from "../../../../utility/dateFormatter";
import { todayDate } from "../../../../utility/todayDate";
import { getBuDetails } from "../helper";
import { generateExcelAction } from "./excel/excelConvert";
import {
  employeesShiftInformationTableColumn,
  getEmployeeInfo,
  onGetEmployeeShiftInformation,
} from "./helper";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";

const initialValues = {
  employee: "",
  fromDate: monthFirstDate?.(),
  toDate: todayDate?.(),
};
const EmployeesShift = () => {
  const dispatch = useDispatch();

  // redux
  const { intBusinessUnitId, buName } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const {
    permissionList,
    profileData: { orgId, buId, employeeId, wgId, wId, strDisplayName, wgName },
    keywords: { supervisor },
  } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30338) {
      permission = item;
    }
  });
  //set to module
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Emp Roster Report";
  }, []);

  // state
  const [buDetails, setBuDetails] = useState({});
  const [employeeInformation, setEmployeeInformation] = useState([]);
  const [loading, setLoading] = useState({});

  // landing data
  const [rowDto, setRowDto] = useState([]);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  const getData = (pagination, searchText) => {
    onGetEmployeeShiftInformation(
      buId,
      wgId,
      values?.employee?.value,
      values?.fromDate,
      values?.toDate,
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

  const saveHandler = (values) => {
    onGetEmployeeShiftInformation(
      buId,
      wgId,
      values?.employee?.value,
      values?.fromDate,
      values?.toDate,
      setRowDto,
      setLoading,
      1,
      paginationSize,
      setPages,
      true
    );
    getEmployeeInfo(
      orgId,
      buId,
      values?.employee?.value,
      setEmployeeInformation,
      setLoading
    );
  };

  // formik
  const { values, handleSubmit, setFieldValue } = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...initialValues,
      employee: {
        value: employeeId,
        label: strDisplayName,
      },
    },
    onSubmit: (values) => saveHandler(values),
  });

  // initial
  useEffect(() => {
    onGetEmployeeShiftInformation(
      buId,
      wgId,
      employeeId,
      values?.fromDate,
      values?.toDate,
      setRowDto,
      setLoading,
      1,
      paginationSize,
      setPages,
      true
    );
  }, [buId, wgId, employeeId, values]);

  useEffect(() => {
    getEmployeeInfo(
      orgId,
      buId,
      employeeId,
      setEmployeeInformation,
      setLoading
    );
  }, [orgId, buId, employeeId]);

  useEffect(() => {
    getWorkplaceDetails(wId, setBuDetails);
  }, [wId]);

  return (
    <>
      {loading && <Loading />}

      {permission?.isView && (
        <div className="table-card">
          <div className="table-card-heading">
            <div className="d-flex justify-content-center align-items-center">
              <Tooltip title="Export CSV" arrow>
                <div
                  className="btn-save mr-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (rowDto?.length <= 0 || rowDto?.length === undefined) {
                      return toast.warning("Data is empty !!!!", {
                        toastId: 1,
                      });
                    }
                    const excelLanding = () => {
                      generateExcelAction(
                        "Employee Roster Report",
                        values?.fromDate,
                        values?.toDate,
                        buDetails?.strWorkplace,
                        rowDto,
                        buDetails?.strAddress,
                        employeeInformation
                      );
                    };
                    excelLanding();
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <SaveAlt sx={{ color: gray600, fontSize: "16px" }} />
                </div>
              </Tooltip>
            </div>
          </div>
          <div className="card-style pb-0s mb-2 mt-4">
            <div className="row">
              <div className="col-lg-3">
                <div className="input-field-main">
                  <label>Employee</label>
                  <AsyncFormikSelect
                    selectedValue={values?.employee}
                    isSearchIcon={true}
                    handleChange={(valueOption) => {
                      setFieldValue("employee", valueOption);
                      if (valueOption?.value) {
                        onGetEmployeeShiftInformation(
                          buId,
                          wgId,
                          valueOption?.value || "",
                          values?.fromDate,
                          values?.toDate,
                          setRowDto,
                          setLoading,
                          1,
                          paginationSize,
                          setPages,
                          true
                        );
                      }
                    }}
                    placeholder="Search (min 3 letter)"
                    loadOptions={(v) => getSearchEmployeeList(buId, wgId, v)}
                  />
                </div>
              </div>
              <div className="col-lg-3">
                <div className="input-field-main">
                  <label>From Date</label>
                  <DefaultInput
                    classes="input-sm"
                    type="date"
                    value={values?.fromDate}
                    name="fromDate"
                    onChange={(e) => {
                      setFieldValue("fromDate", e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="col-lg-3">
                <div className="input-field-main">
                  <label>To Date</label>
                  <DefaultInput
                    classes="input-sm"
                    type="date"
                    value={values?.toDate}
                    name="toDate"
                    min={values?.fromDate}
                    onChange={(e) => {
                      setFieldValue("toDate", e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="col-lg-3">
                <button
                  className="btn btn-green btn-green-disable mt-4"
                  type="button"
                  disabled={
                    !values?.employee || !values?.fromDate || !values?.toDate
                  }
                  onClick={handleSubmit}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
          {employeeInformation?.length > 0 && (
            <div
              className="row"
              style={{
                border: "1px solid rgba(0, 0, 0, 0.12)",
                borderRadius: "6px",
                padding: "10px",
                marginRight: "0",
                marginLeft: "0",
                marginTop: "15px",
              }}
            >
              <div className="col-md-3">
                <div
                  className="card-des"
                  style={{
                    borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                    fontSize: "17px",
                  }}
                >
                  <p>
                    Employee:{" "}
                    <strong>{employeeInformation?.[0]?.EmployeeName}</strong>{" "}
                  </p>
                  <p>
                    Workplace Group: <strong>{wgName}</strong>{" "}
                  </p>
                </div>
              </div>
              <div className="col-md-3">
                <div
                  className="card-des"
                  style={{
                    borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                  }}
                >
                  <p>
                    HR Position:{" "}
                    <strong>{employeeInformation?.[0]?.PositionName}</strong>
                  </p>
                  <p>
                    Business Unit:{" "}
                    <strong>
                      {employeeInformation?.[0]?.BusinessUnitName}
                    </strong>
                  </p>
                </div>
              </div>
              <div className="col-md-3">
                <div
                  className="card-des"
                  style={{
                    borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                  }}
                >
                  <p>
                    Designation:{" "}
                    <strong>{employeeInformation?.[0]?.DesignationName}</strong>
                  </p>
                  <p>
                    Department:{" "}
                    <strong>{employeeInformation?.[0]?.DepartmentName}</strong>{" "}
                  </p>
                  <p>
                    Section:{" "}
                    <strong>{employeeInformation?.[0]?.SectionName}</strong>{" "}
                  </p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card-des">
                  <p>
                    Employment Type:{" "}
                    <strong>
                      {employeeInformation?.[0]?.EmploymentTypeName}
                    </strong>
                  </p>
                  <p>
                    {supervisor || "Supervisor"}:{" "}
                    <strong>{employeeInformation?.[0]?.SupervisorName}</strong>
                  </p>
                </div>
              </div>
            </div>
          )}
          {rowDto?.length > 0 ? (
            <PeopleDeskTable
              customClass="iouManagementTable"
              columnData={employeesShiftInformationTableColumn(
                pages?.current,
                pages?.pageSize
              )}
              pages={pages}
              rowDto={rowDto}
              setRowDto={setRowDto}
              handleChangePage={(e, newPage) =>
                handleChangePage(e, newPage, values?.search)
              }
              handleChangeRowsPerPage={(e) =>
                handleChangeRowsPerPage(e, values?.search)
              }
              uniqueKey="strEmployeeCode"
              isCheckBox={false}
              isScrollAble={false}
            />
          ) : (
            <>
              <NoResult />
            </>
          )}
        </div>
      )}
    </>
  );
};

export default EmployeesShift;
