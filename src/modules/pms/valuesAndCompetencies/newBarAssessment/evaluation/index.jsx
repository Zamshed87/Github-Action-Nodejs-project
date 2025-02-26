/* eslint-disable react-hooks/exhaustive-deps */
import Loading from "../../../../../common/loading/Loading";
import EmployeeInfo from "./components/employeeInfo";
import QuestionsGroup from "./components/questionsGroup";
import { PCard, PCardBody, PCardHeader, PForm, PSelect } from "Components";
import { Col, Form, Row } from "antd";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import useBarAssessmentEvaluation from "./hooks/useBarAssessmentQuestions";
import useAssessmentFilters from "../hooks/useAssessmentFilters";

const BarAssessmentEvaluation = () => {
  const [form] = Form.useForm();

  const assessmentPeriod = Form.useWatch("assessmentPeriod", form);
  const assessmentTime = Form.useWatch("assessmentTime", form);

  const {
    permission,
    questionData,
    questionsLoading,
    saveBARAssessmentData,
    handleAnswerQuestion,
    getSelectedAnswer,
  } = useBarAssessmentEvaluation();
  const { assessmentPeriodDDL, quarterDDL } = useAssessmentFilters({});

  return permission?.isView ? (
    <PForm
      form={form}
      initialValues={{}}
      onFinish={(values) => {
        saveBARAssessmentData({
          assessmentPeriod: values?.assessmentTime?.value,
          assessmentTime: values?.assessmentTime?.value,
        });
      }}
    >
      {questionsLoading && <Loading />}
      <PCard>
        <PCardHeader
          title={`BAR Assessment Evaluation`}
          backButton
          buttonList={[
            {
              type: "primary",
              content: "Save",
              onClick: () => {
                // submitHandler();
              },
              // disabled: selectedRow?.length > 0 ? false : true,
            },
          ]}
        />
        <PCardBody className="mb-3">
          <Row gutter={[10, 2]}>
            <Col md={5} sm={12} xs={24}>
              <EmployeeInfo employeeInfo={questionData} />
            </Col>
            <Col md={5} sm={12} xs={24}>
              <PSelect
                options={assessmentPeriodDDL || []}
                name="assessmentPeriod"
                label="Assessment Period"
                showSearch
                placeholder="Assessment Period"
                onChange={(value, op) => {
                  form.setFieldsValue({ assessmentPeriod: op });
                  if (value === "Yearly") {
                    form.resetFields(["assessmentTime"]);
                  }
                }}
                rules={[{ required: true, message: "Assessment Period is required" }]}
              />
            </Col>
            <Col md={5} sm={12} xs={24}>
              <PSelect
                options={assessmentPeriod?.value == "Quarterly" ? quarterDDL : []}
                name="assessmentTime"
                label="Assessment Time"
                showSearch
                placeholder="Assessment Time"
                onChange={(value, op) =>
                  form.setFieldsValue({ assessmentTime: op })
                }
                rules={assessmentPeriod?.value == "Quarterly" ? [{ required: true, message: "Assessment Time is required" }]:[]}
                disabled={assessmentPeriod?.value == "Yearly"}
              />
            </Col>
          </Row>
        </PCardBody>
        {questionData?.groups?.length > 0 &&
          questionData?.groups?.map((group, groupIdx) => (
            <QuestionsGroup
              key={groupIdx + 1}
              group={group}
              scales={questionData?.scales}
              handleSelectOption={(data) => {
                handleAnswerQuestion(data);
              }}
              getSelectedAnswer={getSelectedAnswer}
            />
          ))}
      </PCard>
    </PForm>
  ) : (
    <NotPermittedPage />
  );
};

export default BarAssessmentEvaluation;
