import { Col, Row } from "antd";
import { PCardBody, PInput, PSelect } from "Components";
import usePfInvestmentConfig from "./usePfInvestmentConfig";

const PfInvestmentConfig = ({ form }) => {
  const {
    investmentType,
    investmentOrganization,
    loadingInvestmentType,
    loadingInvestmentOrganization,
  } = usePfInvestmentConfig(form);
  return (
    <PCardBody className="mb-4">
      <Row gutter={[10, 2]}>
        <Col md={5} sm={12} xs={24}>
          <PSelect
            name="investmentTypeId"
            label="Investment Type"
            placeholder="Select Investment Type"
            onChange={(value) => {
              form.setFieldsValue({ investmentTypeId: value });
            }}
            options={investmentType}
            loading={loadingInvestmentType}
            rules={[{ required: true, message: "Investment Type Is Required" }]}
          />
        </Col>
        <Col md={5} sm={12} xs={24}>
          <PSelect
            name="investmentOrganizationId"
            label="Investment Organization"
            placeholder="Select Investment Organization"
            onChange={(value) => {
              form.setFieldsValue({ investmentOrganizationId: value });
            }}
            options={investmentOrganization}
            loading={loadingInvestmentOrganization}
            rules={[{ required: true, message: "Investment Organization is required" }]}
          />
        </Col>
        <Col md={5} sm={12} xs={24}>
          <PInput
            type="date"
            name="investmentDate"
            placeholder="Investment Date"
            label="Investment Date"
            rules={[
              {
                required: true,
                message: "Investment Date Is Required",
              },
            ]}
          />
        </Col>
        <Col md={5} sm={12} xs={24}>
          <PInput
            type="number"
            min={1}
            name="investmentAmount"
            placeholder="Investment Amount"
            label="Investment Amount"
            rules={[
              {
                required: true,
                message: "Investment Amount Is Required",
              },
            ]}
          />
        </Col>
      </Row>
    </PCardBody>
  );
};

export default PfInvestmentConfig;
