import { Col, Row } from "antd";
import { PButton, PInput } from "Components";

const PfProfitShareFilter = ({ form }) => {
  return (
      <Row gutter={[10, 2]}>
        <Col md={6} sm={12} xs={24}>
          <PInput
            type="month"
            name="fromDate"
            label="From Date"
            format={"YYYY-MM"}
            placeholder="Select From Date"
            rules={[
              {
                required: true,
                message: "From Date is required",
              },
            ]}
            onChange={(value) => {
              form.setFieldsValue({ fromDate: value });
            }}
          />
        </Col>
        <Col md={6} sm={12} xs={24}>
          <PInput
            type="month"
            name="toDate"
            label="To Date"
            format={"YYYY-MM"}
            placeholder="Select To Date"
            rules={[
              {
                required: true,
                message: "To Date is required",
              },
            ]}
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

export default PfProfitShareFilter;
