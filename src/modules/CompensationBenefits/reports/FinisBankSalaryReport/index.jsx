import { DownloadOutlined } from "@ant-design/icons";
import BtnActionMenu from "common/BtnActionMenu";
import { useFormik } from "formik";
import { useApiRequest } from "Hooks";
import { useEffect, useRef, useState } from "react";
import { MdPrint } from "react-icons/md";
import { SiMicrosoftexcel } from "react-icons/si";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import useAxiosPost from "utility/customHooks/useAxiosPost";
import { todayDate } from "utility/todayDate";
import { getPeopleDeskAllDDL } from "../../../../common/api";
import DefaultInput from "../../../../common/DefaultInput";
import FormikSelect from "../../../../common/FormikSelect";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { gray500, gray600, success500 } from "../../../../utility/customColor";
import { downloadFile } from "../../../../utility/downloadFile";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { bankAdviceInitialValues, bankAdviceValidationSchema } from "./helper";

const FinisBankSalaryReport = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState([]);
  const [bankDDL, setBankDDL] = useState([]);
  const [workplaceDDL, setWorkplaceDDL] = useState([]);
  const [landingView, setLandingView] = useState("");
  const [adviceType, setAdviceType] = useState([]);
  const contentRef = useRef();

  const [bonusNameDDL, getBonusNameDDLAPI, , setBonusNameDDL] = useAxiosPost(
    []
  );
  const [bonusCodeDDL, getBonusCODEDDLAPI, , setBonusCodeDDL] = useAxiosGet([]);

  // DDl section
  const [bankAccountDDL, setBankAccountDDL] = useState([]);
  const [payrollPeriodDDL, setPayrollPeriodDDL] = useState([]);

  const { orgId, buId, employeeId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const { setFieldValue, values, errors, touched, setValues, handleSubmit } =
    useFormik({
      enableReinitialize: true,
      validationSchema: bankAdviceValidationSchema,
      initialValues: bankAdviceInitialValues,
      onSubmit: () => {
        saveHandler(values);
      },
    });
  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 114) {
      permission = item;
    }
  });

  const commonLanding = useApiRequest([]);
  // Functions
  const commonLandingFor = (values) => {
    if (values?.bankAdviceFor?.value === 1) {
      if (!values?.adviceName?.value) {
        return toast.warning("Please select Salary Code");
      }
    }
    const IntSalaryGenerateRequestId =
      values?.bankAdviceFor?.value === 1
        ? values?.adviceName?.value
        : values?.bonusCode?.value;

    commonLanding?.action({
      method: "get",
      urlKey: "commonLanding",
      params: {
        StrPartName: "htmlView",
        IntAccountId: orgId,
        IntBusinessUnitId: buId,
        IntWorkplaceGroupId: values?.workplaceGroup?.value,
        IntWorkplaceId: values?.workplace?.value,
        IntMonthId: values?.monthId,
        IntYearId: values?.yearId,
        IntBankId: values?.bank?.value,
        IntSalaryGenerateRequestId: IntSalaryGenerateRequestId,
        strAdviceType: values?.adviceType?.value,
        bankAdviceFor: values?.bankAdviceFor?.value,
        showUnapproved: true,
      },
      onSuccess: (res) => {
        setLandingView(res);
      },
    });
  };

  const landingApi = useApiRequest({});

  const landingApiCall = () => {
    landingApi.action({
      urlKey: "GetAllWorkplace",
      method: "GET",
      params: {
        accountId: orgId,
        businessUnitId: buId,
        workplaceGroupId: wgId,
      },
    });
  };

  useEffect(() => {
    landingApiCall();
  }, []);

  // on form submit
  const saveHandler = (values) => {
    commonLandingFor(values);
  };

  const getBonusNameList = () => {
    getBonusNameDDLAPI(
      `/Employee/BonusAllLanding`,
      {
        strPartName: "BonusNameList",
        intBonusHeaderId: 0,
        intAccountId: orgId,
        intBusinessUnitId: buId,
        intBonusId: 0,
        intPayrollGroupId: 0,
        intWorkplaceGroupId: 0,
        intReligionId: 0,
        dteEffectedDate: todayDate(),
        intCreatedBy: employeeId,
      },
      (res) => {
        const response = res
          ?.filter((b) => b?.label)
          ?.map((item) => ({
            ...item,
            value: item?.intBonusId,
            label: item?.strBonusName,
          }));
        setBonusNameDDL(response);
      }
    );
  };
  const getBonusCODEListHandler = (values) => {
    const month = `${values?.yearId}-${values?.monthId}-01`;
    getBonusCODEDDLAPI(
      `/Employee/BonusGenerateQueryAll?StrPartName=GetBonusCodebyBonusId&IntAccountId=${orgId}&IntBusinessUnitId=${buId}&WorkplaceGroupId=${values?.workplaceGroup?.value}&IntBonusId=${values?.bonusName?.value}&DteEffectedDate=${month}`,
      (res) => {
        const response = res
          ?.filter((b) => b?.strBonusGenerateCode)
          ?.map((item) => ({
            ...item,
            value: item?.intBonusHeaderId,
            label: item?.strBonusGenerateCode,
          }));
        setBonusCodeDDL(response);
      }
    );
  };

  useEffect(() => {
    getPeopleDeskAllDDL(
      // `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplaceGroup&WorkplaceGroupId=0&BusinessUnitId=${buId}&intId=${employeeId}`,
      `PeopleDeskDdl/WorkplaceGroupIdAll?accountId=${orgId}&businessUnitId=${buId}`,
      "intWorkplaceGroupId",
      "strWorkplaceGroup",
      setWorkplaceGroupDDL
    );
  }, [orgId, buId, employeeId, wgId]);

  //set to module
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    document.title = "Bank Advice";

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <form onSubmit={handleSubmit}>
      {(loading || commonLanding.loading) && <Loading />}
      {permission?.isView ? (
        <div className="table-card">
          <div className="table-card-heading mt-2 pt-1">
            <div className="d-flex align-items-center">
              <h2 className="ml-1">Bank Salary Report</h2>
            </div>
            <div className="table-header-right">
              <ul className="d-flex flex-wrap"></ul>
            </div>
          </div>
          <div className="table-card-body" style={{ marginTop: "12px" }}>
            <div className="card-style" style={{ margin: "14px 0px 12px 0px" }}>
              <div className="row">
                <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>Payroll Month</label>
                    <DefaultInput
                      classes="input-sm"
                      placeholder=" "
                      value={values?.monthYear}
                      name="monthYear"
                      type="month"
                      onChange={(e) => {
                        setValues((prev) => ({
                          ...prev,

                          yearId: +e.target.value
                            .split("")
                            .slice(0, 4)
                            .join(""),
                          monthId: +e.target.value.split("").slice(-2).join(""),
                          monthYear: e.target.value,
                          adviceName: "",
                        }));
                        if (
                          values?.workplaceGroup?.value &&
                          values?.bankAdviceFor?.value === 1
                        ) {
                          getPeopleDeskAllDDL(
                            `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=allSalarycodebyWorkplaceGroup&WorkplaceGroupId=${
                              values?.workplaceGroup?.value
                            }&BusinessUnitId=${buId}&IntMonth=${+e.target.value
                              .split("")
                              .slice(-2)
                              .join("")}&IntYear=${+e.target.value
                              .split("")
                              .slice(0, 4)
                              .join("")}`,
                            "value",
                            "label",
                            setPayrollPeriodDDL
                          );
                        }
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
                        setFieldValue("adviceName", "");
                        setFieldValue("bonusName", "");
                        setFieldValue("bonusCode", []);
                      }}
                      placeholder=""
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>Bank Advice For</label>
                    <FormikSelect
                      name="bankAdviceFor"
                      options={[
                        {
                          value: 1,
                          label: "Salary",
                        },
                        {
                          value: 2,
                          label: "Bonus",
                        },
                        {
                          value: 3,
                          label: "Advance Salary",
                        },
                      ]}
                      value={values?.bankAdviceFor}
                      onChange={(valueOption) => {
                        setWorkplaceDDL([]);
                        setFieldValue("bankAdviceFor", valueOption);
                        setFieldValue("adviceName", "");
                        setFieldValue("bonusName", "");
                        setFieldValue("bonusCode", []);
                        setFieldValue("workplace", "");
                        setFieldValue("bank", "");
                        setFieldValue("account", "");
                        setBankDDL([]);
                        setBankAccountDDL([]);
                        setWorkplaceDDL([]);
                        if (valueOption?.value === 2) {
                          getBonusNameList(values);
                        }
                        if (
                          values?.workplaceGroup?.value &&
                          valueOption?.value === 1
                        ) {
                          getPeopleDeskAllDDL(
                            `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=allSalarycodebyWorkplaceGroup&WorkplaceGroupId=${values?.workplaceGroup?.value}&BusinessUnitId=${buId}&IntMonth=${values?.monthId}&IntYear=${values?.yearId}`,
                            "value",
                            "label",
                            setPayrollPeriodDDL
                          );
                        } else if (
                          values?.workplaceGroup?.value &&
                          valueOption?.value === 3
                        ) {
                          getPeopleDeskAllDDL(
                            `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=advanceSalarycodebyWorkplaceGroup&WorkplaceGroupId=${values?.workplaceGroup?.value}&BusinessUnitId=${buId}&IntMonth=${values?.monthId}&IntYear=${values?.yearId}`,
                            "value",
                            "label",
                            setPayrollPeriodDDL
                          );
                        }
                      }}
                      placeholder=""
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                {values?.bankAdviceFor?.value === 1 ||
                values?.bankAdviceFor?.value === 3 ? (
                  <div className="col-lg-3">
                    <div className="input-field-main">
                      <label>Salary Code</label>
                      <FormikSelect
                        name="adviceName"
                        options={payrollPeriodDDL || []}
                        value={values?.adviceName}
                        onChange={(valueOption) => {
                          if (valueOption?.value) {
                            if (values?.bankAdviceFor?.value !== 3) {
                              getPeopleDeskAllDDL(
                                `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplacebySalaryGenerateRequestId&BusinessUnitId=${buId}&WorkplaceGroupId=${values?.workplaceGroup?.value}&intId=${valueOption?.value}`,
                                "value",
                                "label",
                                setWorkplaceDDL
                              );
                            } else {
                              getPeopleDeskAllDDL(
                                `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplacebyAdvanceSalaryId&BusinessUnitId=${buId}&WorkplaceGroupId=${values?.workplaceGroup?.value}&intId=${valueOption?.value}`,
                                "value",
                                "label",
                                setWorkplaceDDL
                              );
                            }
                          }
                          setValues((prev) => ({
                            ...prev,
                            workplace: "",
                            bank: "",
                            account: "",
                            adviceName: valueOption,
                          }));
                        }}
                        placeholder=""
                        styles={customStyles}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                {values?.bankAdviceFor?.value === 2 ? (
                  <>
                    <div className="col-lg-3">
                      <div className="input-field-main">
                        <label>Bonus Name</label>
                        <FormikSelect
                          name="bonusName"
                          options={bonusNameDDL || []}
                          value={values?.bonusName}
                          onChange={(valueOption) => {
                            setFieldValue("bonusName", valueOption);
                            if (
                              valueOption?.value &&
                              values?.workplaceGroup?.value
                            ) {
                              getBonusCODEListHandler({
                                ...values,
                                bonusName: valueOption,
                              });
                            }
                          }}
                          placeholder=""
                          styles={customStyles}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="input-field-main">
                        <label>Bonus Code</label>
                        <FormikSelect
                          name="bonusCode"
                          isClearable={false}
                          options={bonusCodeDDL || []}
                          value={values?.bonusCode}
                          onChange={(valueOption) => {
                            setWorkplaceDDL([]);
                            setFieldValue("bonusCode", valueOption);
                            if (valueOption) {
                              const api = `/Employee/BonusGenerateQueryAll?StrPartName=GetWorkplaceListbyBonusHeaderId&searchText=${valueOption?.value}`;
                              getPeopleDeskAllDDL(
                                api,
                                "intWorkPlaceId",
                                "strWorkplace",
                                setWorkplaceDDL
                              );
                            }
                          }}
                          styles={{
                            ...customStyles,
                            control: (provided) => ({
                              ...provided,
                              minHeight: "auto",
                              height:
                                values?.bonusCode?.length > 1 ? "auto" : "auto",
                              borderRadius: "4px",
                              boxShadow: `${success500}!important`,
                              ":hover": {
                                borderColor: `${gray600}!important`,
                              },
                              ":focus": {
                                borderColor: `${gray600}!important`,
                              },
                            }),
                            valueContainer: (provided) => ({
                              ...provided,
                              height:
                                values?.bonusCode?.length > 1 ? "auto" : "auto",
                              padding: "0 6px",
                            }),
                            multiValue: (styles) => {
                              return {
                                ...styles,
                                position: "relative",
                                top: "-1px",
                              };
                            },
                            multiValueLabel: (styles) => ({
                              ...styles,
                              padding: "0",
                            }),
                          }}
                          // isMulti
                          placeholder="Bonus Code"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}

                <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>Workplace</label>
                    <FormikSelect
                      name="workplace"
                      options={[...workplaceDDL] || []}
                      value={values?.workplace}
                      onChange={(valueOption) => {
                        setBankDDL([]);
                        if (valueOption?.value) {
                          getPeopleDeskAllDDL(
                            `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=BankListofBankAdvicebyWorkplaceId&AccountId=${orgId}&BusinessUnitId=${buId}&WorkplaceGroupId=${values?.workplaceGroup?.value}&intWorkplaceId=${valueOption?.value}`,
                            "value",
                            "label",
                            setBankDDL
                          );
                        }
                        setFieldValue("workplace", valueOption);
                        setFieldValue("bank", "");
                        setFieldValue("account", "");
                      }}
                      placeholder=""
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>

                <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>Bank Name</label>
                    <FormikSelect
                      name="bank"
                      options={[...bankDDL] || []}
                      value={values?.bank}
                      onChange={(valueOption) => {
                        setFieldValue("bank", valueOption);
                        setFieldValue("adviceType", "");
                        setFieldValue("account", "");
                        if (valueOption?.value) {
                          setAdviceType(JSON.parse(valueOption?.strBankAdvice));
                          getPeopleDeskAllDDL(
                            `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=BankAccountListofBankAdvicebyBankId&WorkplaceGroupId=${values?.workplaceGroup?.value}&BusinessUnitId=${buId}&intWorkplaceId=${values?.workplace?.value}&intId=${valueOption?.value}`,
                            "value",
                            "label",
                            setBankAccountDDL
                          );
                        }
                      }}
                      placeholder=""
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>Advice Type</label>
                    <FormikSelect
                      name="adviceType"
                      options={adviceType || []}
                      value={values?.adviceType}
                      onChange={(valueOption) => {
                        setFieldValue("adviceType", valueOption);
                      }}
                      placeholder=""
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>Account</label>
                    <FormikSelect
                      name="account"
                      options={[...bankAccountDDL] || []}
                      value={values?.account}
                      onChange={(valueOption) => {
                        setFieldValue("account", valueOption);
                      }}
                      placeholder=""
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div
                  className={
                    values?.bankAdviceFor?.value === 2
                      ? `mt-4 col-lg-3`
                      : `mt-3 col-lg-3`
                  }
                >
                  <button
                    className="btn btn-green btn-green-disable"
                    type="submit"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between">
              <div>
                <h2
                  style={{
                    color: gray500,
                    fontSize: "14px",
                    margin: "12px 0px 10px 0px",
                  }}
                >
                  Bank Advice List
                </h2>
              </div>
              <div>
                <ul className="d-flex flex-wrap">
                  <li className="mt-1 mr-2">
                    <BtnActionMenu
                      className="btn btn-default flex-center btn-deafult-create-job"
                      disabled={landingView === ""}
                      icon={
                        <DownloadOutlined
                          style={{
                            marginRight: "5px",
                            fontSize: "15px",
                          }}
                        />
                      }
                      label="Download"
                      options={[
                        {
                          value: 2,
                          label: "Download Excel",
                          icon: (
                            <SiMicrosoftexcel
                              style={{
                                marginRight: "5px",
                                color: gray500,
                                fontSize: "16px",
                              }}
                            />
                          ),
                          onClick: () => {
                            const IntSalaryGenerateRequestId =
                              values?.bankAdviceFor?.value === 1
                                ? values?.adviceName?.value
                                : values?.bonusCode?.value;

                            const url = `/PdfAndExcelReport/TopSheetNAdvice?StrPartName=excelView&IntAccountId=${orgId}&IntBusinessUnitId=${buId}&IntWorkplaceGroupId=${values?.workplaceGroup?.value}&IntWorkplaceId=${values?.workplace?.value}&IntMonthId=${values?.monthId}&IntYearId=${values?.yearId}&IntBankId=${values?.bank?.value}&IntSalaryGenerateRequestId=${IntSalaryGenerateRequestId}&StrAdviceType=${values?.adviceType?.value}&bankAdviceFor=${values?.bankAdviceFor?.value}&StrDownloadType=Advice`;

                            downloadFile(
                              url,
                              `${values?.workplace?.code}_${values?.adviceType?.label}_AdviceListExcel_${values?.monthId}-${values?.yearId}`,
                              "xlsx",
                              setLoading
                            );
                          },
                        },
                        {
                          value: 3,
                          label: "Download PDF",
                          icon: (
                            <MdPrint
                              style={{
                                marginRight: "5px",
                                color: gray500,
                                fontSize: "16px",
                              }}
                            />
                          ),
                          onClick: () => {
                            const IntSalaryGenerateRequestId =
                              values?.bankAdviceFor?.value === 1
                                ? values?.adviceName?.value
                                : values?.bonusCode?.value;

                            const url = `/PdfAndExcelReport/TopSheetNAdvice?StrPartName=pdfView&IntAccountId=${orgId}&IntBusinessUnitId=${buId}&IntWorkplaceGroupId=${values?.workplaceGroup?.value}&IntWorkplaceId=${values?.workplace?.value}&IntMonthId=${values?.monthId}&IntYearId=${values?.yearId}&IntBankId=${values?.bank?.value}&IntSalaryGenerateRequestId=${IntSalaryGenerateRequestId}&StrAdviceType=${values?.adviceType?.value}&bankAdviceFor=${values?.bankAdviceFor?.value}&StrDownloadType=Advice`;

                            downloadFile(
                              url,
                              `${values?.workplace?.code}_${values?.adviceType?.label}_AdviceListExcel_${values?.monthId}-${values?.yearId}`,
                              "pdf",
                              setLoading
                            );
                          },
                        },
                      ]}
                    />
                  </li>
                </ul>
              </div>
            </div>
            <div style={{ overflow: "scroll" }} className="mt-3 w-100">
              <div
                ref={contentRef}
                dangerouslySetInnerHTML={{
                  __html: landingView,
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        <NotPermittedPage />
      )}
    </form>
  );
};

export default FinisBankSalaryReport;
