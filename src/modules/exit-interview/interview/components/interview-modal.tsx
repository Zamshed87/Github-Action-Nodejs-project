import NoResult from "common/NoResult";
import React, { useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { getQuestionaireById } from "../helper";
import {
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PInput,
  PRadio,
  PSelect,
} from "Components";
import { Checkbox, Col, Form, Row } from "antd";
import ReactQuill from "react-quill";
import { modules } from "modules/employeeProfile/reportBuilder/letterConfiguration/utils";
import { createLetterType } from "./helper";
import { getPeopleDeskAllLanding } from "common/api";
import { shallowEqual, useSelector } from "react-redux";
import EmpInfo from "./empInfo";

const InterviewModal = () => {
  const location: any = useLocation();
  const history = useHistory();
  // Form Instance
  const [form] = Form.useForm();
  const quillRef: any = useRef(null);

  const [singleData, setSingleData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [empInfo, setEmpInfo] = useState(null);

  const { profileData } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );

  const { buId, wgId, orgId } = profileData;

  useEffect(() => {
    form.setFieldValue("startTime", new Date().toISOString());
    getQuestionaireById(location?.state?.quesId, setSingleData, setLoading);
  }, []);

  useEffect(() => {
    singleData?.employeeBasicInfoId &&
      getPeopleDeskAllLanding(
        "EmployeeBasicById",
        orgId,
        buId,
        singleData?.employeeBasicInfoId,
        setEmpInfo,
        null,
        setLoading,
        null,
        null,
        wgId
      );
  }, [singleData?.employeeBasicInfoId]);

  const generateInitialValues = (formData: any) => {
    return formData?.reduce((acc: any, field: any) => {
      const fieldId = `field-${field.id}`;
      if (field.typeName === "Radio Button") {
        acc[fieldId] = field.responseAnswer[0] || "";
      } else if (field.typeName === "Textbox") {
        acc[fieldId] = field.responseAnswer[0] || "";
      } else if (field.typeName === "Checkbox") {
        acc[fieldId] = field.responseAnswer || [];
      } else if (field.typeName === "Drop-Down List") {
        acc[fieldId] = field.responseAnswer[0] || "";
      } else if (field.typeName === "Rich Textbox") {
        acc[fieldId] = field.responseAnswer[0] || "";
      }
      return acc;
    }, {});
  };

  const createLabelValue = (arr: any, label: any) => {
    const modifiedArr = arr.map((data: any) => {
      return {
        label: data[label],
        value: data[label],
      };
    });
    return modifiedArr;
  };

  return singleData && !singleData?.isCompleted ? (
    <PForm
      formName="tempCreate"
      form={form}
      initialValues={generateInitialValues(singleData?.questions)}
    >
      <PCard>
        <PCardHeader
          title={"Please answer the questions"}
          backButton={true}
          buttonList={[
            {
              type: "primary",
              content: "Submit",
              disabled: loading,
              onClick: () => {
                const values = form.getFieldsValue(true);
                form
                  .validateFields()
                  .then(() => {
                    createLetterType(
                      location?.state?.quesId,
                      singleData?.questions,
                      values,
                      setLoading,
                      () => {
                        history.goBack();
                      }
                    );
                  })
                  .catch(() => {
                    console.log();
                  });
              },
            },
          ]}
        />
        <div className=" my-3" style={{ minHeight: "auto" }}>
          <EmpInfo empBasic={empInfo?.[0]} />
        </div>
        <PCardBody>
          <Row gutter={[10, 2]}>
            {singleData?.questions?.map((field: any, index: number) => {
              const fieldId = `field-${field.id}`;
              if (field.typeName === "Radio Button") {
                return (
                  <Col md={24} sm={24} key={index}>
                    <PRadio
                      type="group"
                      label={field?.title}
                      name={fieldId}
                      options={createLabelValue(field?.options, "optionName")}
                      rules={[
                        {
                          required: field.isRequired,
                          message: "Required Field",
                        },
                      ]}
                    />
                  </Col>
                );
              }
              if (field.typeName === "Textbox") {
                return (
                  <Col md={12} sm={24} key={index} className="mt-2">
                    <PInput
                      type="textarea"
                      label={`${field?.title} (Max ${field?.answerTextLength})`}
                      name={fieldId}
                      placeholder="Please write the ans..."
                      maxLength={field?.answerTextLength}
                      rules={[
                        {
                          required: field.isRequired,
                          message: "Required Field",
                        },
                        {
                          max: field.answerTextLength,
                          message: `Maximum length is ${field.answerTextLength} characters`,
                        },
                      ]}
                    />
                  </Col>
                );
              }
              if (field.typeName === "Checkbox") {
                return (
                  <Col md={24} sm={24} key={index} className="mt-2">
                    <Form.Item
                      key={field.id}
                      label={
                        <span style={{ fontSize: "12px", fontWeight: 500 }}>
                          {field.title}
                        </span>
                      }
                      name={fieldId}
                      rules={[
                        {
                          required: field.isRequired,
                          message: "Required Field",
                        },
                      ]}
                    >
                      <Checkbox.Group>
                        {field.options.map((option: any, index: number) => (
                          <div key={index}>
                            <Checkbox
                              key={option.sortOrder}
                              value={option.optionName}
                            >
                              <span style={{ fontSize: "13px" }}>
                                {option.optionName}
                              </span>
                            </Checkbox>
                          </div>
                        ))}
                      </Checkbox.Group>
                    </Form.Item>
                  </Col>
                );
              }
              if (field.typeName === "Drop-Down List") {
                return (
                  <Col md={6} sm={24} key={index} className="mt-2">
                    <PSelect
                      options={
                        createLabelValue(field?.options, "optionName") || []
                      }
                      label={`${field?.title}`}
                      name={fieldId}
                      placeholder="Select an option"
                      rules={[
                        {
                          required: field.isRequired,
                          message: "Required Field",
                        },
                      ]}
                    />
                  </Col>
                );
              }
              if (field.typeName === "Rich Textbox") {
                return (
                  <Col md={24} sm={24} key={index} className="mt-2">
                    <Form.Item
                      key={field.id}
                      label={
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: 500,
                          }}
                        >
                          {field.title}
                        </span>
                      }
                      name={fieldId}
                      rules={[
                        {
                          required: field.isRequired,
                          message: "Required Field",
                        },
                      ]}
                    >
                      <ReactQuill
                        ref={quillRef}
                        preserveWhitespace={true}
                        placeholder="Write your answer..."
                        value={fieldId}
                        modules={modules}
                        onChange={(value) => {
                          form.setFieldValue(fieldId, value);
                        }}
                      />
                    </Form.Item>
                  </Col>
                );
              }
            })}
          </Row>
        </PCardBody>
      </PCard>
    </PForm>
  ) : (
    <div className="mt-5">
      <NoResult />
    </div>
  );
};

export default InterviewModal;
