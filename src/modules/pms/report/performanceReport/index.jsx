import { useFormik } from "formik";
import React from "react";
import Loading from "../../../../common/loading/Loading";
import PrimaryButton from "../../../../common/PrimaryButton";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import { useEffect } from "react";
import { getPeopleDeskAllDDL } from "../../../../common/api";
import { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import FormikSelect from "../../../../common/FormikSelect";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { getFiscalYearForNowOnLoad } from "../../../../utility/getFiscalYearOnLoade";
import { fiscalMonthDDLForKpi } from "../../../../utility/fiscalMonthDDLForKpi";
import AsyncFormikSelect from "../../../../common/AsyncFormikSelect";
import axios from "axios";
import AntTable from "../../../../common/AntTable";
import {
  departmentPerformanceTableColumn,
  individualPerformanceTableColumn,
  sbuPerformanceTableColumn,
} from "./helper";
import AntScrollTable from "../../../../common/AntScrollTable";

const initData = {
  reportType: {
    value: "Individual",
    label: "Individual",
  },
  sbu: "",
  department: "",
  year: "",
  fromMonth: "",
  toMonth: "",
  employee: "",
  scale: "",
  employeeType: "",
};

const PerformanceReportlanding = () => {
  // 30407
  const [pages, setPages] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  const {
    // permissionList,
    businessUnitDDL: permittedBusinessUnitDDL,
    profileData: { orgId, buId, employeeId },
  } = useSelector((store) => store?.auth, shallowEqual);

  const [businessUnitDDL, setBusinessUnitDDL] = useState([]);
  const [fiscalYearDDL, getFiscalYearDDL, fiscalYearDDLloader] = useAxiosGet();
  const [reportData, getReportData, reportDataLoader, setReportData] =
    useAxiosGet();

  const [departmentDDL, setDepartmentDDL] = useState([]);

  useEffect(() => {
    const modifiedBusinessUnitDDL = permittedBusinessUnitDDL?.map((item) => ({
      ...item,
      label: item?.BusinessUnitName,
      value: item?.BusinessUnitId,
    }));
    setBusinessUnitDDL(modifiedBusinessUnitDDL);

    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmpDepartment&AccountId=${orgId}&BusinessUnitId=${buId}&intId=${employeeId}`,
      "DepartmentId",
      "DepartmentName",
      (departmentData) => {
        setDepartmentDDL([{ label: "All", value: 0 }, ...departmentData]);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId, employeeId]);

  const { setFieldValue, values } = useFormik({
    enableReinitialize: true,
    initialValues: initData,
  });

  useEffect(() => {
    getFiscalYearDDL(`/PMS/GetFiscalYearDDL`, (data) => {
      const theYear = getFiscalYearForNowOnLoad();
      const theYearData = data.find((item) => item?.label === theYear);
      initData.year = theYearData;
      setFieldValue("year", theYearData);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId]);

  const loadUserList = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(
        `/PMS/EmployeeInfoDDLSearch?AccountId=${orgId}&BusinessUnitId=${buId}&Search=${v}`
      )
      .then((res) => {
        return res?.data;
      })
      .catch((err) => []);
  };

  const getTableData = (values, pages) => {
    getReportData(
      `/PMS/GetEmployeeScore?AccountId=${orgId}&BusinessUnit=${buId}&YearId=${
        values?.year?.value || 0
      }&EmployeeID=${values?.employee?.value || 0}&KpiForId=1&DepartmentId=${
        values?.department?.value || 0
      }&SbuId=${values?.sbu?.value || 0}&Scale=${
        values?.scale?.value || 0
      }&EmployementId=${values?.employeeType?.value || 0}&From=${
        values?.fromMonth?.value || 1
      }&To=${values?.toMonth?.value || 12}&PageNo=${pages?.current}&PageSize=${
        pages?.pageSize
      }`,
      (data) => {
        if (data) {
          setPages((prev) => ({
            ...prev,
            total: data?.totalCount,
          }));
        }
        return data;
      }
    );
  };

  const handleTableChange = ({ pagination }) => {
    setPages((prev) => ({ ...prev, ...pagination }));
    if (
      (pages?.current === pagination?.current &&
        pages?.pageSize !== pagination?.pageSize) ||
      pages?.current !== pagination?.current
    ) {
      return getTableData(values, pagination);
    }
  };

  return (
    <div className="table-card">
      {(fiscalYearDDLloader || reportDataLoader) && <Loading />}
      <div className="table-card-heading">
        <div className="d-flex align-items-center my-1">
          <h2>Performance Report</h2>
        </div>
      </div>
      <div className="card-style with-form-card pb-0 mb-3 ">
        <div className="row">
          <div className="col-lg-3">
            <label>Report Type</label>
            <FormikSelect
              classes="input-sm form-control"
              name="reportType"
              placeholder="Select Report Type"
              options={[
                {
                  value: "Individual",
                  label: "Individual",
                },
                {
                  value: "SBU",
                  label: "SBU",
                },
                {
                  value: "Department",
                  label: "Department",
                },
              ]}
              value={values?.reportType}
              onChange={(valueOption) => {
                if (valueOption) {
                  setFieldValue("reportType", valueOption);
                  setReportData([]);
                } else {
                  setFieldValue("reportType", "");
                  setReportData([]);
                }
              }}
              styles={customStyles}
            />
          </div>
          <div className="col-lg-3">
            <label>Sbu</label>
            <FormikSelect
              name="sbu"
              options={businessUnitDDL || []}
              value={values?.sbu}
              placeholder="Select Sbu"
              onChange={(valueOption) => {
                if (valueOption) {
                  setFieldValue("sbu", valueOption);
                  setReportData([]);
                } else {
                  setFieldValue("sbu", valueOption);
                  setReportData([]);
                }
              }}
              styles={customStyles}
            />
          </div>
          <div className="col-lg-3">
            <label>Department</label>
            <FormikSelect
              name="department"
              options={departmentDDL || []}
              value={values?.department}
              placeholder="Select Department"
              onChange={(valueOption) => {
                if (valueOption) {
                  setFieldValue("department", valueOption);
                  setReportData([]);
                } else {
                  setFieldValue("department", valueOption);
                  setReportData([]);
                }
              }}
              styles={customStyles}
            />
          </div>
          <div className="col-lg-3">
            <label>Year</label>
            <FormikSelect
              classes="input-sm form-control"
              name="year"
              placeholder="Select Year"
              options={fiscalYearDDL || []}
              value={values?.year}
              onChange={(valueOption) => {
                setFieldValue("year", valueOption);
                setReportData([]);
              }}
              styles={customStyles}
            />
          </div>
          <div className="col-lg-3">
            <label>From Month</label>
            <FormikSelect
              classes="input-sm form-control"
              name="fromMonth"
              placeholder="Select From Month"
              options={fiscalMonthDDLForKpi || []}
              value={values?.fromMonth}
              onChange={(valueOption) => {
                if (valueOption) {
                  setFieldValue("fromMonth", valueOption);
                  setReportData([]);
                } else {
                  setFieldValue("fromMonth", "");
                  setReportData([]);
                }
              }}
              styles={customStyles}
            />
          </div>
          <div className="col-lg-3">
            <label>To Month</label>
            <FormikSelect
              classes="input-sm form-control"
              name="toMonth"
              placeholder="Select To Month"
              options={fiscalMonthDDLForKpi || []}
              value={values?.toMonth}
              onChange={(valueOption) => {
                if (valueOption) {
                  setFieldValue("toMonth", valueOption);
                  setReportData([]);
                } else {
                  setFieldValue("toMonth", "");
                  setReportData([]);
                }
              }}
              styles={customStyles}
            />
          </div>
          <div className="col-lg-3">
            <label>Employee</label>
            <AsyncFormikSelect
              selectedValue={values?.employee}
              isSearchIcon={true}
              isClear={true}
              handleChange={(valueOption) => {
                if (valueOption) {
                  setFieldValue("employee", valueOption);
                  setReportData([]);
                } else {
                  setFieldValue("employee", "");
                  setReportData([]);
                }
              }}
              loadOptions={loadUserList}
            />
          </div>
          <div className="col-lg-3">
            <label>Scale</label>
            <FormikSelect
              classes="input-sm form-control"
              name="scale"
              placeholder="Select Scale"
              options={[
                {
                  value: 0,
                  label: "All",
                },
                {
                  value: 40,
                  label: "<40%",
                },
                {
                  value: 60,
                  label: "<60%",
                },
                {
                  value: 80,
                  label: "<80%",
                },
              ]}
              value={values?.scale}
              onChange={(valueOption) => {
                if (valueOption) {
                  setFieldValue("scale", valueOption);
                  setReportData([]);
                } else {
                  setFieldValue("scale", "");
                  setReportData([]);
                }
              }}
              styles={customStyles}
            />
          </div>
          <div className="col-lg-3">
            <label>Employee Type </label>
            <FormikSelect
              classes="input-sm form-control"
              name="employeeType"
              placeholder="Select Employee Type"
              options={[
                {
                  value: 0,
                  label: "All",
                },
                {
                  value: 1,
                  label: "Management",
                },
                {
                  value: 2,
                  label: "Non Management",
                },
              ]}
              value={values?.employeeType}
              onChange={(valueOption) => {
                if (valueOption) {
                  setFieldValue("employeeType", valueOption);
                  setReportData([]);
                } else {
                  setFieldValue("employeeType", "");
                  setReportData([]);
                }
              }}
              styles={customStyles}
            />
          </div>
          <div style={{ marginTop: "24px" }} className="col-lg-3">
            <PrimaryButton
              type="button"
              className="btn btn-default flex-center"
              label={"View"}
              onClick={() => {
                getTableData(values, pages);
              }}
              disabled={!values?.year || !values?.fromMonth || !values?.toMonth}
            />
          </div>
        </div>
      </div>
      <div className="table-card-body" style={{ marginTop: "40px" }}>
        <div className="table-card-styled table-responsive tableOne">
          <AntScrollTable
            data={reportData?.data?.length > 0 ? reportData?.data : []}
            columnsData={
              values?.reportType?.value === "Individual"
                ? individualPerformanceTableColumn({ values })
                : values?.reportType?.value === "SBU"
                ? sbuPerformanceTableColumn({ values })
                : values?.reportType?.value === "Department"
                ? departmentPerformanceTableColumn({ values })
                : []
            }
            rowKey={(record) => record?.id}
            pages={pages?.pageSize}
            pagination={pages}
            handleTableChange={handleTableChange}
          />
        </div>
      </div>
    </div>
  );
};

export default PerformanceReportlanding;
