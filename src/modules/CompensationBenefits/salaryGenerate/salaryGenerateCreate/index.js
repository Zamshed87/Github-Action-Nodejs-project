import axios from "axios";
import IConfirmModal from "../../../../common/IConfirmModal";

import { paginationSize } from "common/peopleDeskTable";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AntTable from "../../../../common/AntTable";
import BackButton from "../../../../common/BackButton";
import DefaultInput from "../../../../common/DefaultInput";
import FormikSelect from "../../../../common/FormikSelect";
import NoResult from "../../../../common/NoResult";
import { getPeopleDeskAllDDL } from "../../../../common/api";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { gray500 } from "../../../../utility/customColor";
import { customStyles } from "../../../../utility/selectCustomStyle";
import TaxAssignCheckerModal from "../components/taxAssignChekerModal";
import {
  createSalaryGenerateRequest,
  getSalaryGenerateRequestHeaderId,
  getSalaryGenerateRequestLanding,
  getSalaryGenerateRequestLandingById,
  getSalaryGenerateRequestRowId,
} from "../helper";
import { lastDayOfMonth } from "./../../../../utility/dateFormatter";
import {
  salaryGenerateCreateEditTableColumn,
  salaryGenerateInitialValues,
  salaryGenerateValidationSchema,
} from "./helper";

