import { Row, Col } from "antd";
import { PButton, PSelect } from "Components";

const PfProfitShareFilters = ({ form }) => {
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
      <Col style={{ marginTop: "23px" }}>
        <PButton type="primary" action="submit" content="View" />
      </Col>
    </Row>
  );
};

export default PfProfitShareFilters;
