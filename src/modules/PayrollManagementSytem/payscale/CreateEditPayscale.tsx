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
  const gradeDDL = useApiRequest({});
  const designationDDL = useApiRequest({});
  const jobLevelDDL = useApiRequest({});
  const getById = useApiRequest({});
  const elementDDL = useApiRequest({});
  const [elementDto, setElementDto] = useState([]);
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
      onSuccess: () => {},
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
      onSuccess: () => {},
    });
  };
  const getDesignationDDL = () => {
    designationDDL?.action({
      urlKey: "DesignationIdAll",
      method: "GET",
      params: {
        accountId: orgId,
        businessUnitId: buId,
        workplaceGroupId: wgId,
        workplaceId: wId,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.designationName;
          res[i].value = item?.designationId;
        });
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

      onSuccess: () => {},
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

      onSuccess: () => {},
    });
  };
  // Form Instance
  const [form] = Form.useForm();

  useEffect(() => {
    getJobClassDDL();
    getDesignationDDL();
    getElementDDL();
    // getGradeDDL();
    // getJobLevelDDL();
  }, []);

  //   Functions
  const onFinish = () => {
    const values = form.getFieldsValue(true);
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
      incrementAmount: values?.increment,
      extendedIncrementSlabCount: values?.efficiencySlab,
      extendedIncrementAmount: values?.incrementExtended,
      payScaleElements: elementDto,
      designationList: designationDto?.map((i: any) => i?.value),
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
  const elementDtoHandler = (e: number, row: any, index: number) => {
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
      title: "Amount/Percentage",
      render: (value: any, row: any, index: number) => (
        <>
          <PInput
            type="number"
            name={`amountOrPercentage_${index}`}
            value={row?.amountOrPercentage}
            placeholder="Amount"
            rules={[
              { required: true, message: "Amount Is Required" },
              {
                validator: (_, value, callback) => {
                  if (row?.basedOn === "Percentage" && value > 100) {
                    callback("Percentage can not be greater than 100");
                  } else if (value < 0) {
                    callback("must be Negative");
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
      render: (_: any, item: any, index: number) => (
        <TableButton
          buttonsList={[
            {
              type: "edit",
              onClick: () => {
                // checkUsage(item, "edit");
              },
            },
            {
              type: "delete",
              onClick: () => {
                // checkUsage(item, "delete");
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
  ];
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

            incrementExtended: res?.extendedIncrementAmount,
            efficiencySlab: res?.extendedIncrementSlabCount,
            isEfficiency: res?.extendedIncrementAmount > 0 ? true : false,
          });
          setDesignationDto(res?.designationList);
          const temp: any = [];
          for (let i = 0; i < res?.extendedIncrementSlabCount; i++) {
            const incrementAmount = res?.extendedIncrementAmount * (i + 1);
            temp.push({
              incrementAmount,
            });
          }
          setEfficiencyDto(temp);

          const tempIncrement: any = [];
          for (let i = 0; i < res?.incrementSlabCount; i++) {
            const incrementAmount = res?.incrementAmount * (i + 1);
            tempIncrement.push({ incrementAmount });
          }

          setIncrementDto(tempIncrement);
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
                      label="Job Class"
                      placeholder="Select Job Class "
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
                          message: "Job Class is required",
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
                      label="Grade Name"
                      placeholder="Select Grade"
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
                          message: "Grade Type is required",
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
                      label="Job Level"
                      placeholder="Select Job Level"
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
                          message: "Job Level is required",
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
                    element?.label === "Basic"
                      ? [{ value: 1, label: "Amount" }]
                      : [
                          { value: 1, label: "Amount" },
                          { value: 2, label: "Percentage" },
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

              setElementDto((prev): any => {
                return [
                  ...prev,
                  {
                    ...values?.element,
                    payrollElementName: values?.element?.label,

                    element: values?.element?.label,
                    elementId: values?.element?.value,
                    payrollElementId: values?.element?.value,
                    basedOn: values?.basedOn?.label,
                    netAmount: 0,
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
            min={0}
          />
        </Col>

        <Col md={10} sm={24}>
          <PInput
            type="number"
            name="incrementSlab"
            label="Slabs Count"
            min={0}
          />
        </Col>
        <Col md={3} className="my-3 pt-1">
          <PButton
            type="primary"
            onClick={() => {
              const values = form.getFieldsValue(true);
              let temp: any = [];
              for (let i = 0; i < values?.incrementSlab; i++) {
                const incrementAmount = values?.increment * (i + 1);
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
                  />
                </Col>

                <Col md={8} sm={24}>
                  <PInput
                    type="number"
                    name="efficiencySlab"
                    label="Slabs Count"
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
                        const incrementAmount =
                          values?.incrementExtended * (i + 1);
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

              if (isDuplicate?.length > 0) {
                return toast.warn("Designation is Already selected");
              }

              setDesignationDto((prev): any => {
                return [
                  ...prev,
                  {
                    ...values.designation,
                    designationName: values.designation?.label,
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
