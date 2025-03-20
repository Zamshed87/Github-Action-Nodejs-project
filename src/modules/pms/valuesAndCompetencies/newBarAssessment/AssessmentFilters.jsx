import { Row, Col, Form } from "antd";
import { PButton, PSelect } from "Components";
import useAssessmentFilters from "./hooks/useAssessmentFilters";

const AssessmentFilters = ({ form }) => {
  const { yearDDL, assessmentPeriodDDL, quarterDDL } = useAssessmentFilters({});
  const assessmentPeriod = Form.useWatch("assessmentPeriod", form);
  return (
    <Row gutter={[10, 2]}>
      <Col md={3} sm={12} xs={24}>
        <PSelect
          options={yearDDL || []}
          name="year"
          label="Year"
          showSearch
          placeholder="Year"
          onChange={(value, op) => form.setFieldsValue({ year: op })}
          rules={[{ required: true, message: "Year is required" }]}
        />
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
          onChange={(value, op) => form.setFieldsValue({ assessmentTime: op })}
          rules={assessmentPeriod?.value == "Quarterly" ? [{ required: true, message: "Assessment Time is required" }]:[]}
          disabled={assessmentPeriod?.value == "Yearly"}
        />
      </Col>
      <Col style={{ marginTop: "23px" }}>
        <PButton type="primary" action="submit" content="View" />
      </Col>
    </Row>
  );
};

export default AssessmentFilters;
