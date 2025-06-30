import {
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PInput,
  PSelect,
} from "Components";
import { Col, Divider, Form, Row } from "antd";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getAllAppliedSalaryBreakdownList,
  getAllSalaryPolicyDDL,
  getPayrollElementDDL,
  getWorkplaceDDL,
  salaryBreakdownCreate,
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
import Loading from "common/loading/Loading";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import FormulaInputWrapper from "Components/PForm/Input/Formula";

type TOvertimePolicy = unknown;
const PayrollGroupCreate: React.FC<TOvertimePolicy> = () => {
  // Data From Store
  const { orgId, buId, wgId, employeeId, wId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );
  const history = useHistory();
  const dispatch = useDispatch();
  const { state }: any = useLocation();

  // States
  const [loading, setLoading] = useState(false);
  const [singleData, setSingleData] = useState<any>({});
  // Form Instance
  const [form] = Form.useForm();
  // gross form
  const [dynamicForm, setDynamicForm] = useState<any>([]);

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
      // `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplaceGroup&BusinessUnitId=${buId}&intId=${employeeId}&WorkplaceGroupId=0`,
      `/PeopleDeskDdl/WorkplaceGroupIdAll?accountId=${orgId}&businessUnitId=${buId}`,
      "intWorkplaceGroupId",
      "strWorkplaceGroup",
      setWorkplaceGroupDDL
    );
  }, [orgId, buId, employeeId]);

  useEffect(() => {
    if (state?.intSalaryBreakdownHeaderId) {
      getWorkplaceDDL(
        orgId,
        buId,
        state?.intWorkplaceGroupId || 0,
        employeeId,
        setWorkplace
      );
      getPayrollElementDDL(
        orgId,
        setPayrollElementDDL,
        state?.intWorkplaceGroupId || 0,
        state?.intWorkplaceId || 0
      );
    }
  }, [orgId, buId, employeeId]);

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
        workplace: [state?.intWorkplaceId || null],
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
    const values = form.getFieldsValue(true);
    const callback = () => {
      // cb();
      setSingleData("");
      getAllAppliedSalaryBreakdownList(
        orgId,
        buId,
        wgId,
        wId,
        0,
        0,
        0,
        employeeId
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
      intWorkplaceId: values?.workplace[0],
      isPerday: values?.isPerdaySalary || false,
      isDefault: values?.isDefaultBreakdown || false,
      isActive: true,
      strDependOn: values?.dependsOn?.label,
      workplaceIdList: values?.workplace,
      dteCreatedAt: todayDate(),
      intCreatedBy: employeeId,
      dteUpdatedAt: todayDate(),
      intUpdatedBy: employeeId,
    };

    console.log(values);

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
      if (
        singleData?.intSalaryBreakdownHeaderId ||
        state?.intSalaryBreakdownHeaderId
      ) {
        salaryBreakdownCreateNApply(payload, setLoading, callback);
      } else {
        salaryBreakdownCreate(payload, setLoading, callback);
      }
    } else {
      if (dynamicForm?.length <= 0) {
        return toast.warn("Payroll Element List is empty!!!");
      }
      let temp: any = [];
      if (values?.dependsOn?.value === 2) {
        temp = [...dynamicForm];
        temp.push({
          intSalaryBreakdownRowId: 0,
          intSalaryBreakdownHeaderId: 0,
          intDependsOn: 1,
          strDependOn: "Basic",
          strBasedOn: "Amount",
          intPayrollElementTypeId: (
            payrollElementDDL?.filter((i: any) => i?.isBasic)?.[0] as any
          )?.value,
          levelVariable: "basic",
          strPayrollElementName: "Basic",
          isBasic: true,
          numNumberOfPercent: 0,
          numAmount: 0,
          isActive: true,
          intCreatedBy: employeeId,
          intUpdatedBy: employeeId,
        });
      }
      payrollGroupCalculation(
        orgId,
        employeeId,
        payload,
        singleData,
        state,
        values?.dependsOn?.value === 2 ? temp : dynamicForm,
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

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reordered = Array.from(dynamicForm);
    const [movedItem] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, movedItem);
    setDynamicForm(reordered); // You must store dynamicForm in a state
  };
  return (
    <>
      <PForm
        form={form}
        initialValues={{
          isPerdaySalary: false,
        }}
        onFinish={onFinish}
      >
        {loading && <Loading />}
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
                  disabled={
                    state?.intSalaryBreakdownHeaderId || dynamicForm?.length > 0
                  }
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
                  disabled={
                    state?.intSalaryBreakdownHeaderId || dynamicForm?.length > 0
                  }
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
                    form.resetFields(["workplace"]);
                    getWorkplaceDDL(
                      orgId,
                      buId,
                      value,
                      employeeId,
                      setWorkplace
                    );
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Please Select Workplace Group!",
                    },
                  ]}
                  disabled={
                    state?.intSalaryBreakdownHeaderId || dynamicForm?.length > 0
                  }
                />
              </Col>
              <Col md={6} sm={12}>
                <PSelect
                  label="Workplace"
                  name="workplace"
                  placeholder="Workplace Name"
                  options={workplace || []}
                  mode="multiple"
                  maxTagCount={"responsive"}
                  onSelect={(value, option) => {
                    // form.setFieldsValue({
                    //   workplace: option,
                    // });
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
                  disabled={
                    state?.intSalaryBreakdownHeaderId || dynamicForm?.length > 0
                  }
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
                  disabled={
                    state?.intSalaryBreakdownHeaderId || dynamicForm?.length > 0
                  }
                />
              </Col>

              <Form.Item noStyle shouldUpdate>
                {() => {
                  const { isPerdaySalary } = form.getFieldsValue(true);
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
                                isDedicated: false,
                              });
                            }}
                            // rules={[
                            //   {
                            //     required: true,
                            //     message: "Please Select Workplace!",
                            //   },
                            // ]}
                            disabled={
                              state?.intSalaryBreakdownHeaderId ||
                              dynamicForm?.length > 0
                            }
                          />
                        </Col>
                      </>
                    )
                  );
                }}
              </Form.Item>

              <Form.Item noStyle shouldUpdate>
                {() => {
                  const { dependsOn } = form.getFieldsValue(true);
                  return (
                    <>
                      {dependsOn?.value === 1 && (
                        <Col md={6} sm={12} className="mt-3">
                          <PInput
                            type="checkbox"
                            label="Is Flat Salary?"
                            name="isFlat"
                            layout="horizontal"
                            disabled={
                              state?.intSalaryBreakdownHeaderId ||
                              dynamicForm?.length > 0
                            }
                          />
                        </Col>
                      )}
                    </>
                  );
                }}
              </Form.Item>

              <Form.Item noStyle shouldUpdate>
                {() => {
                  // const { dependsOn } = form.getFieldsValue();
                  return (
                    <>
                      <Col md={6} sm={12} className="mt-3">
                        <PInput
                          type="checkbox"
                          label="Is Default"
                          name="isDefaultBreakdown"
                          layout="horizontal"
                        />
                      </Col>
                    </>
                  );
                }}
              </Form.Item>
            </Row>
            <Row gutter={[10, 2]}>
              <Form.Item noStyle shouldUpdate>
                {() => {
                  const { isPerdaySalary, payrollElement, basedOn, dependsOn } =
                    form.getFieldsValue(true);
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
                              { value: 3, label: "Calculative" },
                            ]}
                            onChange={(value, option) => {
                              form.setFieldsValue({
                                basedOn: option,
                              });
                            }}
                            disabled={state?.intSalaryBreakdownHeaderId}
                          />
                        </Col>
                        <Col md={6} sm={12}>
                          <PSelect
                            label="Payroll Element"
                            name="payrollElement"
                            placeholder="Payroll Element"
                            // as per discussion with parash vai basic depend on thakle basic true gula show korbe na
                            options={
                              dependsOn?.value === 2
                                ? payrollElementDDL?.filter(
                                    (i: any) => !i?.isBasic
                                  )
                                : payrollElementDDL || []
                            }
                            onChange={(value, option) => {
                              form.setFieldsValue({
                                payrollElement: option,
                              });
                            }}
                            disabled={state?.intSalaryBreakdownHeaderId}
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
                  const { isPerdaySalary, dependsOn } =
                    form.getFieldsValue(true);
                  return (
                    <>
                      {!isPerdaySalary && (
                        <DragDropContext onDragEnd={onDragEnd}>
                          <Droppable droppableId="salary-elements">
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                              >
                                {dynamicForm?.map((itm: any, index: number) => (
                                  <Draggable
                                    key={itm.levelVariable}
                                    draggableId={itm.levelVariable}
                                    index={index}
                                  >
                                    {(draggableProvided) => (
                                      <div
                                        className="d-flex align-items-center"
                                        ref={draggableProvided.innerRef}
                                        {...draggableProvided.draggableProps}
                                        {...draggableProvided.dragHandleProps}
                                        style={{
                                          ...draggableProvided.draggableProps
                                            .style,
                                          marginBottom: "12px",
                                        }}
                                      >
                                        <Col md={24} sm={24}>
                                          {/* BasedOn != Calculative */}
                                          {itm?.strBasedOn !== "Calculative" ? (
                                            <PInput
                                              type="number"
                                              label={
                                                <>
                                                  {itm?.strPayrollElementName}
                                                  {itm?.strBasedOn ===
                                                    "Percentage" && `(%)`}
                                                  {itm?.strBasedOn ===
                                                    "Amount" && `(#)`}
                                                  {` [Depends on ${
                                                    itm?.strDependOn === "Basic"
                                                      ? "Basic"
                                                      : "Gross"
                                                  }]`}
                                                  {!state?.intSalaryBreakdownHeaderId && (
                                                    <span
                                                      style={{
                                                        color: success800,
                                                        fontWeight: "500",
                                                        fontSize: "12px",
                                                        lineHeight: "18px",
                                                        textDecoration:
                                                          "underline",
                                                        cursor: "pointer",
                                                        marginLeft: "8px",
                                                      }}
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        remover(
                                                          itm?.levelVariable
                                                        );
                                                        form.setFieldsValue({
                                                          levelVariable:
                                                            itm?.levelVariable,
                                                        });
                                                      }}
                                                    >
                                                      Remove
                                                    </span>
                                                  )}
                                                </>
                                              }
                                              value={itm?.[itm?.levelVariable]}
                                              onChange={(value) => {
                                                rowDtoHandler(
                                                  `${itm?.levelVariable}`,
                                                  index,
                                                  value
                                                );
                                              }}
                                              disabled={
                                                state?.intSalaryBreakdownHeaderId
                                              }
                                            />
                                          ) : (
                                            <FormulaInputWrapper
                                              formulaOptions={
                                                dependsOn?.value === 2
                                                  ? payrollElementDDL?.filter(
                                                      (i: any) => !i?.isBasic
                                                    )
                                                  : payrollElementDDL || []
                                              }
                                              label={
                                                <>
                                                  {itm?.strPayrollElementName}{" "}
                                                  (Calc)
                                                  {` [Depends on ${
                                                    itm?.strDependOn === "Basic"
                                                      ? "Basic"
                                                      : "Gross"
                                                  }]`}
                                                  {!state?.intSalaryBreakdownHeaderId && (
                                                    <span
                                                      style={{
                                                        color: success800,
                                                        fontWeight: "500",
                                                        fontSize: "12px",
                                                        lineHeight: "18px",
                                                        textDecoration:
                                                          "underline",
                                                        cursor: "pointer",
                                                        marginLeft: "8px",
                                                      }}
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        remover(
                                                          itm?.levelVariable
                                                        );
                                                        form.setFieldsValue({
                                                          levelVariable:
                                                            itm?.levelVariable,
                                                        });
                                                      }}
                                                    >
                                                      Remove
                                                    </span>
                                                  )}
                                                </>
                                              }
                                              value={itm?.[itm?.levelVariable]}
                                              onChange={(e: any) => {
                                                console.log(
                                                  { e },
                                                  e.target?.value,
                                                  { dynamicForm }
                                                );

                                                rowDtoHandler(
                                                  itm?.levelVariable,
                                                  index,
                                                  e.target?.value
                                                );
                                              }}
                                              disabled={
                                                state?.intSalaryBreakdownHeaderId
                                              }
                                            />
                                          )}
                                        </Col>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </DragDropContext>
                      )}
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