const SalaryGenerateCreate = () => {
  // hooks
  const { state } = useLocation();
  const params = useParams();
  const dispatch = useDispatch();

  // redux
  const { orgId, buId, employeeId, wgId, buName, wgName, wId, wName } =
    useSelector((state) => state?.auth?.profileData, shallowEqual);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 77) {
      permission = item;
    }
  });

  // state
  const [loading, setLoading] = useState(false);
  const [singleData, setSingleData] = useState(null);
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);
  const [takeHomePayTax, setTakeHomePayTax] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });
  const [allEmployeeString, setAllEmployeeString] = useState("");
  const [isAllAssign, setAllAssign] = useState(false);
  // DDL
  // const [wingDDL, setWingDDL] = useState([]);
  // const [soleDepoDDL, setSoleDepoDDL] = useState([]);
  // const [regionDDL, setRegionDDL] = useState([]);
  // const [areaDDL, setAreaDDL] = useState([]);
  // const [territoryDDL, setTerritoryDDL] = useState([]);

  // for create state
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  // DDl section
  const [businessUnitDDL, setBusinessUnitDDL] = useState([]);

  //get landing data
  const getLandingData = (pages = pages) => {
    getSalaryGenerateRequestLanding(
      "EmployeeListForSalaryGenerateRequest",
      orgId,
      buId,
      wgId,
      wId,
      setRowDto,
      setAllData,
      setLoading,
      pages,
      setPages,
      setAllEmployeeString
    );
  };

  // for initial
  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=BusinessUnit&BusinessUnitId=${buId}&WorkplaceGroupId=0&intId=${employeeId}`,
      "intBusinessUnitId",
      "strBusinessUnit",
      setBusinessUnitDDL
    );
  }, [orgId, buId, employeeId]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
  }, [dispatch]);

  useEffect(() => {
    setRowDto([]);
  }, [wgId]);

  // for edit
  useEffect(() => {
    if (+params?.id) {
      getSalaryGenerateRequestHeaderId(
        "SalaryGenerateRequestByRequestId",
        +params?.id,
        setSingleData,
        setLoading,
        wgId,
        buId
      );
    }
  }, [params, wgId, buId]);

  useEffect(() => {
    if (+params?.id) {
      getSalaryGenerateRequestRowId(
        "SalaryGenerateRequestRowByRequestId",
        +params?.id,
        setRowDto,
        setAllData,
        setLoading,
        wgId,
        buId,
        pages,
        setPages
      );
    }
  }, [params, orgId, wgId, buId]);
  const saveHandler = async (values) => {
    const { empIdList, payload, callback } = salaryGeneratepayloadHandler(
      values,
      allData,
      false
    );
    const res = await axios.post(
      `/Payroll/EmployeeTakeHomePayNotAssignForTax`,
      {
        partName: "EmployeeTaxNotAssignListForTakeHomePay",
        intAccountId: orgId,
        intBusinessUnitId: buId,
        listOfEmployeeId: empIdList.join(","),
      }
    );
    if (res?.data) {
      setTakeHomePayTax(res?.data);
      res?.data?.length > 0
        ? setOpen(true)
        : createSalaryGenerateRequest(payload, setLoading, callback);
    }
  };
  const salaryGeneratepayloadHandler = (values, allData, isAllAssign) => {
    const modifyRowDto = allData
      ?.filter((itm) => itm?.isSalaryGenerate === true)
      ?.map((itm) => {
        return {
          intEmployeeId: itm?.intEmployeeId,
          strEmployeeName: itm?.strEmployeeName,
          intPayrollGroupId: itm?.intPayrollGroupId,
          strPayrollGroup: itm?.strPayrollGroup,
          // intWingId: itm?.intWingId,
          // intSoleDepoId: itm?.intSoleDepoId,
          // intRegionId: itm?.intRegionId,
          // intAreaId: itm?.intAreaId,
          // // intTerritoryId: itm?.intTerritoryId,
        };
      });

    const empIdList = modifyRowDto.map((data) => {
      return data?.intEmployeeId;
    });
    const payload = {
      strPartName: "SalaryGenerateNReGenerateRequest",
      intSalaryGenerateRequestId: +params?.id
        ? state?.intSalaryGenerateRequestId
        : 0,
      strSalaryCode: " ",
      intAccountId: orgId,
      intBusinessUnitId: buId,
      strBusinessUnit: buName,
      intWorkplaceGroupId: wgId,
      strWorkplaceGroup: wgName,
      intWorkplaceId: wId,
      strWorkplace: wName,
      intWingId: values?.wing?.value || 0,
      intSoleDepoId: values?.soleDepo?.value || 0,
      intRegionId: values?.region?.value || 0,
      intAreaId: values?.area?.value || 0,
      territoryIdList: 0,
      territoryNameList: 0,
      intMonthId: values?.monthId,
      intYearId: values?.yearId,
      strDescription: values?.description,
      intCreatedBy: employeeId,
      strSalryType: values?.salaryTpe?.value,
      dteFromDate:
        values?.fromDate ||
        `${values?.yearId}-${
          values?.monthId <= 9 ? `0${values?.monthId}` : values?.monthId
        }-01`,
      dteToDate:
        values?.toDate || lastDayOfMonth(values?.monthId, values?.yearId),
      // generateRequestRows: modifyRowDto,
      strEmpIdList: isAllAssign ? allEmployeeString : empIdList.join(","),
    };
    const callback = () => {
      setAllAssign(false);
      if (+params?.id) {
        getSalaryGenerateRequestLandingById(
          "SalaryGenerateRequestRowByRequestId",
          orgId,
          buId,
          wgId,
          +params?.id,
          false,
          values?.intMonth,
          values?.intYear,
          values?.fromDate,
          values?.toDate,
          setRowDto,
          setAllData,
          setLoading,
          wId,
          {
            current: pages?.current,
            pageSize: 500,
          },
          setPages,
          setAllEmployeeString,
          values?.wing?.value,
          values?.soleDepo?.value,
          values?.region?.value,
          values?.area?.value,
          values?.territory
        );
        resetForm(salaryGenerateInitialValues);
        setIsEdit(true);
        // searchKeyWord("")
      } else {
        resetForm(salaryGenerateInitialValues);
        setIsEdit(false);
        setRowDto([]);
      }
    };
    return { empIdList, payload, callback };
  };
  const allBulkSalaryGenerateHandler = (values, allData) => {
    const { payload, callback } = salaryGeneratepayloadHandler(
      values,
      allData,
      true
    );
    const confirmObject = {
      closeOnClickOutside: false,
      message: "Do you want to generate all employee salary?",
      yesAlertFunc: async () => {
        const res = await axios.post(
          `/Payroll/EmployeeTakeHomePayNotAssignForTax`,
          {
            partName: "EmployeeTaxNotAssignListForTakeHomePay",
            intAccountId: orgId,
            intBusinessUnitId: buId,
            listOfEmployeeId: allEmployeeString,
          }
        );
        if (res?.data) {
          setTakeHomePayTax(res?.data);
          res?.data?.length > 0
            ? setOpen(true)
            : createSalaryGenerateRequest(payload, setLoading, callback);
        }
      },
      noAlertFunc: () => {
        //
      },
    };
    IConfirmModal(confirmObject);
  };

  // marketingEmployee
  const isSameWgEmployee = rowDto.every(
    (itm) => wgName === itm?.strWorkplaceGroup
  );

  // marketing Check
  const isSameMaketingAreaHandler = (rowDto, value, property) => {
    let isCheck = false;

    if (rowDto?.length > 0 && rowDto.every((itm) => value === itm[property])) {
      isCheck = true;
    }

    return isCheck;
  };
  // table pagination option
  const handleTableChange = (pagination, newRowDto, srcText) => {
    if (newRowDto?.action === "filter") {
      return;
    }
    if (
      pages?.current === pagination?.current &&
      pages?.pageSize !== pagination?.pageSize
    ) {
      if (+params?.id) {
        getSalaryGenerateRequestRowId(
          "SalaryGenerateRequestRowByRequestId",
          +params?.id,
          setRowDto,
          setAllData,
          setLoading,
          wgId,
          buId,
          // pagination,
          {
            current: pages?.pagination,
            pageSize: 500,
          },
          setPages
        );
      } else {
        return getLandingData(pagination, srcText);
      }
    }
    if (pages?.current !== pagination?.current) {
      if (+params?.id) {
        getSalaryGenerateRequestRowId(
          "SalaryGenerateRequestRowByRequestId",
          +params?.id,
          setRowDto,
          setAllData,
          setLoading,
          wgId,
          buId,
          {
            current: pages?.pagination,
            pageSize: 500,
          },
          setPages
        );
      } else {
        return getLandingData(pagination, srcText);
      }
    }
  };
  // useFormik hooks
  const {
    setFieldValue,
    values,
    errors,
    touched,
    handleSubmit,
    resetForm,
    setValues,
  } = useFormik({
    enableReinitialize: true,
    validationSchema: salaryGenerateValidationSchema,
    initialValues: params?.id
      ? {
          ...singleData,
          wing:
            +params?.id &&
            isSameMaketingAreaHandler(
              rowDto,
              singleData?.intWingId,
              "intWingId"
            )
              ? {
                  value: singleData?.intWingId,
                  label: singleData?.wingName,
                }
              : "",
          soleDepo:
            +params?.id &&
            isSameMaketingAreaHandler(
              rowDto,
              singleData?.intSoleDepoId,
              "intSoleDepoId"
            )
              ? {
                  value: singleData?.intSoleDepoId,
                  label: singleData?.soleDepoName,
                }
              : "",
          region:
            +params?.id &&
            isSameMaketingAreaHandler(
              rowDto,
              singleData?.intRegionId,
              "intRegionId"
            )
              ? {
                  value: singleData?.intRegionId,
                  label: singleData?.regionName,
                }
              : "",
          area:
            +params?.id &&
            isSameMaketingAreaHandler(
              rowDto,
              singleData?.intAreaId,
              "intAreaId"
            )
              ? {
                  value: singleData?.intAreaId,
                  label: singleData?.areaName,
                }
              : "",
          territory:
            +params?.id &&
            isSameMaketingAreaHandler(
              rowDto,
              singleData?.intTerritoryId,
              "intTerritoryId"
            )
              ? {
                  value: singleData?.intTerritoryId,
                  label: singleData?.territoryName,
                }
              : "",
        }
      : salaryGenerateInitialValues,
    onSubmit: (values) => saveHandler(values),
  });

  return (
    <>
      <form onSubmit={handleSubmit}>
        {loading && <Loading />}
        {permission?.isView ? (
          <div className="table-card">
            <div className="table-card-heading">
              <div className="d-flex align-items-center">
                <BackButton />
                <h2>{`Salary Generate Request`}</h2>
              </div>
            </div>
            <div className="table-card-body">
              <div
                className="card-style"
                style={{ margin: "14px 0px 12px 0px" }}
              >
                <div className="row">
                  <div className="col-lg-3">
                    <div className="input-field-main">
                      <label>Salary Type</label>
                      <FormikSelect
                        name="salaryTpe"
                        options={
                          [
                            {
                              value: "Salary",
                              label: "Full Salary",
                            },
                            {
                              value: "PartialSalary",
                              label: "Partial Salary",
                            },
                          ] || []
                        }
                        value={values?.salaryTpe}
                        onChange={(valueOption) => {
                          setValues((prev) => ({
                            ...prev,
                            salaryTpe: valueOption,
                            businessUnit: "",
                            workplaceGroup: "",
                            workplace: "",
                            payrollGroup: "",
                          }));
                        }}
                        placeholder=""
                        styles={customStyles}
                        errors={errors}
                        touched={touched}
                        isDisabled={singleData}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 d-none">
                    <div className="input-field-main">
                      <label>Business Unit</label>
                      <FormikSelect
                        name="businessUnit"
                        options={businessUnitDDL || []}
                        value={values?.businessUnit}
                        onChange={(valueOption) => {
                          setValues((prev) => ({
                            ...prev,
                            businessUnit: valueOption,
                            workplaceGroup: "",
                            workplace: "",
                            payrollGroup: "",
                          }));
                        }}
                        placeholder=""
                        styles={customStyles}
                        errors={errors}
                        touched={touched}
                        isDisabled={singleData}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="input-field-main">
                      <label>Payroll Month</label>
                      <DefaultInput
                        // disabled={!values?.workplace}
                        classes="input-sm"
                        placeholder=" "
                        value={values?.monthYear}
                        disabled={singleData}
                        name="monthYear"
                        type="month"
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
                          }));
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>

                  {values?.salaryTpe?.value === "PartialSalary" && (
                    <>
                      <div className="col-lg-3">
                        <div className="input-field-main">
                          <label>From Date</label>
                          <DefaultInput
                            classes="input-sm"
                            placeholder=" "
                            value={values?.fromDate}
                            name="fromDate"
                            type="date"
                            onChange={(e) => {
                              setValues((prev) => ({
                                ...prev,
                                fromDate: e.target.value,
                              }));
                            }}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="input-field-main">
                          <label>To Date</label>
                          <DefaultInput
                            classes="input-sm"
                            placeholder=" "
                            value={values?.toDate}
                            name="toDate"
                            type="date"
                            onChange={(e) => {
                              setValues((prev) => ({
                                ...prev,
                                toDate: e.target.value,
                              }));
                            }}
                            min={values?.fromDate}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                    </>
                  )}
                  <div className="col-md-3">
                    <div className="input-field-main">
                      <label>Description</label>
                      <DefaultInput
                        classes="input-sm "
                        placeholder=" "
                        value={values?.description}
                        name="description"
                        type="text"
                        onChange={(e) => {
                          setFieldValue("description", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                  <div className="col-md-9 d-flex">
                    {values?.salaryTpe?.value === "PartialSalary" ? (
                      <button
                        style={{
                          padding: "0px 10px",
                          marginTop:
                          values?.salaryTpe?.value === "PartialSalary"
                            ? "21px"
                            : "0px",
                        }}
                        className="btn btn-default mr-2"
                        type="button"
                        onClick={() => {
                          if (+params?.id) {
                            if (!isSameWgEmployee) {
                              return toast.warning(
                                "Salary generate must be same workplace group!"
                              );
                            }

                            getSalaryGenerateRequestLandingById(
                              "SalaryGenerateRequestRowByRequestId",
                              orgId,
                              buId,
                              wgId,
                              +params?.id,
                              true,
                              values?.intMonth,
                              values?.intYear,
                              values?.fromDate,
                              values?.toDate,
                              setRowDto,
                              setAllData,
                              setLoading,
                              wId,
                              {
                                current: pages?.current,
                                pageSize: 500,
                              },
                              setPages,
                              setAllEmployeeString,
                              values?.wing?.value,
                              values?.soleDepo?.value,
                              values?.region?.value,
                              values?.area?.value,
                              values?.territory?.value
                            );
                          } else {
                            getSalaryGenerateRequestLanding(
                              "EmployeeListForSalaryGenerateRequest",
                              orgId,
                              buId,
                              wgId,
                              wId,
                              values?.monthId,
                              values?.yearId,
                              values?.fromDate,
                              values?.toDate,
                              setRowDto,
                              setAllData,
                              setLoading,
                              pages,
                              setPages,
                              setAllEmployeeString,
                              values?.wing?.value,
                              values?.soleDepo?.value,
                              values?.region?.value,
                              values?.area?.value,
                              values?.territory?.value
                            );
                          }
                        }}
                        disabled={
                          !values?.salaryTpe ||
                          // !values?.businessUnit ||
                          !values?.monthYear ||
                          !values?.fromDate ||
                          !values?.toDate
                        }
                      >
                        Show
                      </button>
                    ) : (
                      <button
                        style={{
                          padding: "0px 10px",
                        }}
                        className="btn btn-default mr-2"
                        type="button"
                        onClick={() => {
                          if (+params?.id) {
                            if (!isSameWgEmployee) {
                              return toast.warning(
                                "Salary generate must be same workplace group!"
                              );
                            }

                            getSalaryGenerateRequestLandingById(
                              "SalaryGenerateRequestRowByRequestId",
                              orgId,
                              buId,
                              wgId,
                              +params?.id,
                              true,
                              state?.intMonth,
                              state?.intYear,
                              values?.fromDate,
                              values?.toDate,
                              setRowDto,
                              setAllData,
                              setLoading,
                              wId,
                              pages,
                              setPages,
                              setAllEmployeeString,
                              values?.wing?.value,
                              values?.soleDepo?.value,
                              values?.region?.value,
                              values?.area?.value,
                              values?.territory?.value
                            );
                          } else {
                            getSalaryGenerateRequestLanding(
                              "EmployeeListForSalaryGenerateRequest",
                              orgId,
                              buId,
                              wgId,
                              wId,
                              values?.monthId,
                              values?.yearId,
                              values?.fromDate,
                              values?.toDate,
                              setRowDto,
                              setAllData,
                              setLoading,
                              pages,
                              setPages,
                              setAllEmployeeString,
                              values?.wing?.value,
                              values?.soleDepo?.value,
                              values?.region?.value,
                              values?.area?.value,
                              values?.territory?.value
                            );
                          }
                        }}
                        disabled={!values?.salaryTpe || !values?.monthYear}
                      >
                        Show
                      </button>
                    )}
                    {allData?.filter((itm) => itm?.isSalaryGenerate === true)
                      ?.length > 0 && (
                      <button
                        style={{
                          padding: "0px 10px",
                          marginTop:
                            values?.salaryTpe?.value === "PartialSalary"
                              ? "21px"
                              : "0px",
                        }}
                        className="btn btn-default"
                        type="submit"
                      >
                        {state?.intSalaryGenerateRequestId
                          ? "Re-Generate " +
                              allData?.filter(
                                (itm) => itm?.isSalaryGenerate === true
                              )?.length || 0
                          : "Generate " +
                              allData?.filter(
                                (itm) => itm?.isSalaryGenerate === true
                              )?.length || 0}
                      </button>
                    )}
                    {allEmployeeString && (
                      <button
                        style={{
                          padding: "0px 10px",
                          marginTop:
                            values?.salaryTpe?.value === "PartialSalary"
                              ? "21px"
                              : "0px",
                        }}
                        className="btn btn-default ml-2"
                        type="button"
                        onClick={() => {
                          setAllAssign(true);
                          allBulkSalaryGenerateHandler(values, allData);
                        }}
                      >
                        {state?.intSalaryGenerateRequestId
                          ? "Re-Generate All " + pages?.total || 0
                          : "Generate All " + pages?.total || 0}
                      </button>
                    )}
                  </div>
                </div>
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
                Employee Salary Generate List
              </h2>

              <ul className="d-flex flex-wrap">
                {values?.search && (
                  <li>
                    {/* <ResetButton
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
                      styles={{
                        marginRight: "16px",
                      }}
                      onClick={() => {
                        setRowDto(allData);
                        setFieldValue("search", "");
                      }}
                    /> */}
                  </li>
                )}
                <li>
                  {/* <MasterFilter
                    isHiddenFilter
                    value={searchKeyWord}
                    setValue={(value) => {
                      if (value === "") {
                        setSearchKeyWord("");
                        setAllData(allLanding);
                        setRowDto(allLanding);
                      } else {
                        setSearchKeyWord(value);
                        filterData(value);
                      }
                    }}
                    cancelHandler={() => {
                      setSearchKeyWord("");
                      getData();
                    }}
                    handleClick={() => {}}
                    width="200px"
                    inputWidth="200px"
                  /> */}
                  {/* <DefaultInput
                    classes="search-input"
                    inputClasses="search-inner-input"
                    placeholder="Search"
                    value={values?.search}
                    name="search"
                    type="text"
                    trailicon={
                      <SearchOutlined
                        sx={{
                          color: "#323232",
                          fontSize: "18px",
                        }}
                      />
                    }
                    onChange={(e) => {
                      filterData(e.target.value);
                      setFieldValue("search", e.target.value);
                    }}
                    errors={errors}
                    touched={touched}
                  /> */}
                </li>
              </ul>
            </div>
            <div>
              {allData?.length > 0 ? (
                <>
                  <div className="table-card-styled employee-table-card tableOne customAntTable">
                    <AntTable
                      data={allData}
                      columnsData={salaryGenerateCreateEditTableColumn(
                        setAllData,
                        pages,
                        allData,
                        setFieldValue
                      )}
                      setColumnsData={(newRow) => {
                        setAllData(newRow);
                      }}
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
                </>
              ) : (
                <NoResult title="No result found" />
              )}
            </div>
          </div>
        ) : (
          <NotPermittedPage />
        )}
        {/* addEdit form Modal */}
        <TaxAssignCheckerModal
          show={open}
          title={"UnAssigned Employee List For Tax"}
          onHide={handleClose}
          size="lg"
          backdrop="static"
          classes="default-modal"
          takeHomePayTax={takeHomePayTax}
          values={values}
          singleData={singleData}
          isEdit={isEdit}
          resetForm={resetForm}
          initialValues={salaryGenerateInitialValues}
          setIsEdit={setIsEdit}
          getLandingData={getLandingData}
          setLoading={setLoading}
          loading={loading}
          rowDto={rowDto}
          setRowDto={setRowDto}
          params={params}
          state={state}
          setAllData={setAllData}
        />
      </form>
    </>
  );
};

export default SalaryGenerateCreate;
