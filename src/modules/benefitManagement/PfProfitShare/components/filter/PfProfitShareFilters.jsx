import { Row, Col } from "antd";
import { PButton, PInput, PSelect } from "Components";

const PfProfitShareFilters = ({ form }) => {
  return (
    <Row gutter={[10, 2]}>
      <Col md={5} sm={12} xs={24}>
        <PInput
          type="date"
          name="fromDate"
          label="From Date"
          placeholder="Select From Date"
          onChange={(value) => {
            form.setFieldsValue({ fromDate: value });
          }}
        />
      </Col>
      <Col md={5} sm={12} xs={24}>
        <PInput
          type="date"
          name="toDate"
          label="To Date"
          placeholder="Select To Date"
          onChange={(value) => {
            form.setFieldsValue({ toDate: value });
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
