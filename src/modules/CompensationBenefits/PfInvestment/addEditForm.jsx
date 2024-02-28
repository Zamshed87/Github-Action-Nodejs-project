import { RefreshOutlined, SearchOutlined, SettingsBackupRestoreOutlined } from "@mui/icons-material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import * as Yup from "yup";
import { getPeopleDeskAllDDL } from "../../../common/api";
import AvatarComponent from "../../../common/AvatarComponent";
import BackButton from "../../../common/BackButton";
import DefaultInput from "../../../common/DefaultInput";
import FormikSelect from "../../../common/FormikSelect";
import Loading from "../../../common/loading/Loading";
import NoResult from "../../../common/NoResult";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import ResetButton from "../../../common/ResetButton";
import ScrollableTable from "../../../common/ScrollableTable";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { dateFormatterForInput } from "../../../utility/dateFormatter";
import { customStyles } from "../../../utility/selectCustomStyle";
import { todayDate } from "../../../utility/todayDate";
import { getBankBranchDDL, getEmployeeDataForPF, getValidPFInvestmentPeriod, savePFInvestment } from "./helper";

const initData = {
  search: "",
  businessUnit: "",
  pfFromDate: "",
  pfToDate: "",
  investmentReffNo: "",
  investmentDate: todayDate(),
  matureDate: todayDate(),
  investmentRate: "",
  accountNo: "",
  bank: "",
  distict: "",
  branch: "",
};

const validationSchema = Yup.object().shape({
  businessUnit: Yup.object().shape({
    value: Yup.string().required("Business Unit is required"),
    label: Yup.string().required("Business Unit is required"),
  }).typeError("Business Unit is required"),
  pfFromDate: Yup.date().required("PF from date is required"),
  pfToDate: Yup.date().required("PF to date is required"),
  investmentReffNo: Yup.string().required("Investment reff no. is required"),
  investmentDate: Yup.date().required("PF to date is required"),
  matureDate: Yup.date().required("PF to date is required"),
  investmentRate: Yup.number()
    .min(1, "Investment rate should be positive number")
    .required("Investment rate is required"),
  accountNo: Yup.string().required("Account no. is required"),
  bank: Yup.object().shape({
    value: Yup.string().required("Bank is required"),
    label: Yup.string().required("Bank is required"),
  }).typeError("Bank is required"),
  distict: Yup.object().shape({
    value: Yup.string().required("District is required"),
    label: Yup.string().required("District is required"),
  }).typeError("District is required"),
  branch: Yup.object().shape({
    value: Yup.string().required("Branch is required"),
    label: Yup.string().required("Branch is required"),
  }).typeError("Branch is required"),
});

