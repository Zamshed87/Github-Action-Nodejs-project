import { Row, Col } from "antd";
import { PButton, PSelect } from "Components";

const PfProfitShareFilters = ({ form }) => {
  return (
    <Row gutter={[10, 2]}>
      <Col md={5} sm={12} xs={24}>
        <PSelect
          name="status"
          label="Status"
          placeholder="Select Status"
          options={[
            { value: 0, label: 'Unapproved' },
            { value: 1, label: 'Approved' },
            { value: 2, label: 'Pending' },
          ]}
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

export default PfProfitShareFilters;
