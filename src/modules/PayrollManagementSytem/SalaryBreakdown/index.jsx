import { EditOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import AntTable from "../../../common/AntTable";
import FormikCheckBox from "../../../common/FormikCheckbox";
import FormikInput from "../../../common/FormikInput";
import FormikSelect from "../../../common/FormikSelect";
import Loading from "../../../common/loading/Loading";
import NoResult from "../../../common/NoResult";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import {
  gray500,
  gray700,
  gray900,
  greenColor,
  success800,
} from "../../../utility/customColor";
import { customStyles } from "../../../utility/selectCustomStyle";
import { todayDate } from "../../../utility/todayDate";
import {
  payrollGroupCalculation,
  payrollGroupElementList,
} from "./calculation";
import { defaultSetter } from "./calculation/defaultCalculation";
import { desiFarmerSetter } from "./calculation/desiFarmer";
import { iFarmerSetter } from "./calculation/iFarmar";
import {
  getAllAppliedSalaryBreakdownList,
  getAllSalaryPolicyDDL,
  getPayrollElementDDL,
  salaryBreakdownCreateNApply,
} from "./helper";
import "./styles.css";
import { getPeopleDeskWithoutAllDDL } from "../../../common/api";

const initData = {
  breakdownTitle: "",
  payrollPolicy: "",
  payScale: "",
  dependsOn: "",
  basedOn: "",
  businessUnit: "",
  workplaceGroup: "",
  workplace: "",
  department: "",
  designation: "",
  employeeType: "",
  payrollElement: "",
  isSalaryBreakdown: false,
  isDefaultBreakdown: false,
  isPerdaySalary: false,
};

const validationSchema = Yup.object().shape({
  breakdownTitle: Yup.string().required("Payroll group is required"),
  payrollPolicy: Yup.object()
    .shape({
      label: Yup.string().required("Payroll Policy is required"),
      value: Yup.string().required("Payroll Policy is required"),
    })
    .typeError("Payroll Policy is required"),
  payScale: Yup.object()
    .shape({
      label: Yup.string().required("Workplace Group is required"),
      value: Yup.string().required("Workplace Group is required"),
    })
    .typeError("Workplace Group is required"),
});

const SalaryBreakdown = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const scrollRef = useRef();
  const { state } = useLocation();

  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [isFreeze, setIsFreeze] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // ddl
  const [payrollPolicyDDL, setPayrollPolicyDDL] = useState([]);
  const [payrollElementDDL, setPayrollElementDDL] = useState([]);
  // const [hrPositionDDL, setHrPositionDDL] = useState([]);
  const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState([]);

  // gross form
  const [dynamicForm, setDynamicForm] = useState([]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let salaryBreakdownPermission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30260) {
      salaryBreakdownPermission = item;
    }
  });

  // for initial
  useEffect(() => {
    getAllSalaryPolicyDDL(orgId, buId, setPayrollPolicyDDL);
    getPayrollElementDDL(orgId, setPayrollElementDDL);
  }, [orgId, buId, employeeId]);

  useEffect(() => {
    getAllAppliedSalaryBreakdownList(
      orgId,
      buId,
      0,
      0,
      0,
      0,
      0,
      employeeId,
      setRowDto,
      setLoading
    );
  }, [orgId, buId, employeeId]);

  useEffect(() => {
    getPeopleDeskWithoutAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplaceGroup&BusinessUnitId=${buId}&intId=${employeeId}&WorkplaceGroupId=0`,
      "intWorkplaceGroupId",
      "strWorkplaceGroup",
      setWorkplaceGroupDDL
    );
  }, [orgId, buId, employeeId]);

  // state
  useEffect(() => {
    if (state?.singleBreakdown?.intSalaryBreakdownHeaderId) {
      payrollGroupElementList(
        orgId,
        state?.singleBreakdown?.intSalaryBreakdownHeaderId,
        setDynamicForm
      );
      setSingleData({
        breakdownTitle: state?.singleBreakdown?.strSalaryBreakdownTitle,
        payrollPolicy: {
          value: state?.singleBreakdown?.intSalaryPolicyId,
          label: state?.singleBreakdown?.strSalaryPolicy,
        },
        // dependsOn: {
        //   value: state?.singleBreakdown?.strDependOn === "Gross" ? 1 : 2,
        //   label: state?.singleBreakdown?.strDependOn,
        // },
        businessUnit: {
          value: state?.singleBreakdown?.intBusinessUnitId,
          label: state?.singleBreakdown?.strBusinessUnit,
        },
        workplaceGroup: {
          value: state?.singleBreakdown?.intWorkplaceGroupId,
          label: state?.singleBreakdown?.strWorkplaceGroup,
        },
        workplace: {
          value: state?.singleBreakdown?.intWorkplaceId,
          label: state?.singleBreakdown?.strWorkplace,
        },
        department: {
          value: state?.singleBreakdown?.intDepartmentId,
          label: state?.singleBreakdown?.strDepartment,
        },
        designation: {
          value: state?.singleBreakdown?.intDesignationId,
          label: state?.singleBreakdown?.strDesignation,
        },
        employeeType: {
          value: state?.singleBreakdown?.intEmploymentTypeId,
          label: state?.singleBreakdown?.strEmploymentType,
        },
        payScale: {
          value: state?.singleBreakdown?.intWorkplaceGroupId,
          label: state?.singleBreakdown?.workplaceGroup,
        },
        isPerdaySalary: state?.singleBreakdown?.isPerday,
        isDefaultBreakdown: state?.singleBreakdown?.isDefault,
      });
    }
  }, [orgId, state]);

  const setter = (values) => {
    const payload = {
      intSalaryBreakdownRowId: 0,
      intSalaryBreakdownHeaderId: 0,
      intDependsOn: values?.dependsOn?.value,
      strDependOn: values?.dependsOn?.label,
      strBasedOn: values?.basedOn?.label,
      intPayrollElementTypeId: values?.payrollElement?.value,
      levelVariable: values?.payrollElement?.label
        .toLowerCase()
        .split(" ")
        .join(""),
      strPayrollElementName: values?.payrollElement?.label,
      isBasic: values?.payrollElement?.isBasic,
      numNumberOfPercent: 0,
      numAmount: 0,
      isActive: true,
      dteCreatedAt: todayDate(),
      intCreatedBy: employeeId,
      dteUpdatedAt: todayDate(),
      intUpdatedBy: employeeId,
    };

    switch (orgId) {
      case 10026:
        return desiFarmerSetter(values, dynamicForm, payload, setDynamicForm);

      case 10015:
        return iFarmerSetter(values, dynamicForm, payload, setDynamicForm);

      default:
        return defaultSetter(values, dynamicForm, payload, setDynamicForm);
    }
  };

  const remover = (payload) => {
    const filterArr = dynamicForm.filter(
      (itm) => itm?.levelVariable !== payload
    );
    setDynamicForm([...filterArr]);
  };

  const rowDtoHandler = (name, index, value) => {
    const data = [...dynamicForm];
    data[index][name] = value;
    setDynamicForm(data);
  };

  const saveHandler = (values, cb) => {
    const callback = () => {
      cb();
      setIsFreeze(false);
      setIsEdit(false);
      setSingleData("");
      getAllAppliedSalaryBreakdownList(
        orgId,
        buId,
        0,
        0,
        0,
        0,
        0,
        employeeId,
        setRowDto,
        setLoading
      );
      setDynamicForm([]);
      history.push({
        pathname: `/administration/payrollConfiguration/salaryBreakdown`,
        state: { singleBreakdown: " " },
      });
    };

    let payload = {
      strSalaryBreakdownTitle: values?.breakdownTitle,
      intAccountId: orgId,
      intSalaryPolicyId: values?.payrollPolicy?.value,
      intHrPositonId: 0,
      intWorkplaceGroupId: values?.payScale?.value,
      isPerday: values?.isPerdaySalary || false,
      isDefault: values?.isDefaultBreakdown || false,
      isActive: true,
      dteCreatedAt: todayDate(),
      intCreatedBy: employeeId,
      dteUpdatedAt: todayDate(),
      intUpdatedBy: employeeId,
    };

    if (values?.isPerdaySalary) {
      payload = {
        ...payload,
        intSalaryBreakdownHeaderId:
          singleData?.intSalaryBreakdownHeaderId ||
          state?.singleBreakdown?.intSalaryBreakdownHeaderId ||
          0,
        strDependOn: "",
        pyrSalaryBreakdowRowList: [],
      };
      salaryBreakdownCreateNApply(payload, setLoading, callback);
    } else {
      if (dynamicForm?.length <= 0) {
        return toast.warn("Payroll Element List is empty!!!");
      }

      payrollGroupCalculation(
        orgId,
        employeeId,
        payload,
        singleData,
        state,
        dynamicForm,
        values,
        setLoading,
        callback
      );
    }
  };

  const columns = (values, setValues) => {
    return [
      {
        title: "SL",
        render: (text, record, index) => index + 1,
        sorter: false,
        filter: false,
      },
      {
        title: "Payroll Group Name",
        dataIndex: "strSalaryBreakdownTitle",
        sorter: true,
        filter: false,
      },
      {
        title: "Payroll Policy",
        dataIndex: "strSalaryPolicy",
        sorter: true,
        filter: false,
      },
      {
        title: "Workplace group",
        dataIndex: "workplaceGroup",
        sorter: true,
        filter: false,
      },
      // {
      //   title: "Depends On",
      //   dataIndex: "strDependOn",
      //   sorter: true,
      //   filter: false,
      // },
      {
        title: "Is Default",
        dataIndex: "isDefault",
        render: (data) => <div>{data ? "Yes" : "No"}</div>,
        sorter: true,
        filter: false,
      },
      {
        title: "",
        dataIndex: "",
        render: (data, item) => (
          <div className=" d-flex align-items-center justify-content-end ">
            <Tooltip title="Edit" arrow>
              <button
                type="button"
                className="iconButton d-none"
                onClick={(e) => {
                  e.stopPropagation();
                  scrollRef.current.scrollIntoView({
                    behavior: "smooth",
                  });
                  if (!item?.isPerday) {
                    payrollGroupElementList(
                      orgId,
                      item?.intSalaryBreakdownHeaderId,
                      setDynamicForm
                    );
                  }
                  setSingleData(item);
                  setIsEdit(true);
                  setValues({
                    ...values,
                    breakdownTitle: item?.strSalaryBreakdownTitle,
                    payrollPolicy: {
                      value: item?.intSalaryPolicyId,
                      label: item?.strSalaryPolicy,
                    },
                    businessUnit: {
                      value: item?.intBusinessUnitId,
                      label: item?.strBusinessUnit,
                    },
                    workplaceGroup: {
                      value: item?.intWorkplaceGroupId,
                      label: item?.strWorkplaceGroup,
                    },
                    workplace: {
                      value: item?.intWorkplaceId,
                      label: item?.strWorkplace,
                    },
                    department: {
                      value: item?.intDepartmentId,
                      label: item?.strDepartment,
                    },
                    designation: {
                      value: item?.intDesignationId,
                      label: item?.strDesignation,
                    },
                    employeeType: {
                      value: item?.intEmploymentTypeId,
                      label: item?.strEmploymentType,
                    },
                    payScale: {
                      value: item?.intWorkplaceGroupId,
                      label: item?.workplaceGroup,
                    },
                    isPerdaySalary: item?.isPerday,
                    isDefaultBreakdown: item?.isDefault,
                  });
                }}
              >
                <EditOutlined sx={{ fontSize: "20px" }} />
              </button>
            </Tooltip>
          </div>
        ),
        sorter: false,
        filter: false,
      },
    ];
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={
        state?.singleBreakdown?.intSalaryBreakdownHeaderId
          ? singleData
          : initData
      }
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
        });
      }}
    >
      {({
        handleSubmit,
        resetForm,
        setValues,
        errors,
        touched,
        values,
        setFieldValue,
      }) => (
        <>
          {loading && <Loading />}
          <Form onSubmit={handleSubmit}>
            {salaryBreakdownPermission?.isCreate ? (
              <>
                <div className="table-card">
                  <div className="table-card-heading mt-2" ref={scrollRef}>
                    <h2>Payroll Group</h2>
                  </div>
                  <div className="card-style" style={{ marginTop: "16px" }}>
                    <div className="row align-items-center">
                      <div className="col-lg-3">
                        <div className="input-field-main">
                          <label>Payroll Group Name</label>
                          <FormikInput
                            placeholder=" "
                            classes="input-sm"
                            name="breakdownTitle"
                            value={values?.breakdownTitle}
                            type="text"
                            onChange={(e) => {
                              setFieldValue("breakdownTitle", e.target.value);
                            }}
                            errors={errors}
                            touched={touched}
                            disabled={isFreeze}
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
                            setFieldValue("payrollPolicy", valueOption);
                          }}
                          placeholder=" "
                          styles={customStyles}
                          isSearchable={false}
                          isClearable={false}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <div className="input-field-main">
                          <label>Workplace Group </label>
                          <FormikSelect
                            menuPosition="fixed"
                            name="payScale"
                            options={workplaceGroupDDL || []}
                            value={values?.payScale}
                            onChange={(valueOption) => {
                              setFieldValue("payScale", valueOption);
                            }}
                            styles={customStyles}
                            placeholder=""
                            errors={errors}
                            touched={touched}
                            isClearable={false}
                          />
                        </div>
                      </div>
                      <div className="col-lg-2">
                        <div style={{ margin: "10px 0 0" }}>
                          <FormikCheckBox
                            height="15px"
                            styleObj={{
                              color: gray900,
                              checkedColor: greenColor,
                              padding: "0px 0px 0px 5px",
                            }}
                            label="Is perday salary?"
                            name="isPerdaySalary"
                            checked={values?.isPerdaySalary}
                            onChange={(e) => {
                              // setDynamicForm([]);
                              setFieldValue("dependsOn", "");
                              setFieldValue("basedOn", "");
                              setFieldValue("payrollElement", "");
                              setFieldValue("isPerdaySalary", e.target.checked);
                            }}
                          />
                        </div>
                      </div>

                      {!values?.isPerdaySalary && (
                        <div className="col-lg-3">
                          <label>Depends on</label>
                          <FormikSelect
                            name="dependsOn"
                            options={[
                              { value: 1, label: "Gross" },
                              { value: 2, label: "Basic" },
                            ]}
                            value={values?.dependsOn}
                            onChange={(valueOption) => {
                              // setDynamicForm([]);
                              setFieldValue("basedOn", "");
                              setFieldValue("payrollElement", "");
                              setFieldValue("dependsOn", valueOption);
                            }}
                            placeholder=" "
                            styles={customStyles}
                            isSearchable={false}
                            isClearable={false}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      )}

                      <div className="col-12"></div>

                      {!values?.isPerdaySalary && (
                        <>
                          <div className="col-lg-3">
                            <label>Based On</label>
                            <FormikSelect
                              name="basedOn"
                              options={[
                                { value: 1, label: "Percentage" },
                                { value: 2, label: "Amount" },
                              ]}
                              value={values?.basedOn}
                              onChange={(valueOption) => {
                                setFieldValue("basedOn", valueOption);
                              }}
                              placeholder=" "
                              styles={customStyles}
                              isSearchable={false}
                              isClearable={false}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="col-lg-3">
                            <label>Payroll Element</label>
                            <FormikSelect
                              name="payrollElement"
                              options={payrollElementDDL || []}
                              value={values?.payrollElement}
                              onChange={(valueOption) => {
                                setFieldValue("payrollElement", valueOption);
                              }}
                              placeholder=" "
                              styles={customStyles}
                              isSearchable={false}
                              isClearable={false}
                              errors={errors}
                              touched={touched}
                              // isDisabled={isEdit || state?.singleBreakdown?.intSalaryBreakdownHeaderId}
                            />
                          </div>
                          <div className="col-lg-3">
                            <div className="d-flex align-items-center">
                              <button
                                type="button"
                                className="btn btn-green btn-green-disable"
                                style={{
                                  marginTop: "10px",
                                }}
                                onClick={() => {
                                  // setIsFreeze(true);
                                  setter(values);
                                }}
                                disabled={
                                  !values?.payrollElement ||
                                  !values?.basedOn ||
                                  !values?.dependsOn
                                  // isEdit ||
                                  // state?.singleBreakdown?.intSalaryBreakdownHeaderId
                                  // // !values?.businessUnit ||
                                  // !values?.workplaceGroup ||
                                  // !values?.workplace ||
                                  // !values?.department ||
                                  // !values?.designation ||
                                  // !values?.employeeType ||
                                  // !values?.payrollElement
                                }
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        </>
                      )}

                      <div className="col-12">
                        <div className="card-save-border"></div>
                      </div>
                      <div className="col-lg-3 d-none">
                        <FormikCheckBox
                          height="15px"
                          styleObj={{
                            color: gray900,
                            checkedColor: greenColor,
                            padding: "0px 0px 0px 5px",
                          }}
                          label="Is default?"
                          name="isDefaultBreakdown"
                          checked={values?.isDefaultBreakdown}
                          onChange={(e) => {
                            setFieldValue(
                              "isDefaultBreakdown",
                              e.target.checked
                            );
                          }}
                        />
                      </div>
                      <div className="col-12"></div>

                      {!values?.isPerdaySalary && dynamicForm?.length > 0 && (
                        <>
                          {/* no need existing busisness logic */}
                          <div className="col-lg-3 d-none">
                            <FormikCheckBox
                              height="15px"
                              styleObj={{
                                color: gray900,
                                checkedColor: greenColor,
                                padding: "0px 0px 0px 5px",
                              }}
                              label="Is salary breakdown manually?"
                              name="isSalaryBreakdown"
                              checked={values?.isSalaryBreakdown}
                              onChange={(e) => {
                                setFieldValue(
                                  "isSalaryBreakdown",
                                  e.target.checked
                                );
                              }}
                            />
                          </div>
                          <div className="col-12">
                            <h2
                              style={{
                                color: gray700,
                                fontWeight: "400",
                                fontSize: "14px",
                                lineHeight: "20px",
                                margin: "12px 0 8px",
                              }}
                            >
                              Primary elements
                            </h2>
                          </div>
                        </>
                      )}

                      {!values?.isPerdaySalary &&
                        dynamicForm?.length > 0 &&
                        dynamicForm?.map((itm, index) => {
                          return (
                            <div className="col-lg-3" key={index}>
                              <div className="input-field-main">
                                <div className="d-flex align-items-center">
                                  <div>
                                    <label>
                                      {itm?.strPayrollElementName}
                                      {itm?.strBasedOn === "Percentage" &&
                                        `( % )`}
                                      {`[Depends on ${
                                        itm?.strDependOn === "Basic"
                                          ? "Basic"
                                          : "Gross"
                                      }]`}
                                    </label>
                                    <span
                                      style={{
                                        color: success800,
                                        fontWeight: "500",
                                        fontSize: "12px",
                                        lineHeight: "18px",
                                        textDecoration: "underline",
                                        cursor: "pointer",
                                        marginLeft: "8px",
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        remover(itm?.levelVariable);
                                        setFieldValue(
                                          `${itm?.levelVariable}`,
                                          0
                                        );
                                      }}
                                    >
                                      Remove
                                    </span>
                                  </div>
                                </div>
                                <div className="form-container">
                                  <div className="form-group login-input input-xl input-sm">
                                    <input
                                      className="form-control"
                                      value={itm[itm?.levelVariable]}
                                      name={itm?.levelVariable}
                                      placeholder=" "
                                      type="number"
                                      onChange={(e) => {
                                        rowDtoHandler(
                                          `${itm?.levelVariable}`,
                                          index,
                                          e.target.value
                                        );
                                      }}
                                      step="any"
                                      required
                                      errors={errors}
                                      touched={touched}
                                      // disabled={isEdit || state?.singleBreakdown?.intSalaryBreakdownHeaderId}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      <div className="col-12">
                        <div className="card-save-border"></div>
                      </div>
                      <div className="col-lg-3">
                        <div className="d-flex align-items-center">
                          <button
                            type="submit"
                            className="btn btn-green btn-green-disable"
                          >
                            {isEdit ||
                            state?.singleBreakdown?.intSalaryBreakdownHeaderId
                              ? "Update"
                              : "Save"}
                          </button>
                          {(isEdit ||
                            state?.singleBreakdown
                              ?.intSalaryBreakdownHeaderId) && (
                            <button
                              onClick={(e) => {
                                setIsEdit(false);
                                resetForm(initData);
                                setSingleData("");

                                if (
                                  !values?.isPerdaySalary ||
                                  values?.isPerdaySalary
                                ) {
                                  setDynamicForm([]);
                                }

                                history.push({
                                  pathname: `/administration/payrollConfiguration/salaryBreakdown`,
                                  state: { singleBreakdown: " " },
                                });
                              }}
                              className="btn btn-green ml-2"
                              type="button"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {rowDto?.length > 0 ? (
                    <>
                      <div className="table-card-body">
                        <div
                          className="table-card-heading"
                          style={{
                            marginBottom: "5px",
                            marginTop: "12px",
                          }}
                        >
                          <h2
                            style={{
                              color: gray500,
                              fontSize: "14px",
                            }}
                          >
                            Payroll Group List
                          </h2>
                        </div>
                        <div className="table-card-styled employee-table-card tableOne">
                          <AntTable
                            data={rowDto}
                            columnsData={columns(values, setValues)}
                            onRowClick={(item) => {
                              history.push({
                                pathname: `/administration/payrollConfiguration/salaryBreakdown/${item?.intSalaryBreakdownHeaderId}`,
                                state: item,
                              });
                            }}
                            rowKey={(record) =>
                              record?.intSalaryBreakdownHeaderId
                            }
                            rowClassName="pointer"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {!loading && <NoResult title="No Data Found" para="" />}
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <NotPermittedPage />
              </>
            )}
          </Form>
        </>
      )}
    </Formik>
  );
};

export default SalaryBreakdown;
