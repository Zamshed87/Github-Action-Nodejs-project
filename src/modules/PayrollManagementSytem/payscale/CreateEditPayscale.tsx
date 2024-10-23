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
  const { orgId, buId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );
  // Api Actions
  const savePayscale = useApiRequest({});
  const jobClassDDL = useApiRequest({});
  const gradeDDL = useApiRequest({});
  const jobLevelDDL = useApiRequest({});
  const elementDDL = useApiRequest({});
  const [elementDto, setElementDto] = useState([]);
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
  // Form Instance
  const [form] = Form.useForm();

  useEffect(() => {
    if (rowData) {
      form.setFieldsValue({
        payscale: rowData?.strPayrollElementName,
        grade: rowData?.isBasicSalary,
        jobClass: rowData?.isPrimarySalary,
        jobLevel: rowData?.isAddition ? "addition" : "deduction",
      });
    }
  }, [rowData]);

  useEffect(() => {
    getJobClassDDL();
    // getGradeDDL();
    // getJobLevelDDL();
  }, [rowData]);

  //   Functions
  const onFinish = () => {
    const values = form.getFieldsValue(true);
    const payload = {};
    // savePayscale?.action({
    //   urlKey: "SavePayrollElementType",
    //   method: "post",
    //   payload,
    //   toast: true,
    //   onSuccess: () => {
    //     landingApi();
    //     setOpen(false);
    //   },
    // });
  };
  const elementDtoHandler = (e: number, row: any, index: number) => {
    let temp: any = [...elementDto];
    temp[index].amountOrPercentage = e;

    if (row?.basedOn === "Amount") {
      temp[index].netAmount = e;
    } else {
      temp[index].netAmount = (e * temp[0].netAmount) / 100;
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
      dataIndex: "element",
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
            // name={`amountOrPercentage_${index}`}
            value={row?.amountOrPercentage}
            placeholder="Amount"
            rules={[
              // { required: true, message: "Amount Is Required" },
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
      render: (_: any, item: any) => (
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
              },
            },
          ]}
        />
      ),
    },
  ];
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
        ></Divider>
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
              const isExist = elementDto?.filter(
                (i: any) => i?.element === "Basic"
              );
              const isDuplicate = elementDto?.filter(
                (i: any) => i?.elementId === values?.element?.value
              );

              if (isExist?.length === 0 && values?.element?.label !== "Basic") {
                return toast.warn("Basic needs to be selected first");
              }
              if (isDuplicate?.length > 0) {
                return toast.warn("Element is Already selected");
              }

              setElementDto((prev): any => {
                return [
                  ...prev,
                  {
                    element: values?.element?.label,
                    elementId: values?.element?.value,
                    basedOn: values?.basedOn?.label,
                    netAmount: 0,
                    amountOrPercentage: 0,
                  },
                ];
              });
            }}
            content="Add"
          />
        </Col>
      </Row>
      <DataTable header={header} bordered data={elementDto || []} />

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
