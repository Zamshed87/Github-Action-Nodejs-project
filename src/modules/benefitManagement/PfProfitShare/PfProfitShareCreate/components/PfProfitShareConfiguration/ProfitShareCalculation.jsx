import { Row } from "antd";
import { PButton, PInput, PSelect } from "Components";
import { Col } from "react-bootstrap";

const ProfitShareCalculation = ({ form }) => {
  return (
    <Row gutter={[10, 2]}>
      <Col md={5} sm={12} xs={24}>
        <PSelect
          options={[
            { value: 1, label: "Percentage" },
            { value: 2, label: "Proportionately" },
            { value: 3, label: "Fixed Amount" },
          ]}
          name="profitShareType"
          label="Profit Share Type"
          placeholder="Select Profit Share Type"
          onChange={(value) => {
            form.setFieldsValue({ profitShareType: value });
          }}
        />
      </Col>
      <Col md={5} sm={12} xs={24}>
        <PInput
          type="number"
          min={0}
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
      <Col style={{ marginTop: "23px" }}>
        <PButton type="primary" action="button" content="Calculate" />
      </Col>
    </Row>
  );
};

export default ProfitShareCalculation;
