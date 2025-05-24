import { Col, Row } from "antd";
import { PButton, PCardBody, PInput, PSelect } from "Components";
import useConfigSelectionHook from "./useConfigSelectionHook";
import PSelectWithAll from "Components/PForm/Select/PSelectWithAll";

const PfPolicyConfig = ({ form }) => {
  const { workplaceDDL, employmentTypeDDL, eligibilityOpts, loadingEligibility, getEmploymentTypeDDL } =
    useConfigSelectionHook(form, {
      fetchWorkplace: true,
      fetchEmploymentType: true,
      fetchEligibilityEnum: true,
    });
  return (
    <PCardBody className="mb-4">
      <Row gutter={[10, 2]}>
        <Col md={5} sm={12} xs={24}>
          <PInput
            type="text"
            name="strPolicyName"
            placeholder="Policy Name"
            label="Policy Name"
            rules={[
              {
                required: true,
                message: "Policy Name Is Required",
              },
            ]}
          />
        </Col>
        <Col md={5} sm={12} xs={24}>
          <PInput
            type="text"
            name="strPolicyCode"
            placeholder="Policy Code"
            label="Policy Code"
            rules={[
              {
                required: true,
                message: "Policy Code Is Required",
              },
            ]}
          />
        </Col>
        <Col md={5} sm={12} xs={24}>
          <PSelect
            options={workplaceDDL.data}
            name="intWorkPlaceId"
            label="Workplace"
            placeholder="Select Workplace"
            onChange={(value) => {
              form.setFieldsValue({ workplace: value });
              getEmploymentTypeDDL();
            }}
            loading={workplaceDDL.loading}
            rules={[{ required: true, message: "Workplace Is Required" }]}
          />
        </Col>
        <Col md={5} sm={12} xs={24}>
          <PSelectWithAll
            form={form}
            name="intEmploymentTypeIds"
            label="Employment Type"
            placeholder="Select Employment Type"
            options={employmentTypeDDL.data}
            loading={employmentTypeDDL.loading}
            advanceAllOption={true}
            rules={[{ required: true, message: "Employment Type is required" }]}
          />
        </Col>
        <Col md={5} sm={12} xs={24}>
          <PSelect
            options={eligibilityOpts}
            name="intPfEligibilityDependOn"
            label="PF Eligibility Depend On"
            placeholder="Select PF Eligibility Depend on"
            onChange={(_,op) => {
              form.setFieldsValue({ intPfEligibilityDependOn: op });
            }}
            loading={loadingEligibility}
            rules={[
              {
                required: true,
                message: "PF Eligibility Depend on Is Required",
              },
            ]}
          />
        </Col>
          <Col style={{ marginTop: "23px" }}>
                <PButton type="primary" action="submit" content="View" />
              </Col>
      </Row>
    </PCardBody>
  );
};

export default PfPolicyConfig;
