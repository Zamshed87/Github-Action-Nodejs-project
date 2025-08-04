import {
  DataTable,
  PButton,
  PForm,
  PInput,
  PSelect,
  TableButton,
} from "Components";
import { ModalFooter } from "Components/Modal";
import { useApiRequest } from "Hooks";
import { Col, Divider, Form, Row } from "antd";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import CreateJobClass from "./CreateJobClass";
import { PlusCircleOutlined } from "@ant-design/icons";
import CreateGrade from "./CreateGrade";
import CreateJobLevel from "./CreateJoblevel";
import { toast } from "react-toastify";
import FormulaInputWrapper from "Components/PForm/Input/Formula";

type CreateEditPayscaleType = {
  rowData: any;
  landingApi: () => void;
  setOpen: any;
};
const CreateEditPayscale: React.FC<CreateEditPayscaleType> = ({
  rowData,
  landingApi,
  setOpen,
}) => {
  // Data From Store
  const { orgId, buId, wgId, wId, employeeId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );
  // Api Actions
  const savePayscale = useApiRequest({});
  const jobClassDDL = useApiRequest({});
  const policyDDL = useApiRequest({});
  const gradeDDL = useApiRequest({});
  const designationDDL = useApiRequest({});
  const jobLevelDDL = useApiRequest({});
  const getById = useApiRequest({});
  const elementDDL = useApiRequest({});
  const [elementDto, setElementDto] = useState<any[]>([]);
  const [incrementDto, setIncrementDto] = useState([]);
  const [designationDto, setDesignationDto] = useState([]);
  const [efficiencyDto, setEfficiencyDto] = useState([]);
  const getJobClassDDL = () => {
    jobClassDDL?.action({
      urlKey: "GetJobClassDdl",
      method: "get",
      params: {
        accountId: orgId,
        businessUnitId: buId,
      },
    });
  };
  const getGradeDDL = () => {
    const { jobClass } = form.getFieldsValue(true);

    gradeDDL?.action({
      urlKey: "GetJobGradeDdl",
      method: "get",
      params: {
        accountId: orgId,
        businessUnitId: buId,
        jobClassId: jobClass?.value,
      },
    });
  };
  const getDesignationDDL = () => {
    designationDDL?.action({
      urlKey: "DesignationIdWithAll",
      method: "GET",
      params: {
        accountId: orgId,
        businessUnitId: buId,
        workplaceGroupId: wgId,
        workplaceId: wId,
      },
    });
  };
  const getJobLevelDDL = () => {
    const { grade } = form.getFieldsValue(true);

    jobLevelDDL?.action({
      urlKey: "GetJobLevelDdl",
      method: "get",
      params: {
        accountId: orgId,
        businessUnitId: buId,
        jobGradeId: grade?.value,
      },
    });
  };
  const getElementDDL = () => {
    elementDDL?.action({
      urlKey: "GetAllSalaryElementByAccountIdDDL",
      method: "get",
      params: {
        accountId: orgId,
        businessUnitId: buId,
        workplaceGroupId: wgId,
        workplaceId: wId,
      },
    });
  };
  const getPolicyDDL = () => {
    policyDDL?.action({
      urlKey: "GetAllSalaryPolicy",
      method: "get",
      params: {
        accountId: orgId,
        businessUnitId: buId,
      },
      onSuccess: (res: any) => {
        res?.forEach((i: any, idx: any) => {
          res[idx].label = i?.strPolicyName;
          res[idx].value = i?.intPolicyId;
        });
      },
    });
  };
  // Form Instance
  const [form] = Form.useForm();

  useEffect(() => {
    getJobClassDDL();
    getDesignationDDL();
    getElementDDL();
    getPolicyDDL();
    // getGradeDDL();
    // getJobLevelDDL();
  }, []);
  //formula element handler
  const rowDtoHandler = (name: any, index: any, value: any) => {
    const data: any = [...elementDto];
    data[index][name] = value;
    const updated = calculateFormulaNetAmounts(data);
    setElementDto(updated);
  };

  //   Functions
  const onFinish = () => {
    const values = form.getFieldsValue(true);
    if (elementDto?.length === 0) {
      return toast.warn("Payroll elements are not selected");
    }
    if (designationDto?.length === 0) {
      return toast.warn("Designations are not selected");
    }
    const isFormulaExist = elementDto?.filter(
      (i: any) => i?.basedOn === "Calculative"
    );

    if (isFormulaExist && isFormulaExist.length > 0) {
      for (const item of isFormulaExist) {
        if (!item?.formula) {
          // Checks for null, undefined, or empty string
          return toast.warn("Calculative Element can not be empty!!!");
        }
      }
    }
    if (!values?.jobLevel?.value) {
      form.setFieldsValue({
        jobLevelCreate: undefined,
      });
      return toast.warn("Payscale Level is not selected");
    }

    const payload = {
      id: rowData?.id ? rowData?.id : 0,

      accountId: orgId,
      businessUnitId: buId,
      workplaceGroupId: wgId,
      workplaceId: wId,
      payScaleName: values?.payscale,
      jobClassId: values?.jobClass?.value,
      jobGradeId: values?.grade?.value,
      jobLevelId: values?.jobLevel?.value,
      incrementSlabCount: values?.incrementSlab,
      payrollPolicyId: values?.policy?.value,
      incrementAmount: values?.increment,
      extendedIncrementSlabCount: values?.efficiencySlab,
      extendedIncrementAmount: values?.incrementExtended,
      payScaleElements: elementDto,
      designationList: designationDto?.map((i: any) => i?.id),
      actionBy: employeeId,
    };
    savePayscale?.action({
      urlKey: rowData?.id ? "UpdatePayScaleSetup" : "CreatePayScaleSetup",
      method: rowData?.id ? "put" : "post",
      payload,
      toast: true,
      onSuccess: () => {
        landingApi();
        setOpen(false);
      },
    });
  };
  const calculateFormulaNetAmounts = (data: any[]) => {
    const updated = [...data];
    const valueMap = new Map<string, number>();

    // Create a map of all element names to their net amounts
    updated.forEach((el) => {
      valueMap.set(el.payrollElementName, el.netAmount ?? 0);
    });

    updated.forEach((row) => {
      if (row.basedOn === "Calculative" && row.formula) {
        let formula = row.formula;

        // First replace percentage of variables (like 2%#Basic#)
        valueMap.forEach((value, label) => {
          // Handle cases like 2%#Basic# → (2/100)*BasicValue
          const percentageRegex = new RegExp(`(\\d+)%\\s*#${label}#`, "g");
          formula = formula.replace(percentageRegex, `($1/100)*${value}`);
        });

        // Then replace simple #Label# references
        valueMap.forEach((value, label) => {
          const simpleReferenceRegex = new RegExp(`#${label}#`, "g");
          formula = formula.replace(simpleReferenceRegex, value.toString());
        });

        // Convert standalone percentages to their decimal form (5% → 0.05)
        formula = formula.replace(/(\d+)\s*%/g, "($1 / 100)");

        try {
          // Use Function constructor for evaluation
          const result = new Function("return " + formula)();
          row.netAmount = Number.isFinite(result)
            ? parseFloat(result.toFixed(6))
            : 0;
        } catch (err) {
          console.error(`Error evaluating formula "${row.formula}":`, err);
          row.netAmount = 0;
        }
      }
    });

    return updated;
  };

  const elementDtoHandler = (e: number, row: any, index: number) => {
    if (e < 0) {
      return toast.warn("number must be positive");
    }
    if (row?.basedOn === "Percentage" && e > 100) {
      return toast.warn("Percentage cant be greater than 100");
    }

    let temp: any = [...elementDto];
    temp[index].amountOrPercentage = e;

    if (row?.basedOn === "Amount") {
      temp[index].netAmount = e;
    } else {
      temp[index].netAmount = (e * temp[0].netAmount) / 100 || 0;
    }

    if (index === 0) {
      temp = temp?.map((i: any) => {
        if (i?.basedOn === "Amount") {
          return i;
        } else {
          return {
            ...i,
            netAmount: (i?.amountOrPercentage * temp[0].netAmount) / 100,
          };
        }
      });
    }

    // Calculate formula-based rows (Calculative)
    temp = calculateFormulaNetAmounts(temp);

    // Final state update
    setElementDto(temp);
  };
  const header: any = [
    {
      title: "SL",
      align: "center",
      render: (text: any, record: any, index: number) => index + 1,
    },
    {
      title: "Payroll Element",
      dataIndex: "payrollElementName",
    },
    {
      title: "Based On",
      dataIndex: "basedOn",
    },

    {
      title: "Amount/Percentage/Calculative",
      render: (value: any, row: any, index: number) => (
        <>
          {row?.id && row?.basedOn !== "Calculative" ? (
            <PInput
              type="number"
              // name={`amountOrPercentage_${index}`}
              value={row?.amountOrPercentage}
              placeholder="Amount"
              disabled={rowData}
              rules={[
                { required: true, message: "Amount Is Required" },
                {
                  validator: (_, value, callback) => {
                    if (row?.basedOn === "Percentage" && value > 100) {
                      callback("Percentage can not be greater than 100");
                    } else if (value < 0) {
                      callback("must be Positive");
                    } else {
                      callback();
                    }
                  },
                },
              ]}
              // disabled={true}
              onChange={(e: any) => {
                elementDtoHandler(e, row, index);
              }}
            />
          ) : row?.basedOn !== "Calculative" ? (
            <PInput
              type="number"
              // name={`amountOrPercentage_${index}`}
              value={row?.amountOrPercentage}
              placeholder="Amount"
              rules={[
                { required: true, message: "Amount Is Required" },
                {
                  validator: (_, value, callback) => {
                    if (row?.basedOn === "Percentage" && value > 100) {
                      callback("Percentage can not be greater than 100");
                    } else if (value < 0) {
                      callback("must be Positive");
                    } else {
                      callback();
                    }
                  },
                },
              ]}
              // disabled={true}
              onChange={(e: any) => {
                elementDtoHandler(e, row, index);
              }}
            />
          ) : (
            <div style={{ height: "50px" }}>
              <FormulaInputWrapper
                disabled={rowData}
                formulaOptions={elementDto?.length > 0 ? elementDto : []}
                value={row?.formula || ""}
                onChange={(e: any) => {
                  rowDtoHandler("formula", index, e.target.value);
                }}
              />
            </div>
          )}
        </>
      ),
    },
    {
      title: "Net Amount",
      dataIndex: "netAmount",
    },
    {
      title: "Action",
      align: "center",
      hidden: rowData?.id ? true : false,
      render: (_: any, item: any, index: number) => (
        <TableButton
          buttonsList={[
            // {
            //   type: "edit",
            //   onClick: () => {
            //     // checkUsage(item, "edit");
            //   },
            // },
            {
              type: "delete",
              onClick: () => {
                // checkUsage(item, "delete");
                if (item?.isBasic) {
                  return toast.warn("Can not delete basic element");
                }

                let temp = elementDto?.filter(
                  (i: any, idx: number) => idx !== index
                );
                setElementDto(temp);
              },
            },
          ]}
        />
      ),
    },
  ].filter((i: any) => !i.hidden);
  const headerDesignation: any = [
    {
      title: "SL",
      align: "center",
      render: (text: any, record: any, index: number) => index + 1,
    },
    {
      title: "Desgination",
      dataIndex: "designationName",
    },

    {
      title: "Action",
      align: "center",
      render: (_: any, item: any, index: number) => (
        <TableButton
          buttonsList={[
            {
              type: "delete",
              onClick: () => {
                let temp = designationDto?.filter(
                  (i: any, idx: number) => idx !== index
                );
                setDesignationDto(temp);
              },
            },
          ]}
        />
      ),
    },
  ];
  const headerIncrement: any = [
    {
      title: "Slab Count",
      align: "center",
      render: (text: any, record: any, index: number) => index + 1,
    },
    {
      title: "Increment Amount",
      dataIndex: "incrementAmount",
    },
  ];
  const headerEfficiency: any = [
    {
      title: "Slab Count",
      align: "center",
      render: (text: any, record: any, index: number) =>
        incrementDto.length + 1 + index,
    },

    {
      title: "Increment Amount",
      dataIndex: "incrementAmount",
    },
  ];

  useEffect(() => {
    if (rowData?.id) {
      getById?.action({
        urlKey: "GetPayScaleSetupById",
        method: "get",
        params: {
          id: rowData?.id,
        },

        onSuccess: (res: any) => {
          form.setFieldsValue({
            payscale: res?.payScaleName,
            jobLevel: { value: res?.jobLevelId, label: res?.jobLevelName },
            grade: { value: res?.jobGradeId, label: res?.jobGradeName },
            jobClass: { value: res?.jobClassId, label: res?.jobClassName },
            increment: res?.incrementAmount,
            incrementSlab: res?.incrementSlabCount,
            policy: {
              value: res?.payrollPolicyId,
              label: res?.payrollPolicyName,
            },
            incrementExtended: res?.extendedIncrementAmount,
            efficiencySlab: res?.extendedIncrementSlabCount,
            isEfficiency: res?.extendedIncrementAmount > 0 ? true : false,
          });
          setDesignationDto(res?.designationList);
          const temp: any = [];
          for (let i = 0; i < res?.extendedIncrementSlabCount; i++) {
            const incrementAmount = res?.extendedIncrementAmount;
            temp.push({
              incrementAmount,
            });
          }
          setEfficiencyDto(temp);

          const tempIncrement: any = [];
          for (let i = 0; i < res?.incrementSlabCount; i++) {
            const incrementAmount = res?.incrementAmount;
            tempIncrement.push({ incrementAmount });
          }

          setIncrementDto(tempIncrement);
          const modify = res?.payScaleElements?.map((i: any) => {
            return {
              ...i,
              label: i?.payrollElementName,
            };
          });
          setElementDto(modify);
        },
      });
    }
  }, [rowData]);

  return (
    <PForm form={form} onFinish={onFinish}>
      <Row gutter={[10, 2]}>
        <Col md={24} sm={24}>
          <PInput
            name="payscale"
            type="text"
            label="Payscale Name"
            placeholder="Payscale Name"
            rules={[
              { required: true, message: "Please Enter Payscale Name" },
              {
                min: 3,
                message: "Payscale Name must be at least 3 characters",
              },
            ]}
            disabled={rowData}
          />
        </Col>
        <Col md={12} sm={24}>
          <PSelect
            name="policy"
            label="Payroll Policy"
            placeholder=""
            options={policyDDL?.data?.length > 0 ? policyDDL?.data : []}
            loading={policyDDL?.loading}
            onChange={(value, op) => {
              form.setFieldsValue({
                policy: op,
              });
            }}
            filterOption={false}
            rules={[
              {
                required: true,
                message: "Payroll Policy is required",
              },
            ]}
          />
        </Col>
        <Col md={12} sm={24}></Col>
        <Form.Item shouldUpdate noStyle>
          {() => {
            const { typeCreate } = form.getFieldsValue(true);
            if (typeCreate) {
              return (
                <Col span={24}>
                  <CreateJobClass
                    getData={() => {
                      getJobClassDDL();
                      form.setFieldsValue({
                        typeCreate: false,
                      });
                    }}
                  />
                </Col>
              );
            } else
              return (
                <>
                  <Col md={12} sm={24}>
                    <PSelect
                      name="jobClass"
                      label="Payscale Class"
                      placeholder="Select Payscale Class "
                      options={
                        jobClassDDL?.data?.length > 0 ? jobClassDDL?.data : []
                      }
                      loading={jobClassDDL?.loading}
                      onChange={(value, op) => {
                        form.setFieldsValue({
                          jobClass: op,
                          grade: undefined,
                          jobLevel: undefined,
                        });
                        getGradeDDL();
                      }}
                      filterOption={false}
                      rules={[
                        {
                          required: true,
                          message: "Payscale Class is required",
                        },
                      ]}
                    />
                  </Col>
                  <Col span={2}>
                    <button
                      type="button"
                      className="mt-4  btn add-ddl-btn "
                      style={{
                        margin: "0.4em 0 0 0.7em",
                        padding: "0.2em",
                      }}
                      onClick={() => {
                        form.setFieldsValue({
                          typeCreate: true,
                          jobClass: undefined,
                          grade: undefined,
                          jobLevel: undefined,
                        });
                      }}
                    >
                      <PlusCircleOutlined style={{ fontSize: "16px" }} />
                    </button>
                  </Col>
                </>
              );
          }}
        </Form.Item>
        <Form.Item shouldUpdate noStyle>
          {() => {
            const { gradeCreate } = form.getFieldsValue(true);
            if (gradeCreate) {
              return (
                <Col span={24}>
                  <CreateGrade
                    getData={() => {
                      getGradeDDL();
                      form.setFieldsValue({
                        gradeCreate: false,
                      });
                    }}
                  />
                </Col>
              );
            } else
              return (
                <>
                  <Col md={12} sm={24}>
                    <PSelect
                      name="grade"
                      label="Payscale Grade"
                      placeholder="Select Payscale Grade"
                      options={gradeDDL?.data?.length > 0 ? gradeDDL?.data : []}
                      loading={gradeDDL?.loading}
                      onChange={(value, op) => {
                        form.setFieldsValue({
                          grade: op,
                          jobLevel: undefined,
                        });
                        getJobLevelDDL();
                      }}
                      filterOption={false}
                      rules={[
                        {
                          required: true,
                          message: "Payscale Grade is required",
                        },
                      ]}
                    />
                  </Col>
                  <Col span={2}>
                    <button
                      type="button"
                      className="mt-4  btn add-ddl-btn "
                      style={{
                        margin: "0.4em 0 0 0.7em",
                        padding: "0.2em",
                      }}
                      onClick={() => {
                        form.setFieldsValue({
                          gradeCreate: true,
                          grade: undefined,
                          jobLevel: undefined,
                        });
                      }}
                    >
                      <PlusCircleOutlined style={{ fontSize: "16px" }} />
                    </button>
                  </Col>
                </>
              );
          }}
        </Form.Item>
        <Form.Item shouldUpdate noStyle>
          {() => {
            const { jobLevelCreate } = form.getFieldsValue(true);
            if (jobLevelCreate) {
              return (
                <Col span={24}>
                  <CreateJobLevel
                    getData={() => {
                      getJobLevelDDL();
                      form.setFieldsValue({
                        jobLevelCreate: false,
                      });
                    }}
                  />
                </Col>
              );
            } else
              return (
                <>
                  <Col md={12} sm={24}>
                    <PSelect
                      name="jobLevel"
                      label="Payscale Level"
                      placeholder="Select Payscale Level"
                      options={
                        jobLevelDDL?.data?.length > 0 ? jobLevelDDL?.data : []
                      }
                      loading={jobLevelDDL?.loading}
                      onChange={(value, op) => {
                        form.setFieldsValue({
                          jobLevel: op,
                        });
                      }}
                      filterOption={false}
                      rules={[
                        {
                          required: true,
                          message: "Payscale Level is required",
                        },
                      ]}
                    />
                  </Col>
                  <Col span={2}>
                    <button
                      type="button"
                      className="mt-4  btn add-ddl-btn "
                      style={{
                        margin: "0.4em 0 0 0.7em",
                        padding: "0.2em",
                      }}
                      onClick={() => {
                        form.setFieldsValue({
                          jobLevelCreate: true,
                          jobLevel: undefined,
                        });
                      }}
                    >
                      <PlusCircleOutlined style={{ fontSize: "16px" }} />
                    </button>
                  </Col>
                </>
              );
          }}
        </Form.Item>
        <Divider
          style={{
            marginBlock: "4px",
            marginTop: "6px",
            fontSize: "14px",
            fontWeight: 600,
          }}
          orientation="left"
        >
          Payroll Element Setup
        </Divider>
        <Col md={10} sm={24}>
          <PSelect
            name="element"
            label="Payroll Element"
            placeholder="Select Element"
            options={elementDDL?.data?.length > 0 ? elementDDL?.data : []}
            onChange={(value, op) => {
              form.setFieldsValue({
                element: op,
                basedOn: undefined,
              });
            }}
            filterOption={false}
          />
        </Col>
        <Form.Item shouldUpdate noStyle>
          {() => {
            const { element } = form.getFieldsValue(true);
            return (
              <Col md={10} sm={24}>
                <PSelect
                  name="basedOn"
                  label="Based On"
                  placeholder="Based On"
                  options={
                    element?.isBasic
                      ? [{ value: 1, label: "Amount" }]
                      : [
                          { value: 1, label: "Amount" },
                          { value: 2, label: "Percentage" },
                          { value: 3, label: "Calculative" },
                        ]
                  }
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      basedOn: op,
                    });
                  }}
                  filterOption={false}
                />
              </Col>
            );
          }}
        </Form.Item>
        <Col md={3} className="my-3 pt-1">
          <PButton
            type="primary"
            onClick={() => {
              const values = form.getFieldsValue(true);
              const isExist = elementDto?.filter((i: any) => i?.isBasic);
              const isDuplicate = elementDto?.filter(
                (i: any) => i?.payrollElementName === values?.element?.label
              );

              if (isExist?.length === 0 && !values?.element?.isBasic) {
                return toast.warn("Basic needs to be selected first");
              }
              if (isDuplicate?.length > 0) {
                return toast.warn("Element is Already selected");
              }
              if (!values?.basedOn || !values?.element) {
                return toast.warn("Select Fields First");
              }

              setElementDto((prev): any => {
                return [
                  ...prev,
                  {
                    ...values?.element,
                    payrollElementName: values?.element?.label,
                    label: values?.element?.label,
                    isBasic: values?.element?.isBasic,
                    element: values?.element?.label,
                    elementId: values?.element?.value,
                    payrollElementId: values?.element?.value,
                    basedOn: values?.basedOn?.label,
                    netAmount: 0,
                    sl: elementDto?.length,
                    formula: "",
                    amountOrPercentage: 0,
                  },
                ];
              });
              form.setFieldsValue({
                element: undefined,
                basedOn: undefined,
              });
            }}
            content="Add"
          />
        </Col>
        {elementDto?.length > 0 && (
          <Col md={24} sm={24}>
            <DataTable header={header} bordered data={elementDto || []} />
          </Col>
        )}

        <Divider
          style={{
            marginBlock: "4px",
            marginTop: "6px",
            fontSize: "14px",
            fontWeight: 600,
          }}
          orientation="left"
        >
          Increment Configure
        </Divider>
        <Col md={10} sm={24}>
          <PInput
            type="number"
            label="Increment Amount"
            name="increment"
            disabled={rowData}
            min={0}
            rules={[
              {
                required: true,
                message: "Increment Amount is required",
              },
            ]}
          />
        </Col>

        <Col md={10} sm={24}>
          <PInput
            type="number"
            name="incrementSlab"
            label="Slabs Count"
            min={0}
            disabled={rowData}
            rules={[
              {
                required: true,
                message: "Slabs Count is required",
              },
            ]}
          />
        </Col>
        <Col md={3} className="my-3 pt-1">
          <PButton
            type="primary"
            onClick={() => {
              const values = form.getFieldsValue(true);
              let temp: any = [];
              for (let i = 0; i < values?.incrementSlab; i++) {
                const incrementAmount = values?.increment;
                temp.push({ incrementAmount });
              }

              setIncrementDto(temp);
            }}
            content="Add"
          />
        </Col>
        {incrementDto?.length > 0 && (
          <Col md={24} sm={24}>
            <DataTable
              header={headerIncrement}
              bordered
              data={incrementDto || []}
            />
          </Col>
        )}
        <Divider
          style={{
            marginBlock: "4px",
            marginTop: "6px",
            fontSize: "14px",
            fontWeight: 600,
          }}
          orientation="left"
        >
          Efficiency Bar
        </Divider>

        <Col md={4} className="mt-3" sm={24}>
          <PInput
            type="checkbox"
            layout="horizontal"
            label="Efficiency Bar"
            name="isEfficiency"
            disabled={rowData}
            onChange={(e) => {
              setEfficiencyDto([]);
              form.setFieldsValue({
                incrementExtended: undefined,
                efficiencySlab: undefined,
              });
            }}
          />
        </Col>
        <Form.Item shouldUpdate noStyle>
          {() => {
            const { isEfficiency } = form.getFieldsValue(true);
            return isEfficiency ? (
              <>
                <Col md={8} sm={24}>
                  <PInput
                    type="number"
                    label="Increment Amount"
                    name="incrementExtended"
                    min={0}
                    disabled={rowData}
                  />
                </Col>

                <Col md={8} sm={24}>
                  <PInput
                    type="number"
                    name="efficiencySlab"
                    label="Slabs Count"
                    disabled={rowData}
                    min={0}
                  />
                </Col>
                <Col md={3} className="my-3 pt-1">
                  <PButton
                    type="primary"
                    onClick={() => {
                      const values = form.getFieldsValue(true);
                      let temp: any = [];
                      for (let i = 0; i < values?.efficiencySlab; i++) {
                        const incrementAmount = values?.incrementExtended;
                        temp.push({
                          incrementAmount,
                        });
                      }
                      setEfficiencyDto(temp);
                    }}
                    content="Add"
                  />
                </Col>
                {efficiencyDto?.length > 0 && (
                  <Col md={24} sm={24}>
                    <DataTable
                      header={headerEfficiency}
                      bordered
                      data={efficiencyDto || []}
                    />
                  </Col>
                )}
              </>
            ) : null;
          }}
        </Form.Item>
        <Divider
          style={{
            marginBlock: "4px",
            marginTop: "6px",
            fontSize: "14px",
            fontWeight: 600,
          }}
          orientation="left"
        >
          Designation Setup
        </Divider>
        <Col md={12} sm={24}>
          <PSelect
            name="designation"
            label="Designation"
            placeholder="Select Designation"
            options={
              designationDDL?.data?.length > 0 ? designationDDL?.data : []
            }
            onChange={(value, op) => {
              form.setFieldsValue({
                designation: op,
              });
            }}
            filterOption={false}
          />
        </Col>
        <Col md={3} className="my-3 pt-1">
          <PButton
            type="primary"
            onClick={() => {
              const values = form.getFieldsValue(true);
              const isDuplicate = designationDto?.filter(
                (i: any) => i?.designationName === values?.designation?.label
              );
              const isAll = designationDto?.filter(
                (i: any) => i?.designationName === "All"
              );

              if (isDuplicate?.length > 0) {
                return toast.warn("Designation is Already selected");
              }

              if (isAll?.length > 0) {
                return toast.warn("All  is selected");
              }

              if (values?.designation?.value === 0) {
                setDesignationDto([]);
              }

              setDesignationDto((prev): any => {
                return [
                  ...prev,
                  {
                    ...values.designation,
                    designationName: values.designation?.label,
                    id: values.designation?.value,
                  },
                ];
              });
              form.setFieldsValue({
                designation: undefined,
              });
            }}
            content="Add"
          />
        </Col>
        {designationDto?.length > 0 && (
          <Col md={24} sm={24}>
            <DataTable
              header={headerDesignation}
              bordered
              data={designationDto || []}
            />
          </Col>
        )}
      </Row>
      <ModalFooter
        submitAction="submit"
        loading={savePayscale?.loading}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </PForm>
  );
};

export default CreateEditPayscale;
