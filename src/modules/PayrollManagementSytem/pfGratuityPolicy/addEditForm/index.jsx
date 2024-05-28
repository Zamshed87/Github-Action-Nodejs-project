import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import BackButton from "../../../../common/BackButton";
import FormikRadio from "../../../../common/FormikRadio";
import {
  gray600,
  greenColor,
  success500,
} from "../../../../utility/customColor";
import DefaultInput from "../../../../common/DefaultInput";
import { createPfGratuityConfig } from "../helper";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import FormikSelect from "common/FormikSelect";
import { customStyles } from "utility/selectCustomStyle";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import PrimaryButton from "common/PrimaryButton";
import { DataTable } from "Components";
import { addHandler, header, isMultiHandler } from "../utils";
import { getPeopleDeskAllDDL } from "common/api";
import { toast } from "react-toastify";

const initData = {
  workplace: [],
  // profident fund
  providePF: "",
  companyBenefits: "",
  employeeContributionOfBasic: "",
  employerContributionOfBasic: "",
  numberOfEligibilityOfMonth: "",

  // gratuity
  provideGratuity: "",
  companyGratuity: "",

  //New Requirement
  dependsOn: "",
  employmentType: "",
  fromYear: "",
  toYear: "",
  multiplier: "",
};

const validationSchema = Yup.object().shape({
  workplace: Yup.array().required("Workplace is required!!!").min(1),
  providePF: Yup.string().required("Provide PF is required!!!"),
  companyBenefits: Yup.number()
    .min(1, "Must be greater than zero!!!")
    .required("Service length of company benefits is required"),
  employeeContributionOfBasic: Yup.number()
    .min(1, "Must be greater than zero!!!")
    .required("PF Employee Contribution Of Basic is required"),
  employerContributionOfBasic: Yup.number()
    .min(1, "Must be greater than zero!!!")
    .required("PF Employer Contribution Of Basic is required"),
  numberOfEligibilityOfMonth: Yup.number()
    .min(1, "Must be greater than zero!!!")
    .max(12, "Must be equal or less than 12 !!!")
    .required("PF Employer Contribution Of Basic is required"),
  provideGratuity: Yup.string().required("Provide Gratuity is required!!!"),
  // companyGratuity: Yup.number()
  //   .min(1, "Must be greater than zero!!!")
  //   .required("Service length (Years) for eligibility of company benefits is required"),
});

