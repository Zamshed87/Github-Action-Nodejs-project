import { Row, Col } from "antd";
import { PButton, PInput, PSelect } from "Components";
import usePfPolicyFilters from "./usePfInvestmentFilters";

const PfInvestmentFilters = ({ form }) => {
  const { investmentType, loadingInvestmentType } = usePfPolicyFilters(form);

  return (
    <Row gutter={[10, 2]}>
      <Col md={4} sm={12} xs={24}>
        <PInput
          type="date"
          name="FromDateF"
          format={"YYYY-MM-DD"}
          onChange={(_, date) => {
            form.setFieldsValue({ FromDate: date });
          }}
          placeholder="From Date"
          label="From Date"
          rules={[
            {
              required: true,
              message: "From Date Is Required",
            },
          ]}
        />
      </Col>
      <Col md={4} sm={12} xs={24}>
        <PInput
          type="date"
          name="ToDateF"
          format={"YYYY-MM-DD"}
          onChange={(_, date) => {
            form.setFieldsValue({ ToDate: date });
          }}
          placeholder="To Date"
          label="To Date"
          rules={[
            {
              required: true,
              message: "To Date Is Required",
            },
          ]}
        />
      </Col>
      <Col md={4} sm={12} xs={24}>
        <PSelect
          options={investmentType}
          name="InvestmentTypeId"
          label="Investment Type"
          placeholder="Select Investment Type"
          onChange={(value) => {
            form.setFieldsValue({ InvestmentTypeId: value });
          }}
          loading={loadingInvestmentType}
          rules={[{ required: true, message: "Investment Type Is Required" }]}
        />
      </Col>
      <Col md={4} sm={12} xs={24}>
        <PSelect
          options={[
            {
              value: "Inactive",
              label: "Inactive",
            },
            {
              value: "Not Started",
              label: "Not Started",
            },
            {
              value: "Running",
              label: "Running",
            },
            {
              value: "Matured",
              label: "Matured",
            },
          ]}
          name="status"
          label="Status"
          placeholder="Select Status"
          onChange={(value) => {
            form.setFieldsValue({ status: value });
          }}
        />
      </Col>
      <Col style={{ marginTop: "23px" }}>
        <PButton type="primary" action="submit" content="View" />
      </Col>
    </Row>
  );
};

export default PfInvestmentFilters;
