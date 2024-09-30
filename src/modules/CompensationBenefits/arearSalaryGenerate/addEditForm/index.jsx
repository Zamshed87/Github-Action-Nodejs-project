/* eslint-disable react-hooks/exhaustive-deps */
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import AntTable from "../../../../common/AntTable";
import { getPeopleDeskAllDDL } from "../../../../common/api";
import BackButton from "../../../../common/BackButton";
import DefaultInput from "../../../../common/DefaultInput";
import FormikSelect from "../../../../common/FormikSelect";
import Loading from "../../../../common/loading/Loading";
import NoResult from "../../../../common/NoResult";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { gray500 } from "../../../../utility/customColor";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import { customStyles } from "../../../../utility/selectCustomStyle";
import {
  getAllSalaryPolicyDDL,
  getArrearSalaryGenerateRequestHeaderId,
  getEmployeeListByRequestId,
} from "../helper";
import { arrearSalaryDtoCol, arrearSalaryGenerateHandeler } from "./utils";
import { paginationSize } from "../../../../common/peopleDeskTable";
import { initialValues, validationSchema } from "./helper";

export default function ArearSalaryGenerateForm() {
  const dispatch = useDispatch();
  const params = useParams();
  const { orgId, buId, employeeId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [loading, setLoading] = useState(false);
  const [singleData, setSingleData] = useState(null);

  // DDl section
  const [businessUnitDDL, setBusinessUnitDDL] = useState([]);
  const [payrollPolicyDDL, setPayrollPolicyDDL] = useState([]);
  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30306) {
      permission = item;
    }
  });

  const [
    eligibleEmployee,
    getEligibleEmployee,
    loadingList,
    setEligibleEmployee,
  ] = useAxiosGet();
  const [filterEmpList, setFilterEmpList] = useState([]);
  // useFormik hooks
  const {
    values,
    errors,
    touched,
    handleSubmit,
    resetForm,
    setValues,
    setFieldValue,
  } = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues: params?.id ? { ...singleData } : { ...initialValues },
    onSubmit: (values) =>
      arrearSalaryGenerateHandeler(
        filterEmpList,
        params,
        orgId,
        values,
        employeeId,
        getById,
        resetForm,
        initialValues,
        setEligibleEmployee,
        setLoading
      ),
  });

  const getEmpList = (pagination, searchText = "") => {
    getEligibleEmployee(
      `/Payroll/ArearSalarySelectQueryAll?partName=EligibleEmployeeListForArearSalaryGenerate&intAccountId=${orgId}&intBusinessUnitId=${+values
        ?.businessUnit?.value}&intWorkplaceGroupId=${wgId}&dteEffectiveFrom=${
        values?.fromDate
      }&dteEffectiveTo=${values?.toDate}&IntPageNo=${
        pagination?.current
      }&IntPageSize=${pagination?.pageSize}&searchText=${searchText}`,
      // `/Payroll/ArearSalarySelectQueryAll?partName=EligibleEmployeeListForArearSalaryGenerate&intAccountId=${orgId}&intBusinessUnitId=${+values
      //   ?.businessUnit?.value}&dteEffectiveFrom=${
      //   values?.fromDate
      // }&dteEffectiveTo=${values?.toDate}`,
      (res) => {
        const modifyData = res?.map((itm) => {
          return {
            ...itm,
            isArrearSalaryGenerate: false,
          };
        });
        setEligibleEmployee(modifyData);
        setFilterEmpList(modifyData);
      }
    );
  };
  const getById = () => {
    getEligibleEmployee(
      `/Payroll/ArearSalarySelectQueryAll?partName=EmployeeListByArearSalaryGenerateRequestId&intArearSalaryGenerateRequestId=${+params?.id}`,
      (res) => {
        const modifyData = res?.map((itm) => {
          return {
            ...itm,
            isArrearSalaryGenerate:
              itm?.intArearSalaryGenerateRequestRowId > 0 ? true : false,
          };
        });
        setEligibleEmployee(modifyData);
        setFilterEmpList(modifyData);
      }
    );
  };

  useEffect(() => {
    if (+params?.id) {
      getArrearSalaryGenerateRequestHeaderId(
        "ArearSalaryGenerateRequestLandingById",
        +params?.id,
        setSingleData,
        setLoading
      );
      getById();
    }
  }, [params]);

  useEffect(() => {
    getPeopleDeskAllDDL(
      // `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=BusinessUnit&BusinessUnitId=${buId}&WorkplaceGroupId=0&intId=${employeeId}`,
      `/PeopleDeskDdl/BusinessUnitIdAll?accountId=${orgId}`,
      "intBusinessUnitId",
      "strBusinessUnit",
      setBusinessUnitDDL
    );
    getAllSalaryPolicyDDL(orgId, buId, setPayrollPolicyDDL);
  }, [orgId, buId, employeeId]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
  }, [dispatch]);

  return (
    <>
      <form onSubmit={handleSubmit}>
        {(loading || loadingList) && <Loading />}
        {permission?.isView ? (
          <div className="table-card">
            <div className="table-card-heading">
              <div className="d-flex align-items-center">
                <BackButton />
                <h2>{`Request Arrear Salary Generate`}</h2>
              </div>
              <ul className="d-flex flex-wrap">
                <li>
                  <button
                    type="button"
                    className="btn btn-cancel mr-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (+params?.id) {
                      } else {
                        resetForm(initialValues);
                        setEligibleEmployee([]);
                        setFilterEmpList([]);
                      }
                    }}
                  >
                    Reset
                  </button>
                </li>
                <li>
                  <button type="submit" className="btn btn-green w-100">
                    {!params?.id ? "Generate" : "Re-Generate"}
                  </button>
                </li>
              </ul>
            </div>
            <div className="table-card-body">
              <div
                className="card-style"
                style={{ margin: "14px 0px 12px 0px" }}
              >
                <div className="row">
                  <div className="col-lg-3">
                    <div className="input-field-main">
                      <label>Business Unit</label>
                      <FormikSelect
                        name="businessUnit"
                        options={businessUnitDDL || []}
                        value={values?.businessUnit}
                        onChange={(valueOption) => {
                          getAllSalaryPolicyDDL(
                            orgId,
                            valueOption?.value,
                            setPayrollPolicyDDL
                          );
                          setValues((prev) => ({
                            ...prev,
                            businessUnit: valueOption,
                            payrollPolicy: "",
                          }));
                          if (!params?.id) {
                            setEligibleEmployee([]);
                            setFilterEmpList([]);
                          }
                        }}
                        placeholder=""
                        styles={customStyles}
                        errors={errors}
                        touched={touched}
                        isDisabled={params?.id}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="input-field-main">
                      <label>Effective Form Date</label>
                      <DefaultInput
                        classes="input-sm"
                        placeholder=" "
                        value={values?.fromDate}
                        name="fromDate"
                        type="date"
                        onChange={(e) => {
                          setValues((prev) => ({
                            ...prev,
                            toDate: "",
                            fromDate: e.target.value,
                            employee: "",
                          }));
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="input-field-main">
                      <label>Effective To Month</label>
                      <DefaultInput
                        classes="input-sm"
                        value={values?.toDate}
                        name="toDate"
                        type="date"
                        onChange={(e) => {
                          setValues((prev) => ({
                            ...prev,
                            toDate: e.target.value,
                            employee: "",
                          }));
                          // if (
                          //   values?.businessUnit?.value &&
                          //   values?.workplaceGroup?.value &&
                          //   values?.workplace?.value &&
                          //   values?.fromDate &&
                          //   e.target.value
                          // ) {
                          //   getEmployeeDDL(
                          //     "EligibleEmployeeListForArearSalaryGenerate",
                          //     orgId,
                          //     values?.businessUnit?.value,
                          //     values?.workplaceGroup?.value,
                          //     values?.workplace?.value,
                          //     values?.fromDate,
                          //     e.target.value,
                          //     setEmployeeDDL
                          //   );
                          // }
                        }}
                        min={values?.fromDate}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <label>Payroll Policy</label>
                    <FormikSelect
                      name="payrollPolicy"
                      options={payrollPolicyDDL || []}
                      value={values?.payrollPolicy}
                      onChange={(valueOption) => {
                        setValues((prev) => ({
                          ...prev,
                          payrollPolicy: valueOption,
                        }));
                      }}
                      placeholder=" "
                      styles={customStyles}
                      isSearchable={false}
                      isClearable={false}
                      errors={errors}
                      touched={touched}
                      isDisabled={params?.id}
                    />
                  </div>
                  <div className="col-lg-3">
                    <div className="input-field-main">
                      <label>Percent Of Gross (%)</label>
                      <DefaultInput
                        classes="input-sm"
                        placeholder=" "
                        value={values?.percentOfGross}
                        name="percentOfGross"
                        type="number"
                        onChange={(e) => {
                          setValues((prev) => ({
                            ...prev,
                            percentOfGross: e.target.value,
                          }));
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="input-field-main">
                      <label>Description</label>
                      <DefaultInput
                        classes="input-sm"
                        placeholder=" "
                        value={values?.description}
                        name="description"
                        type="text"
                        onChange={(e) => {
                          setValues((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }));
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                  <div className="col-md-3 d-flex">
                    <button
                      style={{
                        marginTop: "23px",
                        padding: "0px 10px",
                      }}
                      className="btn btn-default"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEligibleEmployee([]);
                        setFilterEmpList([]);
                        if (+params?.id) {
                          getEmployeeListByRequestId(
                            "EmployeeListByArearSalaryGenerateRequestId",
                            +params?.id,
                            setEligibleEmployee,
                            setFilterEmpList,
                            true,
                            orgId,
                            values?.businessUnit?.value,
                            values?.fromDate,
                            values?.toDate
                          );
                        } else {
                          // getEmployeeDDL(
                          //   "EligibleEmployeeListForArearSalaryGenerate",
                          //   orgId,
                          //   values?.businessUnit?.value,
                          //   values?.fromDate,
                          //   values?.toDate,
                          //   setRowDto,
                          //   setAllData
                          // );
                          getEmpList(
                            { current: 1, pageSize: paginationSize },
                            ""
                          );
                        }
                      }}
                      disabled={
                        !values?.businessUnit ||
                        !values?.fromDate ||
                        !values?.toDate ||
                        !values?.payrollPolicy
                      }
                    >
                      View
                    </button>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <h2
                    style={{
                      color: gray500,
                      fontSize: "14px",
                      margin: "0px 0px 10px 0px",
                    }}
                  >
                    Employee Arrear Salary Generate List
                  </h2>
                </div>
                <div>
                  {eligibleEmployee?.length > 0 ? (
                    <div className="table-card-styled employee-table-card tableOne customAntTable">
                      <AntTable
                        data={eligibleEmployee}
                        columnsData={arrearSalaryDtoCol(
                          eligibleEmployee,
                          setEligibleEmployee,
                          setFieldValue,
                          setFilterEmpList,
                          filterEmpList
                        )}
                        rowKey={(record) => record?.EmployeeCode}
                        setColumnsData={(dataRow) => {
                          if (dataRow?.length === eligibleEmployee?.length) {
                            let temp = dataRow?.map((item) => {
                              return {
                                ...item,
                                isArrearSalaryGenerate: false,
                              };
                            });
                            setFilterEmpList(temp);
                            setEligibleEmployee(temp);
                            return;
                          }
                          setFilterEmpList(dataRow);
                        }}
                      />
                    </div>
                  ) : (
                    <NoResult title="No result found" />
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <NotPermittedPage />
        )}
      </form>
    </>
  );
}
