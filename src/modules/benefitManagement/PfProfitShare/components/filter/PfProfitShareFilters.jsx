import { Row, Col } from "antd";
import { PButton, PInput, PSelect } from "Components";

const PfProfitShareFilters = ({ form }) => {
  return (
    <Row gutter={[10, 2]}>
      <Col md={5} sm={12} xs={24}>
        <PInput
          type="month"
          name="fromDate"
          label="From Date"
          format={"YYYY-MM"}
          placeholder="Select From Date"
          onChange={(value) => {
            form.setFieldsValue({ fromDate: value });
          }}
        />
      </Col>
      <Col md={5} sm={12} xs={24}>
        <PInput
          type="month"
          name="toDate"
          label="To Date"
          format={"YYYY-MM"}
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
