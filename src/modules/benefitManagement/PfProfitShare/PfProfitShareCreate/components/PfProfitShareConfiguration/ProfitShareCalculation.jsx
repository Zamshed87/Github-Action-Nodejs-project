import { Row } from "antd";
import { PButton, PInput, PSelect } from "Components";
import { Col } from "react-bootstrap";

const ProfitShareCalculation = ({ form }) => {
  return (
    <Row gutter={[5, 2]}>
      <Col md={4} sm={12} xs={24}>
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
      <Col md={4} sm={12} xs={24}>
        <PInput
          type="number"
          min={0}
          name="profitShare"
          placeholder="Profit Share"
          label="Profit Share"
        />
      </Col>
      <Col style={{ marginTop: "23px" }}>
        <PButton type="primary" action="button" content="Calculate" />
      </Col>
    </Row>
  );
};

export default ProfitShareCalculation;
