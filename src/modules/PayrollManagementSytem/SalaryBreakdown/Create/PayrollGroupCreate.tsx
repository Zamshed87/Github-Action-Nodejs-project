import {
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PInput,
  PSelect,
} from "Components";
import { useApiRequest } from "Hooks";
import { Col, Divider, Form, Row } from "antd";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getAllAppliedSalaryBreakdownList,
  getAllSalaryPolicyDDL,
  getPayrollElementDDL,
  getWorkplaceDDL,
  salaryBreakdownCreateNApply,
} from "../helper";
import { getPeopleDeskWithoutAllDDL } from "common/api";
import { todayDate } from "utility/todayDate";
import { desiFarmerSetter } from "../calculation/desiFarmer";
import { iFarmerSetter } from "../calculation/iFarmar";
import { defaultSetter } from "../calculation/defaultCalculation";
import { success800 } from "utility/customColor";
import {
  payrollGroupCalculation,
  payrollGroupElementList,
} from "../calculation";

type TOvertimePolicy = unknown;
const PayrollGroupCreate: React.FC<TOvertimePolicy> = () => {
  // Data From Store
  const { orgId, buId, wgId, employeeId, wId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );
  const { workplaceDDL } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );
  const workplaceList = workplaceDDL?.map((item: any) => {
    return {
      value: item?.WorkplaceId,
      label: item?.WorkplaceName,
    };
  });

  const history = useHistory();
  const { state }: any = useLocation();

  // States
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState<any>({});
  const [isFreeze, setIsFreeze] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  // Form Instance
  const [form] = Form.useForm();
  // gross form
  const [dynamicForm, setDynamicForm] = useState([]);
  // Api Actions
  const EmploymentTypeDDL = useApiRequest([]);

  // ddl
  const [workplace, setWorkplace] = useState([]);
  const [payrollPolicyDDL, setPayrollPolicyDDL] = useState([]);
  const [payrollElementDDL, setPayrollElementDDL] = useState([]);
  const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState([]);
  // Life Cycle Hooks

  // for initial
  useEffect(() => {
    getAllSalaryPolicyDDL(orgId, buId, setPayrollPolicyDDL);

    // getPayrollElementDDL(orgId, setPayrollElementDDL, wgId);
  }, [orgId, buId, employeeId, wgId]);

  useEffect(() => {
    getPeopleDeskWithoutAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplaceGroup&BusinessUnitId=${buId}&intId=${employeeId}&WorkplaceGroupId=0`,
      "intWorkplaceGroupId",
      "strWorkplaceGroup",
      setWorkplaceGroupDDL
    );
  }, [orgId, buId, employeeId]);

  const getEmploymentTypeDDL = () => {
    const { workplace } = form.getFieldsValue(true);
    EmploymentTypeDDL?.action({
      method: "GET",
      urlKey: "PeopleDeskAllDDL",
      params: {
        DDLType: "EmploymentType",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        IntWorkplaceId: workplace?.value,
        intId: 0,
      },
      onSuccess: (data) => {
        data?.forEach((item: any, i: number) => {
          data[i].value = item?.Id;
          data[i].label = item?.EmploymentType;
        });
      },
    });
  };

  // state
  useEffect(() => {
    if (state?.intSalaryBreakdownHeaderId) {
      payrollGroupElementList(
        orgId,
        state?.intSalaryBreakdownHeaderId,
        setDynamicForm
      );
      form.setFieldsValue({
        breakdownTitle: state?.strSalaryBreakdownTitle,
        payrollPolicy: state?.intSalaryPolicyId
          ? {
              value: state?.intSalaryPolicyId,
              label: state?.strSalaryPolicy,
            }
          : undefined,
        businessUnit: {
          value: state?.intBusinessUnitId,
          label: state?.strBusinessUnit,
        },
        workplaceGroup: {
          value: state?.intWorkplaceGroupId || 0,
          label: state?.workplaceGroup || "",
        },
        workplace: {
          value: state?.intWorkplaceId || 0,
          label: state?.workplace || "",
        },
        department: {
          value: state?.intDepartmentId,
          label: state?.strDepartment,
        },
        designation: {
          value: state?.intDesignationId,
          label: state?.strDesignation,
        },
        employeeType: {
          value: state?.intEmploymentTypeId,
          label: state?.strEmploymentType,
        },
        payScale: {
          value: state?.intWorkplaceGroupId,
          label: state?.workplaceGroup,
        },
        isPerdaySalary: state?.isPerday,
        isFlat: state?.isFlat,

        isDefaultBreakdown: state?.isDefault,
      });
    }
  }, [orgId, state]);

  const onFinish = () => {
    const values = form.getFieldsValue();
    const callback = () => {
      // cb();
      setIsFreeze(false);
      setIsEdit(false);
      setSingleData("");
      getAllAppliedSalaryBreakdownList(
        orgId,
        buId,
        wgId,
        wId,
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
    let payload: any = {
      strSalaryBreakdownTitle: values?.breakdownTitle,
      intAccountId: orgId,
      intSalaryPolicyId: values?.payrollPolicy?.value,
      intHrPositonId: 0,
      intWorkplaceGroupId: values?.payScale?.value,
      intWorkplaceId: values?.workplace?.value,
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
          state?.intSalaryBreakdownHeaderId ||
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

  const remover = (payload: any) => {
    const filterArr = dynamicForm.filter(
      (itm: any) => itm?.levelVariable !== payload
    );
    setDynamicForm([...filterArr]);
  };

  const rowDtoHandler = (name: any, index: any, value: any) => {
    const data: any = [...dynamicForm];
    data[index][name] = value;
    setDynamicForm(data);
  };

  const setter = (values: any) => {
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
  console.log("dynamicForm", dynamicForm);
  return (
    <>
      <PForm
        form={form}
        initialValues={{
          isPerdaySalary: false,
        }}
        onFinish={onFinish}
      >
        <PCard>
          <PCardHeader
            title={`${
              state?.intSalaryBreakdownHeaderId ? "Edit" : "Create"
            } Payroll Group`}
            backButton
            submitText="Save"
          />
          <PCardBody>
            <Row gutter={[10, 2]}>
              <Col md={6} sm={12}>
                <PInput
                  type="text"
                  label="Payroll Group Name"
                  name="breakdownTitle"
                  placeholder="Payroll Group Name"
                  rules={[
                    {
                      required: true,
                      message: "Payroll Group Name is required!",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={12}>
                <PSelect
                  label="Payroll Policy"
                  name="payrollPolicy"
                  placeholder="Payroll Policy"
                  options={payrollPolicyDDL || []}
                  onChange={(value, option) => {
                    form.setFieldsValue({
                      payrollPolicy: option,
                    });
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Please Select Payroll Policy!",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={12}>
                <PSelect
                  label="Workplace Group"
                  name="payScale"
                  placeholder="Workplace Group"
                  options={workplaceGroupDDL || []}
                  onChange={(value, option) => {
                    form.setFieldsValue({
                      payScale: option,
                    });
                    getWorkplaceDDL(buId, value, employeeId, setWorkplace);
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Please Select Workplace Group!",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={12}>
                <PSelect
                  label="Workplace"
                  name="workplace"
                  placeholder="Workplace Name"
                  options={workplace || []}
                  onSelect={(value, option) => {
                    form.setFieldsValue({
                      workplace: option,
                    });
                    const { payScale } = form.getFieldsValue(true);
                    getPayrollElementDDL(
                      orgId,
                      setPayrollElementDDL,
                      payScale?.value,
                      value
                    );
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Please Select Workplace!",
                    },
                  ]}
                />
              </Col>

              <Col md={6} sm={12} className="mt-3">
                <PInput
                  type="checkbox"
                  label="Is perday salary?"
                  name="isPerdaySalary"
                  layout="horizontal"
                  onChange={() => {
                    form.setFieldsValue({
                      dependsOn: undefined,
                      baseOn: undefined,
                      payrollElement: undefined,
                    });
                  }}
                />
              </Col>

              <Form.Item noStyle shouldUpdate>
                {() => {
                  const { isPerdaySalary } = form.getFieldsValue();
                  return (
                    isPerdaySalary === false && (
                      <>
                        <Col md={6} sm={12}>
                          <PSelect
                            label="Depends on"
                            name="dependsOn"
                            placeholder="Depends on"
                            options={[
                              { value: 1, label: "Gross" },
                              { value: 2, label: "Basic" },
                            ]}
                            onChange={(value, option) => {
                              form.setFieldsValue({
                                basedOn: undefined,
                                payrollElement: undefined,
                                dependsOn: option,
                              });
                            }}
                            // rules={[
                            //   {
                            //     required: true,
                            //     message: "Please Select Workplace!",
                            //   },
                            // ]}
                          />
                        </Col>
                      </>
                    )
                  );
                }}
              </Form.Item>

              <Form.Item noStyle shouldUpdate>
                {() => {
                  const { dependsOn } = form.getFieldsValue();
                  return (
                    <>
                      {dependsOn?.value === 1 && (
                        <Col md={6} sm={12} className="mt-3">
                          <PInput
                            type="checkbox"
                            label="Is Flat Salary?"
                            name="isFlat"
                            layout="horizontal"
                          />
                        </Col>
                      )}
                    </>
                  );
                }}
              </Form.Item>
            </Row>
            <Row gutter={[10, 2]}>
              <Form.Item noStyle shouldUpdate>
                {() => {
                  const {
                    isPerdaySalary,
                    payScale,
                    payrollElement,
                    basedOn,
                    dependsOn,
                  } = form.getFieldsValue();
                  const values = form.getFieldsValue(true);
                  return (
                    isPerdaySalary === false && (
                      <>
                        <Col md={6} sm={12}>
                          <PSelect
                            label="Based On"
                            name="basedOn"
                            placeholder="Based On"
                            options={[
                              { value: 1, label: "Percentage" },
                              { value: 2, label: "Amount" },
                            ]}
                            onChange={(value, option) => {
                              form.setFieldsValue({
                                basedOn: option,
                              });
                            }}
                          />
                        </Col>
                        <Col md={6} sm={12}>
                          <PSelect
                            label="Payroll Element"
                            name="payrollElement"
                            placeholder="Payroll Element"
                            options={payrollElementDDL || []}
                            onChange={(value, option) => {
                              form.setFieldsValue({
                                payrollElement: option,
                              });
                            }}
                            // rules={[
                            //   {
                            //     required: true,
                            //     message: "Please Select Payroll Element!",
                            //   },
                            // ]}
                          />
                        </Col>
                        <Col md={6} sm={12}>
                          <PButton
                            className="mt-4"
                            type="primary"
                            content="Add"
                            disabled={!payrollElement || !basedOn || !dependsOn}
                            onClick={() => {
                              setter(values);
                            }}
                          />
                        </Col>
                      </>
                    )
                  );
                }}
              </Form.Item>
            </Row>

            <Divider
              style={{ margin: "15px 0", fontSize: 12 }}
              orientation="left"
            >
              Elements
            </Divider>

            <Row gutter={[24, 2]}>
              <Form.Item noStyle shouldUpdate>
                {() => {
                  const { isPerdaySalary } = form.getFieldsValue();
                  return (
                    <>
                      {!isPerdaySalary &&
                        dynamicForm?.map((itm: any, index: number) => {
                          console.log("item", itm);
                          console.log(itm?.[itm?.levelVariable]);
                          return (
                            <>
                              <div className="d-flex align-items-center">
                                <Col md={24} sm={24}>
                                  <PInput
                                    type="number"
                                    label={
                                      <>
                                        {itm?.strPayrollElementName}
                                        {itm?.strBasedOn === "Percentage" &&
                                          `( % )`}
                                        {`[Depends on ${
                                          itm?.strDependOn === "Basic"
                                            ? "Basic"
                                            : "Gross"
                                        }]`}
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
                                            form.setFieldsValue({
                                              levelVariable: itm?.levelVariable,
                                            });
                                          }}
                                        >
                                          Remove
                                        </span>
                                      </>
                                    }
                                    value={itm?.[itm?.levelVariable]}
                                    // name={itm?.levelVariable}
                                    onChange={(value) => {
                                      rowDtoHandler(
                                        `${itm?.levelVariable}`,
                                        index,
                                        value
                                      );
                                    }}
                                  />
                                </Col>
                              </div>
                            </>
                          );
                        })}
                    </>
                  );
                }}
              </Form.Item>
            </Row>
          </PCardBody>
        </PCard>
      </PForm>
    </>
  );
};

export default PayrollGroupCreate;
