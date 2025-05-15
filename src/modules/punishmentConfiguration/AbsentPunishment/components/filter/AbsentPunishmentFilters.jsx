import { Row, Col } from "antd";
import { PButton, PSelect } from "Components";
import usePfPolicyFilters from "./useAbsentPunishmentFilters";

const PfPolicyFilters = ({ form }) => {
  const {
    workplaceDDL,
  } = usePfPolicyFilters(form);
  return (
    <Row gutter={[10, 2]}>
      <Col md={5} sm={12} xs={24}>
        <PSelect
          options={workplaceDDL.data}
          name="workplace"
          label="Workplace"
          placeholder="Select Workplace"
          onChange={(_, op) => {
            form.setFieldsValue({ workplace: op });
          }}
          loading={workplaceDDL.loading}
          rules={[{ required: true, message: "Workplace Is Required" }]}
        />
      </Col>
      <Col md={5} sm={12} xs={24}>
        <PSelect
          options={[
            {
              value: 1,
              label: "Active",
            },
            {
              value: 2,
              label: "Inactive",
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

export default PfPolicyFilters;
