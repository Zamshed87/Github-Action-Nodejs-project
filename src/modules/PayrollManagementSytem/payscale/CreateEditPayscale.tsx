import { PForm, PInput, PSelect } from "Components";
import { ModalFooter } from "Components/Modal";
import { useApiRequest } from "Hooks";
import { Col, Form, Row } from "antd";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import CreateJobClass from "./CreateJobClass";
import { PlusCircleOutlined } from "@ant-design/icons";
import CreateGrade from "./CreateGrade";
import CreateJobLevel from "./CreateJoblevel";

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