export default function PfGratuityPolicyForm() {
  const params = useParams();
  const history = useHistory();
  const { state } = useLocation();
  const dispatch = useDispatch();

  const { orgId, employeeId, buId, wId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  const [employmentTypeDDL, getEmploymentTypeDDL, , setEmploymentTypeDDL] =
    useAxiosGet([]);
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [workplaceDDL, setWorkplaceDDL] = useState([]);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30305) {
      permission = item;
    }
  });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
  }, [dispatch]);

  useEffect(() => {
    getEmploymentTypeDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmploymentType&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&IntWorkplaceId=${wId}&intId=0`,
      (res) => {
        const modifiedData = res?.map((item) => {
          return {
            value: item?.Id,
            label: item?.EmploymentType,
          };
        });
        const permanentData = modifiedData?.filter(
          (item) => item?.label?.toLowerCase() === "permanent".toLowerCase()
        );
        setEmploymentTypeDDL(permanentData);
      }
    );
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&AccountId=${orgId}&BusinessUnitId=${0}&WorkplaceGroupId=${wgId}&intId=${employeeId}`,
      "intWorkplaceId",
      "strWorkplace",
      setWorkplaceDDL
    );
    if (state?.intPfngratuityId) {
      setRowDto(state?.gratuityList);
    }
  }, [buId, wgId, wId]);

  const saveHandler = (values, cb) => {
    if (!rowDto?.length && values?.provideGratuity === "yes")
      return toast.warn("Please add at least one gratuity policy!!!", {
        toastId: "rowDto",
      });
    const callback = () => {
      cb();
      if (!+params?.id) {
        history.push("/administration/payrollConfiguration/PFAndGratuity");
      }
    };

    let payload = {
      intAccountId: orgId,
      isHasPfpolicy: values?.providePF === "yes" ? true : false,
      intNumOfEligibleYearForBenifit: +values?.companyBenefits,
      numEmployeeContributionOfBasic: +values?.employeeContributionOfBasic,
      numEmployerContributionOfBasic: +values?.employerContributionOfBasic,
      intNumOfEligibleMonthForPfinvestment: values?.numberOfEligibilityOfMonth,
      isHasGratuityPolicy: values?.provideGratuity === "yes" ? true : false,
      intNumOfEligibleYearForGratuity: +values?.companyGratuity || 0,
      intCreatedBy: employeeId,
      workplaceList: values?.workplace?.map((item) => ({
        intPfworkplace: item?.value,
        strPfworkPlaceName: item?.label,
        isactive: true,
      })),
      gratuityList: rowDto,
    };

    if (+params?.id) {
      payload = {
        ...payload,
        intPfngratuityId: state?.intPfngratuityId,
      };
    } else {
      payload = {
        ...payload,
        intPfngratuityId: 0,
      };
    }
    createPfGratuityConfig(payload, setLoading, callback);
  };

  const { setFieldValue, values, errors, touched, handleSubmit, resetForm } =
    useFormik({
      enableReinitialize: true,
      validationSchema: validationSchema,
      initialValues: +params?.id
        ? {
            ...initData,
            workplace: state?.workplaceList.map((item) => ({
              value: item?.intPfworkplace,
              label: item.strPfworkPlaceName,
            })),
            // provident fund
            providePF: state?.isHasPfpolicy ? "yes" : "no",
            companyBenefits: state?.intNumOfEligibleYearForBenifit,
            employeeContributionOfBasic: state?.numEmployeeContributionOfBasic,
            employerContributionOfBasic: state?.numEmployerContributionOfBasic,
            numberOfEligibilityOfMonth:
              state?.intNumOfEligibleMonthForPfinvestment,

            // gratuity
            provideGratuity: state?.isHasGratuityPolicy ? "yes" : "no",
            companyGratuity: state?.intNumOfEligibleYearForGratuity || 0,
          }
        : {
            ...initData,
          },
      onSubmit: (values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          if (params?.id) {
          } else {
            resetForm(initData);
          }
        });
      },
    });

  return (
    <>
      {loading && <Loading />}
      {permission?.isCreate ? (
        <form onSubmit={handleSubmit}>
          <div className="table-card">
            <div className="table-card-heading mb12">
              <div className="d-flex align-items-center">
                <BackButton />
                <h2>
                  {params?.id ? "Edit PF & Gratuity" : "Create PF & Gratuity"}
                </h2>
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
                  <button type="submit" className="btn btn-default flex-center">
                    Save
                  </button>
                </li>
              </ul>
            </div>
            <div className="table-card-body">
              <div className="col-md-12 px-0 mt-3">
                <div className="card-style">
                  <div className="row">
                    <div className="col-lg-3">
                      <div className="input-field-main">
                        <label>Workplace</label>
                        <FormikSelect
                          name="workplace"
                          isClearable={true}
                          options={[
                            { value: 0, label: "All" },
                            ...workplaceDDL,
                          ]}
                          value={values?.workplace}
                          onChange={(valueOption) => {
                            isMultiHandler({
                              valueOption,
                              name: "workplace",
                              setFieldValue,
                              workplaceDDL,
                            });
                          }}
                          styles={{
                            ...customStyles,
                            control: (provided, state) => ({
                              ...provided,
                              minHeight: "auto",
                              height:
                                values?.workplace?.length > 1 ? "auto" : "auto",
                              borderRadius: "4px",
                              boxShadow: `${success500}!important`,
                              ":hover": {
                                borderColor: `${gray600}!important`,
                              },
                              ":focus": {
                                borderColor: `${gray600}!important`,
                              },
                            }),
                            valueContainer: (provided, state) => ({
                              ...provided,
                              height:
                                values?.workplace?.length > 1 ? "auto" : "auto",
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
                          isMulti
                          errors={errors}
                          placeholder="Select..."
                          touched={touched}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <h2>Provident Fund Configuration</h2>
                    </div>
                    <div
                      className="col-12"
                      style={{ marginBottom: "12px" }}
                    ></div>
                    <div className="col-lg-12">
                      <div className="input-field-main">
                        <label>Do your company provide PF?</label>
                        <div>
                          <FormikRadio
                            styleobj={{
                              iconWidth: "15px",
                              icoHeight: "15px",
                              padding: "0px 8px 0px 10px",
                              checkedColor: greenColor,
                            }}
                            name="providePF"
                            label="Yes"
                            value={"yes"}
                            onChange={(e) => {
                              setFieldValue("providePF", e.target.value);
                            }}
                            checked={values?.providePF === "yes"}
                          />
                          <FormikRadio
                            styleobj={{
                              iconWidth: "15px",
                              icoHeight: "15px",
                              padding: "0px 8px 0px 10px",
                            }}
                            name="providePF"
                            label="No"
                            value={"no"}
                            onChange={(e) => {
                              setFieldValue("providePF", e.target.value);
                            }}
                            checked={values?.providePF === "no"}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="input-field-main">
                        <label>Eligibility of company benefits</label>
                        <div className="d-flex align-items-baseline">
                          <span
                            className="mr-1"
                            style={{
                              fontSize: "12px",
                            }}
                          >
                            Service length (Years)
                          </span>
                          <DefaultInput
                            inputClasses="w-80"
                            classes="input-sm"
                            value={values?.companyBenefits}
                            name="companyBenefits"
                            type="number"
                            placeholder=" "
                            onChange={(e) => {
                              setFieldValue("companyBenefits", e.target.value);
                            }}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="input-field-main">
                        <label>PF Employee Contribution Of Basic</label>
                        <div className="d-flex align-items-baseline">
                          <span
                            className="mr-1"
                            style={{
                              fontSize: "12px",
                            }}
                          >
                            Amount of percentage (%)
                          </span>
                          <DefaultInput
                            inputClasses="w-80"
                            classes="input-sm"
                            value={values?.employeeContributionOfBasic}
                            name="employeeContributionOfBasic"
                            type="number"
                            placeholder=" "
                            onChange={(e) => {
                              setFieldValue(
                                "employeeContributionOfBasic",
                                e.target.value
                              );
                            }}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="input-field-main">
                        <label>PF Employer Contribution Of Basic</label>
                        <div className="d-flex align-items-baseline">
                          <span
                            className="mr-1"
                            style={{
                              fontSize: "12px",
                            }}
                          >
                            Amount of percentage (%)
                          </span>
                          <DefaultInput
                            inputClasses="w-80"
                            classes="input-sm"
                            value={values?.employerContributionOfBasic}
                            name="employerContributionOfBasic"
                            type="number"
                            placeholder=" "
                            onChange={(e) => {
                              setFieldValue(
                                "employerContributionOfBasic",
                                e.target.value
                              );
                            }}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="input-field-main">
                        <label>
                          After how many months will the investment be eligible?
                        </label>
                        <div className="d-flex align-items-baseline">
                          <DefaultInput
                            inputClasses="w-80"
                            classes="input-sm"
                            value={values?.numberOfEligibilityOfMonth}
                            name="numberOfEligibilityOfMonth"
                            type="number"
                            placeholder=" "
                            onChange={(e) => {
                              setFieldValue(
                                "numberOfEligibilityOfMonth",
                                e.target.value
                              );
                            }}
                            errors={errors}
                            touched={touched}
                          />
                          <span
                            className="ml-1"
                            style={{
                              fontSize: "12px",
                            }}
                          >
                            months
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-12"
                      style={{ marginBottom: "12px" }}
                    ></div>
                    <div className="col-12">
                      <h2>Gratuity Configuration</h2>
                    </div>
                    <div
                      className="col-12"
                      style={{ marginBottom: "12px" }}
                    ></div>
                    <div className="col-lg-12">
                      <div className="input-field-main">
                        <label>Do your company provide gratuity?</label>
                        <div>
                          <FormikRadio
                            styleobj={{
                              iconWidth: "15px",
                              icoHeight: "15px",
                              padding: "0px 8px 0px 10px",
                              checkedColor: greenColor,
                            }}
                            name="provideGratuity"
                            label="Yes"
                            value={"yes"}
                            onChange={(e) => {
                              setFieldValue("provideGratuity", e.target.value);
                            }}
                            checked={values?.provideGratuity === "yes"}
                          />
                          <FormikRadio
                            styleobj={{
                              iconWidth: "15px",
                              icoHeight: "15px",
                              padding: "0px 8px 0px 10px",
                            }}
                            name="provideGratuity"
                            label="No"
                            value={"no"}
                            onChange={(e) => {
                              setFieldValue("provideGratuity", e.target.value);
                            }}
                            checked={values?.provideGratuity === "no"}
                          />
                        </div>
                      </div>
                    </div>
                    {/* <div className="col-lg-12">
                      <div className="input-field-main">
                        <label>
                          Service length (Years) for eligibility of company
                          benefits
                        </label>
                        <div className="d-flex align-items-baseline">
                          <DefaultInput
                            inputClasses="w-80"
                            classes="input-sm"
                            value={values?.companyGratuity}
                            name="companyGratuity"
                            type="number"
                            placeholder=" "
                            onChange={(e) => {
                              setFieldValue("companyGratuity", e.target.value);
                            }}
                            errors={errors}
                            touched={touched}
                          />
                          <span
                            className="ml-1"
                            style={{
                              fontSize: "12px",
                            }}
                          >
                            years
                          </span>
                        </div>
                      </div>
                    </div> */}
                    {values?.provideGratuity === "yes" ? (
                      <>
                        <div className="col-lg-12">
                          <div className="row">
                            <div className="col-lg-2">
                              <div className="input-field-main">
                                <label>Depends On</label>
                                <FormikSelect
                                  name="dependsOn"
                                  options={[
                                    { value: 1, label: "Basic" },
                                    { value: 2, label: "Gross" },
                                  ]}
                                  value={values?.dependsOn}
                                  onChange={(valueOption) => {
                                    setFieldValue("dependsOn", valueOption);
                                  }}
                                  isClearable={true}
                                  styles={customStyles}
                                  errors={errors}
                                  touched={touched}
                                />
                              </div>
                            </div>
                            <div className="col-lg-2">
                              <div className="input-field-main">
                                <label>Employment Type</label>
                                <FormikSelect
                                  name="employmentType"
                                  options={employmentTypeDDL || []}
                                  value={values?.employmentType}
                                  onChange={(valueOption) => {
                                    setFieldValue(
                                      "employmentType",
                                      valueOption
                                    );
                                  }}
                                  isClearable={true}
                                  styles={customStyles}
                                  errors={errors}
                                  touched={touched}
                                />
                              </div>
                            </div>
                            <div className="col-lg-2">
                              <div className="input-field-main">
                                <label>From (No of Years)</label>
                                <div className="d-flex align-items-baseline">
                                  <DefaultInput
                                    classes="input-sm"
                                    value={values?.fromYear}
                                    name="fromYear"
                                    type="number"
                                    placeholder=" "
                                    onChange={(e) => {
                                      if (e.target.value > 0) {
                                        setFieldValue(
                                          "fromYear",
                                          e.target.value
                                        );
                                      } else {
                                        setFieldValue("fromYear", "");
                                      }
                                    }}
                                    min="1"
                                    errors={errors}
                                    touched={touched}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="row">
                            <div className="col-lg-2">
                              <div className="input-field-main">
                                <label>To (No of Years)</label>
                                <div className="d-flex align-items-baseline">
                                  <DefaultInput
                                    classes="input-sm"
                                    value={values?.toYear}
                                    name="toYear"
                                    type="number"
                                    placeholder=" "
                                    onChange={(e) => {
                                      if (e.target.value > 0) {
                                        setFieldValue("toYear", e.target.value);
                                      } else {
                                        setFieldValue("toYear", "");
                                      }
                                    }}
                                    min="1"
                                    errors={errors}
                                    touched={touched}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-2">
                              <div className="input-field-main">
                                <label>Multiplier</label>
                                <div className="d-flex align-items-baseline">
                                  <DefaultInput
                                    classes="input-sm"
                                    value={values?.multiplier}
                                    name="multiplier"
                                    type="number"
                                    placeholder=" "
                                    onChange={(e) => {
                                      if (e.target.value > 0) {
                                        setFieldValue(
                                          "multiplier",
                                          e.target.value
                                        );
                                      } else {
                                        setFieldValue("multiplier", "");
                                      }
                                    }}
                                    min="1"
                                    errors={errors}
                                    touched={touched}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-2 mt-1">
                              <PrimaryButton
                                type="button"
                                className="btn btn-default flex-center mt-3"
                                label={"ADD"}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addHandler(values, rowDto, setRowDto, () => {
                                    setFieldValue("dependsOn", "");
                                    setFieldValue("employmentType", "");
                                    setFieldValue("fromYear", "");
                                    setFieldValue("toYear", "");
                                    setFieldValue("multiplier", "");
                                  });
                                }}
                                disabled={
                                  !values?.dependsOn ||
                                  !values?.employmentType ||
                                  !values?.fromYear ||
                                  !values?.toYear ||
                                  !values?.multiplier
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <DataTable
                            header={header(rowDto, setRowDto, "createEdit")}
                            bordered
                            data={rowDto || []}
                          />
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <NotPermittedPage />
      )}
    </>
  );
}
