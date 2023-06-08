/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { SaveAlt } from "@mui/icons-material";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import AntTable from "../../../../common/AntTable";
import { paginationSize } from "../../../../common/AntTable";
import { getSearchEmployeeList } from "../../../../common/api";
import DefaultInput from "../../../../common/DefaultInput";
import Loading from "../../../../common/loading/Loading";
import NoResult from "../../../../common/NoResult";
import PrimaryButton from "../../../../common/PrimaryButton";
import { gray600 } from "../../../../utility/customColor";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import {
  monthFirstDate,
  monthLastDate,
} from "../../../../utility/dateFormatter";
import { todayDate } from "../../../../utility/todayDate";
import { getBuDetails } from "../helper";
import { generateExcelAction } from "./excel/excelConvert";
import {
  employeesShiftInformationTableColumn,
  onGetEmployeeInfoForEmployeesShift,
  onGetEmployeeShiftInformation,
} from "./helper";
import AsyncFormikSelect from "../../../../common/AsyncFormikSelect";
const initialValues = {
  employee: "",
  fromDate: monthFirstDate?.(),
  toDate: todayDate?.(),
};
const EmployeesShift = () => {
  const { intBusinessUnitId, buName } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const {
    permissionList,
    profileData: { orgId, buId, employeeId, wgId },
    keywords: { supervisor },
  } = useSelector((state) => state?.auth, shallowEqual);
  const [buDetails, setBuDetails] = useState({});
  const [loading, setLoading] = useState({});

  const [
    employeeInformation,
    getEmployeeInformation,
    loadingOnGetEmployeeInformation,
    setEmployeeInformation,
  ] = useAxiosGet();

  const [
    employeesShiftInformation,
    getEmployeesShiftImpormation,
    loadingOnGetEmployeeShift,
    setEmployeesShiftInfo,
  ] = useAxiosGet();
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });
  // const [page, setPage] = useState(1);
  // const [paginationSize, setPaginationSize] = useState(15);

  useEffect(() => {
    getBuDetails(intBusinessUnitId, setBuDetails, setLoading);
  }, [intBusinessUnitId]);

  useEffect(() => {
    if (employeeId) {
      onGetEmployeeInfoForEmployeesShift(
        getEmployeeInformation,
        orgId,
        buId,
        employeeId,
        (data) => {
          setValues((prev) => ({
            ...prev,
            employee: {
              ...data,
              label: data?.EmployeeName,
              value: data?.EmployeeId,
            },
            fromDate: monthFirstDate(),
            toDate: monthLastDate(),
          }));
          onGetEmployeeShiftInformation(
            getEmployeesShiftImpormation,
            orgId,
            employeeId,
            data?.WorkplaceGroupId,
            data?.WorkplaceId,
            monthFirstDate?.(),
            monthLastDate?.(),
            pages,
            setPages
          );
        }
      );
    }
  }, []);

  useEffect(() => {
    if (employeesShiftInformation.length > 0) {
      setPages((prev) => {
        return {
          ...prev,
          current: pages?.current,
          pageSize: pages?.pageSize,
          total: employeesShiftInformation?.[0]?.totalCount,
        };
      });
    }
  }, [employeesShiftInformation]);
  // page
  const handleTableChange = (pagination, newRowDto, srcText) => {
    setPages((prev) => ({
      ...prev,
      current: pagination?.current,
      pageSize: pagination?.pageSize,
      total: pagination?.total,
    }));
    if (newRowDto?.action === "filter") {
      return;
    }
    if (
      pages?.current === pagination?.current &&
      pages?.pageSize !== pagination?.pageSize
    ) {
      return onGetEmployeeShiftInformation(
        getEmployeesShiftImpormation,
        orgId,
        employeeId,
        employeeInformation?.[0]?.WorkplaceGroupId,
        employeeInformation?.[0]?.WorkplaceId,
        values?.fromDate,
        values?.toDate,
        pagination,
        setPages
      );
    }

    if (pages?.current !== pagination?.current) {
      return onGetEmployeeShiftInformation(
        getEmployeesShiftImpormation,
        orgId,
        employeeId,
        employeeInformation?.[0]?.WorkplaceGroupId,
        employeeInformation?.[0]?.WorkplaceId,
        values?.fromDate,
        values?.toDate,
        pagination,
        setPages
      );
    }
  };

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30338) {
      permission = item;
    }
  });
  // formik
  const { values, handleSubmit, setFieldValue, setValues } = useFormik({
    initialValues,
    onSubmit: (formValues) => {
      onGetEmployeeShiftInformation(
        getEmployeesShiftImpormation,
        orgId,
        formValues?.employee?.value,
        employeeInformation?.[0]?.WorkplaceGroupId,
        employeeInformation?.[0]?.WorkplaceId,
        formValues?.fromDate,
        formValues?.toDate,
        pages,
        setPages
      );
    },
  });

  return (
    <>
      {(loadingOnGetEmployeeInformation || loadingOnGetEmployeeShift) && (
        <Loading />
      )}
      {permission?.isView && (
        <div className="table-card">
          <div className="table-card-heading">
            <div className="d-flex justify-content-center align-items-center">
              <Tooltip title="Export CSV" arrow>
                <div
                  className="btn-save mr-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (
                      employeesShiftInformation?.length <= 0 ||
                      employeesShiftInformation?.length === undefined
                    ) {
                      return toast.warning("Data is empty !!!!", {
                        toastId: 1,
                      });
                    }
                    const excelLanding = () => {
                      generateExcelAction(
                        "Employee Roster Report",
                        values?.fromDate,
                        values?.toDate,
                        buName,
                        employeesShiftInformation,
                        buDetails?.strBusinessUnitAddress,
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
          <div className="card-style pb-0 mb-2 mt-4">
            <div className="row">
              <div className="col-lg-3">
                <div className="input-field-main">
                  <label>From Date</label>
                  <AsyncFormikSelect
                    selectedValue={values?.employee}
                    isSearchIcon={true}
                    handleChange={(valueOption) => {
                      setFieldValue("employee", valueOption);
                      setEmployeesShiftInfo?.([]);
                      if (valueOption?.value) {
                        onGetEmployeeInfoForEmployeesShift(
                          getEmployeeInformation,
                          orgId,
                          buId,
                          valueOption?.value,
                          null
                        );
                      } else {
                        setEmployeeInformation?.([]);
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
                    Workplace Group:{" "}
                    <strong>
                      {employeeInformation?.[0]?.EmploymentTypeName}
                    </strong>{" "}
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
          {employeesShiftInformation?.length > 0 ? (
            <div className="table-card-body mt-2">
              <div className="table-card-styled tableOne">
                <AntTable
                  columnsData={employeesShiftInformationTableColumn?.(
                    pages?.current,
                    pages?.pageSize
                  )}
                  data={employeesShiftInformation}
                  pages={pages?.pageSize}
                  pagination={pages}
                  handleTableChange={({ pagination, newRowDto }) =>
                    handleTableChange(
                      pagination,
                      newRowDto,
                      values?.search || ""
                    )
                  }
                />
              </div>
            </div>
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
