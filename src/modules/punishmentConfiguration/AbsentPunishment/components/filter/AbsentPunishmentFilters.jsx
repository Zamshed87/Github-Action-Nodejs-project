import { Row, Col } from "antd";
import { PButton, PSelect } from "Components";
import usePfPolicyFilters from "./useAbsentPunishmentFilters";

const PfPolicyFilters = ({form}) => {
  const { workplaceGroupDDL, workplaceDDL, employmentTypeDDL, getWorkplaceDDL, getEmploymentTypeDDL } =
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
          rules={[{ required: true, message: "Workplace Group Is Required" }]}
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
            getEmploymentTypeDDL();
          }}
          loading={workplaceDDL.loading}
          rules={[{ required: true, message: "Workplace Is Required" }]}
        />
      </Col>
      <Col md={5} sm={12} xs={24}>
        <PSelect
          options={employmentTypeDDL.data}
          name="employmentType"
          label="Employment Type"
          placeholder="Select Employment Type"
          onChange={(_, op) => {
            form.setFieldsValue({ employmentType: op });
          }}
          loading={employmentTypeDDL.loading}
          rules={[{ required: true, message: "Employment Type Is Required" }]}
        />
      </Col>

      <Col style={{ marginTop: "23px" }}>
        <PButton type="primary" action="submit" content="View" />
      </Col>
    </Row>
  );
};

export default PfPolicyFilters;
