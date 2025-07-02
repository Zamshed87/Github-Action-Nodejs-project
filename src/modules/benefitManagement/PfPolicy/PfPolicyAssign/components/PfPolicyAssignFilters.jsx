import { Col, Row } from "antd";
import { PButton, PInput, PSelect } from "Components";
import usePfPolicyAssignFilters from "./usePfPolicyAssignFilters";

const PfPolicyAssignFilters = ({ form }) => {
  const {
    employmentTypeDDL,
    getEmploymentTypeDDL,
    employeeDDL,
    getEmployeeDDL,
  } = usePfPolicyAssignFilters({ form });
  return (
    <Row gutter={[10, 2]}>
      <Col md={5} sm={12} xs={24}>
        <PSelect
          showSearch
          onSearch={(value) => {
            getEmployeeDDL(value);
          }}
          options={employeeDDL?.data || []}
          name="employee"
          label="Employee"
          placeholder="Search Employee"
          loading={employeeDDL.loading}
          // rules={[{ required: true, message: "Employee Is Required" }]}
        />
      </Col>
      <Col md={4} sm={12} xs={24}>
        <PSelect
          options={employmentTypeDDL?.data || []}
          name="employmentType"
          loading={employmentTypeDDL.loading}
          label="Employment Type"
          placeholder="Select Employment Type"
          onChange={(_, op) => {
            form.setFieldsValue({ employmentType: op });
          }}
          // rules={[{ required: true, message: "Employment Type is required" }]}
        />
      </Col>
      <Col md={4} sm={24}>
        <PInput
          type="number"
          min={0}
          name="month"
          placeholder="Select Month"
          label="Service Length Start (Month)"
          onChange={(value) => {}}
          // rules={[{ required: true, message: "Start Month Is Required" }]}
        />
      </Col>
      <Col md={4} sm={24}>
        <PInput
          type="number"
          min={0}
          name="month"
          placeholder="Select Month"
          label="Service Length End (Month)"
          onChange={(value) => {}}
          // rules={[{ required: true, message: "End Month Is Required" }]}
        />
      </Col>
      <Col style={{ marginTop: "23px" }}>
        <PButton type="primary" action="submit" content="View" />
      </Col>
    </Row>
  );
};

export default PfPolicyAssignFilters;
