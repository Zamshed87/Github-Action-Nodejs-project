import { Row, Col } from "antd";
import { PButton, PSelect } from "Components";
import usePfPolicyFilters from "./useTdsChallanFilters";

const TdsChallanFilters = ({form}) => {
  const { workplaceGroupDDL, workplaceDDL, getWorkplaceDDL } =
    usePfPolicyFilters(form);
  return (
    <Row gutter={[10, 2]}>
      <Col md={5} sm={12} xs={24}>
        <PSelect
          options={workplaceGroupDDL.data}
          name="workplaceGroup"
          label="Workplace Group"
          placeholder="Select Workplace Group"
          onChange={(_, op) => {
            form.setFieldsValue({ workplaceGroup: op });
            getWorkplaceDDL();
          }}
          loading={workplaceGroupDDL.loading}
          // rules={[{ required: true, message: "Workplace Group Is Required" }]}
        />
      </Col>
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
          // rules={[{ required: true, message: "Workplace Is Required" }]}
        />
      </Col>
      {/* <Col md={5} sm={12} xs={24}>
        <PSelect
          options={[
            {
              value: 0,
              label: "All",
            },
            {
              value: "Active",
              label: "Active",
            },
            {
              value: "Inactive",
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
      </Col> */}
      <Col style={{ marginTop: "23px" }}>
        <PButton type="primary" action="submit" content="View" />
      </Col>
    </Row>
  );
};

export default TdsChallanFilters;