export default function PFInvestmentForm() {
  const params = useParams();
  const dispatch = useDispatch();

  const { orgId, buId, employeeId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 204) {
      permission = item;
    }
  });

  // state
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);
  const [validDate, setValidDate] = useState("");

  // DDl section
  const [businessUnitDDL, setBusinessUnitDDL] = useState([]);
  const [bankDDL, setBankDDL] = useState([]);
  const [districtDDL, setDistrictDDL] = useState([]);
  const [bankBranchDDL, setBankBranchDDL] = useState([]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
  }, [dispatch]);

  useEffect(() => {
    getValidPFInvestmentPeriod(orgId, buId, setValidDate, setLoading);
  }, [orgId, buId]);

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=BusinessUnit&BusinessUnitId=${buId}&WorkplaceGroupId=0&intId=${employeeId}`,
      "intBusinessUnitId",
      "strBusinessUnit",
      setBusinessUnitDDL
    );
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Bank&WorkplaceGroupId=${wgId}&BusinessUnitId=${buId}&intId=0`,
      "BankID",
      "BankName",
      setBankDDL
    );
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=District&WorkplaceGroupId=${wgId}`,
      "DistrictId",
      "DistrictName",
      setDistrictDDL
    );
  }, [wgId, buId, employeeId]);

  // filter data
  const filterData = (keywords) => {
    try {
      const regex = new RegExp(keywords?.toLowerCase());
      let newDta = allData?.filter(
        (item) =>
          regex.test(item?.strEmployeeName?.toLowerCase()) ||
          regex.test(item?.strEmployeeCode?.toLowerCase()) ||
          regex.test(item?.strDepartment?.toLowerCase()) ||
          regex.test(item?.strDesignation?.toLowerCase())
      );
      setRowDto(newDta);
    } catch {
      setRowDto([]);
    }
  };

  const saveHandler = (values, cb) => {
    const callback = () => {
      cb();
    };

    const modifyRowDto = rowDto.map(itm => {
      return {
        ...itm,
        intRowId: itm?.intRowId,
        intInvenstmentHeaderId: itm?.intInvenstmentHeaderId,
        intEmployeeId: itm?.intEmployeeId,
        strEmployeeName: itm?.strEmployeeName,
        intDesignationId: itm?.intDesignationId,
        strDesignation: itm?.strDesignation,
        intDepartmentId: itm?.intDepartmentId,
        strDepartment: itm?.strDepartment,
        intEmploymentTypeId: itm?.intEmploymentTypeId,
        strEmploymentType: itm?.strEmploymentType,
        strServiceLength: itm?.strServiceLength,
        numEmployeeContribution: itm?.numEmployeeContribution,
        numEmployerContribution: itm?.numEmployerContribution,
        numTotalAmount: itm?.numTotalAmount,
        isActive: itm?.isActive,
        intCreatedBy: employeeId,
        strEmployeeCode: itm?.strEmployeeCode,
        numInterestRate: itm?.numInterestRate,
        numInterestAmount: itm?.numInterestAmount,
        numGrandTotalAmount: itm?.numTotalAmount
      }
    });

    let payload = {
      header: {
        intAccountId: orgId,
        intBusinessUnitId: buId,
        dtePfPeriodFromMonthYear: values?.pfFromDate,
        dtePfPeriodToMonthYear: values?.pfToDate,
        strInvestmentCode: "",
        strInvestmentReffNo: values?.investmentReffNo,
        dteInvestmentDate: values?.investmentDate,
        dteMatureDate: values?.matureDate,
        numInterestRate: values?.investmentRate,
        intBankId: values?.bank?.value,
        strBankName: values?.bank?.label,
        intBankBranchId: values?.branch?.value,
        strBankBranchName: values?.branch?.label,
        strRoutingNo: values?.branch?.name,
        strAccountName: "",
        strAccountNumber: values?.accountNo,
        isActive: true,
        intCreatedBy: employeeId,
        numInvestmentAmount: 0,
        numInterestAmount: 0,
        strStatus: ""
      },
      rowList: modifyRowDto
    };

    if (params?.id) {
      payload = {
        ...payload
      };
    } else {
      payload = {
        ...payload,
        intInvenstmentHeaderId: 0,
      };
    }
    savePFInvestment(payload, setLoading, callback);
  };

  // useFormik hooks
  const {
    values,
    errors,
    touched,
    handleSubmit,
    resetForm,
    setValues,
    setFieldValue
  } = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues: {
      ...initData,
      pfFromDate: dateFormatterForInput(validDate?.dtePfPeriodFromMonthYear),
      pfToDate: dateFormatterForInput(validDate?.dtePfPeriodToMonthYear),
    },
    onSubmit: (values, { setSubmitting, resetForm }) => {
      saveHandler(values, () => {
        if (params?.id) {

        } else {
          setRowDto([]);
          setAllData([]);
          resetForm(initData);
        }
      });
    },
  });

  return (
    <>
      <form onSubmit={handleSubmit}>
        {loading && <Loading />}
        {permission?.isCreate ? (
          <>
            <div className="table-card">
              <div
                className="table-card-heading"
                style={{ marginBottom: "12px" }}
              >
                <div className="d-flex align-items-center">
                  <BackButton />
                  <h2>{`Create PF Investment`}</h2>
                </div>
                <ul className="d-flex flex-wrap">
                  <li>
                    <button
                      type="button"
                      className="btn btn-cancel mr-2"
                      onClick={() => {
                        resetForm(initData);
                      }}
                    >
                      Reset
                    </button>
                  </li>
                  <li>
                    <button type="submit" className="btn btn-green w-100">
                      Save
                    </button>
                  </li>
                </ul>
              </div>
              <div className="card-style" style={{ marginBottom: "12px" }}>
                <div className="row">
                  <div className="col-lg-3">
                    <div className="input-field-main">
                      <label>Business Unit</label>
                    </div>
                    <FormikSelect
                      menuPosition="fixed"
                      name="businessUnit"
                      options={businessUnitDDL || []}
                      value={values?.businessUnit}
                      onChange={(valueOption) => {
                        setValues((prev) => ({
                          ...prev,
                          businessUnit: valueOption,
                        }));
                      }}
                      styles={customStyles}
                      errors={errors}
                      placeholder=" "
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <div className="input-field-main">
                      <label>PF Period From Date</label>
                      <DefaultInput
                        classes="input-sm"
                        placeholder=" "
                        value={values?.pfFromDate}
                        name="pfFromDate"
                        type="date"
                        onChange={(e) => {
                          setValues((prev) => ({
                            ...prev,
                            pfFromDate: e.target.value
                          }));
                        }}
                        errors={errors}
                        touched={touched}
                        disabled={dateFormatterForInput(validDate?.dtePfPeriodToMonthYear)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="input-field-main">
                      <label>PF Period To Date</label>
                      <DefaultInput
                        classes="input-sm"
                        placeholder=" "
                        value={values?.pfToDate}
                        name="pfToDate"
                        type="date"
                        onChange={(e) => {
                          setValues((prev) => ({
                            ...prev,
                            pfToDate: e.target.value,
                          }));
                        }}
                        errors={errors}
                        touched={touched}
                        min={dateFormatterForInput(validDate?.dtePfPeriodToMonthYear)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="d-flex" style={{ marginTop: "22px" }}>
                      <button
                        type="button"
                        className="btn btn-green mr-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          getEmployeeDataForPF(
                            orgId,
                            buId,
                            values?.pfFromDate,
                            values?.pfToDate,
                            setRowDto,
                            setAllData,
                            setLoading
                          );
                        }}
                        disabled={!values?.businessUnit}
                      >
                        View
                      </button>
                      {rowDto?.length > 0 && (
                        <button
                          type="button"
                          className="btn btn-green btn-green-less"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (params?.id) {

                            } else {
                              setRowDto([]);
                              setAllData([]);
                              resetForm(initData);
                            }
                          }}
                        >
                          <RefreshOutlined
                            sx={{ marginRight: "10px", fontSize: "18px" }}
                          />
                          Reset
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-style" style={{ marginBottom: "12px" }}>
                <div className="row">
                  <div className="col-lg-3">
                    <div className="input-field-main">
                      <label>Investment Reff No.</label>
                      <DefaultInput
                        classes="input-sm"
                        placeholder=" "
                        value={values?.investmentReffNo}
                        name="investmentReffNo"
                        type="text"
                        onChange={(e) => {
                          setValues((prev) => ({
                            ...prev,
                            investmentReffNo: e.target.value,
                          }));
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="input-field-main">
                      <label>Investment Date</label>
                      <DefaultInput
                        classes="input-sm"
                        placeholder=" "
                        value={values?.investmentDate}
                        name="investmentDate"
                        type="date"
                        onChange={(e) => {
                          setValues((prev) => ({
                            ...prev,
                            matureDate: "",
                            investmentDate: e.target.value,
                          }));
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="input-field-main">
                      <label>Mature Date</label>
                      <DefaultInput
                        classes="input-sm"
                        placeholder=" "
                        value={values?.matureDate}
                        name="matureDate"
                        type="date"
                        onChange={(e) => {
                          setValues((prev) => ({
                            ...prev,
                            matureDate: e.target.value,
                          }));
                        }}
                        min={values?.investmentDate}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="input-field-main">
                      <label>Investment Rate</label>
                      <DefaultInput
                        classes="input-sm"
                        placeholder=" "
                        value={values?.investmentRate}
                        name="investmentRate"
                        type="number"
                        onChange={(e) => {
                          setValues((prev) => ({
                            ...prev,
                            investmentRate: e.target.value,
                          }));
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="input-field-main">
                      <label>Account No</label>
                      <DefaultInput
                        classes="input-sm"
                        placeholder=" "
                        value={values?.accountNo}
                        name="accountNo"
                        type="text"
                        onChange={(e) => {
                          setValues((prev) => ({
                            ...prev,
                            accountNo: e.target.value,
                          }));
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="input-field-main">
                      <label>Bank</label>
                    </div>
                    <FormikSelect
                      menuPosition="fixed"
                      name="bank"
                      options={bankDDL || []}
                      value={values?.bank}
                      onChange={(valueOption) => {
                        setValues((prev) => ({
                          ...prev,
                          distict: "",
                          branch: "",
                          bank: valueOption,
                        }));
                        getBankBranchDDL(
                          valueOption?.value,
                          orgId,
                          values?.distict?.value || 0,
                          setBankBranchDDL
                        );
                      }}
                      styles={customStyles}
                      errors={errors}
                      placeholder=" "
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <div className="input-field-main">
                      <label>District</label>
                    </div>
                    <FormikSelect
                      menuPosition="fixed"
                      name="distict"
                      options={districtDDL || []}
                      value={values?.distict}
                      onChange={(valueOption) => {
                        setValues((prev) => ({
                          ...prev,
                          bank: values?.bank,
                          branch: "",
                          distict: valueOption,
                        }));
                        getBankBranchDDL(
                          values?.bank?.value,
                          orgId,
                          valueOption?.value || 0,
                          setBankBranchDDL
                        );
                      }}
                      styles={customStyles}
                      errors={errors}
                      placeholder=" "
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <div className="input-field-main">
                      <label>Branch</label>
                    </div>
                    <FormikSelect
                      menuPosition="fixed"
                      name="branch"
                      options={bankBranchDDL || []}
                      value={values?.branch}
                      onChange={(valueOption) => {
                        setValues((prev) => ({
                          ...prev,
                          bank: values?.bank,
                          distict: values?.distict,
                          branch: valueOption,
                        }));
                      }}
                      styles={customStyles}
                      errors={errors}
                      placeholder=" "
                      touched={touched}
                      isDisabled={!values?.bank}
                    />
                  </div>
                </div>
              </div>
              <div className="table-card-body" style={{ overflow: "hidden" }}>
                <div className="table-card-styled">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <p
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "#344054",
                        }}
                      >
                        Employee List
                      </p>
                      <p
                        style={{
                          fontSize: "12px",
                          fontWeight: 400,
                          color: "#667085",
                        }}
                      >
                        Total employee {rowDto?.length}
                      </p>
                    </div>
                    <div>
                      <ul className="d-flex flex-wrap align-items-center justify-content-center">
                        {values?.search && (
                          <li>
                            <ResetButton
                              classes="btn-filter-reset"
                              title="Reset"
                              icon={<SettingsBackupRestoreOutlined />}
                              onClick={() => {
                                setRowDto(allData);
                                setFieldValue("search", "");
                              }}
                            />
                          </li>
                        )}
                        <li>
                          <DefaultInput
                            classes="search-input fixed-width mt-2 mt-md-0 mb-2 mb-md-0 tableCardHeaderSeach"
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
                          />
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                {rowDto?.length > 0 ? (
                  <>
                    <div>
                      <ScrollableTable
                        classes="salary-process-table"
                        secondClasses="table-card-styled tableOne scroll-table-height"
                      >
                        <thead>
                          <tr>
                            <th rowSpan="2" style={{ width: "30px" }}>
                              SL
                            </th>
                            <th rowSpan="2">Employee Name</th>
                            <th rowSpan="2">Designation</th>
                            <th rowSpan="2">Department</th>
                            <th rowSpan="2">Employment Type</th>
                            <th rowSpan="2">Service Length</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowDto?.map((item, index) => (
                            <tr key={index}>
                              <td>
                                <div>{index + 1}</div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="emp-avatar">
                                    <AvatarComponent
                                      classess=""
                                      letterCount={1}
                                      label={item?.strEmployeeName}
                                    />
                                  </div>
                                  <div className="ml-2">
                                    <span className="tableBody-title">
                                      {item?.strEmployeeName}[{item?.intEmployeeId}]
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td>{item?.strDesignation}</td>
                              <td>{item?.strDepartment}</td>
                              <td>{item?.strEmploymentType}</td>
                              <td>{item?.strServiceLength}</td>
                            </tr>
                          ))}
                        </tbody>
                      </ScrollableTable>
                    </div>
                  </>
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
      </form>
    </>
  );
}
